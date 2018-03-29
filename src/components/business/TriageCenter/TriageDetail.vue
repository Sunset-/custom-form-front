<style lang="sass">
    .triage_patient_edit_page {
        display: flex;
        height: 100%;
        color: #333;
        .patient_card_bar {
            width: 302px;
            height: 100%;
            background-color: #f2f2f2;
            flex: none;
            border-right: 2px solid #eee;
            position: relative;
            overflow: hidden;
            .detail_base_info {
                padding: 10px 0;
                text-align: center;
                height: 100px;
                width: 302px;
                border-bottom: 1px solid #ccc;
                .base_info1 {
                    height: 30px;
                    line-height: 30px;
                    .patient_name {
                        display: inline-block;
                        margin-right: 10px;
                        font-size: 16px;
                        font-weight: 600;
                        vertical-align: middle;
                        width: 130px;
                        white-space:nowrap;
                        overflow:hidden;
                        text-overflow:ellipsis;
                    }
                }
                .tel_id {
                    font-size: 12px;
                    height: 25px;
                    line-height: 25px;
                }
            }
            .visiting_records_box {
                overflow: auto;
                position: absolute;
                padding: 10px 15px 0 10px;
                top: 100px;
                bottom: 78px;
                width: 302px;
                .card_title > label:after{
                    display:none;
                }
            }
            .detail_content_info {
                position: absolute;
                top: 78px;
                left: 0;
                bottom: 78px;
                overflow-y: scroll;
                width: 302px;
                padding: 10px 15px;
                text-align: center;
                .detail_content_title {
                    background-color: #0099ff;
                    width: 270px;
                    height: 40px;
                    line-height: 40px;
                    border-radius: 40px;
                    color: #fff;
                }
                .content_footer {
                    background-color: #e4e4e4;
                    color: #666;
                    padding: 5px 0;
                    p {
                        height: 15px;
                        line-height: 15px;
                        font-size: 12px;
                    }
                }
                .detail_content_status {
                    position: absolute;
                    top: 0;
                    left: 15px;
                    width: 40px;
                    height: 18px;
                    line-height: 18px;
                    background-color: #4bb6fe;
                    border-radius: 3px;
                    color: #fff;
                }
                .status_footer {
                    background-color: #999;
                }
                .btn_info {
                    height: 30px;
                    width: 225px;
                    padding-left: 10px;
                    cursor: pointer;
                    &>div {
                        width: 100px;
                        height: 30px;
                        line-height: 30px;
                        float: left;
                        text-align: center;
                        border-radius: 5px;
                        background-color: #fff;
                        border: 1px solid #999;
                    }
                    .history_info {
                        margin-right: 15px;
                    }
                    .body_check {}
                }
            }
        }
        .btn_bar {
            background: #f2f2f2;
            position: absolute;
            left: 302px;
            right: 0;
            padding: 12px;
            z-index: 1;
            &>div {
                float: left;
                text-align: center;
                margin-left: 30px;
            }
            &>.btn_back {
                margin-left: 0px;
                width: 60px;
                height: 36px;
                line-height: 36px;
                border: 1px solid #666;
                border-radius: 3px;
                background: #fff;
                cursor: pointer;
            }
            &>.btn_List {
                float: right;
                margin-right: 0px;
            }
        }
        .triage_patient_content {
            flex: 1;
            height: 100%;
            padding: 10px 20px;
            overflow: hidden;
            position: relative;
            .info_table {
                margin-top: 55px;
                position: relative;
                background-color: #fff;
                z-index:3;
                &:after{
                    content: "";
                    width:100%;
                    position:absolute;
                    bottom:15px;
                    border-bottom: 1px solid #ccc;
                    z-index:4;
                }
                p {
                    height: 30px;
                    line-height: 30px;
                    color:#999;
                }
                .table_field {
                    overflow: hidden;
                    div {
                        height: 25px;
                        line-height: 25px;
                        width: 25%;
                        float: left;
                        overflow: hidden;
                        label {
                            font-weight: 600;
                        }
                    }
                }
                .info_table_more {
                    width: 100px;
                    height: 30px;
                    line-height: 30px;
                    position: relative;
                    left: 50%;
                    z-index:5;
                    margin-left: -50px;
                    text-align: center;
                    background-color: #fff;
                    cursor: pointer;
                    color: #999;
                }
            }
            .card_page {
                padding: 0 20px 20px 20px;
                overflow-y: scroll;
                position: absolute;
                top: 175px;
                bottom: 0;
                right: 0;
                left: 0;
            }
        }
    }
