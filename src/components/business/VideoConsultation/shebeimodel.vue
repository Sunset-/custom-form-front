<style lang="sass">
.video-shebei-modal {
        .ivu-modal-body {
            padding: 0px;
            .modal-major {
                position: relative;
                height: 420px;
                width:100%;
                font-size:16px;
                padding:10px;
               .shebeirow{
                   line-height:40px;
                   .labeititel{
                       width:100px;
                       display:inline-block;
                       vertical-align: top;
                   }
                   .shebeiyou{
                       display:inline-block;
                       margin-top:5px;
                       input{
                            padding-left: 10px;
                            width: 590px;
                       }
                       ul li{
                           cursor: pointer;
                            font-size: 16px;
                       }
                   }
                   .benji{
                       cursor: pointer;
                       background:#E5E5E5;
                       padding: 0 10px;
                       width: 650px;
                   }
                   .benyuan{
                       border:1px solid #bbc3c5;
                       padding: 5px 10px;
                       height:170px;
                       width:650px;
                       overflow: overlay;
                       ul>li{
                           background:#E5E5E5;
                           margin-top: 5px;
                           padding: 0 15px;
                       }
                   }
                   .jieguo{
                       border:1px solid #bbc3c5;
                       padding: 5px 10px;
                       height:110px;
                       width:650px;
                       overflow: overlay;
                       
                   }
                   .selectshebei{
                       width: 100%;
                       ul>li{
                           background:#E5E5E5;
                           margin-top: 5px;
                           padding: 0 15px;
                       }
                   }
                   .chose{
                       background:#0c6 !important; 
                       color:#fff !important;
                   }
               } 
            }
        }
        .ivu-btn-primary{
            background-color: #0c6;
            border-color: #0c6;
        }
    }
</style>


<template>
    <Modal :class-name="'video-shebei-modal'" :visible.sync="visible" title="选择设备" :mask-closable="false" :width="800" @on-ok="confirmRet" :putequipment="putequipment">
        <div class="modal-major">
            <div class="shebeirow">
                <div class="labeititel">本机：</div>
                <!-- 设置一个值，切换东西 -->
                <div id="list" class="shebeiyou benji" :class="{chose: equ == isActive}"  v-on:click="checkthis()">
                    选择本机自带摄像头
                    <Icon v-show="equ == isActive" type="checkmark-round" size="30" style="float:right;margin-top:5px;" color="white"></Icon>
                </div>
            </div>
            <div class="shebeirow">
                <div class="labeititel">本院：</div>
                <div class="shebeiyou benyuan">
                    <ul>
                        <!-- <li>编号：20100110 名称：远程第一会诊室 所属医院：北京协和医院 <Icon v-show="isActive" type="checkmark-round" size="30" style="float:right;margin-top:5px;" color="red"></Icon></li>
                        <li>编号：20100110 名称：远程第一会诊室 所属医院：北京协和医院</li>
                        <li>编号：20100110 名称：远程第222222222222222一会诊室 所属医院：111111111111112222222222北京协和医院</li> -->
                        <li id="list" v-for="equ in equipment" :class="{chose: equ == isActive}" v-on:click="checkthis(equ)">
                             编号：{{equ.code}} &nbsp;&nbsp;&nbsp; 名称：{{equ.equipName}} &nbsp;&nbsp;&nbsp; 所属医院：{{equ.hospitalName}}
                             <Icon v-show="equ == isActive" type="checkmark-round" size="30" style="float:right;margin-top:5px;" color="white"></Icon>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="shebeirow">
                <div class="labeititel">搜索设备：</div>
                <div class="shebeiyou">
                    <input type="text" id="shebeiid" v-on:input="myfunction" placeholder="请输入设备编号">
                    <!-- ivu-btn ivu-btn-success          ivu-btn ivu-btn-primary ivu-btn-large-->
                    <button class="ivu-btn ivu-btn-success" v-on:click="searchequ"> 搜索 </button>
                </div>
            </div>
            <div class="shebeirow">
                <div class="labeititel">搜索结果：</div>
                <div class="shebeiyou jieguo">
                    <div class="selectshebei">
                    <ul v-show="true"><!--v-show="selectequipment"-->
                        <!-- <li>编号：20100110 名称：远程第一会诊室 所属医院：北京协和医院</li>
                        <li>编号：20100110 名称：远程第一会诊室 所属医院：北京协和医院</li>
                        <li>编号：20100110 名称：远程第一会诊室 所属医院：北京协和医院</li> -->
                        <li id="list" v-for="equ in selectequipment" :class="{chose: equ == isActive}"  v-on:click="checkthis(equ)">
                             编号：{{equ.code}} &nbsp;&nbsp;&nbsp; 名称：{{equ.equipName}} &nbsp;&nbsp;&nbsp; 所属医院：{{equ.hospitalName}}
                             <Icon v-show="equ == isActive" type="checkmark-round" size="30" style="float:right;margin-top:5px;" color="white"></Icon>
                        </li>
                    </ul>
                    </div>
                </div>
            </div>
        </div>
    </Modal>
