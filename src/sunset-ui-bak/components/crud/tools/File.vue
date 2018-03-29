<template>
    <label :for="uid" :class="['ivu-btn','ivu-btn-'+(options.color||'primary')]">
			<i v-if="options.icon" :class="[options.icon,'m-r-xs']"></i>{{options.label}}
			<span style="position:relative;width:0px;height:0px;display:inline-block;overflow:hidden;">
				<form :id="'FORM_'+uid">
					<input :id="uid" type="file" :name="options.fileName" @change="submitForm()" />
				</form>
			</span>
		</label>
</template>
<script>
    var FILE_UPLOAD_ID = 0;

    import jqueryForm from '../../../vendor/jquery/jquery.form';
    import Utils from '../utils.js';

    export default {
        props: {
            options: {},
            ctx: {}
        },
        data() {
            return {
                uid: `FILE_UPLOADER_${++FILE_UPLOAD_ID}`
            }
        },
        methods: {
            submitForm() {
                var options = this.options;
                Utils.remoteData(() => {
                    return Sunset.isFunction(options.data) ? options.data(this.ctx) : options.data;
                }).then(formData => {
                    $(`#${'FORM_'+this.uid}`).ajaxSubmit({
                        url: options.url,
                        type: 'POST',
                        data: formData,
                        success(data) {
                            options.onSuccess && options.onSuccess(data);
                        },
                        error(err) {
                            options.onError && options.onError(err);
                        }
                    });
                });
            }
        }
    }
</script>