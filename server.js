import express from 'express';
import morgan from 'morgan';
import bodyParser from 'body-parser';

const app = express();
app.use(morgan('short'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Add headers
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,Authorization');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

require('./config/routes')(app);

app.use('', function(req, res) {
    res.json({message: "undefined api"});
});

app.listen(process.env.PORT || 3000);

if (process.env.PORT === undefined) {
    console.log("Server Started at port : " + 3000);
}
else {
    console.log("Server Started at port : " + process.env.PORT);
}