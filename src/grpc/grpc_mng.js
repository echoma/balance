const grpc = require('grpc');
const protoPath = __dirname;

let _tradeSvcNs = null;
let _tradeClient = null;

class GrpcMng {
    static get tradeSvcNs() {
        if (null==_tradeSvcNs) {
            _tradeSvcNs = grpc.load({
                root: protoPath, 
                file: 'trade_service.proto'
            }).balance;
        }
        return _tradeSvcNs;
    }
    static get tradeClient() {
        if (null==_tradeClient) {
            const serverHost = isEmpty(argv_array().s) ? 'localhost:9527' : argv_array().s;
            _tradeClient = new GrpcMng.tradeSvcNs.Trade(serverHost, grpc.credentials.createInsecure());
        }
        return _tradeClient;
    }
}

module.exports = GrpcMng;