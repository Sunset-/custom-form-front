<style lang="sass">
    .eyeball-tension-field {
        &>div {
            display: inline-table;
        }
    }
</style>
<template>
    <div class="sunset-field eyeball-tension-field" style="width:100%;">
        <div style="width:48%;">
            <div class="label">
                右眼
            </div>
            <div>
                <i-input type="text" style="width:100%;" :value.sync="r1" @on-blur="blur('r1')">
                    <span slot="append" style="width:40px;display:inline-block;">kPa</span>
                </i-input>
                <i-input type="text" style="width:100%;margin-top:5px;" :value.sync="r2" @on-blur="blur('r2')">
                    <span slot="append" style="width:40px;display:inline-block;">mmHg</span>
                </i-input>
            </div>
        </div><div  style="width:48%;margin-left:4%;">
            <div class="label">
                左眼
            </div>
            <div>
                <i-input type="text" style="width:100%;" :value.sync="l1" @on-blur="blur('l1')">
                    <span slot="append" style="width:40px;display:inline-block;">kPa</span>
                </i-input>
                <i-input type="text" style="width:100%;margin-top:5px;" :value.sync="l2" @on-blur="blur('l2')">
                    <span slot="append" style="width:40px;display:inline-block;">mmHg</span>
                </i-input>
            </div>
        </div>
    </div>
</template>
<script>
    export default {
        props: {
            options: {
                type: Object
            },
            value: {}
        },
        data() {
            return {
                r1: '',
                r2: '',
                l1: '',
                l2: '',
                normal: true,
                checkbox: [],
                items: Sunset.Service.Dictionary.getEnums('EYESLID_CHECK_RESULT'),
                pending: false
            }
        },
        methods: {
            getOriginValue(which) {
                if (!this.value) {
                    return '';
                } else {
                    return JSON.parse(this.value)[which] || '';
                }
            },
            blur(which) {
                var v = this[which];
                if (isNaN(v) || (+v) < 0) {
                    this[which] = this.getOriginValue(which);
                    return;
                }
                v = +v;
                var otherV;
                if (~which.indexOf('1')) {
                    otherV = (v * 30 / 4).toFixed(2);
                } else {
                    otherV = (v * 4 / 30).toFixed(2);
                }
                this[which] = v.toFixed(2);
                this[~which.indexOf('1') ? which.replace('1', '2') : which.replace('2', '1')] = otherV;;
                this.refreshValue();
            },
            refreshValue() {
                this.pending = true;
                if (!this.r1 && !this.r2 && !this.l1 && !this.l2) {
                    this.value = "";
                } else {
                    this.value = JSON.stringify({
                        r1: this.r1,
                        r2: this.r2,
                        l1: this.l1,
                        l2: this.l2
                    });
                }
                this.$nextTick(() => {
                    this.pending = false;
                });
            },
            initValue() {
                this.pending = true;
                var v = this.value;
                var vObj = {};
                if (v) {
                    try {
                        vObj = JSON.parse(v);
                    } catch (e) {
                        console.error(e);
                    }
                }
                this.r1 = vObj.r1;
                this.r2 = vObj.r2;
                this.l1 = vObj.l1;
                this.l2 = vObj.l2;
                this.$nextTick(() => {
                    this.pending = false;
                });
            }
        },
        watch: {
            value() {
                if (!this.pending) {
                    this.initValue();
                }
            }
        },
        ready() {
            this.initValue();
        }
    }
</script>