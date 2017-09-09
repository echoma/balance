const ToolDlg = require('../tool_dlg');
const LayoutMng = require('../../layout/layout_mng');

// The global management dialog
class GlobalMngDlg extends ToolDlg {

    // Get the default title
    static get defaultTitle() { return 'Global Mng'; }

    // Create the UI instance
    createUI() {
        const blessed = require('blessed');
        // main dialog
        let dlg = this.createWindow(this.title, {
            width: 26, height: 10,
        });
        // button: save layout
        this.uiWidgets.btn_save_layout = this.createBtn('Save layout', {
            parent: dlg, 
            left:2, top:1, 
            shrink: true,
        });
        this.uiWidgets.btn_save_layout.on('press', ()=>{
            this.uiWidgets.prompt_save_layout.prompt(
                'File path-name in which you wanna save it.',
                LayoutMng.singleton.layoutFilePath, 
                (ok, val)=>{
                    if (ok)
                    {
                        if (val.length<=0)
                        {
                            this.showMsg('Invalid file path name!');
                            return;
                        }
                        LayoutMng.singleton.save(val);
                    }
                });
        });
        // prompt: where to save
        this.uiWidgets.prompt_save_layout = this.createPrompt(
            LayoutMng.singleton.uiParent,
            'Save Layout'
        );
        return dlg;
    }
}

ToolDlg.registerDialogClass('GlobalMngDlg', GlobalMngDlg);

module.exports = GlobalMngDlg;