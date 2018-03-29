<style lang="sass">
    @import '../../style/_variables.scss';
    .case-comment-container {
        .comment-box {
            h3 {
                border-bottom: 2px solid $border;
                font-size: 16px;
                padding: 5px;
                margin-bottom: 5px;
            }
            &>div {
                text-align: right;
                button {
                    margin: 5px;
                }
            }
        }
        .case-comment-wrap {
            .comment-item {
                position: relative;
                padding-left: 60px;
                border-top: 1px solid $border;
                &>img {
                    position: absolute;
                    left: 10px;
                    top: 10px;
                    width: 40px;
                    border-radius: 50%;
                }
                &.comment-sub {
                    padding-left: 50px;
                    &>img {
                        left: 10px;
                        top: 10px;
                        width: 32px;
                    }
                }
                .comment-content {
                    padding-top: 10px;
                    .comment-time {
                        color: #ababab;
                    }
                }
            }
            .comment-top {
                background: #fafafa;
                footer {
                    text-align: right;
                    padding: 5px;
                    .comment-button {
                        margin: 5px 0px 5px 10px;
                    }
                }
            }
            .comment-sub-container {
                background: #eaeaea;
            }
        }
    }
</style>
<template>
    <div class="case-comment-container">
        <div class="comment-box">
            <h3>评论</h3>
            <div>
                <i-input type="textarea" :value.sync="commentContent" :maxlength="200" placeholder="说点什么..."></i-input>
                <i-button type="primary" @click="comment">发送评论</i-button>
            </div>
        </div>
        <div class="case-comment-wrap">
            <div class="comment-item comment-top" v-for="comment in comments">
                <img :src="comment.picture | upload-image" onerror="this.src='/assets/img/default.png'" />
                <div class="comment-content">
                    <header>
                        {{comment.designation}}
                        <div class="comment-time">{{comment.createDate | time}}</div>
                    </header>
                    <div>
                        {{{comment.content}}}
                    </div>
                </div>
                <div class="comment-sub-container">
                    <div class="comment-item comment-sub" v-for="subComment in comment.repliesVo">
                        <img :src="comment.picture | upload-image" onerror="this.src='/assets/img/default.png'" />
                        <div class="comment-content">
                            <header>
                                {{subComment.designation}}
                                <div class="comment-time">{{subComment.createDate | time}}</div>
                            </header>
                            <div>
                                {{{subComment.content}}}
                            </div>
                        </div>
                    </div>
                </div>
                <footer>
                    <i-input v-show="comment.commenting" type="textarea" :value.sync="comment.replyComment" :maxlength="200"></i-input>
                    <i-button v-show="comment.commenting" class="comment-button" type="success" size="small" @click="reply(comment)">发送</i-button>
                    <i-button v-show="comment.commenting" class="comment-button" size="small" @click="comment.commenting=false">取消</i-button>
                    <i-button v-show="!comment.commenting" class="comment-button" type="primary" size="small" @click="comment.commenting=true">我也说一句</i-button>
                </footer>
            </div>
            <sunset-page style="margin-top:10px;" @change="loadComments" right="true" :page-number.sync="filter.pageNumber" :show-total="true"
                :page-size="filter.pageSize" :total.sync="commentTotalCount"></sunset-page>
        </div>
    </div>
</template>

<script>
    import CaseStore from './CaseStore';

    export default {
        props: {
            case: {}
        },
        data() {
            return {
                commentContent: '',
                filter: {
                    pageNumber: 1,
                    pageSize: 5
                },
                comments: [],
                commentTotalCount: 0
            }
        },
        methods: {
            init() {
                if (this.case) {
                    this.filter.pageNumber = 1;
                    this.loadComments();
                }
            },
            loadComments(pageNumber) {
                if (pageNumber) {
                    this.filter.pageNumber = pageNumber;
                }
                CaseStore.listComments(this.case.id, {
                    pageSize: this.filter.pageSize,
                    pageNumber: this.filter.pageNumber - 1
                }).then(res => {
                    res.datas.forEach(item => {
                        item.commenting = false;
                        item.replyComment = '';
                    });
                    this.comments = res.datas;
                    this.commentTotalCount = res.totalCount || 0;
                });
            },
            reply(comment) {
                CaseStore.addComment({
                    topicId: this.case.id,
                    content: comment.replyComment,
                    isReply: true,
                    commentId: comment.id,
                    replyToId: comment.id
                }).then(res => {
                    comment.replyComment = '';
                    comment.repliesVo.push(res);
                    comment.commenting = false;
                });
            },
            comment() {
                CaseStore.addComment({
                    topicId: this.case.id,
                    content: this.commentContent,
                    isReply: false
                }).then(res => {
                    Sunset.tip('评论成功', 'success');
                    this.commentContent = '';
                    this.loadComments();
                });
            }
        },
        watch: {
            case () {
                this.init();
            }
        }
    }
</script>