/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 * Sources used: https://scotch.io/tutorials/single-page-apps-with-angularjs-routing-and-templating
 */


var mist = angular.module("MainApp", ['ngRoute']);
mist.config(
    
function($routeProvider, $locationProvider){
    
    $routeProvider
            // route for the home page
            .when('/list', {
                templateUrl : 'pages/list.html',
                controller  : 'MCtrl'
            })
            .when('/index.html', {
                templateUrl : 'pages/list.html',
                controller  : 'MCtrl'
            })            
            .when('/', {
                templateUrl : 'pages/list.html',
                controller  : 'MCtrl'
            })        
            // route for the about page
            .when('/weather', {
                templateUrl : 'pages/weather.html',
                controller  : 'ACtrl'
            })

            // route for the contact page
            .when('/photos', {
                templateUrl : 'pages/photos.html',
                controller  : 'CCtrl'
            });
            
              // use the HTML5 History API
        $locationProvider.html5Mode(true);
    
    
}    
    
);
//mist.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider){
//        
//        $routeProvider
//                .when("/", {templateUrl: "pages/home.html" , controller: 'MCtrl'})
//                .when("/contact", {templateUrl: "pages/contact.html" , controller: 'CCtrl'})
//                .when("/about", {templateUrl: "pages/about.html" , controller: 'ACtrl'});
//        $locationProvider.html5Mode(true);
//}]);
mist.controller("MCtrl", function($scope){
        // create a message to display in our view
        $scope.title = 'My List';   
        $scope.message = 'Start creating your list';  
        $scope.taskadd = "";
        $scope.tasks  = ["Make bed", "Watch TV"];
        $scope.addList = function(){
            console.log("going to add to the list");
            $scope.tasks.unshift($scope.taskadd);
        };
        
        $scope.makeIt = function(item){
            
//            $scope.tasks.indexOf(item);
            $scope.tasks.splice($scope.tasks.indexOf(item), 1)
            
            
            
        };

        
        
});

mist.controller("ACtrl", function($scope){
        // create a message to display in our view
        $scope.title = 'Weather';   
        $scope.message = 'Look up weater in your city';   
});

mist.controller("CCtrl", function($scope){
        // create a message to display in our view
        $scope.title = 'My Photos';   
        $scope.message = 'Here are the pics!';   
});