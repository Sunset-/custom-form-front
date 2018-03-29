<style lang="sass">
    .screen_activity_item{
        float: left;
        margin: 20px 10px;
        border: 1px solid #ccc;
        border-radius:5px;
        width: 310px;
        height: 150px;
        text-align: left;
        .activity_info{
            height:110px;
            padding:10px 20px;
            &>div{
                height: 25px;
                line-height: 25px;
                word-wrap: break-word;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }
            .activity_name{
                font-weight:bold;
                font-size: 16px;
            }
        }
        .operate{
            text-align: center;
            height:37px;
            border-top: 1px solid #ccc;
            &>div{
                float: left;
                width: 100%;
                height: 37px;
                line-height: 37px;
                box-sizing: border-box;
                cursor: pointer;
            }
        }
    }
</style>
<template>
    <div class="screen_activity_item">
        <div class="activity_info">
            <div class="activity_name" :title="activity.name">{{activity.name}}</div>
            <div :title="activityAddr">活动地点: {{activityAddr}}</div>
            <div>活动时间: {{activityDate(activity.startDate)}} ~ {{activityDate(activity.endDate)}}</div>
            <div>检查项目: {{checks(activity.checks)}}</div>
        </div>
        <div class="operate">
            <div class="check" v-show="!checkOrEdit(activity.status)" @click="editActivity">编辑</div>
            <div class="check" v-show="checkOrEdit(activity.status)" @click="checkActivity">查看</div>
        </div>
    </div>
</template>
<script>
    import ScreenActivityStore from "./ScreenActivityStore.js"
    export default {
        data(){
            return{
            }
        },
        props:{
            activity:""
        },
        computed:{
            activityAddr(){
                if(this.activity&&this.activity.location&&this.activity.address)
                return this.activity.location.replace(/,/g,'') + this.activity.address.replace(/,/g,'')
            }
        },
        methods:{
            checks(checks){
                if(checks){
                    var checkitems = Sunset.Service.Dictionary.getEnums('SCREENING_EYES_DEPT').map(v=>v.key);
                    var arr= checkitems.filter(v=>(checks[0].value&v)>0);
                    var arry=[];
                    arr.map(key=>{
                        Sunset.Service.Dictionary.getEnums('SCREENING_EYES_DEPT').map(v=>{
                            if(v.key==key){
                                arry.push(v.value)
                            }
                        })
                    });
                    return arry?arry.join(" "):''
                }
            },
            checkOrEdit(status){
                return  Sunset.Service.Dictionary.transcode('ACTIVITY_STATUS',status) == "已完成"
            },
            activityDate(date){
               return Sunset.Dates.format(new Date(date),'yyyy/MM/dd')
            },
            checkActivity(mark){
                this.$emit("check",[this.activity,mark]);
            },
            editActivity(){
                this.$emit("check",this.activity);
            }
        }
    }
</script>