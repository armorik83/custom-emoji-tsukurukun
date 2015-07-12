import angular from 'angular';
import 'angular-route';

import {appName, plugins} from './constants';

angular.module(appName, plugins);

function appConfig($locationProvider, $routeProvider) {
  $locationProvider.html5Mode(true);

  $routeProvider
    .when('/', {template: '<ce-app></ce-app>'})
    .when('/:character', {template: '<ce-app></ce-app>'});
}

appConfig.$inject = ['$locationProvider', '$routeProvider'];

angular.module(appName).config(appConfig);
