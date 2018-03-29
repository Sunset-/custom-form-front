<template>
	<router-view></router-view>
</template>
<script>
	import SignStore from './sign/SignStore';
	import './style/index.scss';
	import modules from '../app.modules';

	export default {
		ready() {
			SignStore.currentUser().then(data => {
				if (this.$route.path == '/' || !this.$route.path) {
					Router.go(modules.navs.filter(nav => Base.permissions[nav.name])[0].path);
					// Router.go(modules.navs[0].path);
				}
				//初始化
               if (data.user.userType == Sunset.Service.Dictionary.alias(
                        'SYSTEM_ACCOUNT_TYPE', 'ASSISTANT')) {
                    GlobalService.InitVideoClinicTipView();
                }
			}, err => {
				Router.go('/sign');
			});
		}
	}
</script>