class MyMap<T>{
    // should create a new key-value pair
    setItem(key: string, item: T) {
        this[key] = item;
    }
    // should retrieve the value of the provided key
    getItem(key: string){
        return this[key];
    } 
    // should remove all key-value pairs
    clear() {
        Object.getOwnPropertyNames(this).forEach((key)=>{
           delete this[key];
        })
    }
    // should output key-value pairs
    printMap(){
        Object.getOwnPropertyNames(this).forEach((key)=>{
            console.log(`(${key},${this[key]})`);
         })
    } 
    
   
}

const numberMap = new MyMap<number>();
numberMap.setItem('apples', 5);
numberMap.setItem('bananas', 10);
numberMap.printMap();
 
const stringMap = new MyMap<string>();
stringMap.setItem('name', "Max");
stringMap.setItem('age', "27");
stringMap.printMap();