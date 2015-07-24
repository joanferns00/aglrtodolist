/**
 *
 * Stuff in here
 * mist.directive('ngEnter',
 * mist.factory('WeatherService',
 * mist.service('ListService'
 * mist.controller("MCtrl"
 * mist.directive('myCustomer'
 * mist.directive("simpleChart"
 * mist.controller("ACtrl"
 * angular.module('myFilters'
 * mist.controller("CCtrl"
 */

function gdt(date) {
    return date.toLocaleTimeString() + " " + date.toLocaleDateString();
}
function gt(date) {
    var t = new Date(date * 1000);
    return t.toLocaleTimeString();

}

function gd(date) {
    var t = new Date(date * 1000);
    return t.toLocaleDateString();
}

var mist = angular.module("MainApp", ['ngRoute', 'myFilters']);

mist.directive('ngEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown press", function (event) {
            if (event.which === 13) {
                scope.$apply(function () {
                    scope.$eval(attrs.ngEnter);
                });
//                event.preventDefault();
            }

        });
    };
});



mist.factory('WeatherService', function ($http) {
    return {
        //Right Now
        getTodaysData: function () {
            return $http.get('http://api.openweathermap.org/data/2.5/weather?q=Chicago,US').then(function (result) {
                return result.data;
            });
        },
        //5-days weather
        get5dayData: function () {
            return $http.get('http://api.openweathermap.org/data/2.5/forecast?q=Seattle,us&mode=json').then(function (result) {
                return result.data;
            });
        },
        //16-day weather
        getData: function () {
            //since $http.get returns a promise,
            //and promise.then() also returns a promise
            //that resolves to whatever value is returned in it's
            //callback argument, we can return that.
            //
            //http://api.openweathermap.org/data/2.5/forecast?q=60607&mode=json
            return $http.get('http://api.openweathermap.org/data/2.5/forecast/daily?q=Seattle,US&mode=json&cnt=16').then(function (result) {
                return result.data;
            });
        }
    };
});

mist.service('ListService', function () {

    var uid = 1;
    var tmp = {};
    var list = [{id: 0, item: 'Make Bed', status: false}];
    this.save = function (item) {

        if (item.id === undefined) {
            //add a new item
            item.id = uid++;
            item.status = false;
            list.push(item);
        }
        else {
            //edit the exsisting item
            for (var i in list) {
                if (list[i].id === item.id) {
                    list[i] = item;
                }
            }
        }
    };

    this.getByItem = function (item) {
        for (var i in list) {
            if (list[i].item === item) {
                return list[i];
            }
        }
        return null;
    };
    this.getOne = function (id) {
        for (var i in list) {
            if (list[i].id === id) {
                return list[i];
            }
        }
    };
    this.delete = function (id) {
        for (var i in list) {
            if (list[i].id === id) {
                tmp = {i: list.splice(i, 1)};
            }
        }

    };

    this.undo = function () {
        //to do
    };
    this.getAll = function () {
        return list;
    };


});

mist.config(function ($routeProvider, $locationProvider) {
    $routeProvider
            // route for the home page
            .when('/list', {
                templateUrl: 'pages/list.html',
                controller: 'MCtrl'
            })
            .when('/index.html', {
                templateUrl: 'pages/list.html',
                controller: 'MCtrl'
            })
            .when('/', {
                templateUrl: 'pages/list.html',
                controller: 'MCtrl'
            })
            // route for the about page
            .when('/weather', {
                templateUrl: 'pages/weather.html',
                controller: 'ACtrl'
            })

            // route for the contact page
            .when('/photos', {
                templateUrl: 'pages/photos.html',
                controller: 'CCtrl'
            })
            .otherwise({
                redirectTo: 'pages/'});

    // use the HTML5 History API
    $locationProvider.html5Mode(true);
}
);
//Controller for list.
mist.controller("MCtrl", function ($scope, ListService) {
    // create a message to display in our view
    $scope.title = 'My List';
    $scope.message = 'Start creating your list';
    $scope.newItem = {};
    $scope.editMode = {};
    $scope.tasks = ListService.getAll();
    //Add the item
    $scope.addItem = function () {
        //if item does not exist
        if (ListService.getByItem($scope.newItem) === null) {
            //add it to the list
            ListService.save($scope.newItem);
            $scope.newItem = {};
        }
        else {
            //else
            //return found message
            $scope.message = "Sorry, this item already exists";
        }
    };
    //edit the Status
    $scope.editStatus = function (item) {
        item.status = !item.status;
        ListService.save(item);
    };
    //Going to edit item
    $scope.editItem = function (item) {
        ListService.save(item);
    };
    //Going to delete item
    $scope.delItem = function (id) {
        ListService.delete(id);
    };
    //Change the view from input to span
    $scope.changeView = function (x) {
        $scope.editMode[x.id] = !$scope.editMode[x.id];
        //|| true
//        console.log($scope.editMode);
//        $scope.editMode = !$scope.editMode;
    };
});

mist.directive('weatherToday', function () {
    return {
        restrict: 'E',
        templateUrl: "pages/tw.html",
        scope: {info: '='}
    };
});

