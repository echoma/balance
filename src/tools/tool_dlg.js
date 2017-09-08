// The base class of all tool dialogs.
class ToolDlg {

    // Several tool categories, 
    static get CATEGORY_HELPER() { return 'helper' }

    // Register a dialog class by name
    static registerDialogClass(className, cls) { ToolDlg.nameRegister.set(className, cls); }
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

    // The contructor
    constructor(id) {
        // Each tool dialog instance has an unique id.
        this.id = parseInt(id);
        if (!Number.isInteger(this.id) 
            || this.id<=0 
            || this.id>99999999)
            throw `ToolDlg.id should be in [1,99999999], but '${id}' is given`;
        // Set several properties of this dialog
        this.prop = new Map();
        // The UI component (UI)
        this.ui = this.createUI();
    }

    // Get the category of this tool dialog class.
    static get category() { return ToolDlg.CATEGORY_HELPER; }
    // Get the default title of this dialog class.
    static get defaultTitle() { return 'Tool'; }

    // Create the UI instance
    createUI() {
        let blessed = require('blessed');
        return blessed.box({
            left: 'center', height: 'center',
            width: 20, height: 10,
            label: this.title,
            content: this.title,
            border:'line', draggable: true,
            style: this.UIStyle
        });
    }

    // Get UI style settings of the specified dialog.
    get UIStyle() {
        return {
            fg: 'white', bg: 'magenta',
            border: { fg: '#f0f0f0' },
            hover: { bg: 'green' }
        };
    }

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
}

// The global dialog class register, this maintains a map from class name to class.
ToolDlg.nameRegister = new Map();
ToolDlg.registerDialogClass('ToolDlg', ToolDlg);

module.exports = {
    name: 'ToolDlg',
    ToolDlg: ToolDlg
};
