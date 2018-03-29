<template>
    <div class="common_card orange">
        <div class="card_title"><label>处方</label><span class="card_creat_date">{{card.lastModifyDate | time 'yyyy-MM-dd HH:mm'}}</span></div>
        <div class="card_content">初步诊断 : {{data.tentativeDiagnosis}}</div>
        <div class="card_content">处方 : {{data.medicineCount}}</div>
        <div class="card_footer">专家 : {{data.userName}}</div>
    </div>
</template>

<script>
    export default {
        props: {
			card : {

			},
            data: {

            },
            config: {

            }
        }
    }
</script>