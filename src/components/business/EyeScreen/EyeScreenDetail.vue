<style lang="sass">
    .search_regist{
        height: 100%;
        overflow:auto;
        input{
            font-size:14px;
        }
        .activity_title{
            padding-left: 20px;
            height: 30px;
            line-height: 30px;
            width: 100%;
            margin-bottom:25px;
            &>span{
                float: left;
            }
            .back{
                color: #0099ff;
                cursor: pointer;
            }
            &>.batch-upload-progress {
                width: 200px;
                height: 32px;
                border: 1px solid #32CD66;
                position: relative;
                .batch-upload-progress-inner {
                    height: 30px;
                    background: #32CD66;
                    transition: all 150ms;
                }
                .progress-tip {
                    position: absolute;
                    left: 50%;
                    transform: translate(-50%, 0);
                    top: 0;
                    z-index: 1;
                    color: #FFF;
                    text-shadow: 0px 0 1px #000;
                }
                .upload_tip{
                    position: absolute;
                    z-index: 5;
                    top: 30px;
                    color:orange;
                    font-size:12px;
                    width:300px;
                }
            }
        }
        .patient_list{
            width: 1360px;
            margin: auto;
            padding: 0 20px;
            .form_patient{
                padding-bottom: 20px;
                border-bottom: 1px solid #ccc;
                margin-bottom: 20px;
                .sunset-field-label, .sunset-form-field span{
                    font-size: 14px;
                }
            }
            .saoma_input{
                margin-bottom:20px;
                margin-left:270px;
                margin-top:-1px;
                &>input{
                    border:1px solid #ccc;
                    height: 32px;
                    line-height: 1.5;
                    padding: 4px 7px;
                    font-size: 14px;
                    border: 1px solid #d7dde4;
                    border-radius: 4px;
                    color: #657180;
                    background-color: #fff;
                }
            }
            .upload_picture{
                float: right;
                border: none;
                height:32px;
                margin-top:-52px;
            }
            &>.sunset-search-form-container{
                float: left;
            }
            & .sunset-crud-table-wrap{
                border-top:none;
            }
        }
    }
</style>
<template>
    <div class="search_regist">
        <div v-show="currentPatientId?false:true">
            <sunset-camera-modal v-ref:camera :options="cameraOptions" @submit="savePhoto"></sunset-camera-modal>
            <div class="activity_title"><span class="back" @click="back">活动列表</span><span style='margin-right:20px'>&nbsp/ {{activityInfo?activityInfo.name:''}}</span>
                <!-- 批量上传 start  -->
                <div class="pull-left batch-upload-progress" v-show="batchUploading">
                    <div class="batch-upload-progress-inner" :style="{width:(batchUploadProgress||0)+'%'}"></div>
                    <span class="progress-tip">{{batchUploadProgress}}%</span>
                    <label class="upload_tip">正在上传中, 关闭或刷新浏览器都会导致上传终止</label>
                </div>
                <!-- 批量上传 end -->
            </div>
            <div  class="patient_list" >
                <div class="form_patient">
                    <sunset-form v-ref:form :options="formOption"></sunset-form>
                </div>
                <sunset-filter :options="rightFilterOps" @filter="rightFilter"></sunset-filter>
                <div class="saoma_input"><input placeholder="点击扫码" @input="saomaChange"/></div>
                <div class="upload_picture">
                    <sunset-file :options="batchUploadImageOptions" :disabled="batchUploading" @start-upload="startBatchUpload" @finish="batchUploadFinish">
                        <i-button style="vertical-align: top;"  type="primary" :disabled="batchUploading" icon="ios-upload">上传眼底照片</i-button>
                    </sunset-file>
                </div>
                <sunset-table v-ref:table :options="tableOptions"></sunset-table>
            </div>
        </div>
        <router-view></router-view>
    </div>
