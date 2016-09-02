<template>

	<div class="page-content">
		<div class="edit-header navbar">
	    	<div class="navbar-inner">
	    		<div class="left">
					<a
						href="#"
						class="back-btn"
						@click="toBack">
						back
					</a>
				</div>
				<div class="center">
					<span class="page-title"> 
						{{schedule_item.sketch == '' ? '新增事务' : '编辑事务'}}
					</span>
				</div>
				<div class="right">
					<a
						href="#"
						class="">
						
					</a>
				</div>
			</div>
		</div>

		<p class="schedule-tips">
			
		</p>

		<form id="schedule-form" class="list-block">
			<ul>
				<li>
					<div class="item-content">
						<div class="item-inner">
							<div class="item-title label">事务</div>
							<div class="item-input">
								<input 
									type="text" 
									name="sketch-text" 
									placeholder="填写该事务的简要描述" 
									value="{{schedule_item.sketch}}">
							</div>
						</div>
					</div>
				</li>
				<li class="align-top">
					<div class="item-content">
						<div class="item-inner">
							<div class="item-title label">详情</div>
							<div class="item-input">
								<textarea id="describe-text">{{schedule_item.describe}}</textarea>
							</div>
						</div>
					</div>
				</li>
			</ul>
		</form>

		<a 
			href="#"
			class="button"
			@click="scheduleSubmit">
			确定
		</a>

	</div>

</template>

<script>
	import store from '../store/index';
	import { stopDoubleClick, filterSchedule } from '../api/computed.js';
	import comp_index_head from './comp-index-head.vue';

	export default {
		name: 'schedule-edit-page',
		replace: false,
		data() {
			return {
				img_path:'assets/img/'
			}
		},
		computed: {
			schedule_item() {
				let tmp_obj = {};
				tmp_obj = filterSchedule(store.state.everyday_init.schedule.list, window.schedule_item_id);
				
				return tmp_obj;
			}
		},
		methods: {
			scheduleSubmit() {
				let type = '';
				let sketch = $$('input[name=sketch-text]').val();
				let describe = $$('#describe-text').val();
				if (this.schedule_item.sketch == ''){
					type = 'add';
				} else {
					type = 'edit';
				}
				store.actions.schedule({
<<<<<<< HEAD
					id: this.schedule_item.id,
=======
>>>>>>> 4d334838ba51245275cb7cadc1d574a6ec15ab70
					type: type,
					sketch: sketch,
					describe: describe
				}, () => {
					this.toBack();
				});
				
			},
			toBack() {
				if (!stopDoubleClick(this, 500)){
	                return;
	            }
				// mainView.router.back({
				// 	animatePages: false
				// });
				window.history.back();
			}
		},
		components: {
			'comp-index-head': comp_index_head
		},
		ready() {
			// store.actions.init();

			
		}
	}
</script>

<style lang="less">
	@import url('../../assets/less/varsbank.less');  

	#schedule-edit-page { 
		background-color: #fff;

		.edit-header {
			color: @color-Eblue1;
			font-size: 14px;
			line-height: 40px;
			border-bottom: solid 1px #c4c4c4;
			.flexbox();
			.justify-content(space-between);
			&:after {
				display: none;
			}
			.right, .left {
				a {
					width: 30px;
				}
			}	
		}

		.schedule-tips {
			margin: 0;
			height: 30px;
			font-size: 12px;
			color: #acacac; 
			background-color: #f5f5f5; 
		}

		#schedule-form {
			margin: 0;
			padding-bottom: 20px;
			.item-title {
				width: 50px;
				color: #acacac;
			}
		}
	}
</style>