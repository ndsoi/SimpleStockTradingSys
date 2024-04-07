// 获取URL中的code参数值
const urlParams = new URLSearchParams(window.location.search);
const userid = urlParams.get('user');




const { createApp } = Vue
createApp({
    data() {
        return {
            stocks: [],
            original_stocks :[4.74,1701.00,48.06,86.72,47.37,63.98,12.83,25.6,6.09,19.43,
            86.81,224.09,15.1,15.3,17.28,314.71,28.27,13.33,19.55,10.97,
            4.71,23.97,42.84,34.34,168.2,34.95,43.12,15.02,12.07,22.03],
            time :{'year':'0','month':'0','day':'0',hours:'0','minutes':'0','seconds':'0'},
            showtime:'',
            countdown:3000,

          	// 版块选择
          	picked:['深','沪','创'],

            // 交互
            selectedStockId:-1,
            user:userid,

            message:'',

        }
    },
    computed:{
    	filterStocks(){
    		var tmpS = [];
    		var tmpH = [];
    		var tmpC = [];
    		if(this.picked.includes('深'))
    		{
    			tmpS = this.stocks.slice(20,30);
    		}
    		if (this.picked.includes('沪')) {
    			tmpH = this.stocks.slice(0,10);
    		}
    		if (this.picked.includes('创')) {
    			tmpC = this.stocks.slice(10,20);
    		}
    		return tmpH.concat(tmpC).concat(tmpS);
    	}
    },
    methods:{
        update: function() {
        const url = 'http://127.0.0.1:12345/getMarketPrice';

        fetch(url)
            .then((response) => response.json())
            .then((data) => {
                const now = new Date();
                this.time['year'] = now.getFullYear();
                this.time['month'] = now.getMonth()+1;
                this.time['day'] = now.getDate();
                this.time['hours'] = now.getHours();
                this.time['minutes'] = now.getMinutes();
                this.time['seconds'] = now.getSeconds();

                this.countdown = 3000;

                // 为美观补一下一位数
                if (this.time['minutes'].toString().length<2) {
                    this.time['minutes'] = '0'+this.time['minutes'];
                }
                if(this.time['seconds'].toString().length<2){
                    this.time['seconds'] = '0'+this.time['seconds'];
                }
                this.showtime = this.time['year']+'-'+this.time['month']+'-'+this.time['day']+'  '+this.time['hours']+':'+this.time['minutes']+':'+this.time['seconds'];
                // 清空现有的股票信息数组
                this.stocks = [];
                // 遍历从 API 获取的股票数据，并更新到 stocks 数组中
                for (var i = 0; i < data.length; i++) {
                    
                    var p2 = (parseFloat(data[i].Price))-this.original_stocks[i];
                    var p1 = p2/this.original_stocks[i];
                    this.stocks.push({
                        'Code': data[i].Code,
                        'Name': data[i].Name,
                        'Price': data[i].Price,
                        'pricelimit':p1.toFixed(3),
                        'limitprice':p2.toFixed(3),

                    });
                }
            })
            .catch(error => {
                console.error('Fetch请求错误:', error);
            });
    },
    updatecountdown:function(){
        if (this.countdown>0) {
            this.countdown-=100;
        }

    },
    redirectDetail(stockcode){
    	window.location.href = `stockdetail.html?code=${stockcode}&user=${userid}`;
    },
    select(stockId){
        this.selectedStockId = stockId;
       
    },
    logout:function(){
        var url = 'http://127.0.0.1:12345/logout?username='+this.user;
        fetch(url).then((response)=>response.json()).then((data)=>{
            if(data===true)
            {
                // 成功注销，返回游客页面
                window.location.href = 'StockTrade.html';
            }
            else
            {
                alert('注销失败，请重试!');
            }
        }).catch((error)=>{
            alert('注销失败，请重试!');
        });
    }

        
    },
    mounted: function() {
        // 每隔一段时间调用update函数，例如每3秒钟
        setInterval(() => {
            this.update();
        }, 3000); // 3000 毫秒 = 3 秒
        setInterval(()=>{
            this.updatecountdown();
        },100);

        this.update();
    }

}).mount("#app")
