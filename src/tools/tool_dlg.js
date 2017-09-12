const blessed = require('blessed');
const UIComp = require('./ui_comp')

// The base class of all tool dialogs.
class ToolDlg extends UIComp {

    // Several tool categories, 
    static get CATEGORY_HELPER() { return 'helper' }

    // Register a dialog class by name
    static registerDialogClass(className, cls) {
        if (!ToolDlg.nameRegister.has(className))
            ToolDlg.nameRegister.set(className, cls);
    }
    // Find dialog class by name in the register
    static findDialogClassByName(className) {
        if (ToolDlg.nameRegister.has(className))
            return ToolDlg.nameRegister.get(className);
        return null;
    }
    // Find class name by class
    static findNameByDialogClass(cls) {
        for (let {name, its_cls} of ToolDlg.nameRegister) {
            if (its_cls == cls)
                return name;
        }
        return null;
    }
    // load and register all built-in dialog class
    static loadAllBuiltIn() {
        require ('require-all')({
            dirname: __dirname,
            filter: /.+_dlg\.js$/,
            recursive: true
        });
    }

    /**
     * The contructor.
     * @param {int} id an integer unique id of this dialog.
     * @param {JsonObject} attr attributes to define the behivior.
     */
    constructor(id, prop={}, layout={}) {
        super();
        // id
        checkParam(id, 'int', 'ToolDlg.id');
        if (this.id<=0 || this.id>99999999)
            throw new Error(`ToolDlg.id should be in [1,99999999], but '${id}' is given`);
        this.id = parseInt(id);
        // prop
        checkParam(prop, 'jsonobj', 'ToolDlg.prop');
        let final_prop = Object.assign({
            title: '', // title of this dialog. undefined or empty string means using class defined default title.
            onEscapeKey: 'close', // action when escape key pressed. 'close' is default, 'hide' for hidden.
        }, prop);
        this.prop = json2map(final_prop);
        // create main UI component
        checkParam(layout, 'jsonobj', 'ToolDlg.layout');
        let fianl_layout = Object.assign({
            left: 'center',
            top: 'center'
        }, layout);
        this.ui = this.createUI(fianl_layout);
        // bind escape key for close action
        this.ui.key(['escape'], (ch, key)=>{
            let action = this.prop.get('onEscapeKey');
            if (action=='close') {
                const LayoutMng = require('../layout/layout_mng');
                LayoutMng.singleton.remove(this);
            } else if (action=='hide') {
                this.ui.hide();
            }
        });
    }

    // Get the category of this tool dialog class.
    static get category() { return ToolDlg.CATEGORY_HELPER; }
    // Get the default title of this dialog class.
    static get defaultTitle() { return 'Tool'; }

    // Set dialog title
    set title(t) { this.prop.set('title', t.toString()); }
    // Get dialog title
    get title() {
        if (this.prop.has('title')) {
            if (this.prop.get('title').length>0)
                return `#${this.id} `+this.prop.get('title');
        }
        let cls = ToolDlg.findDialogClassByName(this.constructor.name);
        return `#${this.id} `+cls.defaultTitle;
    }

    /**
     * Create the UI instance.
     * Each dialog class should have its own implementation of this method
     */
    createUI(layout) {
        let attr = Object.assign({
            width: 20, height: 10,
        }, layout);
        return this.CreateFormWindow(this.title, attr);
    }

    // Generate Layout Data for save to file
    generateLayoutData() {
        // This class is base class, can be called with this method.
        return {
            id: this.id,
            className: this.constructor.name,
            prop: map2json(this.prop),
            layout: {
                width: this.ui.width,
                height: this.ui.height,
                left: this.ui.left,
                top: this.ui.top,
                hidden: this.ui.hidden,
            }
        };
    }
}

// The global dialog class register, this maintains a map from class name to class.
ToolDlg.nameRegister = new Map();
ToolDlg.registerDialogClass('ToolDlg', ToolDlg);

module.exports = ToolDlg;
