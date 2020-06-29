const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const hbs = require('express-handlebars');
const {mongoDbUrl, PORT, globalVariables} = require('./config/configuration');
const flash = require('flash');
const session = require('express-session');

const app = express();


// Configure mongoose to connect MongoDB
mongoose.connect(mongoDbUrl, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(res => {console.log('MongoDB Connected Successfully...')})
    .catch(err => {console.log('Database connection error...')})


// Setup View Engine To Use Handlebars
app.engine('handlebars', hbs({defaultLayout: 'default'}));
app.set('view engine', 'handlebars');


// Configure express
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'public')));

// Flash and Session
app.use(session({
    secret: 'anysecret',
    saveUninitialized: true,
    resave: true
}));

app.use(flash());

app.use(globalVariables);

// Routes
const defaultRoutes = require('./routes/deafultRoutes');
const adminRoutes = require('./routes/adminRoutes');

app.use('/', defaultRoutes);    
app.use('/admin', adminRoutes);



app.listen(PORT, console.log(`Server started on port ${PORT} ....`));