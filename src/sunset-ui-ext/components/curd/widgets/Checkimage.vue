<style lang="sass">
    .sunset-upload-attachments {}
</style>
<template>
    <div class="sunset-field">
        <i-button style="vertical-align: top;" type="success" :size="options.size||size" icon="ios-home" @click="openImageStore">从设备获取</i-button>
        <sunset-file :options="uploadImageOptions" :queue="images" @start-upload="startUpload" @single-success="uploadImageSuccess"
            @finish="finishUpload"></sunset-file>
        <div class="sunset-upload-attachments">
            <checkimage-card v-for="attachment in images" :data="attachment" :options="options" removeable renameable @change="refreshValue" @remove="removeAttachment(attachment)"></checkimage-card>
        </div>
        <sunset-table-modal v-ref:imagestoremodal :options="imageStoreOptions" @submit="selectedImage"></sunset-table-modal>
    </div>
</template>
<script>
    import CheckimageCard from './CheckimageCard.vue';

    var uid = 0;

    export default {
        components: {
            CheckimageCard
        },
        props: {
            options: {
                type: Object
            },
            model: {},
            value: {}
        },
        data() {
            return {
                id: `sunset-widget-checkimage-uploader-${++uid}`,
                images: [],
                uploadImageOptions: {
                    label: '图片上传',
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
                pending: false,
                uploading: false,
                percent: 0,
                selected: null,
                imageStoreOptions: {
                    title: '选择眼科图像',
                    width: 800,
                    checked: {
                        multi: false
                    },
                    tableOptions: {
                        columns: [{
                            title: '影像号',
                            name: 'studyNo'
                        }, {
                            title: '患者编号',
                            name: 'patientNo'
                        }, {
                            title: '患者姓名',
                            name: 'patientName'
                        }, {
                            title: '设备类型',
                            name: 'deviceType'
                        }, {
                            title: '性别',
                            name: 'patientSex',
                            align: 'center',
                            format(v) {
                                var t = Sunset.Service.Dictionary.transcode('SEX', v);
                                return t != v ? t : '-';
                            }
                        }, {
                            title: '年龄',
                            name: 'patientAge',
                            align: 'center',
                            format(v) {
                                return v > 0 ? v : '-';
                            }
                        }, {
                            title: '检查日期',
                            name: 'studyDate',
                            format: 'DATETIME'
                        }],
                        showIndex: true,
                        pageSize: 10,
                        localPage: false,
                        multiCheck: false,
                        sortable: true,
                        pageNumberStart: 0,
                        lazy: true,
                        format: {
                            list: 'data',
                            count: 'count',
                            pageSize: 'pageSize',
                            currentPage: 'pageNumber'
                        },
                        //表格工具栏
                        toolbar: [],
                        //表格搜索
                        filter: {
                            align: 'left',
                            fields: [{
                                name: 'date',
                                widget: 'date',
                                type: 'daterange',
                                placeholder: '检查日期',
                                changeFilter: true,
                                style: 'width:200px;'
                            }, {
                                name: 'keyword',
                                widget: 'search',
                                placeholder: '影像号/患者编号/患者姓名',
                                //本地搜索
                                localFilter: function (record, v) {
                                    return ~record.account.indexOf(v);
                                }
                            }],
                            format: function (filter) {
                                var f = {
                                    keyword: filter.keyword,
                                    startDate: void 0,
                                    endDate: void 0
                                };
                                if (filter.date && filter.date[0] && filter.date[1]) {
                                    f.startDate = filter.date[0].getTime();
                                    f.endDate = filter.date[1].getTime();
                                }
                                return f;
                            },
                            searchButton: ''
                        },
                        //数据条目操作
                        recordTools: [{
                            label: '修改',
                            icon: 'glyphicon glyphicon-edit',
                            color: 'warning',
                            permission: 'SYSTEM_MANAGER_DICTIONARY_UPDATE',
                            signal: 'MODIFY'
                        }, {
                            label: '删除',
                            icon: 'glyphicon glyphicon-remove',
                            color: 'error',
                            permission: 'SYSTEM_MANAGER_DICTIONARY_DELETE',
                            signal: 'DELETE'
                        }],
                        datasource: (filter) => {
                            filter.opcId = GlobalService.getCurrentUserSync().relation.hospital[0].id;
                            return $http({
                                url: '/image-service/imageInfo/searchList',
                                type: 'POST',
                                data: filter
                            });
                        }
                    }
                }
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
                GlobalService.uploadingStatus[this.id] = true;
            },
            finishUpload() {
                delete GlobalService.uploadingStatus[this.id];
            },
            openImageStore() {
                this.$refs.imagestoremodal.open();
            },
            selectedImage(studies) {
                var firstInfo = studies[0];
                if (firstInfo) {
                    if (!this.model.checkDate) {
                        this.model.checkDate = firstInfo.studyDate;
                    }
                    if (!this.model.checkLabel) {
                        this.model.checkLabel = firstInfo.deviceType;
                    }
                }
                studies.forEach(s => {
                    if (s.dfsKeyId) {
                        var imageInfos = {};
                        try {
                            var imageInfosList = JSON.parse(s.imageInfos);
                            imageInfosList.forEach(item => {
                                imageInfos[item.imageKey] = item;
                            });
                        } catch (e) {
                            imageInfos = {};
                        }
                        s.dfsKeyId.split('/').forEach((imageId, index) => {
                            var info = imageInfos[imageId];
                            this.images.push({
                                result: {
                                    md5: imageId,
                                    fileName: info && info.direction || ''
                                },
                                type: 'image'
                            });
                        });
                    }
                });
                this.$refs.imagestoremodal.cancel();
                this.refreshValue();
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
            refreshValue() {
                this.pending = true;
                if (this.images.length) {
                    this.value = JSON.stringify(this.images.map(item => {
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
                var list = this.images;
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
                        while (this.images.pop()) {}
                        if (value) {
                            var values = JSON.parse(value);
                            if (Sunset.isArray(values)) {
                                values.forEach(item => {
                                    this.images.push(item);
                                });
                            }
                        }
                    } catch (e) {
                        while (this.images.pop()) {}
                        console.error(e);
                    } finally {
                        this.pending = false;
                    }
                }
            }
        }
    }
</script>