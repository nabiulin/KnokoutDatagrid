$(function(){

    /**
     * Grid global settings
     * @type {Object}
     */
    var settings = {
        items: items
    };

    /**
     * Grid model
     * @param item
     * @constructor
     */
    var GridModel = function(item) {
        var self = this;
        self.name = ko.observable(item.name);
        self.sales = ko.observable(item.sales);
        self.price = ko.observable(item.price);
    };

    /**
     * View model
     * @param items initial data
     */
    var GridViewModel = function(items) {
        var self = this;
        self.items = ko.observableArray(items);
        self.order = ko.observable(0);

        /**
         * Search
         * @param key search key
         * @param value search value
         */
        self.search = function(key, value){
            self.items(ko.dependentObservable(function() {
                var query = value.toString().toLowerCase();
                return ko.utils.arrayFilter(settings.items, function(item) {
                    return item[key].toString().toLowerCase().indexOf(query) >= 0;
                });
            }, self));
        };

        /**
         * Sort
         * @param key sort key
         */
        self.sort = function(key) {
            var order = -1,
                o = self.order();
            if (o) {
                order = -1 * o;
            }
            self.order(order);
            self.items.sort(function(a, b) {
                a = a[key] || '';
                b = b[key] || '';
                return a == b ? 0 : (a < b ? order : -1 * order);
            });
        };

        /**
         * Add item to collection
         * @param item new item
         */
        self.add = function(item) {
            self.items.push(new GridModel(item));
        };
    };

    /**
     * Custom handler for sorting
     */
    ko.bindingHandlers.sortable = {
        init: function (element, valueAccessor, allBindings, viewModel) {
            var value = valueAccessor() || {};
            $(element).on('click', function() {
                viewModel.sort(value.key);
            });
        }
    };

    /**
     * Custom handler for search
     */
    ko.bindingHandlers.searchable = {
        init: function (element, valueAccessor, allBindings, viewModel) {
            var $element = $(element);
            var value = valueAccessor() || {};
            $element.on('keyup', function(){
                viewModel.search(value.key, $element.val());
            });
        }
    };

    ko.applyBindings(new GridViewModel(settings.items));
});
