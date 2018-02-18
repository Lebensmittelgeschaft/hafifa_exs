var MyMap = (function () {
    function MyMap() {
    }
    // should create a new key-value pair
    MyMap.prototype.setItem = function (key, item) {
        this[key] = item;
    };
    // should retrieve the value of the provided key
    MyMap.prototype.getItem = function (key) {
        return this[key];
    };
    // should remove all key-value pairs
    MyMap.prototype.clear = function () {
        var _this = this;
        Object.getOwnPropertyNames(this).forEach(function (key) {
            delete _this[key];
        });
    };
    // should output key-value pairs
    MyMap.prototype.printMap = function () {
        var _this = this;
        Object.getOwnPropertyNames(this).forEach(function (key) {
            console.log("(" + key + "," + _this[key] + ")");
        });
    };
    return MyMap;
})();
var numberMap = new MyMap();
numberMap.setItem('apples', 5);
numberMap.setItem('bananas', 10);
numberMap.printMap();
var stringMap = new MyMap();
stringMap.setItem('name', "Max");
stringMap.setItem('age', "27");
stringMap.printMap();
