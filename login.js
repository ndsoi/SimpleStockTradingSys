const { createApp } = Vue
    createApp({
        data() {
            return {
                username: '',
                password: '',
                message: '',

            }

        },
        methods: {
            login: function() {
               
                fetch(`http://127.0.0.1:12345/login?username=${this.username}&pwd=${this.password}`)
                    .then((response) => response.json())
                    .then((data) => {

                        if (data === true) {
                            this.message = '登陆成功';
                            // 2秒后跳转到另一个页面
                            setTimeout(() => {
                                    window.location.href = "./StockTrade.html?user="+this.username;
                                }, 2000);
                        } else {
                            this.message = '登陆失败，请重试';
                        }
                    })
                    .catch((error) => {
                        console.error('请求失败：', error);
                        this.message = '请求失败，请重试';
                    });
            
            }

        },
        watch:{
            username(newUsername)
            {
                if(newUsername=="")
                {
                    this.message = "用户名不得为空!";
                }
                else
                {
                    this.message = "";
                }
            },
            password(newPassword){
                if(newPassword == "")
                {
                    this.message = "密码不得为空!";
                }
                else
                {
                    this.message = "";
                }
            }

        }
      
    }).mount("#app")