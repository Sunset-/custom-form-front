<template>
    <div class="flow-card">
        <div class="fc-header">
            <div class="fc-header-inner">
                疑难会诊
                <label>{{flow.status | enum 'FLOW_STATUS'}}</label>
            </div>
        </div>
        <div class="fc-body">
            <p>专家：{{flow.target.name}}</p>
            <p>目的：{{flow.extension.target | enum 'CONSULTATION_TARGET'}}</p>
            <p>提交时间：{{flow.applyDate | time 'yyyy/MM/dd'}}</p>
            <p>提交人：{{flow.applyUser.name}}</p>
        </div>
    </div>
</template>
<script>
    export default {
        props: {
            flow: {}
        }
    }
</script>