const ToolDlg = require('../tool_dlg');
const LayoutMng = require('../../layout/layout_mng');

// The order action dialog
class AccountAssetDlg extends ToolDlg {
    
    // Get the category of this tool dialog class.
    static get category() { return ToolDlg.CATEGORY_TRADE; }
    // Get the default title
    static get defaultTitle() { return 'Account Asset'; }

    constructor(id, prop={}, layout={}) {
        super(id, prop, layout);
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
        let cashTable = this.createTable({
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
        cashTable.setRecordSet([
            ['ANY','USD','L','9,284,713.00','9,284,713.00','9,284,713.00'],
            ['HK','HKD','L','84,713.00','84,713.00','84,713.00'],
            ['US','USD','L','84,713.00','84,713.00','84,713.00'],
            ['A','HKD','L','84,713.00','84,713.00','84,713.00'],
            ['SGP','HKD','L','84,713.00','84,713.00','84,713.00'],
            ['JP','HKD','L','84,713.00','84,713.00','84,713.00'],
        ]);
        this._.row_top += cashTable.ui.height;
        // stock table
        let stockTable = this.createTable({
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
        stockTable.setRecordSet([
            ['FX','USD/CNY','L','2000','2000','2000','13180'],
            ['US','RHT','L','500','500','500','53150'],
            ['US','MSFT','L','200','100','200','14882'],
            ['US','BABA','S','100','100','100','17814'],
            ['HK','700','L','500','500','500','173000'],
            ['HK','3888','L','100','0','100','18300'],
            ['CHN','2594','L','100','100','100','6232'],
        ]);
        return dlg;
    }
}

ToolDlg.registerDialogClass('AccountAssetDlg', AccountAssetDlg);

module.exports = AccountAssetDlg;