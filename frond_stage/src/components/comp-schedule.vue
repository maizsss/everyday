<template>
	
	<div class="schedule-wrap">
		<a 
			href="#"
			class="button add-new-item"
			@click="toScheduleEdit('add')">
			+
		</a>
		<ul 
			class="schedule-list"
			v-if="schedule_list.length != 0 && user.is_login && user.account == schedule_list[0].account"
			v-for="(index, val) in schedule_list"
			track-by="$index">
			<li class="schedule-item">
				<span class="item-number">
					
					<template
						v-if="val.sort_index == 0">
						(OK)
					</template>

					<template
						v-if="val.sort_index > 0">
						
					</template>
					
				</span>
				<div 
					class="text-wrap">
					<p class="main-text">
						{{val.sketch}}
					</p>
					<p class="sub-text">
						{{val.describe}}
					</p>
				</div>
				<div class="btn-wrap">
					<a 
						href="#"
						class="button to-change-state"
						@click="changeState(val)">
						状态
						<!-- <input type="text" id="change-state" value='' readonly> -->
					</a>
					<a 
						href="#"
						class="button to-complete"
						@click="toScheduleEdit('edit', val.id)">
						编辑
					</a>
				</div>
			</li>
		</ul>

		<p
			class="no-schedule-tips"
			v-if="schedule_list.length == 0">
			暂无日程安排
		</p>
	</div>	

</template>

<script>
	import store from '../store/index';
	import { stopDoubleClick } from '../api/computed.js';

	export default {
		name: 'comp-schedule',
		replace: true,
		data() {
			return {
				img_path:'assets/img/',
				state_picker: null,
				select_schedule: {}
			}
		},
		computed: {
			user() {
				return store.state.everyday_init.user;
			},
			schedule_list() {
				return store.state.everyday_init.schedule.list;
			}
		},
		methods: {
			toScheduleEdit(type, id) {
				if (!stopDoubleClick(this, 500)){
	                return;
	            }
	            type == 'new' ? window.schedule_item_id = 0 : window.schedule_item_id = id;

				myApp.redictNewPage('schedule-edit-page', true, true);
			},
			changeState(val) {
				let vue_this = this;
				this.select_schedule = val;
				// this.state_picker.open();
				myApp.modal({
				    title:  '状态操作',
				    text: '',
				    verticalButtons: true,
				    buttons: [
				      {
				        text: '优先',
				        onClick: function() {
				          	vue_this.toFirst(vue_this.select_schedule);
				        }
				      },
				      {
				        text: '完成',
				        onClick: function() {
				          	vue_this.toComplete(vue_this.select_schedule);
				        }
				      },
				      {
				        text: '删除',
				        onClick: function() {
				          	vue_this.toDelete(vue_this.select_schedule);
				        }
				      },
				      {
				        text: '取消',
				        close: true
				      },
				    ]
				});
			},
			toFirst(val) {
				store.actions.schedule({
					id: val.id,
					type: 'first'
				});
			},
			toComplete(val) {
				store.actions.schedule({
					id: val.id,
					type: 'complete'
				});
			},
			toDelete(val){
				myApp.modal({
					title:  '提示',
					text: '确定要删除吗？',
					buttons: [
						{
							text: '取消',
							close: true
						},
						{
							text: '确定',
							onClick: function() {
								store.actions.schedule({
									id: val.id,
									type: 'delete'
								});
							}
						}
					]
				});
			}
		},
		components: {
			
		},
		ready() {
			let vue_this = this;
			// setTimeout(() => {
			// 	vue_this.state_picker = myApp.picker({
			// 		input: '#change-state',
			// 		toolbarCloseText: '确定',
			// 	    cols: [
   //                      {
   //                          textAlign: 'center',
   //                          values: [
   //                          	'优先',
   //                          	'完成',
   //                          	'删除'
   //                          ],

   //                      },
   //                  ],
   //   //                onClose:function(picker){
   //   //                	if(picker.displayValue[0] == '优先'){
   //   //                		vue_this.toFirst(vue_this.select_schedule);
   //   //                	}
   //   //                	if(picker.displayValue[0] == '完成'){
   //   //                		vue_this.toComplete(vue_this.select_schedule);
   //   //                	}
   //   //                	if(picker.displayValue[0] == '删除'){
   //   //                		vue_this.toDelete(vue_this.select_schedule);
   //   //                	}
			// 		// }
			// 	});
			// 	// vue_this.state_picker.open();
			// }, 100);
		}
	}
</script>

<style lang="less">
	@import url('../../assets/less/varsbank.less');  

	#index-page { 

		.add-new-item {
			display: block;
			height: 30px;
			line-height: 30px;
			color: @color-Eblue1;
			font-size: 20px;
			text-align: center;
			border: none;
			border-radius: 5px;
			border: solid 1px @color-Eblue1;
		}

		.schedule-list {
			margin: 0;
			padding: 0;
			.schedule-item {
				padding: 5px 10px;
				border-bottom: solid 1px #c4c4c4;
				.flexbox();
				.justify-content(space-between);
				.text-wrap {
					flex: 1;
					-webkit-flex: 1;
					padding: 0 5px;
					.main-text {
						margin: 0;
						font-size: 16px;
						color: @color-Eblue1;
					}
					.sub-text {
						margin: 0;
						font-size: 12px;
						color: #acacac;
					}
				}
				.btn-wrap {
					.flexbox();
					.align-items(center);
					.button {
						height: 30px;
						line-height: 30px;
						font-size: 12px;
						background-color: transparent;
						color: @color-Eblue1;
						border-color: @color-Eblue1;
						&.active-state {
							background-color: #ededed;
						}
					}
					.to-change-state {
						margin-right: 5px;
						position: relative;
					}
					#change-state {
						position: absolute;
						top: 0;
						left: 0;
						opacity: 0;
						width: 100%;
						height: 100%;
						border: none;
					}
				}
				.item-number {
					font-size: 12px;
					line-height: 20px;
					color: #acacac;
				}
			}
		}

		.no-schedule-tips {
			margin: 0;
			padding: 20px 0;
			color: #acacac;
			font-size: 16px;
			text-align: center;
		}
	}
</style>