</template>

<script>
    import Store from './Store.js';
export default {
  components: {
        },
        props: {
        },
        data() {
            return {
                equipment:"",
                selectequipment:"",
                putequipment:"",
                patient : null,
                targets: null,
                checkeds:"",
                isOrder:false,
                visible: false,
                modal_loading: false,
                isActive: ''
            }
        },
        methods: {
            open(model) {
                // this.$refs.form.reset(model);
                $("#shebeiid").val("");
                this.visible = true;
            },
            cancel() {
                this.visible = false;
                this.modal_loading = false;
                this.$emit('cancel');
            },
            afterCancel() {
                this.$emit('cancel');
            },
            confirmRet(){
                if(this.putequipment&&this.putequipment.code.length<8){
                    // alert(this.putequipment.length)
                    Sunset.tip("设备编号有误","warning");
                }
                // alert(this.putequipment.code);
                this.$emit('putequipment',this.putequipment);

                // 设备号 名称 之类
                // if(this.putequipment){
                //     var hassettingid = GlobalService.getCurrentUserSync().relation.settings;
                //     var settingid="";
                //     debugger
                //     if(hassettingid){settingid=hassettingid[0].id};
                //      var settings={
                //     id:settingid,
                //         settings:{
                //             code:this.putequipment.code,
                //             equipName:this.putequipment.equipName,//this.putequipment.equipName
                //             hospitalName:this.putequipment.hospitalName,//this.putequipment.hospitalName
                //             equipmentId:this.putequipment.equipmentId,
                //         }   
                //     }
                //     Store.usersetting(settings)
                // }
               
            },
            myfunction(){
                // var pid = $("#shebeiid").val();
                // this.putequipment=pid;
                // if(pid.length>=8){
                //     Store.selectequipment(pid).then((res) => {
                //         console.log(" selectequipment res")
                //         console.log(res);
                //         this.selectequipment = res;
                //     });
                // }
            },
            checkthis(equ){
                console.log(equ)
                if(!equ){
                    this.putequipment = "";
                    // this.selectequipment=false;
                    // $("#shebeiid").val("本机摄像头");
                }
                // var pid = $("#shebeiid").val();
                // $("#shebeiid").val(equ.code+" "+equ.equipName+" "+equ.hospitalName);
                this.putequipment = equ;
                // this.selectequipment=false;

                // 点击效果
                $("#list").removeClass("chose");
                this.isActive = equ;
            },
            searchequ(){
                var pid = $("#shebeiid").val();
                if(pid.length<7){Sunset.tip('设备号最少8位','warning');}
                Store.selectequipment(pid).then((res) => {
                    this.selectequipment = res;
                });
            }
        },
        computed:{

        },
        ready() {
            var hospital = GlobalService.getCurrentUserSync().relation.hospital;
            var hospitalid = GlobalService.getCurrentUserSync().relation.hospital[0].id ;
            // hospital &&hospital.forEach(item => {
            //     item.property==1?hospitalid=item.id:"";
            // })
            if(!hospitalid){
                return
            }
            Store.loadAll(hospitalid).then((res) => {
                console.log(" equipment res")
                console.log(res);
                this.equipment = res;
            });
        },
}
</script>
