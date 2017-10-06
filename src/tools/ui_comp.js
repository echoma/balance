const blessed = require('blessed');
const contrib = require('blessed-contrib');

// Any UI component should extend this class
class UIComp {
    
    // The contructor
    constructor() {
        // The main ui component
        this.ui = null;
        // properties of this component
        this.prop = new Map();
    }

    // Destroy this component
    destroy() {
        if (this.ui) {
            this.ui.destroy();
        }
        this.ui = null;
    }

    // Append this dialog to the specified UI container
    appendTo(container) { container.append(this.ui); }

    // Get the UI style of this dialog
    get UIStyleWindow() {
        return {
            fg: 'black', bg: 'blue',
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
    // Get the UI style of radio button
    get UIStyleRadio() {
        return {
            fg: 'black', bg: 'blue',
            border: { fg: 'white' },
            focus: { fg: 'white', bg: 'red' },
        }
    }
    // Get the UI style of a set of radio buttons
    get UIStyleRadioSet() {
        return {
            fg: 'white', bg: 'blue',
            border: { fg: 'white', bg: 'blue' }
        }
    }
    // Get the UI style title tags of radio-set
    UiStyleRadioSetTitle(title) {
        return `{black-fg,blue-bg}${title}{/black-fg,blue-bg}`
    }
    // Get the UI style of selection button
    get UIStyleSelectBtn() {
        return {
            fg: 'black', bg: 'cyan',
            border: { fg: 'white' },
            focus: { fg: 'white', bg: 'red' },
        }
    }
    // Get the UI style of selection list
    get UIStyleSelectList() {
        return {
            fg: 'white', bg: 'black',
            border: { fg: 'white' },
            focus: { fg: 'white', bg: 'red' },
            item: {fg: 'white', bg: 'black'},
            selected: {fg: 'black', bg: 'cyan', bold: true}
        }
    }
    // Get the UI style of tables
    get UIStyleTable() {
        return {
            fg: 'black', bg: 'blue',
            bold: true,
            border: { type: 'line', fg: 'black', bg: 'blue'},
        }
    }
    // Get the UI style title tags of table
    UiStyleTableTitle(title) {
        return `{black-fg,blue-bg,bold}${title}{/black-fg,blue-bg,bold}`
    }
    // Get the UI style of records list in the tables
    get UIStyleTableRecords() {
        return {
            fg: 'black', bg: 'blue',
            focus: { fg: 'white', bg: 'blue' },
            item: {fg: 'black', bg: 'blue'},
            selected: {fg: 'black', bg: 'cyan'},
            scrollbar: {fg: 'white', bg: 'black'}
        }
    }

    /**
     * Create a window which has a form inside.
     * @param {String} txt the title of this window.
     * @param {JsonObject} attr the attribute of this window. if not given, the default attribute will be used (position=0,0, size=shrink)
     */
    createFormWindow(title, attr={}) {
        /*let winAttr = Object.assign({
            left: 'center', top: 'center',
            label: title, border:'line',
            keys: true, mouse: true,
            draggable: true, 
            style: this.UIStyleWindow
        }, attr);
        let box = blessed.box(winAttr);
        let formAttr = Object.assign({
            keys: true, mouse: true,
            draggable: true, 
            style: this.UIStyleWindow
        }, attr, {
            parent: box,
            left: 0, top: 0,
            width: '100%-2', height: '100%-2',
            border: undefined, mouse: true, keys:true,
            draggable: false, 
        });
        box.insideForm = blessed.form(formAttr);
        return box;*/
        let finalAttr = Object.assign({
            left: 'center', top: 'center',
            label: title, border:'line',
            keys: true, mouse: true,
            draggable: true, 
            style: this.UIStyleWindow
        }, attr);
        let box = blessed.form(finalAttr);
        box.insideForm = box;
        return box;
    }

    // Same as above, but form is the window
    createWindow(title, attr={}) {
        let finalAttr = Object.assign({
            left: 'center', top: 'center',
            label: title, border:'line',
            keys: true, mouse: true,
            draggable: true, 
            style: this.UIStyleWindow
        }, attr);
        return blessed.box(finalAttr);
    }

    /**
     * Create a button with the specified text using specified attribute.
     * @param {String} txt the text of this button.
     * @param {JsonObject} attr the attribute of this button. if not given, the default attribute will be used (position=0,0, size=shrink)
     */
    createBtn(txt, attr={}) {
        let finalAttr = Object.assign({
            content: txt, align: 'center',
            mouse: true, keys: true,
            shrink: true, name: txt.toLowerCase(),
            padding: {left:1, right:1},
            style: this.UIStyleBtn
        }, attr);
        return blessed.button(finalAttr);
    }

    createPrompt(parent, title = 'Prompt') {
        let BalPrompt = require('./widget/bal_prompt');
        return new BalPrompt(parent, title);
    }

    createInput(txt, attr={}) {
        let finalAttr = Object.assign({
            value: txt, //mouse: true,
            keys: true, //vi: true,
            inputOnFocus: true,
            style: this.UIStyleInput
        }, attr);
        return blessed.textbox(finalAttr);
    }

    /**
     * create a single line of text
     * @param {String} txt the text
     */
    createStaticText(txt, attr={}) {
        let finalAttr = Object.assign({
            content: txt, shrink:true,
            style: this.UIStyleStaticText
        }, attr);
        return blessed.text(finalAttr);
    }

    showMsg(txt, time=3, attr={}) {
        return UIComp.showMsg(txt, time, attr);
    }
    showError(txt, time=3, attr={}) {
        return UIComp.showError(txt, time, attr);
    }
    static showMsg(txt, time=3, attr={}) {
        const LayoutMng = require('../layout/layout_mng');
        let finalAttr = Object.assign({
            left: 'center', top: 3,
            shrink: true, border: 'line',
            padding: {left:2, right:2},
            style: UIComp.UIStyleMsg,
            parent: LayoutMng.singleton.uiParent
        }, attr);
        let msgbox = new blessed.message(finalAttr);
        msgbox.display(txt, time, ()=>{
            msgbox.destroy();
        })
        return msgbox;
    }
    static showError(txt, time=3, attr={}) {
        const LayoutMng = require('../layout/layout_mng');
        let finalAttr = Object.assign({
            left: 'center', top: 3,
            shrink: true, border: 'line',
            padding: {left:2, right:2},
            style: UIComp.UIStyleError,
            parent: LayoutMng.singleton.uiParent
        }, attr);
        let msgbox = new blessed.message(finalAttr);
        msgbox.display(txt, time, ()=>{
            msgbox.destroy();
        })
        return msgbox;
    }

    createRadio(txt, attr={}) {
        let finalAttr = Object.assign({
            content: txt, align: 'center',
            mouse: true, keys: true,
            shrink: true, 
            padding: {left:1, right:1},
            style: this.UIStyleRadio
        }, attr);
        return blessed.radiobutton(finalAttr);
    }
    createRadioSet(title, attr={}) {
        let finalAttr = Object.assign({
            label: this.UiStyleRadioSetTitle(title), border:'line',
            keys: true, mouse: true,
            shrink: true, tags: true,
            style: this.UIStyleRadioSet
        }, attr);
        return blessed.radioset(finalAttr);
    }

    /**
     * Create an selection list. it's shown as a button at first.
     * When you press it, it will pop-up a list in which you can select items.
     * @param {Map} optionMap (optionValue=>presentString) pairs shown in the list. optionValue is the value of each option, presentString is shown in the list item.
     * @param {any} defaultOption the vlaue of default option. If null, the first option in optionMap will be used.
     * @param {jsonObject} buttonAttr the attribute when create the button.
     * @param {jsonObject} listAttr the attribute when create the list.
     */
    createSelect(optionMap, defaultOption=null, buttonAttr={}, listAttr={}) {
        const LayoutMng = require('../layout/layout_mng');
        // decide the default option value and present string.
        if (optionMap.size<=0)
            throw new Error('At least one option should be given for a selection component');
        let defaultValue = null, defaultString = null, defaultIdx = 0;
        for ([defaultValue, defaultString] of optionMap) {
            if (null==defaultOption) {
                break;
            } else if (defaultOption==defaultValue) {
                break;
            }
            ++defaultIdx;
        }
        // create the button
        let btnName = buttonAttr.name;
        delete buttonAttr.name;
        let finalBtnAttr = Object.assign({
            content: '> '+defaultString, align: 'center',
            mouse: true, keys: true,
            shrink: true, height: 1,
            padding: {left:1, right:1},
            style: this.UIStyleSelectBtn
        }, buttonAttr);
        let btn = blessed.button(finalBtnAttr);
        // create a hidden input to hold the value this selection component
        btn.valHolder = blessed.textbox({
            parent: buttonAttr.parent,
            value: defaultValue,
            hidden: true, name: btnName
        });
        // generate list items. calculate the max length of presentStr.
        let popupListWidth = 0;
        btn.listItems = [];
        for (let [val, presentStr] of optionMap) {
            btn.listItems.push({val:val, str:presentStr});
            popupListWidth = Math.max(popupListWidth, presentStr.length);
        }
        // create the list
        popupListWidth = Math.min(40, popupListWidth+3);
        let popupListHeight = Math.min(10, optionMap.size+2);
        let finalListAttr = Object.assign({
            items: btn.listItems.map((elem)=>{
                return elem.str
            }),
            mouse: true, keys: true,
            width: popupListWidth,
            height: popupListHeight,
            shrink: true, hidden:true,
            border: 'line',
            style: this.UIStyleSelectList,
        }, listAttr, {
            parent: LayoutMng.singleton.uiParent
        });
        btn.popupList = blessed.list(finalListAttr);
        btn.popupList.select(defaultIdx);
        btn.selIdx = defaultIdx;
        btn.popupList.on('blur', ()=>{
            setTimeout(()=>{ btn.popupList.hide(); }, 100);
        });
        // button press event
        btn.on('press', ()=>{
            if (btn.popupList.visible) {
                btn.popupList.hide();
            } else {
                btn.popupList.show();
                btn.popupList.top = btn.atop + 1;
                btn.popupList.left = btn.aleft;
                btn.popupList.setFront();
                btn.popupList.focus();
            }
            LayoutMng.singleton.screen.render();
        });
        // list event
        btn.popupList.on('action', ()=>{
            btn.popupList.hide();
            LayoutMng.singleton.screen.render();
        });
        btn.popupList.on('select', (obj,idx)=>{
            btn.updateOnIdx(idx);
        });
        // list method
        btn.selByVal=function(val) {
            //bilog(`searching for ${val} in ${JSON.stringify(btn.listItems)}`);
            for (let idx=0; idx<btn.listItems.length; ++idx) {
                if (btn.listItems[idx].val==val) {
                    btn.popupList.select(idx);
                    //bilog(`  select idx ${i} for ${val}`);
                    btn.updateOnIdx(idx);
                    return;
                }
            }
        }
        btn.updateOnIdx=function(idx) {
            btn.selIdx = idx;
            let val = btn.listItems[idx].val;
            let presentStr = btn.listItems[idx].str;
            let matches = presentStr.match(/\((.+)\)$/);
            if (matches)
                presentStr = matches[1];
            btn.valHolder.setValue(val.toString());
            btn.setContent('> '+presentStr);
            LayoutMng.singleton.screen.render();
        }
        return btn;
    }

    /**
     * Create an table.
     * @param {Object} tableOptions see BalTable constructor for more detail.
     * @param {Object} boxOptions same as above.
     * @param {Object} listOptions same as above.
     */
    createTable(tableOptions, boxOptions=null, listOptions=null) {
        //box options
        if (!isEmpty(boxOptions.label))
            boxOptions.label = this.UiStyleTableTitle(boxOptions.label);
        let finalBoxOpt = Object.assign(
            {
                mouse: false, keys: false, 
                tags: true,
                border: boxOptions.label? 'line':undefined,
                style: this.UIStyleTable,
            }, boxOptions
        );
        // list options
        let finalListOpt = Object.assign(
            {
                mouse: true, keys: true, 
                tags: false, 
                style: this.UIStyleTableRecords,
            }, listOptions
        );
        // create table
        let BalTable = require('./widget/bal_table');
        return new BalTable(tableOptions, finalBoxOpt, finalListOpt);
    }

    /**
     * create a ensure box
     */
    createEnsure(title, attr=null) {
        let BalEnsure = require('./widget/bal_ensure');
        let finalAttr = Object.assign(
            {
                border: 'line',
                top: 4, left: 'center',
                width: 30, height: 7,
                //style: this.UIStyleWindow,
            }, attr
        );
        return new BalEnsure(title, finalAttr);
    }
}

module.exports = UIComp;