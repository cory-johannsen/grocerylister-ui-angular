'use strict';

angular.module('groceryLister.groceryList', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/groceryList', {
    templateUrl: 'groceryList/groceryList.html',
    controller: 'GroceryListCtrl'
  })
}])

.filter('unassignedProducts', function() {
  return function (products) {
    var availableProducts = []

    angular.forEach(products, function(product) {

    //  if (assignedProducts.indexOf(product) == -1) {
        availableProducts.push(product)
    //  }

    })

    return availableProducts
  }
})

.controller('GroceryListCtrl',  ['$scope', '$http', function($scope, $http) {
  $scope.assignProduct = function(product) {

    var response = $http({
      method: 'GET',
      url: $scope.groceryList._links.products.href,
      headers: {
        'Content-Type': 'text/uri-list'
      },
      data: $scope.assignedProducts
    }).then(
        function(data, status, headers, config) {
          console.log("POST successful adding product ", product.name, " to grocery list ", $scope.groceryList.name)
          loadGroceryList($http, $scope)
        },
        function(data, status, headers, config) {
          console.log("POST adding product ", product.name, " to grocery list ", $scope.groceryList.name, data)
        }
    )

  }

  loadGroceryList($http, $scope)
  loadAvailableProducts($http, $scope)

}])

function loadGroceryList(http, scope) {
  http.get("http://localhost:9000/grocerylist?sort=lastModified&size=1")
      .then(
          function(data, status, headers, config) {
            scope.groceryList = data.data._embedded.groceryList[0]
            loadAssignedProducts(http, scope, scope.groceryList)
          },
          function(data, status, headers, config) {
            console.log("GET error fetching grocery list: ", data)
          })
}

function loadAssignedProducts(http, scope, groceryList) {
  http.get(groceryList._links.products.href)
      .then(
          function(data, status, headers, config) {
            scope.assignedProducts = data.data
          },
          function(data, status, headers, config) {
            console.log("GET error fetching products for grocery list: ", groceryList.name)
          })
}

function loadAvailableProducts(http, scope) {
  http.get("http://localhost:9000/product")
      .then(
          function(data, status, headers, config) {
            scope.availableProducts = data.data
          },
          function(data, status, headers, config) {
            console.log("GET error fetching available products: ", data)
          })
}