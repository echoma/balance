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
    }
});
server.bind('0.0.0.0:9527', grpc.ServerCredentials.createInsecure());
server.start();
