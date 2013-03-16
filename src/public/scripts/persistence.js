(function( persistence, $ ) { //from http://stackoverflow.com/questions/881515/javascript-namespace-declaration
    //Public Method
	persistence.saveScores = function(vm){
		$.post('/save',	{ viewModel: 'test' }, saveScoreSuccess, 'json');
	};  
	
	function saveScoreSuccess(data){
		alert('Saved');
	}
	
	persistence.loadScores = function(){
		$.get('/load', function () {
			success: alert('Loaded.');
		});
	}; 
}( window.persistence = window.persistence || {}, jQuery ));