<style lang="sass">
    .doctor-dicomreportmain-container {
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
    <div class="doctor-dicomreportmain-container">
        <!-- <div v-if="subRoutePath=='flowtask'" style="height:100%">
            <my-task  v-ref:flowtask @refresh="refresh" @checked="addVideo"></my-task>
        </div>
        <div v-if="subRoutePath=='flowconsulting'" style="height:100%">
            <my-consulting></my-consulting>
        </div>
        <div v-if="subRoutePath!='flowconsulting'||'flowtask'" style="height:100%">
            <my-consulting></my-consulting>
        </div> -->
        <router-view @checked="addVideo" v-ref:datapage @refresh="refresh"></router-view>
        <sunset-form-modal v-ref:advideo :options="options"></sunset-form-modal>
    </div>
</template>

<script>

    import Store from '../FlowData/Store';
    import MyTask from './MyTask';
    import MyConsulting from './MyConsulting';
    import MyRemotedetail from '../../business/FlowData/ApplyDicomReport/RemoteDetail';

    export default {
        components : {
            MyTask : MyTask,
            MyConsulting : MyConsulting,
            MyRemotedetail:MyRemotedetail
        },
        ready(){
            if(this.$route.path.endsWith('/RemoteReport')){
                Router.go('/RemoteReport/flowtask');
            }
        },
        watch : {
            path(){
                if(this.$route.path.endsWith('/RemoteReport')){
                    Router.go('/RemoteReport/flowtask');
                }
            }
        },
        computed :{
            path(){
                return this.$route.path;
            },
            subRoutePath(){
                var parentRoute = 'RemoteReport';
                // debugger
                var sub = this.$route.path.substring(this.$route.path.indexOf(parentRoute)+parentRoute.length+1,this.$route.path.length);
                // this[sub]  = true;
                return sub;
            }
        },
        data() {
            return {
                childInited : {
                    flowtask : false,
                    flowconsulting : false
                },
                options: {
                    title: '预约视频',
                    width: 1000,
                    style: 'max-height:400px;text-align:left;',
                    formOptions: {
                        cols: 2,
                        tools: false,
                        title:"预约视频",
                        fields: [{
                            label:"预约时间：",
                            name: 'videoStartDate',
                            widget:'date',
                            cols:10,
                            default:Date.now(),
                            }
                        ],
                        format: (model) => {
                            var subarr=[]
                           
                            var submsg={
                                videoStartDate:model.videoStartDate && model.videoStartDate.getTime(),
                                isRequestVideo:true,
                                patientid:model.subdata[0],
                                flowId:model.subdata[1],
                                type : "remoteflow",
                            }
                            subarr.push(submsg);
                            this.refresh();
                            return subarr;
                        },
                        submit: (m) => {
                            return Store.submitFlow(m).then(res=>{
                                Sunset.tip('提交成功', 'success');
                                this.$emit('submited');
                                this.$refs.advideo.cancel();
                                this.refresh();
                            });
                        }
                    }
                }
            }
        },
        methods: {
            addVideo(data){
                this.$refs.advideo.open({
                    subdata:data,
                });
            },
            refresh(){
                // this.$refs.datapage.refresh();
                this.$refs.flowtask.refresh();
                // Router.go('/RemoteReport/flowtask');
            },
        }
    }
</script>