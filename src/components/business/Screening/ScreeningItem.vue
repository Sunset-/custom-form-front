<style lang="sass">
    .screening_item{
        width: 1336px;
        height: 110px;
        text-align: left;
        padding: 0 0 10px 20px;
        &>div{
            float: left;
            height: 110px;
        }
        .activity_info{
            width:30%;
            &>div{
                height: 30px;
                line-height: 30px;
                word-wrap: break-word;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }
            .activity_name{
                height: 40px;
                line-height: 40px;
                font-weight:bold;
                font-size: 16px;
            }
        }
        .register_total{
            width:55%;
            height:70px;
            line-height:70px;
            margin:15px 0;
            padding: 0 2%;
            text-align:center;
            border-left: 1px dashed #ccc;
            &>ul{
                width:100%;
                height:100%;
                overflow:hidden;
                & li{
                    float:left;
                    width:16%;
                    &>div{
                        height:30px;
                        line-height:30px;
                    }
                    .type_number{
                        font-size:16px;
                        color:red;
                        font-weight:600;
                    }
                }
            }
        }
        .operate{
            width:15%;
            height:70px;
            line-height:70px;
            text-align: center;
            margin:15px 0;
            padding: 20px 60px;
            border-left: 1px dashed #ccc;
            &>div{
                float: left;
                width: 60px;
                height:32px;
                line-height:30px;
                border: 1px solid #ccc;
                border-radius: 5px;
                box-sizing: border-box;
                cursor: pointer;
                background:#fff;
            }
            .search{
                width: 80px;
            }
        }
    }
</style>
<template>
    <div class="screening_item">
        <div class="activity_info">
            <div class="activity_name">{{activity.name}}</div>
            <div>检查项目: {{checks(activity.checks)}}</div>
            <div>活动时间: {{activityDate(activity.startDate)}} ~ {{activityDate(activity.endDate)}}</div>
        </div>
        <div class="register_total">
            <ul>
                <li v-for="item in registerList" track-by="$index">
                    <div class="type_number">{{item.number}}</div>
                    <div>{{diseaseType(item.disease)}}</div>
                </li>
            </ul>
        </div>
        <div class="operate">
            <div class="search" @click="detail">查看</div>
        </div>
    </div>
</template>
<script>
    import ScreeningStore from "./ScreeningStore.js"
    export default {
        data(){
            return{
            }
        },
        props:{
            activity:""
        },
        computed:{
            registerList(){
                var list = this.activity&&this.activity.stats.EYES_DEPT;
                var model = ["all", "normal", "eyeLid_1", "eyeGround_1", "slitLamp_1", "slitLamp_32"];
                return list.filter(v=>model.indexOf(v.disease) != -1);
            }
        },
        methods:{
            diseaseType(type){
                if(type == "all"){
                    return '共登记人数'
                }else if(type == "normal"){
                    return '正常'
                }else if(type =='eyeLid_1'){
                   return '眼睑' + Sunset.Service.Dictionary.transcode('NORMAL_ABNORMAL',type.split('_')[1]) 
                }else if(type =='eyeGround_1'){
                   return '眼底' + Sunset.Service.Dictionary.transcode('NORMAL_ABNORMAL',type.split('_')[1]) 
                }else{
                   return Sunset.Service.Dictionary.transcode('EYES_SCREEN_LXD',type.split('_')[1]) 
                }
            },
            members(members){
                return members.length?members.map(v=>v.name?v.name:'').join(" "):'未添加任何参与人员'
            },
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
            activityDate(date){
               return Sunset.Dates.format(new Date(date),'yyyy/MM/dd')
            },
            upPicture(){
                this.$emit("up",this.activity);
            },
            detail(){
                this.$emit("detail",this.activity);
            }
        }
    }
</script>