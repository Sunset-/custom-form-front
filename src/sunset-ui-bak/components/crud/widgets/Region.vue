<template>
    <validator name="validation">
        <div :class="['form-group',invalid?'has-error':'']" :style='style'>
            <label class="control-label col-xs-1">{{options.label}}</label>
            <div class="input-group col-xs-11" style="width:86.11111111111111%;">
                <select class="form-control col-xs-3" style="width:25%;margin-right:10px;" field="field" v-model="level_1" @change="onChange(1)">
					<option v-for="item in level_1_items" :value="item.name">{{item.name}}</option>
				</select>
                <select class="form-control col-xs-3" style="width:25%;margin-right:10px;" field="field" v-model="level_2" @change="onChange(2)">
					<option v-for="item in level_2_items" :value="item.name">{{item.name}}</option>
				</select>
                <select class="form-control col-xs-3" style="width:25%;margin-right:10px;" field="field" v-model="level_3" @change="onChange(3)">
					<option v-for="item in level_3_items" :value="item.name">{{item.name}}</option>
				</select>
                <input style="display:none;" type="text" class="form-control" field="field" v-model="value" v-validate="options.validate"
                />
                <i v-show="invalid" class="glyphicon glyphicon-exclamation-sign text-danger sunset-pop" :data-content="invalidMsg"></i>
            </div>
        </div>
    </validator>
</template>
<script>

    import regionJSON from '../data/regionJSON';
	
	export default {
		props : {
			options : {
				type : Object
			},
			value : {
			}
		},
		data(){
			return {
                level_1 : null,
                level_2 : null,
                level_3 : null,
                regionJSON : regionJSON
			};
		},
		computed : {
			rows(){
				return this.options.rows||5;
			},
			maxlength(){
				return this.options.maxlength||this.options.validate&&this.options.validate.maxlength&&this.options.validate.maxlength.rule;
			},
			invalid(){
				return this.options.validate&&this.$validation.field.invalid;
			},
			invalidMsg(){
				return this.options.validate&&this.$validation.field.errors&&this.$validation.field.errors.length&&this.$validation.field.errors[0].message;
			},
            level_1_items(){
                return this.regionJSON;
            },
            level_2_items(){
                var list = this.regionJSON,
                    level_1 = this.level_1;
                    if(level_1){
                        for(var i=0,item;item=list[i++];){
                            if(item.name==level_1){
                                return item.sub||[];
                            }
                        }
                    }
                    return [];
            },
            level_3_items(){
                var list = this.level_2_items,
                    level_2 = this.level_2;
                    if(level_2){
                        for(var i=0,item;item=list[i++];){
                            if(item.name==level_2){
                                return item.sub||[];
                            }
                        }
                    }
                    return [];
            }
		},
        methods : {
            onChange(which){
                var res = [];
                if(which===1){
                    this.level_2 = null;
                    this.level_3 = null;
                }else if(which===2){
                    this.level_3 = null;
                }
                if(this.level_1&&this.level_1!='请选择'){
                    res.push(this.level_1);
                    if(this.level_2&&this.level_2!='请选择'){
                        res.push('|');
                        res.push(this.level_2);
                        if(this.level_3&&this.level_3!='请选择'){
                            res.push('|');
                            res.push(this.level_3);
                        }
                    }
                }
                this.value = res.join('');
            }
        },
		events:{
			WIDGET_REFRESH_VALUE(){
                var regions = (this.value||'').split('|');
                this.level_1=regions[0]||'';
                this.level_2=regions[1]||'';
                this.level_3=regions[2]||'';
			}
		}
	}

</script>