<style lang="sass">
    .dicom-select {
        position: relative;
        min-width: 800px;
        >div {
            vertical-align: middle;
            padding: 3px;
            min-width: 800px;
            display: inline;
            width: 100%;
        }
        .group {
            display: inline-block;

            &.big {
                .list {
                    min-width: 406px;
                    >div {}
                    .close {
                        position: absolute;
                        right: 50px;
                    }
                    img {
                        width: 300px;
                    }
                }
            }
        }
        .group-button {
            display: inline-block;
        }

        .list {
            min-width: 190px;
            height: 240px;
            background: #eeeeee;
            border: 1px solid #ccc;
            overflow-y: scroll;
            border-radius: 5px;
            >div {
                // min-height:100px;
                position: relative;
                text-align: center;
                padding: 4px;
            }
        }
        img {
            width: 100px;
            vertical-align: middle;
            border-radius: 3px;
        }

        .close {
            position: absolute;
            right: 25px;
            color: red;
            z-index: 9;
        }
        .delete-image {
            img {
                opacity: 0.5;
            }
        }
        .goback {
            position: absolute;
            right: 0px;
            top: -15px;
        }
        & .ivu-modal-body{
            padding:0 16px 16px 16px;
            .take_picture_list{
                overflow:hidden;
                .other_box{
                    float:left;
                    width:720px;
                    &>p{
                        height:30px;
                        line-height:30px;
                        font-size: 14px;
                        color:#666;
                    }
                    .other_picture{
                        padding:7px;
                        height:162px;
                        border:1px solid #ccc;
                        overflow-y:auto;
                        & .picture{
                            float:left;
                            margin: 5px;
                            width: 100px;
                            height: 138px;
                            overflow: hidden;
                            position: relative;
                            border:1px solid #ccc;
                            &>div{
                                position:absolute;
                                right:1px;
                                top:1px;
                                background:#fff;
                                color:#666;
                                width: 35px;
                                text-align: center;
                                font-size: 12px;
                            }
                            &>img{
                                width:auto;
                                height:100px;
                                transform: translate(-50%);
                                margin-left: 50px;
                            }
                            .active_checkbox{
                                background:#3399ff;
                                color:#fff;
                            }
                            &>div.righteye{
                                left:1px;
                                top:1px;
                            }
                        }
                        .active{
                            border:1px solid #3399ff;
                        }
                    }
                }
            }
        }
    }
</style>

<template>
    <div class="sunset-field dicom-select">
        <div style="display:block;">
            <i-button style="vertical-align: top;" type="success" :size="options.size||size" icon="ios-home" @click="openImageStore">查找图片</i-button>
            <i-button style="vertical-align: top;" type="success" :size="options.size||size" icon="ios-home" @click="takePicture">立即拍摄</i-button>
        </div>
        <div>
            <div class="group" :class="{'big':midImageLarge&&key==='OU'}" v-for="(key,item) in enum">
                <div>
                    <sunset-file :options="uploadFile" :ctx="key" @single-success="queue" @progress="progress" style="float:right; ">
                        <i-button type="text" style="marign-top:-10px;color:blue">添加</i-button>
                    </sunset-file>
                    <strong>{{item}}</strong>
                </div>
                <div class="list">
                    <div v-for="(index,f) in widgetValue[key]" track-by="$index" :class="{'delete-image': f.status==='delete'}">
                        <i-button type="text" @click="recoverImage(f,index,key)" v-if="f.status==='delete'" class="close">恢复</i-button>
                        <i-button type="text" @click="deleteImage(f,index,key)" v-if="f.status!=='delete'" class="close"><i class="ivu-icon ivu-icon-close" style="font-size:18px"></i></i-button>
                        <i-button type="text" @click="handler(f,index,key,'left')" size="small"><i class="ivu-icon ivu-icon-arrow-left-a" style="font-size:18px"></i></i-button>
                        <img class='viewer-image' :group="id+key" :src="f.value| upload-image" v-default-img>
                        <i-button type="text" @click="handler(f,index,key,'right')" size="small"><i class="ivu-icon ivu-icon-arrow-right-a" style="font-size:18px"></i></i-button>
                    </div>
                </div>
            </div>
        </div>
        <!--查找图片  -->
        <sunset-table-modal v-ref:imagestoremodal :options="imageStoreOptions" @submit="selectedImage"></sunset-table-modal>
        <!--立即拍摄  -->
        <sunset-view-modal v-ref:tablemodal :options="modalOptions" @cancel="beforeDestroy">
            <div class="take_picture_list">
                 <div class="other_box">
                    <p>正在拍摄</p>
                    <div class="other_picture">
                        <div v-for='item in pictureList' track-by="$index" style="position:relative;" class="picture" :class="['viewer-image-pic',rightCheckedPictures.indexOf(item)>=0||leftCheckedPictures.indexOf(item)>=0?'active':'']">
                            <div @click="saveRight(item)" :class="['righteye',rightCheckedPictures.indexOf(item)>=0?'active_checkbox':'']" style="cursor:pointer;left:0;top:0;z-index:1">右眼</div><div :class="['lefteye',leftCheckedPictures.indexOf(item)>=0?'active_checkbox':'']" style="cursor:pointer;right:0;top:0;z-index:1" @click="saveLeft(item)">左眼</div>
                            <img v-if="item"  onerror="this.src='/assets/img/nopic.png'" group="attachment" :src="item.dfsKeyId | upload-image" />
                            <p style="text-align:center">{{item.crateTime | time}}</p>
                        </div>
                    </div>
                </div> 
                <div class="other_box latest_take">
                    <p>最近拍摄</p>
                    <div class="other_picture">
                        <div v-for='item in latestPictureList' track-by="$index" style="position:relative;" class="picture" :class="['viewer-image-pic',(rightCheckedPictures.indexOf(item)>=0||leftCheckedPictures.indexOf(item)>=0)?'active':'']">
                            <div @click="saveRight(item)" :class="['righteye',rightCheckedPictures.indexOf(item)>=0?'active_checkbox':'']" style="cursor:pointer;left:0;top:0;z-index:1">右眼</div><div :class="['lefteye',leftCheckedPictures.indexOf(item)>=0?'active_checkbox':'']" style="cursor:pointer;right:0;top:0;z-index:1" @click="saveLeft(item)">左眼</div>
                            <img v-if="item"  onerror="this.src='/assets/img/nopic.png'" group="attachment" :src="item.dfsKeyId | upload-image" />
                            <p style="text-align:center">{{item.inTime | time}}</p>
                        </div>
                    </div>
                </div>
            </div>
        </sunset-view-modal>
    </div>
