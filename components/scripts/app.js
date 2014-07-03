var app = angular.module('app', ['mm.foundation']);

app.controller('appCtrl', ['$scope', '$http',

    function($scope, $http) {
        console.log('app controller');
    }
]);