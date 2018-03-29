<style lang="sass">
.RemoteDetail{
    .consultation_bar{
        height:60px;
        padding: 15px;
        width: 100%;
        background: #fff;
    }
    .vv-content {
        // position: absolute;
        // top: 60px;
        // left: 0px;
        // right: 0px;
        // bottom: 0px;
        border: 5px solid transparent;
        overflow: auto;
        .vv-card-view {
            width: 100%;
            padding: 10PX;
            background: #FFF;
            border: 1px solid #E1E1E1;
            box-shadow: 2px 2px 5px #ddd;
            margin-bottom: 5px;
            .history-bodycheck-view>h3,.video-card-view>h3{
                    color:#8d8d8d;
                    font-weight: 500;
                    span{
                    font-size: 1rem;
                    font-weight: normal;
                }
            }
            .viewbtn{
                margin-top: -45px;                    
                    .sunset-toolbar-item button{
                background:none;
                border:none;
                color:#4fb79f;
                padding:6px 10px;
                font-size: 15px;
                    span{
                    text-decoration: underline;
                    }
                }
                :hover > button{
                    color:black;
                }
            }
        }
        table {
            margin-top:-10px;
            tr{
            }
            width: 100%;
            border-collapse: collapse;
            td {
                border: 1px solid #CCC;  
                padding: 10px;
                &.label {
                    background: #F2F2F2;
                    font-weight: bold;
                    width: 100px;
                    padding: 15px 5px;
                    text-align: left;
                }
                &.short-value {}
            }
        }
    }
}
</style>
<template>
    <div class="RemoteDetail">
        <sunset-toolbar :id="flow.id" class="consultation_bar RemoteDetailbar " v-ref:form :options="toolbarOptions"></sunset-toolbar>
        <div class="vv-content">
                    <!-- {{patient | json}}
                {{flow | json}} -->
            <div class="vv-card-view">
                <md-dicomarchives-view v-if="dicom" :patient="patient" :card="dicom" :data="dicom.extension" :flow="flow" @edit-card="editCard(dicom)" @remove-card="removeCard(dicom)"  @visiting="activeVisiting" ></md-dicomarchives-view>
                <!-- <table >
                    <tr v-show="data.flow.isRequestVideo">
                        <td class="label">预约视频时间</td>
                        <td>{{data.flow.videoStartDate | time 'yyyy/MM/dd'}}</td>
                    </tr>
                </table> -->
           <!-- {{data.flow.videoStartDate | time 'yyyy/MM/dd'}} -->
            </div>
            <div v-for="card in cards" :class="['vv-card-view',card.viewName]">
                <component :is="'md-'+card.viewName+'-view'" :visiting="visiting" :card="card" :data="card.extension" @edit-card="editCard(card)" @remove-card="removeCard(card)"></component>
            </div>
        </div>
    </div>
