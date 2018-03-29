<style lang="sass">

</style>
<template>
    <div class="common_card">
        <div class="card_title"><label>视频检查</label><span class="card_creat_date">{{card.lastModifyDate | time 'yyyy-MM-dd HH:mm:ss'}}</span></div>
        <div class="card_content">
            <div>检查类型：{{safeData.checkLabel | enum 'VIDEO_CHECKFILE_LABEL'}}</div>
            <div>检查方法：{{safeData.checkMethod}}</div>
            <div>检查部位：{{safeData.checkPoints||'无'}}</div>
            <div>视频个数：{{safeData.videoCount||'无'}}</div>
        </div>
        <div class="card_footer">医助 : {{safeData.userName}}</div>
    </div>
</template>
<script>
    export default {
        props: {
            card: {

            },
            data: {

            },
            config: {

            },
            active: {

            }
        },
        data() {
            return {

            }
        },
        computed: {
            safeData() {
                return this.data || {};
            }
        },
        methods: {}
    }
</script>