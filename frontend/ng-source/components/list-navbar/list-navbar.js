angular.module('components.list-navbar', [])

    .directive('listNavbar', [
        function () {
            return {
                restrict: 'E',
                scope: { },
                transclude: true,
                link: function ($scope) {

                },
                templateUrl: 'components/list-navbar/list-navbar.html'
            }
        }
    ])

    .directive('listNavbarSection', [
        function () {
            return {
                restrict: 'E',
                scope: {
                    side: '=side'
                },
                transclude: true,
                link: function ($scope) {

                },
                templateUrl: 'components/list-navbar/list-navbar-section.html'
            }
        }
    ])

    .directive('listNavbarSorting', [
        function () {
            return {
                restrict: 'E',
                scope: {
                    metadata: '=metadata',
                    availableSorts: '=availableSorts',
                    currentSortName: '=currentSortName',
                    currentSortDirection: '=currentSortDirection',
                    sortUpdated: '&sortUpdated'
                },
                link: function ($scope) {
                    $scope.signalSortUpdated = function(sortName, sortDirection) {
                        $scope.sortUpdated({ sortName: sortName, sortDirection: sortDirection });
                    }
                },
                templateUrl: 'components/list-navbar/list-navbar-sorting.html'
            }
        }
    ])

    .directive('listNavbarPaging', [
        function () {
            return {
                restrict: 'E',
                scope: {
                    currentPaging: '=currentPaging',
                    availablePaging: '=availablePaging',
                    pagingUpdated: '&pagingUpdated'
                },
                link: function ($scope) {
                    $scope.signalPagingUpdated = function(paging) {
                        $scope.pagingUpdated({ paging: paging });
                    }
                },
                templateUrl: 'components/list-navbar/list-navbar-paging.html'
            }
        }
    ])


    .directive('listNavbarGrouping', [
        function () {
            return {
                restrict: 'E',
                scope: {
                    currentGroupingName: '=currentGroupingName',
                    currentGroupingDirection: '=currentGroupingDirection',
                    metadata: '=metadata',
                    noneFilterEnabled: '=noneFilterEnabled',
                    groupingUpdated: '&groupingUpdated'
                },
                link: function ($scope) {
                    $scope.signalGroupingUpdated = function(groupingName, groupingDirection) {
                        $scope.groupingUpdated({ groupingName: groupingName, groupingDirection: groupingDirection });
                    }
                },
                templateUrl: 'components/list-navbar/list-navbar-grouping.html'
            }
        }
    ])


    .directive('listNavbarFilters', [
        function () {
            return {
                restrict: 'E',
                scope: {
                    activeFilters: '=activeFilters',
                    metadata: '=metadata',
                    customFiltersVisible: '=customFiltersVisible',
                    filtersUpdated: '&filtersUpdated'
                },
                transclude: true,
                link: function ($scope) {
                    $scope.signalFiltersUpdated = function(filters) {
                        $scope.filtersUpdated({ filters: filters });
                    }
                },
                templateUrl: 'components/list-navbar/list-navbar-filters.html'
            }
        }
    ])

