<style lang="sass">
    .referral-statistics {
        padding: 10px 10px;
        .rs-title {
            height: 50px;
            padding: 0px 10px;
            line-height: 50px;
            font-size: 16px;
            font-weight: bold;
            background: #F2F2F2;
            color: #444;
        }
        .rs-filter {
            padding: 10px 0px;
        }
        .rs-counter {
            &>div {
                display: inline-block;
                vertical-align: top;
                padding: 10px;
                margin-right: 10px;
                height: 150px;
                background: #f2f2f2;
                border: 1px solid #ccc;
                box-sizing: border-box;
                &.normal-count {
                    width: 330px;
                    padding: 10px 20px;
                    &>div {
                        display: inline-block;
                        vertical-align: top;
                        &.nc-first {
                            width: 130px;
                            .sc-title {
                                padding-top: 10px;
                            }
                            .sc-count {
                                text-align: center;
                            }
                            .nc-subtitle {}
                            .nc-subtitle {}
                        }
                    }
                }
                &.simple-count {
                    width: 250px;
                    text-align: center;
                    padding-top: 20px;
                }
                .sc-title {
                    font-family: 'Arial Negreta', 'Arial';
                    font-weight: 700;
                    font-style: normal;
                    font-size: 16px;
                    color: #999999;
                }
                .sc-count {
                    font-size: 36px;
                    color: #2cab8e;
                }
            }
        }
        .rs-detail {
            padding: 5px 0px 10px 0px;
        }
    }
</style>

