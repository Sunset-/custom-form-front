<style lang="sass">

</style>
<template>
    <div class="common_card">
        <div class="card_title"><label>影像检查</label><span class="card_creat_date">{{card.lastModifyDate | time 'yyyy-MM-dd HH:mm:ss'}}</span></div>
        <div class="card_content">
            <div>检查设备：{{safeData.deviceType}}</div>
            <div>检查部位：{{checkPoints||'无'}}</div>
            <div>检查方法：{{checkMethod}}</div>
            <div>检查时间：{{safeData.checkDate | time 'yyyy-MM-dd HH:mm'}}</div>
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
            },
            checkMethod() {
                var v = this.safeData.checkMethod;
                if (v) {
                    return v.split(';').map(item => item.split(',')[1] || item.split(',')[0]).join(',');
                } else {
                    return '';
                }
            },
            checkPoints() {
                var v = this.safeData.checkPoints;
                if (v) {
                    return v.split(';').map(item => item.split(',')[1] || item.split(',')[0]).join(',');
                } else {
                    return '';
                }
            }
        },
        methods: {}
    }
</script>