module("player viewmodel", {
    setup: function () { initViewModel(); }
});

test("test player name binding", function() {
	var playerName = "Trent";
	var newPlayer = new player(playerName);
	viewModel.players.push(newPlayer);
	
	equal(viewModel.players()[0].name(), playerName);
});

test("test player score binding", function() {
	var playerName = "Trent";
	var newPlayer = new player(playerName);
	
	viewModel.players.push(newPlayer);
	
	viewModel.players()[0].scores.push(new score(1));
	
	var scoresLength = viewModel.players()[0].scores().length;
	
	equal(viewModel.players()[0].scores()[scoresLength - 1].val(), 1);
});

test("test player total sums scores", function() {
	var playerName = "Trent";
	var newPlayer = new player(playerName);
	
	viewModel.players.push(newPlayer);
	
	viewModel.players()[0].scores.push(new score(1));
	viewModel.players()[0].scores.push(new score(6));
	
	equal(viewModel.players()[0].total(), 7);
});

test("test player total sums scores with neg score", function() {
	var playerName = "Trent";
	var newPlayer = new player(playerName);
	
	viewModel.players.push(newPlayer);
	
	viewModel.players()[0].scores.push(new score(-8));
	viewModel.players()[0].scores.push(new score(6));
	
	equal(viewModel.players()[0].total(), -2);
});

test("test player total ignores text", function() {
	var playerName = "Trent";
	var newPlayer = new player(playerName);
	
	viewModel.players.push(newPlayer);
	
	viewModel.players()[0].scores.push(new score('asdfa'));
	viewModel.players()[0].scores.push(new score(6));
	
	equal(viewModel.players()[0].total(), 6);
});

test("test player total ignores NaN", function() {
	var playerName = "Trent";
	var newPlayer = new player(playerName);
	
	viewModel.players.push(newPlayer);
	
	viewModel.players()[0].scores.push(new score());
	viewModel.players()[0].scores.push(new score(6));
	
	equal(viewModel.players()[0].total(), 6);
});

test("test addPlayer makes new player", function() {
	var playerName = "Trent";

	viewModel.addPlayer(playerName);
		
	equal(viewModel.players()[0].name(), playerName);
});

test("test addPlayer gives score for each existing round", function() {
	viewModel.rounds.push(new round(2));

	viewModel.addPlayer('test');
		
	equal(viewModel.players()[0].scores().length, 2);
});

test("test addRound pushes new round of rounds.length + 1", function() {
	viewModel.addRound();
	
	equal(viewModel.rounds()[1].val, 2);
});

test("test addRound pushes new round to players", function() {
	viewModel.players.push(new player('test'));
	
	viewModel.addRound();
	
	equal(viewModel.players()[0].scores().length, 2);
});

test("test addRound sets enabled to false for previous rounds", function() {
	viewModel.players.push(new player('test'));
	
	viewModel.addRound();
	
	equal(viewModel.players()[0].scores()[0].enabled(), false);
});

test("test addRound leaves latest round enabled set to true", function() {
	viewModel.players.push(new player('test'));
	
	viewModel.addRound();
	
	equal(viewModel.players()[0].scores()[1].enabled(), true);
});

test("test newGame resets rounds", function() {
	viewModel.rounds.push(new round(2));
	
	viewModel.newGame();
	
	equal(viewModel.rounds().length, 1);
});

test("test newGame resets players", function() {
	viewModel.rounds.push(new round(2));
	viewModel.players.push(new player('test'));
	viewModel.players()[0].scores.push(new score(2));
	
	viewModel.newGame();
	
	equal(viewModel.players().length, 0);
});

test("test edit score sets enabled to true", function() {
	var myScore = new score(0);
	
	myScore.editScore();
	
	equal(myScore.enabled(), true);
});

test("test isAllScoresEntered returns false if no players exist", function() {
	equal(viewModel.isAllScoresEntered(), false);
});

test("test isAllScoresEntered returns false if a score is missing a float value", function() {
	viewModel.players.push(new player('test'));
	
	equal(viewModel.isAllScoresEntered(), false);
});

test("test isAllScoresEntered returns false if a score has a non-float value", function() {
	viewModel.players.push(new player('test'));
	viewModel.players()[0].scores.push(new score('asdf'));
	
	equal(viewModel.isAllScoresEntered(), false);
});

test("test isAllScoresEntered returns true if all scores have a float value", function() {
	viewModel.players.push(new player('test'));
	viewModel.players()[0].scores.removeAll();
	viewModel.players()[0].scores.push(new score(2));
	
	equal(viewModel.isAllScoresEntered(), true);
});

test("test edit player name sets nameEditable to true", function() {
	var myPlayer = new player('test');
	
	myPlayer.editName();
	
	equal(myPlayer.nameEditable(), true);
});

test("test edit player name is set to false after changing name", function() {
	var myPlayer = new player('test');
	myPlayer.nameEditable(true);
	
	myPlayer.name('newName');
	
	equal(myPlayer.nameEditable(), false);
});

