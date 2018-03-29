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
        <h3>视频检查 <span> ({{card.lastModifyDate | time 'yyyy/MM/dd HH:mm'}}  {{card.creator.name}}编辑) </span></h3>
        <sunset-toolbar class="viewbtn"  v-ref:form style="float:right;padding:10px 0px;" v-show="!editing" :options="toolbarOptions"></sunset-toolbar>
        <table class="history-table">
            <tr>
                <td class="label">检查视频</td>
                <td>
                    <video-card style="width: 200px;height: 130px;margin-top:5px;margin-bottom:5px;" v-for="item in videos" :data="item"></video-card>
                </td>
            </tr>
            <tr>
                <td class="label">检查项目</td>
                <td>{{safeData.checkLabel | enum 'VIDEO_CHECKFILE_LABEL'}}</td>
            </tr>
            <tr>
                <td class="label">检查时间</td>
                <td>{{safeData.checkDate | time}}</td>
            </tr>
            <tr v-if="safeData.checkPoints">
                <td class="label">部位</td>
                <td>{{safeData.checkPoints}}</td>
            </tr>
            <tr v-if="safeData.checkMethod">
                <td class="label">方法</td>
                <td>{{safeData.checkMethod}}</td>
            </tr>
            <tr v-if="safeData.remark">
                <td class="label">说明</td>
                <td>{{safeData.remark}}</td>
            </tr>
            <tr v-if="attachments">
                <td class="label">原始报告</td>
                <td>
                    <attachmentfile-card v-for="attachment in attachments" :data="attachment"></attachmentfile-card>
                </td>
            </tr>
            <tr>
                <td class="label">请求诊断建议</td>
                <td>{{safeData.property?'是':'否'}}</td>
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
            videos() {
                var videos = this.safeData.videos;
                return videos ? JSON.parse(videos) : [];
            },
            attachments() {
                var accessories = this.safeData.accessories;
                if (accessories) {
                    try {
                        return JSON.parse(accessories);
                    } catch (e) {
                        return [];
                    }
                }
            }
        }
    }
</script>