</template>

<script>
	import SunsetWebsocket from '../../../../common/ws.js';
    var uid = 0;

    export default {
        components: {

        },
        props: {
            options: {
                type: Object
            },
            model: {},
            value: {

            }
        },
        data() {
            return {
                id: `sunset-widget-dicom-select-${++uid}-`,
                valueLock: false,
                wsTopic:'',
                widgetValueLock: false,
                latestPictureList:[],
                pictureList: [],
                rightCheckedPictures : [],
                leftCheckedPictures : [],
                widgetValue: {
                    OS: [],
                    OD: [],
                    OU: []
                },
                recycleBin: [],
                uploadConfig: {
                    label: '文件选择',
                    icon: 'ios-cloud-upload',
                    disabled: true,
                    color: 'success',
                    type: 'file',
                    url: '/upload/api/1.0.0/file/storage',
                    className: 'my-uploader-trigger',
                    progress(v) {
                        console.log(v)
                    }
                },
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
                            searchButton: {
                                label: '刷新',
                                icon: 'refresh',
                                color: 'success'
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
                                url: '/image-service/imageInfo/searchList',
                                type: 'POST',
                                data: filter
                            });
                        }
                    }
                },
                modalOptions:{
                    title: '拍摄图像',
                    width: 752,
                    height:600,
                    tableOptions: {
                        columns: [{}],
                        showIndex: false,
                        pageNumberStart: 0,
                        pageSize: 5,
                        localPage: true,
                        sortable: true,
                        multiCheck: true,
                        idKey: 'uniqueId',
                        format: {
                            list: 'res',
                            count: 'totalCount',
                            pageSize: 'pageSize',
                            currentPage: 'pageNumber'
                        },
                        recordTools: [],
                        datasource: (filter) => {
                        },
                        filter: {
                        }
                    },
                    toolbar: [{
                        label: '添加',
                        color: 'success',
                        operate: () => {
                            if(this.rightCheckedPictures.length||this.leftCheckedPictures.length){
                                var OD=[],OS=[];
                                OD=OD.concat(
                                    this.rightCheckedPictures.map(v=>{
                                        return {
                                            "status":"ready",
                                            "value":v.dfsKeyId
                                        }
                                    })
                                );
                                OS=OS.concat(
                                    this.leftCheckedPictures.map(v=>{
                                        return {
                                            "status":"ready",
                                            "value":v.dfsKeyId
                                        }
                                    })
                                );
                                this.widgetValue.OD = this.widgetValue.OD.concat(OD);
                                this.widgetValue.OS = this.widgetValue.OS.concat(OS);
                                this.$refs.tablemodal.cancel();
                                this.beforeDestroy();
                            }else{
                                Sunset.tip('请选择图像','warning');
                            }
                        }
                    }, {
                        label: '取消',
                        color: 'ghost',
                        operate: () => {
                            this.$refs.tablemodal.cancel();
                            this.beforeDestroy();
                        }
                    }]
                }
            }
        },
        computed: {
            enum() {
                return this.options.enum
            },
            midImageLarge() {
                return this.options.midImageLarge
            },
            uploadFile() {
                this.uploadConfig.url = this.options.url || this.uploadConfig.url;
                return this.uploadConfig;
            }

        },
        ready(){
        },
        watch: {
            value(value) {
                if (!this.widgetValueLock) {
                    this.valueLock = true;
                    this.refreshValue(value);
                }

            },
            widgetValue: {
                handler(value) {
                    if (!this.valueLock) {
                        this.widgetValueLock = true;
                        this.refreshWidgetValue(value)
                    }
                },
                deep: true
            }
        },
        methods: {
            initWebSocket() {
                var topic = this.wsTopic =
                    `${GlobalService.getSystemConfig().videoClinicWebsocketPrefix}/business/ws?clientId=${GlobalService.getCurrentUserSync().relation.hospital[0].id}&clientType=imageInfo`;
                SunsetWebsocket.listen(topic, SunsetWebsocket.EVENTS.MESSAGE, (res) => {
                    if (res.content) {
                        this.pictureList.push(JSON.parse(res.content));
                    }
                });
                SunsetWebsocket.connect({
                    url: topic,
                    json: true
                });
            },
            imgSrc(item){
                return item?JSON.parse(item).dfsKeyId:''
            },
            takePicture(){
                return $http({
                    url: '/image-service/imageInfo/noInfoList',
                    type: 'POST',
                    data: {
                        opcId:GlobalService.getCurrentUserSync().relation.hospital[0].id,
                        deviceType:"",
                        size:20
                    }
                }).then(res=>{
                    this.latestPictureList = res.data;
                    this.$refs.tablemodal.open();
                    this.rightCheckedPictures=[];
                    this.leftCheckedPictures=[];
                    this.initWebSocket();
                })
            },
            beforeDestroy() {
                SunsetWebsocket.disconnect(this.wsTopic);
                this.pictureList=[];
                this.latestPictureList=[];
            },
            saveRight(data){
                if(this.removeChecked(data)!=='RIGHT'){
                    this.rightCheckedPictures.push(data);
                }
            },
            saveLeft(data){
                if(this.removeChecked(data)!=='LEFT'){
                    this.leftCheckedPictures.push(data);
                }
            },
            removeChecked(item){
                var index;
                if((index=this.rightCheckedPictures.indexOf(item))>=0){
                    this.rightCheckedPictures.splice(index,1);
                    return 'RIGHT';
                }
                if((index=this.leftCheckedPictures.indexOf(item))>=0){
                    this.leftCheckedPictures.splice(index,1);
                    return 'LEFT';
                }
            },
            openImageStore() {
                this.$refs.imagestoremodal.open();
            },
            selectedImage(studies) {
                var firstInfo = studies[0];
                if (firstInfo) {
                    if (!this.model.checkdate) {
                        this.model.checkdate = firstInfo.studyDate;
                    }
                }
                studies.forEach(s => {
                    try {
                        var imageInfosList = JSON.parse(s.imageInfos);
                        imageInfosList.forEach(item => {
                            this.widgetValue[item.direction].push({
                                "status": "ready",
                                "value": item.imageKey
                            });
                        });
                    } catch (e) {
                        console.error(e);
                    }
                });
                this.$refs.imagestoremodal.cancel();
                this.refreshValue();
            },
            refreshValue(value) {
                if (!this.valueLock) {
                    return false;
                }

                this.$nextTick(res => {
                    let source = {
                        OS: [],
                        OU: [],
                        OD: []
                    }
                    try {
                        Object.assign(source, JSON.parse(this.value));
                    } catch (e) {
                        this.value = JSON.stringify(source);
                    }

                    this.widgetValue = source;
                    this.valueLock = false;
                })
            },
            refreshWidgetValue(value) {
                if (!this.widgetValueLock) {
                    return false;
                }

                this.$nextTick(res => {

                    let source = {
                        ...value
                    }

                    this.value = JSON.stringify(source)
                    this.widgetValueLock = false;
                })
            },
            deleteImage(f, index, key) {
                this.widgetValue[key][index].status = 'delete';
            },
            recoverImage(f, index, key) {
                this.widgetValue[key][index].status = 'ready';
            },
            handler(f, fIndex, key, type) {

                let enums = Object.keys(this.enum);
                let index = enums.indexOf(key)
                let otherIndex;
                if (type === 'left') {
                    otherIndex = index - 1;

                    if (otherIndex < 0) {
                        otherIndex = enums.length - 1;
                    }
                } else if (type === 'right') {
                    otherIndex = index + 1;

                    if (otherIndex >= enums.length) {
                        otherIndex = 0;
                    }
                }

                let otherKey = enums[otherIndex];
                this.widgetValue[key].splice(this.widgetValue[key].indexOf(f), 1);
                this.addImage(f, otherKey);
            },
            progress(dd) {},
            queue(quene, ctx) {
                if (ctx && quene) {
                    let value = quene.result;
                    let f = {
                        status: 'ready',
                        value: value
                    }
                    this.addImage(f, ctx);
                }
            },

            /**
             * f 图片状态
             * key OS
             */
            addImage(f, key) {
                if (!f || !key) throw new Error('not f Object and key value');
                let has = false;
                // 有图片则更改状态
                this.$nextTick(res => {
                    this.widgetValue[key] = this.widgetValue[key] || [];
                    this.widgetValue[key].forEach(item => {
                        if (item.value === f.value) {
                            item.status = 'ready';
                            has = true;
                        }
                    });
                    // 没有图片则加入
                    if (!has) {
                        this.widgetValue[key].push({
                            status: 'ready',
                            value: f.value
                        });
                    };
                })
            }
        },

    }
</script>