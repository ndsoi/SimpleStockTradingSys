//处理传进来的code
const cururl = new URLSearchParams(window.location.search);
const stockcode = cururl.get('code');
var StaticInfo = {'000069': "华侨城A",
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
'603288': "海天味业",}


// 传进来的用户名
var username = cururl.get('user');

const ctx = document.getElementById('Chart');
var chose = 1;

const chart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: [], // 初始化为空数组，稍后将添加时间戳  
        datasets: [{
                label: '最新价格',
                data: [], // 初始化为空数组，稍后将添加数据点  
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
                fill: false,
                tension: 0.2,
            },
            {
                label: '涨幅', // 假设你要添加的第二个数据集是涨跌幅  
                data: [], // 初始化为空数组，稍后将添加数据点  
                yAxisID: 'y1',
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1,
                fill: false,
                tension: 0.2,

            }
        ],

    },
    options: {

        plugins: {
            // 注册并使用 crosshairs 插件  
            tooltip: {
                mode: 'interpolate',
                intersect: false
            },
            crosshairs: {
                // 配置 crosshairs 插件的选项，如果有的话  
                // 例如：颜色、样式等 
                line: {
                    color: '#F66', // crosshair line color
                    width: 1 // crosshair line width
                },
            },
            title: {
                display: true,
                text: `${StaticInfo[stockcode]}-${stockcode}`,
            }
        },
        scales: {
            x: {
                type: 'time',
                time: {
                    displayFormats: {
                        second: 'HH:mm:ss'
                    }
                },
            },
            y: {
                position: 'left',
            },
            y1: {
                position: "right",

            },


        }
    }
});






const { createApp } = Vue;
createApp({
    data() {
        return {
            user: username,
            mode: chose,
            message: "hello",

        }
    },
    methods: {
        update: function(time) {
            chose = time;
            this.mode = chose,
                this.message = "点击了" + time;
        },
        buy: function() {
            if (this.user != 'null') {

            } else {
                alert('请先登陆');
            }
        },
        sell: function() {
            if (this.user != 'null') {

            } else {
                alert('请先登陆');
            }
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
        }


    },
}).mount("#app");







function update() {
    const url = `http://127.0.0.1:12345/getStockPrice?code=${stockcode}`;
    fetch(url)
        .then(response => response.json())
        .then(data => {

            var l = data.length;
            // 生成新的数据点  
            const now = new Date();

            const labels = generateTimeSequence(now, 5, l);
            chosePresent(labels, data, chose, chart);
            // 更新图表显示  
            chart.update();

        })
        .catch(error => {
            console.error(error);
        });
}
//实现一个筛选函数
function chosePresent(labels, data, num, chart) {
    chart.data.labels = [];
    chart.data.datasets[0].data = [];
    chart.data.datasets[1].data = [];
    var start = data.length - 150 * num;
    if (start < 0) {
        start = 0;
    }
    var original = parseFloat(data[0]);
    for (var index = start; index < data.length; index += num) {
        chart.data.labels.push(labels[index]);
        var limit = (data[index] - original) / original;
        var item = data[index];
        chart.data.datasets[1].data.push(limit);
        chart.data.datasets[0].data.push(parseFloat(item));
    }

}

//
// 生成时间序列的函数  
function generateTimeSequence(start, interval, count) {
    // 从start逆推，间隔interval*1000ms更新一次股票，也即生成一个时间节点
    // 共产生count个时间节点
    const sequence = [];
    for (let i = 0; i < count; i++) {
        sequence.unshift(new Date(start.getTime() - (i * interval * 1000))); // 使用unshift将新元素添加到数组的开始  
    }
    return sequence;
}

// 设置定时器，每3秒调用一次updateChart函数  
setInterval(update, 5000);