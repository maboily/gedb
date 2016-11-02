angular.module('database.skills', [])
    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider
            .state('app.database.skills', {
                url: '/skills',
                templateUrl: 'database/skills/skills-list.html',
                controller: 'SkillCtrl',
                ncyBreadcrumb: {
                    label: 'Skills'
                },
                data: {
                    requiredPermission: 'database.skills.view'
                }
            })

            .state('app.database.skills.view', {
                url: '/:id',
                templateUrl: 'database/skills/skills-view.html',
                controller: 'SkillViewCtrl',
                ncyBreadcrumb: {
                    label: 'View Skill'
                },
                data: {
                    requiredPermission: 'database.skills.view'
                }
            })
    }])

    .factory('SkillsDatabaseService', ['$q', 'ngProgress',
        function ($q, ngProgress) {
            return {
                constructLevelsHTML : function(skill) {
                    var levelsHTML = {};

                    // Gets ATK multiplier per level
                    var ATKPerLevel = skill.SklATK / 10;

                    // Goes level by level (up to 15)
                    for (var l = 1; l <= 15; l++) {
                        levelsHTML['Level' + l] = '';

                        // Checks if skill should have an attack
                        if (skill.SklATK && skill.SklATK > 0 && skill.SklATK != 1) {
                            levelsHTML['Level' + l] += Math.round((skill.SklATK / 1 + ATKPerLevel * l) * 100) + '% ATK<br />';
                        }

                        // Additional effects
                        if (skill['SpecDesc' + l] && skill['SpecDesc' + l] != 'None') {
                            levelsHTML['Level' + l] += this.parseIMCTags(skill['SpecDesc' + l]) + '<br />';
                        }

                        if (levelsHTML['Level' + l] == '') {
                            levelsHTML['Level' + l] = '<em>No information</em>';
                        }

                    }

                    return levelsHTML;
                },
                constructUsageHTML: function(skill) {
                    // We bind this as HTML, or else it would take up too much resources, and it doesn't change anyway
                    var usageHTML = '';

                    // Targeting
                    if (skill.OnTeam == 'YES')
                        usageHTML += '<li>Usable on Family</li>';

                    if (skill.OnOthers == 'YES')
                        usageHTML += '<li>Usable on Other than Self</li>';

                    if (skill.OnParty == 'YES')
                        usageHTML += '<li>Usable on Clan Members</li>';

                    if (skill.OnSummon == 'YES')
                        usageHTML += '<li>Usable on Summons</li>';

                    if (skill.OnSquad == 'YES')
                        usageHTML += '<li>Usable on Squad</li>';

                    if (skill.OnCorpse == 'YES')
                        usageHTML += '<li>Usable on Corpse</li>';

                    if (skill.OnEnemy == 'YES')
                        usageHTML += '<li>Usable on Enemies</li>';

                    if (skill.OnAll == 'YES')
                        usageHTML += '<li>Usable on Everything</li>';

                    // Range
                    if (skill.MinR > 1 && skill.MaxR > 0)
                        usageHTML += '<li>Targets between ' + (skill.MinR / 100) + 'm and ' + (skill.MaxR / 100) + 'm range</li>';
                    else if (skill.MaxR > 1000)
                        usageHTML += '<li>Targets up to ' + (skill.MaxR / 100) + 'm range</li>';
                    else
                        usageHTML += '<li>Targets point-blank</li>';


                    // Affected targets
                    if (skill.SplType == 'None')
                        usageHTML += '<li>Single target</li>';
                    else if (skill.SplType == 'Circle')
                        usageHTML += '<li>Affects ' + skill.SplLimit + ' target(s) within a ' + (skill.SplashRange / 100) + 'm radius</li>';
                    else if (skill.SplType == 'Square')
                        usageHTML += '<li>Affects ' + skill.SplLimit + ' target(s) within a ' + (skill.SplashRange / 100) + 'm wide rectangle</li>';



                    return usageHTML;
                },
                constructAdditionalStatsHTML: function(skill) {
                    // We bind this as HTML, or else it would take up too much resources, and it doesn't change anyway
                    var additionalStatsHTML = '';

                    // Hate Amount
                    additionalStatsHTML += '<li>Generates ' + skill.HateAmnt + ' Hate upon usage</li>';

                    // Target-holding
                    if (skill.HoldTarget == 'BOTH')
                        additionalStatsHTML += '<li>Holds all affected targets and caster during usage</li>';
                    else if (skill.HoldTarget == 'SELF')
                        additionalStatsHTML += '<li>Holds caster during usage</li>';
                    else if (skill.HoldTarget == 'HOLD')
                        additionalStatsHTML += '<li>Holds only affected targets during usage</li>';

                    // SP/HP Cost
                    if (skill.SpendSP > 0)
                        additionalStatsHTML += '<li>Spend ' + skill.SpendSP + ' SP upon usage</li>';
                    if (skill.SpendHP > 0)
                        additionalStatsHTML += '<li>Spend ' + skill.SpendHP + ' HP upon usage</li>';

                    return additionalStatsHTML;
                },
                parseIMCTags: function(text) {
                    return text
                        // Special tags replace: replace {*br*} and \n to <br />
                        .replace(/(([{][\/ ]{0,}br[\/ ]{0,}[}])|\\n)/g, '<br />')

                        // Special tags replace: remove all non {*br*}
                        .replace(/({[^{]{1,}})/g, '');
                },
                refreshList: function(sendToServer, service) {
                    var deferred = $q.defer();

                    ngProgress.start();

                    service.getList(sendToServer)
                        .success(function (res, status) {
                            // Store data and metadata information
                            var response = res;

                            // Surrounds data by a fake group if there was no group specified
                            if (sendToServer.groupBy == '') {
                                response.data = [{groupName: '', data: res.data}];
                            }

                            ngProgress.complete();
                            deferred.resolve(response);
                        })
                        .error(function (res, status) {
                            $rootScope.addAlert(res.data, 'error');
                            ngProgress.complete();
                            deferred.reject();
                        });

                    return deferred.promise;
                }
            }
        }])

    .controller('SkillCtrl', ['$scope', '$rootScope', '$timeout', 'SkillService', 'HistoryService', 'FilterService', 'ListService', 'SkillsDatabaseService', 'ngProgress',
        function ($scope, $rootScope, $timeout, SkillService, HistoryService, FilterService, ListService, SkillsDatabaseService, ngProgress) {
            $scope.pageLoaded = false;
            $scope.refreshTimeout = null;
            $scope.activeFilters = HistoryService.loadOrCreate('database.items.skills.filters', {});
            $scope.searchSettings = HistoryService.loadOrCreate('database.items.skills.searchSettings', {
                elementsPerPage: 10,
                page: 1,
                orderBy: 'Name',
                orderDirection: 'Asc',
                groupBy: 'SkillType',
                groupOrderDirection: 'Asc'
            });
            $scope.simpleFilters = HistoryService.loadOrCreate('database.items.skills.simpleFilters', {
                nameContains: '',
                skillType: ''
            });

            // Recalls data that came from last page's visit
            $scope.data = HistoryService.loadOrCreate('database.items.skills.data', null);
            $scope.metadata = HistoryService.loadOrCreate('database.items.skills.metadata', null);

            // Auto-refresh list when the search settings are changed
            $scope.$watch('searchSettings', function (newValue, oldValue) {
                if (newValue !== oldValue || $scope.data == null) {
                    HistoryService.save('database.items.skills.searchSettings', $scope.searchSettings);
                    $scope.pendRefresh();
                }
            }, true);

            // Auto-refresh list when the filters are changed
            $scope.$watch('activeFilters', function(newValue, oldValue) {
                if (newValue !== oldValue || $scope.data == null) {
                    HistoryService.save('database.items.skills.filters', $scope.activeFilters);
                    $scope.pendRefresh();
                }
            }, true);

            // Saves simple filters
            $scope.$watch('simpleFilters', function(newValue, oldValue) {
                if (newValue !== oldValue || $scope.data == null) {
                    HistoryService.save('database.items.skills.simpleFilters', $scope.simpleFilters);
                }
            }, true);

            // Recompile custom simple filters for this item's database
            $scope.recompileSimpleFilters = function () {
                var filters = [];

                if ($scope.simpleFilters.nameContains != '')
                    filters.push(FilterService.createFilter('Name', 'like', '%' + $scope.simpleFilters.nameContains + '%'));

                if ($scope.simpleFilters.skillType != '')
                    filters.push(FilterService.createFilter('SkillType', 'like', '%' + $scope.simpleFilters.skillType + '%'));

                $scope.activeFilters = FilterService.compileFiltersForServer(filters);
                $scope.filtersUpdated($scope.activeFilters);
            };

            $scope.pendRefresh = function() {
                $scope.listLoading = true;
                clearTimeout($scope.refreshTimeout);
                $scope.refreshTimeout = setTimeout(function() {
                    $scope.$apply();
                    $scope.refreshList();
                }, 300);
            };

            // Filters update request from navbar/simple filters
            $scope.filtersUpdated = function (filters) {
                $scope.activeFilters = filters;
            };

            // Group update request from navbar
            $scope.groupingUpdated = function (groupingName, groupingDirection) {
                $scope.searchSettings.groupBy = groupingName;
                $scope.searchSettings.groupOrderDirection = groupingDirection;
            };

            // Paging update request from navbar
            $scope.pagingUpdated = function (paging) {
                $scope.searchSettings.elementsPerPage = paging;
            };

            // Sort update request from navbar
            $scope.sortUpdated = function (sortName, sortDirection) {
                $scope.searchSettings.orderBy = sortName;
                $scope.searchSettings.orderDirection = sortDirection;
            };

            // Refreshes skill's list
            $scope.refreshList = function () {
                $scope.listLoading = true;

                // Data to send to server
                var sendToServer = ListService.prepareDataForServer(angular.extend({}, $scope.searchSettings, $scope.activeFilters));

                SkillsDatabaseService.refreshList(sendToServer, SkillService).then(function(response) {
                    // Fills in data
                    $scope.data = response.data;
                    $scope.metadata = response.metadata;

                    // Saves data
                    HistoryService.save('database.items.skills.data', $scope.data);
                    HistoryService.save('database.items.skills.metadata', $scope.metadata);

                    // Post-processing
                    $scope.postProcessRefresh();

                    // We use $timeout here to ensure digest cycle has finished before declaring the list as loaded
                    $timeout(function () {
                        $scope.listLoading = false;
                    });
                });
            };

            // Post-process columns after a refresh
            $scope.postProcessRefresh = function() {
                for (var groupIdx in $scope.data) {
                    // Group name
                    $scope.data[groupIdx].translatedGroupName = $scope.data[groupIdx].groupName;

                    for (var dataIdx in $scope.data[groupIdx].data) {
                        // Image file name (to lowercase)
                        $scope.data[groupIdx].data[dataIdx].ImgFileName = $scope.data[groupIdx].data[dataIdx].FileName.toLowerCase();

                        // Special tags replace: prepare ParsedDesc
                        $scope.data[groupIdx].data[dataIdx].ParsedDesc = SkillsDatabaseService.parseIMCTags($scope.data[groupIdx].data[dataIdx].Desc);

                        // Usage HTML
                        $scope.data[groupIdx].data[dataIdx].UsageHTML = SkillsDatabaseService.constructUsageHTML($scope.data[groupIdx].data[dataIdx]);

                        // Additional Stats HTML
                        $scope.data[groupIdx].data[dataIdx].AdditionalStatsHTML = SkillsDatabaseService.constructAdditionalStatsHTML($scope.data[groupIdx].data[dataIdx]);

                        // Levels HTML
                        $scope.data[groupIdx].data[dataIdx].LevelsHTML = SkillsDatabaseService.constructLevelsHTML($scope.data[groupIdx].data[dataIdx]);
                    }
                }
            };
        }])

    .controller('SkillViewCtrl', ['$scope', '$stateParams', 'SkillService', 'SkillsDatabaseService',
        function ($scope, $stateParams, SkillService, SkillsDatabaseService) {
            // Loads information from service
            $scope.data = {};

            $scope.loadData = function (id) {
                $scope.itemLoading = true;
                SkillService.get(id)
                    .success(function (res) {
                        $scope.data = res.data;
                        $scope.postProcessRefresh();
                        $scope.itemLoading = false;
                    });
            };

            // Post-process columns after a refresh
            $scope.postProcessRefresh = function() {
                // Image file name (to lowercase)
                $scope.data.ImgFileName = $scope.data.FileName.toLowerCase();

                // Special tags replace: prepare ParsedDesc
                $scope.data.ParsedDesc = SkillsDatabaseService.parseIMCTags($scope.data.Desc);

                // Usage HTML
                $scope.data.UsageHTML = SkillsDatabaseService.constructUsageHTML($scope.data);

                // Additional Stats HTML
                $scope.data.AdditionalStatsHTML = SkillsDatabaseService.constructAdditionalStatsHTML($scope.data);

                // Levels HTML
                $scope.data.LevelsHTML = SkillsDatabaseService.constructLevelsHTML($scope.data);
            };

            $scope.loadData($stateParams.id);
        }])

    .factory('SkillService', ['$http',
        function ($http) {
            return {
                /** Gets a shortened listing of available skills. */
                getList: function (parameters) {
                    return $http
                        .get('/skills', {
                            params: parameters
                        });
                },
                /** Gets a single detailed skill entry */
                get: function (id) {
                    return $http
                        .get('/skills/' + id);
                }
            }
        }]);
