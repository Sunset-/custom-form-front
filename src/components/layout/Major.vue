<style lang="sass">
    .peaimage-major {
        position: absolute;
        top: 0px;
        left: 0px;
        right: 0px;
        bottom: 0px;
        .menu-wrap {
            position: absolute;
            top: 0px;
            left: 0px;
            bottom: 0px;
            width: 130px;
            background: #f2f2f2;
            color: #657180;
            text-align: center;
            font-weight: 600;
            font-size:14px;
        }
        .module-wrap {
            position: absolute;
            top: 0px;
            left: 130px;
            right: 0px;
            bottom: 0px;
            overflow-y: auto;
        }
        .ivu-menu-light.ivu-menu-vertical .ivu-menu-item-active:not(.ivu-menu-submenu){
            border-right:none;
            background: #fff;
            color: #657180;
            border-left: 5px solid #2cab8e;
        }
        .ivu-menu-light.ivu-menu-vertical .ivu-menu-item {
            border-right:none;
            background: #f2f2f2;
        }
        .ivu-menu-vertical .ivu-menu-item:hover, .ivu-menu-vertical .ivu-menu-submenu-title:hover {
            background: #none;
        }
    }
</style>
<template>
    <div class="peaimage-major">
        <div v-show="type=='SIDE_MAJOR'" class="menu-wrap">
            <sidebar :menus="menus"></sidebar>
        </div>
        <div class="module-wrap" :style="contentStyle">
            <router-view></router-view>
        </div>
    </div>
</template>

<script>
    import Sidebar from './Sidebar.vue';

    export default {
        components: {
            Sidebar
        },
        data() {
            return {}
        },
        computed: {
            type() {
                var path = this.$route.path;
                path = path.substr(path.indexOf('/') + 1);
                path = path.substr(0, path.indexOf('/'));
                return Modules.navMap[path].type;
            },
            contentStyle() {
                return this.type == 'SIDE_MAJOR' ? {
                    left: '130px'
                } : {
                    left: '0px'
                };
            }
        },
        events: {
            NAV_CHANGE(menus) {
                // this.menus = menus;;
            }
        },
        ready() {}
    }
</script>