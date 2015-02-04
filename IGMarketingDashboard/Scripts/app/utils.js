(function ($, Q) {

    'use strict';

    window.app = window.app || {};

    window.app.data = [];
    window.app.chartMediumMode = false;

    var svc = {
        rootUrl: '/',

        chartMediumBrushes: {
            organic: '#77B40D',
            paid: '#A9D120',
            direct: '#CCE575',
            referral: '#E1EEB5',
            email: '#FFFFFF'
        },

        areaSeriesOptions: function () {
            var series = [];
            var counter = 0;
            for (var medium in this.chartMediumBrushes) {
                series.push({
                    name: medium,
                    valueMemberPath: medium,
                    xAxis: 'time',
                    yAxis: 'stats',
                    type: 'area',
                    title: medium.toUpperCase(),
                    outline: this.chartMediumBrushes[medium],
                    transitionDuration: 800,
                    isTransitionInEnabled: true,
                    showTooltip: true,
                    tooltipTemplate: counter > 0 ? '' : '' +
                        '<div class="chart-tooltip"> ' +
                        '   <div class="item bold">${item.title}</div>' +
                        '   <div><span class="caps-muted">Sessions:</span> ${item.session}</div>' +
                        '   <div><span class="caps-muted">Conversions:</span> ${item.conversion}</div>' +
                        '</div>',
                    brush: this.chartMediumBrushes[medium],
                    areaFillOpacity: 0.5
                });
                counter++;
            }
            return series;
        },

        barSeriesOptions: function () {
            var series = [
            {
                name: 'sessions',
                xAxis: 'time',
                valueMemberPath: 'session',
                title: 'Sessions',
                brush: '#ffff33',
                outline: '#ffff33',
                tooltipTemplate: '<div class="chart-tooltip"> ' +
                                 '  <div class="item bold">${item.title}</div>' +
                                 '  <div><span class="caps-muted">Sessions:</span> ${item.session}</div>' +
                                 '</div>'
            }, {
                name: 'conversion',
                xAxis: 'timeConvers',
                valueMemberPath: 'conversion',
                title: 'Conversions',
                brush: '#66cc00',
                outline: '#66cc00',
                tooltipTemplate: '<div class="chart-tooltip"> ' +
                                 '  <div><span class="caps-muted">Conversions:</span> ${item.conversion}</div>' +
                                 '</div>'
            },

            /* previous period */
            {
                name: 'sessionsPrev',
                xAxis: 'time',
                valueMemberPath: 'session',
                title: 'Prev. Sessions',
                brush: '#655F00',
                outline: '#655F00',
                tooltipTemplate: '' +
                    ' <div class="chart-tooltip"> ' +
                    '   <div class="item caps-muted">Prev. Sessions: ${item.session}</div>' +
                    '</div>'
            },
            {
                name: 'conversionPrev',
                xAxis: 'timeConvers',
                valueMemberPath: 'conversion',
                title: 'Prev. Conversions',
                brush: '#295001',
                outline: '#295001',
                tooltipTemplate: '' +
                    '<div class="chart-tooltip"> ' +
                    '   <div class="caps-muted">Prev. Conversions: ${item.conversion}</div>' +
                    '</div>'
            }];

            for (var i = 0; i < 4; i++) {
                series[i] = $.extend({
                    yAxis: 'stats',
                    type: 'column',
                    radius: 0,
                    transitionDuration: 800,
                    isTransitionInEnabled: true,
                    showTooltip: true
                }, series[i]);
            }

            return series;
        },

        getDateRangeAsJSON: function (range) {

            if (!range) {
                range = app.utils.getDateRange();
            }

            return {
                "startRangeBegin": app.utils.getDateString(range.startRangeBegin),
                "startRangeEnd": app.utils.getDateString(range.startRangeEnd),
                "endRangeBegin": app.utils.getDateString(range.endRangeBegin),
                "endRangeEnd": app.utils.getDateString(range.endRangeEnd)
            };
        },

        getDateRange: function (numberOfDays) {
            var dayMiliseconds = 1000 * 60 * 60 * 24;
            if (!numberOfDays) {
                numberOfDays = 365;
            }
            var current = new Date();
            var range = {
                endRangeEnd: current,
                
                endRangeBegin: new Date(current.getTime() - dayMiliseconds * numberOfDays),

                startRangeBegin: new Date(current.getTime() - dayMiliseconds * numberOfDays * 2),

                startRangeEnd: new Date(current.getTime() - dayMiliseconds * numberOfDays)
            }

            return range;
        },

        getDateString: function (date){
            return (date.getMonth() + 1) + '/' + date.getDate() + '/' +  date.getFullYear();
        },

        convertToInt: function (string) {
            return parseInt(string.replace(/,/g, ''));
        }
    };

    window.app.utils = svc;

}(jQuery, Q));