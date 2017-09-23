const ToolDlg = require('../tool_dlg');
const LayoutMng = require('../../layout/layout_mng');

// The order action dialog
class AccountAssetDlg extends ToolDlg {
    
    // Get the category of this tool dialog class.
    static get category() { return ToolDlg.CATEGORY_TRADE; }
    // Get a brief description for this class.
    static get description() { return 'Shows cash and stock positions of an account.'; }
    // Get the default title
    static get defaultTitle() { return 'Account Asset'; }

    constructor(id, prop={}, layout={}) {
        super(id, prop, layout);
        this.installTimer();
    }

    // Create the UI instance
    createUI(layout) {
        const GrpcMng = require('../../grpc/grpc_mng');
        const blessed = require('blessed');
        // main dialog
        let attr = Object.assign(layout, {
            width: 66, height: 16,
        });
        let dlg = this.createFormWindow(this.title, attr);
        let form = dlg.insideForm;
        // layout variables
        this._ = new Object();
        this._.row_w = form.width-2;
        this._.row_top = 0;
        this._.row_step = 2;
        // cash table
        let cashTable = this._.cashTable = this.createTable({
            parent: form,
            columns: [
                ['Mkt.', 5, 'right'],
                ['CCY', 3],
                ['L/S', 3, 'center'],
                ['Balance', 14, 'right'],
                ['Available', 14, 'right'],
                ['Settled', 14, 'right'],
            ],
        }, {
            top:this._.row_top, left: 0, right: 0,
            height:6,
            label: 'Cash'
        });
        this._.row_top += cashTable.ui.height;
        // stock table
        let stockTable = this._.stockTable  = this.createTable({
            parent: form,
            columns: [
                ['Mkt.', 5, 'right'],
                ['Symbol', 10],
                ['L/S', 3, 'center'],
                ['Balance', 9, 'right'],
                ['Available', 9, 'right'],
                ['Settled', 9, 'right'],
                ['Value', 9, 'right'],
            ],
        }, {
            top:this._.row_top, left: 0, right: 0,
            height:8,
            label: 'Stock'
        });
        return dlg;
    }

    // 安装定时器，用于定时请求账户数据，并刷新到界面上
    installTimer() {
        const GrpcMng = require('../../grpc/grpc_mng');
        this._.lastReqTime = 0;
        this._.lastRspTime = 0;
        this._.timer = setInterval(()=>{
            let market = GrpcMng.tradeSvcNs.EnumMarket.ANY;
            let account = '';
            if (this.prop.has('auto_refresh')) {
                if (0==parseInt(this.prop.get('auto_refresh')))
                    return;
            }
            if (this.prop.has('account'))
                account = this.prop.get('account');
            let request_interval = 1000; // 两次请求间的最小时间间隔，默认为1秒
            if (this.prop.has('request_interval'))
                request_interval = this.prop.get('request_interval');
            let stamp = (new Date()).getTime();
            if (stamp - this._.lastReqTime > request_interval // 达到了最小请求间隔
                && (this._.lastRspTime > this._.lastReqTime // 最近一次请求已返回
                    || stamp - this._.lastReqTime>30000) // 或 最近一次请求已超时(30秒)
            ) {
                this._.lastReqTime = stamp;
                const req = {};
                req.market = market;
                req.account = account;
                bilog(`accountAsset sending,\n\trequest=${JSON.stringify(req)}`);
                GrpcMng.tradeClient.accountAsset(req, (err, rsp)=>{
                    this._.lastRspTime = (new Date()).getTime();
                    if (err) {
                        bwlog(`accountAsset failed,\n\terr=${err.toString()}`);
                        this.showError(err.toString());
                    } else {
                        const GrpcEnumFix = require('../../grpc/grpc_enum_fix');
                        GrpcEnumFix.fixAccountAsset(rsp);
                        //bilog(`accountAsset ok, \n\treply=${JSON.stringify(rsp)}`);
                        this.showAccountAsset(rsp);
                    }
                });
            }
        }, 200);
    }

    // 展示数据
    showAccountAsset(aa) {
        const GrpcMng = require('../../grpc/grpc_mng');
        const ns = GrpcMng.tradeSvcNs;
        const cashRecords = aa.cash_positions.map((cp)=>{
            let market = 'ANY';
            if (cp.market==ns.EnumMarket.US) market = 'US';
            if (cp.market==ns.EnumMarket.HK) market = 'HK';
            return [
                market,
                cp.currency,
                cp.long_short==ns.EnumLongShort.LONG? 'L':'S',
                cp.balance,
                cp.available,
                cp.settled
            ];
        });
        this._.cashTable.setRecordSet(cashRecords);
        const stockRecords = aa.stock_positions.map((sp)=>{
            let market = 'ANY';
            if (sp.market==ns.EnumMarket.US) market = 'US';
            if (sp.market==ns.EnumMarket.HK) market = 'HK';
            return [
                market,
                sp.symbol,
                sp.long_short==ns.EnumLongShort.LONG? 'L':'S',
                sp.balance,
                sp.available,
                sp.settled,
                sp.market_value
            ];
        });
        this._.stockTable.setRecordSet(stockRecords);
    }
}

ToolDlg.registerDialogClass('AccountAssetDlg', AccountAssetDlg);

module.exports = AccountAssetDlg;