const ToolDlg = require('../tool_dlg');
const LayoutMng = require('../../layout/layout_mng');

// The global management dialog
class GlobalMngDlg extends ToolDlg {

    static get singleton() { return GlobalMngDlg._singleton; }
    static set singleton(s) { throw new Error('GlobalMngDlg singleton can not be set'); }

    // Get the default title
    static get defaultTitle() { return 'Global Mng'; }

    constructor(id, prop={}, layout={}) {
        prop.onEscapeKey='hide';
        super(id, prop, layout);
        GlobalMngDlg._singleton = this;
        LayoutMng.singleton.screen.key(['C-g'], (ch, key)=>{
            this.ui.setFront();
            LayoutMng.singleton.screen.render();
        });
    }

    // Create the UI instance
    createUI(layout) {
        const blessed = require('blessed');
        // main dialog
        let attr = Object.assign(layout, {
            width: 26, height: 10,
        });
        let dlg = this.createWindow(this.title, attr);
        // button: save layout
        this.uiWidgets.btn_save_layout = this.createBtn('Save layout', {
            parent: dlg, 
            left:2, top:1,
        });
        this.uiWidgets.btn_save_layout.on('press', ()=>{
            this.uiWidgets.prompt_save_layout.prompt(
                'File path-name in which you wanna save it.',
                LayoutMng.singleton.layoutFilePath, 
                (ok, val)=>{
                    setTimeout(()=>{this.uiWidgets.btn_save_layout.focus();},50);
                    if (ok)
                    {
                        if (val.length<=0)
                        {
                            this.showError('an empty path-name is given!');
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
        // button: show order act dialog
        this.uiWidgets.btn_order_act = this.createBtn('Order Input', {
            parent: dlg, 
            left:2, top:3,
        });
        this.uiWidgets.btn_order_act.on('press', ()=>{
            let cls = ToolDlg.findDialogClassByName('OrderActDlg');
            LayoutMng.singleton.add(cls);
        });
        return dlg;
    }
}

ToolDlg.registerDialogClass('GlobalMngDlg', GlobalMngDlg);
GlobalMngDlg._singleton = null;

module.exports = GlobalMngDlg;