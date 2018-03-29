<style  lang="sass">
    .majorsiderbar{
        
    }
</style>


<template>
    <div class="majorsiderbar">
        <Menu :theme="theme3" :active-key="$route.path" width="130px">
            <template v-for="m in menus">
                <div v-mdp-permission="m.name">
                    <Menu-item :key="m.path" @click="go(m)">
                        <Icon :type="m.icon||'document-text'"></Icon>
                        {{m.title}}
                    </Menu-item>
                </div>
            </template>
        </Menu>
    </div>
</template>

<script>
    export default {
        props: {},
        computed: {
            menus() {
                var path = this.$route.path;
                path = path.substr(path.indexOf('/') + 1);
                path = (~path.indexOf('/')) ? path.substr(0, path.indexOf('/')) : path;
                return GlobalService.Modules.navMap[path].menus;
            }
        },
        data() {
            return {
                menuRefresher: true
            }
        },
        methods: {
            go(menu) {
                Router.go(menu.path);
                this.$nextTick(() => {
                    this.menuRefresher = false;
                    this.$nextTick(() => {
                        this.menuRefresher = true;
                    })
                });
            }
        }
    }
</script>