const ToolDlg = require('../tool_dlg');
const LayoutMng = require('../../layout/layout_mng');

// The order action dialog
class ToolListDlg extends ToolDlg {

    // Get a brief description for this class.
    static get description() { return 'Shows a list of all available tools.'; }
    // Get the default title
    static get defaultTitle() { return 'Tools List'; }

    constructor(id, prop={}, layout={}) {
        super(id, prop, layout);
    }

    // Create the UI instance
    createUI(layout) {
        const GrpcMng = require('../../grpc/grpc_mng');
        const blessed = require('blessed');
        // main dialog
        let attr = Object.assign({
            width: 90, height: 20,
        }, layout);
        let dlg = this.createFormWindow(this.title, attr);
        let form = dlg.insideForm;
        // layout variables
        this._ = new Object();
        this._.row_w = form.width-2;
        this._.row_top = 0;
        this._.row_step = 2;
        this._.nm = new Object(); // name => form-element mapping
        // dlg table
        let dlgTable = this.createTable({
            parent: form,
            columns: [
                ['Category', 8, 'center'],
                ['Tool Name', 20, 'center'],
                ['Description', 60],
            ],
        }, {
            top:this._.row_top, left: 0, 
            right: 0, bottom: 0,
            //label: 'List'
        });
        this._.row_top += dlgTable.ui.height;
        // generate records
        let dlgs = [];
        for (let [clsName, cls] of ToolDlg.dialogRegisterTable) {
            dlgs.push([cls.category, clsName, cls.description]);
        }
        this._.dlgs = dlgs;
        dlgTable.setRecordSet(dlgs);
        // list selection event
        dlgTable.listComp.on('select', (obj,idx)=>{
            let clsName = this._.dlgs[idx][1];
            if ('GlobalMngDlg'==clsName) {
                this.showError('GlobalMngDlg is a singleton. Ctrl-g to display it.');
                return;
            }
            let cls = ToolDlg.findDialogClassByName(clsName);
            LayoutMng.singleton.add(cls);
        });
        return dlg;
    }
}

ToolDlg.registerDialogClass('ToolListDlg', ToolListDlg);

module.exports = ToolListDlg;