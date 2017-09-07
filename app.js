var express=require('express');
var busboyBodyParser = require('busboy-body-parser');
var admin_apiController=require("./controllers/admin_apiController");
var app=express();

//set up the template engine
app.set('view engine','ejs');
//path to static files
app.use(express.static('./public'));
app.use(busboyBodyParser({ limit: '10mb' }));  

//fire the controller
admin_apiController(app);

//listen to port
app.listen(3000);
console.log("your are listening to port 3000");