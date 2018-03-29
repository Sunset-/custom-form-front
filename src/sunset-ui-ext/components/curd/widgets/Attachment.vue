<style lang="sass">
    .sunset-upload-attachments {
        .attachment-btn{
            width:120px;
            height:50px;
            border:1px dashed #e1e1e1;
            background:#efefef;
            color:#767676;
            cursor : pointer;
            text-align:center;
            border-radius:2px;
            margin-right:5px;
            &>div{
                padding-top:0px;
            }
            &:hover{
                background:#e3e3e3;
            }
        }
    }
</style>
<template>
    <div class="sunset-field sunset-upload-attachments ">
        <gpy v-if="allowCamera" v-ref:gpy @submit="savePicture">
            <div class="attachment-btn">
                <div>
                    <Icon type="camera" style="font-size:24px;position:relative;top:3px;"></Icon>
                    <span>高拍仪拍照</span>
                </div>
            </div>
        </gpy>
        <sunset-file v-if="allowImage" :options="uploadImageOptions" :queue="images" @start-upload="startUpload1" @finish="finishUpload1"
            @single-success="uploadImageSuccess">
            <div class="attachment-btn">
                <div>
                    <Icon type="android-upload" style="font-size:24px;position:relative;top:3px;"></Icon>
                    <span>图片上传</span>
                </div>
                <p>支持所有格式</p>
            </div>
            </sunset-file>
        <sunset-file v-if="allowDocument" :options="uploadDocumentOptions" :queue="documents" @start-upload="startUpload2" @finish="finishUpload2"
            @single-success="uploadDocumentSuccess">
            <div class="attachment-btn" style="width:150px;">
                <div>
                    <Icon type="document-text" style="font-size:24px;position:relative;top:3px;"></Icon>
                    <span>文档上传</span>
                </div>
                <p>支持Word/Excel/PPT/PDF</p>
            </div>
            </sunset-file>
        <sunset-toolbar v-if="options.toolbar" :options="options.toolbar" :ctx="model"></sunset-toolbar>
        <div class="sunset-upload-attachments">
            <attachmentfile-card v-for="attachment in pictures" :data="attachment" :options="options" removeable renameable @change="refreshValue" @remove="removeAttachment(attachment)"></attachmentfile-card>
            <attachmentfile-card v-for="attachment in images" :data="attachment" :options="options" removeable renameable @change="refreshValue" @remove="removeAttachment(attachment)"></attachmentfile-card>
            <attachmentfile-card v-for="attachment in documents" :data="attachment" :options="options" removeable renameable @change="refreshValue" @remove="removeAttachment(attachment)"></attachmentfile-card>
        </div>
    </div>
