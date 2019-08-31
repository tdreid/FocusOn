ko.extenders.preventBlank = function(target, defaultValue) {
    
    //create a writable computed observable to intercept writes to our observable
    const result = ko.pureComputed({

        //always return the original observables value
        read: target,  
        write: function(newValue) {
            if(newValue.toString() === ''){
                target(defaultValue.toString());
            } else {
                target(newValue.toString());
            }
        }
    }).extend({ notify: 'always' });
    result(target());
    return result;
};
