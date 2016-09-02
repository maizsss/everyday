//定义公共计算属性方法 & 校验等方法

/*
    定义弹消息方法 ——
        参数 ——
            toastStr: 需要提示的消息字符串
*/
export const showToast = (toastStr) => {
	
	if (myWebview.isInAppFunc()){
		myWebview.showToast(toastStr);
	} else {
		myApp.alert(toastStr);
	}
}

/*
    定义跳转方式 ——
        参数 ——
            link: 需要跳转的url
*/
export const jumpLink = (link) => {
	if (myWebview.isInAppFunc()){
		myWebview.appNav(link)
	} else {
		window.location.href = link
	}
}

/*
	防止重复触发按钮
		参数 ——
			vm: vue组件的实例
			delay: 按钮禁用的延迟时间
		返回 ——
			true or false
		用法示例 ——
			// 点击按钮后500ms内再次点击不会触发按钮行为
			if (!stopDoubleClick(this, 500)){
                return;
            }
*/
export const stopDoubleClick = (vm, delay) => {
	if(vm.isVmClick){
		return false;
	}
	vm.isVmClick = true;
	setTimeout(() => {
		vm.isVmClick = false
	}, delay ? delay : 1000)
	return true;
}

export const filterSchedule = (value, id) => {
	let tmp_obj = {
		sketch: '',
        describe: ''
	};
	if(id){
		let itemIndex = _.findLastIndex(value, (obj) => {
			return obj.id == id;
		});
		(itemIndex != -1) ? tmp_obj = value[itemIndex] : false; 
	}
	return tmp_obj;
}

export const verification = (type ,str) => {
	let typeRegx = {
		name: /^[\u2E80-\uFE4F]{2,4}$/,
		identification_card: /^(\d{15}$|^\d{18}$|^\d{17}(\d|X|x))$/,
		card_no: /^(\d{12,19})$/,
		bank_name: /^[\u2E80-\uFE4F]{3,10}$/,
		mobile:  /^([0-9]{11})?$/,
		card_no_input: /^\d+$/,
		team_name: /^([\u2E80-\uFE4F]|\d|[A-Za-z]){2,6}$/,
		tid: /^((\d|[A-Za-z]){5,15})$/,
		nick_name: /^(.{1,20})$/,
		qid: /^(\d{5,11})$/,
		tel: /^(\d{8,11})$/,
		account: /^(\d{5,9})$/,
		user_nickname: /^(.{2,9})$/,
		password: /^(.{6,11})$/
	};
	let regx = typeRegx[type];

	if (regx.test(str)){
		return true;
	} else {
		return false;
	}
};
<<<<<<< HEAD

export const getCookie = (name) => {

	var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
	if(arr=document.cookie.match(reg)){
		return unescape(arr[2]);
	} else {
		return null;
	}
}
=======
>>>>>>> 4d334838ba51245275cb7cadc1d574a6ec15ab70
