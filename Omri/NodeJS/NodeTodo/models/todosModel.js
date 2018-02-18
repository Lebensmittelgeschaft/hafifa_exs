let mongoose = require('mongoose');

let Schema = mongoose.Schema;

let todosSchema = new Schema({
    username : String,
    todo: String,
    isDone : Boolean,
    hasAttachement: Boolean
});

let Todos = mongoose.model('Todos', todosSchema);

module.exports = Todos;