mist.directive("simpleChart", function ($window, WeatherService) {
    return{
        restrict: "EA",
        template: "<svg></svg>",
        link: function (scope, elem, attrs) {
            var weatherData = scope[attrs.chartData];
            var width = 1500, height = 200;
            var margin = {top: 40, right: 40, bottom: 40, left: 40};
            var pathClass = "path";
            var xScale, yScale, xAxisGen, yAxisGen, lineFun;
            var d3 = $window.d3;
            var rawSvg = elem.find('svg')
            //.attr({'width': width, 'height': height, 'border': 1});
            var svg = d3.select(rawSvg[0])
                    .attr("width", width)
                    .attr("height", height)
                    .append('g')
                    .attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')');
//            var borderPath = svg.append("rect")
//                    .attr("x", 0)
//                    .attr("y", 0)
//                    .attr("height", height)
//                    .attr("width", width)
//                    .style("stroke", "black")
//                    .style("fill", "none")
//                    .style("stroke-width", 1);

            function setChartParameters() {
//                console.log(weatherData[0].x);
//                console.log(new Date(weatherData[0].x * 1000));
                xScale = d3.time.scale()
                        .domain([new Date(weatherData[0].x * 1000),
                            d3.time.day.offset(new Date(weatherData[weatherData.length - 1].x * 1000), 1)])
                        .range([margin.left, rawSvg.attr("width") - margin.right]);
                yScale = d3.scale.linear()
                        .domain([0, d3.max(weatherData, function (d) {
                                return d.y;
                            })])
                        .range([rawSvg.attr("height") - margin.bottom, 0]);

                xAxisGen = d3.svg.axis()
                        .scale(xScale)
                        .orient("bottom")
                        .ticks(d3.time.days, 1)
                        .tickFormat(d3.time.format("%a %d"))
                        .tickSize(0)
                        .tickPadding(1)
                        ;
//.ticks(weatherData.length - 1)
                yAxisGen = d3.svg.axis()
                        .scale(yScale)
                        .orient("left")
                        .ticks(10);

                lineFun = d3.svg.line()
                        .x(function (d) {
//                            console.log(new Date(d.x * 1000));
                            return xScale(new Date(d.x * 1000));
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

                svg.append("svg:g")
                        .attr("class", "y axis")
                        .attr("transform", "translate(20,0)")
                        .call(yAxisGen);

                svg.append("text")      // text label for the x axis
                        .attr("x", width / 2)
                        .attr("y", height - margin.bottom)

                        .text("Date");

                svg.append("text")      // text label for the x axis
                        .attr("x", width / 2)
                        .attr("y", height / 2)

                        .text("Temperature");

                svg.append("svg:path")
                        .attr({
                            d: lineFun(weatherData),
                            "stroke": "blue",
                            "stroke-width": 2,
                            "fill": "none"

                        });
            }

            WeatherService.get5dayData().then(
                    function (data) {
//                        console.log(data);
                        for (var i = 0; i < data.list.length; i++) {
                            var t = data.list[i];
                            //(data.list[i].dt_txt).replace(/ /g, "T")
                            scope.lineData.push({x: (t.dt), y: (t.main.temp - 272.15)});
                            //  -457.87
                        }
                        drawLineChart();
                    },
                    function (err) {
                        console.log("Sorry we encountered an error " + err);
                    }
            );

        }
    };

});
mist.controller("ACtrl", function ($scope, WeatherService) {
    $scope.lineData = new Array();
    $scope.weatherData = new Array();
    // create a message to display in our view
    $scope.title = 'Weather';
    $scope.message = 'Look up weather in your city';
    WeatherService.getData().then(
            function (data) {
                console.log("Received...");
                console.log(data);
                $scope.weather = data;
            }
    );

});

angular.module('myFilters', []).
        filter('customFilter', function () {
            return function (images, filter) {
                var results = [];
//                console.log(filter);
                if (!filter.category) {
                    return images;
                }
                angular.forEach(images, function (images) {
                    results.push(images);
                });
                return results;
            };
        });

mist.controller("CCtrl", function ($scope) {
    $scope.showFilter = function () {
//        console.log($scope.filter);
    };
    //              source: http://codepen.io/joshadamous/pen/CJmIB
    //              //http://jsfiddle.net/xujihui1985/9yk7a6v3/2/
    // create a message to display in our view
    $scope.title = 'My Photos';
    $scope.message = 'Here are the pics!';
    $scope.images = [
        {category: 'High', image: 'img/1.png', description: 'Random Photo', stars: '4/5'},
        {category: 'Medium', image: 'img/2.png', description: 'Sports Photo', stars: '3/5'}
    ];
    $scope.currentImage = _.first($scope.images);
    $scope.imageCategories = _.uniq(_.pluck($scope.images, 'category'));
    $scope.setCurrentImage = function (image) {
//        console.log("clicked current image");
        $scope.currentImage = image;
    };
    $scope.valueSelected = function (value) {
//        console.log(value);
        if (value === null) {
            $scope.catselect = undefined;

        }
    };
    //        http://jsfiddle.net/xujihui1985/9yk7a6v3/2/

});