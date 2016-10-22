var app = angular.module("app", ["angular-table", "mm.foundation.pagination"]);

app.config(function($interpolateProvider) {
    $interpolateProvider.startSymbol('[[[');
    $interpolateProvider.endSymbol(']]]');
});

app.controller("basicExampleCtrl", function($scope, $filter, $http) {

    $scope.data = {disruptions: [], grouped_by_text: []};

    $http.get("/api").then(function(response) {
        $scope.data = response.data;
        $scope.data.grouped_by_text = grouping.groupByTextToArray($scope.data.disruptions);
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

    $scope.query = {status: "", object_name: "", text: ""};


    $scope.updateList = function(){
        $scope.filtered = {};
        $scope.filtered.disruptions = $filter("filter")($scope.data.disruptions, $scope.query);

        // reproducing filtering without 'text' attribut in order to update select element
        var query = angular.copy($scope.query);
        delete query.text;

        var disruptions = $filter("filter")($scope.data.disruptions, query);
        $scope.filtered.count = disruptions.length;
        var groupedByText = grouping.groupByText(disruptions);

        if ($scope.query.text && typeof groupedByText[$scope.query.text] === 'undefined') {
            groupedByText[$scope.query.text] = 0;
        }

        $scope.filtered.grouped_by_text = grouping.toArray(groupedByText);
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

    $scope.pagin = {
        itemsPerPage: 5,
        cPage: 1
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