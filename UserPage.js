// 获取URL中的code参数值
const urlParams = new URLSearchParams(window.location.search);
const userid = urlParams.get('user');

var StaticInfo = {
    '000069': "华侨城A",
    '000651': "格力电器",
    '000776': "广发证券",
    '000858': "五粮液",
    '002007': "华兰生物",
    '002179': "中航光电",
    '002415': "海康威视",
    '002507': "涪陵榨菜",
    '002511': "中顺洁柔",
    '002714': "牧原股份",
    '300002': "神州泰岳",
    '300015': "爱尔眼科",
    '300024': "机器人",
    '300059': "东方财富",
    '300288': "朗玛信息",
    '300295': "三六五网",
    '300347': "泰格医药",
    '300498': "温氏股份",
    '300750': "宁德时代",
    '300760': "迈瑞医疗",
    '600009': "上海机场",
    '600028': "中国石化",
    '600048': "保利发展",
    '600276': "恒瑞医药",
    '600309': "万华化学",
    '600519': "贵州茅台",
    '600585': "海螺水泥",
    '600588': "用友网络",
    '601398': "工商银行",
    '603288': "海天味业",
}



var colsdic = {
    '表单号': 'Uid',
    '交易时间': 'TradeTime',
    '代码': 'Code',
    '名称': 'Name',
    '交易方向': 'TradeType',
    '成交金额': 'KnockPrice',
    '期望金额': 'Price',
    '数量': 'Amount',
    '交易状态': 'State',


}

var inittial = 1000000;
const { createApp } = Vue;

createApp({
    data() {
        return {
            user: userid,
            // block为1表示持仓详情，block为2表示交易记录
            block: 1,
            stocks: [],
            original_stocks: [4.74, 1701.00, 48.06, 86.72, 47.37, 63.98, 12.83, 25.6, 6.09, 19.43,
                86.81, 224.09, 15.1, 15.3, 17.28, 314.71, 28.27, 13.33, 19.55, 10.97,
                4.71, 23.97, 42.84, 34.34, 168.2, 34.95, 43.12, 15.02, 12.07, 22.03
            ],

            // 交互
            selectedStockId: -1,

            // 持有金额
            stockinhand: 0,

            // 账户余额
            remain: 0,

            // 累计盈亏=持有+余额-初始的账户
            total_account: 0,

            // 交易记录
            records: [],

            // 筛选列
            chosecol: '无',

            // 查询的内容
            findcontent: '',



        }
    },
    methods: {
        update: function() {

            const url = 'http://127.0.0.1:12345/getInventory?username=' + this.user;
            var tsum = 0;
            fetch(url)
                .then((response) => response.json())
                .then((data) => {
                    // 清空现有的股票信息数组
                    this.stocks = [];
                    // 遍历从 API 获取的股票数据，并更新到 stocks 数组中
                    for (var i = 0; i < data.length; i++) {

                        this.stocks.push({
                            'Code': data[i].Code,
                            'Name': StaticInfo[data[i].Code],
                            'Amount': data[i].Amount,
                            'Total_Cost': data[i].Total_Cost,
                            'AVG_Cost': data[i].AVG_Cost,

                        });

                        // 计算持有
                        tsum += (data[i].Amount * data[i].AVG_Cost);
                    }

                    this.stockinhand = tsum.toFixed(4);
                })
                .catch(error => {
                    console.error('Fetch请求错误:', error);
                });

            //余额查询
            const url2 = 'http://127.0.0.1:12345/getBalance?username=' + this.user;
            fetch(url2)
                .then((response) => response.json())
                .then((data) => {
                    this.remain = data;
                    this.total_account = parseFloat(this.stockinhand) + parseFloat(this.remain) - inittial;

                }).catch(error => {
                    console.error('Fetch请求错误:', error);
                });


        },
        redirectDetail(stockcode) {
            window.location.href = `stockdetail.html?code=${stockcode}&user=${this.user}`;
        },
        select(stockId) {
            this.selectedStockId = stockId;

        },
        logout: function() {
            var url = 'http://127.0.0.1:12345/logout?username=' + this.user;
            fetch(url).then((response) => response.json()).then((data) => {
                if (data === true) {
                    // 成功注销，返回游客页面
                    window.location.href = 'StockTrade.html';
                } else {
                    alert('注销失败，请重试!');
                }
            }).catch((error) => {
                alert('注销失败，请重试!');
            });
        },
        changeBlock: function(blockid) {
            this.block = blockid;
        },
        getRecords: function() {
            var url = 'http://127.0.0.1:12345/getTradeRecord?username=' + this.user;
            fetch(url).then((response) => response.json()).then((data) => {

                this.records = [];
                // 遍历从 API 获取的股票数据，并更新到 stocks 数组中
                for (var i = 0; i < data.length; i++) {

                    this.records.push({
                        'Uid': data[i].No,
                        'TradeTime': data[i].TradeTime,
                        'Code': data[i].Code,
                        'Name': StaticInfo[data[i].Code],
                        'TradeType': data[i].Direction,
                        'KnockPrice': data[i].KnockPrice,
                        'ExPrice': data[i].Price,
                        'Amount': data[i].Amount,
                        'State': data[i].State,

                    });


                }



            }).catch((error) => {

            });
        },
        chose: function(col) {
            this.chosecol = col;
        },
        nochose: function() {
            this.chosecol = "无";
        },
        toUserPage:function(){
        window.location.href = `UserPage.html?user=${userid}`;

    },
    backhome:function(){
        if(this.user!=" ")
        {
            window.location.href = `StockTrade.html?user=${this.user}`;
        }
        else{
            window.location.href = `StockTrade.html`;
        }
    }
    




    },
    computed: {
        filterrecords() {
            if (this.chosecol === '无') {
                return this.records;
            }

            var tmpre = []; // 用于存储符合条件的记录  
            var findcontent = this.findcontent || ''; // 确保findcontent有值，否则默认为空字符串  
            var columnName = colsdic[this.chosecol]; // 根据chosecol获取对应的列名  

            if (!columnName) {
                console.error('无效的列名:', this.chosecol);
                return this.records; // 或者可以返回一个空数组，取决于您的需求  
            }

            for (var i = 0; i < this.records.length; i++) {
                var record = this.records[i];
                var info = record[columnName]+''; // 动态获取属性值  

                // 确保info是字符串类型且包含findcontent  
                if (typeof info === 'string' && info.includes(findcontent)) {
                    tmpre.push(record); // 将符合条件的记录添加到临时数组  
                }
            }

            return tmpre; // 返回过滤后的记录数组  
        }

    },
    mounted: function() {
        // 每隔一段时间调用update函数，例如每3秒钟
        setInterval(() => {
            this.update();
        }, 3000); // 3000 毫秒 = 3 秒

        setInterval(() => {
            this.getRecords();
        }, 3000); // 3000 毫秒 = 3 秒

        this.update();
    }


}).mount("#app");