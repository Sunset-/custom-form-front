<template>
    <div :class="['sunset-field-wrap',invalid?'field-invalid':'']">
        <label class="sunset-field-label">{{options.label}}</label>
        <div class="sunset-field">
            <Cascader :data="data" :value.sync="value"></Cascader>
        </div>
    </div>
</template>
<script>
    import regionJSON from '../data/regionJSON.js';
    var RegionJSON = null

    function generateCascaderData(list) {
        return RegionJSON || list.map(item => {
            var children;
            if (item.sub) {
                children = generateCascaderData(item.sub);
            }
            return {
                label: item.name,
                value: item.name,
                children: children
            };
        })
    }

    export default {
        props: {
            options: {
                type: Object
            },
            value: {}
        },
        data() {
            return {
                data: []
            };
        },
        computed: {
        },
        methods: {
            init() {
                Promise.resolve().then(res => {
                    if (this.options.type == 'region') {
                        return generateCascaderData(regionJSON);
                    } else {
                        if (Sunset.isFunction(this.options.data)) {
                            return this.options.data.apply(this.options);
                        } else {
                            return this.options.data;
                        }
                    }
                }).then(data => {
                    this.data = data;
                });
            }
        },
        events: {
            WIDGET_RESET() {
                $('.ivu-input', this.$children[0].$el).val('');
            }
        },
        ready() {
            this.init();
        }
    };
</script>