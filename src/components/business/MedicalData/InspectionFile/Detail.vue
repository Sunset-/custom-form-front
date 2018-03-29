<style lang="sass">
    .report_result{
        color:#333;
        .page_title{
                color:#666;
            &>span{
                font-size:16px;
                font-weight:600;
            }
        }
        .report_content{
            padding-bottom:20px;
            border-bottom:1px dashed #ccc;
            .report_title{
                background-color:#f2f2f2;
                height:30px;
                line-height:30px;
                padding-left:10px;
            }
            &>div{
                margin:10px 0;
                &>div.report_label{
                    width:80px;
                }
                &>div.show_pic{
                    top:50px;
                }
            }
            .report_picture{
                overflow:hidden;
                &>div{
                    float:left;
                }
                .picture{
                    border:1px solid #ccc;
                    width:180px;
                    height:136px;
                    background-color:#f2f2f2;
                    margin-right:20px;
                }
            }
            .picture_info{
                min-height:100px;
                overflow-y:scroll;
                position:relative;
                .picture_info_content{
                    position:absolute;
                    left:80px;
                    right:0;
                    top:0;
                }
            }
            .diagnose_info{
                min-height:100px;
                overflow-y:scroll;
                position:relative;
                .diagnose_info_content{
                    position:absolute;
                    left:80px;
                    right:0;
                    top:0;
                }
            }
            .report_statement{
                color:#666;
            }
        }
    }
    .check_file{
        margin-bottom:100px;
        .page_title{
            color:#666;
            &>span{
                font-size:16px;
                font-weight:600;
            }
        }
        .check_content{
            &>div{
                width:100%;
                min-height:150px;
                &>div{
                    float:left;
                    width:80px;
                    height:80px;
                    background:#f2f2f2;
                    margin:10px 20px;
                    border:1px solid #ccc;
                    position:relative;
                    &>.label{
                        position:absolute;
                        bottom:-30px;
                        height:25px;
                        line-height:25px;
                        font-size:10px;
                        text-align:center;
                    }
                }
                .report_label{
                    border:none;
                    background:none;
                }
            }
        }
    }
    .edit_file{
        .edit_content{
            .content_pic,.content_vedio,.content_picture{
                min-height:200px;
                width:100%;
                overflow:hidden;
                &>div{
                    float:left;
                }
                .label{
                    height:100%;
                    width:100px;
                    font-size:10px;
                    text-align:center;
                }
                .picture{
                    &>div{
                        width:80px;
                        height:80px;
                    }
                    &>.add_btn{
                        width:100%;
                        height:50px;
                    }
                    &>.show_pic{
                        float:left;
                        background:#f2f2f2;
                        border:1px solid #ccc;
                        margin-right:20px;
                        margin-bottom:50px;
                        position:relative;
                        .label{
                            position:absolute;
                            bottom:-80px;
                        }
                    }
                }
            }
        }
    }
    .operate_bar{
        position:absolute;
        top:0;
        right:0;
        &>div{
            height:36px;
            line-height:36px;
            width:60px;
            float:left;
            text-align:center;
            border-radius:3px;
            cursor:pointer;
        }
        &>.edit{
            background-color:#3399ff;
            color:#fff;
            margin-right:20px;
            width: 56px;
            height: 32px;
            line-height: 32px;
            margin-top: 10px;
            font-size: 12px;
            border-radius: 4px;
        }
    }  
