const ToolDlg = require('../tool_dlg');
const LayoutMng = require('../../layout/layout_mng');

// The order action dialog
class AccountOrderDlg extends ToolDlg {
    
    // Get the category of this tool dialog class.
    static get category() { return ToolDlg.CATEGORY_TRADE; }
    // Get a brief description for this class.
    static get description() { return 'Shows a list of orders of an account.'; }
    // Get the default title
    static get defaultTitle() { return 'Account Order'; }

    constructor(id, prop={}, layout={}) {
        super(id, prop, layout);
    }

    // Create the UI instance
    createUI(layout) {
        const GrpcMng = require('../../grpc/grpc_mng');
        const blessed = require('blessed');
        // main dialog
        let attr = Object.assign(layout, {
            width: 72, height: 16,
        });
        let dlg = this.createFormWindow(this.title, attr);
        let form = dlg.insideForm;
        // layout variables
        this._ = new Object();
        this._.row_w = form.width-2;
        this._.row_top = 0;
        this._.row_step = 2;
        this._.nm = new Object(); // name => form-element mapping
        // cash table
        let orderTable = this.createTable({
            parent: form,
            columns: [
                ['ID', 7, 'right'],
                ['Mkt.', 5, 'right'],
                ['Symbol', 10],
                ['L/S', 3, 'center'],
                ['Px.', 14, 'right'],
                ['Stp.Px', 14, 'right'],
                ['TIF', 14, 'right'],
            ],
        }, {
            top:this._.row_top, left: 0, right: 0,
            height:6,
            label: 'Cash'
        });
        this._.row_top += orderTable.ui.height;
        return dlg;
    }
}

ToolDlg.registerDialogClass('AccountOrderDlg', AccountOrderDlg);

module.exports = AccountOrderDlg;