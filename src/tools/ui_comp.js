const blessed = require('blessed');

// Any UI component should extend this class
class UIComp {
    
    // The contructor
    constructor() {
        // The main ui component
        this.ui = null;
        // properties of this component
        this.prop = new Map();
        // ui widget could be referenced by this object
        this.uiWidgets = new Object();
    }

    // Destroy this dialog
    destroy() {
        if (this.ui)
            this.ui.destroy();
        this.ui = null;
    }

    // Append this dialog to the specified UI container
    appendTo(container) { container.append(this.ui); }
    // Remove this dialog from the specified UI container
    removeFrom(container) { container.remove(this.ui); }

    // Get the UI style of this dialog
    get UIStyleWindow() {
        return {
            fg: 'white', bg: 'blue',
            border: { fg: 'blue' },
            hover: { bg: 'green' }
        };
    }
    // Get the UI style of buttons in this dialog
    get UIStyleBtn() {
        return {
            fg: 'white', bg: 'black',
            border: { fg: 'white' },
            focus: { fg: 'white', bg: 'red' },
        }
    }
    // Get the UI Style of single line text input
    get UIStyleInput() {
        return {
            fg: 'white', bg: 'black',
        }
    }
    // Get the UI Style of single line of static text
    get UIStyleStaticText() {
        return {
            fg: 'black',
            bg: 'blue'
        }
    }
    // Get the UI Style of message text
    static get UIStyleMsg() {
        return {
            fg: 'red',
            bg: 'green',
            border: { fg: 'white' },
        }
    }
    // Get the UI Style of error text
    static get UIStyleError() {
        return {
            fg: 'green',
            bg: 'red',
            border: { fg: 'white' },
        }
    }
    // Get the UI style of radio in this dialog
    get UIStyleRadio() {
        return {
            fg: 'black', bg: 'blue',
            border: { fg: 'white' },
            focus: { fg: 'white', bg: 'red' },
        }
    }
    // Get the UI style of radio-set in this dialog
    get UIStyleRadioSet() {
        return {
            fg: 'white', bg: 'blue',
            border: { fg: 'white', bg: 'blue' }
        }
    }
    UiStyleRadioSetTitle(title) {
        return `{black-fg,blue-bg}${title}{/black-fg,blue-bg}`
    }

    /**
     * Create a window with the specified title using specified attribute.
     * @param {String} txt the title of this window.
     * @param {JsonObject} attr the attribute of this window. if not given, the default attribute will be used (position=0,0, size=shrink)
     */
    createWindow(title, attr={}) {
        let final_attr = Object.assign({
            left: 'center', top: 'center',
            label: title, border:'line',
            keys: true, mouse: true,
            draggable: true, 
            style: this.UIStyleWindow
        }, attr);
        return blessed.form(final_attr);
    }

    /**
     * Create a button with the specified text using specified attribute.
     * @param {String} txt the text of this button.
     * @param {JsonObject} attr the attribute of this button. if not given, the default attribute will be used (position=0,0, size=shrink)
     */
    createBtn(txt, attr={}) {
        let final_attr = Object.assign({
            content: txt, align: 'center',
            mouse: true, keys: true,
            shrink: true, name: txt.toLowerCase(),
            padding: {left:1, right:1},
            style: this.UIStyleBtn
        }, attr);
        return blessed.button(final_attr);
    }

    createPrompt(parent, title = 'Prompt') {
        let BalPrompt = require('./widget/bal_prompt');
        return new BalPrompt(parent, title);
    }

    createInput(txt, attr={}) {
        let final_attr = Object.assign({
            value: txt, mouse: true,
            keys: true, vi: true,
            inputOnFocus: true,
            style: this.UIStyleInput
        }, attr);
        return blessed.textbox(final_attr);
    }

    /**
     * create a single line of text
     * @param {String} txt the text
     */
    createStaticText(txt, attr={}) {
        let final_attr = Object.assign({
            content: txt, shrink:true,
            style: this.UIStyleStaticText
        }, attr);
        return blessed.text(final_attr);
    }

    showMsg(txt, time=3, attr={}) {
        return UIComp.showMsg(txt, time, attr);
    }
    static showMsg(txt, time=3, attr={}) {
        const LayoutMng = require('../layout/layout_mng');
        let final_attr = Object.assign({
            left: 'center', top: 3,
            shrink: true, border: 'line',
            padding: {left:2, right:2},
            style: UIComp.UIStyleMsg,
            parent: LayoutMng.singleton.uiParent
        }, attr);
        let msgbox = new blessed.message(final_attr);
        msgbox.display(txt, time, ()=>{
            msgbox.destroy();
        })
        return msgbox;
    }
    static showError(txt, time=3, attr={}) {
        const LayoutMng = require('../layout/layout_mng');
        let final_attr = Object.assign({
            left: 'center', top: 3,
            shrink: true, border: 'line',
            padding: {left:2, right:2},
            style: UIComp.UIStyleError,
            parent: LayoutMng.singleton.uiParent
        }, attr);
        let msgbox = new blessed.message(final_attr);
        msgbox.display(txt, time, ()=>{
            msgbox.destroy();
        })
        return msgbox;
    }

    createRadio(txt, attr={}) {
        let final_attr = Object.assign({
            content: txt, align: 'center',
            mouse: true, keys: true,
            shrink: true, 
            padding: {left:1, right:1},
            style: this.UIStyleRadio
        }, attr);
        return blessed.radiobutton(final_attr);
    }
    createRadioSet(title, attr={}) {
        let final_attr = Object.assign({
            label: this.UiStyleRadioSetTitle(title), border:'line',
            keys: true, mouse: true,
            shrink: true, tags: true,
            style: this.UIStyleRadioSet
        }, attr);
        return blessed.radioset(final_attr);
    }
}

module.exports = UIComp;