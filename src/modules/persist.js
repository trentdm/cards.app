var self = this;
mongodb = require('mongodb');
bson = mongodb.BSONPure;

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

this.generate_mongo_url = function(obj){
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

mongourl = this.generate_mongo_url(mongo);

exports.saveViewModel = function(req, res) {
	mongodb.connect(mongourl, function(err, conn){
		conn.collection('viewModels', function(err, coll){
			object_to_insert = { 'viewModel': req.body.viewModel, 'date': new Date() };
			coll.insert( object_to_insert, {safe:true}, function(err){ 
	        });
		});
	});
};

exports.loadViewModel = function(req, res) {
	mongodb.connect(mongourl, function(err, conn){
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

exports.loadNextViewModel = function(req, res) {
	mongodb.connect(mongourl, function(err, conn){
		conn.collection('viewModels', function(err, coll){
			var id = new bson.ObjectID(req.params.id);
			coll.findOne({'_id': {$gt: id}}, {limit:1, sort:[['_id','asc']]}, function(err, cursor){
				res.send(JSON.stringify(cursor));
            });
		});
	});
};

exports.loadPrevViewModel = function(req, res) {
	mongodb.connect(mongourl, function(err, conn){
		conn.collection('viewModels', function(err, coll){
			var id = new bson.ObjectID(req.params.id);
			coll.findOne({'_id': {$lt: id}}, {limit:1, sort:[['_id','desc']]}, function(err, cursor){
				res.send(JSON.stringify(cursor));
            });
		});
	});
};