<style lang="sass">
    .history-bodycheck-view {
        font-size: 14px;
        color: #333;
        &>h3 {
            font-weight: bold;
            padding: 15px 0px;
        }
        &>table {
            width: 100%;
            border-collapse: collapse;
            td {
                padding: 10px;
                border: 1px solid #CCC;
                &.label {
                    background: #F2F2F2;
                    font-weight: bold;
                    width: 100px;
                    padding: 15px 0px;
                    text-align: center;
                }
                &.short-value {}
            }
        }
        .history-table {}
    }
</style>
<template>
    <div class="history-bodycheck-view">
        <h3>病史信息 <span> ({{card.lastModifyDate | time 'yyyy/MM/dd HH:mm'}}  {{card.creator.name}}编辑) </span></h3>
        <sunset-toolbar class="viewbtn" class="viewbtn" v-ref:form style="float:right;padding:10px 0px;" v-show="!editing" :options="toolbarOptions"></sunset-toolbar>
        <table class="history-table">
            <tr v-for="his in history">
                <td class="label">{{his.label}}</td>
                <td>{{his.value}}</td>
            </tr>
        </table>
        <p v-if="!history||history.length==0">
            无
        </p>
    </div>
</template>
<script>
    
    export default {
        props: {
            data: {

            },
            card: {

            },
        },
        data() {
            return {
                stableHistory: [{
                    label: '主诉',
                    name: 'complain'
                }, {
                    label: '现病史',
                    name: 'historyOfPresentIllness'
                }, {
                    label: '既往史',
                    name: 'pastHistory'
                }],
                // stableChecks: [{
                //     label: '身高(cm)',
                //     name: 'height'
                // }, {
                //     label: '体重(kg)',
                //     name: 'weight'
                // }, {
                //     label: '体温(℃)',
                //     name: 'temperature'
                // }, {
                //     label: '血压(mmHg)',
                //     name: 'bloodPressure'
                // }],
                checks: [],
                // view 按钮组
                toolbarOptions: {
					tools: [{
						label: '编辑',
                        color: 'info',
                        icon: 'edit',
                        //  配置的权限可见
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
					}]
				}
            }
        },
        computed: {
            safeData() {
                // debugger
                console.log(this.card);
                return this.data || {};
            },
            history() {
                var res = [];
                if (this.data) {
                    this.stableHistory.forEach(item => this.data[item.name] && res.push({
                        label: item.label,
                        value: this.data[item.name]
                    }));
                    Object.keys(this.data).forEach(key => {
                        if (~key.indexOf('history_')) {
                            var v = this.data[key];
                            if (v) {
                                var vs = v.split('::');
                                vs[1] && res.push({
                                    label: vs[0],
                                    value: vs[1]
                                });
                            }
                        }
                    });
                }
                return res;
            },
        },
        methods: {
            initChecks(data) {
                var groups = [],
                    group = [];

                function add(item) {
                    if (group.length == 4) {
                        groups.push(group);
                        group = [];
                    }
                    item.value && group.push(item);
                }
                if (data) {
                    Promise.resolve().then(() => {
                        if (data._template) {
                            return GlobalService.getCustomForm(data._template).then(config => {
                                if (config && config.fields) {
                                    var res = [];
                                    config.fields.forEach(f => {
                                        f.name && data[f.name] && res.push({
                                            label: f.label,
                                            value: Sunset.isFunction(f.formatDispaly) ?
                                                f.formatDispaly(data[f.name], f) : (f.enum ?
                                                    data[f.name].split(',').map(
                                                        v => Sunset.Service.Dictionary.transcode(
                                                            f.enum, v)).join(',') :
                                                    data[f
                                                        .name])
                                        });
                                    });
                                    return res;
                                }
                            });
                        }
                    }).then((templateChecks) => {
                        // var items = [];
                        // this.stableChecks.forEach(item => {
                        //     data[item.name] && data[item.name] && add({
                        //         label: item.label,
                        //         value: data[item.name]
                        //     });
                        // });
                        templateChecks && templateChecks.forEach(item => {
                            add(item);
                        });
                        Object.keys(this.data).forEach(key => {
                            if (~key.indexOf('check_')) {
                                var v = this.data[key];
                                if (v) {
                                    var vs = v.split('::');
                                    add({
                                        label: vs[0],
                                        value: vs[1]
                                    });
                                }
                            }
                        });
                        if (group.length) {
                            groups.push(group);
                        }
                        this.checks = groups;
                    })
                } else {
                    this.checks = groups;
                }
            },
        },
        watch: {
            data(data) {
                this.initChecks(data);
            }
        },
        ready() {
            this.initChecks(this.data);
        }
    }
</script>