const ToolDlg = require('../tool_dlg');
const LayoutMng = require('../../layout/layout_mng');

// The order action dialog
class AccountOrderDlg extends ToolDlg {
    
    // Get the category of this tool dialog class.
    static get category() { return ToolDlg.CATEGORY_TRADE; }
    // Get a brief description for this class.
    static get description() { return 'Shows orders of an account.'; }
    // Get the default title
    static get defaultTitle() { return 'Account Order'; }

    constructor(id, prop={}, layout={}) {
        if (!prop.hasOwnProperty('auto_refresh'))
            prop.auto_refresh = 0;
        if (!prop.hasOwnProperty('request_interval'))
            prop.request_interval = 1000;
        super(id, prop, layout);
        this.installTimer();
    }

    // Create the UI instance
    createUI(layout) {
        const GrpcMng = require('../../grpc/grpc_mng');
        const blessed = require('blessed');
        // main dialog
        let attr = Object.assign(layout, {
            width: 104, height: 10,
        });
        let dlg = this.createFormWindow(this.title, attr);
        let form = dlg.insideForm;
        // layout variables
        this._ = new Object();
        this._.row_w = form.width-2;
        this._.row_top = 0;
        this._.row_step = 2;
        this._.nm = new Object(); // name => form-element mapping
        // order table
        let orderTable = this._.orderTable = this.createTable({
            parent: form,
            columns: [
                ['ID', 7, 'right'],
                ['Account', 8, 'right'],
                ['L/S-O/C', 6],
                ['Mkt.', 5, 'center'],
                ['Symbol', 10],
                ['Px.', 10, 'right'],
                ['Qty.', 14, 'right'],
                ['Type', 6, 'center'],
                ['Stp.Px', 10, 'right'],
                ['TIF', 5, 'right'],
                ['Status.', 8],
            ],
        }, {
            top:this._.row_top, left: 0, right: 0,
            //height:'100%-2',
            //label: 'Orders'
        });
        this._.row_top += orderTable.ui.height;
        // table select event
        orderTable.listComp.on('select', (obj, idx)=>{
            let odr = this.getOrderByIdx(idx);
            if (odr) {
                let cls = ToolDlg.findDialogClassByName('OrderActDlg');
                let dlg = LayoutMng.singleton.add(cls);
                dlg.setOrder(odr);
            }
        });
        return dlg;
    }

    // an override
    get title() {
        if (this.prop.has('account')) {
            let account = this.prop.get('account').trim();
            if (account.length>0) {
                return `${super.title} @ ${account}`;
            }
        }
        return super.title;
    }

    // 安装定时器，用于定时请求账户数据，并刷新到界面上
    installTimer() {
        this._.lastReqTime = 0;
        this._.lastRspTime = 0;
        this._.timer = setInterval(()=>{
            if (this.prop.has('auto_refresh')) {
                if (0==parseInt(this.prop.get('auto_refresh')))
                    return;
            }
            this.requestData();
        }, 100);
        this.requestData();
    }

    // 发起一次请求，刷新数据
    requestData() {
        const GrpcMng = require('../../grpc/grpc_mng');
        let market = GrpcMng.tradeSvcNs.EnumMarket.ANY;
        let account = '';
        if (this.prop.has('account'))
            account = this.prop.get('account');
        let request_interval = 1000; // 两次请求间的最小时间间隔，默认为1秒
        if (this.prop.has('request_interval'))
            request_interval = parseInt(this.prop.get('request_interval'));
        let stamp = (new Date()).getTime();
        if (stamp - this._.lastReqTime > request_interval // 达到了最小请求间隔
            && (this._.lastRspTime > this._.lastReqTime // 最近一次请求已返回
                || stamp - this._.lastReqTime>30000) // 或 最近一次请求已超时(30秒)
        ) {
            this._.lastReqTime = stamp;
            const req = {};
            req.market = market;
            req.account = account;
            bilog(`accountOrderList sending, request=${JSON.stringify(req)}`);
            GrpcMng.tradeClient.accountOrderList(req, (err, rsp)=>{
                this._.lastRspTime = (new Date()).getTime();
                if (err) {
                    bwlog(`accountOrderList failed, err=${err.toString()}`);
                    this.showError(err.toString());
                } else {
                    const GrpcEnumFix = require('../../grpc/grpc_enum_fix');
                    GrpcEnumFix.fixAccountOrderList(rsp);
                    bilog(`accountOrderList ok, \n\treply=${JSON.stringify(rsp)}`);
                    this.updateOrderMap(rsp);
                    this.showAccountOrder(rsp);
                }
            });
        }
    }

