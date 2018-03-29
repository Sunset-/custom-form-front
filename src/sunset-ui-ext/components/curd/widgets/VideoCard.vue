<style lang="sass">
    .video-card-wrap {
        position: relative;
        display: inline-block;
        border: 1px solid #aaa;
        width: 150px;
        height: 80px;
        margin-right: 10px;
        vertical-align: top;
        margin-bottom: 20px;
        .video-card-progress {
            text-align: center;
            padding: 20px 10px 0px 10px;
            .ivu-progress-show-info .ivu-progress-outer {
                margin-right: 0px;
                padding-right: 0px;
            }
        }
        .video-card-thumbnail-wrap {
            position: relative;
            width: 100%;
            height: 100%;
            .video-card-thumbnail {
                width: 100%;
                height: 100%;
            }
            .video-card-player {
                position: absolute;
                top: 50%;
                left: 50%;
                width: 30px;
                height: 30px;
                margin-left: -15px;
                margin-top: -15px;
                background: rgba(0, 0, 0, 0.7);
                border-radius: 20px;
                border: 2px solid rgba(255, 255, 255, 0.4);
                cursor: pointer;
                &:before {
                    content: '';
                    position: absolute;
                    top: 7px;
                    left: 9px;
                    width: 0px;
                    right: 0px;
                    border: 6px solid transparent;
                    border-left: 10px solid #ccc;
                }
                &:hover {
                    background: rgba(0, 0, 0, 0.8);
                    &:before {
                        top: 6px;
                        border: 7px solid transparent;
                        border-left: 11px solid #ccc;
                    }
                }
            }
        }
        .video-close {
            position: absolute;
            top: 2px;
            right: 2px;
            cursor: pointer;
            color: #FFF;
            &:hover {
                color: #d9534f;
            }
        }
    }
</style>
<template>
    <div class="video-card-wrap">
        <div v-if="!data.thumbnail" class="video-card-progress">
            <Progress :percent="data.progress*100">{{data.result?'转码中...':'上传中...'}}</Progress>
        </div>
        <div v-if="data.thumbnail" class="video-card-thumbnail-wrap" @click.prev.top="openVideo">
            <img :src="data.thumbnail | upload-image" class="video-card-thumbnail" />
            <div class="video-card-player"></div>
            <Icon v-if="removeable" class="video-close" type="close-round" @click.stop="remove"></Icon>
        </div>
    </div>
</template>
<script>
    export default {
        props: {
            data: {}
        },
        data() {
            return {
                labels: []
            }
        },
        computed : {
            removeable() {
                return this.$el.hasAttribute('removeable');
            }
        },
        methods: {
            openVideo() {
                Sunset.ViewVideo({
                    src: Base.transformNfsFilePath(this.data.videoId) + `?v=${new Date().getTime()}`,
                    type: 'video/mp4',
                    style: {
                        "max-width": '90%',
                        "max-height": '90%'
                    }
                })
            },
            remove() {
                this.$emit('remove');
            }
        }
    }
</script>