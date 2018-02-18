let configValues = require('./config');

module.exports = {
    getDbConnectionString: function (){
        return 'mongodb://' + configValues.uname +
        ':' + configValues.pwd +
        '@ds237748.mlab.com:37748/nodetodosample';
    }
}