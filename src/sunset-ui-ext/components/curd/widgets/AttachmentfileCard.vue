<style lang="sass">
    .attachment-card-wrap {
        display: inline-block;
        position: relative;
        vertical-align: top;
        margin-right: 10px;
        margin-bottom: 10px;
        max-width: 150px;
        .attachment-close {
            position: absolute;
            top: 0px;
            right: 0px;
            cursor: pointer;
            color: #FFF;
            background:red;
            padding:3px;
            &:hover {
                background: #d9534f;
            }
        }

        $attachment-width : 130px;
        $attachment-height : 90px;


        .attachment-image {
            position: relative;
            text-align: center;
            width:$attachment-width;
            font-size:0px;
            img {
                width:100%;
                height: $attachment-height;
            }
            span {
                font-size:12px;
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
        .attachment-document {
            width: $attachment-width;
            background:#efefef;
            img {
                height: $attachment-height;
                display: block;
                margin: 0px auto;
                padding-bottom: 5px;
                cursor: pointer;
            }
            span {
                text-align: center;
                display: block;
                word-wrap: break-word;
                cursor: pointer;
            }
            .document-card-progress {
                text-align: center;
                padding: 20px 10px 0px 10px;
                .ivu-progress-show-info .ivu-progress-outer {
                    margin-right: 0px;
                    padding-right: 0px;
                }
            }
        }
        input {
            width: 100%;
            font-size:12px;
            height: auto;
        }
    }
</style>
<template>
    <div class="attachment-card-wrap">
        <!-- image -->
        <div class="attachment-image" v-if="data.type=='image'||data.type=='picture'">
            <img v-if="data.result&&data.result.md5" class="viewer-image" group="attachment" :src="data.result.md5 | upload-image" />
            <img v-if="!data.result" class="viewer-image" group="attachment" :src="data.thumbnail" />
            <div v-if="!isNaN(data.progress)&&data.progress!=1" class="attachment-image-shim" :style="'height:'+((1-data.progress)*100)+'%;'"></div>
            <span v-if="data.result" v-show="!renameable">{{data.result.fileName}}</span>
            <i-select v-if="data.result&&renameable&&labels" :model.sync="data.result.fileName" size="small" style="width:100%;" @on-change="renamed">
                <i-option v-for="item in labels" :value="item.key">{{ item.value }}</i-option>
            </i-select>
            <input v-if="data.result&&renameable&&!labels" class="rename-input" @blur="renamedInput" v-model="data.result.fileName"></input>
        </div>
        <!-- document -->
        <div class="attachment-document" v-if="data.type=='document'">
            <div v-if="data.thumbnail===null" class="document-card-progress">
                <Progress :percent="data.progress*100">{{data.result?'格式化...':'上传中...'}}</Progress>
            </div>
            <div v-if="data.thumbnail!==null">
                <img :src="suffixImg[data.result.suffix]" @click="viewDocument" />
                <span v-show="!renameable">{{data.result.fileName}}</span>
                <i-select v-if="data.result&&renameable&&labels" :model.sync="data.result.fileName" size="small" style="width:100%;" @on-change="renamed">
                    <i-option v-for="item in labels" :value="item.key">{{ item.value }}</i-option>
                </i-select>
                <input v-if="data.result&&renameable&&!labels" class="rename-input" @blur="renamedInput" v-model="data.result.fileName"></input>
            </div>
        </div>
        <Icon v-if="removeable" class="attachment-close" type="close-round" @click="remove"></Icon>
    </div>
</template>
<script>
import './PdfViewer.js';

export default {
    props: {
        data: {},
        options: {}
    },
    data() {
        return {
            renameing: false,
            suffixImg: {
                doc: '/assets/img/doc.png',
                docx: '/assets/img/doc.png',
                ppt: '/assets/img/ppt.png',
                pptx: '/assets/img/ppt.png',
                pdf: '/assets/img/pdf.png',
                xlsx: '/assets/img/excel.png',
                xls: '/assets/img/excel.png'
            }
        }
    },
    computed: {
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
        viewDocument() {
            GlobalService.openDocument(Base.transformNfsFilePath(this.data.result.md5), this.data.result.targetType);
        },
        rename() {
            if (this.removeable) {
                this.renameing = true;
                this.$nextTick(() => {
                    $('.rename-input', this.$el).focus();
                })
            } else {
                if (this.data.type == 'document') {
                    this.viewDocument();
                }
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