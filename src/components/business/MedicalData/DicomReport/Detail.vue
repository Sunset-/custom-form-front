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
                    .field-invalid-tip{
                        right: 20px;
                    }
                    .sunset-field-wraning-pop-wrap{
                        right: 0px;
                    }
                    .sunset-form-field{
                        padding-right:30px;
                    }
                }
            }
        }
    }
    .dicomreport{
        div.group-title{
            font-weight:600;
            display: inline-block;
            margin-right: 14rem;
             span{
                font-weight:normal;
            }    
        } 
    }
    .md-detail{
        min-height:100%;
    }

</style>
<template>
    <div class="dicomreport">
        <div class="report-form-view">
            <div class="report_template">
                <report-template v-ref:template @selected="selectedTemplate" :category="deviceType" ></report-template>
            </div>
            <!-- <span @click="fillReport" :class="[isActive?'active':'']">写报告</span><span @click="checkImgFile" :class="[!isActive?'active':'']">影像文件</span> -->

            <div class="report_content">
                <div class="report_content_detail">
                    <div class="report_info">
                        <div>
                            <div class="group-title"> 检查日期 :  <span> {{dicomfile.studyDate | time 'yyyy/MM/dd'}} <span> </div>
                            <div class="group-title"> 检查设备 : <span> {{dicomfile.deviceType}}  <span>  </div>
                            <div class="group-title" style="display:block;"> 检查部位及方法 : <span>  {{card.digest.checkPoints}}   [  {{card.digest.checkMethod}}  ]  <span>  </div>
                        </div>
                        <!-- <a class="" style="position: absolute;right: 0; top: 2rem;" v-on:click="addmodel()">生成个人模板</a> -->
                        <sunset-form v-ref:form :options="options" @submit="save" @signal="operateSignal"></sunset-form>
                        <div class="report_footer">
                            <!-- <p>此报告仅供本院临床医生参考，结论只对本次检查有效。</p>
                            <p style="text-align:right;margin-top:5px;">诊断医生：{{diagnoseDoctor}}</p> -->
                        </div>
                    </div>
                </div>
            </div>

        </div>
        <!-- {{dicomfile | json}} -->
        <!-- {{data | json}} -->
        <!-- {{patient | json}} -->
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
            TriageCenterStore.getFlow(this.$route.params.flowId).then(res=>{
                    if(!(res.status == Sunset.Service.Dictionary.alias('RegistrationRecordStatus','Finsih'))){
                        this.registrationStatus = true;
                    }
                })
        },
        props: {
            card: {},  // digest
            data: {},
            flow:{},
            patient: {},
            // deviceType:{},
            config: {
                // 后台的模板 
            }
        },
        data() {
            return {
                deviceType:null,
                pictureList:[],
                isActive:true,
                chronicDisease:123,
                newHistoryFields:[],
                newCheckFields:[],
                lastFocusInput :null,
                patientCardData: {},
                options:{
                    cols: 1,
                    fields: [{
                        group: '影像学表现',
                        name: 'biaoxian',
                        widget: 'editor',
                        monopolize: false,
                        toolbar : 'bold,italic,superscript,subscript,spechars',
                        focus :()=>{
                            this.lastFocusInput = 'biaoxian';
                        },
                        disabled: false,
                        validate: {
                            required: true,
                            biaoxian: true
                        },
                        // style:{
                        //     PaddingRight: "50px",
                        // },
                    },{
                        group: '影像提示',
                        // label: '右眼',
                        name: 'yingxiangtixing',
                        widget: 'editor',
                        monopolize: false,
                        toolbar : 'bold,italic,superscript,subscript,spechars',
                        // focus :()=>{
                        //     this.lastFocusInput = 'yingxiangtixing';
                        // },
                        disabled: false,
                        validate: {
                            required: true,
                            yingxiangtixing: true
                        },
                        // style:{
                        //     PaddingRight: "50px",
                        // },
                    }, {
                            group: '建议',
                            // label: '建议',
                            name: 'textarea',
                            widget: 'textarea',
                            monopolize: true,
                            disabled: false,
                            // style:{
                            //     PaddingRight: "50px",
                            // },
                    },{
                        // group: '报告标签1',
                        group:'报告标签',
                        name: 'baogaobiaoqian',
                        widget: 'radio',
                        // style:'display:inline-block',
                        // defaultFirst: true,
                        // default: '2',
                        enum: 'MASCULINE',
                        validate: {
                            required: true,
                            baogaobiaoqian: true
                        },
                    }],
                    format: (model) => {
                        return model;
                    },
                    validate: (model) => {
                        return true;
                    },
                    submit: (data) => {
                        data.dicomId = this.card.digest.dicomArchivesId;
                        // console.log("data.dicomId"+data.dicomId);  //用户id
                        data.userName = GlobalService.getCurrentUserSync().user.name;
                        var config = this.config;
                        this.$emit('save', {
                            digest: config.digest && config.digest(data,this.card.digest),
                            entity: config.entity && config.entity(data),
                            extension: data,
                            associatedCardId : data.dicomId,
                            // flowId:'8ad407747b394b8dbbfab295a49ad24d',
                        });
                    }
                }
            }
        },
        computed: {
            safeData() {
                console.log("editcard")
                console.log(this.card)
                if(this.card.digest.checkMethod!=undefined){this.card.digest.checkMethod=this.card.digest.checkMethod.replace(/;/g,"，")}
                if(this.card.digest.checkPoints!=undefined){this.card.digest.checkPoints=this.card.digest.checkPoints.replace(/;/g,"，")}
                return this.card || {};
            },
            dicomfile() {
                var dicomfile =JSON.parse(this.safeData.digest.dicomfile);
                return dicomfile;
            },
            nextdicomfile() {
                return JSON.parse(this.safeData.digest)
            },
            diagnoseDoctor(){
                return GlobalService.getCurrentUserSync().user.name
            },
            studyDate(){
                // console.log(this.card.lastModifyDate);
                var ss = this.card.digest.lastModifyDate;
                ss = Sunset.Dates.format(ss || new Date(), 'yyyy-MM-dd');
                return ss ? ss : {};
            },
            deviceType() {
                var dicomfile =JSON.parse(this.safeData.digest.dicomfile);
                var types = {
                    CT : 'CT',
                    MR : 'MR'
                }
                return types[dicomfile.deviceType]||'b251616410ef4e1ab991bc056a82e359'
            },
            
        },
        methods: {
            init() {
                // false
                // none
               this.$refs.form.reset(this.data);
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
                if(this.lastFocusInput=='biaoxian'||this.lastFocusInput=='biaoxian'){
                    model['biaoxian']+=template.description;
                    model['yingxiangtixing']+=template.contents;
                }else if(this.lastFocusInput=='yingxiangtixing'||this.lastFocusInput=='yingxiangtixing'){
                    model['biaoxian']+=template.description;
                    model['yingxiangtixing']+=template.contents;
                }
            },
            getEditingData() {
                return this.$refs.form.getModel();
            },
            setEditingData(data) {
                this.editing = true;
                return this.$refs.form.reset(data);
            },
            edit(){
                this.editing = true;
                this.$refs.form.reset(this.data);
                this.$emit('signal', 'EDIT');
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
            },
            addmodel(){
                this.$refs.template.addTemplate({
                    show :this.data.biaoxian,
                    tip :this.data.yingxiangtixing
                });
            },
        },
        ready() {
            var c = this.card;
            console.log(this.card);
            this.init();
        },
        // watch: {
        //     data(v) {
        //         this.init();
        //     },
        //     editing(v) {
        //         if (!v && this.$route.path.endsWith('/edit')) {
        //             window.history.back(-1);
        //         }
        //     }
        // }
    }
</script>