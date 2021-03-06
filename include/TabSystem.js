/**
 * User: anfur_000
 * Date: 6/14/13, 12:11 AM
 *
 *
 */

var Tab = function (caption, cannotClose, /*optional*/ id, extraneous /* in this specific app, this is used for contents*/ ){
    this.caption = caption;
    this.canClose = !cannotClose;
    this.id = id;
    this.extraneous = extraneous;
};

Tab.prototype.rename = function(newName) {
    PersistentStorage.renameSave(this.id, newName);
    // I suppose a more proper way to do this to make this tab system truly independent would be a fired event or callback
};

/**
 * Remember this returns a reference potentially
 * @returns {*}
 */
Tab.prototype.getValue = function() {
    return this.extraneous;
};

/**
 *
 * @param destination
 * @constructor
 */
var TabSystem = function(destination, changeCallback, valueGetterCallback){
    this.activeTab = -1;
    this.$destination = $(destination);

    this.tabs = [];
    this.newTabTab = new Tab("+", true);
    this.changeCallback = changeCallback;
    this.valueGetterCallback = valueGetterCallback;
};

TabSystem.prototype.enumerateTabs = function(){
    return FA(this.tabs);
};

TabSystem.prototype.addTab = function(/*Tab*/ tab, selectIt) {
    this.tabs.push(tab);
    this.selectSomeTab();
};

TabSystem.prototype.addBlankTab = function() {
    this.addTab(new Tab("New Tab",false,null,{}));
};

TabSystem.prototype.closeTab = function(id) {
    this.tabs.splice(id,1);
    this.selectSomeTab();
};

TabSystem.prototype.selectSomeTab = function() {
    this.selectTab(this.tabs.length - 1, false /* I don't understand why you'd ever set this to true*/); //even handles the zero case
};

TabSystem.prototype.getSelectedTabOrNull = function() {
    if (this.activeTab < 0 )
        return null;
    return this.tabs[ this.activeTab ];
}

/**
 *
 * @param id
 * @param discardExisting Whether to store changes to the tab back to the system
 * @returns {*}
 */
TabSystem.prototype.selectTab = function(index, discardExisting){
    // NOTE: Id and Index are different in this function. Not sure if that dependency is important.
    var oldIndex = this.activeTab;
    this.activeTab = index;
    var newVal = null;

    newVal = (this.tabs.hasOwnProperty(index) && this.tabs[index].extraneous);
    if (!discardExisting && this.tabs[oldIndex]) {
        this.valueGetterCallback(this.tabs[oldIndex].getValue());//update by reference
    }
    var result = this.changeCallback(newVal); //update local copy of tab
    return index;
};

/**
 *
 */
TabSystem.prototype.lookupTabIndexById = function(id) {
    var lookup = rekey(this.tabs, "id");
    return lookup[id];
}