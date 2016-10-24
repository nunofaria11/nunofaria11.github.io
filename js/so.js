var ghApp = angular.module('ghApp');

ghApp.service('soService', ['$http', '$q', '$log', 'ApiIds',
    function($http, $q, $log, ApiIds) {
        // https://api.stackexchange.com/2.2/users/691916?site=stackoverflow&order=desc&sort=reputation&filter=default
        var BASE_URL_TEMPLATE = "https://api.stackexchange.com/{version}";
        // add fields
        var soBaseUrlData = {
            version: '2.2',
            userId: ApiIds.soId
        };
        // add args
        var soBaseUrlArgs = {
            site: 'stackoverflow',
            pagesize: 10
        };
        // fill fields
        function setDataInUrl(url) {
            var k, v, field, resultUrl = url;
            for (k in soBaseUrlData) {
                v = soBaseUrlData[k];
                field = '{' + k + '}';
                resultUrl = resultUrl.replace(field, v);
            }
            return resultUrl;
        }

        function setDataInUrl(url) {
            var k, v, field, resultUrl = url;
            for (k in soBaseUrlData) {
                v = soBaseUrlData[k];
                field = '{' + k + '}';
                resultUrl = resultUrl.replace(field, v);
            }
            return resultUrl;
        }

        // Fill args
        function setArgs(url, args) {
            var k, v, field, resultUrl = url;
            for (k in args) {
                v = args[k];
                field = k + '=' + v + '&'; // its ok if this is the last arg
                resultUrl += field;
            }
            return resultUrl;
        }

        var _user = function() {
            var url = setDataInUrl(BASE_URL_TEMPLATE + '/users/{userId}?site=stackoverflow');
            var defer = $q.defer();
            $http.get(url).then(
                function(result) {
                    defer.resolve(result.data);
                },
                function(err) {
                    $log.error('Error on user:', err || '?');
                    defer.reject(err);
                });
            return defer.promise;
        };

        var _data = function(func) {
            var url = setDataInUrl(BASE_URL_TEMPLATE + '/users/{userId}/' + func + '?');
            var questionsArgs = {
                site: 'stackoverflow',
                pagesize: 10,
                sort: 'votes',
                order: 'desc'
            };
            url = setArgs(url, questionsArgs);
            var defer = $q.defer();
            $http.get(url).then(
                function(result) {
                    defer.resolve(result.data);
                },
                function(err) {
                    $log.error('Error on questions:', err || '?');
                    defer.reject(err);
                });
            return defer.promise;
        };

        var _questions = function() {
            // 2.2/users/691916/questions?pagesize=10&order=desc&sort=activity&site=stackoverflow
            return _data('questions');
        };
        var _favorites = function() {
            // 2.2/users/691916/favorites?order=desc&sort=activity&site=stackoverflow
            return _data('favorites');
        };
        var _answers = function() {
            // todo
        };
        var _tags = function() {
            // todo
        };
        return {
            getUser: _user,
            getQuestions: _questions,
            getFavorites: _favorites
                /*
                getAnswers: _answers,
                getTags: _tags,*/
        };
    }
]);
ghApp.controller('soController', ['$scope', 'soService', '$log', '$sce', function($scope, soService, $log, $sce) {
    $scope.soModel = {
        loading: {},
        user: null,
        questions: null,
        favorites: null
    };

    function _onError(err) {
        $log.error('Error occurred', err || '?');
    }

    var _processUser = function(data) {
        $scope.soModel.loading.user = false;
        $log.debug('so user data', data);
        if (data && data.items && data.items.length === 1) {
            $scope.soModel.user = data.items[0];
        }
    };

    var _processItemsFunctor = function(module) {
        return function(data) {
            $scope.soModel.loading[module] = false;
            if (data && data.items) {
                $scope.soModel[module] = data.items;
            }
        }
    };

    var map = {
        user: {
            get: soService.getUser,
            process: _processUser
        },
        questions: {
            get: soService.getQuestions,
            process: _processItemsFunctor('questions')
        },
        favorites: {
            get: soService.getFavorites,
            process: _processItemsFunctor('favorites')
        }
    };

    // run
    var context, getData, processData;
    for (var k in map) {
        context = map[k];
        $scope.soModel.loading[k] = true;
        context
            .get()
            .then(context.process, _onError);
    }
    
    $scope.trustResource = function(url) {
        return $sce.trustAsResourceUrl(url);
    }

}]);
