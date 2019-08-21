function ItemViewModel(itemName = 'New Item') {
    const thisItem = this;

    thisItem.itemName = ko.observable(itemName);
}

function ExtensionViewModel(data = null) {
    const self = this;

    self.list = ko.observableArray([]);
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