</style>
<template>  
    <div class="inspection_file">
        <div class="report_result" v-show="!isDoctor">
            <div class="page_title"><span>报告结果 </span>2017/07/25</div>
            <div class="report_content">
                <div class="report_title">报告医生 : 老赵<span>报告时间 : 2017/07/25</span></div>
                <div class="report_picture">
                    <div class="report_label">关键图像</div>
                    <div class="picture"></div>
                    <div class="picture"></div>
                    <div class="picture"></div>
                </div>
                <div class="picture_info"> 
                    <div class="report_label">图像所见</div>
                    <div class="picture_info_content">后极部视网膜呈灰白色浑浊，水肿，黄斑区相对呈红色，视网膜动脉变细且管径不均匀，部分患者动脉血柱呈节段状；偶见视网膜动脉栓子。视盘颜色较淡。睫状视网膜动脉存在者，黄斑区视网膜影像较轻。晚期视网膜水肿消退，视网膜血流逐渐再灌注，眼底可恢复正常色泽；严重者视盘苍白，边界清，弥漫性视网膜神经纤维层缺损，部分视网膜动脉呈白线状。FFA检查呈现视网膜动脉及静脉充盈时间均延长</div>
                </div>
                <div class="diagnose_info">
                    <div class="report_label">诊断提示</div>
                    <div class="diagnose_info_content">视网膜中央动脉阻塞</div>
                </div>
                <div class="report_statement">此报告仅供本院医生参考，结论只对本次检查有效</div>
            </div>
        </div>
        <div class="check_file" v-show="!isDoctor">
            <div class="page_title"><span>检查文件 </span>2017/07/25</div>
            <div class="check_content">
                <div class="">
                    <div class="report_label">DICOM图像</div>
                    <div class="picture_box"><div class="label">MTC / 20170726</div></div>
                    <div class="picture_box"><div class="label">MTC / 20170726afaavafdsadvasvsavsv</div></div>
                </div>
            </div>
            <div class="check_content">
                <div class="">
                    <div class="report_label">检查视频</div>
                    <div class="vedio_box"><div class="label">内窥宫腔镜</div></div>
                </div>
            </div>
            <div class="check_content">
                <div>
                    <div class="report_label">检查图片</div>
                    <div class="pic_box"><div class="label">手术</div></div>
                </div>
            </div>
        </div>
        <div class="edit_file" v-show="isDoctor">
            <div class="page_title"><span>检查文件 </span>2017/07/25</div>
            <div class="edit_content">
                <div class="content_pic">
                    <div class="label">DICOM图像</div>
                    <div class="picture">
                        <div class="add_btn">
                            <sunset-file :options='options'></sunset-file>
                            <sunset-file :options='options'></sunset-file>
                        </div>
                        <div class="show_pic"><div class="label">MTC / 20170726</div></div>
                        <div class="show_pic"><div class="label">MTC / 20170726</div></div>
                        <div class="show_pic"><div class="label">MTC / 20170726</div></div>
                        <div class="show_pic"><div class="label">MTC / 20170726</div></div>
                        <div class="show_pic"><div class="label">MTC / 20170726</div></div>
                        <div class="show_pic"><div class="label">MTC / 20170726</div></div>
                        <div class="show_pic"><div class="label">MTC / 20170726</div></div>
                        <div class="show_pic"><div class="label">MTC / 20170726</div></div>
                        <div class="show_pic"><div class="label">MTC / 20170726</div></div>
                        <div class="show_pic"><div class="label">MTC / 20170726</div></div>
                    </div>
                </div>
                <div class="content_vedio">
                    <div class="label">检查视频</div>
                    <div class="picture">
                        <div class="add_btn">
                            <sunset-file :options='options'></sunset-file>
                            <sunset-file :options='options'></sunset-file>
                        </div>
                        <div class="show_pic"><div class="label">内窥宫腔镜</div></div>
                    </div>
                </div>
                <div class="content_picture">
                    <div class="label">检查图片</div>
                    <div class="picture">
                        <div class="add_btn">
                            <sunset-file :options='options'></sunset-file>
                            <sunset-file :options='options'></sunset-file>
                        </div>
                        <div class="show_pic"><div class="label">手术</div></div>
                    </div>
                </div>
            </div>
        </div>
        <div class="operate_bar">
            <div class="edit" @click="edit">编辑</div> 
        </div>
    </div>
</template>
<script>
    export default{
        data(){
            return{
                isDoctor: false,
                options:{

                }
            }
        },
        props: {
            data: {},
            config: {}
        },
        methods:{
            edit(){
                this.isDoctor = true;
            },
            back(){
                this.isDoctor = false;
            }
        }
    }
</script>