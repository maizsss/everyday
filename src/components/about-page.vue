<template>
	
	<div class="page-content">
		<p class="about-text">
			这是一款日程管理产品，可方便地对自己每日事务进行安排记录。
		</p>
		<p class="about-text">
			2016 © everyday by maizsss 
		</p>

	</div>

</template>

<script>
	import store from '../store/index';
	import { stopDoubleClick } from '../api/computed.js';

	export default {
		name: 'about-page',
		replace: false,
		data() {
			return {
				img_path:'assets/img/'
			}
		},
		computed: {
			
		},
		methods: {
			
		},
		components: {
			
		},
		ready() {
			
		}
	}
</script>

<style lang="less">
	@import url('../../assets/less/varsbank.less');  

	#about-page {
		background-color: #fff;
		padding: 12px;
		.about-text {
			font-size: 14px;
			color: #333;
		}
	}
</style>