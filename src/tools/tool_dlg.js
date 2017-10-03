const blessed = require('blessed');
const UIComp = require('./ui_comp')

// The base class of all tool dialogs.
class ToolDlg extends UIComp {

    // Several tool categories, 
    static get CATEGORY_HELPER() { return 'helper' }
    static get CATEGORY_TRADE() { return 'trade' }

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
    // Get the dialog register table
    static get dialogRegisterTable() { 
        return ToolDlg.nameRegister;
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
            //title: '', // title of this dialog. undefined or empty string means using class defined default title.
            _onEscapeKey: 'close', // action when escape key pressed. 'close' is default, 'hide' for hidden.
        }, prop);
        this.prop = json2map(final_prop);
        // create main UI component
        checkParam(layout, 'jsonobj', 'ToolDlg.layout');
        let fianl_layout = Object.assign({
            left: 'center',
            top: 'center'
        }, layout);
        this.ui = this.createUI(fianl_layout);
        this.closeEnsure = null;
        this.propEditor = null;
        // bind escape key for close action
        this.ui.key(['escape'], (ch, key)=>{
            const LayoutMng = require('../layout/layout_mng');
            let action = this.prop.get('_onEscapeKey');
            if (action=='hide') {
                this.ui.hide();
                LayoutMng.singleton.screen.render();
            } else {
                this.showCloseEnsure();
            }
        });
        // bind Ctrl-r key for property editor
        this.ui.key(['C-r'], (ch, key)=>{
            this.showPropertyEditor();
        });
    }

    // Override super destroy()
    destroy() {
        if (null!=this.propEditor) {
            this.propEditor.destroy();
            this.propEditor = null;
        }
        super.destroy();
    }

    // Get the category of this tool dialog class.
    static get category() { return ToolDlg.CATEGORY_HELPER; }
    // Get a brief description for this class.
    static get description() { return 'Base class of all tool dialogs.'; }
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

    // whether this dialog is resizeable. 1 for true, 0 for false.
    resizeable() {
        if (this.prop.has('resizeable')) {
            return parseInt(this.prop.get('resizeable'))? 1:0;
        }
        return 1;
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

    // show a close ensurement
    showCloseEnsure() {
        if (null==this.closeEnsure) {
            this.closeEnsure = this.createEnsure('Sure?', {
                parent: this.ui,
            });
        }
        this.closeEnsure.ask('Are u sure to close?', (yes)=>{
            if (yes) {
                const LayoutMng = require('../layout/layout_mng');
                LayoutMng.singleton.remove(this);
            }
        });
    }

    /**
     * Show the property editor.
     * Initialization of the editor will be done automatically when it is first shown.
     */
    showPropertyEditor() {
        const LayoutMng = require('../layout/layout_mng');
        // create the editor window if not exists
        if (null==this.propEditor) {
            let editor = this.propEditor = this.createFormWindow('Settings Editor #'+this.id, {
                parent: LayoutMng.singleton.uiParent,
                border: 'line',
                top: Math.max(parseInt(LayoutMng.singleton.uiParent.height/2)-20, 1),
                left: 'center',
                width: 35,
                shrink: true,
            });
            editor.compCount = 0;
            editor.comps = new Object();
            this.addPropertyEditorComps();
            let okay = this.createBtn('Okay', {
                parent: editor, 
                right: 14, 
                top: this.propEditor.compCount*2+1, 
                width: 6, height: 1,
            });
            okay.on('press', ()=>{ editor.submit(); });
            editor.on('submit', (data)=>{
                this.propEditor.hide();
                LayoutMng.singleton.screen.render();
                for (let n in data) {
                    if (typeof(data[n])!='string') {
                        delete data[n];
                        continue;
                    }
                    data[n] = data[n].trim();
                }
                bilog("settings submit: "+JSON.stringify(data));
                this.onPropertyEditorSubmit(data);
            });
            let cancel = this.createBtn('Cancel', {
                parent: editor, 
                right: 2, 
                top: this.propEditor.compCount*2+1, 
                width: 8, height: 1,
            });
            cancel.on('press', ()=>{
                this.propEditor.hide();
            });
        }
        // reset values of all fields
        LayoutMng.singleton.screen.render();
        this.resetPropertyEditorData();
        // show up
        this.propEditor.show();
        this.propEditor.focus();
        LayoutMng.singleton.screen.render();
    }
    /**
     * Add components to the property editor.
     * This will add Position and Size property input fields automatically.
     * When you override, remenber to call this super.
     */
    addPropertyEditorComps() {
        // Postion field
        this.addInputFieldToPropertyEditor('Left,Top', '_lt');
        // Size field
        if (this.resizeable())
            this.addInputFieldToPropertyEditor('Width,Height', '_wh');
    }
    /**
     * re-set property editor data. this method is called when editor shows up.
     * This will re-set positin and size field by default.
     * When you override, remenber to call this super.
     */
    resetPropertyEditorData() {
        let positionValue = this.ui.left+','+this.ui.top;
        this.propEditor.comps['_lt'].input.setValue(positionValue);
        if (this.resizeable()) {
            let sizeValue = this.ui.width+','+this.ui.height;
            this.propEditor.comps['_wh'].input.setValue(sizeValue);
        }
    }
    /**
     * when property editor says 'Okay', this method is called with new settings.
     * This will do some window moving or resizing work if needed.
     * When you override, remenber to call this super.
     */
    onPropertyEditorSubmit(data) {
        const LayoutMng = require('../layout/layout_mng');
        for (let n in data) {
            if (n=='_lt') { // for Position
                let good = false;
                let mat = data[n].match(/^(\d+)\,(\d+)$/);
                if (mat) {
                    let l = parseInt(mat[1]);
                    let t = parseInt(mat[2]);
                    if (l>=-this.ui.width+3 
                        && l<LayoutMng.singleton.uiParent.width-2
                        && t>=-this.ui.height+3
                        && t<LayoutMng.singleton.uiParent.height-2) {
                        good = true;
                        this.ui.left = l;
                        this.ui.top = t;
                        LayoutMng.singleton.screen.render();
                    } else {
                        this.showError('Width/Height out of range.');
                        return;
                    }
                }
                if (!good) {
                    this.showError('Invalid position value.');
                    return;
                }
            } else if (n=='_wh') { // for size
                let good = false;
                let mat = data[n].match(/^(\d+)\,(\d+)$/);
                if (mat) {
                    let w = parseInt(mat[1]);
                    let h = parseInt(mat[2]);
                    if (w>5 && w+this.ui.left>3
                        && w<LayoutMng.singleton.uiParent.width 
                        && h>3 && h+this.ui.height>3
                        && h<LayoutMng.singleton.uiParent.height) {
                        good = true;
                        this.ui.width = w;
                        this.ui.height = h;
                        LayoutMng.singleton.screen.render();
                    } else {
                        this.showError('Width/Height out of range');
                        return;
                    }
                }
                if (!good) {
                    this.showError('Invalid size value.');
                    return;
                }
            }
        }
    }
    // helper: add an input field to the property editor. this can be used in addPropertyEditorComps()
    addInputFieldToPropertyEditor(text, name=null) {
        if (null==name)
            name = text.toLowerCase();
        this.propEditor.comps[name] = new Object();
        let uiTxt = this.propEditor.comps[name].txt = this.createStaticText(text, {
            parent: this.propEditor,
            top: this.propEditor.compCount*2+1,
            right: 20,
            height: 1,
        });
        let uiInput = this.propEditor.comps[name].input = this.createInput('', {
            parent: this.propEditor, name: name,
            top: this.propEditor.compCount*2+1,
            left: 14,
            width: 17,
            height: 1,
        });
        ++this.propEditor.compCount;
    }
    // helper: get the value the specified property, and fill into the input field. this can be used in resetPropertyEditorData().
    setInputFieldByProperty(propName, fieldName=null) {
        if (null==fieldName) {
            fieldName = propName;
        }
        if (this.prop.has(propName)) {
            let val = this.prop.get(propName);
            this.propEditor.comps[fieldName].input.setValue(val.toString());
        } else {
            this.propEditor.comps[fieldName].input.setValue('');
        }
    }
}

// The global dialog class register, this maintains a map from class name to class.
ToolDlg.nameRegister = new Map();

module.exports = ToolDlg;
