<style lang="sass">
    .Dictionaries-container {
        position: absolute;
        top: 50px;
        left: 0px;
        right: 0px;
        bottom: 0px;
        &>header {
            background: #F2F2F2;
            padding: 10px;
            overflow: hidden;
            height: 40px;
            line-height: 20px;
            &>span {
                display: inline-block;
                font-size: 16px;
            }
        }
        .Dictionaries-content {
            position: absolute;
            top: 0px;
            left: 0px;
            right: 0px;
            bottom: 0px;
            .sidebar {
                position: absolute;
                top: 0px;
                left: 0px;
                bottom: 0px;
                width: 220px;
                box-sizing: border-box;
                border-right: 1px solid #ccc;
                color: #222;
                overflow: auto;
                padding: 0px;
                &>.office-ul {
                    position: static;
                    &>li {
                        border: 1px solid #C1D0E0;
                        border-radius: 2px;
                        background: #E7F0F5;
                        padding: 10px;
                        cursor: pointer;
                        margin-bottom: 10px;
                        &.active,
                        &:active {
                            border: 1px solid #FFCC66;
                            background: #FFF7E8;
                        }
                        h4 {
                            font-size: 16px;
                            padding-bottom: 5px;
                        }
                        p {
                            padding-top: 10px;
                            margin-bottom: 0px;
                            color: #555;
                        }
                    }
                }
            }
            .major_title {
                height: 50px;
                line-height: 50px;
                position: absolute;
                top: 0;
                background: #F2F2F2;
                left: 220px;
                padding: 0 10px;
                width: 100%;
                font-size: 18px;
                font-weight: bold;
                color: #222;
                &>span {
                    margin-left: 15px;
                    height: 100%;
                    width: 80px;
                    display: inline-block;
                    text-align: center;
                    cursor: pointer;
                }
                .active {
                    background: #fff;
                }
            }
            .major {
                position: absolute;
                top: 0px;
                left: 220px;
                right: 0px;
                bottom: 0px;
                overflow: auto;
                padding: 10px 20px;
                &>div>h4 {
                    font-size: 14px;
                    font-weight: bold;
                    color: #222;
                    padding: 10px 0px;
                    margin-bottom: 10px;
                    border-bottom: 1px solid #aaa;
                }
                & .ivu-modal {
                    top: 70px !important;
                }
                .setintegral{
                    background:#f2f2f2;
                    padding:10px;
                    font-size: 16px;
                    line-height: 30px;
                    margin-bottom:10px;
                    .tit{
                        font-weight:bold;
                        font-size: 18px;
                    }
                    .xiugai{
                        color:#00f;
                        margin-left:20px;
                        cursor:pointer;
                    }
                    .leixingsp{
                        border-bottom: 1px dashed #ccc;
                        margin-bottom: 5px;
                        span{
                            margin-right:20px;
                        }   
                    }
                }
            }
        }
    }
