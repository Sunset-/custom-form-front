<style lang="sass">
    .video-list {
        display: block;
        >div {
            float: left;
            display: inline-block;
            margin-top: 20px;
        }

        .ivu-progress-show-info .ivu-progress-outer {
            padding: 0;
            margin-top: -10px;
        }

        .video-progress {
            margin-top: -20px;
            height: 19px;
            width: 120px;
        }
    }
</style>
<template>
    <div class="sunset-field">
        <!-- <i-button style="vertical-align: top;" type="success" :size="options.size||size" icon="ios-home">视频检查库</i-button> -->
        <div class="sunset-file-wrap">
            <sunset-file :options="uploadOptions" :queue="videos" @start-upload="startUpload" @single-success="uploadSingleSuccess" @finish="finishUpload"
                @progress="progress"></sunset-file>
        </div>
        <div class="sunset-upload-videos">
            <video-card v-for="item in videos" :data="item" @remove="removeVideo(item)" removeable></video-card>
        </div>
    </div>
</template>
<script>
    import VideoCard from './VideoCard.vue';

    var uid = 0;

    export default {
        components: {
            VideoCard
        },
        props: {
            options: {
                type: Object
            },
            value: {}
        },
        data() {
            return {
                id: `sunset-widget-video-uploader-${++uid}`,
                uploadOptions: {
                    label: '文件选择',
                    icon: 'ios-cloud-upload',
                    max: this.options.multi === true ? 999 : 1,
                    color: 'info',
                    type: 'file',
                    url: '/upload/api/1.0.0//file/storage_video',
                    className: 'my-uploader-trigger',
                    // formData(record) {
                    //     return {
                    //         sunset: record.name
                    //     }
                    // },
                    filter(f) {
                        var suffix = f.name.substring(f.name.lastIndexOf('.') + 1).toLowerCase();
                        var allowTypes = {
                            avi: true,
                            mp4: true,
                            flv: true,
                            rmvb: true,
                            rm: true,
                            wmv: true,
                            wma: true,
                            '3gp': true,
                            mkv: true,
                            mov: true,
                            asf: true,
                            f4v: true,
                            swf: true,
                            vob: true,
                            mpg: true,
                            mpeg: true
                        };
                        if (!allowTypes[suffix]) {
                            Sunset.tip('请选择视频上传');
                            return false;
                        } else {
                            if (f.size >= 1024 * 1024 * 300) {
                                Sunset.tip('文件过大，请上传小于300m的文件');
                                return false;
                            }
                            return true;
                        }
                    },
                    progress(v) {
                        console.log(v)
                    }
                },
                pending: false,
                uploading: false,
                percent: 0,
                videos: [],
                selected: null
            };
        },
        computed: {
            max() {
                return this.options.max || 1;
            },
            color() {
                switch (this.percent) {
                    case 0:
                        return '#ABABAB';
                        break;
                    case 100:
                        return '#5cb85c';
                        break;
                    default:
                        return '#2db7f5';
                }
            }
        },
        methods: {
            startUpload() {
                this.uploading = true;
                GlobalService.uploadingStatus[this.id] = true;
            },
            finishUpload() {
                this.uploading = false;
            },
            uploadSingleSuccess(data) {
                data.result && this.pollAnalysisResult(data);
            },
            /**
             * 轮询解析结果
             */
            pollAnalysisResult: function (task, time) {
                var self = this,
                    time = time || 0;
                setTimeout(() => {
                    $.ajax({
                        url: '/upload/api/1.0.0/file/acquisition_video_key',
                        type: 'GET',
                        data: {
                            key: task.result
                        }
                    }).then((res) => {
                        if (res && res.status == 'success') {
                            if (!this.uploading) {
                                delete GlobalService.uploadingStatus[this.id];
                            }
                            this.mergeVideoInfo(task, res);
                        } else if (res && res.status == 'error') {
                            this.videos.splice(this.videos.findIndex(item => item.file == task.file),
                                1);
                        } else {
                            this.pollAnalysisResult(task, 2000);
                        }
                    });
                }, time);
            },
            mergeVideoInfo(task, res) {
                var videos = this.videos;
                var video = videos.find(item => item.file == task.file);
                if (video) {
                    video.videoId = res.videoMd5;
                    video.thumbnail = res.imageMd5;
                    this.refreshValue();
                }
            },
            refreshValue() {
                this.pending = true;
                if (this.videos.length) {
                    this.value = JSON.stringify(this.videos.map(item => ({
                        videoId: item.videoId,
                        thumbnail: item.thumbnail
                    })));
                } else {
                    this.value = '';
                }
                this.$nextTick(() => {
                    this.pending = false;
                });
            },
            removeVideo(s) {
                this.videos.splice(this.videos.indexOf(s), 1);
                this.refreshValue();
            },
            progress(p) {
                this.percent = parseInt(p * 100);
            }
        },
        events: {
            REFRESH_WIDGET_VALUE() {
                this.$refs.uploader.init();
            }
        },
        watch: {
            value(value) {
                if (!this.pending) {
                    try {
                        var videos = this.videos;
                        if (value) {
                            var values = JSON.parse(value);
                            if (Sunset.isArray(values)) {
                                values.forEach(item => {
                                    videos.push(item);
                                });
                            } else {
                                videos.push(values);
                            }
                        } else {
                            while (videos.pop()) {}
                        }
                    } catch (e) {
                        while (this.videos.pop()) {}
                        console.error(e);
                    } finally {
                        this.pending = false;
                    }
                }
            }
        }
    }
</script>