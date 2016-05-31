'use strict';

angular.module('groceryLister.groceryLists', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/groceryLists', {
    templateUrl: 'groceryLists/groceryLists.html',
    controller: 'GroceryListsCtrl'
  });
}])

.controller('GroceryListsCtrl',  ['$scope', '$http', function($scope, $http) {
  $scope.addGroceryList = function() {
    const groceryList = {name: $scope.groceryListName}

    var response = $http.post("http://localhost:9000/grocerylist", groceryList)
    response.success(function(data, status, headers, config) {
    })
    response.error(function(data, status, headers, config) {
      console.log("POST error: " + data)
    })
    $scope.groceryLists.push(groceryList)
  }

  $http.get("http://localhost:9000/grocerylist").
  success(function(data, status, headers, config) {
    $scope.groceryLists = data._embedded.groceryList
  }).
  error(function(data, status, headers, config) {
    console.log("GET error fetching grocery lists: " + data)
  })
}]);