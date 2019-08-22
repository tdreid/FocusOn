function ItemViewModel(itemName = 'New Item') {
    const thisItem = this;

    thisItem.itemName = ko.observable(itemName);
    thisItem.editMode = ko.observable(false);

    thisItem.toggleEditMode = () => thisItem.editMode(!thisItem.editMode());
}

function ExtensionViewModel(data = null) {
    const self = this;

    self.list = ko.observableArray([]);
    self.newItem = ko.observable('');

    self.addItem = () => {
        if (self.newItem() !== ''){
            self.list.push(new ItemViewModel(self.newItem()));
            self.newItem('');            
        }
    };

    self.TextInputKeyPress = (data, event) => {
        event.keyCode === 13 && self.addItem();
        return true;
    };
}

function applySecureBindings() {
    const options = {
        attribute: 'data-bind',
        globals: window,
        bindings: ko.bindingHandlers,
        noVirtualElements: false
    };
    chrome.storage.sync.get({ storedData: {} }, data => {
        ko.bindingProvider.instance = new ko.secureBindingsProvider(options);
        ko.applyBindings(new ExtensionViewModel(data));
    });    
}

document.addEventListener('DOMContentLoaded', applySecureBindings);