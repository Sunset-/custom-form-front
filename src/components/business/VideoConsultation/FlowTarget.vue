<style lang="sass">
    .ztree.mdp-ft-tree {
        overflow: overlay;
        height: 370px;
        li {
            line-height: 20px;
        }
        li span.button.ico_open {
            display: none;
        }
        li span.button.ico_close {
            display: none;
        }
        li span.button.edit {
            display: none;
        }
        li span.button.ico_docu {
            display: none;
        }
        li span.button.chk.checkbox_true_part {
            background-position: -14px 0;
        }
        li span.button.chk.checkbox_false_part {
            background-position: 0 0;
        }
        * {
            font-size: 14px;
        }
        li {
            a,
            a.curSelectedNode,
            a.curSelectedNode_Edit {
                height: 20px;
            }
        }
    }

    .bottompage {
        position: relative;
        left: 0;
        bottom: 0;
        width: 100%;
        height: 80px;
        padding: 5px;
        .bottompagetitile {
            width: 100%;
            background: #ccc;
            font-size: 14px;
        }
        .bottomflow {
            overflow: auto;
            width: 100%;
            height: 50px;
            padding-left: 5px;
        }
    }
</style>

<template>
    <sunset-tree class="mdp-ft-tree" :options="treeOptions" :nodes="treeNodes" @checked="checked"></sunset-tree>
    <div class="bottompage">
        <div class="bottompagetitile">受邀：</div>
        <div class="bottomflow">
            <div v-for="item in SEENODE">
                {{item.parentName}}
            </div>
        </div>

    </div>
</template>
<script>
    import Store from '../FlowData/FlowTarget/Store';
    export default {
        props: {
            type: {

            },
            check: {}
        },
        data() {
            return {
                SEENODE: {},
                snode: {},
                CANT_CHECK_CONFIG: {
                    'VideoConsultation': [Sunset.Service.Dictionary.alias('ORG_CODE', 'HOSPITAL')]
                },
                treeOptions: {
                    autoExpand: true,
                    check: this.check == 'single' ? 'single' : 'multi',
                    setting: {
                        data: {
                            key: {
                                name: 'name',
                                title: 'name'
                            },
                            simpleData: {
                                enable: true,
                                idKey: 'id',
                                pIdKey: 'parentId',
                                rootPId: null
                            }
                        },
                        check: {
                            radioType: 'all',
                            chkboxType: {
                                "Y": "",
                                "N": ""
                            }
                        },
                        format: {
                            nodeToValue(treeNode) {
                                return treeNode && treeNode.data;
                            }
                        },
                        callback: {
                            onClick: function (event, treeId, treeNode, clickFlag) {
                                var treeObj = $.fn.zTree.getZTreeObj(treeId);
                                treeObj.checkNode(treeNode, !treeNode.checked, false, true);
                            }
                        }
                    }
                },
                treeNodes: (() => {
                    var hospital = GlobalService.getCurrentUserSync().relation.hospital[0];
                    var self = this;
                    return Store.loadRelsFromA({
                        partyaId: hospital.id,
                        needtree: true
                    }).then((res) => {
                        var nodes = [];
                        var tuandui = "";
                        var node_members = {};
                        // var numbers = [];
                        res && res.forEach(item => {
                            item.scenesType == 1 ? tuandui = item.partyb.name : "";
                            var scenesName = item.partya.name;
                            var scenesId = item.scenesId;
                            var userid = item.partyb.id;
                            // debugger
                            var Dictionary = Sunset.Service.Dictionary;
                            // numbers.push(item.id);
                            if (item.scenesType & Sunset.Service.Dictionary.alias(
                                    'SCENES_CATEGORY', this.type)) {
                                function addMembers(parent, memberId, parentId, isTree,
                                    parentName,parentIds) {
                                    var name = parent.entity.name;
                                    var category = parent.memberCategory;
                                    var memberEntityId = parent.memberEntityId;
                                    if (category && (category.indexOf(Dictionary.alias(
                                            'ORG_GROUP_CODE', 'DEPT')) == 0) && (category !=
                                            Dictionary.alias('ORG_CODE', 'CLINICAL') &&
                                            category != Dictionary.alias('ORG_CODE',
                                                'RADIOLOGY'))) {
                                        return;
                                    }
                                    node_members[memberId] = {};
                                    if(category==Dictionary.alias('ORG_CODE', 'PERSONAL')){
                                        node_members[memberId][parent.entity.userId] = name;
                                        parentIds.split(',').forEach(parentId=>{
                                            if(node_members[parentId]){
                                                node_members[parentId][parent.entity.userId] = name;
                                            }
                                        })
                                    }
                                    nodes.push({
                                        id: parent.memberEntityId,
                                        name: name,
                                        parentId: parentId,
                                        icon: '/assets/tree-icons/home.png',
                                        nocheck: self.CANT_CHECK_CONFIG[self.type] && (~
                                            self.CANT_CHECK_CONFIG[self.type].indexOf(
                                                category)),
                                        data: {
                                            id: memberId,
                                            name: name,
                                            category: category,
                                            scenesId: scenesId,
                                            userid:userid,
                                            memberEntityId:memberEntityId,
                                            parentName: parentName,
                                            members : node_members[memberId]
                                            // currentTargetType:numbers,
                                        },
                                        
                                    });
                                    if (isTree && parent.entity.members) {
                                        parent.entity.members.forEach(m => {
                                            addMembers(m, m.id, m.organizationId,
                                                isTree,
                                                `${parentName} - ${m.entity.name}`,`${parentIds},${memberId}`);
                                        })
                                    }
                                }
                                addMembers({
                                    id : item.partybMemberId,
                                    memberCategory : item.partybCategory,
                                    memberEntityId : item.partybId,
                                    entity : item.partyb
                                }, item.partybMemberId, null, true, item.partyb
                                    .name,item.partybMemberId);
                            }
                        });
                        this.snode = nodes;
                        return nodes;
                    });
                })()
            }
        },
        methods: {
            checked(nodes) {
                // debugger;
                this.SEENODE = nodes;
                this.$emit('checked', nodes);
            }
        }
    }
</script>