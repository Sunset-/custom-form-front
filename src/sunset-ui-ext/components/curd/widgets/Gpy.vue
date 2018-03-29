<style lang="sass">
    .gpy-container {
        display: inline-block;
        vertical-align: top;
        .ivu-modal-header {
            padding: 5px 10px;
            .ivu-modal-close {
                top: 0px;
            }
        }
        .ivu-modal-body {
            position: relative;
            padding: 0px;
            min-height: 240px;
            text-align: center;
            &:before {
                content: '请稍后...';
                position: absolute;
                top: 100px;
                font-size: 28px;
                color: #AAA;
                z-index: 1;
                margin-left: -50px;
                left: 50%;
            }
            video {
                position: relative;
                z-index: 2;
            }
        }
        .ivu-modal-footer {
            padding: 5px 10px;
        }
    }
</style>
<template>
    <div class="gpy-container" style="display:inline-block;vertical-align:top;">
        <div @click="openGpy" style="display:inline-block;vertical-align:top;">
            <slot></slot>
        </div>
        <sunset-view-modal v-ref:gpymodal :options="options">
            <video class="gpy-video" width="100%"></video>
            <video class="gpy-video2" style="position:absolute;z-index:-1;"></video>
            <canvas style="display:none;" class="gpy-canvas"></canvas>
        </sunset-view-modal>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                video: null,
                video2: null,
                cvs: null,
                ctx: null,
                working: false,
                options: {
                    title: '高拍仪拍照',
                    width: 700,
                    toolbar: [{
                        label: '确定',
                        color: 'success',
                        loading: false,
                        operate: () => {
                            if (this.ctx) {
                                this.cvs.width = this.video2.clientWidth;
                                this.cvs.height = this.video2.clientHeight;
                                this.ctx.drawImage(this.video2, 0, 0, this.cvs.width, this.cvs.height);
                                var images = this.cvs.toDataURL('image/png');
                                if (this.working && images) {
                                    this.$emit('submit', images);
                                    this.options.toolbar[0].label = '上传中...';
                                    this.options.toolbar[0].loading = true;
                                } else {
                                    this.$refs.gpymodal.cancel();
                                }
                            }
                        }
                    }]
                }
            };
        },
        methods: {
            openGpy() {
                this.options.toolbar[0].label = '确定';
                this.options.toolbar[0].loading = false;
                var self = this;
                var video = this.video = $('.gpy-video', this.$el)[0],
                    video2 = this.video2 = $('.gpy-video2', this.$el)[0],
                    cvs = this.cvs = $('.gpy-canvas', this.$el)[0],
                    ctx = this.ctx = cvs.getContext('2d');
                $(video2).parent().css('overflow', 'hidden');
                navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia ||
                    navigator.msGetUserMedia;
                window.URL = window.URL || window.webkitURL || window.mozURL || window.msURL;
                var localMediaStream;
                navigator.getUserMedia({
                    video: {
                        optional: [{
                                minWidth: 1500
                            }
                            // // , {
                            // //     // minHeigth: 2736
                            // // }
                        ]
                    }
                }, function (stream) {
                    video.src = video2.src = window.URL.createObjectURL(stream);
                    localMediaStream = stream;
                    video.play();
                    self.$refs.gpymodal.open();
                    self.working = true;
                }, function (err) {
                    alert('您的浏览器不支持此功能');
                    self.working = false;
                });
            },
            close() {
                this.$refs.gpymodal.cancel();
            }
        }
    }
</script>