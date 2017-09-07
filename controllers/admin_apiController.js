var prettyjson = require('prettyjson');
var mongoose = require("mongoose");

// Connect to mongoDB
var dbURI="mongodb://127.0.0.1/testgridfs2";
mongoose.connect(dbURI);

var fs=require("fs");

var Grid=require("gridfs-stream");
var conn=mongoose.connection; //db
Grid.mongo=mongoose.mongo;
var gfs;


module.exports=function(app){
	gfs = Grid(conn.db);

	app.get('/',function(req,res){
		res.render('index')
	});
	app.get('/img/:imgname', (req, res) => {
        gfs.files.find({
            filename: req.params.imgname
        }).toArray((err, files) => {

            if (files.length === 0) {
                return res.status(400).send({
                    message: 'File not found'
                });
            }
            var data = [];
            var readstream = gfs.createReadStream({
                filename: files[0].filename
            });

            readstream.on('data', (chunk) => {
                data.push(chunk);
            });

            readstream.on('end', () => {
                data = Buffer.concat(data);
                var img = 'data:image/png;base64,' + Buffer(data).toString('base64');
                res.end(img);
            });

            readstream.on('error', (err) => {
                console.log('An error occurred!', err);
                throw err;
            });
        });
    });
	app.post('/img',function(req,res){
		var part=req.files.file;
		console.log(part);
		var writeStream=gfs.createWriteStream({
			filename:'img_'+part.name,
			mode:'w',
			content_type:part.mimetype
		});

		writeStream.on('close',(file)=>{
			return res.status(200).send({
				message:"success",
				file:file //metdata for the file
			});
		});

		writeStream.write(part.data);
		writeStream.end();
	});
}