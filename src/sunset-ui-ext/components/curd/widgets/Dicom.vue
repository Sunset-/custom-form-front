<style lang="sass">
    .widget-upload-btn {
        position: relative;
        display: inline-block;
        width: 80px;
        height: 80px;
        line-height: 29px;
        padding: 0px;
        border: 2px solid #d7dde4;
        background: #FFF;
        color: #FFF;
        overflow: hidden;
        &:before {
            content: '';
            position: absolute;
            z-index: 0;
            left: 10%;
            width: 80%;
            top: 50%;
            margin-top: -2px;
            height: 4px;
            background: #d7dde4;
            cursor: pointer;
        }
        &:after {
            content: '';
            position: absolute;
            z-index: 0;
            left: 50%;
            margin-left: -2px;
            top: 10%;
            height: 80%;
            width: 4px;
            background: #d7dde4;
            cursor: pointer;
        }
        .webuploader-element-invisible {
            display: none;
        }
    }

    .widget-upload-progress {
        display: inline-block;
        width: 80px;
        height: 80px;
    }

    .dicom-uploader-trigger {
        position: relative;
        &>.webuploader-pick {
            position: absolute;
            top: 0px;
            left: 0px;
            right: 0px;
            bottom: 0px;
        }
    }
</style>
<template>
    <div class="sunset-field">
        <i-button style="vertical-align: top;" type="success" :size="options.size||size" icon="ios-home" @click="openDicomStore">从设备获取</i-button>
        <div class="sunset-file-wrap">
            <div class="sunset-file-trigger">
                <i-button type="primary" :size="options.size||size" icon="android-folder">本地上传</i-button>
            </div>
            <div :id="id" class="sunset-file-pick"></div>
        </div>
        <!-- <div v-show="!uploading" :id="id" class="widget-upload-btn"> -->
        <!-- </div> -->
        <dicom-uploader v-ref:uploader :id="id" :studies.sync="studies" @upload="startUpload" @progress="progress" @uploaded="uploaded"></dicom-uploader>
        <div>
            <!-- dicom检查缩略图 -->
            <Radio-group v-if="options.multi===false" :model.sync="selected" @on-change="refreshValue">
                <Radio :value="s.listId" v-for="s in studies">
                    <dicom-card :data="s" @remove="removeStudy" viewable removeable></dicom-card>
                </Radio>
            </Radio-group>
            <div v-if="options.multi!==false">
                <dicom-card v-for="s in studies" :data="s" @remove="removeStudy" viewable removeable></dicom-card>
            </div>
            <!-- 上传进度 -->
            <div v-show="uploading" class="widget-upload-progress">
                <div class="progress-circle">
                    <Circle :percent="percent" :size="80" :stroke-color="color">
                        <Icon v-if="percent == 100" type="ios-checkmark-empty" size="60" style="color:#5cb85c"></Icon>
                        <span v-else style="font-size:24px">{{ percent }}%</span>
                    </Circle>
                </div>
            </div>
        </div>
        <sunset-table-modal v-ref:dicomstoremodal :options="dicomStoreOptions" @submit="selectedDicom"></sunset-table-modal>
    </div>
</template>
<script>
    import DicomUploader from '../../dicomUploader/DicomUploader.vue';
    import DicomCard from './DicomCard';

    var uid = 0;

    export default {
        components: {
            DicomUploader,
            DicomCard
        },
        props: {
            options: {
                type: Object
            },
            value: {}
        },
        data() {
            return {
                id: `sunset-widget-dicom-uploader-${++uid}`,
                pending: false,
                uploading: false,
                percent: 0,
                studies: [],
                selected: null,
                dicomStoreOptions: {
                    title: '选择检查图片',
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
                            enum: 'SEX'
                        }, {
                            title: '年龄',
                            name: 'patientAge'
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
                                name: 'deviceType',
                                widget: 'select',
                                // enum: 'DICOM_DEVICE_TYPE',
                                placeholder: '设备类型',
                                changeFilter: true,
                                style: 'width:80px;',
                                valuePlace: 'key',
                                textPlace: 'value',
                                data: () => {
                                    return [{
                                        key: 'ALL',
                                        value: '全部'
                                    }].concat(Sunset.Service.Dictionary.getEnums('DICOM_DEVICE_TYPE'));
                                }
                                // premise() {
                                //     return false;
                                // }
                            }, {
                                name: 'keyword',
                                widget: 'search',
                                placeholder: '影像号/患者编号/患者姓名'
                            }],
                            format: function (filter) {
                                var f = {
                                    keyword: filter.keyword,
                                    deviceType: filter.deviceType,
                                    startDate: void 0,
                                    endDate: void 0
                                };
                                if (filter.date && filter.date[0] && filter.date[1]) {
                                    f.startDate = filter.date[0].getTime();
                                    f.endDate = filter.date[1].getTime();
                                }
                                if (f.deviceType == 'ALL') {
                                    delete f.deviceType;
                                }
                                return f;
                            },
                            searchButton: {
                                color: 'success',
                                label: '自动采集'
                            }
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
                                url: '/dicom-service/dcmInfo/searchList',
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
            openDicomStore() {
                this.$refs.dicomstoremodal.open();
            },
            selectedDicom(studies) {
                studies.forEach(s => {
                    if (this.studies.findIndex(item => item.listId == s.listId) == -1) {
                        this.studies.push(s);
                    }
                });
                this.selected = studies[0].listId;
                this.$refs.dicomstoremodal.cancel();
                this.refreshValue();
            },
            refreshValue() {
                this.pending = true;
                if (this.studies.length) {
                    if (this.options.multi !== false) {
                        this.value = JSON.stringify(this.studies);
                    } else {
                        var selectedStudy = this.studies.find(item => item.listId == this.selected);
                        if (!selectedStudy) {
                            selectedStudy = this.studies[0];
                            this.selected = this.studies[0].listId;
                        }
                        this.value = JSON.stringify(selectedStudy);
                    }
                } else {
                    this.value = null;
                }
                this.$nextTick(() => {
                    this.pending = false;
                });
            },
            removeStudy(s) {
                this.studies.splice(this.studies.indexOf(s), 1);
                this.refreshValue();
            },
            startUpload() {
                this.percent = 0;
                this.uploading = true;
            },
            progress(p) {
                this.percent = parseInt(p * 100);
            },
            uploaded() {
                this.uploading = false;
                this.refreshValue();
                this.$nextTick(() => {
                    this.percent = 0;
                });
            }
        },
        events: {
            REFRESH_WIDGET_VALUE() {
                this.$refs.uploader.init();
            },
            SUNSET_UPLOAD_SUCCESS() {
                this.refreshValue();
            },
            SUNSET_IMAGE_REMOVE(data) {
                var queue = this.queue;
                for (var i = 0, item; item = queue[i]; i++) {
                    if (item == data) {
                        this.queue.splice(i, 1);
                        break;
                    }
                }
                this.refreshValue();
            }
        },
        watch: {
            value(value) {
                if (!this.pending) {
                    try {
                        var studies = this.studies;
                        if (value) {
                            var values = JSON.parse(value);
                            if (Sunset.isArray(values)) {
                                this.selected = values[0].listId;
                                values.forEach(item => {
                                    studies.push(item);
                                });
                            } else {
                                this.selected = values.listId;
                                studies.push(values);
                            }
                        } else {
                            while (studies.pop()) {}
                        }
                    } catch (e) {
                        while (this.studies.pop()) {}
                        console.error(e);
                    } finally {
                        this.pending = false;
                    }
                }
            }
        }
    }
</script>