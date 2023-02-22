const express = require('express');
const db = require('./config/mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const passport = require('passport');
const passportLocal = require('./config/passport-local-strategy');
const expressLayouts = require('express-ejs-layouts');
const sassMiddleware = require('node-sass-middleware');
const flash = require('connect-flash');
const flashMiddleware = require('./config/flash-middleware');

const app = express();
const port = 5000;

app.use(expressLayouts);
app.use(sassMiddleware({
    src: './assets/scss',
    dest: './assets/css',
    debug: false,
    outputStyle: 'compressed',
    prefix: '/css'
}));
app.use(express.static('./assets'));

app.set('layout extractStyles', true);
app.set('layout extractScripts', true);
app.set('view engine', 'ejs');
app.set('views', './views');

app.use(session({
    name: 'placement-app',
    secret: 'placement-app',
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: 1000*60*15
    },
    store: new MongoStore({
        mongooseConnection: db,
        autoRemove: 'disabled'
    }, function(err){
        if(err){
            console.log(`Error in using session cookies: ${err}`);
            return;
        }
    })
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(passport.setAuthenticatedUser);

app.use(flash());
app.use(flashMiddleware.setFlash);

app.use(express.urlencoded({extended: true}));

app.use('/', require('./routes'));

app.listen(port, (err) => {
    if(err){
        console.log(`Error in starting the server: ${err}`);
        return;
    }
    console.log(`Server is running on port: ${port}`)
})