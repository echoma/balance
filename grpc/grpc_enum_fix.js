const grpc = require('grpc');
const GrpcMng = require('./grpc_mng');

/**
 * GRPC的node版本里有个长期存在的问题：对于枚举类型，用户填写pb字段时候使用整数枚举值（通常是1\2\3这样的整数），但是rpc收到的响应里，对应字段都是字符串取值。为了方便使用，下面这些fixXXXX的函数可以把对象里的字符串取值转换成整数枚举值。
 * 同时，还需要nameXXXX函数将整数枚举值转为字符串。
 */
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
        if ('string'==typeof(order.open_close))
            order.open_close = balanceNs.EnumOpenClose[order.open_close];
        if ('string'==typeof(order.status))
            order.status = balanceNs.Order.EnumStatus[order.status];
    }
    static __getNameInEnum(enumType, enumValue) {
        for (let n in enumType) {
            if (enumType[n]==enumValue)
                return n;
        }
        return '';
    }
    static nameOrder(order) {
        const balanceNs = GrpcMng.tradeSvcNs;
        if (Number.isInteger(order.market))
            order.market = GrpcEnumFix.__getNameInEnum(balanceNs.EnumMarket, order.market);
        if (Number.isInteger(order.type))
            order.type = GrpcEnumFix.__getNameInEnum(balanceNs.Order.EnumType, order.type);
        if (Number.isInteger(order.tif))
            order.tif = GrpcEnumFix.__getNameInEnum(balanceNs.Order.EnumTif, order.tif);
        if (Number.isInteger(order.long_short))
            order.long_short = GrpcEnumFix.__getNameInEnum(balanceNs.EnumLongShort, order.long_short);
        if (Number.isInteger(order.open_close))
            order.open_close = GrpcEnumFix.__getNameInEnum(balanceNs.EnumOpenClose, order.open_close);
        if (Number.isInteger(order.status))
            order.status = GrpcEnumFix.__getNameInEnum(balanceNs.Order.EnumStatus, order.status);
    }
    static fixOrderNewSingleRequest(onsr) {
        GrpcEnumFix.fixOrder(onsr.order);
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
    static fixAccountAssetRequest(aar) {
        if ('string'==typeof(aar.market))
            aar.market = balanceNs.EnumMarket[aar.market];
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
    static fixAccountOrderListRequest(aolr) {
        const balanceNs = GrpcMng.tradeSvcNs;
        if ('string'==typeof(aolr.market))
            aolr.market = balanceNs.EnumMarket[aolr.market];
    }
    static fixAccountOrderList(aol) {
        const balanceNs = GrpcMng.tradeSvcNs;
        if ('string'==typeof(aol.market))
            aol.market = balanceNs.EnumMarket[aol.market];
        aol.order_list.forEach((o)=>{
            GrpcEnumFix.fixOrder(o);
        });
    }
}

module.exports = GrpcEnumFix;