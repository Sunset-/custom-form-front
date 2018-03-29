<style lang="sass">

</style>
<template>
    <div class="common_card">
        <div class="card_title"><label>眼科图像</label><span class="card_creat_date">{{card.lastModifyDate | time 'yyyy-MM-dd HH:mm:ss'}}</span></div>
        <div class="card_content">
            <div>检查设备：{{safeData.checkLabel}}</div>
            <div>检查方法：{{safeData.checkMethod}}</div>
            <div>检查部位：{{safeData.checkPoints||'无'}}</div>
            <div>图片个数：{{safeData.imageCount||'无'}}</div>
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