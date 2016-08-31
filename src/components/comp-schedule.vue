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
			v-if="schedule_list.length != 0"
			v-for="(index, val) in schedule_list"
			track-by="$index">
			<li class="schedule-item">
				<span class="item-number">
					{{index + 1}}.
				</span>
				<div class="text-wrap">
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
						class="button to-first">
						优先
					</a>
					<a 
						href="#"
						class="button to-edit"
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
				img_path:'assets/img/'
			}
		},
		computed: {
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
			}
		},
		components: {
			
		},
		ready() {
			
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
					.to-first {
						margin-right: 5px;
					}
				}
				.item-number {
					font-size: 16px;
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