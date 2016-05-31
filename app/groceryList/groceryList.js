'use strict';

angular.module('groceryLister.groceryList', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/groceryList', {
    templateUrl: 'groceryList/groceryList.html',
    controller: 'GroceryListCtrl'
  })
}])

.filter('unassignedProducts', function() {
      return function (products, groceryList) {
        var out = []

        // Using the angular.forEach method, go through the array of data and perform the operation of figuring out if the language is statically or dynamically typed.
        angular.forEach(products, function(product) {

          if (groceryList.indexOf(product) == -1) {
            out.push(product)
          }

        })

        return out
      }
    }
)

.controller('GroceryListCtrl',  ['$scope', '$http', function($scope, $http) {
  $scope.assignProduct = function(product) {
    $scope.groceryList.products.push(product);
    var response = $http.get("http://localhost:9000/grooceryList/", $scope.groceryList.id, "/products/" )
    response.success(function(data, status, headers, config) {
      $scope.groceryList = data
    })
    response.error(function(data, status, headers, config) {
      console.log("GET error fetching grocery lists: " + data)
    })

  }

  var response = $http.get("http://localhost:9000/current_grocery_list")
  response.success(function(data, status, headers, config) {
    $scope.groceryList = data
  })
  response.error(function(data, status, headers, config) {
    console.log("GET error fetching grocery lists: " + data)
  })

  response = $http.get("http://localhost:9000/product")
  response.success(function(data, status, headers, config) {
    $scope.productList = data._embedded.product
  })
  response.error(function(data, status, headers, config) {
    console.log("GET error fetching grocery lists: " + data)
  })
}])