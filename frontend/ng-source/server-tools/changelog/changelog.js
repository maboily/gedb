angular.module('changelog', [

])
    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider
            .state('app.server-tools.changelog', {
                url: '/changelog',
                templateUrl: 'server-tools/changelog/changelog-index.html',
                controller: 'ChangelogCtrl',
                ncyBreadcrumb: {
                    label: 'Server Changelog'
                }
            })
    }])

    .controller('ChangelogCtrl', ['$scope', 'ChangelogService',
        function ($scope, ChangelogService) {
            $scope.currentChangelog = {};
            $scope.editingChangelog = {};
            $scope.revisions = [];
            $scope.metadata = {};
            $scope.isEditing = false;
            $scope.searchSettings = {
                elementsPerPage: 5,
                orderBy: 'created_at'
            };

            // Attempts to load default changelog
            $scope.refreshList = function(loadDefaultChangelog) {
                ChangelogService.getList($scope.searchSettings).success(function(res) {
                    $scope.revisions = res.data;
                    $scope.metadata = res.metadata;

                    if (loadDefaultChangelog) {
                        for (var revisionIdx in $scope.revisions) {
                            var revision = $scope.revisions[revisionIdx];

                            if (revision.is_current == true) {
                                $scope.loadChangelog(revision.id);
                                break;
                            }
                        }
                    }
                });
            };

            $scope.initializeAceEditor = function() {
                if (!$scope.editor) {
                    $scope.editor = ace.edit("changelog-editor");
                    $scope.editor.setTheme("ace/theme/twilight");
                    $scope.editor.getSession().setMode("ace/mode/markdown");
                }
            };

            // Loads a changelog entry
            $scope.loadChangelog = function(changelogId) {
                ChangelogService.get(changelogId).success(function(res) {
                     $scope.currentChangelog = res.data;
                });
            };

            // Opens up edit mode to create a new changelog
            $scope.createNewChangelog = function() {
                $scope.isEditing = true;
                $scope.editingChangelog = {
                    id: -1,
                    is_current: true,
                    title: '',
                    content: ''
                };

                $scope.initializeAceEditor();
            };

            // Opens up edit mode to edit current changelog
            $scope.editCurrentRevision = function() {
                $scope.isEditing = true;
                $scope.editingChangelog = $scope.currentChangelog;

                $scope.initializeAceEditor();
                $scope.editor.getSession().setValue($scope.editingChangelog.content);
            };

            // Ask for confirmation before definitly deleting a changelog revision
            $scope.deleteCurrentRevision = function() {
                if (confirm('Are you sure you want to delete definitively the current changelog revision?')) {
                    ChangelogService.destroy($scope.currentChangelog).then(function() {
                        // Reloads changelogs
                        $scope.refreshList();

                        // Clears currently loaded changelog
                        $scope.currentChangelog = {};
                    });
                }
            };

            // Saves current changes for the changelog
            $scope.saveChanges = function() {
                $scope.isEditing = false;
                $scope.editingChangelog.content = $scope.editor.getSession().getValue();

                if ($scope.editingChangelog.id == -1) {
                    ChangelogService.store($scope.editingChangelog).then(function() {
                        $scope.refreshList();
                    });
                } else {
                    ChangelogService.update($scope.editingChangelog).then(function() {
                        $scope.refreshList();
                    });
                }
            };

            // Cancels editing
            $scope.cancelChanges = function() {
                $scope.isEditing = false;
                $scope.editingChangelog = {};
            };

            $scope.refreshList(true);
        }])


    .factory('ChangelogService', ['$http', function($http) {
        return {
            /** Gets a shortened listing of available changelogs. */
            getList: function (parameters) {
                return $http
                    .get('/changelogs', {
                        params: parameters
                    });
            },
            /** Gets a single detailed changelog entry */
            get: function (id) {
                return $http
                    .get('/changelogs/' + id);
            },
            /** Attempts to update the specified changelog in database */
            update: function (changelogData) {

                return $http({
                    method: 'PATCH',
                    url: '/changelogs/' + changelogData.id,
                    data: changelogData});
            },
            /** Attempts to create the specified changelog in database */
            store: function(changelogData) {
                return $http
                    .post('/changelogs', changelogData);
            },
            destroy: function(changelogData) {
                return $http
                    .delete('/changelogs/' + changelogData.id);
            }
        }
    }]);