</style>
<template>
    <div class="triage_patient_edit_page">
        <expert-selector v-ref:selector @submit="submitTeams"></expert-selector>
        <div class="patient_card_bar">
            <div class="detail_base_info">
                <div class="base_info1">
                    <span class="patient_name" :title='patientData.name'>{{patientData.name}}</span>
                    <span>{{patientData.sex | enum 'SEX'}} / {{patientAge}}</span>
                </div>
                <div class="tel_id">Tel：{{patientData.mobilePhone}}</div>
                <div class="tel_id">ID：{{patientData.idCard}}</div>
            </div>
            <!--visit doctor组件  -->
            <div class="visiting_records_box">
                <visiting-records v-ref:records :patient="patientCardData.extension" @detail="showDetail" @visiting="getVistingData"></visiting-records>
            </div>
        </div>
        <div class="btn_bar">
            <i-button @click="back" style="backgroud:#FFF;">返回</i-button>
            <div v-show="registrationStatus" class="btn_List">
                <medicaldata-toolbar @new-card="newCard"></medicaldata-toolbar>
            </div>
        </div>
        <div class="triage_patient_content">
            <div class="info_table">
                <p>基本信息</p>
                <div class="table_field">
                    <div v-for="item in getPatientData">
                        <label>{{item[0]}}：</label>
                        <span>{{item[1]}}</span>
                    </div>
                </div>
                <div class="info_table_more" @click="showMore">查看更多 +</div>
            </div>
            <div v-show="current == null" class="card_page">
                <medicaldata-detail v-ref:detail @add-card="addCard" @signal="operateSignal"></medicaldata-detail>
            </div>
        </div>
    </div>
