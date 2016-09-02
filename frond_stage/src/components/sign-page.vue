<template>
	
	<div class="page-content">
		<div class="sign-header navbar">
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
						注册
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
		<form id="sign-form" class="list-block">
			<ul>
				<li>
					<div class="item-content">
						<div class="item-inner">
							<div class="item-title label">账号</div>
							<div class="item-input">
								<input type="text" name="sign-account" placeholder="请填写5~9位数字的账号" class="modal-text-input">
							</div>
						</div>
					</div>
				</li>
				<li>
					<div class="item-content">
						<div class="item-inner">
							<div class="item-title label">昵称</div>
							<div class="item-input">
								<input type="text" name="sign-user_nickname" placeholder="请填写2~9位字符的昵称" class="modal-text-input">
							</div>
						</div>
					</div>
				</li>
				<li>
					<div class="item-content">
						<div class="item-inner">
							<div class="item-title label">密码</div>
							<div class="item-input">
								<input type="password" name="sign-password1" placeholder="请填写6~11位字符密码" class="modal-text-input">
							</div>
						</div>
					</div>
				</li>
				<li>
					<div class="item-content">
						<div class="item-inner">
							<div class="item-title label">重复密码</div>
							<div class="item-input">
								<input type="password" name="sign-password2" placeholder="请重复填写密码" class="modal-text-input">
							</div>
						</div>
					</div>
				</li>
			</ul>
		</form>
		<a 
			href="#"
			class="button"
			@click="signSubmit">
			确定
		</a>
	</div>

</template>

<script>
	import store from '../store/index';
	import { stopDoubleClick, verification } from '../api/computed.js';

	export default {
		name: 'sign-page',
		replace: false,
		data() {
			return {
				img_path:'assets/img/',
				today_format: ''
			}
		},
		computed: {
			user() {
				return store.state.everyday_init.user;
			},
		},
		methods: {
			toBack() {
				if (!stopDoubleClick(this, 500)){
	                return;
	            }
				window.history.back();
			},
			signSubmit() {
				let vue_this = this;
				let account = $$('input[name=sign-account]').val();
				let user_nickname = $$('input[name=sign-user_nickname]').val();
				let password1 = $$('input[name=sign-password1]').val();
				let password2 = $$('input[name=sign-password2]').val();

				if (!verification('account', account)){
					myApp.alert('请填写正确格式的账号');
					return;
				}
				if (!verification('user_nickname', user_nickname)){
					myApp.alert('请填写正确格式的昵称');
					return;
				}
				if (!verification('password', password1)){
					myApp.alert('请填写正确格式的密码');
					return;
				}
				if (password1 !== password2){
					myApp.alert('密码不对应');
					return;
				}
				store.actions.user({  
		    		account: account,
		    		user_nickname: user_nickname,
		    		password: password1,
		    		type: 'sign'
		    	}, function (){
		    		myApp.alert('注册成功');
		    		vue_this.toBack();
		    	});
							
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

	#sign-page { 
		background-color: #fff;

		.sign-header {
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

		#sign-form {
			margin: 0;
			padding-bottom: 20px;
			.item-title {
				width: 50px;
				color: #acacac;
			}
		}
	}
</style>