</template>
<script>
    import DicomStore from './Store.js';
    import MedicalDataStore from '../../MedicalData/MedicalDataStore.js';

    export default {
        props: {
            data : {},
            patient:{},
            flow : {}
        },
        data() {
            return {
                dicom : null,
                visiting : null,
                cards:[],//v-for 这里加了个cards
                toolbarOptions: {
                    align: 'center',
                    tools: [{
						label: '写报告',
                        color: 'ghost',
                        icon: 'android-add',
                        premise: () => {
                            var hospid = GlobalService.getCurrentUserSync().relation.teams;
                            for(var i=0;i<hospid.length;i++){
                                if(this.flow.targetEntityId==hospid[i].id){
                                    return true;
                                }
                            }
                            // GlobalService.getCurrentUserSync().relation.hospital[0].id;
                            return (GlobalService.getCurrentUserSync().user.userId == this.flow.targetEntityId)||(GlobalService.getCurrentUserSync().relation.hospital[0].id==this.flow.targetEntityId)||(GlobalService.getCurrentUserSync().relation.office&&GlobalService.getCurrentUserSync().relation.office.id==this.flow.targetEntityId);
						},
						operate: () => {
                            var dicomfile = JSON.parse(this.flow.extension.extension.dicomfile)
                            GlobalService.openCateyesWindow(`/cwindow.html?id=${dicomfile.listId}&which=dicom-service&show=true`);
                            this.addCard('dicomreport','阅片报告')
						}
                    }
                    ]
                }
            }
        },
        ready(){
            var flow = this.flow;
            //影像
            Promise.all([
                MedicalDataStore.getCardsDetailData(this.flow.extension.cardId),
                MedicalDataStore.getVisitingcardsByRecordids(this.flow.extension.registrationRecordId)
            ]).then(res=>{
                this.dicom = res[0]&& res[0][0]||{};
                this.visiting = res[1]&& res[1][0]||{};
                this.refresh();
            });
            this.data.refresh = () => {
                this.refresh();
            }
            // if($( ".RemoteDetailbar:has(button)" ).length==0){
            if($( "#"+this.flow.id+":has(button)" ).length==0){
                $("#"+this.flow.id+"").hide();
                // $(".RemoteDetail .vv-content").css("top","0px");
            }else{
                // $(".RemoteDetail .vv-content").css("top","60px");
                }
            // $(".RemoteDetailbar").html()=="  "?$(".RemoteDetail").hide():$(".RemoteDetail").show();
        },
        computed: {
            safeData() {
                console.log("isRequestVideo");
                console.log(this.data)
                return this.data || {};
            },
            flowInfo() {
                // console.log(this.safeData);                                
                // console.log(JSON.parse(this.safeData.flow.extension))
                return JSON.parse(this.safeData.flow.extension);
            },
            dicomfile() {
                // console.log(JSON.parse(this.flow.dicomfile))
                return JSON.parse(this.flow.dicomfile);
            },
            study(){
                return this.flowInfo.dicomfile ? JSON.parse(this.flowInfo.dicomfile) : {};
            },
            attachments() {
                var accessories = flowInfo.accessories;
                // console.log(this.safeData);
                if (accessories) {
                    try {
                        return JSON.parse(accessories);
                    } catch (e) {
                        return [];
                    }
                }
            }
        },
        methods: {
            refresh(){
                DicomStore.getCards(this.flow.id).then(res=>{
                    this.cards=res.map(item=>{
                        if(item.extension){
                            item.extension = JSON.parse(item.extension)
                        }
                        if(item.digest){
                            item.digest = JSON.parse(item.digest)
                        }
                        item.patient = this.patient;
                        item.visiting = this.visiting.extension;
                        return item
                    })
                })
            },
            addCard(viewName,tabName){
                var flowExtension = this.flow.extension;
                this.$emit('edit-card', {
                    lastModifyDate: 0,
                    viewName: viewName,
                    flowId : this.flow.id,
                    patientId: this.patient.patientId,
                    digest: {
                        dicomArchivesId:flowExtension.cardId,
                        checkMethod:flowExtension.extension.checkMethod,
                        checkPoints:flowExtension.extension.checkPoints,
                        dicomfile:flowExtension.extension.dicomfile,
                        position:flowExtension.extension.position,
                        series:flowExtension.extension.series,
                    },
                    _editing: true,
                    _dirty: true
                }, tabName,this.flow);
            },
            editCard(card){
                MedicalDataStore.getCard(card.viewName).then(cardTemplate=>{
                    this.$emit('edit-card',card, cardTemplate.viewLabel);
                });
            },
            removeCard(card){
                var clear = Sunset.confirm({
                    content: '确定删除此资料？',
                    loading: true,
                    onOk: () => {
                        MedicalDataStore.removeCards(card.id).then(res=>{
                            this.$emit('refresh');
                        });
                        clear();
                    }
                });
            },
            activeVisiting(rid){
                MedicalDataStore.getVisitingcardsByRecordids(rid).then(res=>{
                    res&&res.length&&this.$emit('visiting', res[0]);
                });
            }
        }
    }
</script>