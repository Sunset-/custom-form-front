<style lang="sass">
    .checkimage-card-wrap {
        display: inline-block;
        position: relative;
        vertical-align: top;
        margin-right: 10px;
        margin-bottom: 10px;
        .attachment-close {
            position: absolute;
            top: 2px;
            right: 2px;
            cursor: pointer;
            color: lighten(#d9534f, 20%);
            &:hover {
                color: #d9534f;
            }
        }
        .rename-input {
            width: 100%;
            border-radius: 2px;
            border: 1px solid #ccc;
            height: 24px;
            padding: 0px 3px;
        }
        .attachment-image {
            position: relative;
            text-align: center;
            .image-warpper {
                width: 120px;
                overflow: hidden;
                margin-bottom: 5px;
                font-size: 0px;
                img {
                    width: 100%;
                }
            }
            span {
                display: block;
                word-wrap: break-word;
                cursor: pointer;
            }
            .attachment-image-shim {
                position: absolute;
                top: 0px;
                left: 0px;
                right: 0px;
                height: 100%;
                background: rgba(0, 0, 0, 0.6);
                transition: all 150ms;
            }
        }
    }
</style>
<template>
    <div class="checkimage-card-wrap">
        <div class="attachment-image" v-if="data.type=='image'||data.type=='picture'">
            <div class="image-warpper" :style="cardStyle">
                <img v-if="data.result&&data.result.md5" class="viewer-image" group="attachment" :src="data.result.md5 | upload-image" />
                <img v-if="!data.result" class="viewer-image" :group="'attachment-'+group" :src="data.thumbnail" />
            </div>
            <div v-if="!isNaN(data.progress)&&data.progress!=1" class="attachment-image-shim" :style="'height:'+((1-data.progress)*100)+'%;'"></div>
            <span v-show="!renameable">{{data.result.fileName}}</span>
            <i-select v-if="renameable&&labels" :model.sync="data.result.fileName" size="small" style="width:100%;" @on-change="renamed">
                <i-option v-for="item in labels" :value="item.key">{{ item.value }}</i-option>
            </i-select>
            <input v-if="renameable&&!labels" class="rename-input" @blur="renamedInput" v-model="data.result.fileName"></input>
        </div>
        <Icon v-if="removeable" class="attachment-close" type="close-round" @click.stop="remove"></Icon>
    </div>
</template>
<script>
import './PdfViewer.js';

export default {
    props: {
        data: {},
        group: {},
        options: {
            default() {
                return {};
            }
        }
    },
    data() {
        return {
            renameing: false
        }
    },
    computed: {
        cardStyle() {
            var css = {};
            css.width = this.options.thumbnailWidth || 120;
            if (this.options.thumbnailHeight) {
                css.height = this.options.thumbnailHeight;
            }
            css.width && (css.width = css.width + 'px');
            css.height && (css.height = css.height + 'px');
            return css;
        },
        removeable() {
            return this.$el.hasAttribute('removeable');
        },
        renameable() {
            return this.$el.hasAttribute('renameable');
        },
        labels() {
            return this.options.labelEnum ? Sunset.Service.Dictionary.getEnums(this.options.labelEnum) : null;
        }
    },
    methods: {
        rename() {
            if (this.removeable) {
                this.renameing = true;
                this.$nextTick(() => {
                    $('.rename-input', this.$el).focus();
                })
            }
        },
        renamed(v) {
            this.data.result.fileName = v;
            this.$emit('change');
        },
        renamedInput(ev) {
            this.data.result.fileName = ev.target.value == "" ? '未命名' : ev.target.value;
            this.$emit('change');
        },
        remove() {
            this.$emit('remove');
        }
    }
}
</script>