(function( persistence, $ ) { //from http://stackoverflow.com/questions/881515/javascript-namespace-declaration
    //Public Method
	persistence.saveScores = function(vm, callBack){
		$.post('/save',	{ viewModel: vm }, callBack, 'json');
	};
	
	persistence.loadRecentScores = function(callBack){
		$.get('/load', function (data) {
			success: callBack(data);
		});
	};
	
	persistence.loadNextScores = function(id, callBack){
	$.get('/loadNext/' + id, function (data) {
		success: callBack(data);
		});
	};
	
	persistence.loadPreviousScores = function(id, callBack){
		$.get('/loadPrev/' + id, function (data) {
			success: callBack(data);
		});
	};
	
}( window.persistence = window.persistence || {}, jQuery ));