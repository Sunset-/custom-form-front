<style lang="sass">
    .pd-right-toolbar{
        position: absolute;
        right: 0px;
        top: 0px;
        bottom: 0px;
        width: 79px;
        text-align:center;
        border-left:1px solid #ccc;
        background:#354b62;
        &>.sidebar-btn {
            width: 74px;
            height: 80px;
            line-height: 46px;
            color: #fff;
            font-size: 16px;
            margin: 5px auto;
            border-radius:3px;
            cursor:pointer;
            &.backbg {
                background: #243444;
            }
            &:hover{
                color: #c2b684;
                background: #2b3e5c;
            }
        }
    }
</style>

<template>
    <div class="pd-right-toolbar">
        <div :class="['sidebar-btn',item.color,item.bg]" v-for="item in tools" @click="sidebarOperate(item)">
            <div style="height:25px;" class="icon"><Icon :type="item.icon" size='16'></Icon></div>
            {{{item.label}}}
        </div>
    </div>
</template>

<script>
export default {
    props: {
        options: {

        }
    },
    computed: {
        tools() {
            var options = this.options || [];
            return options;
        }
    },
    methods: {
        sidebarOperate(item) {
            if (item.signal) {
                switch (item.signal) {
                    default:
                        this.$emit('signal', item);
                }
            } else if (Sunset.isFunction(item.operate)) {
                item.operate(this.patientCardData);
            }
        },
    }
}
</script>

