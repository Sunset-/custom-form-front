<template>
    <div class="flow-card">
        <div class="fc-header">
            <div class="fc-header-inner">
                转诊
                <label>{{flow.detailStatus | enum 'REFERRAL_FLOW_STATUS'}}</label>
            </div>
        </div>
        <div class="fc-body">
            <p>类型：{{flow.referralType | enum 'REFERRAL_FLOW_TYPE'}}</p>
            <p>转出：{{flow.fromEntity.name}}</p>
            <p>转入：{{target}}</p>
            <p>提交时间：{{flow.applyDate | time 'yyyy/MM/dd'}}</p>
            <p>提交人：{{flow.applyUser.name}}</p>
        </div>
    </div>
</template>
<script>
    export default {
        props: {
            flowData: {},
            flow: {}
        },
        computed: {
            target() {
                var target = this.flow.target;
                if(target.category.indexOf("04")==0){
                    return target.name
                }else{
                    var dept=[];
                    target.uppers.forEach(item=>{
                        if(item.category.indexOf("01")==0){
                            dept.push(item.name)
                        }else if(item.category.indexOf("02")==0){
                            dept.push(item.name)
                        }else if(item.category.indexOf("03")==0){
                            dept.push(item.name)
                        }else if(item.category.indexOf("04")==0){
                            dept.push(item.name)
                        }else{
                            dept += item.name
                        }
                    });
                    dept.unshift(target.name);
                    return dept.reverse().join("-");
                }
            }
        }
    }
</script>