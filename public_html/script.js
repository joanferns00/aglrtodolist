/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 * Sources used: https://scotch.io/tutorials/single-page-apps-with-angularjs-routing-and-templating
 */


var mist = angular.module("MainApp", ['ngRoute']);
mist.directive('ngEnter', function(){
    return function(scope, element, attrs){
        element.bind("keydown press", function(event){
            if(event.which === 13){
                scope.$apply(function(){
                    scope.$eval(attrs.ngEnter);
                });
//                event.preventDefault();
            }
            
        });
    };
});
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

mist.controller("MCtrl", function($scope){
        // create a message to display in our view
        $scope.title = 'My List';   
        $scope.message = 'Start creating your list';  
        $scope.taskadd = "";
        $scope.tasks  = ["Make bed", "Watch TV"];
        $scope.addItem = function(){
            
            //if exists, dont add to the list.
            var test = $scope.tasks;
            
            console.log(test.indexOf($scope.taskadd) === -1);
            if(test.indexOf($scope.taskadd) === -1){
                $scope.tasks.unshift($scope.taskadd);
            }
            else{
                console.log("Item exists");
                }            
            
        };
        //Going to edit item
        $scope.editItem = function(){
            
        };
        
        $scope.isChecked = false;        
//        //Going to strike item
//        $scope.strikeItem = function(){
//            //strike out item 
//            $scope.isChecked  = !$scope.isChecked;
////                $scope.strkStyle = {'text-decoration': 'line-through' };
//        };
        //Going to delete item
        $scope.delItem = function(item){
//            $scope.tasks.indexOf(item);
            $scope.tasks.splice($scope.tasks.indexOf(item), 1);
        };
});

mist.controller("ACtrl", function($scope, $http){
        // create a message to display in our view
        $scope.title = 'Weather';   
        $scope.message = 'Look up weater in your city';   
        $http.get("http://api.openweathermap.org/data/2.5/weather?zip=94040,us")
                .success(function(data, status, headers, config){
                    console.log("Data from weather service");
            console.log(data);
            //place data in 
                })
                .error(function(data, status, headers, config){});
        
        
});

mist.controller("CCtrl", function($scope){
        // create a message to display in our view
        $scope.title = 'My Photos';   
        $scope.message = 'Here are the pics!';   
});