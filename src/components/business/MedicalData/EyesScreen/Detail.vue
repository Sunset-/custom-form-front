<style lang="sass">
.eyescreen_detail{
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
    & .ivu-modal-body{
        max-height:425px;
        overflow:auto;
    }
}
</style>
<template>
    <div class="eyescreen_detail">
        <sunset-toolbar style="float:right;padding:10px 0px;" v-show="!editing" :options="toolbarOptions"></sunset-toolbar>
        <history-view v-ref:view v-show="!editing" :card="card" :data="data" @save="save"></history-view>
        <sunset-custom-form style="padding-top:8px;" v-show="editing" :no="config.formNo" v-ref:form :format="formatForm" :options="formOptions"
            @signal="operateSignal">
        </sunset-custom-form>
        <sunset-view-modal v-ref:tablemodal :options="modalOptions">
            目标患者&nbsp;&nbsp;&nbsp;&nbsp;
            <i-select :model.sync="selected" style="width:150px;" placeholder="选择患者" :clearable="true" :multiple="false"
                :filterable="true">
                    <i-option v-for="item in patientList" :value="selectedPatient(item)">{{ patientName(item) }}</i-option>
            </i-select>
            <span v-show="selected" style="width:30px;height:30px;margin-left:15px;"><Icon type="ios-checkmark-empty" size="22" style="color:green;position:relative;top:5px;"></Icon></span>
            <div class="picture_list">
                <checkbox-group :model.sync="pictures">
                    <checkbox v-for='item in pictureList' :value="selectedPicture(item)" class="picture">
                            <img v-if="item" class="viewer-image" group="attachment" :src="item.result.md5 | upload-image" />
                    </checkbox>
                </checkbox-group>
            </div>
        </sunset-view-modal>
    </div>
