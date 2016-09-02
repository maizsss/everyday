export const verification = (type ,str) => {
	let typeRegx = {
		identification_card: /^(\d{15}$|^\d{18}$|^\d{17}(\d|X|x))$/,
		team_name: /^([\u2E80-\uFE4F]|\d|[A-Za-z]){2,6}$/,
		account: /^(\d{5,9})$/,
		user_nickname: /^(.{2,9})$/,
		password: /^(\d|[A-Za-z]){6,11}$/
	};
	let regx = typeRegx[type];

	if (regx.test(str)){
		return true;
	} else {
		return false;
	}
};
