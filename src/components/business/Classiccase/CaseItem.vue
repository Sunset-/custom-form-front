<style lang="sass">
    @import '../../style/_variables.scss';
    .classic-case-item {
        border-top: 1px solid $border;
        padding: 10px 0px;
        .case-content {
            display: table;
            width: 100%;
            padding-left: 10px;
            &>div {
                display: table-cell;
                vertical-align: top;
            }
            img {
                cursor: pointer;
            }
            .case-detail {
                position: relative;
                width: 100%;
                padding-bottom: 30px;
                .case-title {
                    display: inline-block;
                    vertical-align: top;
                    padding-left: 10px;
                    .case-topic {
                        font-size: 16px;
                        color: $dark;
                        &:hover {
                            color: $primary;
                            cursor: pointer;
                        }
                    }
                    .case-tags {
                        label {
                            display: inline-block;
                            background: $info;
                            color: #FFF;
                            border-radius: 2px;
                            padding: 2px 8px;
                            margin-right: 2px;
                            font-size: 12px;
                            &.label-info {
                                background: $info;
                            }
                            &.label-danger {
                                background: $danger;
                            }
                            &.label-warning {
                                background: $warning;
                            }
                        }
                    }
                    .case-keywords {
                        color: $light;
                    }
                }
                .case-summary {
                    padding: 0px 10px;
                    font-size: 14px;
                }
                .case-foot {
                    position: absolute;
                    left: 0px;
                    right: 0px;
                    bottom: 0px;
                    padding: 0px 10px;
                    text-align: right;
                    &>span {
                        float: left;
                        vertical-align: bottom;
                        color: #999;
                        padding-top: 10px;
                    }
                }
            }
        }
    }
</style>
<template>
    <div class="classic-case-item">
        <div class="case-content">
            <img :src="data.imageId | dicom-thumbnail" @click="view">
            <div class="case-detail">
                <div class="case-title">
                    <div class="case-topic" @click="view">{{data.title}}</div>
                    <div class="case-tags">
                        <label :class="'label-'+label.color" v-for="label in data.labels">{{label.text}}</label>
                    </div>
                    <div class="case-keywords">{{data.keywords}}</div>
                </div>
                <div class="case-summary">{{data.summary}}
                </div>
                <div class="case-foot">
                    <span>发布时间：{{data.createDate | time 'yyyy-MM-dd'}}</span>
                    <i-button style="margin-left:10px;" type="primary" icon="ios-eye" @click="view">查看</i-button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            data: {}
        },
        methods: {
            view() {
                this.$emit('view', this.data.id);
            }
        }
    }
</script>