<style lang="sass">
    .eye_screen_item{
        width: 1336px;
        height: 110px;
        text-align: left;
        padding: 0 0 10px 20px;
        &>div{
            float: left;
            height: 110px;
        }
        .activity_info{
            width:40%;
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
            width:30%;
            height:70px;
            line-height:70px;
            margin:15px 0;
            text-align:center;
            border-left: 1px dashed #ccc;
            &>span{
                margin-left:10px;
                font-size:16px;
                font-weight:600;
            }
        }
        .operate{
            width:30%;
            height:70px;
            line-height:70px;
            text-align: center;
            margin:15px 0;
            padding: 20px 70px;
            border-left: 1px dashed #ccc;
            &>div{
                border: 1px solid #ccc;
                border-radius: 5px;
                box-sizing: border-box;
                cursor: pointer;
                background:#fff;
            }
            .upload_picture{
                float: right;
                border: none;
                height:32px;
            }
            .register{
                float: left;
                width: 80px;
                height:32px;
                line-height:30px;
            }
        }
    }
</style>
<template>
    <div class="eye_screen_item">
        <div class="activity_info">
            <div class="activity_name">{{activity.name}}</div>
            <div>检查项目: {{checks}}</div>
            <div>活动时间: {{activityDate(activity.startDate)}} ~ {{activityDate(activity.endDate)}}</div>
        </div>
        <div class="register_total">已登记人数 <span>{{registerTotal}}</span></div>
        <div class="operate">
            <div class="register" :disabled="batchUploading" @click="detail">进入活动</div>
            <div class="upload_picture">
                <sunset-file :options="batchUploadImageOptions" :disabled="batchUploading" @start-upload="startBatchUpload" @finish="batchUploadFinish">
                    <i-button style="vertical-align: top;"  type="primary" :disabled="batchUploading" icon="ios-upload">上传眼底照片</i-button>
                </sunset-file>
            </div>
        </div>
    </div>
</template>
<script>
    import EyeScreenItem from "./EyeScreenItem";
    import EyeScreenStore from "./EyeScreenStore.js"
    export default {
        data(){
            return{
                batchUploadImageOptions: {
                    label: '文件选择',
                    icon: 'ios-cloud-upload',
                    disabled: true,
                    color: 'success',
                    type: 'file',
                    url: '/image-service/screeningOm/receive',
                    className: 'my-uploader-trigger',
                    filter(f) {
                        return ~f.type.indexOf('image');
                    },
                    formData: (record) => {
                        return {
                            taskToken: this.batchUploadToken
                        }
                    },
                    progress: (v) => {
                        this.batchUploadProgress = Math.round(v * 100);
                    }
                }
            }
        },
        props:{
            activity:"",
            batchUploading: false,
            batchUploadToken: null,
            batchUploadProgress: 0
        },
        computed:{
            uploading(){
                return GlobalService.isUploading();
            },
            registerTotal(){
                var number = this.activity&&this.activity.stats.EYES_DEPT.filter(v=>v.disease=="all")
                return number&&number[0].number
            },
            checks(){
                var checkitems = Sunset.Service.Dictionary.getEnums('SCREENING_EYES_DEPT').map(v=>v.key);
                var arr= checkitems.filter(v=>(this.activity.checks[0].value&v)>0);
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
        methods:{
            startBatchUpload() {
                this.$emit('uploadstart')
            },
            batchUploadFinish() {
                this.$emit('uploadfinish')
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