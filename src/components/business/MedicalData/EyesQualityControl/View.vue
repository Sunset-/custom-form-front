<style lang="sass">
    .history-table{
        .viewer-image{
            height:100px;
            width:100px;
        }
    }
</style>
<template>
    <div class="video-card-view">
        <h3>图像质量反馈 <span> ({{card.lastModifyDate | time 'yyyy/MM/dd HH:mm'}}  {{card.creator.name}}编辑) </span></h3>
        <table class="history-table">
            <tr v-if="dataIntegrity">
                <td class="label">资料完整性</td>
                <td>{{dataIntegrity}}</td>
            </tr>
            <tr v-if="image">
                <td class="label">眼底像缺陷</td>
                <td>{{image}}</td>
            </tr>
            <tr v-if="data.remark">
                <td class="label">备注</td>
                <td>{{data.remark}}</td>
            </tr>
        </table>
    </div>
</template>
<script>
    export default {
        props: {
            card: {},
            data: {

            }
        },
        computed: {
            safeData() {
                return this.data || {};
            },
			dataIntegrity(){
				return this.safeData.dataIntegrity.split(',').map(item=>Sunset.Service.Dictionary.transcode('TAND_FLOW_SENDBACK_DATAINTEGRITY',item)).join(',')||'';
			},
			image(){
				return this.safeData.image&&this.safeData.image.split(',').map(item=>Sunset.Service.Dictionary.transcode('TANG_FLOW_SENDBACK_IMAGEQUALITY',item)).join(',')||'';
			}
            
        }
    }
</script>