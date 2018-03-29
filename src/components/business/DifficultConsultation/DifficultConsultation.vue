<style lang="sass">
    .doctor-consultation-container {
        height: 100%;
        width: 100%;
        overflow:auto;
        .left_sidebar{
            width:130px;
            height:100%;
            overflow:hidden;
            background:#f2f2f2;
            & li{
                height:50px;
                line-height:50px;
                font-size:14px;
                font-weight:600;
                text-align:center;
                cursor:pointer;
                position:relative;
                border-left:5px solid #f2f2f2;
                &.active{
                    background:#fff;
                    border-left:5px solid #2cab8e;
                }
                &.hasNew:before{
                    content:'';
                    position: absolute;
                    top:10px;
                    right:10px;
                    border-radius:50%;
                    height:5px;
                    width:5px;
                    background:red;
                }
            }
        }
    }
</style>

<template>
    <div class="doctor-consultation-container">
        <router-view></router-view>
    </div>
</template>

<script>
    import SunsetWebsocket from '../../../common/ws.js';

    export default {
        ready(){
            if(this.$route.path.endsWith('/DifficultConsultation')){
                Router.go('/DifficultConsultation/MyTask');
            }
        },
        data() {
            return {

            }
        },
        methods: {
            
        },
        computed: {
            path(){
                return this.$route.path;
            }
        },
        watch : {
            path(){
                if(this.$route.path.endsWith('/DifficultConsultation')){
                    Router.go('/DifficultConsultation/MyTask');
                }
            }
        }
    }
</script>