// 获取URL中的code参数值
const urlParams = new URLSearchParams(window.location.search);
const code = urlParams.get('code');


const {createApp} = Vue;

createApp({
	data(){
		return{
			message:code,
		}
	}

}).mount("#app");