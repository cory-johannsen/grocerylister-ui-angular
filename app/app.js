'use strict';

// Declare app level module which depends on views, and components
angular.module('groceryLister', [
  'ngRoute',
  'groceryLister.products',
  'groceryLister.groceryList',
  'groceryLister.version'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.otherwise({redirectTo: '/products'});
}]);
