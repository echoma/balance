// The data layer of layout
class LayoutData {
    constructor(name='Unnamed Layout') {
        this.name = name;
        this.dlgDataList = [];
    }

    serialize() {
        let list = [];
        this.dlgDataList.forEach((layoutDlgData)=>{
            list.push({
                id:layoutDlgData.id,
                className:layoutDlgData.className,
                prop:layoutDlgData.prop,
                layout:layoutDlgData.layout
            });
        });
        return JSON.stringify(list);
    }
}

// The configuration of one dialog in LayoutConfig
class LayoutDlgData {
    /**
     * create new layout dialog data
     * @param {int} id The id of this dialog instance.
     * @param {string} className The class name by which LayoutMng can re-create the instance.
     * @param {jsonObject} prop The properties of this dialog (ToolDlg.prop), such as title.
     * @param {jsonObject} layout The layout data of this dialog, such as size and position.
     */
    constructor(id, className, prop, layout) {
        this.id = id;
        this.className = className;
        this.prop = prop;
        this.layout = layout;
    }
}

module.exports = {
    LayoutData: LayoutData,
    LayoutDlgData: LayoutDlgData
};