</template>
<script>
    import TriageCenterStore from "./TriageCenterStore.js"
    import MedicalDataStore from "../MedicalData/MedicalDataStore.js";
    import VisitingRecord from "../MedicalData/VisitingRecord";
    import ExpertSelector from "../TeamDoctorSelector/TeamDoctorSelector";
    export default {
        components: {
            VisitingRecord,
            ExpertSelector
        },
        data() {
            return {
                registrationStatus:false,
                hospitalData:null,
                current: null,
                patientCardData: {},
                visitingData: {},
                isShowMore: false,
                infoShowList: [
                    ['name', '姓名', 'patientData'],
                    ['sex', '性别', 'patientData', 'SEX'],
                    ['patientAge', '年龄', 'visitingData','AGE'],
                    ['mobilePhone', '电话', 'patientData'],
                    ['patientNumber', '患者编号', 'visitingData'],
                    ['registeredDate', '就诊日期', 'visitingData','DATE'],
                    ['registeredDept', '科室', 'visitingData'],
                    ['idCard', '身份证号码', 'patientData']
                ],
                infoShowMore: [
                    ['name', '姓名', 'patientData'],
                    ['sex', '性别', 'patientData', 'SEX'],
                    ['patientAge', '年龄', 'visitingData','AGE'],
                    ['mobilePhone', '电话', 'patientData'],
                    ['patientNumber', '患者编号', 'visitingData'],
                    ['registeredDate', '就诊日期', 'visitingData','DATE'],
                    ['registeredDept', '科室', 'visitingData'],
                    ['idCard', '身份证号码', 'patientData'],
                    ['birthday', '出生日期', 'patientData', 'BIRTHDAY'],
                    ['socialCard', '医保', 'patientData', 'MEDICARE'],
                    ['patientType', '患者类型', 'visitingData', 'PATIENT_TYPE']
                ],
                patientInfoList: [
                    ['name', '姓名', 'patientData'],
                    ['sex', '性别', 'patientData', 'SEX'],
                    ['patientAge', '年龄', 'visitingData','AGE'],
                    ['mobilePhone', '电话', 'patientData'],
                    ['patientNumber', '患者编号', 'visitingData'],
                    ['registeredDate', '就诊日期', 'visitingData','DATE'],
                    ['registeredDept', '科室', 'visitingData'],
                    ['idCard', '身份证号码', 'patientData']
                ]
            }
        },
        props: {
            patient: ""
        },
        ready() {
            this.$refs.records.refresh(this.$route.params.patientId);
            MedicalDataStore.getCardsDetailData(this.$route.params.patientId).then((res) => {
                this.$emit("refresh");
                this.patientCardData = res[0];
                var patientData = this.patientCardData.extension || {};
                var demographic = Object.keys(patientData).filter(value=>value.indexOf("demographic")==0);
                if(demographic.length){
                    demographic.map(v=>{
                        this.infoShowMore.push([v,patientData[v].split(",")[0],"patientData","extension"])
                    })
                };
                TriageCenterStore.getFlow(this.$route.params.flowId).then(res=>{
                    if(!(res.status == Sunset.Service.Dictionary.alias('RegistrationRecordStatus','Finsih'))){
                        this.registrationStatus = true;
                    }
                })
            });
        },
        computed: {
            safePatient() {
                return this.patient || {};
            },
            patientData() {
                return this.patientCardData.extension || {};
            },
            patientAge(){
                if(this.visitingData.digest && this.visitingData.digest.patientAge){
                    return this.visitingData.digest.patientAge.split(",").join("")
                }
            },
            getPatientData() {
                var patientData = this.patientCardData.extension || {};
                var visitingData = this.visitingData.digest || {};
                var allData = [];
                this.patientInfoList.forEach((item) => {
                    if (item[2] == 'patientData') {
                        var data = [];
                        data.push(item[1]);
                        if (item[3] && item[3] == 'SEX') {
                            data.push(Sunset.Service.Dictionary.transcode(item[3], patientData[item[0]]))
                        }else if(item[3] && item[3]=='BIRTHDAY'){
                            var birthday = Sunset.Dates.format(patientData[item[0]],'yyyy-MM-dd');
                            data.push(birthday)
                        }else if(item[3] && item[3]=='MEDICARE'){
                            data.push(Sunset.Service.Dictionary.transcode(item[3], patientData[item[0]]));
                        }else if(item[3] && item[3]=='extension'){
                            data.push(patientData[item[0]].split(",")[1])
                        } else {
                            data.push(patientData[item[0]])
                        }
                        allData.push(data)
                    } else if (item[2] == 'visitingData') {
                        var data = [];
                        data.push(item[1]);
                        if (item[3] && item[3] == 'PATIENT_TYPE') {
                            data.push(Sunset.Service.Dictionary.transcode(item[3], visitingData[item[0]]))
                        }else if(item[3] && item[3]=='DATE'){
                            var visitingDate = Sunset.Dates.format(visitingData[item[0]],'yyyy-MM-dd');
                            data.push(visitingDate)
                        }else if(item[3] && item[3]=='AGE'){
                            var age = Object.keys(visitingData).length?visitingData[item[0]].split(",").join(""):'';
                            data.push(age)
                        }else if(item[3] && item[3]=='extension'){
                            data.push(visitingData[item[0]].split(",")[1])
                        }else {
                            data.push(visitingData[item[0]]);
                        }
                        allData.push(data)
                    }
                });
                return allData
            }
        },
        methods: {
            submitTeams(para){
                para.hospitalId = GlobalService.getCurrentUserSync().relation.hospital[0].id;
                para.systemId = GlobalService.getCurrentUserSync().user.systemId;
                para.patientId = this.patientCardData.patientId;
                para.applyUserId = GlobalService.getCurrentUserSync().user.userId;
                para.registrationRecordId = this.patientCardData.registrationRecordId; 
                return DoctorPatientStore.getDate().then(res=>{
                    if(res){
                        para.applyDate = res;
                        DoctorPatientStore.saveExperts(para).then(res=>{
                            Sunset.tip('提交成功', 'success');
                            this.$refs.selector.cancel();
                        })
                    }
                })
            },
            getVistingData(data) {
                this.visitingData = data;
                var visitingData = this.visitingData.digest || {};
                var registration = Object.keys(visitingData).filter(value=>value.indexOf("registration")==0);
                if(registration.length){
                    registration.map(v=>{
                        this.infoShowMore.push([v,visitingData[v].split(",")[0],"visitingData","extension"])
                    })
                };
            },
            showMore() {
                if (this.isShowMore == false) {
                    this.patientInfoList = this.infoShowMore;
                    this.isShowMore = true;
                    var h = 110;
                    this.$nextTick(() => {
                        h = parseInt($('.info_table').height()) + 65;
                        $('.card_page').css('top', h);
                        $('.info_table_more').text('收 起')
                    });
                } else {
                    this.patientInfoList = this.infoShowList;
                    this.isShowMore = false;
                    $('.card_page').css('top', '175px');
                    $('.info_table_more').text('查看更多 +')
                }
            },
            newCard(viewName, id) {
                this.$refs.records.newCard(viewName, id);
            },
            addCard(card) {
                this.$refs.records.addCard(card);
            },
            showDetail(card) {
                this.$nextTick(() => {
                    this.$refs.detail.set(card);
                })
            },
            back() {
                window.history.back(-1)
            },
            operateSignal(signal, v) {
                if (signal == 'SAVED') {
                    if (v == 'patient') {
                        this.$refs.records.home();
                    }
                } else if (signal == 'HOME') {
                    this.$refs.records.home();
                }
            }
        }
    }
</script>