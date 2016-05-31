'use strict';

angular.module('groceryLister.products', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/products', {
    templateUrl: 'products/products.html',
    controller: 'ProductsCtrl'
  })
}])

.controller('ProductsCtrl', ['$scope', '$http', function($scope, $http) {
    $scope.productSortBy='name'

    $scope.addProduct = function() {
        const product = {name: $scope.productName, department: $scope.productDepartment}

        var response = $http.post("http://localhost:9000/product", product)
        response.success(function(data, status, headers, config) {

        })
        response.error(function(data, status, headers, config) {
            console.log("POST error: " + data)
        })
        $scope.products.push(product)
    }

    $scope.sortProducts = function(sortBy) {
        $scope.productSortBy = sortBy
    }
    
    $http.get("http://localhost:9000/departments").
    success(function(data, status, headers, config) {
        $scope.departments = data
    }).
    error(function(data, status, headers, config) {
        console.log("GET error fetching departments: " + data)
    })

    $http.get("http://localhost:9000/product").
    success(function(data, status, headers, config) {
      const products = data._embedded.product
      $scope.products = products
    }).
    error(function(data, status, headers, config) {
        console.log("GET error fetching products: " + data)
    })
}])
