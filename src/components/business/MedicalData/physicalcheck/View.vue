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
                    padding: 15px 5px;
                    text-align: left;
                }
                &.short-value {}
            }
        }
        .history-table {}
    }
</style>
<template>
    <div class="history-bodycheck-view">
        <h3>体格检查 <span> ({{card.lastModifyDate | time 'yyyy/MM/dd HH:mm'}}  {{card.creator.name}}编辑) </span></h3>
        <sunset-toolbar class="viewbtn"  v-ref:form style="float:right;padding:10px 0px;" v-show="!editing" :options="toolbarOptions"></sunset-toolbar>
        <table>
            <tr v-for="group in checks">
                <template v-for="item in group">
                    <td class="label">{{item.label}}</td>
                    <td class="short-value">{{item.value}}</td>
                </template>
            </tr>
        </table>
        <p v-if="data.remark" style="padding:10px 0px;">
            说明：{{data.remark}}
        </p>
        <p v-if="!checks||checks.length==0">
            无
        </p>
       
    </div>
</template>
<script>
    export default {
        props: {
            card : {

            },
            data: {

            }
        },
        data() {
            return {
                stableChecks: [{
                    label: '身高(cm)',
                    name: 'height'
                }, {
                    label: '体重(kg)',
                    name: 'weight'
                }, {
                    label: '体温(℃)',
                    name: 'temperature'
                }, {
                    label: '血压(mmHg)',
                    name: 'bloodPressure'
                }, {
                    label: '血糖',
                    name: 'bloodSugar'
                }, {
                    label: '呼吸',
                    name: 'breath'
                }, {
                    label: '心率',
                    name: 'heartRate'
                }, {
                    label: '发育',
                    name: 'growth',
                    enum : 'PE_GROWTH'
                }, {
                    label: '营养',
                    name: 'nutrition',
                    enum : 'PE_NUTRITION'
                }, {
                    label: '体位/姿势',
                    name: 'posture',
                    enum : 'PE_POSTURE'
                }, {
                    label: '面色',
                    name: 'complexion',
                    enum : 'PE_COMPLEXION'
                }, {
                    label: '表情',
                    name: 'expression',
                    enum : 'PE_EXPRESSION'
                }, {
                    label: '神志',
                    name: 'mind',
                    enum : 'PE_MIND'
                }, {
                    label: '言语清晰',
                    name: 'artistomia',
                    enum : 'TRUE_OR_FALSE'
                }, {
                    label: '言语流利',
                    name: 'speechFluent',
                    enum : 'TRUE_OR_FALSE'
                }, {
                    label: '对答切题',
                    name: 'answerKeep',
                    enum : 'TRUE_OR_FALSE'
                }, {
                    label: '检查合作否',
                    name: 'cooperate',
                    enum : 'PE_COOPERATE'
                }],
                checks: [],
                toolbarOptions: {
					tools: [{
                        label: '编辑',
                        text:'a',
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
                return this.data || {};
            },
            safecard() {
                console.log(this.card);
                return this.card || {};
            }
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
                        var items = [];
                        this.stableChecks.forEach(item => {
                            data[item.name] && data[item.name] && add({
                                label: item.label,
                                value: item.enum?Sunset.Service.Dictionary.transcode(item.enum, data[item.name]):data[item.name]
                            });
                        });
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
            }
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