const express = require('express');
const db = require('./config/mongoose');
const session = require('express-session');
const passport = require('passport');
const passportLocal = require('./config/passport-local-strategy');
const app = express();
const port = 5000;

app.set('view engine', 'ejs');
app.set('views', './views');

app.use(session({
    name: 'placement-app',
    secret: 'placement-app',
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: 1000*60*15
    }
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(passport.setAuthenticatedUser);

app.use(express.urlencoded({extended: true}));

app.use('/', require('./routes'));

app.listen(port, (err) => {
    if(err){
        console.log(`Error in starting the server: ${err}`);
        return;
    }
    console.log(`Server is running on port: ${port}`)
})