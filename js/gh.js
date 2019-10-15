var ghApp = angular.module('ghApp');
// Data converter
ghApp.service('ghData', [function() {

    var URLS_KEYS = ['languages_url', 'tags_url'];

    return {
        convertToRepo: function(data) {
            var r = new Repo(data);
            URLS_KEYS.forEach(function(urlKey) {
                var dataUrl = URLS_KEYS[urlKey];
                if (dataUrl) {
                    r.urls.push(dataUrl);
                }
            });
            return r;
        },
        convertToLang: function(lang, value) {
            return new Lang(lang, value);
        },
        /**
         * Join all languages and sums the bytes values for each lang
         */
        joinAllLangs: function(langs) {
            var i, lang, bytes, all = {};
            for (i = 0; langs.length; i++) {
                lang = langs[i];
                if (!all[lang.name]) {
                    all[lang.name] = 0;
                }
                bytes = all[lang.name];
                all[lang.name] = bytes + lang.bytes;
            }
            var resultLang, resultLangs = [];
            for (var n in all) {
                resultLang = new Lang(n, all[n]);
                resultLangs.push(resultLang);
            }
            return resultLangs;
        }
    };
}]);

// Access to GitHub API
ghApp.service('ghService', ['$http', '$q', '$log', 'ApiIds',

    function($http, $q, $log, ApiIds) {
        var BASE_URL = "https://api.github.com/users/{user}";
        var URL = BASE_URL.replace(/\{user\}/g, ApiIds.ghId);
        // Get repositories
        var _repos = function() {
            var defer = $q.defer();
            $http.get(URL + '/repos')
                .then(
                    function(response) {
                        defer.resolve(response.data);
                    },
                    function(error) {
                        // process error
                        $log.error('an error occurred when getting repos');
                        defer.reject(error);
                    });
            return defer.promise;
        };
        // Get languages for all urls
        var _langs = function(urls) {
            // convert all data to langs and join all langs
            // TODO... (?)
        };

        return {
            getRepos: _repos,
            getLangs: _langs
        };
    }
]);

// Controller
ghApp.controller('ghController', ['$scope', 'ghService', 'ghData', '$timeout',
    function($scope, ghService, ghData, $timeout) {
        $scope.repoModel = {
            loading: false,
            repos: null
        };
        $scope.init = function() {
            $scope.repoModel.loading = true;
            ghService.getRepos()
                .then(
                    function(reposData) {
                        if (reposData) {
                            var i, repo, repos = [];
                            for (i = 0; i < reposData.length; i++) {
                                if (!repo.archived) {
                                    repo = ghData.convertToRepo(reposData[i]);
                                    repos.push(repo);
                                }
                            }
                            $scope.repoModel.repos = repos;
                            $scope.repoModel.loading = false;
                        }
                    });
        };
        $scope.init();

    }
]);