    // 根据响应更新订单ID映射表，该映射表可用于将来的改单、撤单
    updateOrderMap(rsp) {
        this._.odrMap = new Map();
        rsp.order_list.forEach((o)=>{
            this._.odrMap.set(o.order_id, o);
        });
        this._.odrList = rsp.order_list.map((o)=>{
            return Object.assign({},o);
        });
    }
    // 从订单ID映射表中查询订单
    findOrderById(order_id) {
        if (this._.odrMap) {
            if (this._.odrMap.has(order_id)) {
                return this._.odrMap.get(order_id);
            }
        }
        bwlog('Order not found by id '+order_id);
        return null;
    }
    // 根据索引下标得到订单
    getOrderByIdx(idx) {
        if (this._.odrList) {
            if (this._.odrList.length>idx) {
                return this._.odrList[idx];
            }
        }
        bwlog('Cant get order by idx '+idx);
        return null;
    }

    // 展示数据
    showAccountOrder(rsp) {
        const GrpcMng = require('../../grpc/grpc_mng');
        const GrpcEnumFix = require('../../grpc/grpc_enum_fix');
        const ns = GrpcMng.tradeSvcNs;
        const odrRecords = rsp.order_list.map((o)=>{
            let on = Object.assign({}, o);
            GrpcEnumFix.nameOrder(on);
            return [
                on.order_id,
                on.account,
                on.long_short.substr(0,1)+'-'+on.open_close.substr(0,4),
                on.market,
                on.symbol,
                on.price,
                on.filled_quantity+'/'+on.quantity,
                on.type.abbr(6,1),
                on.stop_price,
                on.tif.abbr(5,2),
                on.status.abbr(8,3)
            ];
        });
        this._.orderTable.setRecordSet(odrRecords);
    }

    addPropertyEditorComps() {
        super.addPropertyEditorComps();
        this.addInputFieldToPropertyEditor('Account');
        this.addInputFieldToPropertyEditor('Auto Refresh', 'auto_refresh');
        this.addInputFieldToPropertyEditor('Interval', 'request_interval');
    }

    resetPropertyEditorData() {
        super.resetPropertyEditorData();
        this.setInputFieldByProperty('account');
        this.setInputFieldByProperty('auto_refresh');
        this.setInputFieldByProperty('request_interval');
    }

    onPropertyEditorSubmit(data) {
        super.onPropertyEditorSubmit(data);
        let coreDataChanged = false;
        for(let n in data) {
            let val = data[n];
            if (n=='account') {
                let cur = this.prop.get('account');
                if (cur!=val) {
                    this.prop.set('account', val);
                    this.ui.setLabel(this.title);
                    coreDataChanged = true;
                }
            } else if (n=='request_interval') {
                let itv = parseInt(val);
                if (val<=100) {
                    this.showError('Request interval too small');
                    return;
                }
                this.prop.set('request_interval', itv);
            } else if (n=='auto_refresh') {
                let auto = parseInt(val);
                if (0!=auto && 1!=auto) {
                    this.showError('Auto-refresh can only be 0 or 1');
                    return;
                }
                this.prop.set('auto_refresh', auto);
            }
        }
        if (coreDataChanged) {
            this.requestData();
        }
    }
}

ToolDlg.registerDialogClass('AccountOrderDlg', AccountOrderDlg);

module.exports = AccountOrderDlg;