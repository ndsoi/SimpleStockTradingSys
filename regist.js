const { createApp } = Vue
    createApp({
        data() {
            return {
                message: "",
                password: "",
                confirmPassword: "",
                username: "",
                message2:"",
                message3:"",
            }
        }, //别忘记逗号
        methods: {
            register: function() {
                // 检验一下表单信息
                // 用户名不为空
                if (this.username === '') {
                    this.message = "用户名不为空";
                } else if (this.password === '') {
                    this.message = "密码不能为空！";
                } else if (this.password !== this.confirmPassword) {
                    this.message = "密码和确认密码不一致";
                } else {
                    // 调用API，根据返回结果判断是否成功登陆注册
                    // this.message = "信息没问题，准备验证"
                    url = 'http://127.0.0.1:12345/regist?username='+this.username+'&pwd='+this.password;

                    fetch(url).then((response) => response.json()).then((data) => {
                        if (data === true) {
                            this.message = "注册成功!";

                            setTimeout(()=>{window.location.href='file:///C:/Users/86139/Documents/WeChat%20Files/wxid_xl2mbizdzgms22/FileStorage/File/2024-03/%E6%A8%A1%E6%8B%9F%E6%9C%8D%E5%8A%A1%E7%AB%AFv0.4/%E6%A8%A1%E6%8B%9F%E6%9C%8D%E5%8A%A1%E7%AB%AFv0.4/login_cp.html?';
                        },2000)

                        } else {
                            this.message = "注册失败!";

                        }
                    }).catch((error) => {
                        this.message = "发生错误，请重试!";
                    })
                }
            }
        },
        watch: {
            password(newPassword) {

                if (newPassword !== this.confirmPassword) {
                    this.message = "密码和确认密码不一致"
                } else {
                    this.message = "";
                }

            },
            confirmPassword(newConfirmPassword) {
                if (newConfirmPassword !== this.password) {
                    this.message = "密码和确认密码不一致";
                } else {
                    this.message = "";
                }
            }

        }

    }).mount("#app")