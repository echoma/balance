// color theme settings
class Theme {

    static get singleton() { return Theme._singleton; }
    static set singleton(s) { throw new Error('Theme singleton can not be set'); }
    
    // The contructor
    constructor() {
        Theme._singleton = this;
        this.style = {};
    }

    init(themeName) {
        const Loader = require('./loader');
        const l = new Loader();
        l.load(themeName);
        Object.assign(this.style, l.colorComp);
        this.regularKeyName(this.style);
        //console.log(this.style.button); throw new Error('eee');
    }

    regularKeyName(obj) {
        for (let key in obj) {
            if (key=='fore') {
                obj['fg'] = obj[key];
                delete obj[key];
            } else if(key=='back') {
                obj['bg'] = obj[key];
                delete obj[key];
            } else if('object'==typeof(obj[key])) {
                this.regularKeyName(obj[key]);
            }
        }
    }

    // Get the UI style of this dialog
    get styleWindow() { return Object.assign({}, this.style.window); }
    // Get the UI style of buttons in this dialog
    get styleBtn() { return Object.assign({}, this.style.button); }
    // Get the UI Style of single line text input
    get styleInput() { return Object.assign({}, this.style.input); }
    // Get the UI Style of single line of static text
    get styleStaticText() { return Object.assign({}, this.style.common); }
    // Get the UI Style of message text
    get styleMsg() { return Object.assign({}, this.style.msg); }
    // Get the UI Style of error text
    get styleError() { return Object.assign({}, this.style.error); }
    // Get the UI style of radio button
    get styleRadio() { return Object.assign({}, this.style.common); }
    // Get the UI style of a set of radio buttons
    get styleRadioSet() { return Object.assign({}, this.style.common); }
    // Get the UI style title tags of radio-set
    colorRadioSetTitle(title) {
        return `{black-fg,blue-bg}${title}{/black-fg,blue-bg}`
    }
    // Get the UI style of selection button
    get styleSelectBtn() { return Object.assign({}, this.style.comboBox.button); }
    // Get the UI style of selection list
    get styleSelectList() { return Object.assign({}, this.style.comboBox.listItem); }
    // Get the UI style of tables
    get styleTable() { return Object.assign({}, this.style.table.header); }
    // Get the UI style title tags of table
    colorTableTitle(title) {
        return `{black-fg,blue-bg,bold}${title}{/black-fg,blue-bg,bold}`
    }
    // Get the UI style of records list in the tables
    get styleTableRecords() { 
        let ret = Object.assign({}, this.style.table.item);
        ret.scrollbar = Object.assign({}, this.style.table.scrollbar);
        return ret;
    }
}

Theme._singleton = null;

module.exports = Theme;