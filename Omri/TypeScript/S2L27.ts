type accountType = {money:number,deposit:(value:number)=>void}
let bankAccount :accountType = {
    money: 2000,
    deposit(value) {
        this.money += value;
    }
};

let myself:{name:string,bankAccount:accountType,hobbies:string[]} = {
    name: "Max",
    bankAccount: bankAccount,
    hobbies: ["Sports", "Cooking"]
};

myself.bankAccount.deposit(3000);

console.log(myself);

