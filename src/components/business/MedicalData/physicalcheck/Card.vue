<style lang="sass">
	.bodycheck_card {
		position: relative;
		width: 235px;
		padding: 7px;
		margin: 0px 0px 8px 10px;
		background: #62C0FF;
		color: #FFF;
		border-radius: 5px;
		&:before {
			content: "";
			position: absolute;
			top: 14px;
			left: -18px;
			z-index: 3;
			background-color: #fff;
			padding: 0;
			border: 1px solid #999;
			border-radius: 50%;
			width: 14px;
			height: 14px;
		}
		&:after {
			display: none;
			content: "";
			width: 10px;
			height: 10px;
			border-radius: 50%;
			position: absolute;
			z-index: 4;
			left: -16px;
			top: 16px;
			background-color: #0099ff;
		}
		.card_title {
			&:before {
				position: absolute;
				top: 14px;
				left: -20px;
				content: '';
				width: 0px;
				height: 0px;
				border-style: solid;
				border-width: 8px 12px;
				border-color: transparent #62C0FF transparent transparent;
			}
		}
		.card_creat_date {
			float: right;
			margin-right: 3px;
		}
	}

	.md-card.active {
		.bodycheck_card {
			&:after {
				display: block;
			}
		}
	}

	.md-card.new {
		.bodycheck_card {
			.card_title {
				background: #FFF;
				color: #777;
				&:before {
					position: absolute;
					top: 15px;
					left: -20px;
					content: '';
					width: 0px;
					height: 0px;
					border-style: solid;
					border-width: 6px 10px;
					border-color: transparent #ccc transparent transparent;
					z-index: 0;
				}
				&:after {
					position: absolute;
					top: 15px;
					left: -17px;
					content: '';
					width: 0px;
					height: 0px;
					border-style: solid;
					border-width: 6px 10px;
					border-color: transparent #FFF transparent transparent;
					z-index: 1;
				}
			}
		}
	}
</style>
<template>
	<div class="common_card bodycheck_card">
		<div class="card_title"><label>查体</label><span class="card_creat_date">{{modifyDate}}</span></div>
	</div>
</template>
<script>
	export default {
		props: {
			card: {

			},
			data: {

			},
			config: {

			},
			active: {

			}
		},
		data() {
			return {

			}
		},
		computed: {
			modifyDate() {
				if (this.card.lastModifyDate) {
					return Sunset.Dates.format(this.card.lastModifyDate, 'yyyy-MM-dd HH:mm');
				} else {
					return '未填写';
				}
			}
		},
		methods: {}
	}
</script>