</template>
<script>
    import AttachmentfileCard from './AttachmentfileCard.vue';
    import Gpy from './Gpy.vue';

    var uid = 0;

    export default {
        components: {
            AttachmentfileCard,
            Gpy
        },
        props: {
            options: {
                type: Object
            },
            value: {},
            model: {

            }
        },
        data() {
            return {
                id1: `sunset-widget-attachpicture-uploader-${++uid}`,
                id2: `sunset-widget-attachdocument-uploader-${++uid}`,
                pictures: [],
                images: [],
                documents: [],
                uploadImageOptions: {
                    label: this.options.uploadImageLabel||'图片上传',
                    size: this.options.uploadImageLabel&&'small',
                    icon: 'ios-cloud-upload',
                    max: 999,
                    color: 'info',
                    type: 'file',
                    url: '/upload/api/1.0.0/file/storage',
                    className: 'my-uploader-trigger',
                    attachData: {
                        type: 'image'
                    },
                    filter(f) {
                        if (!(~f.type.indexOf('image'))) {
                            Sunset.tip('请选择图片上传');
                            return false;
                        } else {
                            return true;
                        }
                    },
                    thumbnail(v) {
                        return v && Base.transformNfsFilePath(v);
                    },
                    progress(v) {
                        console.log(v)
                    }
                },
                uploadDocumentOptions: {
                    label: '文档上传',
                    icon: 'ios-paper',
                    max: 999,
                    color: 'primary',
                    type: 'file',
                    url: '/upload/api/1.0.0/file/document/storage',
                    className: 'my-uploader-trigger',
                    attachData: {
                        type: 'document'
                    },
                    // formData(record) {
                    //     return {
                    //         sunset: record.name
                    //     }
                    // },
                    progress(v) {
                        console.log(v)
                    }
                },
                pending: false,
                uploading1: false,
                uploading2: false,
                percent: 0,
                videos: [],
                selected: null
            };
        },
        computed: {
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
            },
            allowCamera() {
                return this.options.camera !== false;
            },
            allowImage() {
                return this.options.image !== false;
            },
            allowDocument() {
                return this.options.document !== false;
            }
        },
        methods: {
            startUpload1() {
                this.uploading1 = true;
                GlobalService.uploadingStatus[this.id1] = true;
            },
            startUpload2() {
                this.uploading2 = true;
                GlobalService.uploadingStatus[this.id2] = true;
            },
            finishUpload1() {
                this.uploading1 = false;
                delete GlobalService.uploadingStatus[this.id1];
            },
            finishUpload2() {
                this.uploading2 = false;
            },
            tryToFinishUpload2(){
                var finish = true;
                this.documents&&this.documents.forEach(item=>{
                    if(!item.result||!item.result.md5){
                        finish = false;
                    }
                });
                if(finish){
                    delete GlobalService.uploadingStatus[this.id2];
                }
            },
            savePicture(base64) {
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
                            fileName: '未命名'
                        },
                        type: 'picture'
                    });
                    this.refreshValue();
                    this.$refs.gpy.close();
                });
            },
            uploadImageSuccess(data) {
                var image = this.images.find(item => item.file == data.file);
                if (image) {
                    image.result = {
                        md5: image.result,
                        fileName: image.name
                    };
                }
                this.refreshValue();
            },
            uploadDocumentSuccess(data) {
                var document = this.documents.find(item => item.file == data.file);
                var result = JSON.parse(data.result);
                if(!result.md5){
                    Sunset.tip(result.message||'上传失败','warning');
                    this.documents.splice(this.documents.indexOf(document),1);
                    this.tryToFinishUpload2();
                    return;
                }
                if (document) {
                    result.fileName = data.file.name;
                    document.result = result;
                }
                data.md5 = result.md5;
                data.targetType = result.targetType;
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
                        url: '/document-service/convert/result',
                        type: 'GET',
                        data: {
                            md5: task.md5,
                            targetType: task.targetType
                        }
                    }).then((res) => {
                        if (res && res.status == 'ok') {
                            if (!this.uploading2) {
                                this.tryToFinishUpload2();
                            }
                            this.mergeDocumentInfo(task, res);
                        } else if (res && (res.status == 'no' || res.status == 'convert_error' ||
                                res.status == 'nfs_error')) {
                            this.documents.splice(this.documents.findIndex(item => item.file ==
                                    task.file),
                                1);
                        } else {
                            this.pollAnalysisResult(task, 2000);
                        }
                    });
                }, time);
            },
            mergeDocumentInfo(data, res) {
                var document = this.documents.find(item => item.file == data.file);
                if (document) {
                    document.result.md5 = res.destMd5;
                    document.thumbnail = true;
                }
                this.refreshValue();
            },
            refreshValue() {
                this.pending = true;
                if (this.attachments.length) {
                    this.value = JSON.stringify(this.attachments.map(item => {
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
                var list = this[s.type + 's'];
                list.splice(list.indexOf(s), 1);
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
                        while (this.pictures.pop()) {}
                        while (this.images.pop()) {}
                        while (this.documents.pop()) {}
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