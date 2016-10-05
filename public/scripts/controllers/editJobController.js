
myApp.constant('moment', moment);

myApp.controller('editJobController', ['$scope', '$http', 'moment', 'factory', function ($scope, $http, moment, factory){
  console.log('in editJobController');
  //this is the job that was selected from another view and received from factory
  var jobId = factory.currentJobId();
  //save for other functions that need to change the job
  $scope.id = '';

  //set ng-show to false on each
  $scope.editCo = false;
  $scope.editD = false;
  $scope.editPi = false;

  $scope.company = '';

  //get all from factory find job from id that was clicked
  factory.getAll().then(function (results) {
    //save get from factory into allJobs
    $scope.allJobs = results.data;
    console.log('in edit getAll results', $scope.allJobs);
    for (var i = 0; i < $scope.allJobs.length; i++) {
      //console.log('in for loop');
      //console.log($scope.allJobs[i].id);
      //console.log(jobId);
      if ($scope.allJobs[i].id === jobId){
        //save parts of the job to display on dom
        $scope.id = $scope.allJobs[i].id;
        $scope.company = $scope.allJobs[i].company;
        $scope.pieces = $scope.allJobs[i].pieces;
        $scope.duedate = moment($scope.allJobs[i].duedate).format('M/D/YY');
        console.log('meow', $scope.company);
      }
    }
  });
  //show edit fields if clicked
  $scope.editButtonsCo = function () {
    console.log('in editButtonsCo');
    $scope.editCo = true;
  };
  //show edit fields if clicked
  $scope.editButtonsPi = function () {
    console.log('in editButtonsPi');
    $scope.editPi = true;
  };
  //show edit fields if clicked
  $scope.editButtonsDate = function () {
    console.log('in editButtonsDate');
    $scope.editD = true;
  };
  //edit pieces text
  $scope.editPieces = function () {
    console.log('edit this', $scope.editPiecesmodel);

    factory.editPieces($scope.editPiecesmodel).then(function (results) {
      console.log('made it back from edit');
      $scope.editPi = false;
    });
  };

  //edit company text
  $scope.editCompany = function () {
    console.log('edit this', $scope.editCompanymodel);

    factory.editCompany($scope.editCompanymodel).then(function (results) {
      console.log('made it back from edit');
      $scope.editCo = false;
    });//end factory call
  };//end edit company

  //edit date text
  $scope.editDate = function () {
    console.log('edit this', $scope.editDueDatemodel);

    factory.editDate($scope.editDueDatemodel).then(function (results) {
      console.log('made it back from edit');
      $scope.editD = false;
    });//end factory call
  };//end editDate


  //delete job
  $scope.deleteJob = function () {
    console.log('in delete', $scope.id);
    var objectToSend = {
      id: $scope.id
    };
    factory.deletejob(objectToSend).then(function (response) {
      console.log('made it to then');
    });
  };//end delete job

}]);//end controller
