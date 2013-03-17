(function( persistence, $ ) { //from http://stackoverflow.com/questions/881515/javascript-namespace-declaration
    //Public Method
	persistence.saveScores = function(vm, callBack){
		$.post('/save',	{ viewModel: vm }, callBack, 'json');
	};
	
	persistence.loadScores = function(callBack){
		$.get('/load', function (data) {
			success: callBack(data);
		});
	};
	
}( window.persistence = window.persistence || {}, jQuery ));

//todo: make viewing of scores much nicer
//todo: allow loading of previous games
//todo: allow saving of game name along with rest of viewmodel