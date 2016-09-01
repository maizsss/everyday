<template>
	
	<div class="toolbar index-toolbar">
		<a 
			href="#" 
			class="toolbar-item to-schedule"
			:class="{active: now_tab == 1}"
			@click="changeTab(1)">
			<span>日程</span>
		</a>
		<a 
			href="#" 
			class="toolbar-item to-about"
			:class="{active: now_tab == 2}"
			@click="changeTab(2)">
			<span>关于</span>
		</a>
	</div>

</template>

<script>
	import store from '../store/index';
	import { stopDoubleClick } from '../api/computed.js';

	export default {
		name: 'bottom-toolbar',
		replace: true,
		data() {
			return {
				img_path:'assets/img/',
				now_tab: 1
			}
		},
		computed: {
			
		},
		methods: {
			changeTab(tab) {
				this.now_tab = tab;

				tab == 1 && mainView.router.load({
                    pageName: 'index-page',
                    animatePages: false,
                    pushState: false
                }); 
				tab == 2 && mainView.router.load({
                    pageName: 'about-page',
                    animatePages: false,
                    pushState: false
                }); 
			}
		},
		components: {
			
		},
		compiled() {
		}
	}
</script>

<style lang="less">
	@import url('../../assets/less/varsbank.less');  

	.index-toolbar {
		background-color: #f3f3f3;
		height: 44px;
		// .flexbox();
		// .justify-content(space-between);
		
		.toolbar-item  {
			display: block;
			width: 49.9%;
			flex: 1;
			-webkit-flex: 1;
			height: 100%;
			float: left;
			box-sizing: border-box;
			color: @color-Eblue1;
			.flexbox();
			.justify-content(center);
			.align-items(center);
			border-left: solid 1px @color-Eblue1;
			.transition(.2s);
			&:first-of-type { 
				border-left: none;
			}

			&.active {
				background-color: @color-Eblue1;
				color: #fff;
			}
		}
	}
</style>