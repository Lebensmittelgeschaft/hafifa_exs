let fs = require('fs');
let process = require('process');
let request = require('request');

console.log(process.argv);
let term = process.argv[1];
request.get(`https://icanhazdadjoke.com/search?term${term}`,
 (err,response,body)=>{
      console.log(response.statusCode);
      console.log(body);
      
  });