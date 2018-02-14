var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
// Exercise 1
var Car = (function () {
    function Car(name) {
        this.name = name;
        this._acceleration = 0;
        this.honk = function () {
            console.log("Toooooooooot!");
        };
        this.accelerate = function (speed) {
            this.acceleration = this.acceleration + speed;
        };
    }
    Object.defineProperty(Car.prototype, "acceleration", {
        get: function () { return this._acceleration; },
        enumerable: true,
        configurable: true
    });
    return Car;
})();
var car = new Car("BMW");
car.honk();
console.log(car.acceleration);
car.accelerate(10);
console.log(car.acceleration);
// Exercise 2
var baseObject = (function () {
    function baseObject() {
        this.width = 0;
        this.length = 0;
    }
    return baseObject;
})();
var Rectangle = (function (_super) {
    __extends(Rectangle, _super);
    function Rectangle() {
        _super.call(this);
        this.calcSize = function () {
            return this.width * this.length;
        };
        this.width = 5;
        this.length = 2;
    }
    return Rectangle;
})(baseObject);
var rectangle = new Rectangle();
console.log(rectangle.calcSize());
// Exercise 3
var Person = (function () {
    function Person() {
        this._firstname = "";
    }
    Object.defineProperty(Person.prototype, "firstname", {
        get: function () { return this._firstname; },
        set: function (value) {
            this._firstname = (value.length > 3) ? value : "";
        },
        enumerable: true,
        configurable: true
    });
    return Person;
})();
var person = new person();
console.log(person.firstName);
person.firstName = "Ma";
console.log(person.firstName);
person.firstName = "Maximilian";
console.log(person.firstName);
