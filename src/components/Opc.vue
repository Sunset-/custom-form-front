<template>
	<router-view></router-view>
</template>
<script>
	import SignStore from './sign/SignStore';
	import './style/index.scss';
	import modules from '../opc.modules';

	export default {
		ready() {
			SignStore.currentUser().then(data => {
				if (this.$route.path == '/' || !this.$route.path) {
					Router.go(modules.navs[0].path);
				}
			}, err => {
				Router.go('/sign');
			});
		}
	}
</script>