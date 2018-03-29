<style lang="sass">
    .sunset-field{
        .picture_list{
            .right_box{
                float:left;
                width:360px;
                .right_picture{
                    height:119px;
                    border:1px solid #ccc;
                    overflow-y:auto;
                    padding:3px;
                    & .picture{
                        float:left;
                        width: 100px;
                        height: 100px;
                        overflow: hidden;
                        position: relative;
                        margin: 5px; 
                        border:1px solid #ccc;    
                        &>img{
                            width:auto;
                            height:100px;
                            transform: translate(-50%);
                            margin-left: 50px;
                        }
                        & .ivu-checkbox{
                            position: absolute;
                            top: 0;
                            right: 0;
                            z-index: 1;
                        }
                    }
                    .active{
                        border:1px solid #3399ff;
                    }
                }
            }
            .left_box{
                float:left;
                width:360px;
                .left_picture{
                    height:119px;
                    border:1px solid #ccc;
                    border-left:none;
                    overflow-y:auto;
                    padding:3px;
                    & .picture{
                        float:left;
                        width: 100px;
                        height: 100px;
                        overflow: hidden;
                        position: relative;
                        margin: 5px;
                        &>img{
                            width:auto;
                            height:100px;
                            transform: translate(-50%);
                            margin-left: 50px;
                        }
                        & .ivu-checkbox{
                            position: absolute;
                            top: 0;
                            right: 0;
                            z-index: 1;
                        }
                    }
                    .active{
                        border:1px solid #3399ff;
                    }
                }
            }
            .other_box{
                float:left;
                width:720px;
                margin-top:20px;
                .other_picture{
                    padding:7px;
                    height:128px;
                    border:1px solid #ccc;
                    overflow-y:auto;
                    & .picture{
                        float:left;
                        margin: 5px;
                        width: 100px;
                        height: 100px;
                        overflow: hidden;
                        position: relative;
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
        .images_list{
            &>div{
                width:48%;
                height:130px;
                float:left;
                &>p{
                    text-align:center;
                    height:26px;
                    line-height:26px;
                }
                &>div{
                    border:1px solid #ccc;
                    border-radius:3px;
                    overflow-y:auto;
                    width:100%;
                    height:110px;
                    padding:10px;
                    & img.viewer-image-pic{
                        width:80px;
                        height:80px;
                    }
                }
            }
        }
    }
        
</style>
<template>
    <div class="sunset-field">
        <sunset-view-modal v-ref:tablemodal :options="modalOptions">
            <div class="picture_list">
                    <div class="right_box">
                        <p style="text-align:center">右眼</p>
                        <div class="right_picture">
                            <checkbox-group :model.sync="rightCheckedPictures">
                                <checkbox v-for='item in rightPictureList' track-by="$index" :value="item.value" class="picture" :class="['viewer-image-pic',rightCheckedPictures.indexOf(item.value)>=0?'active':'']" >
                                        <img v-if="item"  onerror="this.src='/assets/img/nopic.png'" group="attachment" :src="item.value | upload-image" />
                                </checkbox>
                            </checkbox-group>
                        </div>
                    </div>
                    <div class="left_box">
                        <p style="text-align:center">左眼</p>
                        <div class="left_picture">
                            <checkbox-group :model.sync="leftCheckedPictures">
                                <checkbox v-for='item in leftPictureList' track-by="$index" :value="item.value" class="picture" :class="['viewer-image-pic',leftCheckedPictures.indexOf(item.value)>=0?'active':'']" >
                                        <img v-if="item"  onerror="this.src='/assets/img/nopic.png'" group="attachment" :src="item.value | upload-image" />
                                </checkbox>
                            </checkbox-group>
                        </div>
                    </div>
                    <div class="other_box">
                        <p style="text-align:center">未分类</p>
                        <div class="other_picture">
                            <div v-for='item in otherPictureList' track-by="$index" style="position:relative;" class="picture" :class="['viewer-image-pic',rightCheckedPictures.indexOf(item.value)>=0||leftCheckedPictures.indexOf(item.value)>=0?'active':'']">
                                <div @click="saveRight(item)" :class="['righteye',rightCheckedPictures.indexOf(item.value)>=0?'active_checkbox':'']" style="cursor:pointer;left:0;top:0;z-index:1">右眼</div><div :class="['lefteye',leftCheckedPictures.indexOf(item.value)>=0?'active_checkbox':'']" style="cursor:pointer;right:0;top:0;z-index:1" @click="saveLeft(item)">左眼</div>
                                <img v-if="item"  onerror="this.src='/assets/img/nopic.png'" group="attachment" :src="item.value | upload-image" />
                            </div>
                        </div>
                    </div>
            </div>
        </sunset-view-modal>
         <sunset-toolbar :options="buttonOptions"></sunset-toolbar> 
        <div class="images_list" style="">
            <div style="margin-right:2%">
                <p>右眼</p>
                <div>
                    <span v-for="item in rightImage">
                        <img v-if="item" track-by="$index" class="viewer-image-pic" group="attachment" :src="item | upload-image" />
                    </span>
                </div>
            </div>
            <div>
                <p>左眼</p>
                <div>
                    <span v-for="item in leftImage">
                        <img v-if="item" class="viewer-image-pic" group="attachment" :src="item | upload-image" />
                    </span>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    export default {
        props: {
            options: {
                type: Object
            },
            value: {},
            model : {},
            imgs:[]
        },
        data() {
            return {
                pending : false,
                leftImage : [],
                rightImage : [], 
                leftPictureList:[],
                rightPictureList:[],
                otherPictureList:[],
                dataInited : false,
                widgetValue:'',
                pictures:[],
                rightCheckedPictures : [],
                leftCheckedPictures : [],
                modalOptions:{
                    title: '将图像插入报告',
                    width: 752,
                    height:600,
                    checked: {
                        multi: false,
                        label: 'name',
                        premise: (record) => {
                            return !record.isChoosed;
                        }
                    },
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
                                this.leftImage = Sunset.clone(this.leftCheckedPictures);
                                this.rightImage = Sunset.clone(this.rightCheckedPictures);
                                this.$refs.tablemodal.cancel();
                            }else{
                                Sunset.tip('请选择图像','warning');
                            }
                        }
                    }, {
                        label: '取消',
                        color: 'ghost',
                        operate: () => {
                            this.$refs.tablemodal.cancel();
                        }
                    }]
                },
                buttonOptions:{
                    size: 'small',
                    tools: [{
                        label: '将图像插入报告',
                        color: 'primary',
                        operate: () => {
                            this.insertImg();
                        }
                    },{
                        label: '查看检查图像',
                        color: 'success',
                        operate: () => {
                            Base.openEagleeyes(this.options.screeningcard,"EYEGROUND");
                        }
                    }]
                } 
            }
        },
        methods: {
            saveRight(data){
                if(this.removeChecked(data.value)!=='RIGHT'){
                    this.rightCheckedPictures.push(data.value);
                }
            },
            saveLeft(data){
                if(this.removeChecked(data.value)!=='LEFT'){
                    this.leftCheckedPictures.push(data.value);
                }
            },
            removeChecked(value){
                var index;
                if((index=this.rightCheckedPictures.indexOf(value))>=0){
                    this.rightCheckedPictures.splice(index,1);
                    return 'RIGHT';
                }
                if((index=this.leftCheckedPictures.indexOf(value))>=0){
                    this.leftCheckedPictures.splice(index,1);
                    return 'LEFT';
                }
            },
            insertImg(){   
                this.leftCheckedPictures= Sunset.clone(this.leftImage);
                this.rightCheckedPictures = Sunset.clone(this.rightImage);
                if(!this.dataInited){
                    return $http({
                        url:'/service/business/card',
                        data: {
                            cardIds: this.options.screeningcard,
                            pageNumber: 0,
                            pageSize: 999
                        }
                    }).then(res => {
                        var imgList = JSON.parse(res&&res.rows[0].extension&&JSON.parse(res.rows[0].extension).checkpicture);
                        if(imgList){
                            imgList.OS.length&&imgList.OS.forEach((v)=>{
                                this.leftPictureList.push({type:'left',value:v.value})
                            });
                            imgList.OD.length&&imgList.OD.forEach((v)=>{
                                this.rightPictureList.push({type:'right',value:v.value})
                            });
                            imgList.OU.length&&imgList.OU.forEach((v)=>{
                                this.otherPictureList.push({type:'other',value:v.value})
                            });
                        }
                        this.dataInited = true;
                        this.$refs.tablemodal.open();
                    }) 
                }else{
                    this.$refs.tablemodal.open();
                }
            },
            refreshValue(){
                this.value = JSON.stringify({
                    left : this.leftImage,
                    right : this.rightImage
                })
            },
            refreshWidgetValue(){
                this.pending = true;
                var v = this.value;
                if(v){
                    try{
                        var obj = JSON.parse(v);
                        this.leftImage = obj.left||[];
                        this.rightImage = obj.right||[];
                    }catch(e){
                        console.error(e);
                    }
                }else{
                        this.leftImage = [];
                        this.rightImage = [];
                }
                this.$nextTick(()=>{
                    this.pending = false;
                });
            }
        },
        watch : {
            leftImage(){
                this.refreshValue();
            },
            rightImage(){
                this.refreshValue();
            },
            value(){
                if(!this.pending){
                    this.refreshWidgetValue();
                }
            }
        }
    }
</script>