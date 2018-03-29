<style lang="sass">

</style>
<template>
    <div class="sunset-field">
        <Radio :checked.sync="normal">
            <span>{{options.emptyText || '无'}}</span>
        </Radio>
        <Checkbox-group style="display: inline-block;" :model.sync="checkbox">
            <Checkbox v-for="item in items" :value="item.key">
                <span>{{item.value}}</span>
            </Checkbox>
        </Checkbox-group>
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
        computed: {
            emptyValue() {
                return this.options.emptyValue || '';
            }
        },
        data() {
            return {
                normal: true,
                checkbox: [],
                items: Sunset.Service.Dictionary.getEnums(this.options.enum),
                pending: false
            }
        },
        methods: {
            refreshRadio() {
                var checkbox = this.checkbox;
                this.normal = checkbox.length == 0;
                this.refreshValue();
            },
            refreshCheckbox() {
                if (this.normal) {
                    this.checkbox = [];
                }
                this.refreshValue();
            },
            refreshValue() {
                this.pending = true;
                this.value = this.checkbox.length == 0 ? this.emptyValue : this.checkbox.join(',');
                this.$nextTick(() => {
                    this.pending = false;
                });
            },
            initValue() {
                this.pending = true;
                var v = this.value;
                this.normal = v == this.emptyValue;
                this.checkbox = v ? v.split(',') : [];
                this.$nextTick(() => {
                    this.pending = false;
                });
            }
        },
        watch: {
            checkbox() {
                if (!this.pending) {
                    this.refreshRadio();
                }
            },
            normal() {
                if (!this.pending) {
                    this.refreshCheckbox();
                }
            },
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