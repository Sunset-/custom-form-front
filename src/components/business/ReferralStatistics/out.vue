<style lang="sass">
    .rf-st-out {
        .rs-counter {
            &>div {
                height: 130px;
            }
        }
        .rs-detail {
            &>h4 {
                font-family: 'Arial Negreta', 'Arial';
                font-weight: 700;
                font-style: normal;
                font-size: 14px;
                color: #444;
                padding: 10px 0px;
            }
        }
        .sc-detail-link {
            text-decoration: underline;
        }
    }
</style>

<template>
    <div class="referral-statistics rf-st-out">
        <!-- 医院 -->
        <div class="rs-title">
            全院情况
        </div>
        <div class="rs-filter">
            <sunset-filter :options="hospitalFilterOptions" @filter="refreshHospital"></sunset-filter>
        </div>
        <div class="rs-counter">
            <div class="normal-count">
                <div class="nc-first">
                    <p class="sc-title">转出申请</p>
                    <p class="sc-count">{{hospitalDigest.applied}}</p>
                </div>
                <div>
                    <div v-for="item in hospitalDigest.appliedGroupByReferralType">{{item.referralType | enum 'REFERRAL_FLOW_TYPE'}}：{{item.num}}</div>
                </div>
            </div>
            <div class="simple-count">
                <label class="sc-title">同意接诊</label>
                <div class="sc-count">{{hospitalDigest.agreed}}</div>
            </div>
            <div class="simple-count">
                <label class="sc-title">确认入院</label>
                <div class="sc-count">{{hospitalDigest.inconfirmed}}</div>
            </div>
        </div>
        <div class="rs-detail">
            <h4>转诊申请</h4>
            <sunset-table v-ref:fromtable :options="fromTableOptions"></sunset-table>
        </div>
        <!-- 科室 -->
        <div class="rs-title">
            科室情况
            <sunset-filter :options="officeSelector" @filter="refreshOffice"></sunset-filter>
        </div>
        <div class="rs-filter">
            <sunset-filter :options="officeFilterOptions" @filter="refreshOffice"></sunset-filter>
        </div>
        <div class="rs-counter">
            <div class="normal-count">
                <div class="nc-first">
                    <p class="sc-title">转出申请</p>
                    <p class="sc-count">{{officeDigest.applied}}</p>
                    <p>
                        <a class="sc-detail-link" href="javascript:;" @click="refreshFlows('applied')">点击查看详情</a>
                    </p>
                </div>
                <div>
                    <div v-for="item in officeDigest.appliedGroupByReferralType">{{item.referralType | enum 'REFERRAL_FLOW_TYPE'}}：{{item.num}}</div>
                </div>
            </div>
            <div class="simple-count">
                <label class="sc-title">同意接诊</label>
                <div class="sc-count">{{officeDigest.agreed}}</div>
                <p>
                    <a class="sc-detail-link" href="javascript:;" @click="refreshFlows('agreed')">点击查看详情</a>
                </p>
            </div>
            <div class="simple-count">
                <label class="sc-title">确认入院</label>
                <div class="sc-count">{{officeDigest.inconfirmed}}</div>
                <p>
                    <a class="sc-detail-link" href="javascript:;" @click="refreshFlows('inconfirmed')">点击查看详情</a>
                </p>
            </div>
        </div>
        <div class="rs-detail">
            <h4>转诊申请</h4>
            <sunset-table v-ref:flowtable :options="flowTableOptions"></sunset-table>
        </div>
    </div>
