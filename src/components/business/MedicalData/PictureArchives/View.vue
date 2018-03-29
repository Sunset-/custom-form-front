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
                    padding: 15px 0px;
                    text-align: center;
                }
                &.short-value {}
                .eye-picture-viewitem {
                    position: relative;
                    display: inline-block;
                    width: 150px;
                    margin: 5px;
                    font-size: 0px;
                    &>img {
                        position: relative;
                        display: inline-block;
                        border: 1px solid #ccc;
                        width: 100%;
                        z-index: 3;
                    }
                    &.multi:before {
                        content: '';
                        position: absolute;
                        width: 100%;
                        height: 100%;
                        border: 1px solid #ccc;
                        top: -4px;
                        right: -4px;
                        z-index: 2;
                        background: #FFF;
                    }
                    &.multi:after {
                        content: '';
                        position: absolute;
                        width: 100%;
                        height: 100%;
                        border: 1px solid #ccc;
                        top: -7px;
                        right: -7px;
                        z-index: 1;
                        background: #FFF;
                    }
                }
            }
        }
    }
</style>
<template>
    <div class="video-card-view">
        <h3>眼科图像 <span> ({{card.lastModifyDate | time 'yyyy/MM/dd HH:mm'}}  {{card.creator.name}}编辑) </span></h3>
        <sunset-toolbar class="viewbtn" v-ref:form style="float:right;padding:10px 0px;" :options="toolbarOptions" ></sunset-toolbar>
        <table class="history-table">
            <tr>
                <td class="label">检查图片</td>
                <td>
                    <div style="display:inline-block;" v-for="image in images">
                        <div :class="['eye-picture-viewitem',image.items.length>1?'multi':'']" v-show="$index==0" v-for="item in image.items">
                            <img class="viewer-image" :group="image.type" :src="item.result.md5 | upload-image" />
                        </div>
                        <p style="text-align:center;width:150px;overflow: hidden; white-space: nowrap; text-overflow: clip;" title="{{image.type}}（{{image.items.length}}张）">{{image.type}}（{{image.items.length}}张）</p>
                    </div>
                    <!-- <checkimage-card style="margin-top:5px;margin-bottom:5px;" v-for="attachment in images" :data="attachment"></checkimage-card> -->
                </td>
            </tr>
            <tr>
                <td class="label">检查项目</td>
                <td>{{safeData.checkLabel | enum 'IMAGE_CHECKFILE_LABEL'}}</td>
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
            images() {
                var osu = {};
                var images = this.safeData.images;
                if (images) {
                    images = JSON.parse(images);
                    images.forEach(item => {
                        osu[item.result.fileName] = osu[item.result.fileName] || [];
                        osu[item.result.fileName].push(item);
                    })
                }
                return Object.keys(osu).map(key => {
                    return {
                        type: key,
                        items: osu[key]
                    };
                });
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