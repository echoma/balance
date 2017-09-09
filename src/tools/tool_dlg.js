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

    // The contructor
    constructor(id) {
        super();
        // Each tool dialog instance has an unique id.
        this.id = parseInt(id);
        if (!Number.isInteger(this.id) 
            || this.id<=0 
            || this.id>99999999)
            throw new Error(`ToolDlg.id should be in [1,99999999], but '${id}' is given`);
        // The main UI component
        this.ui = this.createUI();
        // Bind escape key for close action
        this.ui.key(['escape'], (ch, key)=>{
            const LayoutMng = require('../layout/layout_mng');
            LayoutMng.singleton.remove(this);
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
        if (!this.prop.has('title'))
        {
            let cls = ToolDlg.findDialogClassByName(this.constructor.name);
            return cls.defaultTitle;
        }
        return this.prop.get('title');
    }

    /**
     * Create the UI instance.
     * Each dialog class should have its own implementation of this method
     */
    createUI() {
        return this.CreateWindow(this.title, {
            width: 20, height: 10,
        });
    }

    // Generate Layout Data for save to file
    generateLayoutData() {
        // This class is base class, can be called with this method.
        return {
            id: this.id,
            className: this.constructor.name,
            prop: [...this.prop],
            layout: {
                width: this.ui.width,
                height: this.ui.height,
                left: this.ui.left,
                top: this.ui.top,
            }
        };
    }
}

// The global dialog class register, this maintains a map from class name to class.
ToolDlg.nameRegister = new Map();
ToolDlg.registerDialogClass('ToolDlg', ToolDlg);

module.exports = ToolDlg;
