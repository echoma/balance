const blessed = require('blessed');
const UIComp = require('../ui_comp')
const LayoutMng = require('../../layout/layout_mng');

// blessed官方的promp有bug，所以自己写了一个。
class BalPrompt extends UIComp {
    constructor(parent, title = '') {
        super();
        checkParam(title, 'string', 'BalPrompt.title');
        this.prop.set('title', title);
        this.ui = this.createUI();
        this.appendTo(parent);
    }

    createUI() {
        let dlg = this.createWindow(this.prop.get('title'), {
            width: 'half', height: 9,
            hidden: true
        });
        this._ = new Object();
        this._.input = this.createInput('', {
            parent: dlg,
            left: 2, right: 2, 
            top: 3, height: 1
        });
        this._.input.on('submit', (val)=>{
            this.done(true, val);
        });
        this._.question = this.createStaticText('', {
            parent: dlg,
            left: 2, right: 2, top:1, height: 1
        });
        this._.okay = this.createBtn('Okay', {
            parent: dlg, 
            right: 14, top: 5, 
            width: 6, height: 1,
        });
        this._.okay.on('press', ()=>{
            this.done(true, this._.input.getContent());
        });
        this._.cancel = this.createBtn('Cancel', {
            parent: dlg, 
            right: 2, top: 5, 
            width: 8, height: 1,
        });
        this._.cancel.on('press', ()=>{
            this.done(false, null);
        });
        return dlg;
    }

    prompt(question, initialValue, callback) {
        this._.question.setContent(question);
        if (null!=initialValue)
            this._.input.setValue(initialValue.toString());
        this._.input.focus();
        this._.callback = callback;
        this.ui.setFront();
        this.ui.show();
        LayoutMng.singleton.screen.render();
    }

    done(ok, val) {
        this._.callback(ok, val);
        this.ui.hide();
        LayoutMng.singleton.screen.render();
    }
}

module.exports = BalPrompt;