test("test rankedPlayers are right order when high score is best", function () {
	var players = ko.observableArray();
	var isHighBestScore = new ko.observable(true);
	
	players.push(new player('lowPlayer'));
	players()[0].scores.push(new score(1));
	
	players.push(new player('middlePlayer'));
	players()[1].scores.push(new score(4));
	
	players.push(new player('highPlayer'));
	players()[2].scores.push(new score(5));
	
	var notifications = new notificationManager(players, isHighBestScore);
	var rankings = notifications.rankedPlayers();

	var expectedPlayerName = 'highPlayer';
	
	equal(rankings()[0].name(), expectedPlayerName);
});

test("test rankedPlayers are right order when low score is best", function () {
	var players = ko.observableArray();
	var isHighBestScore = new ko.observable(false);
	
	players.push(new player('lowPlayer'));
	players()[0].scores.push(new score(1));
	
	players.push(new player('middlePlayer'));
	players()[1].scores.push(new score(4));
	
	players.push(new player('highPlayer'));
	players()[2].scores.push(new score(5));
	
	var notifications = new notificationManager(players, isHighBestScore);
	var rankings = notifications.rankedPlayers();

	var expectedPlayerName = 'lowPlayer';
	
	equal(rankings()[0].name(), expectedPlayerName);
});

test("test rankedPlayers when tied", function () {
	var players = ko.observableArray();
	var isHighBestScore = new ko.observable(true);
	
	players.push(new player('lowPlayer'));
	players()[0].scores.push(new score(1));
	
	players.push(new player('highPlayer1'));
	players()[1].scores.push(new score(4));
	
	players.push(new player('highPlayer2'));
	players()[2].scores.push(new score(4));
	
	var notifications = new notificationManager(players, isHighBestScore);
	var rankings = notifications.rankedPlayers();

	var expectedPlayerName = 'highPlayer1';
	
	equal(rankings()[0].name(), expectedPlayerName);
});

test("test rankedPlayers with one player", function () {
	var players = ko.observableArray();
	var isHighBestScore = new ko.observable(true);
	
	players.push(new player('onlyPlayer'));
	players()[0].scores.push(new score(1));
	
	var notifications = new notificationManager(players, isHighBestScore);
	var rankings = notifications.rankedPlayers();

	var expectedPlayerName = 'onlyPlayer';
	
	equal(rankings()[0].name(), expectedPlayerName);
});

test("test delete player by changing name to empty", function () {
	var player1 = new player('onlyPlayer');	
	viewModel.players.push(player1);
	viewModel.players()[0].scores.push(new score(4));
	
	player1.name("");
	
	equal(viewModel.players().length, 0);
});

test("test delete player unaffected by name change to non empty", function () {
	var player1 = new player('onlyPlayer');	
	viewModel.players.push(player1);
	viewModel.players()[0].scores.push(new score(4));
	
	player1.name("t");
	
	equal(viewModel.players().length, 1);
});

test("test getNotification is empty for no players", function () {
	var players = ko.observableArray();
	var isHighBestScore = new ko.observable(true);
	
	var notifications = new notificationManager(players, isHighBestScore);
	
	notifications.players.removeAll();
	
	equal(notifications.getNotificationMessage(), '');
});

test("test getNotification is empty for one player", function () {
	var players = ko.observableArray();
	var isHighBestScore = new ko.observable(true);
	
	players.push(new player('lowPlayer'));
	players()[0].scores.push(new score(1));
	
	var notifications = new notificationManager(players, isHighBestScore);
	
	equal(notifications.getNotificationMessage(), '');
});

test("test getNotification works for two players", function () {
	var players = ko.observableArray();
	var isHighBestScore = new ko.observable(true);
	
	players.push(new player('lowPlayer'));
	players()[0].scores.push(new score(1));
	
	players.push(new player('highPlayer'));
	players()[1].scores.push(new score(4));
	
	var notifications = new notificationManager(players, isHighBestScore);
	
	equal(notifications.getNotificationMessage(), "highPlayer leads by 3 points!");
});

test("test getNotification for two players when low score is best", function () {
	var players = ko.observableArray();
	var isHighBestScore = new ko.observable(false);
	
	players.push(new player('lowPlayer'));
	players()[0].scores.push(new score(1));
	
	players.push(new player('highPlayer'));
	players()[1].scores.push(new score(4));
	
	var notifications = new notificationManager(players, isHighBestScore);
	
	equal(notifications.getNotificationMessage(), "lowPlayer leads by 3 points!");
});

test("test getNotification works in a tie", function () {
	var players = ko.observableArray();
	var isHighBestScore = new ko.observable(true);
	
	players.push(new player('lowPlayer'));
	players()[0].scores.push(new score(4));
	
	players.push(new player('highPlayer'));
	players()[1].scores.push(new score(4));
	
	var notifications = new notificationManager(players, isHighBestScore);
	
	equal(notifications.getNotificationMessage(), "lowPlayer and highPlayer are tied!");
});

test("test updateNotification sets notification using getNotification", function () {
	viewModel.players.push(new player('lowScore'));
	viewModel.players()[0].scores.push(new score(1));
	
	viewModel.players.push(new player('highScore'));
	viewModel.players()[1].scores.push(new score(4));
	
	viewModel.updateNotification();
	
	equal(viewModel.notification(), 'highScore leads by 3 points!');
});