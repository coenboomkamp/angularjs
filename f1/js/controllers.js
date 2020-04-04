angular.module('F1FeederApp.controllers', []).
controller('driversController', function($scope, ergastAPIservice) {
    $scope.nameFilter = null;
    $scope.driversList = [];

    ergastAPIservice.getDrivers().then(function (response) {
        //Dig into the responde to get the relevant data
        $scope.driversList = response.MRData.StandingsTable.StandingsLists[0].DriverStandings;
        console.log($scope.driversList);
    });
});