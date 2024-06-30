/*捕捉链接中的用户信息*/
// 获取URL中的code参数值
const urlParams = new URLSearchParams(window.location.search);
const userid = urlParams.get('user');

/*logo回到主页*/
function backhome()
{
	if(uerid!="null")
    {
        window.location.href = `StockTrade.html?user=${userid}`;
    }
    else{
        window.location.href = `StockTrade.html`;
    }
}

/*用户名去往用户详情页*/
function toUserPage(){
    window.location.href = `UserPage.html?user=${userid}`;

}