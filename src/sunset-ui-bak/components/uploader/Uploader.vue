<style lang="sass">
	.sunset-upload-item-wrap {
		width: 100px;
		height: 100px;
		img {
			width: 100%;
			height: 100%;
		}
	}
</style>
<template>
	<div></div>
</template>
<script>
	import WebUploader from '../../vendor/webuploader/webuploader.min';

	export default {
		props: {
			id: {
				type: String,
				required: true
			},
			multi: {
				type: Boolean,
				default: false
			},
			queue: {
				type: Array,
				default: []
			},
			url: {

			},
			max: {

			}
		},
		data() {
			return {
				map: {}
			};
		},
		computed: {

		},
		methods: {
			init() {
				var uploader = this.uploader = WebUploader.create({
					// swf文件路径
					swf: './vendor/webuploader/Uploader.swf',
					// 文件接收服务端。
					server: this.url,
					// 选择文件的按钮。可选。
					// 内部根据当前运行是创建，可能是input元素，也可能是flash.
					pick: `#${this.id}`,
					// 不压缩image, 默认如果是jpeg，文件上传前会压缩一把再上传！
					resize: false,
					duplicate: true
				});
				//选择文件
				uploader.on('filesQueued', files => {
					if (!files || files[0].size == 0) {
						return;
					}
					var queue = this.queue,
						max = this.max === true ? 9999999 : this.max,
						map = {},
						overflow = false;
					//单图
					if (this.max == 1) {
						uploader.reset();
						this.queue.length = 0;
						var file = files[0];
						queue.push({
							id: file.id,
							name: file.name,
							thumbnail: null,
							progress: 0,
							src: null,
							status: 0,
							file: file
						});
					} else {
						//多图
						files.forEach(file => {
							if (queue.length < max) {
								queue.push({
									id: file.id,
									name: file.name,
									thumbnail: null,
									progress: 0,
									src: null,
									status: 0,
									file: file
								});
							} else {
								uploader.removeFile(file);
								overflow = true;
							}
						});
					}
					//缩略图
					queue.forEach(item => {
						if (item.id) {
							map[item.id] = item;
							item.thumbnail || uploader.makeThumb(item.file, (error, src) => {
								if (error) {
									return;
								}
								item.thumbnail = src;
							}, 100, 100);
						}
					});
					this.map = map;
					//提示
					if (overflow) {
						Sunset.tip(`最多上传${max}张图片`);
					}
					//上传
					uploader.upload();
				});
				//上传进度
				uploader.on('uploadProgress', (file, percentage) => {
					var item;
					if (item = this.map[file.id]) {
						item.progress = percentage;
						item.status = 1;
					}
				});
				//上传失败
				uploader.on('uploadError', (file) => {
					var item;
					if (item = this.map[file.id]) {
						item.status = 2;
					}
				});
				//上传成功
				uploader.on('uploadSuccess', (file, response) => {
					var item;
					if (item = this.map[file.id]) {
						item.status = 3;
						item.src = response._raw;
					}
					$(`#${this.id} input`).val('');
					this.$dispatch('SUNSET_UPLOAD_SUCCESS');
				});
			},
			upload() {
				this.uploader.upload();
			}
		}
	}
</script>