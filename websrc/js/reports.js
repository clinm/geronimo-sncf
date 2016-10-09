var app = angular.module("app", ["angular-table"]);

app.config(function($interpolateProvider) {
    $interpolateProvider.startSymbol('[[[');
    $interpolateProvider.endSymbol(']]]');
});

app.controller("basicExampleCtrl", function($scope, $filter, $http) {

    $scope.data = {disruptions: []};

    $http.get("/api").then(function(response) {
        $scope.data = response.data;
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

    $scope.query = {status: ""};


    $scope.updateList = function(){
        $scope.disruptions = $filter("filter")($scope.data.disruptions, {status: $scope.query.status});
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

    var getAssociatedDay = function(day) {
        var dayNames = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
        return dayNames[day%7];
    };

    var padding = function(value) {
        return String("00" + value).slice(-2);
    };

    $scope.displayAsDate = function(timestamp) {
        var date = "Inconnue";
        if (timestamp) {
            var d = new Date(timestamp);
            date = getAssociatedDay(d.getDay()) + " " + padding(d.getHours()) + ":" + padding(d.getMinutes());
        }
        return date;
    };

});