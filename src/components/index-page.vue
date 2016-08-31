<template>
	
	<div class="page-content">
		
		<comp-index-head></comp-index-head>

		<p class="user-tips">
			<template
				v-if="user.user_nickname != ''">
				{{user.user_nickname}}，您好
			</template>
			<template
				v-else>
				尚未登录
			</template>
			<!-- 点击下方的"+"按钮添加新事务吧 -->
		</p>
		<comp-schedule></comp-schedule>


	</div>

</template>

<script>
	import store from '../store/index';
	import { stopDoubleClick } from '../api/computed.js';
	import comp_schedule from './comp-schedule.vue';
	import comp_index_head from './comp-index-head.vue';

	export default {
		name: 'index-page',
		replace: false,
		data() {
			return {
				img_path:'assets/img/'
			}
		},
		computed: {
			user() {
				return store.state.everyday_init.user;
			}
		},
		methods: {
		},
		components: {
			'comp-schedule': comp_schedule,
			'comp-index-head': comp_index_head
		},
		ready() {
			store.actions.init();
		}
	}
</script>

<style lang="less">
	@import url('../../assets/less/varsbank.less');  

	#index-page { 
		background-color: #fff;

		.user-tips {
			margin: 0;
			padding: 5px 10px;
			text-align: center;
			font-size: 12px;
			color: #acacac; 
			background-color: #f5f5f5; 
		}
	}
</style>