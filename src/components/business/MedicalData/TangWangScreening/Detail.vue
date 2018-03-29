<style lang="sass">
    .screening_detail{
        .eyes-vision-select {
            .ivu-select-dropdown {
                width: 200px !important;
                .ivu-select-dropdown-list {
                    .ivu-select-item {
                        width: 50%;
                        display: inline-block;
                    }
                }
            }
        }
        .picture_list{
            width:100%;
            height:100%;
            overflow:hidden;
            .picture{
                float:left;
                margin:10px;
                .ivu-checkbox{
                    position: relative;
                    top: -90px;
                    right: -104px;
                }
                &>img{
                    width:100px;
                    height:100px
                }
            }
        }
    }
</style>
<template>
    <div class="screening_detail">
        <sunset-custom-form style="padding-top:8px;" :no="config.formNo" v-ref:form :format="formatForm" :options="formOptions" @signal="operateSignal">
        </sunset-custom-form>
    </div>
</template>
<script>

export default {
    computed: {
    },
    props: {
        card: {

        },
        data: {

        },
        config: {

        }
    },
    data() {
        return {
            selected: null,
            editing: false,
            patientList: [],
            pictures: [],
            targetPatient: null,
            formatForm: (options) => {
                options.fields.forEach(v => {
                    if (v.name == "reportfile") {

                    }
                })
            },
            formOptions: {
                submit: (data) => {
                    var config = this.config;
                    var checkImg = data.checkpicture && JSON.parse(data.checkpicture);
                    var OU = [], OS = [], OD = [];
                    if (checkImg) {
                        checkImg.OS = checkImg.OS && checkImg.OS.filter(v => v.status == "ready");
                        checkImg.OD = checkImg.OD && checkImg.OD.filter(v => v.status == "ready");
                        checkImg.OU = checkImg.OU && checkImg.OU.filter(v => v.status == "ready");
                        data.checkpicture = JSON.stringify(checkImg)
                    };
                    this.$emit('save', {
                        digest: config.digest && config.digest(data),
                        entity: config.entity && config.entity(data),
                        extension: data
                    });
                },
                tools : [{
                    label : '保存',
                    color : 'success',
                    signal : 'SUBMIT'
                },{
                    label : '取消',
                    color : 'ghost',
                    signal : 'CANCEL',
                    premise :()=>{
                        return this.data;
                    }
                }]
            }
        }
    },
    methods: {
        init(){
            this.$refs.form.reset(this.data);
        },
        patientName(item) {
            return item.patient && item.patient.extension ? JSON.parse(item.patient.extension).name : ''
        },
        selectedPatient(item) {
            return item ? JSON.stringify(item) : ''
        },
        selectedPicture(item) {
            return item ? JSON.stringify(item) : ''
        },
        submitTeam() {

        },
        operateSignal(signal) {
            if (signal == 'CANCEL') {
                if (this.data) {
                    this.editing = false;
                    this.$emit('signal', 'CANCEL');
                } else {
                    this.$emit('signal', 'HOME');
                }
            }
        },
        save(data) {
            var config = this.config;
            this.$emit('save', {
                digest: config.digest && config.digest(data),
                entity: config.entity && config.entity(data),
                extension: data
            });
        },
        newCard() {
            this.$emit.apply(this, ['new-card'].concat([].slice.call(arguments)));
        }
    },
    ready() {
        this.init();
    },
    watch: {
        data(v) {
            this.init();
        },
        editing(v) {
            if (!v && this.$route.path.endsWith('/edit')) {
                window.history.back(-1);
            }
        }
    }
}
</script>