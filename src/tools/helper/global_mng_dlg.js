const {ToolDlg} = require('../tool_dlg');

// The global management dialog
class GlobalMngDlg extends ToolDlg {

    // Get the default title
    static get defaultTitle() { return 'Global Mng'; }
}

ToolDlg.registerDialogClass('GlobalMngDlg', GlobalMngDlg);

module.exports = {
    name: 'GlobalMngDlg',
    GlobalMngDlg: GlobalMngDlg
};
