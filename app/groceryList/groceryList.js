'use strict';

angular.module('groceryLister.groceryList', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/groceryList', {
    templateUrl: 'groceryList/groceryList.html',
    controller: 'GroceryListCtrl'
  })
}])

.filter('unassignedProducts', function() {
  return function (products, assignedProducts) {
    var availableProducts = []

    angular.forEach(products, function(product) {
      if (assignedProducts) {
        var result = assignedProducts._embedded.product.filter(
          function(assignedProduct) {
            return assignedProduct._links.self.href === product._links.self.href
          }
        )
        if (!result || result.length === 0) {
          availableProducts.push(product)
        }
      }
    })

    return availableProducts
  }
})

.controller('GroceryListCtrl',  ['$scope', '$http', function($scope, $http) {
  const API_ENDPOINT = 'http://grocerylister.api.johannsen.cloud:9000'
  $scope.assignProduct = function(product) {
    $http({
      method: 'POST',
      url: $scope.groceryList._links.products.href,
      headers: {
        'Content-Type': 'text/uri-list'
      },
      data: product._links.self.href
    }).then(
        function(data, status, headers, config) {
          console.log("POST successful adding product", product.name, "to grocery list", $scope.groceryList.name)
          loadGroceryList($http, $scope, API_ENDPOINT)
          loadAvailableProducts($http, $scope, API_ENDPOINT)
        },
        function(data, status, headers, config) {
          console.log("POST failed adding product", product.name, "to grocery list", $scope.groceryList.name, data)
          loadGroceryList($http, $scope, API_ENDPOINT)
          loadAvailableProducts($http, $scope, API_ENDPOINT)
        }
    )

  }

  $scope.removeProduct = function(product) {
    var assignedProducts = []
    angular.forEach($scope.assignedProducts._embedded.product, function(assignedProduct) {
      if (assignedProduct._links.self.href !== product._links.self.href) {
        assignedProducts.push(assignedProduct._links.self.href)
      }
    })
    var dataString = assignedProducts.join('\n');

    $http({
      method: 'PUT',
      url: $scope.groceryList._links.products.href,
      headers: {
        'Content-Type': 'text/uri-list'
      },
      data: dataString
    }).then(
      function(data, status, headers, config) {
        console.log("DELETE successful removing product", product.name, "from grocery list", $scope.groceryList.name)
        loadGroceryList($http, $scope, API_ENDPOINT)
        loadAvailableProducts($http, $scope, API_ENDPOINT)
      },
      function(data, status, headers, config) {
        console.log("DELETE failed adding product", product.name, "from grocery list", $scope.groceryList.name, data)
        loadGroceryList($http, $scope, API_ENDPOINT)
        loadAvailableProducts($http, $scope, API_ENDPOINT)
      }
    )
  }

  loadGroceryList($http, $scope, API_ENDPOINT)
  loadAvailableProducts($http, $scope, API_ENDPOINT)

}])

function loadGroceryList(http, scope, apiEndpoint) {
  http.get(apiEndpoint + "/grocerylist?sort=lastModified&size=1")
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

function loadAvailableProducts(http, scope, apiEndpoint) {
  http.get(apiEndpoint + "/product?size=1000")
      .then(
          function(data, status, headers, config) {
            scope.availableProducts = data.data
          },
          function(data, status, headers, config) {
            console.log("GET error fetching available products: ", data)
          })
}