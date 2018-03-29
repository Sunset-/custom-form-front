<style lang="sass">
    .cure-view {
        font-size: 14px;
        color: #333;
        &>h3 {
            color: #8d8d8d;
            font-weight: 500;
            >span{
                font-size: 1rem;
                font-weight: normal;
            }
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
    <div class="cure-view">
        <sunset-toolbar class="viewbtn" style="margin-top:0px; float:right" :options="recordTools" ></sunset-toolbar>  
        <h3>诊断及治疗方案 <span> ({{card.lastModifyDate | time 'yyyy/MM/dd HH:mm'}}  {{card.creator.name}}编辑) </span></h3>
        <h3>
            <label>诊断：</label>
            <span style="color:#06F;font-weight: 400;font-family: '微软雅黑 Regular', '微软雅黑';">
                {{safeData.diagnose}}
            </span>
        </h3>
        <h3>治疗建议</h3>
        <table class="history-table">
            <tr v-if="safeData.suggestion">
                <td class="label">治疗建议</td>
                <td>{{safeData.suggestion}}</td>
            </tr>
            <tr v-if="material.length">
                <td class="label">材料</td>
                <td>{{{material}}}</td>
            </tr>
        </table>
    </div>
</template>
<script>
    export default {
        props: {
            data: {

            },
            card:{

            }
        },
        data() {
            return {
                recordTools: {
                        tools: [{
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
					}]
                } 
            }
        },
        computed: {
            safeData() {
                return this.data || {};
            },
            material() {
                var data = this.data,
                    res = [];
                if (data) {
                    var materialKeys = Object.keys(data).filter(key => key.indexOf('material') == 0)
                    materialKeys.sort();
                    materialKeys.map(key => {
                        var m;
                        try {
                            m = JSON.parse(data[key]);
                        } catch (e) {
                            console.error(e);
                        }
                        m && res.push(
                            `${m.name?m.name:""}${m.count?`&nbsp;&nbsp;&nbsp;[&nbsp;${m.count}&nbsp;]`:""}${m.remark?`&nbsp;&nbsp;&nbsp;${m.remark}`:""}`
                        );
                    });
                }
                return res.join('<br>');
            }
        },
        methods: {}
    }
</script>