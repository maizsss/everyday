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
