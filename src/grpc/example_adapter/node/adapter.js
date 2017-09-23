const grpc = require('grpc');
const tradeSvcNs = grpc.load({
    root:__dirname+'/../../',
    file:'trade_service.proto'
}).balance;

let server = new grpc.Server();

server.addService(tradeSvcNs.Trade.service, {
    orderNewSingle: (call, callback)=>{
        console.log('on orderNewSingle()');
        if (Math.random()>0.5) {
            console.log('\treturn success');
            call.request.order.status = tradeSvcNs.Order.EnumStatus.NEW;
            call.request.order.order_id = parseInt(Math.random()*999999).toString();
            callback(null, call.request.order);
        } else {
            console.log('\treturn error');
            callback(new Error('got error by random()'), null);
        }
    },
    accountAsset: (call, callback)=>{
        console.log('on accountAsset()');
        let asset = {
            market : call.request.market,
            account : call.request.account,
            cash_positions : [],
            stock_positions : []
        };
        const tradeDataNs = tradeSvcNs;
        let cashData = [
            ['ANY','USD','L','9284713.00','9284713.00','9284713.00'],
            ['US','USD','L','84713.00','84713.00','84713.00'],
            ['HK','HKD','L','84713.00','84713.00','84713.00'],
        ];
        cashData.forEach((cash)=>{
            let market = tradeDataNs.EnumMarket.ANY;
            if (cash[0]=='US') market = tradeDataNs.EnumMarket.US;
            if (cash[0]=='HK') market = tradeDataNs.EnumMarket.HK;
            let long_short = cash[2]=='L'? tradeDataNs.EnumLongShort.LONG : tradeDataNs.EnumLongShort.SHORT;
            let randChange = parseInt(Math.random()*1000); // 给返回的数值进行随机变动，界面有刷新的效果
            asset.cash_positions.push({
                market: market,
                currency: cash[1],
                long_short: long_short,
                balance: (parseInt(cash[3]) + randChange).toString(),
                available: (parseInt(cash[4]) + randChange).toString(),
                settled: (parseInt(cash[5]) + randChange).toString(),
            });
        });
        let stockData = [
            ['FX','USD/CNY','L','2000','2000','2000','13180'],
            ['US','RHT','L','500','500','500','53150'],
            ['US','MSFT','L','200','100','200','14882'],
            ['US','BABA','S','100','100','100','17814'],
            ['HK','700','L','500','500','500','173000'],
            ['HK','3888','L','100','0','100','18300'],
            ['HK','5','L','1000','0','100','76200'],
        ];
        stockData.forEach((stock)=>{
            let market = tradeDataNs.EnumMarket.ANY;
            if (stock[0]=='US') market = tradeDataNs.EnumMarket.US;
            if (stock[0]=='HK') market = tradeDataNs.EnumMarket.HK;
            if (stock[0]=='FX') market = tradeDataNs.EnumMarket.FX;
            let long_short = stock[2]=='L'? tradeDataNs.EnumLongShort.LONG : tradeDataNs.EnumLongShort.SHORT;
            let randChange = parseInt(Math.random()*1000); // 给返回的数值进行随机变动，界面有刷新的效果
            asset.stock_positions.push({
                market: market,
                symbol: stock[1],
                long_short: long_short,
                balance: stock[3],
                available: stock[4],
                settled: stock[5],
                market_value: (parseInt(stock[6]) + randChange).toString(),
            });
        });
        console.log('\treturn success');
        callback(null, asset);
    }
});
server.bind('0.0.0.0:9527', grpc.ServerCredentials.createInsecure());
server.start();
