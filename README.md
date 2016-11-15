# Mastercard Developer API - Spending Pulse - Reference Implementation - Angular/Express #

## [Demo](https://perusworld.github.io/mcdevapi-spendingpulse-refimpl-web/) ##

## Setup ##

1.Checkout the code
```bash
git clone https://github.com/perusworld/mcdevapi-spendingpulse-refimpl-web.git
```
2.Run bower install
```bash
bower install
```
3.Run npm install
```bash
npm install
```

## Running using dummy data ##
1.Start the app
```bash
node index.js
```
2.Open browser and goto [http://localhost:3000](http://localhost:3000)

## Running using MasterCard API ##
Make sure you have registered and obtained the API keys and p12 files from [https://developer.mastercard.com/](https://developer.mastercard.com/)

1.Start the app
```bash
export KEY_FILE=<your p12 file location>
export API_KEY=<your api key>
node index.js
```
2.Open browser and goto [http://localhost:3000](http://localhost:3000)

#### Some of the other options ####
```bash
export KEY_FILE_PWD=<p12 key password defaults to keystorepassword>
export KEY_FILE_ALIAS=<p12 key alias defaults to keyalias>
export SANDBOX=<sandbox or not defaults to true>
```
## Code ##
### Backend API Initialization ###
```javascript
var spendingPulse = require('mastercard-spending-pulse');
var MasterCardAPI = spendingPulse.MasterCardAPI;
var config = {
    p12file: process.env.KEY_FILE || null,
    p12pwd: process.env.KEY_FILE_PWD || 'keystorepassword',
    p12alias: process.env.KEY_FILE_ALIAS || 'keyalias',
    apiKey: process.env.API_KEY || null,
    sandbox: process.env.SANDBOX || 'true',
}
 var authentication = new MasterCardAPI.OAuth(config.apiKey, config.p12file, config.p12alias, config.p12pwd);
    MasterCardAPI.init({
        sandbox: 'true' === config.sandbox,
        authentication: authentication
    });
```
### Backend API Call (query available subscriptions) ###
```javascript
app.post('/subscriptions', function (req, res) {
    var requestData = {
        "CurrentRow": req.body.currentRow,
        "Offset": req.body.offset
    };
    spendingPulse.Subscription.query(requestData, function(error, data) {
        if (error) {
            console.error("An error occurred");
            console.dir(error, { depth: null });
            res.json({
                SubscriptionList: {
                    Count: "0",
                    Message: "Success",
                    SubscriptionArray: {
                        Subscription: []
                    }
                }
            });
        }
        else {
            res.json(data);
        }
    });
});
```
### Backend API Call (query spending pulse reports using period/country sent as part of JSON post) ###
```javascript
app.post('/spendingPulse', function(req, res) {
    var requestData = {
        "Country": req.body.country,
        "CurrentRow": req.body.currentRow,
        "Period": req.body.period,
        "Offset": req.body.offset
    };
    spendingPulse.SpendingPulseReport.query(requestData, function(error, data) {
        if (error) {
            console.error("An error occurred");
            console.dir(error, { depth: null });
            res.json({
                SpendingPulseList: {
                    Count: "0",
                    Message: "Success",
                    SpendingPulseArray: {
                        SpendingPulseRecord: []
                    }
                }
            });
        }
        else {
            res.json(data);
        }
    });
});
```
### Backend API Call (query weekly gasoline report) ###
```javascript
app.post('/gasWeekly', function(req, res) {
    var requestData = {
        "CurrentRow": req.body.currentRow,
        "Offset": req.body.offset
    };

    spendingPulse.GasWeekly.query(requestData, function(error, data) {
        if (error) {
            console.error("An error occurred");
            console.dir(error, { depth: null });
            res.json({
                GasWeeklyList: {
                    Count: "0",
                    Message: "Success",
                    GasWeeklyArray: {
                        GasWeeklyRecord: []
                    }
                }
            });
        }
        else {
            res.json(data);
        }
    });
});
```
### Backend API Call (query distinct list of reports subscribed to) ###
```javascript
app.post('/parameters', function(req, res) {
    var requestData = {
        "CurrentRow": req.body.currentRow,
        "Offset": req.body.offset
    };
    spendingPulse.Parameters.query(requestData, function(error, data) {
        if (error) {
            console.error("An error occurred");
            console.dir(error, { depth: null });
            res.json({
                ParameterList: {
                    Count: "0",
                    Message: "Success",
                    ParameterArray: {
                        Parameter: []
                    }
                }
            });
        }
        else {
            res.json(data);
        }
    });
});
```
### Angular Service to spending pulse ###
```javascript
angular.module('spulse.api', [])


    .service('SPulseApi', ['$http', function ($http) {
        var ret = {
            getJson: function (file, callback) {
                $http.get('/data/' + file).then(function successCallback(response) {
                    callback(response.data)
                }, function errorCallback(response) {
                    callback(null);
                });
            },
            spendingPulse: function (req, callback) {
                var data = {
                    country: req.country,
                    currentRow: req.currentRow,
                    period: req.period,
                    offset: req.offset
                }
                $http.post('/spendingPulse', data).then(function successCallback(response) {
                    callback(response.data)
                }, function errorCallback(response) {
                    ret.getJson("spendingPulse.json", callback);
                });
            },
            gasWeekly: function (req, callback) {
                var data = {
                    currentRow: req.currentRow,
                    offset: req.offset
                }
                $http.post('/gasWeekly', data).then(function successCallback(response) {
                    callback(response.data)
                }, function errorCallback(response) {
                    ret.getJson("gasWeekly.json", callback);
                });
            },
            subscriptions: function (req, callback) {
                var data = {
                    currentRow: req.currentRow,
                    offset: req.offset
                }
                $http.post('/subscriptions', data).then(function successCallback(response) {
                    callback(response.data)
                }, function errorCallback(response) {
                    ret.getJson("subscriptions.json", callback);
                });
            },
            parameters: function (req, callback) {
                var data = {
                    currentRow: req.currentRow,
                    offset: req.offset
                }
                $http.post('/parameters', data).then(function successCallback(response) {
                    callback(response.data)
                }, function errorCallback(response) {
                    ret.getJson("parameters.json", callback);
                });
            }
        };
        return ret;

    }])

    .factory('SPulseService', function ($window, SPulseApi) {
        var ret = {
            chartData: function (req) {
                var retData = {
                    chart: {
                        sectors: []
                    }
                };
                req.data.reduce(function (total, dtl) {
                    if (-1 == retData.chart.sectors.indexOf(dtl[req.field])) {
                        retData.chart.sectors.push(dtl[req.field]);
                        total += 1;
                    }
                    return total;
                });
                retData.chart.height = Math.round($window.innerHeight / retData.chart.sectors.length) - 100;
                retData.chartData = retData.chart.sectors.map(function (sector) {
                    var sectorData = [];
                    req.arr.forEach(function (value) {
                        sectorData[value] = [];
                    });
                    req.data.forEach(function (dtl) {
                        if (sector === dtl[req.field]) {
                            req.arr.forEach(function (value) {
                                sectorData[value].push([moment(dtl[req.xField], 'MM/DD/YYYY').valueOf(), dtl[value]]);
                            });
                        }
                    });
                    return {
                        title: sector,
                        data: req.arr.map(function (value) {
                            return {
                                "key": (req.sectorPrefix[req.arr.indexOf(value)] ? sector + " " : "") + req.arrTitle[req.arr.indexOf(value)],
                                "bar": req.arrBar[req.arr.indexOf(value)],
                                "values": sectorData[value].slice()
                            }

                        })
                    };
                });
                return retData;
            },
            spendingPulse: function (req, callback) {
                SPulseApi.spendingPulse(req, function (data) {
                    if (null != data) {
                        callback(data.SpendingPulseList.SpendingPulseArray.SpendingPulseRecord);
                    }
                });
            },
            gasWeekly: function (req, callback) {
                SPulseApi.gasWeekly(req, function (data) {
                    if (null != data) {
                        callback(data.GasWeeklyList.GasWeeklyArray.GasWeeklyRecord);
                    }
                });
            },
            subscriptions: function (req, callback) {
                SPulseApi.subscriptions(req, function (data) {
                    if (null != data) {
                        callback(data.SubscriptionList.SubscriptionArray.Subscription);
                    }
                });
            },
            parameters: function (req, callback) {
                SPulseApi.parameters(req, function (data) {
                    if (null != data) {
                        callback(data.ParameterList.ParameterArray.Parameter);
                    }
                });
            }
        };
        return ret;
    });
```
### Angular Controller to get retail location insights ###
```javascript
    .controller('SpendingPulseCtrl', function ($window, $scope, SPulseService, moment) {
        var req = {
            country: "US",
            currentRow: "1",
            period: "Weekly",
            offset: "25"
        };
        $scope.req = req;
        $scope.sectors = [];
        $scope.chartData = [];
        $scope.chart = {}
        $scope.xAxisTickFormat = function () {
            return function (value) {
                return moment(value).format("wo") + " Week";
            };
        }
        SPulseService.spendingPulse(req, function (data) {
            var ret = SPulseService.chartData({
                field: "Sector",
                xField: "PeriodStartDate",
                data: data,
                arr: ["SalesYearOverYearChange", "PriceIndexYearOverYearChange", "TransactionIndexYearOverYearChange", "SameStoreSalesIndexYearOverYearChange"],
                arrTitle: ["Sales YoY", "Price YoY", "Transactions YoY", "Same Store YoY"],
                arrBar: [true, false, false, false],
                sectorPrefix: [false, false, false, false]
            });
            $scope.chartData = ret.chartData;
            $scope.chart = ret.chart;
            $scope.sectors = ret.sectors;
        });
    })

    .controller('GasWeeklyCtrl', function ($window, $scope, SPulseService, moment) {
        var req = {};
        $scope.sectors = [];
        $scope.chartData = [];
        $scope.chart = {}
        $scope.xAxisTickFormat = function () {
            return function (value) {
                return moment(value).format("wo") + " Week";
            };
        }
        SPulseService.gasWeekly(req, function (data) {
            var ret = SPulseService.chartData({
                field: "PADDCode",
                xField: "WeekEndDate",
                data: data,
                arr: ["TotalMillionsOfBarrelsSold", "PADDMillionsofBarrelsSold", "TotalPercentChangeInBarrelsFromPriorWeek", "PADDPercentChangeInBarrelsFromPriorWeek"],
                arrTitle: ["Barrels Sold (m)", "Barrels Sold (m)", "Weekly Change", "Weekly Change"],
                arrBar: [true, true, false, false],
                sectorPrefix: [false, true, false, true]
            });
            $scope.chartData = ret.chartData;
            $scope.chart = ret.chart;
            $scope.sectors = ret.sectors;
        });
    })

    .controller('SubscriptionsCtrl', function ($scope, SPulseService) {
        $scope.subscriptions = {
        };
        var req = {
            currentRow: "1",
            offset: "25"
        };
        SPulseService.subscriptions(req, function (data) {
            $scope.subscriptions = data;
        });
    })

    .controller('ParametersCtrl', function ($scope, SPulseService) {
        $scope.industries = {
        };
        var req = {
            currentRow: "1",
            offset: "25"
        };
        SPulseService.parameters(req, function (data) {
            $scope.parameters = data;
        });
    });
```
### Angular Template to display the list of subscriptions ###
```html
    <ion-list>
      <ion-item class="item" ng-repeat="sub in subscriptions" type="item-text-wrap">
        <h2>{{sub.Country}} - {{sub.Period}}</h2>
        <p>{{sub.Sector}} / {{sub.ReportType}}</p>
      </ion-item>
    </ion-list>
```
### Angular Template to display spending pulse reports chart ###
```html
    <ion-list>
      <ion-item class="item" ng-repeat="cData in chartData" type="item-text-wrap">
        <h2>{{cData.title}}</h2>
        <nvd3-line-plus-bar-chart data="cData.data" id="spendingPulseChart{{$index}}" staggerLabels="true" showXAxis="true" showYAxis="true"
          interactive="true" tooltips="true" showControls="true" showLegend="true" clipEdge="true" height="{{chart.height}}"
          xAxisTickFormat="xAxisTickFormat()" noData="Please wait loading data...">
          <svg></svg>
        </nvd3-line-plus-bar-chart>
      </ion-item>
    </ion-list>
```
### Angular Template to display weekly gasoline reports chart ###
```html
    <ion-list>
      <ion-item class="item" ng-repeat="cData in chartData" type="item-text-wrap">
        <h2>{{cData.title}}</h2>
        <nvd3-line-plus-bar-chart data="cData.data" id="gasWeeklyChart{{$index}}" staggerLabels="true" showXAxis="true" showYAxis="true"
          interactive="true" tooltips="true" reduceXTicks="true" showControls="true" showLegend="true" clipEdge="true" height="{{chart.height}}"
          xAxisTickFormat="xAxisTickFormat()" noData="Please wait loading data...">
          <svg></svg>
        </nvd3-line-plus-bar-chart>
      </ion-item>
    </ion-list>
```
### Angular Template to display the list of reports subscribed to ###
```html
    <ion-list>
      <ion-item class="item" ng-repeat="prm in parameters" type="item-text-wrap">
        <h2>{{prm.ProductLine}} - {{prm.Period}}</h2>
        <p>{{prm.Sector}} / {{prm.ReportType}}</p>
      </ion-item>
    </ion-list>
```
