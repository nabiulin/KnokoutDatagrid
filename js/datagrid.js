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
        var _self = this;
        _self.name = ko.observable(item.name);
        _self.sales = ko.observable(item.sales);
        _self.price = ko.observable(item.price);
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
         * Add item to collection
         * @param item new item
         */
        self.add = function(item) {
            self.items.push(new GridModel(item));
        };

        /**
         * Remove item from collection
         * @param item current item
         */
        self.remove = function(item) {
            self.items.remove(item);
        };
    };

    /**
     * Custom handler for sorting
     */
    ko.bindingHandlers.sortable = {
        init: function (element, valueAccessor, allBindings, viewModel) {
            var $element = $(element),
                order = -1;
            $element.on('click', function(){
                var o = viewModel.order();
                if (o) {
                    order = -1 * o;
                }
                viewModel.order(order);
                var value = valueAccessor() || {};
                viewModel.items.sort(function(a, b) {
                    a = a[value.key] || '';
                    b = b[value.key] || '';
                    return a == b ? 0 : (a < b ? order : -1 * order);
                });
            });
        }
    };

    ko.applyBindings(new GridViewModel(settings.items));
});
