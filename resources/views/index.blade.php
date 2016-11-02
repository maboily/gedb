<!DOCTYPE html>
<html ng-app="gedbApp">
<head>
    <title>Loading...</title>

    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />

    <!-- Google fonts -->
    <link href='http://fonts.googleapis.com/css?family=Istok+Web:400,700' rel='stylesheet' type='text/css'>
    <link href='http://fonts.googleapis.com/css?family=Abel' rel='stylesheet' type='text/css'>

    <!-- Preloaded JS Assets -->
    <script type="text/javascript" src="preload.js"></script>
    <script type="text/javascript" src="desktop.js"></script>
    <script type="text/javascript" src="admin.js"></script>

    <!-- Loads CSS Assets -->
    <link rel="stylesheet" href="styles.css" />

    <!-- AngularJS / Libraries -->
    <script type="text/javascript" src="ng-app.js"></script>
    <script type="text/javascript" src="ng-partials.js"></script>
</head>

<body ui-view ng-class="{ loading: globalLoading }">
    <!-- Page content -->
</body>
</html>