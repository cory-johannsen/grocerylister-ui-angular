'use strict';

angular.module('groceryLister.products', [
  'ngRoute']
)

  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/products', {
      templateUrl: 'products/products.html',
      controller: 'ProductsCtrl'
    })
  }])

  .controller('ProductsCtrl', ['$scope', '$http', function ($scope, $http) {
    const API_ENDPOINT = 'http://grocerylister.api.johannsen.cloud:9000'
    $scope.productSortBy = 'name'

    $scope.addProduct = function () {
      const product = {name: $scope.productName, department: $scope.productDepartment}

      $http.post(API_ENDPOINT + "/product", product)
        .then(
          function (data, status, headers, config) {
            loadProducts($http, $scope, API_ENDPOINT)
          },
          function (data, status, headers, config) {
            console.log("POST error: " + data)
          }
        )
      $scope.products.push(product)
    }

    $scope.deleteProduct = function (product) {
      $http.delete(product._links.self.href)
        .then(
          function (data, status, headers, config) {
            console.log("DELETE successful deleting product: " + product.name)
            loadProducts($http, $scope, API_ENDPOINT)
          },
          function (data, status, headers, config) {
            console.log("DELETE error deleting product: " + product.name)
          }
        )
    }

    $scope.sortProducts = function (sortBy) {
      $scope.productSortBy = sortBy
    }

    $http.get(API_ENDPOINT + "/departments")
      .then(
        function (data, status, headers, config) {
          $scope.departments = data.data
        },
        function (data, status, headers, config) {
          console.log("GET error fetching departments: " + data)
        }
      )

    loadProducts($http, $scope, API_ENDPOINT)
  }])

function loadProducts(http, scope, apiEndpoint) {
  http.get(apiEndpoint + "/product")
    .then(
      function (data, status, headers, config) {
        const products = data.data._embedded.product
        scope.products = products
      },
      function (data, status, headers, config) {
        console.log("GET error fetching products: " + data)
      }
    )
}