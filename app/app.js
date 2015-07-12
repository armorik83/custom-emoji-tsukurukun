import angular from 'angular';
import 'angular-route';

import {appName, plugins} from './constants';

angular.module(appName, plugins);

function appConfig($routeProvider) {
  $routeProvider
    .when('/', {template: '<ce-app></ce-app>'})
    .when('/:character', {template: '<ce-app></ce-app>'});
}

appConfig.$inject = ['$routeProvider'];

angular.module(appName).config(appConfig);