</template>
<script>
    import EyeScreenStore from "./EyeScreenStore.js"
    import MedicalDataStore from "../MedicalData/MedicalDataStore.js";
    export default {
        data(){
            return {
                batchUploadImageOptions: {
                    label: '文件选择',
                    icon: 'ios-cloud-upload',
                    disabled: true,
                    color: 'success',
                    type: 'file',
                    url: '/image-service/screeningOm/receive',
                    className: 'my-uploader-trigger',
                    filter(f) {
                        return ~f.type.indexOf('image');
                    },
                    formData: (record) => {
                        return {
                            taskToken: this.batchUploadToken
                        }
                    },
                    progress: (v) => {
                        this.batchUploadProgress = Math.round(v * 100);
                    }
                },
                batchUploadToken: null,
                batchUploading: false,
                batchUploadProgress: 0,
                currentCardId:'',
                activityInfo:null,
                IDCardAutoInputTimer:null,
                currentPatientId:null,
                patientIDCard:null,
                saomaTimer : null,
                saomaPre:null,
                filter:{},
                cameraOptions: {
                    title: '眼睑检查',
                    width: 800,
                    height: 400,
                    labelEnum: 'EYESLID_NO',
                    ratio: '16:6',
                    toolbar: [{
                        label: '双眼',
                        data: '双眼'
                    },{
                        label: '右眼',
                        data: '右眼'
                    }, {
                        label: '左眼',
                        data: '左眼'
                    },{
                        label: '保存',
                        color: 'success',
                        signal: 'SUBMIT'
                    }]
                },
                tableOptions:{
                    lazy: false,
                    columns: [{
                        title: '编号',
                        name: 'activityRegister.number'
                    }, {
                        title: '姓名',
                        name: 'patient.extension',
                        format(v){
                            return JSON.parse(v).name
                        }
                    },{
                        title: '性别',
                        name: 'patient.extension',
                        format(v){
                            return Sunset.Service.Dictionary.transcode('SEX',JSON.parse(v).sex)
                        }
                    }, {
                        title: '年龄',
                        name: 'registration.extension',
                        format(v){
                            if(v){
                                return JSON.parse(v).patientAge?JSON.parse(v).patientAge.replace(',',""):'-'
                            }
                        }
                    }, {
                        title: '联系方式',
                        name: 'patient.extension',
                        format(v){
                            return JSON.parse(v).mobilePhone?JSON.parse(v).mobilePhone:'-'
                        }
                    },{
                        title: '视力(右/左)',
                        name: 'eyeScreen.extension',
                        align:'center',
                        format(v){
                            var eyeVersion=JSON.parse(v).vision;
                            if(eyeVersion==''||eyeVersion==undefined){
                                return '-'
                            }else{
                                var vision = JSON.parse(eyeVersion);
                                if(vision.right || vision.left){
                                    var right ='';
                                    var left ='';
                                    if(vision.right=='' || vision.right==undefined){
                                        right ='-'
                                    }else if(vision.right=='-1'){
                                        right ='未知'
                                    }else{
                                        right = vision.right
                                    };
                                    if(vision.left=='' || vision.left==undefined){
                                        left ='-'
                                    }else if(vision.left=='-1'){
                                        left ='未知'
                                    }else{
                                        left = vision.left
                                    }
                                    return  right + '/' + left;
                                }else{
                                    return '-'
                                }
                            }
                        }
                    },{
                        title: '眼压(右/左)',
                        name: 'eyeScreen.extension',
                        align:'center',
                        format(v){
                            if(v&&JSON.parse(v).eyeballTension){
                                var eyeballTension = JSON.parse(JSON.parse(v).eyeballTension);
                                if(eyeballTension !=''&&eyeballTension !=undefined){
                                    var r1 = eyeballTension.r1?(eyeballTension.r1>=1.33&&eyeballTension.r1<=2.80?`<span>${eyeballTension.r1}kPa</span>`:`<span style='color:red'>${eyeballTension.r1}kPa</span>`):'-';
                                    var l1 = eyeballTension.l1?(eyeballTension.l1>=1.33&&eyeballTension.l1<=2.80?`<span>${eyeballTension.l1}kPa</span>`:`<span style='color:red'>${eyeballTension.l1}kPa</span>`):'-';
                                    return r1 + '/' + l1
                                }
                            }else{
                                return '-'
                            }
                        }
                    }, {
                        title: '裂隙灯检查',
                        name: 'eyeScreen.extension',
                        align:'center',
                        format(v){
                            if(v&&JSON.parse(v).lxd){
                                return '已录入'
                            }else{
                                return '-'
                            }
                        }
                    }, {
                        title: '眼底检查(右/左)',
                        name: 'eyeScreen.extension',
                        align:'center',
                        format(v){
                            var right=0;
                            var left=0;
                            v?JSON.parse(v).eyeBottom?JSON.parse(JSON.parse(v).eyeBottom).map(value=>{
                                if(value.result.fileName=='左眼'){
                                    left+=1;
                                }else if(value.result.fileName=="右眼"){
                                    right+=1;
                                }
                            }):'-':'-';
                            if(right==0&&left==0){
                                return '-'
                            }else{
                                return (right==0?'-':right) + '/' + (left==0?'-':left)
                            }
                            // return  v?Sunset.Service.Dictionary.transcode('NORMAL_ABNORMAL',JSON.parse(v).eyeBottomResult):'-';
                        }
                    },{
                        title: '眼睑检查',
                        name: 'eyeScreen',
                        align:'center',
                        format(v){
                            return JSON.parse(v.extension).eyelidCheck?'已检查':`<div style="width:50px;height:25px;line-height:25px;border:1px solid #ccc;border-radius:5px;text-align:center;cursor:pointer;margin-left:30px" class="photograph" data-id='${v.cardId}'>拍照</div>`
                        }
                    }],
                    recordTools: [{
                        label: '编辑',
                        color: 'info',
                        operate: (record) => {
                            this.patientDetail(record.patient.id)
                        }
                    },{
                        label: '打印',
                        color: 'info',
                        premise:(record)=>{
                            return record.eyeScreen.printNumber==0
                        },
                        operate: (record) => {
                            this.print(record);
                            return EyeScreenStore.printNumber(record.eyeScreen.cardId).then(res=>this.$refs.table.refresh());
                        }
                    },{
                        label: '已打印',
                        color: 'info',
                        premise:(record)=>{
                            return record.eyeScreen.printNumber>0
                        },
                        operate: (record) => {
                            this.print(record);
                        }
                    }],
                    pageNumberStart: 0,
                    pageSize: 10,
                    localPage: false,
                    sortable: true,
                    multiCheck: false,
                    format: {
                        list: 'rows',
                        count: 'totalCount',
                        pageSize: 'pageSize',
                        currentPage: 'pageNumber'
                    },
                    datasource: (filter)=>{
                        filter.systemId = GlobalService.getCurrentUserSync().user.systemId;
                        filter.hospitalId = GlobalService.getCurrentUserSync().relation.hospital[0].id;
                        filter.activityId = this.$route.params.activityId;
                        return EyeScreenStore.PatientList(filter)
                    }
                },
                rightFilterOps: {
                    align: 'left',
                    format: (filter) => {
                        if (filter.keyword) {
                            filter.keyword = filter.keyword.trim();
                        } else {
                            filter.keyword = ""
                        };
                        return filter
                    },
                    fields: [{
                        name: 'keyword',
                        widget: 'search',
                        placeholder: '患者编号/姓名'
                    }]
                },
                formOption:{
                    cols: 4,
                    fields: [{
                            group: '基本信息',
                            label: '姓名',
                            name: 'name',
                            widget: 'input',
                            placeholder: "不能为空",
                            validate: {
                                required: true,
                                fullName: true
                            },
                            groupToolbar: {
                                size: 'small',
                                style: 'margin-left: 18px',
                                tools: [{
                                    label: '重置',
                                    color: 'warning',
                                    operate: (model)=>{
                                        this.patientIDCard= null; 
                                        this.$refs.form.reset();
                                    }
                                }]
                            }
                        },{
                            label: '性别',
                            name: 'sex',
                            widget: 'radio',
                            defaultFirst:true,
                            validate: {
                                required: true
                            },
                            enum:'SEX'
                        },{
                            label: '医保',
                            name: 'medicalCare',
                            widget: 'select',
                            default: 'village_cooper',
                            enum:"MEDICARE"
                        },{
                            label: '年龄',
                            name: 'age',
                            widget: 'input',
                            placeholder: "不能为空",
                            validate: {
                                required: true,
                                validateAge: true
                            },
                            append: {
                                style: 'width:50px',
                                data: [{
                                    text: '岁',
                                    value: '岁'
                                }, {
                                    text: '月',
                                    value: '月'
                                }, {
                                    text: '天',
                                    value: '天'
                                }]
                            },
                        },{
                            label: '身份证号码',
                            name: 'IDCard',
                            widget: 'input',
                            validate: {
                                required: true,
                                IdCard: true
                            },
                            placeholder: "不能为空"
                        },{
                            label: '联系电话',
                            name: 'mobilePhone',
                            widget: 'input',
                            validate: {
                                required: true,
                                maxlengh:11,
                                phone: true
                            },
                            placeholder: "不能为空"
                        },{
                            label: '地址',
                            name: 'address',
                            widget: 'input',
                            cols: 12,
                            placeholder: ""
                        },
                        {
                            label: '慢性疾病史:',
                            name: 'patientHistory',
                            widget: 'radiocheckbox',
                            emptyText : '无',
                            emptyValue : '0',
                            monopolize: true,
                            enum:'EYES_SCREEN_HISTORY'
                        }],
                        tools : {
                            style : 'float:right;margin-top:-50px;',
                            tools:[{
                                label:'登记',
                                widget: 'button',
                                color:  'success',
                                signal : 'SUBMIT'
                            }]
                        },
                    format: (model) => {
                        return model
                    },
                    validate: (model) => {
                        return true;
                    },
                    submit : (model)=>{
                        this.savePatient(model);
                    }
                }
            }
        },
        computed:{
            currentPatientId(){
                return this.$route.params.patientId;
            }
        },
        ready(){
            this.getUploadTaskToken();
            this.$nextTick(()=>{
                $('.eye_screen_container').append('<div style="display:none"><audio id="tipMusic" src="/assets/img/readIDCard.mp3" controls>123</audio></div>');
                $(".patient_list").on("click",(e)=>{
                    if(e.target && e.target.className=="photograph"){
                        this.$refs.camera.open();
                        this.currentCardId = e.target.dataset.id
                    }
                });
            });
            if(!this.patientIDCard){
                this.startReadIDCard();
            }
            EyeScreenStore.getActivityInfo(this.$route.params.activityId).then(res=>{
                this.activityInfo = res;
            });
        },
        beforeDestroy(){
            this.stopReadIDCard();
        },
        methods:{
            getUploadTaskToken() {
                $.ajax({
                    url: '/image-service/screeningOm/receiveTaskToken'
                }).then(res => {
                    this.batchUploadToken = res;
                });
            },
            startBatchUpload() {
                this.batchUploading = true;
                GlobalService.uploadingStatus['screen-eyebottom-batch-upload'] = true;
            },
            batchUploadFinish() {
                $.ajax({
                    url: '/image-service/screeningOm/receiveEnd',
                    type: 'POST',
                    data: {
                        taskToken: this.batchUploadToken
                    }
                }).then(res => {
                    this.getUploadTaskToken();
                    this.batchUploading = false;
                    this.batchUploadProgress = 0;
                    delete GlobalService.uploadingStatus['screen-eyebottom-batch-upload'];
                });
            },
            saomaChange(e){ 
                if(this.batchUploading){
                    Sunset.tip('正在上传，请稍后');
                }else{
                    clearTimeout(this.saomaPre);
                    this.saomaPre = setTimeout(()=>{
                        var code = e.target.value;
                        if(!GlobalService.isUploading()){
                            if (code.indexOf(GlobalService.getSystemConfig().eyesScreenCheckFormQrcode) == 0) {
                                var index = code.lastIndexOf('/');
                                var patientId = code.substr(index + 1);
                                EyeScreenStore.isRegistered({
                                    activityId:this.$route.params.activityId,
                                    patientId: patientId
                                }).then(res=>{
                                    if(res){
                                        Router.go(`/EyeScreen/activity/${this.$route.params.activityId}/${patientId}/edit`)
                                    }else{
                                        Sunset.tip('本次活动未查询到该患者信息', 'warning')
                                    }
                                })
                            }
                        }else{
                            Sunset.tip('正在上传，请稍后');
                        }
                        clearTimeout(this.saomaTimer);
                        this.saomaTimer = setTimeout(()=>{
                            e.target.value = '';
                        },500);
                    },500);
                }
            },
            rightFilter(f) {
                Object.assign(this.filter, f);
                this.$refs.table.search(this.filter);
            },
            savePatient(model){
                var diseaseHistory=0;
                diseaseHistory!=0&&model.patientHistory.split(",").forEach(v=>{
                    diseaseHistory+=parseInt(v);
                });
                var cardPacks=[{viewName:"eyesscreen",entity:JSON.stringify({chronicDisease:diseaseHistory}),digest : '{}',extension:JSON.stringify({chronicDisease:model.patientHistory})}];

                var patient= {
                    name:model.name,
                    sex: model.sex,
                    socialCard: model.medicalCare?model.medicalCare:null,
                    birthday: model.birthday?model.birthday.getTime():null,
                    mobilePhone: model.mobilePhone,
                    idCard: model.IDCard
                }, registration= {};
                var para ={};          
                patient.extension = JSON.stringify({
                    name:model.name,
                    sex: model.sex,
                    socialCard: model.medicalCare?model.medicalCare:null,
                    birthday: model.birthday?model.birthday.getTime():null,
                    mobilePhone: model.mobilePhone,
                    idCard: model.IDCard,
                    patientAge: model.age,
                    address: model.address
                });
                patient.viewName = 'patient';
                patient.hospitalId = GlobalService.getCurrentUserSync().relation.hospital[0].id;
                registration.viewName = 'registration';       
                registration.entity = JSON.stringify({
                    patientType: Sunset.Service.Dictionary.alias('PATIENT_TYPE','PHYSICAL_EXAM'),
                    registeredDate: Date.now(),
                });
                registration.digest = registration.extension = JSON.stringify({
                    patientType: Sunset.Service.Dictionary.alias('PATIENT_TYPE','PHYSICAL_EXAM'),
                    registeredDate: Date.now(),
                    patientAge:model.age,
                    checks:[{
                        deptType: this.activityInfo.checks[0].deptType,
                        value: this.activityInfo.checks[0].value
                    }]
                });
                registration.hospitalId = GlobalService.getCurrentUserSync().relation.hospital[0].id;
                para= {
                    patient: JSON.stringify(patient),
                    registration: JSON.stringify(registration),
                    cardPacks: JSON.stringify(cardPacks),
                    activityRegister: JSON.stringify({
                        activityId: this.$route.params.activityId,
                        systemId: GlobalService.getCurrentUserSync().user.systemId
                    })
                };
                return EyeScreenStore.isRegistered({
                    idCard:model.IDCard,
                    activityId:this.$route.params.activityId
                }).then(res=>{
                    if(!res){
                        return EyeScreenStore.createPatient(para).then(res=>{
                            Sunset.tip("保存成功","success");
                            this.patientIDCard= null; 
                            this.$refs.form.reset();
                            this.$refs.table.refresh();
                        })
                    }else{
                        Sunset.tip("该患者已参加活动","warning");
                    }
                });
            },
            savePhoto(data){
                var a=JSON.parse(data).map(v=>v.result.md5).join(",");
                return Promise.all([MedicalDataStore.getCardsDetailData(this.currentCardId),MedicalDataStore.getCard('eyesscreen')]).then(res=>{
                    var card = res[1];
                    var config = card.config;
                    var cardData = res[0][0];
                    var extension = cardData.extension;
                    extension.eyelidCheck = data;
                    var para={
                        digest: config.digest && config.digest(extension),
                        entity: config.entity && config.entity(extension),
                        extension: extension
                    }
                    return MedicalDataStore.saveCardData({
                        // flowId: cardData.flowId,
                        hospitalId:cardData.hospitalId,
                        patientId: cardData.patientId, //患者ID
                        viewType: card.viewType, //卡片类型，字典信息见说明
                        viewName: card.viewName, //卡片名称
                        dataId: cardData.id, //真实ID
                        entity: Sunset.isObject(para.entity) ? JSON.stringify(para.entity) : para
                            .entity, //卡片实体数据(json字符串)
                        extension: Sunset.isObject(para.extension) ? JSON.stringify(para.extension) :
                            para.extension, //扩展信息，前台任意存储
                        digest: Sunset.isObject(para.digest) ? JSON.stringify(para.digest) : para
                            .digest, //摘要信息
                        registrationRecordId: cardData.registrationRecordId //就诊记录ID
                    }).then(res=>{
                        Sunset.tip("保存成功", "success");
                        this.$refs.table.refresh();
                    });
                })
            },
            refresh(){
                // this.activityList = data;
            },
            startReadIDCard(){
                this.stopReadIDCard();
                this.IDCardAutoInputTimer = setInterval(()=>{
                    Base.getIDCardInfo().then((res)=>{
                        if(res){
                            var audio = document.getElementById("tipMusic");
                            audio.play();
                            if(!this.patientIDCard || this.patientIDCard != res.number){
                                var IDCardInfo = Object.assign({},res);
                                this.$refs.form.reset({
                                    name: IDCardInfo.name,
                                    sex: IDCardInfo.sex,
                                    age: IDCardInfo.age,
                                    IDCard: IDCardInfo.number,
                                    birthday: IDCardInfo.birthday,
                                    medicalCare: 'village_cooper',
                                    address: IDCardInfo.addr
                                })
                            };
                            this.patientIDCard = res.number;
                        }
                    })
                },2000);
            },
            stopReadIDCard(){
                this.patientIDCard= null; 
                clearInterval(this.IDCardAutoInputTimer);
            },
            patientDetail(ids){
                Router.go(`${this.$route.path}/${ids}/edit`);
            },
            back() {
                window.history.back(-1);
            },
            print(data){
                return EyeScreenStore.PatientIdQuery(data.activityRegister.id).then(res=>{
                    GlobalService.CommonPrint('print-template-eyesscreenform',{
                            patientName: JSON.parse(res.patient.extension).name,
                            patientSex: Sunset.Service.Dictionary.transcode('SEX',JSON.parse(res.patient.extension).sex),
                            patientAge: JSON.parse(res.patient.extension).patientAge.replace(',',""),
                            hospitalName: GlobalService.getCurrentUserSync().relation.hospital[0].name,
                            patientId: res.activityRegister.number,
                            idCard: JSON.parse(res.patient.extension).idCard,
                            checks:[{
                                deptType: JSON.parse(res.registration.extension).checks[0].deptType,
                                value: JSON.parse(res.registration.extension).checks[0].value
                            }],
                            patientUrl: GlobalService.getSystemConfig().eyesScreenCheckFormQrcode + '/' + res.patient.patientId,
                            eyesBottomCheckRightUrl: res.qrCodeData.EyeScreen_RightGroundFile,
                            eyesBottomCheckLeftUrl: res.qrCodeData.EyeScreen_LeftGroundFile
                        })
                })
            }
        },
        watch:{
            currentPatientId(v){
                if (!v) {
                    this.$refs.table.refresh();
                    this.startReadIDCard();
                }else{
                    this.stopReadIDCard();
                }
            }
        }
    }
</script>