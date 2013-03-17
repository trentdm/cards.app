if(process.env.VCAP_SERVICES){
    var env = JSON.parse(process.env.VCAP_SERVICES);
    var mongo = env['mongodb-1.8'][0]['credentials'];
}
else{
    var mongo = {
        "hostname":"localhost",
        "port":27017,
        "username":"",
        "password":"",
        "name":"",
        "db":"db"
    };
}
var generate_mongo_url = function(obj){
    obj.hostname = (obj.hostname || 'localhost');
    obj.port = (obj.port || 27017);
    obj.db = (obj.db || 'test');
    if(obj.username && obj.password){
        return "mongodb://" + obj.username + ":" + obj.password + "@" + obj.hostname + ":" + obj.port + "/" + obj.db;
    }
    else{
        return "mongodb://" + obj.hostname + ":" + obj.port + "/" + obj.db;
    }
};
var mongourl = generate_mongo_url(mongo);

var saveViewModel = function(req, res) {
	require('mongodb').connect(mongourl, function(err, conn){
		conn.collection('viewModels', function(err, coll){
			object_to_insert = { 'viewModel': req.body.viewModel, 'date': new Date() };
			coll.insert( object_to_insert, {safe:true}, function(err){ 
	        });
		});
	});
};

var loadViewModel = function(req, res) {
	require('mongodb').connect(mongourl, function(err, conn){
		conn.collection('viewModels', function(err, coll){
			coll.find({}, {limit:1, sort:[['_id','desc']]}, function(err, cursor){
                cursor.toArray(function(err, items){
                    res.writeHead(200, {'Content-Type': 'text/plain'});
                    for(i=0; i<items.length;i++){
                        res.write(JSON.stringify(items[i]) + "\n");
                    }
                    res.end();
                });
            });
		});
	});
};

var express = require('express');
var app = express();
app.use('/public', express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/public'));
app.use(express.bodyParser());

app.post('/save', function(req, res) {
	saveViewModel(req, res);	
});
app.get('/load', function(req, res) {
	loadViewModel(req, res);	
});

app.use(function(err, req, res, next){
	  console.error(err.stack);
	  res.send(500, 'Something broke!');
});
app.listen(3000);

//todo: site icon
//todo: rearrange players by drag and drop -- see http://jsfiddle.net/rniemeyer/hw9B2/
//todo: (optional) change element sizes for mobile?
//todo: (optional) visualization of tracked scores