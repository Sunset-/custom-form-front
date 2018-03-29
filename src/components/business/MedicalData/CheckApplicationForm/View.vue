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
        .viewbtn{
            margin-top: 10px;                    
            .sunset-toolbar-item button{
            background:none;
            border:none ;
            color:#4fb79f;
            padding:6px 10px;
            font-size: 15px;
            
            span{
                text-decoration: underline;
            }
            }
            :hover > button{
                color:black;
                border:none;
            }
        }
    }
</style>
<template>
    <div class="cure-view">
        <sunset-toolbar class="viewbtn" style="margin-top:0px; float:right;border:none;" :options="recordTools" ></sunset-toolbar>   
        <h3>检查申请单 <span> ({{card.lastModifyDate | time 'yyyy/MM/dd HH:mm'}}  {{card.creator.name}}编辑) </span></h3>
        <table class="history-table">
            <tr>
                <td class="label">初步诊断</td>
                <td>{{safeData.diagnose}}</td>
            </tr>
            <tr>
                <td class="label">检查方法</td>
                <td>{{checkapply.checkmethod}}</td>
            </tr>
            <tr>
                <td class="label">检查部位</td>
                <td>{{checkapply.checkpoint}}</td>
            </tr>
            <tr>
                <td class="label">检查目的</td>
                <td>{{checkapply.checktarget}}</td>
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
            checkapply(){
                return this.safeData.checkapply&&JSON.parse(this.safeData.checkapply)
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