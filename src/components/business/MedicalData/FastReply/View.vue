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
        .history-table {}
    }
</style>
<template>
    <div class="cure-view">
        <h3>
            <label>回复：</label>
            <span style="color:#06F;font-weight: 400;font-family: '微软雅黑 Regular', '微软雅黑';">
                {{safeData.content}}
            </span>
        </h3>
    </div>
</template>
<script>
    export default {
        props: {
            data: {

            }
        },
        data() {
            return {}
        },
        computed: {
            safeData() {
                return this.data || {};
            }
        },
        methods: {}
    }
</script>