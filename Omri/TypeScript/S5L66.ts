// Exercise 1
class Car {
    private  _acceleration:number = 0;


    constructor(public name:string){
    }
    get acceleration(){return this._acceleration;}

      public honk = () => {
        console.log("Toooooooooot!");
    };

    public accelerate(speed) {
        this._acceleration = this._acceleration + speed;
    }
}
const car = new Car("BMW");
car.honk();
console.log(car.acceleration);
car.accelerate(10);
console.log(car.acceleration);

// Exercise 2
class baseObject {
    public width:number = 0;
    public length:number = 0;
   constructor(){

   }   
}

class Rectangle extends baseObject {
    public calcSize = function() {
        return this.width * this.length;
    };
   constructor(){
        super();
        this.width = 5;
        this.length = 2;
   }   
}

var rectangle = new Rectangle();

console.log(rectangle.calcSize());

// Exercise 3
class Person{
    private _firstname:string ="";
    get firstname(){return this._firstname;}
    set firstname(value:string){
        this._firstname = (value.length>3)?value:"";
    }
}
var person = new person();

console.log(person.firstName);
person.firstName = "Ma";
console.log(person.firstName);
person.firstName = "Maximilian";
console.log(person.firstName);
