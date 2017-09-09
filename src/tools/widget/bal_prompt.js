const blessed = require('blessed');
const UIComp = require('../ui_comp')
const LayoutMng = require('../../layout/layout_mng');

// The blessed's prompt is broker, so I wrote one by myself
class BalPrompt extends UIComp {
    constructor(parent, title = '') {
        super();
        if ('string'!=typeof(title))
            throw new Error(`a string should be given as title, but a '${typeof(title)}' is given.`);
        this.prop.set('title', title);
        this.ui = this.createUI();
        this.appendTo(parent);
    }

    createUI() {
        let win = this.createWindow(this.prop.get('title'), {
            width: 'half', height: 9,
            hidden: true
        });
        this.uiWidgets.input = this.createInput('', {
            parent: win,
            left: 2, right: 2, 
            top: 3, height: 1
        });
        this.uiWidgets.input.on('submit', (val)=>{
            this.done(true, val);
        });
        this.uiWidgets.input.on('cancel', ()=>{
            this.done(false, null);
        });
        this.uiWidgets.question = this.createStaticText('', {
            parent: win,
            left: 2, right: 2, top:1, height: 1
        });
        this.uiWidgets.okay = this.createBtn('Okay', {
            parent: win, 
            right: 14, top: 5, 
            width: 6, height: 1,
        });
        this.uiWidgets.okay.on('press', ()=>{
            this.done(true, this.uiWidgets.input.getContent());
        });
        this.uiWidgets.cancel = this.createBtn('Cancel', {
            parent: win, 
            right: 2, top: 5, 
            width: 8, height: 1,
        });
        this.uiWidgets.cancel.on('press', ()=>{
            this.done(false, null);
        });
        return win;
    }

    prompt(question, initialValue, callback) {
        this.uiWidgets.question.setContent(question);
        this.uiWidgets.input.setContent(initialValue);
        this.uiWidgets.callback = callback;
        this.ui.show();
        this.ui.setFront();
        LayoutMng.singleton.screen.render();
    }

    done(ok, val) {
        this.uiWidgets.callback(ok, val);
        this.ui.hide();
        LayoutMng.singleton.screen.render();
    }
}

module.exports = BalPrompt;