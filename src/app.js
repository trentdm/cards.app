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

var record_visit = function(req, res){
    /* Connect to the DB and auth */
    require('mongodb').connect(mongourl, function(err, conn){
        conn.collection('ips', function(err, coll){
            /* Simple object to insert: ip address and date */
            object_to_insert = { 'ip': req.connection.remoteAddress, 'ts': new Date() };
            /* Insert the object then print in response */
            /* Note the _id has been created */
            coll.insert( object_to_insert, {safe:true}, function(err){          
            });
        });
    });
};

var print_visits = function(req, res){
    /* Connect to the DB and auth */
    require('mongodb').connect(mongourl, function(err, conn){
        conn.collection('ips', function(err, coll){
            coll.find({}, {limit:10, sort:[['_id','desc']]}, function(err, cursor){
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

//var port = (process.env.VMC_APP_PORT || 3000); //ctrl+7 to comment
//var host = (process.env.VCAP_APP_HOST || 'localhost');
//var http = require('http');
//http.createServer(function (req, res) {
//	params = require('url').parse(req.url);
//    if(params.pathname === '/history') {
//        print_visits(req, res);
//    }
//    else{
//        record_visit(req, res);
//    }
//}).listen(port, host);

var express = require('express');
var app = express();
app.use('/public', express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/public'));
app.get('/history', function(req, res){
		print_visits(req, res);
		record_visit(req, res);
	});
app.get('/hello.txt', function(req, res){
	  res.send('Hello wald');
	});
app.use(function(err, req, res, next){
	  console.error(err.stack);
	  res.send(500, 'Something broke!');
	});
app.listen(3000);