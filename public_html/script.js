/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 * Sources used: https://scotch.io/tutorials/single-page-apps-with-angularjs-routing-and-templating
 */


var mist = angular.module("MainApp", ['ngRoute','myFilters']);
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
            })
            .otherwise({ 
                redirectTo: '/'});
            
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
            
//            console.log(test.indexOf($scope.taskadd) === -1);
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


mist.directive('myCustomer', function(){
    return{
        restrict: 'E',
        template: 'Name'
    };
});
mist.directive("simpleChart", function($window, $http){
    return{
        restrict: "EA",
        template: "<svg width='750' height='200'></svg>",
        link: function(scope, elem, attrs){
           var salesDataToPlot=scope[attrs.chartData];
           var padding = 20;
           var pathClass="path";
           var xScale, yScale, xAxisGen, yAxisGen, lineFun;  
           
           var d3 = $window.d3;
           var rawSvg=elem.find('svg');
           var svg = d3.select(rawSvg[0]);
           function setChartParameters(){
               
               xScale = d3.scale.linear()
                   .domain([salesDataToPlot[0].x, salesDataToPlot[salesDataToPlot.length-1].x])
                   .range([padding + 5, rawSvg.attr("width") - padding]);

               yScale = d3.scale.linear()
                   .domain([0, d3.max(salesDataToPlot, function (d) {
                       return d.y;
                   })])
                   .range([rawSvg.attr("height") - padding, 0]);

               xAxisGen = d3.svg.axis()
                   .scale(xScale)
                   .orient("bottom")
                   .ticks(salesDataToPlot.length - 1);

               yAxisGen = d3.svg.axis()
                   .scale(yScale)
                   .orient("left")
                   .ticks(10);

               lineFun = d3.svg.line()
                   .x(function (d) {
                       return xScale(d.x);
                   })
                   .y(function (d) {
                       return yScale(d.y);
                   })
                   .interpolate("basis");               
           }
         function drawLineChart() {
                setChartParameters();
                svg.append("svg:g")
                   .attr("class", "x axis")
                   .attr("transform", "translate(0,180)")
                   .call(xAxisGen);
           
                svg.append("text")      // text label for the x axis
                    .attr("x", 350 )
                    .attr("y",  170 )
                    .style("text-anchor", "middle")
                    .text("Date");

               svg.append("svg:g")
                   .attr("class", "y axis")
                   .attr("transform", "translate(20,0)")
                   .call(yAxisGen);

               svg.append("svg:path")
                   .attr({
                       d: lineFun(salesDataToPlot),
                       "stroke": "blue",
                       "stroke-width": 2,
                       "fill": "none",
                       "class": pathClass
                   });
           }      
           
           
        $http.get("http://api.openweathermap.org/data/2.5/forecast?q=94040,us&mode=json")
                .success(function(data, status, headers, config){
                    console.log(data);
                    for(var i=0; i<data.list.length; i++){
                        scope.lineData.push({x: i , y: (data.list[i].main.temp-272.15)});
                //  -457.87  
                    }
                    drawLineChart();
                })
                .error(function(data, status, headers, config){
                    console.log("Sorry we encountered an error");
                    console.log(data);
                    console.log(status);
                    console.log(headers);
                    console.log(config);
                });           
        }
    };
    
});
mist.controller("ACtrl", function($scope, $http){
//        $scope.lineData = [{
//          x: 1,
//          y: 5
//        }, {
//          x: 20,
//          y: 20
//        }, {
//          x: 40,
//          y: 10
//        }, {
//          x: 60,
//          y: 40
//        }, {
//          x: 80,
//          y: 5
//        }, {
//          x: 100,
//          y: 60
//        }];    
//    
    $scope.lineData = new Array();
    $scope.weatherData = new Array();
    
    
        // create a message to display in our view
        $scope.title = 'Weather';   
        $scope.message = 'Look up weather in your city';   
//        $http.get("http://api.openweathermap.org/data/2.5/forecast?q=94040,us&mode=json")
//                .success(function(data, status, headers, config){
////                    console.log(data);
////                for(var i=1; i<data.list.length; i++){
////                $scope.weatherData.push({x: i, y: data.list[i].main.temp});
////                }
//                for(var i=1; i<10; i++){
//                $scope.lineData.push({x: i*10, y: i*10+5});
//                }
////                console.log($scope.weatherData);
//    
//            //place data in 
//                })
//                .error(function(data, status, headers, config){});
});

angular.module('myFilters', []).
filter('customFilter', function () {
    return function (images,filter) {
        var results = [];
        console.log(filter);
        if(!filter.category) {
            return images;
        }
        angular.forEach(images, function(images) {
                results.push(images);
        });
        return results;
    };
});

mist.controller("CCtrl", function($scope){
    
    $scope.showFilter = function() {
        console.log($scope.filter)
    }    
    
    //              source: http://codepen.io/joshadamous/pen/CJmIB
    //              //http://jsfiddle.net/xujihui1985/9yk7a6v3/2/
        // create a message to display in our view
        $scope.title = 'My Photos';   
        $scope.message = 'Here are the pics!';  
        $scope.images = [
            {category : 'High', image : 'img/1.png', description : 'Random Photo', stars : '4/5'},
            {category : 'Medium', image : 'img/2.png', description : 'Sports Photo', stars : '3/5'}
        ];        
        $scope.currentImage = _.first($scope.images);
        $scope.imageCategories = _.uniq(_.pluck($scope.images, 'category'));
        $scope.setCurrentImage = function(image) {
            console.log("clicked current image");
          $scope.currentImage = image;
        };        
                $scope.valueSelected = function(value){
                    console.log(value)
                    if(value === null){
                        $scope.catselect = undefined;
                        
                    }
                };        
//        http://jsfiddle.net/xujihui1985/9yk7a6v3/2/
        
});