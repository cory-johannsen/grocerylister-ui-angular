'use strict';

angular.module('groceryLister.products', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/products', {
    templateUrl: 'products/products.html',
    controller: 'ProductsCtrl'
  });
}])

.controller('ProductsCtrl', ['$scope', '$http', function($scope, $http) {
  $http.get("http://localhost:9000/product?callback=JSON_CALLBACK").
    success(function(data, status, headers, config) {
      $scope.products = data._embedded.product;
    }).
    error(function(data, status, headers, config) {
        // log error
    });
}]);
