<style lang="sass">
    .test-wrap {
        display: inline-block;
        width: 300px;
        border: 1px solid #000;
        margin-left: 20px;
        margin-top: 20px;
    }

    .test-wrap2 {
        display: inline-block;
        width: 1000px;
        border: 1px solid #000;
        margin-left: 20px;
        margin-top: 20px;
        vertical-align: top;
        min-height: 100px;
        padding: 15px;
    }
</style>

<template>
    <div>
        <print-template-eyesscreenform></print-template-eyesscreenform>
    </div>
</template>
<script>
    export default {
        methods: {
            go(){
                debugger;
                Router.push(`${123}`)
            },
            test() {
                this.$refs.form.reset({
                    "laboratoryapply": "{\"checkmethod\":\"1\",\"checkpoint\":\"11\",\"checktarget\":\"11\"}",
                    "checkapply1": "{\"checkmethod\":\"2\",\"checkpoint\":\"22\",\"checktarget\":\"22\"}",
                    "attach": "sunset"
                });
            },
            showDetail(card, cardDataId) {
                this.$refs.detail.set(card, cardDataId);
            },
            operateSignal(signal, err) {}
        },
        data() {
            return {
                formResult: null,
                formOptions: {
                    format(model) {
                        model.attach = 'sunset';
                        return model;
                    },
                    submit: (m) => {
                        this.formResult = JSON.stringify(m);
                    }
                }
            }
        },
        computed:{
            currentId(){
                return this.$route.params.id;
            }
        }
    }
</script>