</template>
<script>
    import dateFilterFactory from './dateFilterOptions.js';
    import Store from './Store.js';

    export default {
        methods: {
            refreshHospital(filter) {
                if (!GlobalService.getCurrentUserSync().relation.hospital[0].id) {
                    return;
                }
                if (filter == 'SKIP') {
                    return;
                }
                Store.out(Object.assign({
                    fromEntityId: GlobalService.getCurrentUserSync().relation.hospital[0].id,
                    fromEntityType: Sunset.Service.Dictionary.alias('ORG_CODE', 'HOSPITAL')
                }, filter)).then(res => {
                    //digest
                    this.hospitalDigest = res.digest;
                    //from
                    this.$refs.fromtable.setData(res.deptList);
                    this.officeSelector.fields[0].data = res.deptList.map(item => ({
                        text: item.entity.name,
                        value: item.entity.id
                    }));
                });
            },
            refreshOffice(filter) {
                if (filter == 'SKIP') {
                    return;
                }
                // delete this.officeFilter.startTime;
                // delete this.officeFilter.endTime;
                Object.assign(this.officeFilter, filter);
                if (this.officeFilter.fromEntityId) {
                    Store.out(this.officeFilter).then(res => {
                        //digest
                        this.officeDigest = res.digest;
                        //from
                        this.$refs.flowtable.search(Object.assign(Sunset.clone(this.officeFilter), {
                            queryType: Sunset.Service.Dictionary.alias('REFERRAL_QUERY_TYPE', 'OUT'),
                            statType: 'applied',
                            // startTime:this.officeFilter.startTime,
                            // endTime:this.officeFilter.endTime,
                        }));
                    });
                }
            },
            refreshFlows(statType) {
                this.$refs.flowtable.search(Object.assign(Sunset.clone(this.officeFilter), {
                    queryType: Sunset.Service.Dictionary.alias('REFERRAL_QUERY_TYPE', 'OUT'),
                    statType: statType
                }));
            }
        },
        data() {
            return {
                hospitalFilterOptions: dateFilterFactory(),
                hospitalDigest: {
                    agreed: 0,
                    applied: 0,
                    appliedGroupByReferralType: [],
                    inconfirmed: 0,
                    contacted: 0,
                    inTriage: 0,
                    unTriage: 0
                },
                officeSelector: {
                    fields: [{
                        name: 'fromEntityId',
                        widget: 'select',
                        placeholder: '请选择科室',
                        changeFilter: true,
                        style: 'min-width:120px;margin-left:10px;',
                        defaultFirst: true,
                        data: []
                    }]
                },
                officeFilter: {},
                officeFilterOptions: dateFilterFactory(),
                officeDigest: {
                    agreed: 0,
                    applied: 0,
                    appliedGroupByReferralType: [],
                    inconfirmed: 0,
                    contacted: 0,
                    inTriage: 0,
                    unTriage: 0
                },
                fromTableOptions: {
                    columns: [{
                        title: '科室',
                        name: 'entity.name'
                    }, {
                        title: '申请数量',
                        name: 'applied',
                        align: 'center'
                    }, {
                        title: '同意数量',
                        name: 'agreed',
                        align: 'center'
                    }, {
                        title: '入院数量',
                        name: 'inconfirmed',
                        align: 'center'
                    }],
                    recordTools: [],
                    pageNumberStart: 0,
                    lazy: true,
                    localPage: true,
                    format: {
                        list: '',
                        count: 'length',
                        pageSize: 'pageSize',
                        currentPage: 'pageNumber'
                    },
                    datasource: (filter) => {}
                },
                flowTableOptions: {
                    columns: [{
                            title: '患者',
                            name: 'patient.name'
                        }, {
                            title: '性别',
                            name: 'patient.sex',
                            enum: 'SEX',
                            align: 'center'
                        }, {
                            title: '年龄',
                            name: 'registration.digest.patientAge',
                            format(v) {
                                if (v) {
                                    return v.split(',').join('');
                                } else {
                                    return '-';
                                }
                            },
                            align: 'center'
                        }, {
                            title: '转诊类型',
                            name: 'flow.referralType',
                            enum: 'REFERRAL_FLOW_TYPE',
                            align: 'center'
                        }, {
                            title: '初步诊断',
                            name: 'flow.extension.diagnose'
                        }, {
                            title: '拟转至',
                            name: 'flow.target',
                            format(v) {
                                if (v) {
                                    var prefix = '';
                                    if (v.uppers) {
                                        prefix = v.uppers.map(item => item.name);
                                        prefix.reverse();
                                        if (prefix.length) {
                                            prefix = prefix.join(' - ') + ' - ';
                                        }
                                    }
                                    return prefix + v.name;
                                } else {
                                    return '';
                                }
                            }
                        },
                        {
                            title: '提交人',
                            name: 'flow.applyUser.name'
                        },
                        {
                            title: '提交日期',
                            name: 'flow.applyDate',
                            format: 'DATETIME',
                            style: 'width:160px',
                            align: 'center'
                        },
                        {
                            title: '审核人',
                            name: 'flow.currentOutReviewer',
                            format(v) {
                                if (v) {
                                    return v.name;
                                } else {
                                    return '【自动审核】';
                                }
                            }
                        },
                        {
                            title: '审核日期',
                            name: 'flow.outReviewDate',
                            format: 'DATETIME',
                            style: 'width:160px',
                            align: 'center'
                        }
                    ],
                    recordTools: [],
                    pageNumberStart: 0,
                    lazy: true,
                    localPage: false,
                    format: {
                        list: 'rows',
                        count: 'totalCount',
                        pageSize: 'pageSize',
                        currentPage: 'pageNumber'
                    },
                    datasource: (filter) => {
                        return Store.detail(filter);
                    }
                }
            }
        }
    }
</script>