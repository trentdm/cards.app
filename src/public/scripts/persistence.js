(function( persistence, $ ) { //from http://stackoverflow.com/questions/881515/javascript-namespace-declaration
    //Public Method
	persistence.saveScores = function(vm){
		$.post('/save',	{ viewModel: vm }, saveScoreSuccess(), 'json');
	};  
	
	function saveScoreSuccess(){
		$('#viewScores').text('Scores saved!');
	}
	
	persistence.loadScores = function(){
		$.get('/load', function () {
			success: alert('Loaded.');
		});
	}; 
	
	persistence.viewScores = function(){
		$.get('/view', function (data) {
			success: $('#viewScores').html('<p>Scores for the past 3 games:</p><p>' + data + '</p>');
		});
	}; 
}( window.persistence = window.persistence || {}, jQuery ));

//todo: make viewing of scores much nicer
//todo: allow loading of previous games
//todo: allow saving of game name along with rest of viewmodel