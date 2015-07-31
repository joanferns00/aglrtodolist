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

var DaysEnum = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"

];
function gDate(date) {
    return new Date(date * 1000);
}

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

var mist = angular.module("MainApp", ['ngRoute', 'myFilters', 'myDateFilter', 'myDTFilter']);
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
angular.module('myDateFilter', []).filter('mydate', function () {
    return function (input) {
        return input ? gd(input) + " " + DaysEnum[gDate(input).getDay()] : "";
    };
});
angular.module('myDTFilter', []).filter('mytime', function () {
    return function (input) {
        return input ? gt(input) : "";
    };
});
mist.factory('WeatherService', function ($http) {
    return {
        //Right Now
        getTodaysData: function (city) {
            return $http.get('http://api.openweathermap.org/data/2.5/weather?q=' + city + ',US').then(function (result) {
                return result.data;
            });
        },
        //5-days weather
        get5dayData: function (city) {
            return $http.get('http://api.openweathermap.org/data/2.5/forecast?q=' + city + ',us&mode=json').then(function (result) {
                return result.data;
            });
        },
        //16-day weather
        getData: function (city) {
            //since $http.get returns a promise,
            //and promise.then() also returns a promise
            //that resolves to whatever value is returned in it's
            //callback argument, we can return that.
            //
            //http://api.openweathermap.org/data/2.5/forecast?q=60607&mode=json
            return $http.get('http://api.openweathermap.org/data/2.5/forecast/daily?q=' + city + ',US&mode=json&cnt=16').then(function (result) {

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
            if (list[i].item.toLowerCase() === item.toLowerCase()) {
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
    //reset messages
    $scope.reset = function () {
        $scope.message = "";
    };
    //Add the item

    $scope.addItem = function () {
        var it = $scope.newItem.item;
        if (it === undefined || it.trim().length === 0) {
            $scope.message = "Please enter a task!";
        }

        //if item does not exist
        else if (ListService.getByItem(it) === null) {
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
//        console.log($scope.editMode);
//        $scope.editMode = !$scope.editMode;
    };
});
mist.directive('weatherSix', function (WeatherService) {
    return {
        restrict: 'E',
        templateUrl: "pages/sw.html",
        scope: {info: '=',
            tempformat: '=',
            selectedcity: '='},
        link: function (scope, element, attrs, controller) {
            scope.tempUnit = "C";
            scope.$watch('selectedcity', function (nv) {
                if (scope.info !== undefined) {
                    //call the weather data for the city.
                    WeatherService.getData(nv).then(
                            function (data) {
                                console.log("G");
                                scope.info = data;
                                //initialize data
                                //Convert temp to Farenheit
                                data.list.forEach(function (element, index, array) {
                                    for (var key in element.temp) {
                                        if (scope.tempUnit === "C") {
                                            element.temp[key] = Math.round(KToC(element.temp[key], "C"));
                                        }
                                        else if (scope.tempUnit === "F") {
                                            element.temp[key] = Math.round(KToC(element.temp[key], "F"));
                                        }
                                    }
                                });
                            },
                            function (err) {
                                console.log("Sorry we encountered an error " + err);
                            }
                    );
                }
            });
            scope.$watch('tempformat', function (nv) {
                if (scope.info !== undefined) {
                    if (nv === "C") {
                        //C-272.15
                        scope.tempUnit = "C";
                        //Convert temp to C
                        scope.info.list.forEach(function (element, index, array) {
                            for (var key in element.temp) {
                                element.temp[key] = Math.round(FtoC(element.temp[key]));
                            }
                        });
                    }
                    else if (nv === "F") {
                        scope.tempUnit = "F";
                        //(K × 1.8) - 459.67
                        //Convert temp to Farenheit
                        scope.info.list.forEach(function (element, index, array) {
                            for (var key in element.temp) {
                                element.temp[key] = Math.round(CtoF(element.temp[key]));
                            }
                        });
                    }
                }
            });
            //Initialize the directive after the ajax call is made.
            scope.$watch('info', function (nv) {
                if (scope.info !== undefined) {
                    scope.currentIndex = 0;
                    scope.showFwd();
                }
            });
            var arrlength = 16;
            var incSize = 4;
            scope.currentIndex = 0;
            var no = Math.ceil(arrlength / incSize);
            scope.hideAll = function () {
                scope.info.list.forEach(function (i) {
                    i.visible = false;
                });
            };
            scope.showFwd = function () {
                if (scope.currentIndex < no) {
                    scope.hideAll();
                    scope.currentIndex++;
                    for (var i = (no * (scope.currentIndex - 1)); i <= (((no * scope.currentIndex) - 1) > (arrlength - 1) ? arrlength - 1 : (no * scope.currentIndex) - 1); i++) {
//                        console.log("F Going to show " + i);
                        scope.info.list[i].visible = true;
                    }
                }
            };
            scope.showBkd = function () {
                if (scope.currentIndex > 1) {
                    scope.hideAll();
                    scope.currentIndex--;
                    for (var i = (((no * (scope.currentIndex - 1)) < 0) ? 0 : no * (scope.currentIndex - 1)); i <= (scope.currentIndex * no) - 1; i++) {
//                        console.log("B Going to show " + i);
                        scope.info.list[i].visible = true;
                    }
                }
            };
        }
    };
});
mist.directive('weatherToday', function (WeatherService) {
    return {
        restrict: 'E',
        templateUrl: "pages/tw.html",
        scope: {info: '=',
            tempformat: '=',
            selectedcity: '='
        },
        link: function (scope, element, attr) {
            scope.tempUnit = "C";
            scope.$watch('selectedcity', function (nv) {

                if (scope.info !== undefined) {
                    //call the weather data for the city.

                    WeatherService.getTodaysData(nv).then(
                            function (data) {
                                scope.info = data;
                                for (var key in data.main) {
                                    if (key.indexOf("temp") !== -1) {
                                        if (scope.tempUnit === "C") {
                                            data.main[key] = Math.round(KToC(data.main[key], "C"));
                                        }
                                        else if (scope.tempUnit === "F") {
                                            data.main[key] = Math.round(KToC(data.main[key], "F"));
                                        }



                                    }
                                }
                            },
                            function (err) {
                                console.log("Sorry we encountered an error " + err);
                            }
                    );
                }
            });
            scope.$watch('tempformat', function (nv) {

                if (scope.info !== undefined) {
                    if (nv === "C") {
                        //C-272.15
                        scope.tempUnit = "C";

                        for (var key in scope.info.main) {
                            if (key.indexOf("temp") !== -1) {
                                scope.info.main[key] = Math.round(FtoC(scope.info.main[key], "C"));
                            }
                        }

                    }
                    else if (nv === "F") {
                        scope.tempUnit = "F";
                        //(K × 1.8) - 459.67
                        for (var key in scope.info.main) {
                            if (key.indexOf("temp") !== -1) {
                                scope.info.main[key] = Math.round(CtoF(scope.info.main[key], "C"));
                            }
                        }
                    }
                }
            });
        }
    };
});
mist.directive("simpleChart", function ($window, WeatherService) {
//    http://jsfiddle.net/ShBQw/
    return{
        restrict: "EA",
        template: "<svg></svg>",
        link: function (scope, elem, attrs) {
            scope.$watch('tempformat', function (nv) {
                if (scope.lineData !== undefined) {
                    console.log("Going to convert the temerature for graph " + nv);
//                    for (var i = 0; i < scope.lineData.length; i++) {
//                        if (nv === "C") {
//                            scope.lineData[i].temp = FtoC(scope.lineData[i].temp);
//                        }
//                        else if (nv === "F") {
//                            scope.lineData[i].temp = CtoF(scope.lineData[i].temp);
//                        }
//                    }


                    /**
                     * Working code
                     */
                    //call the weather data for the city.
                    WeatherService.get5dayData(nv).then(
                            function (data) {
                                scope.lineData = new Array();
                                for (var i = 0; i < data.list.length; i++) {
                                    var t = data.list[i];
                                    if (nv === "C") {
                                        //KToC
                                        //Math.round(KToC(element.temp[key], "C"));
                                        scope.lineData.push({date: gDate(t.dt), temp: Math.round(KToC(t.main.temp, "C"))});
                                    }
                                    if (nv === "F") {
                                        scope.lineData.push({date: gDate(t.dt), temp: Math.round(KToC(t.main.temp, "F"))});
                                    }

                                    //  -457.87
                                }
                                wd = scope[attrs.chartData];
                                emptyLineChart();
                                initChart();
                                drawLineChart();
                            },
                            function (err) {
                                console.log("Sorry we encountered an error " + err);
                            }
                    );

                    /**
                     * Working code
                     */
                }
            });

            scope.$watch('selectedcity', function (nv) {
                if (scope.lineData !== undefined) {
                    //call the weather data for the city.
                    WeatherService.get5dayData(nv).then(
                            function (data) {
                                scope.lineData = new Array();
                                for (var i = 0; i < data.list.length; i++) {
                                    var t = data.list[i];
                                    //(data.list[i].dt_txt).replace(/ /g, "T")
                                    scope.lineData.push({date: gDate(t.dt), temp: (t.main.temp - 272.15)});
                                    //  -457.87
                                }
                                wd = scope[attrs.chartData];
                                emptyLineChart();
                                initChart();
                                drawLineChart();
                            },
                            function (err) {
                                console.log("Sorry we encountered an error " + err);
                            }
                    );
                }
            });

            var wd = scope[attrs.chartData];
//            var wd = scope[attrs.chartData];
            //width and height
            var width = 1500, height = 200;
            var margin = {top: 40, right: 40, bottom: 40, left: 40};
            var d3 = $window.d3;
            var rawSvg = elem.find('svg');
            // Define the div for the tooltip
            var div = d3.select("body").append("div")
                    .attr("class", "tooltip")
                    .style("opacity", 0);
            var svg = d3.select(rawSvg[0])
                    .attr("width", width)
                    .attr("height", height)
                    .append('g')
                    .attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')');
            var xScale, yScale, xAxisGen, yAxisGen, lineFun;
            function initChart() {
                d3 = $window.d3;
                awSvg = elem.find('svg');
                div = d3.select("body").append("div")
                        .attr("class", "tooltip")
                        .style("opacity", 0);
                svg = d3.select(rawSvg[0])
                        .attr("width", width)
                        .attr("height", height)
                        .append('g')
                        .attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')');

            }

            function emptyLineChart() {
                d3.selectAll("svg > *").remove();
            }
            function drawLineChart() {
                //X scale
                var xScale = d3.time.scale()
                        .domain([
                            d3.time.hour.offset(wd[0].date, -1),
//                    wd[0].date,
//                            d3.time.day.offset(wd[wd.length - 1].date, 1)
                            d3.time.hour.offset(wd[wd.length - 1].date, 6)
//                            wd[wd.length - 1].date
                        ])
                        .rangeRound([0, width - margin.left - margin.right])
                        ;
                //Y scale
                var yScale = d3.scale.linear()
                        .domain([d3.min(wd, function (d) {
                                return d.temp;
                            }), d3.max(wd, function (d) {
                                return d.temp;
                            })])
                        .range([height - margin.top - margin.bottom, 0]);
                var xAxisGen = d3.svg.axis()
                        .scale(xScale)
                        .orient("bottom")
                        .ticks(d3.time.hour, 3)
                        .tickFormat(d3.time.format("%H:%M"))
                        .tickSize(0)
                        .tickPadding(1)
                        ;
                var yAxisGen = d3.svg.axis()
                        .scale(yScale)
                        .orient("left")
                        .ticks(10)
                        ;
                var lineFun = d3.svg.line()
                        .x(function (d) {
                            return xScale(d.date);
                        })
                        .y(function (d) {
                            return yScale(d.temp);
                        })
                        .interpolate("cardinal");
                svg.append("svg:g")
                        .attr("class", "x axis")
                        .attr('transform', 'translate(0, ' + (height - margin.top - margin.bottom) + ')')
                        .call(xAxisGen);
                svg.append("svg:g")
                        .attr("class", "y axis")
                        .call(yAxisGen);
                svg.append("text")      // text label for the x axis
                        .attr("x", width / 2)
                        .attr("y", height - 60)
                        .text("Date");
                svg.append("text")      // text label for the x axis
//                        .attr("x", -40)
//                        .attr("y", 0)
                        .attr("transform", "translate(-25," + height / 2 + ")rotate(-90)")


                        //transform="translate(-25,95)rotate(-90)"
//                        .attr("transform", "rotate(90)")
                        .text("Temperature (" + scope.tempformat + ")");


                svg.append("svg:path")
                        .attr({
                            d: lineFun(wd),
                            "stroke": "blue",
                            "stroke-width": 2,
                            "fill": "none"
                        });
//.selectAll(".chart")
                svg.selectAll(".chart").data(wd)
                        .enter()
                        .append("circle")
                        .attr("r", 4)
                        .attr("cx", function (dd) {
                            return xScale(dd.date);
                        })
                        .attr("cy", function (dd) {
                            return yScale(dd.temp);
                        })
                        .style("fill", "none")
                        .style("pointer-events", "all")
                        .attr("stroke", "black")
                        .on("mousemove", mmP)
                        .on("mouseover", function (d) {

                            div.transition()
                                    .duration(200)
                                    .style("opacity", .9);
                            div.html(gdt(d.date) + "<br/>" + Math.round(d.temp) + "C")
                                    .style("left", (d3.event.pageX) + "px")
                                    .style("top", (d3.event.pageY - 28) + "px");
                        })
                        .on("mouseout", function (d) {
                            div.transition()
                                    .duration(500)
                                    .style("opacity", 0);
                        });
                function mmP() {
//                    console.log("Mouse Move");
                }
            }






            WeatherService.get5dayData(scope.selectedcity).then(
                    function (data) {
                        for (var i = 0; i < data.list.length; i++) {
                            var t = data.list[i];
                            scope.lineData.push({date: gDate(t.dt), temp: (t.main.temp - 272.15)});
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

function KToC(K, U) {
    if (U === "C") {
        return K - 272.15;
    }
    else if (U === "F") {
        return (K * 1.8) - 459.67;
    }


}
function FtoC(TF) {

    return ((TF - 32) / (9 / 5));
}

function CtoF(TC) {

    return ((TC * 9 / 5) + 32);

}

//ACtrl
mist.controller("ACtrl", function ($scope, WeatherService) {
    $scope.lineData = new Array();
    $scope.weatherData = new Array();
    // create a message to display in our view
    $scope.title = 'Weather';
    $scope.message = 'Weather in your city';
    $scope.selectedcity = "Chicago";
//    $scope.weather16 = null;
    $scope.cities = {
        "Chicago": "Chicago, IL",
        "New York": "New York City, NY",
        "San Francisco": "San Francisco, CA",
        "Denver": "Denver, CO",
        "Honolulu": "Honolulu, Hawai",
        "Juneau": "Juneau, Alaska"
    };
    $scope.tempformat = "C";
    $scope.$watch('tempformat', function (nv) {
        if ($scope.tempformat === "C") {
            //C-272.15
        }
        else if ($scope.tempformat === "F") {
            //(K × 1.8) - 459.67
        }
    });
    WeatherService.getData($scope.selectedcity).then(
            function (data) {
                //initialize data
                //Convert temp to Farenheit
                data.list.forEach(function (element, index, array) {
                    for (var key in element.temp) {
                        element.temp[key] = Math.round(KToC(element.temp[key], "C"));
                    }
                });
                $scope.weather16 = data;

            },
            function (err) {
                console.log("Sorry we encountered an error " + err);
            }
    );
    WeatherService.getTodaysData($scope.selectedcity).then(
            function (data) {
                $scope.weather = data;
                for (var key in data.main) {
                    if (key.indexOf("temp") !== -1) {
                        data.main[key] = Math.round(KToC(data.main[key], "C"));
                    }
                }
            },
            function (err) {
                console.log("Sorry we encountered an error " + err);
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
    $scope.message = 'Select size';
    $scope.images = [
        {category: 'High', image: 'img/1.png', description: 'Random Photo', stars: '4/5'},
        {category: 'High', image: 'img/2.png', description: 'Sports Photo', stars: '4/5'},
        {category: 'High', image: 'img/3.png', description: 'Fashion Photo', stars: '5/5'},
        {category: 'High', image: 'img/4.png', description: 'Health Photo', stars: '4/5'},
        {category: 'High', image: 'img/5.png', description: 'Food Photo', stars: '5/5'},
        {category: 'Medium', image: 'img/6.png', description: 'ApplePhoto', stars: '3/5'},
        {category: 'Medium', image: 'img/7.png', description: 'Basket Photo', stars: '3/5'},
        {category: 'Medium', image: 'img/8.png', description: 'Caddy Photo', stars: '3/5'},
        {category: 'Medium', image: 'img/9.png', description: 'Dog Photo', stars: '3/5'},
        {category: 'Medium', image: 'img/10.png', description: 'Eagle Photo', stars: '3/5'},
        {category: 'Low', image: 'img/11.png', description: 'Fanta Photo', stars: '2/5'},
        {category: 'Low', image: 'img/12.png', description: 'Green Photo', stars: '2/5'},
        {category: 'Low', image: 'img/13.png', description: 'High Top Photo', stars: '2/5'},
        {category: 'Low', image: 'img/14.png', description: 'Iowa Photo', stars: '2/5'},
        {category: 'Low', image: 'img/15.png', description: 'Jack Photo', stars: '2/5'},
        {category: 'None', image: 'img/16.png', description: 'Kilt Photo', stars: '0/5'},
        {category: 'None', image: 'img/17.png', description: 'Lunar Photo', stars: '0/5'},
        {category: 'None', image: 'img/18.png', description: 'Moon Photo', stars: '0/5'},
        {category: 'None', image: 'img/19.png', description: 'Noon Photo', stars: '0/5'},
        {category: 'None', image: 'img/20.png', description: 'Park Photo', stars: '0/5'}
    ];
//    $scope.currentImage = _.first($scope.images);
    $scope.currentImage = $scope.images[0];
//    $scope.imageCategories = _.uniq(_.pluck($scope.images, 'category'));
    $scope.imageCategories = ["High", "Medium", "Low", "None"];

    $scope.size = "medium";

    $scope.s = function () {
        $scope.size = "small";
    };

    $scope.m = function () {
        $scope.size = "medium";
    };

    $scope.l = function () {
        $scope.size = "large";
    };
    $scope.iWidth = 5;
    $scope.iGScale = 0;
//filter: grayscale(75%); -webkit-filter: grayscale(75%);
    $scope.myStyle = {'width': ($scope.iWidth * 50) + "px",
        '-webkit-filter': 'grayscale(' + $scope.iGScale + '%)',
        'filter': 'grayscale(' + $scope.iGScale + '%)'
    };

    $scope.changeWidth = function () {
        $scope.myStyle = {'width': ($scope.iWidth * 50) + "px",
            '-webkit-filter': 'grayscale(' + $scope.iGScale + '%)',
            'filter': 'grayscale(' + $scope.iGScale + '%)'};
    };

    $scope.ciGScale = function () {
        $scope.myStyle = {'width': ($scope.iWidth * 50) + "px",
            '-webkit-filter': 'grayscale(' + $scope.iGScale + '%)',
            'filter': 'grayscale(' + $scope.iGScale + '%)'};
    };

    $scope.setCurrentImage = function (image) {
        $scope.currentImage = image;
    };
    $scope.valueSelected = function (value) {

        if (value === null) {
            $scope.catselect = undefined;
        }

        console.log($scope.catselect);
    };
    //        http://jsfiddle.net/xujihui1985/9yk7a6v3/2/

});



