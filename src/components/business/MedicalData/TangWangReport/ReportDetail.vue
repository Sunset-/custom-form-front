<style lang="sass">
    .report-form-view{
        .checkImgTitle>.sunset-field-label{
            text-align: left;
            font-size: 16px;
            left: -10px;
            position: relative;
            vertical-align: top;
        }
        .report_template{
            height:100%;
            position:absolute;
            right:0;
            width:300px;
            background:#f8f8f8;
        }
        .report_content{
            position:absolute;
            right:310px;
            left:0;
            bottom:0;
            top:0;
            overflow:hidden;
            .report_operate{
                height:50px;
                position:absolute;
                right:300px;
                left:0;
                border-bottom:1px solid #ccc;
                &>.check_img{
                    display:inline-block;
                    text-align:center;
                    width:100px;
                    height:30px;
                    line-height:28px;
                    float:right;
                    margin-right:20px;
                    margin-top:10px;
                    border:1px solid #3399ff;
                    border-radius:3px;
                    background:#3399ff;
                    color:#fff;
                }
                .active{
                    border:1px solid #ccc;
                    border-bottom:none;
                    background:#fff;
                }
            }
            .report_content_detail{
                padding:5px;
                position:absolute;
                top:0;
                left:20px;
                right:0;
                bottom:0;
                height:100%;
                overflow-y:auto;
                .img_info{
                    width:40%;
                    height:100%;
                    float:left;
                    &>form>div>h3{
                        height:34px;
                        line-height:34px;
                        padding-left:10px;
                        border-bottom:1px solid #ccc;
                    }
                    .img_quatity{
                        overflow:hidden;
                        border:1px solid #ccc;
                        &>ul{
                            height:400px;
                            &>li{
                                width: 100%;
                                text-align:center;
                                &>p{
                                    text-align:left;
                                    height:30px;
                                    line-height:30px;
                                    padding-left:20px;
                                    font-weight:600;
                                }
                                &>span{
                                    text-align:center;
                                    display:inline-block;
                                    width: 30%;
                                    height:30px;
                                    line-height:30px;
                                    padding:0 5px;
                                    & select{
                                        border-radius: 3px;
                                        height:23px;
                                    }
                                }
                            }
                        }
                    }
                    .img_view{
                        overflow:hidden;
                        border:1px solid #ccc;
                        margin-top:5px;
                        &>ul{
                            text-align:center;
                            height:500px;
                            &>li{
                                width: 100%;
                                text-align:center;
                                &>p{
                                    text-align:left;
                                    height:30px;
                                    line-height:30px;
                                    padding-left:20px;
                                    font-weight:600;
                                }
                                &>span{
                                    text-align:center;
                                    display:inline-block;
                                    width: 30%;
                                    height:30px;
                                    line-height:30px;
                                    & select{
                                        border-radius: 3px;
                                        height:23px;
                                    }
                                }
                            }
                        }

                    }
                }
                .report_info{
                    float:left;
                    width:100%;
                    .report_footer{
                        border-top:1px solid #ccc;
                        padding:10px;
                        margin:50px 0;
                    }
                }
            }
        }
    }
