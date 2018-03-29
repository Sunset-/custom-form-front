<style lang="sass">
    .referral-statistics-container {
        position: relative;
        height: 100%;
        width: 100%;
        overflow: auto;
        .second-level-sidebar {
            position: absolute;
            top: 0px;
            left: 0px;
            bottom: 0px;
            width: 130px;
            background: #f2f2f2;
            &>div{
                height:50px;
                box-sizing:border-box;
                border-left:5px solid transparent;
                line-height:50px;
                font-size:14px;
                font-weight:600;
                text-align:center;
                cursor:pointer;
                &.active{
                    background:#fff;
                    border-left:5px solid #2cab8e;
                }
            }
        }
        .second-level-major{
            position: absolute;
            top: 0px;
            right: 0px;
            bottom: 0px;
            left: 130px;
            background: #FFF;  
        }
    }
</style>

<template>
    <div class="referral-statistics-container">
        <div class="second-level-sidebar">
            <div v-for="m in menus" @click="go(m.path)" :class="[m.path==currentPath?'active':'']">{{m.label}}</div>
        </div>
        <div class="second-level-major">
            <router-view></router-view>
        </div>
    </div>
</template>

<script>
    export default {
        components: {},
        ready() {
            if (this.$route.path.endsWith('/ReferralStatistics')) {
                Router.go('/ReferralStatistics/In');
            }
        },
        data() {
            return {
                menus: [{
                    label: '转入统计',
                    path: '/ReferralStatistics/In'
                }, {
                    label: '转出统计',
                    path: '/ReferralStatistics/Out'
                }]
            }
        },
        computed: {
            currentPath() {
                return this.$route.path;
            }
        },
        methods: {
            go(path){
                Router.go(path);
            }
        },
        watch: {
            currentPath() {
                if (this.$route.path.endsWith('/ReferralStatistics')) {
                    Router.go('/ReferralStatistics/In');
                }
            }
        }
    }
</script>