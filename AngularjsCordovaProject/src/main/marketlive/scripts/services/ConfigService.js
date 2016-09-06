(function (angular) {
    'use strict';

    angular.module('pointOfSaleApplication').service('configService',
        ['$q', '$translate', '$log', 'dataStorageService', 'dataService', 
		function ($q, $translate, $log, dataStorageService, dataService) {

            var typeConfiguration = 'configuration';
            var typeResources = 'resources';

            function isEmptyObject(obj) {
                if (obj !== null) {
                    for (var key in obj) {
                        if (obj.hasOwnProperty(key)) {
                            return false;
                        }
                    }
                }
                return true;
            }

            function getProperties(type) {
				return dataStorageService.getProperties(type);
            }

            function setProperties(type, properties) {
				dataStorageService.setProperties(type, properties);
            }

            function reset(type) {
                var properties = {};
                setProperties(type, properties);
            }

            function initPropertiesResults(type, results) {
                if (results !== null) {
                    var properties = getProperties(type);
                    for (var key in results) {
                        if (results.hasOwnProperty(key)) {
                            properties[key] = results[key];
                        }
                    }
                    setProperties(type, properties);
                }
            }

            function initBootstrapProperties(type, bootstrapPath) {
                var deferred = $q.defer();

                try {
                    var properties = getProperties(type);
                    if (properties === null || properties === undefined) {
                        reset(type);
                    }

                    // Populate sessionStorage with configs when configurations is empty
                    if (isEmptyObject(properties)) {
                        var serviceUrl = '/api/registry/configs/bootstrap?' +
                            'path=' + bootstrapPath + '&configType=' + type;
                        dataService.getData(serviceUrl).then(
                            function (successResult) {
                                if (successResult) {
                                    initPropertiesResults(type, successResult.data);
                                    if (type === typeResources) {
                                        // If type is resources then refresh translation table.
                                        $translate.refresh();
                                    }
                                    deferred.resolve(getProperties(type));
                                }
                            }, function (errorResult) {
                                deferred.reject(errorResult);
                                $log.error(errorResult);
                            }
                        );
                    } else {
                        deferred.resolve(getProperties(type));
                    }
                } catch (err) {
                    deferred.reject(err);
                    $log.error(err);
                }

                return deferred.promise;
            }

            function getProperty(type, path) {
                var properties = getProperties(type);
                return properties[path];
            }

            return {
                init: function () {
                    var deferred = $q.defer(), self = this;

                    self.initProperties(typeConfiguration, 'ppos.bootstrap.properties').then(function () {
                            self.initProperties(typeResources, 'ppos.bootstrap.resources').then(function () {
                                    deferred.resolve({'success': true});
                                },
                                function (errorResult) {
                                    deferred.reject(errorResult);
                                    $log.error(errorResult);
                                });
                        },
                        function (errorResult) {
                            deferred.reject(errorResult);
                            $log.error(errorResult);
                        }
                    );

                    return deferred.promise;
                },
                getConfig: function (path) {
                    try {
                        return getProperty(typeConfiguration, path);
                    } catch (err) {
                        $log.error(err);
                        return path;
                    }
                },
                initProperties: function (type, bootstrapPath) {
                    return initBootstrapProperties(type, bootstrapPath);
                },
                setProperties: function (type, properties) {
                    return setProperties(type, properties);
                },
                reset: function (type) {
                    return reset(type);
                }
            };
        }]);
}(window.angular));