</style>
<template>
    <div class="Dictionaries-container">
        <!--  这下面这些注释先别删,   有惊天地泣鬼神的大用 -->
        <div class="Dictionaries-content">
            <div class="sidebar">
                <!-- <div style="padding:2px 0px 2px 10px;">
                    <sunset-toolbar :options="officeToolbarOptions"></sunset-toolbar>
                </div> -->
                <sunset-tree v-ref:localtree :options="localTreeOptions" :nodes="localTreeNodes" @inited="localTreeInited"></sunset-tree>
                <!-- <sunset-form-modal v-ref:officemodal :options="modalOptions"></sunset-form-modal> -->
            </div>
            <div class="major">
                <!-- <sunset-toolbar :options="doctorToolbar" style="margin-bottom:10px;"></sunset-toolbar> -->
                <div class="setintegral">
                    <div class="tit">全局积分规则设置</div>
                    <div>预约转诊    <span class="xiugai" @click="zhuanzhenchange">【修改】</span> </div>
                    <div class="leixingsp">
                        <span>住院转诊：{{transfertreatment?transfertreatment.zhuyuan:"0"}}积分 / 例</span>
                        <span>门诊转诊：{{transfertreatment?transfertreatment.menzhen:"0"}}积分 / 例</span>
                        <span>急诊转诊：{{transfertreatment?transfertreatment.jizhen:"0"}}积分 / 例</span>
                        <span>康复转诊：{{transfertreatment?transfertreatment.kangfu:"0"}}积分 / 例</span>
                    </div>
                    <div>预约检查：{{ordercheck?ordercheck.yuyuejiancha:"0"}}  % / 例   <span class="xiugai" @click="jianchachange">【修改】</span> </div>
                </div>
                <sunset-table v-ref:doctortable :options="doctorTableOptions"></sunset-table>
                <!-- <doctor-modal v-ref:doctormodal @submit="addDoctors"></doctor-modal> -->
                <sunset-form-modal v-ref:zhuanzhenmodal :options="zhuanzhenOptions"></sunset-form-modal>
                <sunset-form-modal v-ref:jianchamodal :options="jianchaOptions"></sunset-form-modal>
                <sunset-form-modal v-ref:jiagemodal :options="jiageOptions"></sunset-form-modal>
                <sunset-form-modal v-ref:jifenmodal :options="jifenOptions"></sunset-form-modal>
                <!-- <sunset-form-modal v-ref:dutymodal :options="dutyOptions"></sunset-form-modal> -->
            </div>
        </div>
    </div>
