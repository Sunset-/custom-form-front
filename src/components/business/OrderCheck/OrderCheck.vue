<style lang="sass">
    .doctor-referral-container {
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
    <div class="doctor-referral-container">
        <router-view></router-view>
    </div>
</template>

<script>
    export default {
        computed: {
            path(){
                return this.$route.path;
            }
        },
        components:{
        },
        ready(){
            var yewukeshi = GlobalService.getCurrentUserSync().relation.isBelongToBusinessOffice();
            var fuwuzhongxin = GlobalService.getCurrentUserSync().relation.isBelongToOfficeCategory('0203002');
            // if(yewukeshi){
            // }else{
            //     $('.left_sidebar li:nth-child(1)').hide();
            //     $('.left_sidebar li:nth-child(2)').hide();
            // }
            if(fuwuzhongxin){
            }else{
                $('.left_sidebar li:nth-child(3)').hide();
            }
            if(this.$route.path.endsWith('/OrderCheck')){
                // if(yewukeshi){
                    Router.go('/OrderCheck/InCheck');
                // }else if(fuwuzhongxin){
                //     Router.go('/Referral/ServiceCentre');
                // }else{
                // }
            }
        },
        data() {
            return {}
        },
        methods: {},
        watch : {
            path(){
                if(this.$route.path.endsWith('/OrderCheck')){
                    Router.go('/OrderCheck/InCheck');
                }
            }
        }
    }
</script>