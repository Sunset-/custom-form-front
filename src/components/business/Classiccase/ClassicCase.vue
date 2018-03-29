<style lang="sass">
    @import '../../style/_variables.scss';
    .classic-case-container-outer {
        position: absolute;
        top: 0px;
        bottom: 0px;
        left: 0px;
        right: 0px;
        overflow-y: scroll;
        .classic-case-container {
            position: relative;
            width: 1000px;
            margin: 0px auto;
            .classic-case-left-wrap {
                width: 730px;
                .brum {
                    border-bottom: 1px solid $border;
                    padding: 8px 10px;
                    font-size: 14px;
                    .link {
                        cursor: pointer;
                        &:hover {
                            color: $primary;
                        }
                    }
                }
            }
            .publicity-wrap {
                position: absolute;
                top: 50px;
                right: 0px;
                float: right;
                width: 250px;
                .qrcode-wrap {
                    text-align: center;
                    font-size: 16px;
                    img {
                        width: 160px;
                    }
                }
                .weibo-wrap {
                    text-align: center;
                    cursor: pointer;
                    &:hover {
                        color: #09c;
                    }
                    &>img {
                        vertical-align: middle;
                    }
                    &>div {
                        display: inline-block;
                        vertical-align: middle;
                    }
                }
            }
        }
    }
</style>
<template>
    <div class="classic-case-container-outer">
        <div class="classic-case-container">
            <div class="classic-case-left-wrap">
                <div class="brum">
                    <span class="link" @click="back">经典案例</span>
                    <span v-if="currentCase">&nbsp;/&nbsp;&nbsp;案例详情</span>
                </div>
                <div v-show="!currentCase" class="classic-case-list">
                    <case-filter @change="refreshFilter"></case-filter>
                    <div v-if="cases.length">
                        <case-item v-for="case in cases" :data="case" @view="viewCase"></case-item>
                        <div class="text-center" style="padding-bottom:10px;">
                            <i-button :type="hasMore?'primary':'ghost'" :disabled="!hasMore" style="width:60%" long @click="loadMore">{{hasMore?'加载更多数据':'已无更多数据'}}</i-button>
                        </div>
                    </div>
                    <h3 v-if="cases.length==0" class="text-center">暂无数据</h3>
                </div>
                <div v-show="currentCase">
                    <case-view :case="currentCase"></case-view>
                </div>
            </div>
            <div class="publicity-wrap">
                <div class="qrcode-wrap">
                    <div>关注豌豆医学影像关注号</div>
                    <img class="imgup" src="/assets/img/qr.jpg" alt="">
                </div>
                <div class="weibo-wrap" @click="openWeibo">
                    <img src="/assets/img/sina_weibo.png" alt="" width="50px" height="50px">
                    <div>
                        <div><strong>关注豌豆医学影像微博</strong></div>
                        <div>及时获取最新医学影像新闻</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import CaseStore from './CaseStore';
    import CaseFilter from './CaseFilter';
    import CaseItem from './CaseItem';
    import CaseView from './CaseView';

    export default {
        components: {
            CaseFilter,
            CaseItem,
            CaseView
        },
        data() {
            return {
                filter: {},
                cases: [],
                hasMore: false,
                currentCase: null,
                pathOptions: {
                    paths: []
                }
            }
        },
        methods: {
            init() {
                if (this.$route.params.id) {
                    this.viewCase(this.$route.params.id);
                }
            },
            loadData(force, lastItem) {
                CaseStore.list(this.filter, lastItem).then(res => {
                    if (force) {
                        this.cases = [];
                    }
                    this.hasMore = (res && res.length == 10);
                    this.cases = this.cases.concat(res || []);
                });
            },
            loadMore() {
                if (this.hasMore) {
                    this.loadData(false, this.cases[this.cases.length - 1]);
                }
            },
            refreshFilter(filter) {
                this.filter = filter;
                this.loadData(true);
            },
            viewCase(id) {
                if (this.$route.params.id) {
                    Router.go(this.$route.path.replace(this.$route.params.id, id));
                } else {
                    Router.go(`${this.$route.path}/${id}`);
                }
                CaseStore.getById(id).then(res => {
                    this.currentCase = res;
                });
            },
            back() {
                Router.go(this.$route.path.replace(`/${this.$route.params.id}`, ''));
                this.currentCase = null;
            },
            openWeibo() {
                window.open("http://weibo.com/5885167233");
            }
        },
        ready() {
            this.init();
            this.loadData();
        }
    }
</script>