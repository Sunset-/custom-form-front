<style lang="sass">
    .consultation-im-container {
        .OICM{
                position: fixed;
                bottom: 5px;
                left: 5px;
                z-index:5;
            .inoicm{
                cursor: pointer;
                margin:10px;
                padding: 0 9px;
                padding-bottom: 5px;    
                border-radius: 50%;
                border:1px solid #454545;
                background: #fff;
                width: 50px;
                height: 50px;
                text-align: center;
            }
            .newmsgtip{
                color: #fff;
                background: #2cab8f;
                border-radius: 50%;
                border-color: #2cab8f;
            }
            .oicming{
                width:400px;
                height:500px;
                background:#f3f3f3;
                border:2px solid #827474;;
                .tittle{
                    background:#e5e5e5;
                    height: 30px;
                    padding: 5px;
                    .tittleclose{
                        float:right;
                        cursor: pointer;
                    }
                }
                .main{
                    background:#f3f3f3;
                    height: 370px;
                    overflow: auto;
                    .mycon{
                        text-align: right;
                    }
                    .OICMtime{
                        padding-top: 20px;
                        text-align:center;
                        margin-bottom: 5px;
                    }
                    .OICMname{
                        display: inline-block;
                        width: 50px;
                        vertical-align: top;
                        background:#b1b1b1;
                        border-radius: 50%;
                        text-align: center;
                        height: 35px;
                        padding-top: 6px;
                        margin-left: 10px;
                        background: #fff;
                    }
                    .OICMcontent{
                        display: inline-block;
                        background:#fff;
                        border-radius: 5px;
                        min-height: 35px;
                        margin-left:5px;
                        padding: 5px;
                        border-radius: 7px;
                        max-width: 300px;
                        white-space: pre-line;
                        text-align:left;
                        word-wrap: break-word;
                    }
                    .mysay{
                        background:#2cab8f;
                        color:#fff;
                    }
                }
                .fotsend{
                    border-top: 2px solid #827474;;
                    border-bottom: 2px solid #827474;;
                    height:100px;
                    background: #2cab8f;
                    input{
                        height: 95px;
                        width: 400px;
                    }
                    textarea{
                        height: 100%;
                        width: 80%;
                        resize: none;
                        font-size: 18px;
                        line-height: 30px;
                        padding: 0 5px;
                        float: left;
                    }
                    .fotsendmsg{
                        display: inline-block;
                        cursor: pointer;
                        width: 20%;
                        text-align: center;
                        padding-top: 18px;
                    }
                }
            }
        }
    }
</style>

