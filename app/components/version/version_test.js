'use strict';

describe('groceryLister.version module', function() {
  beforeEach(module('groceryLister.version'));

  describe('version service', function() {
    it('should return current version', inject(function(version) {
      expect(version).toEqual('0.1');
    }));
  });
});
