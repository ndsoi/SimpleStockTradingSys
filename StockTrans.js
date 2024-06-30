const cururl = new URLSearchParams(window.location.search);
const user = cururl.get('user');
const code = cururl.get('stockcode');
const name = cururl.get('stockname');
const dir = cururl.get('direction');
const p = cururl.get('price');
const t = cururl.get('time');
const { createApp } = Vue;

function formatDate(date) {  
    var year = date.getFullYear();  
  
    var month = (1 + date.getMonth()).toString();  
    month = month.padStart(2, '0');  
  
    var day = date.getDate().toString();  
    day = day.padStart(2, '0');  
  
    var hours = date.getHours().toString();  
    hours = hours.padStart(2, '0');  
  
    var minutes = date.getMinutes().toString();  
    minutes = minutes.padStart(2, '0');  
  
    var seconds = date.getSeconds().toString();  
    seconds = seconds.padStart(2, '0');  
  
    return year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds;  
}  


createApp({
    data() {
        return {
            message: "",
            stockname: name,
            stockcode: code,
            transuser: user,

            direction: dir, // 交易类型：0为买，1为卖
            price: p,
            num: 0, //数量
            sum: 0, // 总价
            time: t, //填单时间
            formid: 0,

            // 交易结果
            TransRes:-1,
            TransTitle:'',
            TransTime:null,
            Reason:'',

        }
    },
    watch: {
        num(newNum) {
            this.sum = newNum * parseFloat(this.price);
        }
    },
    methods: {
        changeDirect: function(chose) {
            this.direction = chose;
        },
        // 提交单子
        submit: function() {
          	// 调用服务器Api

          	const url = `http://127.0.0.1:12345/trade?username=${this.transuser}&code=${this.stockcode}&direction=${this.direction}&price=${this.price}&amount=${this.num}`;

          	fetch(url).then((response)=>response.json()).then((data)=>{
          		// 设置TransRes
          		this.TransRes = data;
              if((data!=1)&&(data!=2))
              {
                this.TransTitle = '交易失败';
                if(data===3)
                {
                    if(this.direction==='buy')
                    {
                      this.Reason = '买入价超出价格变动范围';
                    }
                    else
                    {
                      this.Reason = '卖出价超出价格变动范围';
                    }
                }
                else if(data===4)
                {
                    this.Reason = '账户余额不支持当次交易';
                }
                else
                {
                    this.Reason = '持仓数量不支持当次交易';
                }
              }
              else
              {
                if (data===1) {
                  this.TransTitle = '委托成功';
                }
                else
                {
                this.TransTitle = '交易成功';
              }
              }

              this.TransTime = formatDate(new Date());

          	}).catch((error)=>{
          		console.log(error);
          	});
        },
        cancel:function()
        {
            window.location.href = `stockdetail.html?code=${code}&user=${user}`;
        },

    }
}).mount("#formapp");



