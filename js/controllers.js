angular.module('spulse.controllers', [])

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
