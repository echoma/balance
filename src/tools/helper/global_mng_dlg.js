const ToolDlg = require('../tool_dlg');
const LayoutMng = require('../../layout/layout_mng');

// The global management dialog
class GlobalMngDlg extends ToolDlg {

    static get singleton() { return GlobalMngDlg._singleton; }
    static set singleton(s) { throw new Error('GlobalMngDlg singleton can not be set'); }

    // Get a brief description for this class.
    static get description() { return 'Manage the global settings and dialog layout.'; }
    // Get the default title
    static get defaultTitle() { return 'Global Mng'; }

    constructor(id, prop={}, layout={}) {
        prop.onEscapeKey='hide';
        super(id, prop, layout);
        GlobalMngDlg._singleton = this;
        LayoutMng.singleton.screen.key(['C-g'], (ch, key)=>{
            this.ui.show();
            this.ui.setFront();
            this.ui.focus();
            LayoutMng.singleton.screen.render();
        });
        LayoutMng.singleton.screen.key('C-f', (ch, key)=>{
            this._.prompt_save_layout.prompt(
                'Number of the dialog which you wanna bring to top.',
                '',
                (ok, val)=>{
                    if (ok) {
                        let number = parseInt(val);
                        if (!isEmpty(number)) {
                            LayoutMng.singleton.bringToTop(number);
                        }
                    }
                });
        });
    }

    // Create the UI instance
    createUI(layout) {
        // main dialog
        let attr = Object.assign(layout, {
            width: 26, height: 10,
        });
        let dlg = this.createFormWindow(this.title, attr);
        let form = dlg.insideForm;
        this._ = new Object();
        // button: save layout
        this._.btn_save_layout = this.createBtn('Save layout', {
            parent: form, 
            left:2, top:1,
        });
        this._.btn_save_layout.on('press', ()=>{
            this._.prompt_save_layout.prompt(
                'Path-name of the file where you wanna save it.',
                LayoutMng.singleton.layoutFilePath, 
                (ok, val)=>{
                    setTimeout(()=>{this._.btn_save_layout.focus();},50);
                    if (ok) {
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
        this._.prompt_save_layout = this.createPrompt(
            LayoutMng.singleton.uiParent,
            'Save Layout'
        );
        // button: show order act dialog
        this._.btn_order_act = this.createBtn('Order Input', {
            parent: form, 
            left:2, top:3,
        });
        this._.btn_order_act.on('press', ()=>{
            let cls = ToolDlg.findDialogClassByName('OrderActDlg');
            LayoutMng.singleton.add(cls);
        });
        // prompt: bring specified dialog to front
        this._.prompt_save_layout = this.createPrompt(
            LayoutMng.singleton.uiParent,
            'Bring Dialog To Front'
        );
        // button: account asset dialog
        this._.btn_acc_ast = this.createBtn('Acc. Asset', {
            parent: form, 
            left:2, top:5,
        });
        this._.btn_acc_ast.on('press', ()=>{
            let cls = ToolDlg.findDialogClassByName('AccountAssetDlg');
            LayoutMng.singleton.add(cls);
        });
        // button: tool list
        this._.btn_tool_list = this.createBtn('Tool List', {
            parent: form, 
            left:2, top:7,
        });
        this._.btn_tool_list.on('press', ()=>{
            let cls = ToolDlg.findDialogClassByName('ToolListDlg');
            LayoutMng.singleton.add(cls);
        });
        return dlg;
    }
}

ToolDlg.registerDialogClass('GlobalMngDlg', GlobalMngDlg);
GlobalMngDlg._singleton = null;

module.exports = GlobalMngDlg;