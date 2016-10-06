angular.module("app").controller("basicExampleCtrl", function($scope, $filter, $http) {

    $scope.list = [];

    $http.get("/api").then(function(response) {
        $scope.list = response.data;
        $scope.updateList();
    });

    $scope.status = [
                {
                    name: "Tous",
                    value: ""
                },{
                    name: "Actif",
                    value: "Actif"
                },{
                    name: "Futur",
                    value: "Futur"
                },{
                    name: "Passé",
                    value: "Passé"
                }
            ];

    $scope.query = {status: "Futur"};


    $scope.updateList = function(){
        $scope.disruptions = $filter("filter")($scope.list, {status: $scope.query.status});
    };

    $scope.updateList();

    $scope.config = {
        itemsPerPage: 20,
        fillLastPage: false,
        // removing first and last item to
        // gain space
        paginatorLabels: {
            stepBack: '‹',
            stepAhead: '›',
            first: "",
            last: ""
        }
    };

});