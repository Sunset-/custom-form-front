<style lang="sass">
    .video-card-view {
        font-size: 14px;
        color: #333;
        padding-bottom: 10px;
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
    }
</style>
<template>
    <div class="video-card-view">
        <h3>手术记录 <span> ({{card.lastModifyDate | time 'yyyy/MM/dd HH:mm'}}  {{card.creator.name}}编辑) </span></h3>
        <sunset-toolbar class="viewbtn" v-ref:form style="float:right;padding:10px 0px;" :options="toolbarOptions" ></sunset-toolbar>
        <table class="history-table">
            <tr>
                <td class="label">日期：</td>
                <td>{{card.noteDate | time 'yyyy/MM/dd HH:mm'}}</td>
            </tr>
            <tr>
                <td class="label">类型：</td>
                <td>{{DIAGNOSIS}}</td>
            </tr>
            <tr>
                <td class="label">诊断：</td>
                <td>{{data.diagnosis}}</td>
            </tr>
            <tr v-if="data.record">
                <td class="label">手术记录：</td>
                <td>{{{data.record}}}</td>
            </tr>
        </table>
    </div>
</template>
<script>
    export default {
        props: {
            data: {

            },
            card: {

            }
        },
        data() {
            return {
                toolbarOptions: {
                    align: 'center',
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
                return this.data || {};
            },
            attachments() {
                var attachments = this.safeData.attachments;
                if (attachments) {
                    try {
                        return JSON.parse(attachments);
                    } catch (e) {
                        return [];
                    }
                }
            },
            DIAGNOSIS(){
                return Sunset.Service.Dictionary.transcode('DIAGNOSIS_TYPE',this.data.type)
            }
        }
    }
</script>