var ghApp = angular.module('ghApp');

ghApp.service('twService', ['$http', '$q', '$log',
    function($http, $q, $log) {
        var BASE_URL_TEMPLATE = "https://node-twitter-api.herokuapp.com/twitter";

        function _user() {
            var defer = $q.defer();
            var url = BASE_URL_TEMPLATE + '/users/show';
            $http.get(url).then(
                function(response) {
                    $log.debug("Got user response", response);
                    defer.resolve(response.data);
                },
                function(error) {
                    defer.reject(error);
                }
            );
            return defer.promise;
        }

        function _favorites() {
            var defer = $q.defer();
            var url = BASE_URL_TEMPLATE + '/favorites/list';
            $http.get(url).then(
                function(response) {
                    $log.debug("Got favs response", response);
                    defer.resolve(response.data);
                },
                function(error) {
                    defer.reject(error);
                }
            );
            return defer.promise;
        }

        return {
            getUser: _user,
            getFavorites: _favorites
        };
    }
]);
ghApp.controller('twController', ['$scope', 'twService', '$log', '$sce', function($scope, twService, $log, $sce) {
    $scope.twModel = {
        loading: {},
        user: null,
        favorites: null
    };

    function _onError(err) {
        $log.error('Error occurred', err || '?');
    }

    var _processUser = function(data) {
    	var url;
        $scope.twModel.loading.user = false;
        $log.debug('tw user data', data);
        if (data) {
        	url = data.profile_image_url_https || data.profile_image_url;
            $scope.twModel.user = {
                profile_image: url.replace('_normal', '')
            };
        }
    };

    var _processItemsFunctor = function(module) {
        return function(data) {
            $scope.twModel.loading[module] = false;
            if (data && data) {
                $scope.twModel[module] = data;
            }
        }
    };

    var map = {
        user: {
            get: twService.getUser,
            process: _processUser
        },
        favorites: {
            get: twService.getFavorites,
            process: _processItemsFunctor('favorites')
        }
    };

    // run
    var context, getData, processData;
    for (var k in map) {
        context = map[k];
        $scope.twModel.loading[k] = true;
        context
            .get()
            .then(context.process, _onError);
    }

    $scope.trustResource = function(url) {
        return $sce.trustAsResourceUrl(url);
    }

}]);
