<style lang="sass">
    .prescription-cardview-container {
        color: #333333;
        &>h3 {
            color: #8d8d8d;
            font-weight: 500;
            >span{
                font-size: 1rem;
                font-weight: normal;
            }
        }
        .prescriptions-wrap {
            padding: 20px;
            border: 1px solid #ccc;
            border-radius: 10px;
            .prescriptions {
                font-size: 14px;
                &:not(:last-child) {
                    border-bottom: 1px dashed #CCC;
                    padding-bottom: 10px;
                }
                .prescription-title {
                    padding: 15px 0px;
                    h4 {
                        display: inline-block;
                        font-weight: bold;
                        font-size: 16px;
                    }
                    label {
                        display: inline-block;
                        padding: 2px 10px;
                        margin-left: 20px;
                    }
                }
                table {
                    display: block;
                    margin-left: 20px;
                    margin-bottom: 5px;
                    border-left: 2px solid rgba(255, 255, 255, 0);
                    &.group-prescriptions {
                        border-left: 2px solid #666;
                        td {
                            vertical-align: top;
                        }
                    }
                    span {
                        display: inline-block;
                        padding: 00px 20px 5px 0px;
                    }
                    td {
                        vertical-align: top;
                        &.drug-name {
                            width: 200px;
                            text-align: left;
                            padding-right: 25px;
                            padding-left: 10px;
                        }
                    }
                }
            }
            .other-remark {
                font-size: 14px;
                padding: 5px 20px;
                color: #777;
            }
        }
        .viewbtn{
            margin-top: 10px;                    
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
</style>

<template>
    <div class="prescription-cardview-container">
        <sunset-toolbar class="viewbtn" style="margin-top:0px; float:right" :options="recordTools" ></sunset-toolbar>         
        <h3 >医嘱  <span> ({{card.lastModifyDate | time 'yyyy/MM/dd HH:mm'}}  {{card.creator.name}}编辑) </span></h3>
        <h2 style="padding:15px 0;font-size:14px;">
            <label>初步诊断：</label>
            <span style="color:#06F;font-weight: 400;font-family: '微软雅黑 Regular', '微软雅黑';">
                {{data&&data.tentativeDiagnosis}}
            </span>
        </h2>
        <div class="prescriptions-wrap">
            <div class="prescriptions" v-for="prescription in prescriptions">
                <div class="prescription-title">
                    <h4>处方{{$index+1}}</h4>
                    <label :style="markerStyle(prescription.marker)">{{prescription.marker}}</label>
                    <i-button v-if="isAssistant" type="primary" style="margin-left:20px;padding: 5px 15px;" @click="printPrescription(prescription)">打印</i-button>
                </div>
                <table :class="[pgroup.length>1?'group-prescriptions':'']" v-for="pgroup in prescription.groups">
                    <tr v-for="drug in pgroup">
                        <td class="drug-name">
                            <div>
                                {{drug.name}}
                            </div>
                        </td>
                        <td>
                            <div v-for="infos in drug.infos">
                                <span v-for="info in infos">{{info}}</span>
                            </div>
                        </td>
                    </tr>
                </table>
                <p v-for="item in items" track-by="$index">
                    <label>{{item.label}}</label>
                    <span>{{item.value}}</span>
                </p>
                <div class="other-remark">
                    其他说明 : {{prescription.entrust||'无'}}
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    export default {
        props: {
            card: {

            },
            data: {

            },
            visitings:{

            },
            patient:{

            }
        },
        data() {
            return {
                recordTools: {
                        tools: [
                            {
                            label: '编辑 ',
                            icon: 'ios-pricetags',
                            color: 'info',
                        premise: () => {
							return (GlobalService.getCurrentUserSync().user.userId == this.card.creatorId);
						},
                        operate: () => {
                            this.$emit('edit-card');
                        }
                    },{
						label: '删除',
                        color: 'info',
                        icon: 'android-delete',
						premise: () => {
							return (GlobalService.getCurrentUserSync().user.userId == this.card.creatorId);
						},
						operate: () => {
                            this.$emit('remove-card');
						}
                    }
                    ]
                } 
            }
        },
        computed: {
            labels() {
                return this.data.labels || [];
            },
            prescriptions() {
                return this.data && this.data.prescriptions && this.data.prescriptions.medicine.map(prescription => {
                    var groupMap = {};
                    var groups = [];
                    prescription && prescription.medicines && prescription.medicines.forEach(item => {
                        if (!item.name) {
                            return;
                        }
                        var drug = {
                            name: item.name,
                            infos: [
                                [item.totalWeight && item.totalWeight.replace(',', ''), item.specification],
                                [item.useMethod, item.useFrequency, item.perWeight && item.perWeight
                                    .replace(',', '')
                                ]
                            ]
                        };
                        if (!item.groupNo || item.groupNo == 0) {
                            groups.push([drug]);
                        } else {
                            if (groupMap[item.groupNo]) {
                                groupMap[item.groupNo].push(drug);
                            } else {
                                groupMap[item.groupNo] = [drug];
                                groups.push(groupMap[item.groupNo]);
                            }
                        }
                    });
                    return {
                        marker: prescription.marker,
                        entrust: prescription.entrust,
                        groups: groups
                    };
                }) || [];
            },
            isAssistant() {
                return true//GlobalService.getCurrentUserSync().user.userType == Sunset.Service.Dictionary.alias(
                   // 'SYSTEM_ACCOUNT_TYPE', 'ASSISTANT');
            }
        },
        methods: {
            printPrescription(prescription) {
                var patient = this.patient,visiting;
                this.visitings.forEach(v=>{
                    if(this.card.registrationRecordId == v.registrationRecordId){
                        visiting = v.extension;
                    }
                });
                GlobalService.CommonPrint('print-template-prescription', {
                    hospital: GlobalService.getCurrentUserSync().relation.hospital[0].name,
                    subTitle: '处方签',
                    tag: `${prescription.marker||'普通'}处方`,
                    labels: [{
                        label: '编号',
                        value: visiting?visiting.patientNumber:''
                    }, {
                        label: '姓名',
                        value: patient&&patient.name
                    }, {
                        label: '性别',
                        value: patient&&Sunset.Service.Dictionary.transcode('SEX', patient.sex)
                    }, {
                        label: '年龄',
                        value: visiting?visiting.patientAge&&visiting.patientAge.replace(',', '') :''
                    }, {
                        label: '病人类型',
                        value: Sunset.Service.Dictionary.transcode('PATIENT_TYPE', visiting?visiting.patientType:'')
                    }, {
                        label: '科室',
                        value: visiting?visiting.registeredDept:''
                    }, {
                        label: '日期',
                        value: Sunset.Dates.format(new Date(+this.card.createDate), 'yyyy-MM-dd')
                    }],
                    groups: prescription.groups,
                    clinicalDiagnose: this.data.tentativeDiagnosis,
                    otherRemark: prescription.entrust,
                    diagnoseDoctor: this.card.digest.userName,
                    createDate: Sunset.Dates.format(new Date(+this.card.createDate), 'yyyy-MM-dd')
                });
            },
            markerStyle(marker) {
                return {
                    '普通': 'background:#FFF;border: 1px solid #333;',
                    '急诊': 'background:#FEEBAD;',
                    '儿科': 'background:#ACF4B1;',
                    '麻醉': 'background:#FEC5D1;'
                }[marker];
            }
        },
    }
</script>