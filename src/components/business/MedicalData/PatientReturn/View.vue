<style lang="sass">
    .cure-view {
        font-size: 14px;
        color: #333;
        &>h3 {
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
    }
</style>
<template>
    <div class="cure-view">
          <sunset-toolbar class="viewbtn" style="margin-top:0px; float:right" :options="recordTools" ></sunset-toolbar>   
        <h3>患者沟通记录 <span> ({{card.lastModifyDate | time 'yyyy/MM/dd HH:mm'}}  {{card.creator.name}}编辑) </span></h3>
        <table class="history-table">
            <tr v-if="safeData.date">
                <td class="label">回访日期</td>
                <td>{{safeData.date | time "yyyy-MM-dd HH:mm"}}</td>
            </tr>
            <tr v-if="safeData.contact">
                <td class="label">沟通方式</td>
                <td>{{safeData.contact | enum 'CONTACT_WAY'}}</td>
            </tr>
            <tr v-if="safeData.notes">
                <td class="label">信息记录</td>
                <td>{{safeData.notes}}</td>
            </tr>
            <tr>
                <td class="label">专家</td>
                <td>{{safeData.expert}}</td>
            </tr>
        </table>
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