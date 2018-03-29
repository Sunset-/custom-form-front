<style lang="sass">
    .case-view-container {
        padding: 10px;
        .title {
            font-size: 20px;
            .share-wrap {
                position: relative;
                float: right;
                font-size: 14px;
                top: 20px;
                i {
                    font-size: 24px;
                    margin-left: 5px;
                    cursor: pointer;
                }
                img {
                    width: 120px;
                    position: absolute;
                    top: 35px;
                    right: -5px;
                }
            }
        }
        .subtitle {
            font-size: 14px;
        }
        .classic-case--image-wrap {
            padding: 10px 0px;
            &>div {
                font-size: 16px;
                padding: 5px 0px;
            }
            .classic-case--image {
                display: block;
                margin: 5px auto;
                width: 400px;
                border: 1px solid #efefef;
            }
        }
    }
</style>
<template>
    <div class="case-view-container">
        <div class="title">{{safeCase.title}}
            <div class="share-wrap">分享：
                <i class="fa fa-qq text-info" @click="share('QQ')"></i>
                <i class="fa fa-weibo text-danger" @click="share('Sina')"></i>
                <i class="fa fa-weixin text-success" @mouseenter="generateCode(true)" @mouseleave="generateCode(false)"></i>
                <img v-show="showShareCode" :src="shareCode">
            </div>
        </div>
        <div class="subtitle">内容提供者：{{safeCase.provider}} {{safeCase.createDate | time}}</div>
        <div class="text-center">
            <dicom-card v-for="dicom in safeCase.imageInfo" :data="dicom" viewable size="400"></dicom-card>
        </div>
        <div class="classic-case--image-wrap" v-if="safeCase.staticImgs">
            <div>其他附件</div>
            <img class="classic-case--image viewer-image" v-default-img group="classic-case-otherfile" v-for="f in safeCase.staticImgArray"
                :src="f | upload-image" />
        </div>

        <div>
            {{{safeCase.optionalContent}}}
        </div>
        <case-comment :case="case"></case-comment>
    </div>
</template>
<script>
    import CaseComment from './CaseComment';

    export default {
        components: {
            CaseComment
        },
        props: {
            case: {}
        },
        data() {
            return {
                showShareCode: false,
                shareCode: ''
            };
        },
        computed: {
            safeCase() {
                var safeCase = this.case || {};
                safeCase.staticImgArray = (safeCase.staticImgs || '').split(',');
                return safeCase;
            }
        },
        methods: {
            share(type) {
                window.open(Base.Share[type]({
                    url: location.href,
                    title: this.case.title,
                    summary: this.case.summary,
                    pics: [
                        location.origin + Base.transformDicomThumbnail(this.case.imageId)
                    ]
                }));
            },
            generateCode(show) {
                if (show) {
                    this.shareCode = this.shareCode || Base.Share.Wechat({
                        url: `http://wap.peaimage.com/#!/app/find/${this.safeCase.id}`,
                        title: this.case.title,
                        summary: this.case.summary,
                        pics: [
                            location.origin + Base.transformDicomThumbnail(this.case.imageId)
                        ]
                    });
                    this.showShareCode = true;
                } else {
                    this.showShareCode = false;
                }
            }
        }
    }
</script>