<template>
    <div class="referral-statistics rf-st-in">
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
                    <p class="sc-title">转入申请</p>
                    <p class="sc-count">{{hospitalDigest.applied}}</p>
                    <p class="nc-subtitle" style="color:#0099FF;">已分诊：{{hospitalDigest.inTriage}}</p>
                    <p class="nc-subtitle" style="color:#FF0000;">未分诊：{{hospitalDigest.unTriage}}</p>
                </div>
                <div>
                    <div v-for="item in hospitalDigest.appliedGroupByReferralType">{{item.referralType | enum 'REFERRAL_FLOW_TYPE'}}：{{item.num}}</div>
                </div>
            </div>
            <div class="simple-count">
                <label class="sc-title">同意接收</label>
                <div class="sc-count">{{hospitalDigest.agreed}}</div>
            </div>
            <div class="simple-count">
                <label class="sc-title">与患者沟通</label>
                <div class="sc-count">{{hospitalDigest.contacted}}</div>
            </div>
            <div class="simple-count">
                <label class="sc-title">实际入院</label>
                <div class="sc-count">{{hospitalDigest.inconfirmed}}</div>
            </div>
        </div>
        <div class="rs-detail">
            <Tabs :animated="false" active-key="TARGET">
                <Tab-pane label="接诊统计" key="TARGET">
                    <sunset-table v-ref:targettable :options="targetTableOptions"></sunset-table>
                </Tab-pane>
                <Tab-pane label="来源统计" key="FROM">
                    <sunset-table v-ref:fromtable :options="fromTableOptions"></sunset-table>
                </Tab-pane>
            </Tabs>
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
                    <p class="sc-title">转入申请</p>
                    <p class="sc-count">{{officeDigest.applied}}</p>
                </div>
                <div>
                    <div v-for="item in officeDigest.appliedGroupByReferralType">{{item.referralType | enum 'REFERRAL_FLOW_TYPE'}}：{{item.num}}</div>
                </div>
            </div>
            <div class="simple-count">
                <label class="sc-title">同意接收</label>
                <div class="sc-count">{{officeDigest.agreed}}</div>
            </div>
            <div class="simple-count">
                <label class="sc-title">与患者沟通</label>
                <div class="sc-count">{{officeDigest.contacted}}</div>
            </div>
            <div class="simple-count">
                <label class="sc-title">实际入院</label>
                <div class="sc-count">{{officeDigest.inconfirmed}}</div>
            </div>
        </div>
        <div class="rs-detail">
            <Tabs :animated="false" active-key="TARGET">
                <Tab-pane label="接诊统计" key="TARGET">
                    <sunset-table v-ref:officetargettable :options="officeTargetTableOptions"></sunset-table>
                </Tab-pane>
                <Tab-pane label="来源统计" key="FROM">
                    <sunset-table v-ref:officefromtable :options="officeFromTableOptions"></sunset-table>
                </Tab-pane>
            </Tabs>
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
                Store.in(Object.assign({
                    targetEntityId: GlobalService.getCurrentUserSync().relation.hospital[0].id,
                    targetEntityType: Sunset.Service.Dictionary.alias('ORG_CODE', 'HOSPITAL')
                }, filter)).then(res => {
                    //digest
                    this.hospitalDigest = res.digest;
                    //target
                    this.$refs.targettable.setData(res.deptList);
                    this.officeSelector.fields[0].data = res.deptList.map(item => ({
                        text: item.entity.name,
                        value: item.entity.id
                    }));
                    //from
                    this.$refs.fromtable.setData(res.fromList);
                });
            },
            refreshOffice(filter) {
                if (filter == 'SKIP') {
                    return;
                }
                // delete this.officeFilter.startTime;
                // delete this.officeFilter.endTime;
                Object.assign(this.officeFilter, filter);
                if (this.officeFilter.targetEntityId) {
                    Store.in(this.officeFilter).then(res => {
                        //digest
                        this.officeDigest = res.digest;
                        //target
                        this.$refs.officetargettable.setData(res.userList);
                        //from
                        this.$refs.officefromtable.setData(res.fromList);
                    });
                }
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
                        name: 'targetEntityId',
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
                targetTableOptions: {
                    columns: [{
                        title: '科室',
                        name: 'entity.name'
                    }, {
                        title: '申请人次',
                        name: 'applied',
                        align: 'center'
                    }, {
                        title: '同意接收',
                        name: 'agreed',
                        align: 'center'
                    }, {
                        title: '沟通数量',
                        name: 'contacted',
                        align: 'center'
                    }, {
                        title: '实际入院',
                        name: 'inconfirmed',
                        align: 'center'
                    }, {
                        title: '同意接收率',
                        name: 'NULL',
                        format(v, record) {
                            return record.applied == 0 ? '-' : ((record.agreed / record.applied * 100.0).toFixed(
                                1) + '%');
                        },
                        align: 'center'
                    }, {
                        title: '实际入院率',
                        name: 'NULL',
                        format(v, record) {
                            return record.applied == 0 ? '-' : ((record.inconfirmed / record.applied * 100.0).toFixed(
                                1) + '%');
                        },
                        align: 'center'
                    }, {
                        title: '沟通占比',
                        name: 'NULL',
                        format(v, record) {
                            return record.applied == 0 ? '-' : ((record.contacted / record.applied * 100.0).toFixed(
                                1) + '%');
                        },
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
                fromTableOptions: {
                    columns: [{
                        title: '来源机构',
                        name: 'entity.name'
                    }, {
                        title: '机构类型',
                        name: 'entity.category',
                        enum: 'ORG_CODE'
                    }, {
                        title: '申请人次',
                        name: 'applied',
                        align: 'center'
                    }, {
                        title: '同意数量',
                        name: 'agreed',
                        align: 'center'
                    }, {
                        title: '实际入院',
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
                officeTargetTableOptions: {
                    columns: [{
                        title: '科室成员',
                        name: 'entity.name'
                    }, {
                        title: '申请人次',
                        name: 'applied',
                        align: 'center'
                    }, {
                        title: '同意接收',
                        name: 'agreed',
                        align: 'center'
                    }, {
                        title: '患者沟通',
                        name: 'contacted',
                        align: 'center'
                    }, {
                        title: '实际入院',
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
                officeFromTableOptions: {
                    columns: [{
                        title: '来源机构',
                        name: 'entity.name'
                    }, {
                        title: '机构类型',
                        name: 'entity.category',
                        enum: 'ORG_CODE'
                    }, {
                        title: '申请人次',
                        name: 'applied',
                        align: 'center'
                    }, {
                        title: '同意数量',
                        name: 'agreed',
                        align: 'center'
                    }, {
                        title: '实际入院',
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
                }
            }
        }
    }
</script>