let Todos = require('../models/todosModel');

module.exports = (app)=>{
    app.get('/api/setupTodos', (req,res)=>{
        //seed database
        let starterTodos = [
            {
                username:'test',
                todo:'But mild',
                isDone:false,
                hasAttachment: false
            },
            {
                username:'test',
                todo:'Feed dog',
                isDone:false,
                hasAttachment: false
            }
            ,
            {
                username:'test',
                todo:'Learn Node',
                isDone:false,
                hasAttachment: false
            }
        ];
        Todos.create(starterTodos,(err,results)=>{
            res.send(results);
        })
    })
}