</template>
<script>
    import HistoryView from './View';

    export default {
        components: {
            HistoryView
        },
        computed:{
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
                selected : null,
                editing: false,
                pictureList:[],
                patientList:[],
                pictures:[],
                targetPatient:null,
                formatForm: (options)=>{
                    options.fields.forEach(v=>{
                        if(v.name=="eyeBottom"){
                            v.toolbar={
                                style: 'margin-left: 18px',
                                size: 'small',
                                tools: [{
                                    label: '图像纠错',
                                    color: 'info',
                                    icon: 'arrow-right-a',
                                    operate: (model)=>{
                                        this.eyeBottomModel = model;
                                        model.eyeBottom?this.pictureList = JSON.parse(model.eyeBottom):'';
                                        this.$refs.tablemodal.open();
                                        var para={
                                            pageNumber: 0,
                                            pageSize: 999,
                                            systemId : GlobalService.getCurrentUserSync().user.systemId,
                                            hospitalId: GlobalService.getCurrentUserSync().relation.hospital[0].id,
                                            activityId: this.$route.params.activityId
                                        };
                                        return Promise.resolve().then(() => {
                                            return $http({
                                                    url: '/service/business/activity/register',
                                                    type: 'GET',
                                                    data: para
                                                }).then(res => {
                                                    this.patientList =  res ? res.rows.filter(v=>v.patient&&v.patient.id!=this.$route.params.patientId):'';
                                                })
                                        });
                                    }
                                }]
                            }
                        }
                    })
                },
                modalOptions:{
                    title: '图像纠错',
                    width: 600,
                    height:600,
                    checked: {
                        multi: false,
                        label: 'name',
                        premise: (record) => {
                            return !record.isChoosed;
                        }
                    },
                    tableOptions: {
                        columns: [{}],
                        showIndex: false,
                        pageNumberStart: 0,
                        pageSize: 5,
                        localPage: true,
                        sortable: true,
                        multiCheck: true,
                        idKey: 'uniqueId',
                        format: {
                            list: 'res',
                            count: 'totalCount',
                            pageSize: 'pageSize',
                            currentPage: 'pageNumber'
                        },
                        recordTools: [],
                        datasource: (filter) => {
                        },
                        filter: {
                        }
                    },
                    toolbar: [{
                        label: '移至右眼',
                        color: 'success',
                        operate: () => {
                            if(this.selected&&this.pictures.length){
                                var rightEye=[];
                                this.pictures.forEach(v=>{
                                    rightEye.push(JSON.parse(v).result.md5);
                                });
                                var para={
                                    toPatientId:JSON.parse(this.selected).patient.id,
                                    recordId:JSON.parse(this.selected).activityRegister.recordId,
                                    fromCardId:JSON.parse(this.selected).eyeScreen.id,
                                    moveValue: JSON.stringify({rightEyeGroundFile:rightEye.join(',')})
                                };
                                return Promise.resolve().then(() => {
                                    return $http({
                                            url: '/service/business/card/file/move',
                                            type: 'POST',
                                            data: para
                                        }).then(res => {
                                            var delPic = this.pictures.map(v=>{
                                                return JSON.parse(v).result.md5
                                            });
                                            this.eyeBottomModel.eyeBottom = JSON.stringify(this.pictureList = JSON.parse(this.eyeBottomModel.eyeBottom).filter(item=>delPic.indexOf(item.result.md5)==-1));
                                            Sunset.tip('转移成功','success')
                                    })
                                })
                            }else{
                                Sunset.tip('请选择目标患者及图像','warning');
                            }
                        },
                    },{
                        label: '移至左眼',
                        color: 'success',
                        operate: () => {
                            if(this.selected&&this.pictures.length){
                                var leftEye=[];
                                this.pictures.forEach(v=>{
                                    leftEye.push(JSON.parse(v).result.md5);
                                });
                                var para={
                                    toPatientId:JSON.parse(this.selected).patient.id,
                                    recordId:JSON.parse(this.selected).activityRegister.recordId,
                                    fromCardId:JSON.parse(this.selected).eyeScreen.id,
                                    moveValue: JSON.stringify({leftEyeGroundFile:leftEye.join(',')})
                                };
                                return Promise.resolve().then(() => {
                                    return $http({
                                            url: '/service/business/card/file/move',
                                            type: 'POST',
                                            data: para
                                        }).then(res => {
                                            var delPic = this.pictures.map(v=>{
                                                return JSON.parse(v).result.md5
                                            });
                                            this.eyeBottomModel.eyeBottom = JSON.stringify(this.pictureList = JSON.parse(this.eyeBottomModel.eyeBottom).filter(item=>delPic.indexOf(item.result.md5)==-1));
                                            Sunset.tip('转移成功','success')
                                    })
                                })
                            }else{
                                Sunset.tip('请选择目标患者及图像','warning');
                            }
                        },
                    }, {
                        label: '取消',
                        color: 'ghost',
                        operate: () => {
                            this.$refs.tablemodal.cancel();
                        }
                    }]
                },
                formOptions: {
                    cast: (model) => {
                        model._allCheck = this.card.visiting.checks && this.card.visiting.checks[0] && this.card.visiting
                            .checks[
                                0].value ||
                            0;
                    },
                    submit: (data) => {
                        this.save(data);
                    }
                },
                toolbarOptions: {
                    align: 'center',
                    tools: [{
                        label: '编辑',
                        color: 'info',
                        operate: () => {
                            this.editing = true;
                            this.$refs.form.reset(this.data);
                            this.$emit('signal', 'EDIT');
                        }
                    }]
                }
            }
        },
        methods: {
            init() {
                this.editing = !this.data;
                this.$nextTick(() => {
                    if (this.$route.params.isEdit) {
                        this.editing = true;
                        this.$refs.form.reset(this.data);
                        this.$emit('signal', 'EDIT');
                    }
                });
            },
            patientName(item){
                return item.patient&&item.patient.extension?JSON.parse(item.patient.extension).name:''
            },
            selectedPatient(item){
                return item?JSON.stringify(item):''
            },
            selectedPicture(item){
                return item?JSON.stringify(item):''
            },
            submitTeam(){

            },
            getEditingData() {
                return this.$refs.form.getModel();
            },
            setEditingData(data) {
                this.editing = true;
                return this.$refs.form.reset(data);
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