<template>
    <div class="consultation-im-container">
        <div class="OICM">
            <div @click="inoicm" v-show="!inOrOut" class="inoicm">
                <Icon type="chatbubbles" size="40" style="margin-top: 5px;"></Icon>
            </div>
            <div v-show="inOrOut" class="oicming">
                <div class="tittle" @click="outoicm">
                     {{roomname}}
                    <div class="tittleclose" >
                        <Icon class="iconcol" type="minus-round" size="20" style="margin-right:10px;"></Icon>
                    </div>
                </div>
                <div class="main" id="yinanlundao" @scroll="pscroll($event)">
                    <div id="more" style="text-align: center;cursor:pointer;" @click="gethistory(5)">查看历史纪录</div>
                    <div v-for="store in oicmcontent" style="margin-bottom:20px;" :class="[store.id==userid?'mycon':'']">
                        <div class="OICMtime" v-show="store.date-store.lasttime>300000">
                            <span style="background:#dbdbdb;padding: 3px 10px;">{{store.date | time 'yyyy/MM/dd HH:mm'}}</span>
                        </div>
                        <!-- 552000 -->
                        <!-- <div class="OICMtime">{{store.date | time 'yyyy/MM/dd HH:mm'}}</div> -->
                        <div class="OICMname" v-show="!(store.id==userid)">{{store.username}}</div>
                        <div class="OICMcontent" :class="[store.id==userid?'mysay':'']">{{{store.content}}}</div>
                        <div class="OICMname mysay" v-show="store.id==userid">{{store.username}}</div>
                        <!-- <a href="/" class="zuihouyige">1111</a> -->
                    </div>
                    <!-- {{lasttime | time 'yyyy/MM/dd HH:mm:ss'}} -->
                </div>
                <div class="fotsend" :title="'Ctrl+Enter/Ctrl+S'">
                    <textarea id="sendmsg" rows="20" cols="3" placeholder="直接输入" @keydown="keydown($event)"></textarea> 
                    <div class="fotsendmsg" @click="sendoicm">
                        <Icon type="android-arrow-up" color="#fff" size="60" ></Icon>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import OICMStore from "./Store.js";
    import SunsetWebsocket from '../../../../common/ws.js';

    export default {
        ready(){
            this.openweb();
        },
        props: {
            roomid:"",
            roomname:"",
        },
        data() {
            return {
                oicmcontent:[],
                inOrOut:null,
                addpagenumber:0,
                lasttime:"",
                isclose:false,
                isnewopen:false,
                userid: GlobalService.getCurrentUserSync().user.userId,
                topic:`${GlobalService.getSystemConfig().imWsUrl}/im/ws?clientId=${GlobalService.getCurrentUserSync().user.userId}&clientType=PERSONNEL`,
                httptopic:`/sw-service/im/message/list/${GlobalService.getCurrentUserSync().user.userId}`,
            }
        },
        methods: {
            inoicm(){
                this.inOrOut=true;

                if(!this.isclose){
                    this.isclose=true;
                    this.gethistory();
                }
                this.scrollbottom();

            },
            openweb(){
            $http({
                    url: '/sw-service/im/message/join_room',
                    type: 'POST',
                    data: {
                        userId:GlobalService.getCurrentUserSync().user.userId,
                        // userId:"42db54f98f3e48af925a3be4945fd35c,b807dd4e0e3d49d4a8af98af852bf5bc",
                        roomId:this.roomid
                    }
                }).then(res=>{
                }).catch(res =>{
            })

				SunsetWebsocket.listen(this.topic, SunsetWebsocket.EVENTS.MESSAGE, (res) => {
                    if(res){
                            $(".inoicm").addClass("newmsgtip")
                    }
                    if(this.inOrOut!=null){
                        if (res.content) {
                            res.content.username=(res.content.name.length>2?res.content.name.substr(res.content.name.length-2):res.content.name);
                            res.content.lasttime=this.lasttime;
                            this.lasttime=res.content.date;
                            this.oicmcontent.push(res.content);
                            this.scrollbottom();
                        }
                    }
				})
				SunsetWebsocket.connect({
					url: this.topic,
					json: true
                }).then(res=>{
                });
            },
            gethistory(addpage){
                // 获取前5个元素的高度

                //  设定一些默认
                var pageSize = 5;
                if(addpage){
                    this.addpagenumber+=1;
                }
                $http({
                url: this.httptopic,
                type: 'GET',
                data: {
                    whosId:this.roomid,
                    pageNumber:this.addpagenumber,
                    pageSize:pageSize,
                }
                }).then(res=>{}).catch(res =>{
                    var sometime;
                    res&&res.forEach(item=>{
                        var item = JSON.parse(item);
                        this.lasttime = item.content.date; 
                        item.content.name.length>2?item.content.username=item.content.name.substr(item.content.name.length-2):item.content.username=item.content.name;
                            sometime==null?item.content.lasttime=null:item.content.lasttime=sometime;
                            sometime = item.content.date;
                            this.oicmcontent.unshift(item.content);
                    })
                    return this.oicmcontent.length;
                }).then(res=>{
                    var first5 = $("#yinanlundao div:nth-child(1)").height()+$("#yinanlundao div:nth-child(2)").height()+$("#yinanlundao div:nth-child(3)").height()+$("#yinanlundao div:nth-child(4)").height()+$("#yinanlundao div:nth-child(5)").height()+$("#yinanlundao div:nth-child(6)").height();
                    document.getElementById('yinanlundao').scrollTop=first5;
                })
                
            },
            outoicm(){
                // 关闭连接 
                $(".inoicm").removeClass("newmsgtip");
                // this.addpagenumber=0;
                // this.oicmcontent=[];
                this.inOrOut = false;

            },
            sendoicm(){
                

                var msg = $("#sendmsg").val().replace(/ /g,"&nbsp;");
                $("#sendmsg").val("");
                if(msg=="")return
                // // 发送提交数据
                SunsetWebsocket.send(this.topic, JSON.stringify({
                    from:GlobalService.getCurrentUserSync().user.userId,
                    fromType:'PERSONNEL',
                    to:this.roomid,
                    toType:"ROOM",
                    content:{
                        content:msg,
                        name:GlobalService.getCurrentUserSync().user.name,
                        date:new Date().getTime(),
                        id:GlobalService.getCurrentUserSync().user.userId,
                    },
                    handle:'PBCMHandler'
                }))
                
                this.scrollbottom();
            },
            scrollbottom(){
                setTimeout(function () {
                    var div = document.getElementById('yinanlundao');
                    div.scrollTop = div.scrollHeight;
                }, 200);
            },
            keydown(ev) {
				if (ev.keyCode == 13&&ev.ctrlKey) {
                    this.sendoicm();
                    event.preventDefault(); 
                    // event.stopPropagation();
                }
                if (ev.keyCode == 83&&ev.ctrlKey) {
                    this.sendoicm();
                    event.preventDefault(); 
                }
            },
            pscroll(ev){
                var scrollFunc = function (e) {  
                    e = e || document.getElementById('yinanlundao').event;  
                    if (e.wheelDelta) {                 
                        if (e.wheelDelta > 0) {
                            // console.log(document.getElementById("yinanlundao").scrollTop);
                            if(document.getElementById("yinanlundao").scrollTop=="0"){
                                $("#more").click();
                            }
                        }  
                        if (e.wheelDelta < 0) {  
                            if(document.getElementById("yinanlundao").scrollTop>=$("#yinanlundao").get(0).scrollHeight-370){
                                // 滚动到底部 
                            }
                        }  
                    } else if (e.detail) {  //Firefox滑轮事件  
                        if (e.detail> 0) { 
                        }  
                        if (e.detail< 0) {  
                        }  
                    }  
                }  
                // if (document.addEventListener) {
                //     document.addEventListener('DOMMouseScroll', scrollFunc, false);  
                // }  
                document.getElementById('yinanlundao').onmousewheel = document.getElementById('yinanlundao').onmousewheel = scrollFunc;  
                }
        },
        computed: {
            
        },
        destroyed(){
            SunsetWebsocket.disconnect(this.topic);
        }
    }

</script>