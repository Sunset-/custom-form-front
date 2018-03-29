<template>
    <div class="flow-card">
        <div class="fc-header">
            <div class="fc-header-inner">
                远程阅片
                <label>{{flow.status | enum 'FLOW_STATUS'}}</label>
            </div>
        </div>
        <div class="fc-body">
            <p>专家：{{flow.target.name}}</p>
            <p>影像：{{dicomfile.deviceType}}</p>
            <p>提交时间：{{flow.applyDate | time 'yyyy/MM/dd'}}</p>
            <p>提交人：{{flow.applyUser.name}}</p>
        </div>
    </div>
</template>
<script>
    export default {
        props: {
            flow: {}
        },
        computed : {
            dicomfile(){
                if(this.flow.extension&&this.flow.extension.extension&&this.flow.extension.extension.dicomfile){
                    return JSON.parse(this.flow.extension.extension.dicomfile);
                }
                return {};
            }
        }
    }
</script>