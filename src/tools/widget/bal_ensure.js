const blessed = require('blessed');
const UIComp = require('../ui_comp');
const LayoutMng = require('../../layout/layout_mng');

// blessed官方的Question有bug，所以自己写了一个用于确认场景的。
class BalEnsure extends UIComp {
    constructor(title = '', attr=null) {
        super();
        checkParam(title, 'string', 'BalEnsure.title');
        this.prop.set('title', title);
        this.attr = attr;
        this.ui = this.createUI();
    }

    createUI() {
        let dlgAttr = Object.assign({
            hidden: true
        }, this.attr);
        let dlg = this.createWindow(this.prop.get('title'), dlgAttr);
        this._ = new Object();
        this._.question = this.createStaticText('', {
            parent: dlg,
            left: 2, right: 2, top:1, height: 1
        });
        this._.okay = this.createBtn('Okay', {
            parent: dlg, 
            right: 14, top: 3, 
            width: 6, height: 1,
        });
        this._.okay.on('press', ()=>{
            this.done(true);
        });
        this._.cancel = this.createBtn('Cancel', {
            parent: dlg, 
            right: 2, top: 3, 
            width: 8, height: 1,
        });
        this._.cancel.on('press', ()=>{
            this.done(false);
        });
        return dlg;
    }

    ask(question, callback) {
        this._.question.setContent(question);
        this._.callback = callback;
        this._.cancel.focus();
        this.ui.setFront();
        this.ui.show();
        LayoutMng.singleton.screen.render();
    }

    done(ok) {
        this._.callback(ok);
        this.ui.hide();
        LayoutMng.singleton.screen.render();
    }
}

module.exports = BalEnsure;