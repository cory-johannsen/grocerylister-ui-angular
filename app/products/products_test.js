'use strict';

describe('groceryLister.products module', function() {

  beforeEach(module('groceryLister.products'));

  describe('products controller', function(){

    it('should ....', inject(function($controller) {
      //spec body
      var productsCtrl = $controller('ProductsCtrl');
      expect(productsCtrl).toBeDefined();
    }));

  });
});