</style>
<template>
    <sunset-toolbar style="float:right;padding:10px 0px;" v-show="!editing" :options="toolbarOptions"></sunset-toolbar>
    <report-view v-ref:view v-show="!editing" :card="card" :data="data" @save="save"></report-view>
    <div class="report-form-view"  v-show="editing" >
        <div class="report_template">
            <report-template @selected="selectedTemplate" category="眼科设备"></report-template>
        </div>
        <!-- <span @click="fillReport" :class="[isActive?'active':'']">写报告</span><span @click="checkImgFile" :class="[!isActive?'active':'']">影像文件</span> -->
        <div class="report_content">
             <!-- <div class="report_operate"><span @click="back" class="check_img">查看影像文件</span></div>  -->
            <div class="report_content_detail">
                <div class="report_info">
                    <sunset-form v-ref:form :options="options" @submit="save" @signal="operateSignal"></sunset-form>
                    <div class="report_footer">
                        <p>此报告仅供本院临床医生参考，结论只对本次检查有效。</p>
                        <p style="text-align:right;margin-top:5px;">诊断医生：{{diagnoseDoctor}}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import ReportTemplate from '../../template/ReportTemplate';
    import MedicalDataStore from "../MedicalDataStore.js";
    import ReportView from './View';
    export default {
        components:{
            ReportTemplate,
            ReportView
        },
        ready(){
        },
        props: {
            card: {},
            data: {

            },
            config: {

            }
        },
        data() {
            return {
                editing:false,
                pictureList:[],
                isActive:true,
                chronicDisease:123,
                newHistoryFields:[],
                newCheckFields:[],
                lastFocusInput :null,
                toolbarOptions: {
                    align: 'center',
                    tools: [{
                        label: '编辑',
                        color: 'info',
                        premise: () => {
                            return (this.card.digest.userId == GlobalService.getCurrentUserSync().user.userId);
                        },
                        operate: () => {
                            this.editing = true;
                            this.$refs.form.reset(this.data);
                            this.$emit('signal', 'EDIT');
                        }
                    }]
                },
                options:{
                    cols: 2,
                    fields: [{
                        label:'检查图片',
                        name: 'checkimage',
                        fieldClass : 'checkImgTitle',
                        widget: 'reportimage',
                        monopolize: true,
                        screeningcard:this.card.digest.tangscreeningId
                    },{
                        group: '图像所见',
                        label: '右眼',
                        name: 'rightimg',
                        widget: 'editor',
                        toolbar : 'bold,italic,superscript,subscript,spechars',
                        monopolize: false,
                        focus :()=>{
                            this.lastFocusInput = 'rightimg';
                        },
                        disabled: false
                    },{
                        label: '左眼',
                        name: 'leftimg',
                        widget: 'editor',
                        monopolize: false,
                        toolbar : 'bold,italic,superscript,subscript,spechars',
                        focus :()=>{
                            this.lastFocusInput = 'leftimg';
                        },
                        disabled: false
                    },{
                        group: '诊断结论',
                        label: '右眼',
                        name: 'righteye',
                        widget: 'editor',
                        monopolize: false,
                        toolbar : 'bold,italic,superscript,subscript,spechars',
                        focus :()=>{
                            this.lastFocusInput = 'righteye';
                        },
                        disabled: false
                    },{
                        label: '左眼',
                        name: 'lefteye',
                        widget: 'editor',
                        monopolize: false,
                        toolbar : 'bold,italic,superscript,subscript,spechars',
                        focus :()=>{
                            this.lastFocusInput = 'lefteye';
                        },
                        disabled: false
                    },{
                        group: 'DR分级',
                        label:'右眼',
                        name: 'DRright',
                        widget: 'radio',
                        // defaultFirst: true,
                        // default: '2',
                        enum: 'DR'
                    },{
                        label:'左眼',
                        name: 'DRleft',
                        widget: 'radio',
                        // defaultFirst: true,
                        // default: '2',
                        enum: 'DR'
                    },{
                        group: 'DME分级',
                        label:'右眼',
                        name: 'DMEright',
                        widget: 'radio',
                        // defaultFirst: true,
                        // default: '2',
                        enum: 'DME'
                    },{
                        label:'左眼',
                        name: 'DMEleft',
                        widget: 'radio',
                        // defaultFirst: true,
                        // default: '2',
                        enum: 'DME'
                    }],
                    format: (model) => {
                        return model;
                    },
                    validate: (model) => {
                        return true;
                    },
                    submit: (data) => {
                        data.tangscreeningId = this.card.digest.tangscreeningId;
                        data.userName = GlobalService.getCurrentUserSync().user.name;
                        var config = this.config;
                        this.$emit('save', {
                            digest: config.digest && config.digest(data),
                            entity: config.entity && config.entity(data),
                            extension: data,
                            associatedCardId : data.tangscreeningId
                        });
                    }
                }
            }
        },
        computed: {
            diagnoseDoctor(){
                return GlobalService.getCurrentUserSync().user.name
            }
        },
        methods: {
            init() {
                this.editing = !this.data;
            },
            operateSignal(signal) {
                if (signal == 'CANCEL') {
                    if (this.data) {
                        this.editing = false;
                        this.$emit('signal', 'CANCEL');
                    } else {
                        this.$emit('signal', 'HOME');
                    }
                }
            },
            selectedTemplate(template){
                var model = this.$refs.form.getModel(true);
                if(this.lastFocusInput=='lefteye'||this.lastFocusInput=='leftimg'){
                    model['leftimg']+=template.description;
                    model['lefteye']+=template.contents;
                }else if(this.lastFocusInput=='righteye'||this.lastFocusInput=='rightimg'){
                    model['rightimg']+=template.description;
                    model['righteye']+=template.contents;
                }
            },
            getEditingData() {
                return this.$refs.form.getModel();
            },
            setEditingData(data) {
                this.editing = true;
                return this.$refs.form.reset(data);
            },
            save(){

            },
            insertImg(){
                this.$refs.tablemodal.open();
            },
            checkImgFile(){
                this.isActive=false;
            },
            fillReport(){
                this.isActive=true;
            },
            showCheckItem(alias) {
                return (this.allCheck & Sunset.Service.Dictionary.alias('SCREENING_EYES_DEPT', alias)) == Sunset.Service
                    .Dictionary.alias('SCREENING_EYES_DEPT', alias);
            },
            back(){
                window.history.back(-1);
            }
        },
        ready() {
            this.init();
        },
        watch: {
            data(v) {
                this.init();
            },
            editing(v) {
                if (!v && this.$route.path.endsWith('/edit')) {
                    window.history.back(-1);
                }
            }
        }
    }
</script>