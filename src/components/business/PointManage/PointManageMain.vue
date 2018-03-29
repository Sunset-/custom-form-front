<style lang="sass">
    .PointManageMain-container {
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
    <div class="PointManageMain-container">
        <div class="second-level-sidebar">
            <div v-for="m in menus" @click="go(m.path)" :class="[m.path==currentPath?'active':'',m.childpath==currentPath?'active':'']">{{m.label}}</div>
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
            if (this.$route.path.endsWith('/PointManage')) {
                Router.go('/PointManage/integral');
            }
        },
        data() {
            return {
                menus: [{
                    label: '积分结算',
                    path: '/PointManage/integral',
                    childpath:'/PointManage/seeintegral',
                }, {
                    label: '结算报表',
                    path: '/PointManage/Settlement',
                    childpath:'/PointManage/seetlement',
                },{
                    label: '统计报表',
                    path: '/PointManage/Statistics',
                    childpath:'/PointManage/seeStatistics',
                }]
            }
        },
        computed: {
            currentPath() {
                var path = this.$route.path.split("?");
                return path[0];
            }
        },
        methods: {
            go(path){
                Router.go(path);
            }
        },
        watch: {
            currentPath() {
                if (this.$route.path.endsWith('/PointManage')) {
                    Router.go('/PointManage/integral');
                }
            }
        }
    }
</script>