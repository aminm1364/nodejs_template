const helmet = require('helmet');

module.exports = function(app, express){
    app.set('view engine', 'pug');
    app.set('views', './views');

    app.use(express.json());
    app.use(helmet());
    app.use(express.urlencoded({ extended: true }));
    app.use(express.static('public'));
}