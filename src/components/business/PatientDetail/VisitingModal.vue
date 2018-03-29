<style>
    .newbingli .sunset-field-label {
        text-align: left;
    }
</style>


<template>
    <div class="newbingli">
        <sunset-form-modal v-ref:registrationformmodal :options="options"></sunset-form-modal>
    </div>
</template>

<script>
    import Store from './Store';

    export default {
        props: {
            patient: {}
        },
        data() {
            return {
                options: {
                    title: '新建病历',
                    width: 1000,
                    style: 'max-height:400px;text-align:left;',
                    formOptions: {
                        cols: 4,
                        tools: false,
                        fields: [],
                        format: (model) => {
                            var dept=model.frontdept.slice(model.frontdept.lastIndexOf(",")+1);
                            var registration = {
                                patientType: model.patientType || null,
                                patientNumber: model.patientNumber,
                                registeredDept: dept.split('_')[1],
                                deptid: dept.split('_')[0],
                                patientAge: model.patientAge,
                                registeredDate: new Date(model.registeredDate).getTime()
                            };
                            var param = {};
                            param.patientId = model.patientId;
                            param.viewName = "registration";
                            param.digest = param.extension = JSON.stringify(Object.assign({}, registration));
                            param.hospitalId = GlobalService.getCurrentUserSync().relation.hospital[0].id;
                            Object.assign(param, registration);
                            return {
                                registration: JSON.stringify(param),
                                viewNames: GlobalService.getSystemConfig().addUserWithEmptyCards
                            };
                        },
                        submit: (m) => {
                            return Store.saveVisiting(m).then(res => {
                                Sunset.tip('添加成功', 'success');
                                this.$emit('saved');
                            })
                        }
                    }
                }
            }
        },
        methods: {
            open(visiting) {
                Promise.resolve().then(() => {
                    return GlobalService.getCustomForm('REGISTRATION_INFO')
                }).then(res => {
                    var index = 0;
                    res.fields.forEach(function(v){
                        if(v._sign && v._sign == true){
                            return index = res.fields.indexOf(v)
                        }
                    });
                    res.fields.splice(index,0,{
                        label: '科室',
                        name: 'frontdept',
                        widget: 'cascader',
                        changeOnSelect : true,
                        _cascadeOffice: true,
                        data: function (a, b, c) {
                            var options = this;
                            return $http({
                                url: '/service/business/group/tree/{organizationId}'.replace(
                                    /\{organizationId\}/, GlobalService.getCurrentUserSync()
                                    .relation.hospital[0].id),
                                type: 'GET'
                            }).then(res => {
                                var Dictionary = Sunset.Service.Dictionary;
                                var offices = [],
                                    officeMap = {},
                                    officeUsers = {};

                                function isBusinessOffice(category) {
                                    return category == Dictionary.alias('ORG_CODE',
                                        'CLINICAL') || category == Dictionary.alias(
                                        'ORG_CODE', 'RADIOLOGY');
                                }

                                function isDoctor(category) {
                                    return category == Dictionary.alias('ORG_CODE',
                                        'PERSONAL');
                                }

                                function addMembers(office, parentId,parentIds) {
                                    var id = office.id;
                                    var name = office.name;
                                    var category = office.category;
                                    if (isBusinessOffice(category)) {
                                        var officeObj = {
                                            label: name,
                                            value: id+'_'+name
                                        };
                                        if (parentId && officeMap[parentId]) {
                                            officeMap[parentId].children = officeMap[
                                                parentId].children || [];
                                            officeMap[parentId].children.push(officeObj);
                                        } else {
                                            offices.push(officeObj)
                                        }
                                        officeMap[id] = officeObj;
                                    }
                                    parentIds = parentIds.concat([id]);
                                    if (office.members) {
                                        office.members.forEach(m => {
                                            if (isBusinessOffice(m.memberCategory)) {
                                                addMembers(m.entity, id,parentIds);
                                            } else if (isDoctor(m.memberCategory)) {
                                                m.entity.memberId = m.id;
                                                parentIds.forEach(pId=>{
                                                    officeUsers[pId] = officeUsers[pId] ||
                                                        [];
                                                    officeUsers[pId].push(m.entity);
                                                })
                                            }
                                        })
                                    }
                                }
                                if (res) {
                                    res.members && res.members.forEach(function (item) {
                                        if (isBusinessOffice(item.memberCategory)) {
                                            addMembers(item.entity,null,[]);
                                        }
                                    });
                                }
                                options.officeUsers = officeUsers;
                                return offices;
                            })
                        }
                    });
                    // res.fields.push({
                    //     label: '科室成员',
                    //     name: 'dept_users',
                    //     widget: 'select',
                    //     data: [],
                    //     watch: ['dept_test', (dep, options, model, formOptions) => {
                    //         var officeUsers = formOptions.fields.filter(item => item._cascadeOffice)[
                    //             0].officeUsers;
                    //         var s = dep.dept_test&&dep.dept_test.split(',')||[];
                    //         var lastOfficeId = s[s.length-1];
                    //         model[options.name] = '';
                    //         options.data = officeUsers && officeUsers[lastOfficeId] &&
                    //             officeUsers[lastOfficeId].map(item => ({
                    //                 value: item.userId,
                    //                 text: item.name
                    //             })) || [];
                    //     }]
                    // });
                    this.options.formOptions.fields = res.fields;

                    var office = GlobalService.getCurrentUserSync().relation.office;
                    visiting.frontdept = `${office.id}_${office.name}`;
                    this.$refs.registrationformmodal.open(visiting);
                });
            }
        }
    }
</script>