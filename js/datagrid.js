$(function(){

    /**
     * Grid global settings
     * @type {Object}
     */
    var settings = {
        items: items || {},
        pageSize: 15
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
        self.pageSize = settings.pageSize || 5;
        self.currentPage = ko.observable(0);
        self.editableItem = ko.observable();

        /**
         * Make sure that item is editable
         * @param item item
         * @return {Boolean}
         */
        self.isEditable = function(item) {
            return item == self.editableItem();
        };

        /**
         * Pagination
         * @type {*}
         */
        self.itemsOnPage = ko.computed(function() {
            var startIndex = self.pageSize * self.currentPage();
            return self.items.slice(startIndex, startIndex + self.pageSize);
        }, self);

        /**
         * Get max page index
         * @type {*}
         */
        self.maxPage = ko.computed(function() {
            return Math.ceil(ko.utils.unwrapObservable(self.items).length / self.pageSize) - 1;
        }, self);

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
        self.add = function() {
            var item = new GridModel({name: 'New', sales: '0', price: '0'});

            if (self.editableItem() == null) {
                self.items.unshift(item);
                self.editableItem(item);
            }
        };

        /**
         * Edit item
         * @param item
         */
        self.edit = function(item) {
            self.editableItem() == null ? self.editableItem(item) : self.editableItem(null);
        };

        /**
         * Remove item from array
         * @param item
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
            var value = valueAccessor() || {};
            $(element).on('keyup', function(){
                viewModel.search(value.key, $(this).val());
            });
        }
    };

    ko.applyBindings(new GridViewModel(settings.items));
});
