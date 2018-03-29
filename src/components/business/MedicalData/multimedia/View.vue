<style lang="sass">
    .multimedia-card-view {
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
            }
        }
    }
</style>
<template>
<!-- 这是配合帅帅新加的卡片   -->
    <div class="multimedia-card-view">
          <h3>快速转诊<span> ({{card.lastModifyDate | time 'yyyy/MM/dd HH:mm'}}  {{card.creator.name}}编辑) </span></h3>
        <sunset-toolbar class="viewbtn" v-ref:form style="float:right;padding:10px 0px;" :options="toolbarOptions" ></sunset-toolbar>
        <table class="history-table">
            <tr v-if="card.extension.description">
                <td class="label">病情描述：</td>
                <td>{{card.extension.description}}</td>
            </tr>
            <tr>
                <td class="label">图片资料：</td>
                <td>
                    <div v-if="imagedo!=0">
                        <img class="viewer-image" group="multimedia-image" v-for="image in imagedo" style="width:100px;display:inline-block;margin:0px 5px;" :src="image | upload-image" alt="图片资料"/>
                    </div>
                    <div v-if="imagedo==0">
                        未上传图片
                    </div>
                </td>
            </tr>
            <tr>
                <td class="label">语音资料：</td>
                <td>
                    <div v-if="audiodo!=0">
                        <div v-for="adu in audiodo" style="margin-bottom:5px;">
                            <audio controls="controls" :src="adu | upload-image" style="width: 500px;"></audio>
                        </div>
                    </div>
                    <div v-if="audiodo==0">
                        未上传语音
                    </div>
                </td>
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
                showid:"",
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
            audiodo(){
                var ss=this.data.audio&&this.data.audio;
                if(ss=="")return 0
                var is1 = ss.indexOf(",");
                var arr=[];
                is1<0?arr.push(ss):arr=ss.split(",");
                return arr
            },
            imagedo(){
                var ss=this.data.images&&this.data.images;
                if(ss=="")return 0
                var is1 = ss.indexOf(",");
                var arr=[];
                is1<0?arr.push(ss):arr=ss.split(",");
                return arr
            }

        },
        methods: {
        }
    }
</script>