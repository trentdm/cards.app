(function( persistence, $ ) { //from http://stackoverflow.com/questions/881515/javascript-namespace-declaration
    //Public Method
	persistence.saveScores = function(vm){
		$.post('/save',	{ viewModel: vm }, saveScoreSuccess, 'json');
	};  
	
	function saveScoreSuccess(data){
		alert('Saved');
	}
	
	persistence.loadScores = function(){
		$.get('/load', function () {
			success: alert('Loaded.');
		});
	}; 
	
	persistence.viewScores = function(){
		$.get('/view', function (data) {
			success: $('#viewScores').text(data);
		});
	}; 
}( window.persistence = window.persistence || {}, jQuery ));