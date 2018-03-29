<style lang="sass">
    .screen-lxd-table {
        width: 600px;
        color: #333333;
        border-collapse: collapse;
        td,
        th {
            border: 1px solid #ccc;
            width: 100px;
            height: 30px;
        }
        .ivu-checkbox-group {
            width: 400px;
            padding: 5px 0px;
            padding-left: 50px;
            text-algin: center;
            .ivu-checkbox-wrapper {
                text-align: left;
                width: 150px;
            }
        }
    }
</style>
<template>
    <div class="sunset-field">
        <table class="screen-lxd-table">
            <thead>
                <tr>
                    <th>
                        <span style="vertical-align:middle;margin-right:25px;">右眼</span>
                        <Radio :checked.sync="rightNormal">
                            <span>{{options.emptyText || '无'}}</span>
                        </Radio>
                    </th>
                    <th>
                        <span style="vertical-align:middle;margin-right:25px;">左眼</span>
                        <Radio :checked.sync="leftNormal">
                            <span>{{options.emptyText || '无'}}</span>
                        </Radio>
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>
                        <Checkbox-group :model.sync="rightCheckbox">
                            <Checkbox v-for="item in items" :value="item.key">
                                <span>{{item.value}}</span>
                            </Checkbox>
                        </Checkbox-group>
                    </td>
                    <td>
                        <Checkbox-group :model.sync="leftCheckbox">
                            <Checkbox v-for="item in items" :value="item.key">
                                <span>{{item.value}}</span>
                            </Checkbox>
                        </Checkbox-group>
                    </td>
                </tr>
            </tbody>
        </table>
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
            leftNormal: true,
            rightNormal: true,
            leftCheckbox: [],
            rightCheckbox: [],
            items: Sunset.Service.Dictionary.getEnums(this.options.enum),
            pending: false
        }
    },
    computed: {
        emptyValue() {
            return this.options.emptyValue || '';
        }
    },
    methods: {
        refreshRadio(witch) {
            var checkbox = this[`${witch}Checkbox`];
            this[`${witch}Normal`] = checkbox.length == 0;
            this.refreshValue();
        },
        refreshCheckbox(witch) {
            if (this[`${witch}Normal`]) {
                this[`${witch}Checkbox`] = [];
            }
            this.refreshValue();
        },
        refreshValue() {
            this.pending = true;
            this.value = (this.leftCheckbox.length == 0 && !this.leftNormal && this.rightCheckbox.length == 0 && !
                this
                    .rightNormal) ? '' : JSON.stringify({
                        left: this.leftCheckbox.length ? this.leftCheckbox.join(',') : (this.leftNormal ? this.emptyValue :
                            ''),
                        right: this.rightCheckbox.length ? this.rightCheckbox.join(',') : (this.rightNormal ? this.emptyValue :
                            '')
                    });
            this.$nextTick(() => {
                this.pending = false;
            });
        },
        initValue() {
            this.pending = true;
            var v = JSON.parse(this.value || '{}');
            this.leftNormal = v.left == this.emptyValue;
            this.leftCheckbox = v.left ? v.left.split(',').filter(v => v != this.emptyValue) : [];
            this.rightNormal = v.right == this.emptyValue;
            this.rightCheckbox = v.right ? v.right.split(',').filter(v => v != this.emptyValue) : [];
            this.$nextTick(() => {
                this.pending = false;
            });
        }
    },
    watch: {
        leftCheckbox() {
            if (!this.pending) {
                this.refreshRadio('left');
            }
        },
        leftNormal() {
            if (!this.pending) {
                this.refreshCheckbox('left');
            }
        },
        rightCheckbox() {
            if (!this.pending) {
                this.refreshRadio('right');
            }
        },
        rightNormal() {
            if (!this.pending) {
                this.refreshCheckbox('right');
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