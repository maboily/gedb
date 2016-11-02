angular.module('blog', [

])
    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider
            .state('app.blog', {
                url: '/blog',
                templateUrl: 'blog/blog-index.html',
                controller: 'BlogCtrl',
                ncyBreadcrumb: {
                    label: 'Blog'
                }
            })
            .state('app.blog.new', {
                url: '/new',
                templateUrl: 'blog/blog-edit.html',
                controller: 'BlogEditCtrl',
                ncyBreadcrumb: {
                    label: 'Create new blog post'
                }
            })
            .state('app.blog.edit', {
                url: '/edit/:id',
                templateUrl: 'blog/blog-edit.html',
                controller: 'BlogEditCtrl',
                ncyBreadcrumb: {
                    label: 'Edit blog post'
                }
            })
    }])

    .controller('BlogCtrl', ['$scope', 'BlogService',
        function ($scope, BlogService) {
            $scope.posts = [];
            $scope.metadata = {};
            $scope.searchSettings = {
                elementsPerPage: 10,
                orderBy: 'created_at'
            };

            // Attempts to load default blog post
            $scope.refreshList = function() {
                BlogService.getList($scope.searchSettings).success(function(res) {
                    $scope.posts = res.data;
                    $scope.metadata = res.metadata;
                });
            };

            $scope.refreshList();
        }])

    .controller('BlogEditCtrl', ['$scope', '$stateParams', 'BlogService',
        function ($scope, $stateParams, BlogService) {
            $scope.editingBlogPost = {};
            $scope.posts = [];
            $scope.metadata = {};
            $scope.searchSettings = {
                elementsPerPage: 10,
                orderBy: 'created_at'
            };

            // Initializes editor if necessary
            $scope.initializeAceEditor = function() {
                if (!$scope.editor) {
                    $scope.editor = ace.edit("changelog-editor");
                    $scope.editor.setTheme("ace/theme/twilight");
                    $scope.editor.getSession().setMode("ace/mode/markdown");
                }
            };

            // Loads the defined post for edition
            $scope.loadPost = function(postId) {
                $scope.initializeAceEditor();
                $scope.editingBlogPost.id = postId;

                if (postId != -1) {
                    BlogService.get(postId).success(function(res) {
                        $scope.editingBlogPost = res.data;
                        $scope.editor.getSession().setValue($scope.editingBlogPost.content);
                    });
                }
            };

            // Saves current changes for the blog post
            $scope.saveChanges = function() {
                if ($scope.editingBlogPost.id == -1) {
                    BlogService.store($scope.editingBlogPost).then(function() {
                        $scope.refreshList();
                    });
                } else {
                    BlogService.update($scope.editingBlogPost).then(function() {
                        $scope.refreshList();
                    });
                }
            };

            $scope.refreshList($stateParams.id ? $stateParams.id : -1);
        }])


    .factory('BlogService', ['$http', function($http) {
        return {
            /** Gets a shortened listing of available blogs. */
            getList: function (parameters) {
                return $http
                    .get('/blog-posts', {
                        params: parameters
                    });
            },
            /** Gets a single detailed blog entry */
            get: function (id) {
                return $http
                    .get('/blog-posts/' + id);
            },
            /** Attempts to update the specified blog in database */
            update: function (blogData) {

                return $http({
                    method: 'PATCH',
                    url: '/blog-posts/' + blogData.id,
                    data: blogData});
            },
            /** Attempts to create the specified blog in database */
            store: function(blogData) {
                return $http
                    .post('/blog-posts', blogData);
            },
            destroy: function(blogData) {
                return $http
                    .delete('/blog-posts/' + blogData.id);
            }
        }
    }]);