<style lang="sass">
    .camera-container {
        display: inline-block;
        vertical-align: top;
        .ivu-modal-header {
            padding: 5px 10px;
            .ivu-modal-close {
                top: 0px;
            }
        }
        .ivu-modal-body {
            position: relative;
            padding: 0px;
            text-align: center;
            .camera-region {
                width: 100%;
                overflow: hidden;
            }
            &:before {
                content: '请稍后...';
                position: absolute;
                top: 100px;
                font-size: 28px;
                color: #AAA;
                z-index: 1;
                margin-left: -50px;
                left: 50%;
            }
            video {
                position: relative;
                z-index: 2;
            }
        }
        .ivu-modal-footer {
            padding: 5px 10px;
        }
    }
</style>
<template>
    <div class="sunset-field camera-container">
        <div @click="openCamera" style="display:inline-block;vertical-align:top;margin-bottom:5px;">
            <i-button style="vertical-align: top;height:27px;line-height:12px" :type="options.color||'info'" icon="ios-camera">{{options.text||'拍照'}}</i-button>
        </div>
        <div class="sunset-upload-attachments">
            <checkimage-card v-for="attachment in pictures" :data="attachment" :options="options" removeable renameable @change="refreshValue"
                @remove="removeAttachment(attachment)"></checkimage-card>
        </div>
        <sunset-view-modal v-ref:cameramodal :options="modalOptions">
            <div class="camera-region" :style="{height : height+'px'}">
                <video class="gpy-video" width="100%"></video>
            </div>
            <video class="gpy-video2" style="position:absolute;z-index:-1;"></video>
            <canvas style="display:none;" class="gpy-canvas"></canvas>
        </sunset-view-modal>
    </div>
</template>
<script>
    import CheckimageCard from './CheckimageCard.vue';

    export default {
        components: {
            CheckimageCard
        },
        props: {
            options: {
                type: Object
            },
            value: {}
        },
        data() {
            return {
                pictures: [],
                pending: false,
                uploading1: false,
                uploading2: false,
                percent: 0,
                videos: [],
                selected: null
            };
        },
        computed: {
            width() {
                return this.options.width || 700;
            },
            height() {
                if (Sunset.isString(this.options.ratio)) {
                    var width = this.width;
                    var ratio = this.options.ratio.split(':');
                    if (ratio.length == 2 && !isNaN(ratio[0]) && !isNaN(ratio[1])) {
                        return width / (+ratio[0]) * (+ratio[1]);
                    }
                }
                return null;
            },
            modalOptions() {
                var ops = {};
                ops.title = this.options.title||this.options.label;
                ops.width = this.width;
                var tools = this.options.toolbar;
                if (!Sunset.isArray(tools)) {
                    tools = this.options.toolbar.tools;
                }
                if (Sunset.isArray(tools)) {
                    tools.forEach(tool => {
                        if (!Sunset.isFunction(tool.operate)) {
                            tool.operate = () => {
                                if (this.ctx) {
                                    this.cvs.width = this.video2.clientWidth;
                                    this.cvs.height = this.video2.clientHeight;
                                    if (Sunset.isString(this.options.ratio)) {
                                        var width = this.cvs.width;
                                        var ratio = this.options.ratio.split(':');
                                        if (ratio.length == 2 && !isNaN(ratio[0]) && !isNaN(ratio[1])) {
                                            this.cvs.height = width / (+ratio[0]) * (+ratio[1]);
                                        }
                                    }
                                    this.ctx.drawImage(this.video2, 0, 0, this.cvs.width, this.cvs.height,
                                        0, 0, this.cvs.width, this.cvs.height);
                                    var images = this.cvs.toDataURL('image/png');
                                    if (this.working && images) {
                                        this.savePicture(images, tool.data);
                                    } else {
                                        this.$refs.gpymodal.cancel();
                                    }
                                }
                            }
                        }
                    })
                }
                ops.toolbar = this.options.toolbar;
                return ops;
            },
            attachments() {
                return this.pictures.concat(this.images).concat(this.documents);
            },
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
            savePicture(base64, fileName) {
                $.ajax({
                    url: '/upload/api/1.0.0/file/storage_base64',
                    type: 'POST',
                    data: {
                        base64File: base64
                    }
                }).then(res => {
                    this.pictures.push({
                        result: {
                            md5: res,
                            fileName: fileName || '未命名'
                        },
                        type: 'picture'
                    });
                    this.refreshValue();
                    Sunset.tip('拍照成功', 'success');
                    if (this.options.closeAfterSave) {
                        this.close();
                    }
                });
            },
            refreshValue() {
                this.pending = true;
                if (this.pictures.length) {
                    this.value = JSON.stringify(this.pictures.map(item => {
                        return {
                            result: item.result,
                            type: item.type
                        };
                    }));
                } else {
                    this.value = '';
                }
                this.$nextTick(() => {
                    this.pending = false;
                });
            },
            removeAttachment(s) {
                this.pictures.splice(this.pictures.indexOf(s), 1);
                this.refreshValue();
            },
            openCamera() {
                var self = this;
                var video = this.video = $('.gpy-video', this.$el)[0],
                    video2 = this.video2 = $('.gpy-video2', this.$el)[0],
                    cvs = this.cvs = $('.gpy-canvas', this.$el)[0],
                    ctx = this.ctx = cvs.getContext('2d');
                $(video2).parent().css('overflow', 'hidden');
                navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia ||
                    navigator.msGetUserMedia;
                window.URL = window.URL || window.webkitURL || window.mozURL || window.msURL;
                var localMediaStream;
                navigator.getUserMedia({
                    video: {
                        optional: this.videoOptional || [{
                                minWidth: 1500
                            }
                            // // , {
                            // //     // minHeigth: 2736
                            // // }
                        ]
                    }
                }, function (stream) {
                    video.src = video2.src = window.URL.createObjectURL(stream);
                    localMediaStream = stream;
                    video.play();
                    self.$refs.cameramodal.open();
                    self.working = true;
                }, function (err) {
                    alert('您的浏览器不支持此功能');
                    self.working = false;
                });
            },
            close() {
                this.$refs.cameramodal.cancel();
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
                        while (this.pictures.pop()) {}
                        if (value) {
                            var values = JSON.parse(value);
                            if (Sunset.isArray(values)) {
                                values.forEach(item => {
                                    this[`${item.type}s`].push(item);
                                });
                            }
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