var vmId;
var viewModel;

function initLoadedViewModel() {
	persistence.loadRecentScores(initLoadedScores.bind());
};

function initLoadedScores(data) {
	vmId = getId(data);
	viewModel = getViewModel(data);
	ko.applyBindings(viewModel);
	initializePopbox();
}

function getId(data) {
	var parsedData = JSON.parse(data);
	return parsedData._id;
}

function getViewModel(data) {
	var parsedData = JSON.parse(data);
	var parsedViewModel = JSON.parse(parsedData.viewModel);
	return ko.mapping.fromJS(parsedViewModel);
}

function loadPreviousScores() {
	persistence.loadPreviousScores(vmId, loadNewScores.bind());
}

function loadNextScores() {
	persistence.loadNextScores(vmId, loadNewScores.bind());
}

function loadNewScores(data) {
	if(data == 'null') {
		viewModel.notification('No game found.');
		return;
	}
	
	vmId = getId(data);
	var newVm = getViewModel(data);	
	
	viewModel.rounds(newVm.rounds);
	viewModel.players(newVm.players);
	viewModel.notification(newVm.notification());
	viewModel.isHighBestScore(newVm.isHighBestScore);
}