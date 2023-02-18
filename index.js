const express = require('express');
const db = require('./config/mongoose');
const app = express();
const port = 5000;

app.set('view engine', 'ejs');
app.set('views', './views');
app.use('/', require('./routes'));

app.listen(port, (err) => {
    if(err){
        console.log(`Error in starting the server: ${err}`);
        return;
    }
    console.log(`Server is running on port: ${port}`)
})