var persist = require('./modules/persist.js');
var express = require('express');

var app = express();

app.use('/public', express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/public'));

app.use(express.bodyParser());

app.post('/save', function(req, res) {
	persist.saveViewModel(req, res);	
});
app.get('/load', function(req, res) {
	persist.loadViewModel(req, res);	
});
app.get('/loadNext/:id', function(req, res) {
	persist.loadNextViewModel(req, res);	
});
app.get('/loadPrev/:id', function(req, res) {
	persist.loadPrevViewModel(req, res);	
});

app.use(function(err, req, res, next){
	  console.error(err.stack);
	  res.send(500, 'Something broke!');
});
app.listen(3000);