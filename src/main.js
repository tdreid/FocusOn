function ItemViewModel(item = {}) {
  const thisItem = this;

  thisItem.itemName = ko.observable(item.itemName || 'New Item');
  thisItem.editMode = ko.observable(false);
  thisItem.createdAt = ko.observable(item.createdAt || Date.now());

  thisItem.toggleEditMode = () => thisItem.editMode(!thisItem.editMode());
}

function ExtensionViewModel(data = []) {
  const self = this;

  self.list = ko.observableArray(data);
  self.newItem = ko.observable('');
  self.showItems = ko.observable(5);
  self.sortedList = ko.computed(() =>
    self.list
      .sorted((a, b) => a.createdAt() - b.createdAt())
      .slice(0, self.showItems())
  );

  self.addItem = () => {
    if (self.newItem() !== '') {
      self.list.push(new ItemViewModel({ itemName: self.newItem() }));
      self.newItem('');
      self.save();
    }
  };

  self.save = () =>
    chrome.storage.sync.set(
      { list: self.list().map(item => ko.mapping.toJS(item)) },
      () => console.log(`Saved ${self.list().length} items.`)
    );

  self.clear = () => chrome.storage.sync.clear(() => self.list([]));

  self.removeItem = item => {
    self.list.remove(item);
    self.save();
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
  chrome.storage.sync.get({ list: [] }, data => {
    ko.bindingProvider.instance = new ko.secureBindingsProvider(options);
    ko.applyBindings(
      new ExtensionViewModel(data.list.map(item => new ItemViewModel(item)))
    );
  });
}

document.addEventListener('DOMContentLoaded', applySecureBindings);
