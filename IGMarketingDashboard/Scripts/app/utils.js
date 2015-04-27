(function ($, Q) {

    'use strict';

    window.app = window.app || {};

    window.app.data = [];
    window.app.chartMediumMode = false;

    var svc = {
        rootUrl: '/',

        chartMediumBrushes: {
            organic: { title: Resources.Organic, color: '#77B40D' },
            paid: { title: Resources.Paid, color: '#A9D120' },
            direct: { title: Resources.Direct, color: '#CCE575' },
            referral: { title: Resources.Referral, color: '#E1EEB5' },
            email: { title: Resources.Email, color: '#FFFFFF' }
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
                    title: this.chartMediumBrushes[medium].title.toUpperCase(),
                    outline: this.chartMediumBrushes[medium].color,
                    transitionDuration: 800,
                    isTransitionInEnabled: true,
                    showTooltip: true,
                    tooltipTemplate: counter > 0 ? '' : '' +
                        '<div class="chart-tooltip"> ' +
                        '   <div class="item bold">${item.title}</div>' +
                        '   <div><span class="caps-muted">' + Resources.Session + ':</span> ${item.session}</div>' +
                        '   <div><span class="caps-muted">' + Resources.Conversions + ':</span> ${item.conversion}</div>' +
                        '</div>',
                    brush: this.chartMediumBrushes[medium].color,
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
                title: Resources.Session,
                brush: '#ffff33',
                outline: '#ffff33',
                tooltipTemplate: '<div class="chart-tooltip"> ' +
                                 '  <div class="item bold">${item.title}</div>' +
                                 '  <div><span class="caps-muted">' + Resources.Session + ':</span> ${item.session}</div>' +
                                 '</div>'
            }, {
                name: 'conversion',
                xAxis: 'timeConvers',
                valueMemberPath: 'conversion',
                title: Resources.Conversions,
                brush: '#66cc00',
                outline: '#66cc00',
                tooltipTemplate: '<div class="chart-tooltip"> ' +
                                 '  <div><span class="caps-muted">' + Resources.Conversions + ':</span> ${item.conversion}</div>' +
                                 '</div>'
            },

            /* previous period */
            {
                name: 'sessionsPrev',
                xAxis: 'time',
                valueMemberPath: 'session',
                title: Resources.PrevSession,
                brush: '#655F00',
                outline: '#655F00',
                tooltipTemplate: '' +
                    ' <div class="chart-tooltip"> ' +
                    '   <div class="item caps-muted">' + Resources.PrevSession + ': ${item.session}</div>' +
                    '</div>'
            },
            {
                name: 'conversionPrev',
                xAxis: 'timeConvers',
                valueMemberPath: 'conversion',
                title: Resources.PrevConversions,
                brush: '#295001',
                outline: '#295001',
                tooltipTemplate: '' +
                    '<div class="chart-tooltip"> ' +
                    '   <div class="caps-muted">' + Resources.PrevConversions + ': ${item.conversion}</div>' +
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

        getDateString: function (date) {
            // IE 10 and below don't create proper format 
            return date.toUTCString().replace('UTC', 'GMT');
        },

        convertToInt: function (string) {
            return parseInt(string.replace(/,/g, ''));
        }
    };

    window.app.utils = svc;

}(jQuery, Q));