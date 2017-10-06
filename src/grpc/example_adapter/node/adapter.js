const grpc = require('grpc');
const tradeSvcNs = grpc.load({
    root:__dirname+'/../../',
    file:'trade_service.proto'
}).balance;
const GrpcMngFix = require('../../grpc_enum_fix');

let server = new grpc.Server();

server.addService(tradeSvcNs.Trade.service, {
    orderNewSingle: (call, callback)=>{
        console.log(`on orderNewSingle(${JSON.stringify(call.request)})`);
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
    orderAmendSingle: (call, callback)=>{
        console.log(`on orderAmendSingle(${JSON.stringify(call.request)})`);
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
    orderCancelSingle: (call, callback)=>{
        console.log(`on orderCancelSingle(${JSON.stringify(call.request)})`);
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
        console.log(`on accountAsset(${JSON.stringify(call.request)})`);
        let asset = {
            market : call.request.market,
            account : call.request.account,
            cash_positions : [],
            stock_positions : []
        };
        const tradeDataNs = tradeSvcNs;
        let cashData = [
            ['ANY','USD','LONG','9284713.00','9284713.00','9284713.00'],
            ['US','USD','LONG','84713.00','84713.00','84713.00'],
            ['HK','HKD','LONG','84713.00','84713.00','84713.00'],
        ];
        cashData.forEach((cash)=>{
            let randChange = parseInt(Math.random()*1000); // 给返回的数值进行随机变动，界面有刷新的效果
            let cashPos = {
                account: asset.account,
                market: cash[0],
                currency: cash[1],
                long_short: cash[2],
                balance: (parseInt(cash[3]) + randChange).toString(),
                available: (parseInt(cash[4]) + randChange).toString(),
                settled: (parseInt(cash[5]) + randChange).toString(),
            };
            GrpcMngFix.fixCashPosition(cashPos);
            asset.cash_positions.push(cashPos);
        });
        let stockData = [
            ['FX','USD/CNY','LONG','2000','2000','2000','13180'],
            ['US','RHT','LONG','500','500','500','53150'],
            ['US','MSFT','LONG','200','100','200','14882'],
            ['US','BABA','SHORT','100','100','100','17814'],
            ['HK','700','LONG','500','500','500','173000'],
            ['HK','3888','LONG','100','0','100','18300'],
            ['HK','5','LONG','1000','0','100','76200'],
        ];
        stockData.forEach((stock)=>{
            let randChange = parseInt(Math.random()*1000); // 给返回的数值进行随机变动，界面有刷新的效果
            let stockPos = {
                account: asset.account,
                market: stock[0],
                symbol: stock[1],
                long_short: stock[2],
                balance: stock[3],
                available: stock[4],
                settled: stock[5],
                market_value: (parseInt(stock[6]) + randChange).toString(),
            }
            GrpcMngFix.fixStockPosition(stockPos);
            asset.stock_positions.push(stockPos);
        });
        console.log('\treturn success');
        callback(null, asset);
    },
    accountOrderList: (call, callback)=>{
        console.log(`on accountOrderList(${JSON.stringify(call.request)})`);
        let odrList = {
            market : call.request.market,
            account : call.request.account,
            order_list : []
        };
        const tradeDataNs = tradeSvcNs;
        let odrData = [
            ['HK','700','300','350', '', 'LIMIT', 'DAY', 'LONG', 'OPEN', 'NEW', '0', ''],
            ['US','BABA','100','150', '', 'LIMIT', 'DAY', 'SHORT', 'OPEN', 'NEW', '0', ''],
            ['US','MSFT','100','75.9', '75.9', 'STOP_LIMIT', 'DAY', 'LONG', 'CLOSE', 'PARTIAL_FILLED', '50', '76'],
            ['US','MSFT','100','', '-5', 'TRAIL_STOP_MARKET', 'AT_CROSS', 'LONG', 'CLOSE', 'CANCELLED', '0', '0'],
        ];
        odrData.forEach((odr)=>{
            let odrItem = {
                account: odrList.account? odrList.account : '',
                order_id: (odrList.order_list.length+1).toString(),
                client_order_id: (odrList.order_list.length+1).toString(),
                market: odr[0],
                symbol: odr[1],
                quantity: odr[2],
                price: odr[3],
                stop_price: odr[4],
                type: odr[5],
                tif: odr[6],
                long_short: odr[7],
                open_close: odr[8],
                status: odr[9],
                filled_quantity: odr[10],
                filled_avg_px: odr[11],
            };
            GrpcMngFix.fixOrder(odrItem);
            odrList.order_list.push(odrItem);
        });
        console.log('\treturn success');
        callback(null, odrList);
    }
});
server.bind('0.0.0.0:9527', grpc.ServerCredentials.createInsecure());
server.start();
