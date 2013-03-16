function initViewModel() {
    viewModel = new AppViewModel();
    
    ko.applyBindings(viewModel);
    
    initializePopbox();
}

function AppViewModel() {
	this.date = moment().format();
	this.rounds = ko.observableArray([new round(1)]);
	this.players = ko.observableArray();
    this.notification = ko.observable('');    
    this.newPlayerName = ko.observable();
    this.isHighBestScore = ko.observable(true);
    
    this.newPlayerName.subscribe(function (name) {
    	if(name.length > 0) {
	    	this.addPlayer(name);
	    	this.newPlayerName('');
    	}
     }, this);
    
    this.isHighBestScore.subscribe(function (name) {
    	this.updateNotification();
     }, this);
    
    this.addPlayer = function(name){
    	var newPlayer = new player(name);
    	this.players.push(newPlayer);
    };
    
    this.addRound = function() {
    	this._lockPreviousScores();	
    	
    	this.rounds.push(new round(this.rounds().length + 1));
    	
    	ko.utils.arrayForEach(this.players(), function(player) {
            player.scores.push(new score());
        });
    };
    
    this._lockPreviousScores = function(){
    	ko.utils.arrayForEach(this.players(), function(player) {
    		ko.utils.arrayForEach(player.scores(), function(score) {
        		score.enabled(false);
            }); 
        });    
    };
    
    this.newGame = function() {
    	this._resetRounds();
    	this._resetPlayers(); 
    	this.updateNotification();
    };    
    
    this._resetRounds = function() {
    	this.rounds.removeAll();    	
    	this.rounds.push(new round(1)); 
    };
    
    this._resetPlayers = function() {
    	this.players.removeAll();
    };
    
    this.isAllScoresEntered = function() {
    	if(this.players().length == undefined || this.players().length == 0)
    		return false;
    	
    	var isAnyScoreNaN = true;    	
    	ko.utils.arrayForEach(this.players(), function(player) {
    		ko.utils.arrayForEach(player.scores(), function(score) {
        		if(isNaN(score.val()))
        			isAnyScoreNaN = false;
            }); 
        });    	
    	return isAnyScoreNaN;
    };
    
    this.setHighAsBestScore = function(){
    	this.isHighBestScore(true);
    };
    
    this.setLowAsBestScore = function(){
    	this.isHighBestScore(false);
    };
    
    this.updateNotification = function() {
    	var notifications = new notificationManager(this.players, this.isHighBestScore);
    	this.notification(notifications.getNotificationMessage());
	};
	
	ko.bindingHandlers.fadeVisible = {
	    init: function(element, valueAccessor) {
			$(element).hide();
			$(element).fadeIn(500);
	    },
	    update: function(element, valueAccessor) {
	    	$(element).hide();
	    	$(element).fadeIn(500);
	    }
	};
}

function round(value) {
	this.val = value;
}

function score(value) {	
    this.val = ko.observable(value);
    this.enabled = ko.observable(true);
   
    this.editScore = function() {
	   this.enabled(true);
    };
    
    this.val.subscribe(function () {
    	if(viewModel.isAllScoresEntered()) {    		
    		viewModel.addRound();
    		viewModel.updateNotification();
    	}
     }, this);
};

function player(name) {
	this.buildNewPlayerScores = function () {
		var newScores = new Array();		
		ko.utils.arrayForEach(viewModel.rounds(), function(round) {
	        newScores.push(new score());
		});	        
	    return newScores;
	};

	this.name = ko.observable(name);
	
	this.nameEditable = ko.observable(false);
	
	this.scores = ko.observableArray(this.buildNewPlayerScores());
		
	this.total = ko.computed(function() {
		var total = 0;
		ko.utils.arrayForEach(this.scores(), function(score) {
            var parsedVal = parseFloat(score.val());
            if(!isNaN(parsedVal))
            	total += parsedVal;
        });
		return total;
	}, this);
	
	this.editName = function () {
		this.nameEditable(true);
	};
	
	this.name.subscribe(function () {
		if(this.name().length == 0){
			viewModel.players.remove(this);
			return;
		}
		
		this.nameEditable(false);
		
		viewModel.updateNotification();
     }, this);
}

function notificationManager(players, isHighBestScore) {
	this.players = players;
	this.isHighBestScore = isHighBestScore;
	
	this.getNotificationMessage = function() {
    	if(this.players().length < 2)
    		return '';
    	
    	var rankings = this.rankedPlayers();
    	var firstPlace = rankings()[0];
    	var secondPlace = rankings()[1];
    	
    	var pointDifferential = Math.abs(firstPlace.total() - secondPlace.total());
    	var notificationMessage;
    	
    	if(pointDifferential == 0)
    		 notificationMessage = firstPlace.name() + " and " + secondPlace.name() + " are tied!";
		else
			notificationMessage = firstPlace.name() + " leads by " + pointDifferential + " points!";
    	
    	return notificationMessage;
	};
    
    this.rankedPlayers = function(){
    	var rankings = ko.observableArray();
    	rankings(this.players.slice(0));
    	
    	if(this.isHighBestScore())
    		rankings.sort(this._rankHighest);
    	else
    		rankings.sort(this._rankLowest);
    	
    	return rankings;
    };
    
    this._rankHighest = function(a, b) { 
		return a.total() == b.total() ? 0 : (a.total() > b.total() ? -1 : 1);
	};
	
	this._rankLowest = function(a, b) { 
		return a.total() == b.total() ? 0 : (a.total() < b.total() ? -1 : 1);
	};
};

function initializePopbox() {
	$(document).ready(function(){
     $('.popbox').popbox();
   });
};

function saveScores() {
	persistence.saveScores(ko.toJSON(viewModel));
};

function viewScores() {
	persistence.viewScores();
};

function loadScores() {
	persistence.loadScores();
};

//todo: site icon
//todo: rearrange players by drag and drop -- see http://jsfiddle.net/rniemeyer/hw9B2/
//todo: (optional) change element sizes for mobile?
//todo: (optional) upload scores to database for persistent tracking
//todo: (optional) visualization of tracked scores

//todo: newplayer input is disabled after first round (click to edit again)
//todo: (optional) move focus to first player, first enabled score after adding round (hasFocus: bool - would add to score func)