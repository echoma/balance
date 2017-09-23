const grpc = require('grpc');
const GrpcMng = require('./grpc_mng');

class GrpcEnumFix {
    static fixOrder(order) {
        const balanceNs = GrpcMng.tradeSvcNs;
        if ('string'==typeof(order.market))
            order.market = balanceNs.EnumMarket[order.market];
        if ('string'==typeof(order.type))
            order.type = balanceNs.Order.EnumType[order.type];
        if ('string'==typeof(order.tif))
            order.tif = balanceNs.Order.EnumTif[order.tif];
        if ('string'==typeof(order.long_short))
            order.long_short = balanceNs.EnumLongShort[order.long_short];
        if ('string'==typeof(order.status))
            order.status = balanceNs.Order.EnumStatus[order.status];
    }
    static fixOrderNewSingleRequest(onsr) {
        const balanceNs = GrpcMng.tradeSvcNs;
        if (null!=onsr.order)
            GrpcEnumFix.fixOrder(onsr.order);
        if ('string'==typeof(onsr.open_close))
            onsr.open_close = balanceNs.Order.EnumStatus[onsr.open_close];
    }
    static fixCashPosition(cp) {
        const balanceNs = GrpcMng.tradeSvcNs;
        if ('string'==typeof(cp.market))
            cp.market = balanceNs.EnumMarket[cp.market];
        if ('string'==typeof(cp.long_short))
            cp.long_short = balanceNs.EnumLongShort[cp.long_short];
    }
    static fixStockPosition(sp) {
        const balanceNs = GrpcMng.tradeSvcNs;
        if ('string'==typeof(sp.market))
            sp.market = balanceNs.EnumMarket[sp.market];
        if ('string'==typeof(sp.long_short))
            sp.long_short = balanceNs.EnumLongShort[sp.long_short];
    }
    static fixAccountAsset(aa) {
        const balanceNs = GrpcMng.tradeSvcNs;
        if ('string'==typeof(aa.market))
            aa.market = balanceNs.EnumMarket[aa.market];
        if (Array.isArray(aa.cash_positions)) {
            for (let idx in aa.cash_positions) {
                let cp = aa.cash_positions[idx];
                GrpcEnumFix.fixCashPosition(cp);
                aa.cash_positions[idx] = cp;
            }
        }
        if (Array.isArray(aa.stock_positions)) {
            for (let idx in aa.stock_positions) {
                let sp = aa.stock_positions[idx];
                GrpcEnumFix.fixStockPosition(sp);
                aa.stock_positions[idx] = sp;
            }
        }
    }
}

module.exports = GrpcEnumFix;