</template>
<script>
    import Store from './Store.js';
    // import DoctorStore from '../../Doctor/DoctorStore.js';
    // import DoctorModal from '../../Doctor/DoctorModal.vue';

    export default {
        components: {
            // DoctorModal
        },
        props: {
            hospital: {}
        },
        data() {
            return {
                hospitalNode: null,
                currentTreeNode: null,
                transfertreatment:null,//预约转诊
                ordercheck:null,//预约检查
                // officeToolbarOptions: {
                //     size: 'small',
                //     tools: [{
                //         label: '新建科室',
                //         color: 'success',
                //         icon: 'plus',
                //         operate: () => {
                //             var currentTreeNode = this.currentTreeNode;
                //             this.editOffice(this.currentTreeNode ? {
                //                 parentId: this.currentTreeNode.id,
                //                 parentName: this.currentTreeNode.name,
                //                 originCategory: currentTreeNode ? currentTreeNode.category : null,
                //                 category: currentTreeNode ? currentTreeNode.category : null
                //             } : {
                //                 parentId: this.hospital.id,
                //                 parentName: this.hospital.name
                //             });
                //         }
                //     }, {
                //         label: '修改',
                //         color: 'warning',
                //         icon: 'edit',
                //         operate: () => {
                //             var currentTreeNode = this.currentTreeNode;
                //             if (currentTreeNode) {
                //                 this.editOffice(currentTreeNode);
                //             } else {
                //                 Sunset.tip('请选择一个科室');
                //             }
                //         }
                //     }, {
                //         label: '删除',
                //         color: 'error',
                //         icon: 'trash-a',
                //         operate: () => {
                //             var currentTreeNode = this.currentTreeNode;
                //             if (currentTreeNode) {
                //                 var clear = Sunset.confirm({
                //                     content: `确定删除科室：${currentTreeNode.name}`,
                //                     loading: true,
                //                     onOk: () => {
                //                         Store.remove({
                //                             organizationId: currentTreeNode.parentId,
                //                             memberEntityId: currentTreeNode.id
                //                         }).then(res => {
                //                             clear();
                //                             Sunset.tip('删除成功', 'success');
                //                             this.$refs.localtree.removeNode(
                //                                 currentTreeNode);
                //                             this.currentTreeNode = null;
                //                         });
                //                     }
                //                 });


                //             }
                //         }
                //     }]
                // },
                localTreeOptions: {
                    autoExpand: 'all',
                    setting: {
                        view: {
                            expandSpeed: ''
                        },
                        data: {
                            key: {
                                name: 'name',
                                title: 'name'
                            },
                            simpleData: {
                                enable: true,
                                idKey: 'id',
                                pIdKey: 'parentId',
                                rootPId: '0'
                            }
                        },
                        edit: {
                            enable: true,
                            showRenameBtn: function (treeId, treeNode) {
                                return false;
                            },
                            showRemoveBtn: function (treeId, treeNode) {
                                return false;
                            },
                            removeTitle: '删除',
                            renameTitle: "编辑节点名称"
                        },
                        callback: {
                            onClick: (event, treeId, treeNode, clickFlag) => {
                                if (treeNode.category) {
                                    
                                    this.selectOffice(treeNode.category);
                                } else {
                                    this.selectOffice(null);
                                }
                            }
                        },
                        check: {
                            radioType: 'all'
                        },
                        format: {
                            nodeToValue(treeNode) {
                                return treeNode && treeNode.data;
                            }
                        }
                    }
                },
                localTreeNodes: [],
                // modalOptions: {
                //     width: 600,
                //     title: '科室管理',
                //     formOptions: {
                //         cols: 2,
                //         fields: [{
                //             label: '上级',
                //             name: 'parentName',
                //             monopolize: true,
                //             widget: 'input',
                //             readonly: true
                //         }, {
                //             label: '科室名称',
                //             name: 'name',
                //             widget: 'input',
                //             validate: {
                //                 required: true,
                //                 maxlength: 30
                //             }
                //         }, {
                //             label: '科室类型',
                //             name: 'category',
                //             textPlace: 'value',
                //             valuePlace: 'key',
                //             premise(model) {
                //                 return !model.id;
                //             },
                //             data: () => {
                //                 return Sunset.Service.Dictionary.getEnums('ORG_CODE').filter(item => item.key
                //                     .indexOf(Sunset.Service.Dictionary.alias(
                //                         'ORG_GROUP_CODE', 'DEPT')) == 0);
                //             },
                //             widget: 'select',
                //             validate: {
                //                 required: true
                //             }
                //         }],
                //         tools: false,
                //         format: (model) => {
                //             model.systemId = model.systemId || GlobalService.getSystemId();
                //             return model;
                //         },
                //         submit: (model) => {
                //             return Store.save(model).then(res => {
                //                 Sunset.tip('保存成功', 'success');
                //                 if (this.currentTreeNode && model.id == this.currentTreeNode.id) {
                //                     Object.assign(this.currentTreeNode, res);
                //                     this.$refs.localtree.updateNode(this.currentTreeNode);
                //                 } else if (!model.id) {
                //                     this.$refs.localtree.addNodes(this.currentTreeNode || this.hospitalNode, {
                //                         id: res.id,
                //                         parentId: model.parentId,
                //                         parentName: model.parentName,
                //                         name: res.name,
                //                         category: res.category,
                //                         extension: res.extension,
                //                         systemId: res.systemId,
                //                         icon: '/assets/tree-icons/home.png'
                //                     });
                //                 }
                //                 return res;
                //             });
                //         }
                //     }
                // },
                //医生相关
                doctorToolbar: [{
                    label: '添加医生',
                    color: 'info',
                    operate: () => {
                        if (this.currentTreeNode && this.currentTreeNode.parentId != '0') {
                            this.$refs.doctormodal.open();
                        } else {
                            Sunset.tip('请选择科室');
                        }
                    }
                }],
                doctorTableOptions: {
                    sortable: true,
                    lazy: true,
                    columns: [{
                        title: '检查类型',
                        name: 'categoryB',
                        // format(v, record) {

                        //     return v + (record.property == '4' ?
                        //         '<i style="color:orange;font-size:18px;margin-left:3px;" class="ivu-icon ivu-icon-person"></i>' :
                        //         '')
                                
                        // }
                    }, {
                        title: '检查项目',
                        name: 'item',
                        // format(v, record) {
                        //     // return v.substring(0, v.indexOf("@"));
                        // }
                    }, {
                        title: '价格',
                        name: 'price'
                    }, {
                        title: '积分',
                        name: 'fastSettingCoinNum',
                        // style: 'color:red;',
                        format(v,record) {
                            // debugger
                            return record.coinNum?'<span style="text-decoration-line: line-through;" >'+v+'</span>':'<span>'+v+'</span>'
                        }
                    }, {
                        title: '自定义积分',
                        name: 'coinNum'
                    }],
                    recordTools: [{
                            label: '价格设置',
                            colir: 'success',
                            operate: (record) => {
                                this.$refs.jiagemodal.open(record);
                            }
                        },
                        {
                            label: '积分设置',
                            color: 'success',
                            operate: (record) => {
                                this.$refs.jifenmodal.open(record);
                            }
                        }
                    ],
                    pageNumberStart: 0,
                    localPage : true,
                    pageSize : 10,
                    format: {
                        list: '',
                        count: 'length',
                        pageSize: 'pageSize',
                    },
                    datasource: (filter) => {
                        console.log(this.transfertreatment);
                        //  ""  == this.localTreeNodes[0].id
                        this.hospitalplatcoin();
                        return Store.loadzidian({
                            organizationId:this.currentTreeNode ? this.currentTreeNode : "",
                            hospitalId:this.hospital.id,
                            categoryA:this.currentTreeNode
                        }).then(res => {
                            // console.log(this.ordercheck);
                            // this.ordercheck&&res&&res.forEach(item => {
                            //     item.jifen =parseInt(item.price*this.ordercheck.zhuyuan/100)  ;
                            // })
                            // debugger
                            return res
                        });
                    }
                },
                // dutyOptions: {
                //     title: '设置角色',
                //     formOptions: {
                //         cols: 2,
                //         fields: [{
                //             label: '角色',
                //             name: 'property',
                //             widget: 'checkbox',
                //             data: Sunset.Service.Dictionary.getEnums('OFFICE_DUTY_TYPE').filter(item => item.key !=
                //                 '0').map(item => ({
                //                 value: item.key,
                //                 text: item.value
                //             })),
                //             monopolize: true
                //         }],
                //         tools: false,
                //         cast(model) {
                //             var property = +model.property;
                //             var ps = Sunset.Service.Dictionary.getEnums('OFFICE_DUTY_TYPE').filter(item => (((+item.key) &
                //                 property) == item.key)).map(item => item.key);
                //             ps.sort();
                //             model.property = ps.join(',');
                //         },
                //         format(model) {
                //             model.property = model.property && model.property.split(',').reduce((res, p) => {
                //                 return res + +p;
                //             }, 0) || 0;
                //         },
                //         submit: (model) => {
                //             Store.setMemberDuty(model).then(res => {
                //                 this.$refs.doctortable.refresh();
                //                 return res;
                //             });
                //         }
                //     }
                // },
                // 弹框
                zhuanzhenOptions: {
                    width: 600,
                    title: '积分规则设置',
                    formOptions: {
                        cols: 2,
                        fields: [{
                            label: '住院转诊',
                            name: 'zhuyuan',
                            // widget: 'input',
                            widget: 'number',
                            digits : 0,
                            append : '积分/例',
                            validate: {
                                // required: true,
                                min:"0",
                                maxlength: 5
                            }
                        }, {
                            label: '门诊转诊',
                            name: 'menzhen',
                            widget: 'input',
                            append : '积分/例',
                            type : 'number',
                            digits : 0,
                            validate: {
                                min:"0",
                                maxlength: 5
                            }
                        }, {
                            label: '急诊转诊',
                            name: 'jizhen',
                            widget: 'input',
                            append : '积分/例',
                            type : 'number',
                            digits : 0,
                            validate: {
                                min:"0",
                                maxlength: 5
                            }
                        }, {
                            label: '康复转诊',
                            name: 'kangfu',
                            widget: 'input',
                            type : 'number',
                            digits : 0,
                            append : '积分/例',
                            validate: {
                                min:"0",
                                maxlength: 5
                            }
                        }],
                        tools: false,
                        submit: (model) => {
                            var hospitalId=this.hospital.id,
                            businessType = "transfertreatment",
                            id=this.transfertreatment&&this.transfertreatment.id,
                            config={
                                zhuyuan:model.zhuyuan,
                                menzhen:model.menzhen,
                                jizhen:model.jizhen,
                                kangfu:model.kangfu,
                            };
                            var pustmodel={hospitalId:hospitalId,businessType:businessType,config:JSON.stringify(config),id:id}
                            
                            return Store.setplatcoin(pustmodel).then(res => {
                                Sunset.tip('保存成功', 'success');
                                this.$refs.doctortable.refresh();
                                return res;
                            });
                        }

                    }
                },
                jianchaOptions:{
                    width: 600,
                    title: '积分规则设置',
                    formOptions: {
                        cols: 2,
                        fields: [{
                            label: '预约检查', //上面的每例百分比
                            name: 'yuyuejiancha',
                            widget: 'input',
                            type : 'number',
                            digits : 2,
                            append : '%/例',
                            validate:{
                                min:"0",
                                maxlength: 5
                            }
                        }],
                        tools: false,
                        submit: (model) => {
                            var hospitalId=this.hospital.id,
                            businessType = "ordercheck",
                            checkCoinPercent=model.yuyuejiancha/100,
                            id=this.ordercheck&&this.ordercheck.id,
                            config={
                                yuyuejiancha:model.yuyuejiancha,
                            };
                            var pustmodel={hospitalId:hospitalId,businessType:businessType,config:JSON.stringify(config),checkCoinPercent:checkCoinPercent,id:id}
                            return Store.setplatcoin(pustmodel).then(res => {
                                Sunset.tip('保存成功', 'success');
                                this.$refs.doctortable.refresh();
                                return res;
                            });
                        }
                    }
                },
                jiageOptions:{
                    width: 600,
                    title: '价格设置',
                    formOptions: {
                        cols: 2,
                        fields: [{
                            label: '价格',
                            name: 'price',
                            widget: 'input',
                            type : 'number',
                            digits : 2,
                            append : '元',
                            // validate: {
                            //     required: true,
                            //     maxlength: 30
                            // }
                        }],
                        tools: false,
                        submit: (model) => {
                            // model.price=model.newprice;
                            var postmodel={
                                hospitalId : model.hospitalId,
                                id:model.id,
                                price:model.price,
                            };
                            var postarr=[];postarr.push(postmodel);
                            return Store.setitem(postarr).then(res => {
                                Sunset.tip('保存成功', 'success');
                                this.$refs.doctortable.refresh();
                                return res;
                            });
                        }
                    }
                },
                jifenOptions:{
                    width: 600,
                    title: '积分规则设置',
                    formOptions: {
                        cols: 2,
                        fields: [{
                            label: '预约检查',
                            name: 'coinNum',
                            widget: 'input',
                            type : 'number',
                            digits : 0,
                            append : '积分/例',
                            // validate: {
                            //     required: true,
                            //     maxlength: 30
                            // }
                        }],
                        tools: false,
                        submit: (model) => {
                            var postmodel={
                                hospitalId : model.hospitalId,
                                id:model.id,
                                coinNum:model.coinNum==""?-1:model.coinNum,
                            };
                            var postarr=[];postarr.push(postmodel);
                            return Store.setitem(postarr).then(res => {
                                Sunset.tip('保存成功', 'success');
                                this.$refs.doctortable.refresh();
                                return res;
                            });
                        }
                    }
                },
            }
        },
        methods: {
            localTreeInited() {
                var node = this.$refs.localtree.getNodeByData(this.currentTreeNode);
                this.$refs.localtree.ztreeObj.selectNode(node);
            },
            // editOffice(office) {
            //     this.$refs.officemodal.open(office);
            // },
            selectOffice(office) {
                
                this.currentTreeNode = office;
                this.$refs.doctortable.refresh(1,true);//强制刷新到第一页
            },
            loadAllOffices() {
                //     this.hospital.id
                Store.loadAll(this.hospital.id).then(res => {
                    var nodes = []; 
                    this.hospital;
                    var hos={
                        name:this.hospital.name,
                        id:this.hospital.id,
                        icon: '/assets/tree-icons/home.png',
                        category:"",
                        parentId:0,
                    }
                    nodes.push(hos);
                    res.forEach(item => {
                        var keshi={
                            name:item,
                            id:item,
                            icon: '/assets/tree-icons/home.png',
                            category:item,
                            parentId:this.hospital.id
                        }
                        nodes.push(keshi);
                    });
                    // function addMembers(parent, memberId, parentId, parentName) {
                    //     var name = parent.name;
                    //     var category = parent.category;
                    //     nodes.push({
                    //         id: parent.id,
                    //         parentId: parentId,
                    //         name: name,
                    //         icon: '/assets/tree-icons/home.png',
                    //         data: {
                    //             id: parent.id,
                    //             parentId: parentId,
                    //             parentName: parentName,
                    //             name: name,
                    //             category: category,
                    //             extension: parent.extension,
                    //             systemId: GlobalService.getSystemId()
                    //         }
                    //     });
                    //     if (parent.members) {
                    //         parent.members.forEach(m => {
                    //             if (m.memberCategory.indexOf(Sunset.Service.Dictionary.alias(
                    //                     'ORG_GROUP_CODE', 'DEPT')) == 0) {
                    //                 addMembers(m.entity, m.id, m.organizationId, name);
                    //             }
                    //         })
                    //     }
                    // }
                    // if (res) {
                    //     this.hospitalNode = {
                    //         id: res.id,
                    //         parentId: '0',
                    //         parentName: '',
                    //         name: res.name,
                    //         category: res.category,
                    //         systemId: GlobalService.getSystemId()
                    //     };
                    //     addMembers(res, res.id, '0');
                    // }
                    this.$refs.localtree.refresh(this.localTreeNodes = nodes);
                    this.selectOffice(nodes[0]);
                });
            },
            // addDoctors(addDoctors) {
            //     return Store.addDoctors(addDoctors.map(doctor => {
            //         return {
            //             "systemId": GlobalService.getSystemId(),
            //             "memberEntityId": doctor.userId,
            //             "memberCategory": Sunset.Service.Dictionary.alias('ORG_CODE', 'PERSONAL'),
            //             "organizationId": this.currentTreeNode.id
            //         }
            //     })).then(res => {
            //         Sunset.tip("保存成功", "success");
            //         this.$refs.doctormodal.close();
            //         this.$refs.doctortable.refresh();
            //     }).catch(e => {
            //         this.$refs.doctormodal.cancelLoading();
            //     })
            // },

            //  new  add    啊啊啊  啊啊啊   啊啊啊   啊啊啊  啊啊啊  啊啊啊  啊啊啊  
            zhuanzhenchange(){
                this.$refs.zhuanzhenmodal.open(this.transfertreatment);
            },
            jianchachange(){
                this.$refs.jianchamodal.open(this.ordercheck);
            },
            hospitalplatcoin(){  //获取全局信息
            // this.hospital.id  "607668aec52347b19dc1fd0c90e10827"
                return Store.hospitalplatcoin(this.hospital.id).then(res => {
                    res.transfertreatment?this.transfertreatment = JSON.parse(res.transfertreatment.config):this.transfertreatment=null;
                    res.transfertreatment?this.transfertreatment.id = res.transfertreatment.id:this.transfertreatment=null;
                    res.ordercheck?this.ordercheck=JSON.parse(res.ordercheck.config):this.ordercheck=null;
                    res.ordercheck?this.ordercheck.id=res.ordercheck.id:"";
                })
            },
        },
        ready() {
            // this.hospitalplatcoin();
            this.loadAllOffices();
        },
        watch: {
            hospital(v) {
                // this.hospitalplatcoin();
                this.loadAllOffices();
            }
        }
    }
</script>