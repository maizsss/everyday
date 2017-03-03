<template>
	
	<div class="header navbar">
    	<div class="navbar-inner">
    		<div class="left">
				<a
					href="#"
					class="forward-btn active"
					v-if="user.is_login"
					@click="logout">
					注销
				</a>
				<div
					class="sm-btn-wrap"
					v-if="!user.is_login">
					<a
						href="#"
						class="sm-btn login-btn"
						@click="login">
						登陆
					</a>
					<a
						href="#"
						class="sm-btn sign-btn"
						@click="toSignPage">
						| 注册
					</a>
				</div>
			</div>
			<div class="center">
				<span class="page-title"> 
					我的日程
				</span>
			</div>
			<div class="right">
				<a
					href="#"
					class="end-btn active">
					<p class="main-text">选择日期</p>
					<p class="sub-text">{{select_day_format}}</p>
					<input type="text" id="calendar-multiple" readonly value="12321" />
				</a>
			</div>
		</div>
	</div>

</template>

<script>
	import store from '../store/index';
	import { stopDoubleClick, verification } from '../api/computed.js';

	export default {
		name: 'comp-index-head',
		replace: true,
		data() {
			return {
				img_path:'assets/img/',
				today_format: '',
				select_day_format: '',
				calendarInline: null
			}
		},
		computed: {
			user() {
				return store.state.everyday_init.user;
			},
		},
		methods: {
			setDate(year, month, day) {
				
				this.select_day_format = year + '-' + month + '-' + day;
			},
			openDateSelect() {
				this.calendarInline.open();
			},
			dateSelect() {
				let vue_this = this;
				let $$ = Dom7;
				vue_this.calendarInline = myApp.calendar({
					input: '#calendar-multiple',
					value: [new Date()],
					dateFormat: 'DD, MM dd, yyyy',
				    dayNamesShort: ['日', '一', '二', '三', '四', '五', '六'],
				    monthNames: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
				    onDayClick(p, dayContainer, year, month, day) {
				    	if (!vue_this.user.is_login){
				    		myApp.alert('请先登录');
				    		
				    	}
				    	vue_this.setDate(year, month*1+1, day);   
				    },
				    onClose() {
				    	if (!vue_this.user.is_login) return;
				    	store.actions.init({
				    		date: vue_this.select_day_format
				    	});
				    }
				}); 
				let date = new Date();
				let year = date.getFullYear();
				let month = date.getMonth() + 1;
				let day = date.getDate();
				this.today_format = year + '-' + month + '-' + day; 
				this.select_day_format = year + '-' + month + '-' + day;
			},
			login() {
				let vue_this = this;
				
				myApp.modalLogin('请输入您的帐号与密码', function (account, password) {
			        store.actions.user({  
			    		account: account,
			    		password: password,
			    		type: 'login'
			    	});
			    });
			},
			logout() {
				let vue_this = this;
				myApp.modal({
					title:  '提示',
					text: '确定要注销吗？',
					buttons: [
						{
							text: '取消',
							close: true
						},
						{
							text: '确定',
							onClick: function() {
								store.actions.user({  
						    		account: vue_this.user.account,
						    		type: 'logout'
						    	});
							}
						}
					]
				});
			},
			toSignPage() {
				if (!stopDoubleClick(this, 500)){
	                return;
	            }
	            myApp.redictNewPage('sign-page', true, true);
			}
		},
		components: {
			
		},
		ready() {
			this.dateSelect();
		}
	}
</script>

<style lang="less">
	@import url('../../assets/less/varsbank.less');  


	.header {
		color: @color-Eblue1;
		font-size: 14px;
		line-height: 43px;
		border-bottom: solid 1px #c4c4c4;
		.flexbox();
		.justify-content(space-between);
		&:after {
			display: none;
		}	
		.navbar-inner {
			padding: 0;
		}
		a {
			display: inline-block;
			padding: 0 10px;
			width: 100px;
			height: 43px;
			text-align: center;
			.transition(.2s);
			&.active.active-state {
				opacity: 0.3;
			}
		}
		.forward-btn {
			// border-right: solid 1px #c4c4c4;
			color: #acacac;
			padding: 0;
			&.active {
				color: @color-Eblue1;
			}
		}
		.sm-btn-wrap {
			padding-left: 5px;
		}
		.left .sm-btn {
			width: 36px;
			margin: 0;
			padding: 0;
		}
		.end-btn {
			// border-left: solid 1px #c4c4c4; 
			position: relative;
			padding: 0;
			.main-text {
				margin: 0;
				height: 12px;
				line-height: 12px;
				padding: 7px 0 3px;
			}
			.sub-text {
				margin: 0;
				height: 12px;
				line-height: 12px;
				color: #acacac;
			}
			
		}
		#calendar-multiple {
			width: 100%;
			height: 100%;
			opacity: 0;
			position: absolute;
			top: 0;
			left: 0;
			border: none;
		}
		.page-title {
			font-size: 16px;
			font-weight: 700;
		}
	}
	
</style>