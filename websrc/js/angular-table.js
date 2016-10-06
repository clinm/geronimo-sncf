angular.module("app").controller("basicExampleCtrl", function($scope, $filter, $http) {

    $scope.list = [];

    $http.get("/api").then(function(response) {
        $scope.list = response.data;
        $scope.updateList();
    });


    /*$scope.oldStruct.forEach(function(item) {

        var translateStatus = function(status) {
            var newStatus;
            switch(status) {
                case "active":
                    newStatus = "Actif";
                    break;
                case "past":
                    newStatus = "Passé";
                    break;
                case "future":
                    newStatus = "Futur";
                    break;
                default:
                    newStatus = "Inconnu";
            }

            return newStatus;
        };

        var getMessage = function(messages) {
            var mess = "Non fourni";

            if (messages && messages[0] && messages[0].text) {
               mess = messages[0].text;
            }

            // tracking purpose, if several message are available
            if ( messages && messages.length > 1) {
                console.log("More than one message provided !");
                console.log(messages);
            }
            return mess;
        };

        var getTrainNumber = function(impacted_obj) {
            var trainNumber = "Inconnu";

            if (impacted_obj && impacted_obj[0] && impacted_obj[0].pt_object) {
                trainNumber = impacted_obj[0].pt_object.trip.name;
            }

            // tracking purpose, if several message are available
            if ( impacted_obj && impacted_obj.length > 1) {
                console.log("More than one object provided !");
                console.log(impacted_obj);
            }
            return trainNumber;
        };


        var obj = {
            status: translateStatus(item.status),
            object_name: getTrainNumber(item.impacted_objects),
            text: getMessage(item.messages)
        };

        $scope.list.push(obj);
    });*/

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