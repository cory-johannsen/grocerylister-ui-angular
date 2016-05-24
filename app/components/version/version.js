'use strict';

angular.module('groceryLister.version', [
  'groceryLister.version.interpolate-filter',
  'groceryLister.version.version-directive'
])

.value('version', '0.1');
