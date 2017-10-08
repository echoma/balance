// The data layer of layout
class LayoutData {

    constructor(name='Unnamed Layout',
                savedTime=new Date(),
                dlgDataList=[]) {
        checkParam(name, 'string', 'LayoutData.name');
        let trimed_name = name.trim();
        if (trimed_name.length<=0)
            throw new Error(`an empty string is given as name`);
        this.name = trimed_name;
        this.savedTime = savedTime;
        checkParam(dlgDataList, 'array', 'LayoutData.dlgDataList');
        this.dlgDataList = dlgDataList;
    }

    static serialize(layoutData) {
        let data = {
            name: layoutData.name,
            savedTime: (new Date()).toString(),
            list: []
        };
        layoutData.dlgDataList.forEach((layoutDlgData)=>{
            data.list.push({
                id:layoutDlgData.id,
                className:layoutDlgData.className,
                prop:layoutDlgData.prop,
                layout:layoutDlgData.layout
            });
        });
        return JSON.stringify(data);
    }

    static parse(text) {
        let data = JSON.parse(text);
        return new LayoutData(data.name, 
            new Date(data.savedTime),
            data.list);
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