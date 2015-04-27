(function ($, app) {

    'use strict';

    $(function () {

        var showError = function (error) {
            app.containers.errorMessage.text(error);
            app.modals.error.modal();
        };

        var dataPoints = [
            { name: 'sessions', invertStyleRule: false },
            { name: 'conversions', invertStyleRule: false },
            { name: 'spend', invertStyleRule: true },
            { name: 'conversionCosts', invertStyleRule: true },
            { name: 'referringDomains', invertStyleRule: false },
            { name: 'brandedSearches', invertStyleRule: false },
            { name: 'onlineSales', invertStyleRule: false },
            { name: 'socialTrend', invertStyleRule: false }
        ], interval;

        var renderData = function (data) {
            app.data = data;

            app.data.mapCurrent = $.extend(true, { current: 0 }, data.end.trafficStats[0]);
            for (var i = 0; i < dataPoints.length; i++) {
                app.render.startEnd(dataPoints[i].name, data, dataPoints[i].invertStyleRule);
            }

            app.render.value('users', 'end', data);
            app.render.value('conversionRate', 'end', data);

            app.render.list(data.end.topPages, '<ul>', $('#topPages-container').find('.value'));

            app.render.list(data.end.keywords, '<ol>', $('#keywords-container').find('.endValue'));
            app.render.list(data.start.keywords, '<ol>', $('#keywords-container').find('.startValue'));

            var colors = {
                ppc: {
                    end: { value: '#ffbf00', bkg: '#5c432b', label: '#222' },
                    start: { value: '#826100', bkg: '#402d32', label: '#ccc' }
                },
                email: {
                    end: { value: '#ff6600', bkg: '#5c2c2b', label: '#ccc' },
                    start: { value: '#732e00', bkg: '#402232', label: '#ccc' }
                },
                banners: {
                    end: { value: '#4ba4aa', bkg: '#2f3c55', label: '#ccc' },
                    start: { value: '#2d6165', bkg: '#2a2a47', label: '#ccc' }
                },
                thirdParty: {
                    end: { value: '#f0f0f0', bkg: '#584f67', label: '#222' },
                    start: { value: '#7f7f7f', bkg: '#3e334f', label: '#ccc' }
                }
            };

            var doughnutData = [
                { label: 'PPC', value: data.end.ppc , prev: data.start.ppc},
                { label: 'Banners', value: data.end.banners, prev: data.start.banners },
                { label: 'Email', value: data.end.email, prev: data.start.email },
                { label: '3rd Party', value: data.end.thirdParty, prev: data.start.thirdParty }
            ];

            app.render.doughnut(
                'End',
                doughnutData,
                [
                    colors.ppc.end.value,
                    colors.banners.end.value,
                    colors.email.end.value,
                    colors.thirdParty.end.value
                ],
                [
                    colors.ppc.end.bkg,
                    colors.banners.end.bkg,
                    colors.email.end.bkg,
                    colors.thirdParty.end.bkg
                ],
                $('#doughnut-container').find('.end'));

            // ppc end
            app.render.bulletgraph({
                value: data.end.ppc,
                maximumValue: data.end.conversions,
                valueBrush: colors.ppc.end.value,
                bkgBrush: colors.ppc.end.bkg,
                labelBrush: colors.ppc.end.label,
                target: data.end.ppcTarget
            }, $('#ppc-container').find('.end'));

            // ppc start
            app.render.bulletgraph({
                value: data.start.ppc,
                maximumValue: data.start.conversions,
                valueBrush: colors.ppc.start.value,
                bkgBrush: colors.ppc.start.bkg,
                labelBrush: colors.ppc.start.label,
                target: data.start.ppcTarget
            }, $('#ppc-container').find('.start'));

            // email end
            app.render.bulletgraph({
                value: data.end.email,
                maximumValue: data.end.conversions,
                valueBrush: colors.email.end.value,
                bkgBrush: colors.email.end.bkg,
                labelBrush: colors.email.end.label,
                target: data.end.emailTarget
            }, $('#email-container').find('.end'));

            // email start
            app.render.bulletgraph({
                value: data.start.email,
                maximumValue: data.start.conversions,
                valueBrush: colors.email.start.value,
                bkgBrush: colors.email.start.bkg,
                labelBrush: colors.email.start.label,
                target: data.start.emailTarget
            }, $('#email-container').find('.start'));

            // banners end
            app.render.bulletgraph({
                value: data.end.banners,
                maximumValue: data.end.conversions,
                valueBrush: colors.banners.end.value,
                bkgBrush: colors.banners.end.bkg,
                labelBrush: colors.banners.end.label,
                target: data.end.bannersTarget
            }, $('#banners-container').find('.end'));

            // banners start
            app.render.bulletgraph({
                value: data.start.banners,
                maximumValue: data.start.conversions,
                valueBrush: colors.banners.start.value,
                bkgBrush: colors.banners.start.bkg,
                labelBrush: colors.banners.start.label,
                target: data.start.bannersTarget
            }, $('#banners-container').find('.start'));

            // third party end
            app.render.bulletgraph({
                value: data.end.thirdParty,
                maximumValue: data.end.conversions,
                valueBrush: colors.thirdParty.end.value,
                bkgBrush: colors.thirdParty.end.bkg,
                labelBrush: colors.thirdParty.end.label,
                target: data.end.thirdPartyTarget
            }, $('#thirdParty-container').find('.end'));

            // third party start
            app.render.bulletgraph({
                value: data.start.thirdParty,
                maximumValue: data.start.conversions,
                valueBrush: colors.thirdParty.start.value,
                bkgBrush: colors.thirdParty.start.bkg,
                labelBrush: colors.thirdParty.start.label,
                target: data.start.thirdPartyTarget
            }, $('#thirdParty-container').find('.start'));
            // */

            app.render.map(app.data.mapCurrent, data.end.trafficStats.length - 1, $('#map-container'));
            buttons.map.text(Resources.Play);

            app.render.chart(data, $('#chart-container'));

            app.render.datePicker(app.datepickers.startRangeBegin);
            app.render.datePicker(app.datepickers.startRangeEnd);
            app.render.datePicker(app.datepickers.endRangeBegin);
            app.render.datePicker(app.datepickers.endRangeEnd);

            app.containers.conversionsHighlight.html(app.containers.conversions.html());

            var getStatus = function () {
                var status = 'negative';

                if (data.end.conversions > data.start.conversions &&
                        data.end.conversionCosts < data.start.conversionCosts) {
                    status = 'positive';
                } else if (data.end.conversions === data.start.conversions &&
                        data.end.conversionCosts === data.start.conversionCosts) {
                    status = 'neutral';
                }

                return status;
            };

            var status = getStatus();

            if (!app.containers.status.hasClass('status-' + status)) {
                app.containers.status
                    .fadeOut(300, function () { 
                        app.containers.status
                            .removeClass('status-positive status-neutral status-negative')
                            .addClass('status-' + status)
                            .fadeIn(500);
                    });
            }

        };

        var setDatePickerValues = function (numberOfDays) {
            var defaultRange = app.utils.getDateRange(numberOfDays);
            app.datepickers.startRangeBegin.igDatePicker('value', defaultRange.startRangeBegin);
            app.datepickers.startRangeEnd.igDatePicker('value', defaultRange.startRangeEnd);
            app.datepickers.endRangeBegin.igDatePicker('value', defaultRange.endRangeBegin);
            app.datepickers.endRangeEnd.igDatePicker('value', defaultRange.endRangeEnd);
        };

        var buttons = app.buttons;
        var datepickers = app.datepickers;

        var renderByDateRange = function (numberOfDays) {
            
            var range = app.utils.getDateRange(numberOfDays);
            setDatePickerValues(numberOfDays)

            app.dataService.get(range)
                .then(function (data) {
                    interval = window.clearInterval(interval);
                    renderData(data);
                })
                .fail(showError);
        };

        var updateMapData = function (data) {
            var map = app.data.mapCurrent.perLocation;
            for (var i = 0; i < map.length; i++) {
                map[i].scaledSessions = data[i].scaledSessions;
                map[i].session = data[i].session;
                app.controls.map.igMap('notifySetItem', map, i, map[i]);
            }
        }

        buttons.navigation.click(function (e) {
            buttons.navigation.removeClass('selected');
            $(e.currentTarget).addClass('selected');
        });

        buttons.chart.click(function (e) {
            buttons.chart.removeClass('selected');
            $(e.currentTarget).addClass('selected');
        });

        buttons.oneWeek.click(function (e) {
            renderByDateRange(7);
        });

        buttons.oneMonth.click(function (e) {
            var current = new Date();
            current.setMonth(current.getMonth() - 1);
            var days = (new Date() - current) / 86400000;
            renderByDateRange(days);
        });

        buttons.threeMonths.click(function (e) {
            var current = new Date();
            current.setMonth(current.getMonth() - 3);
            var days = (new Date() - current) / 86400000;
            renderByDateRange(days);
        });

        buttons.oneYear.click(function (e) {
            renderByDateRange(365);
        });

        buttons.compare.click(function (e) {

            var range = {
                startRangeBegin: datepickers.startRangeBegin.igDatePicker('value'),
                startRangeEnd: datepickers.startRangeEnd.igDatePicker('value'),

                endRangeBegin: datepickers.endRangeBegin.igDatePicker('value'),
                endRangeEnd: datepickers.endRangeEnd.igDatePicker('value')
            };

            app.dataService.get(range)
                           .then(function (data) {
                                interval = window.clearInterval(interval);
                                renderData(data);
                           })
                           .fail(showError);;
        });

        buttons.allConversions.click(function (e) {
            app.chartMediumMode = false;

            for (var series in app.utils.chartMediumBrushes) {
                app.controls.chart.igDataChart("option", "series", [{ name: series, remove: true }]);
            }

            app.controls.chart.igDataChart("option", "axes",
                   [{
                       name: "stats",
                       isLogarithmic: true,
                       title: "LOG"
                   }]);

            var series = app.utils.barSeriesOptions();
            for (var i = 0; i < series.length; i++) {
                app.controls.chart.igDataChart("option", "series", [series[i]]);
            }
            app.render.chart(app.data, app.controls.chart);
        });

        buttons.medium.click(function (e) {
            app.chartMediumMode = true;
            app.controls.chart
                .igDataChart("option", "series",
                    [{ name: "sessions", remove: true },
                    { name: "conversion", remove: true },
                    { name: "conversionPrev", remove: true },
                    { name: "sessionsPrev", remove: true }])
                .igDataChart("option", "axes",
                    [{
                        name: "stats",
                        isLogarithmic: false,
                        title: null
                    }]);

            var series = app.utils.areaSeriesOptions();
            for (var i = 0; i < series.length; i++) {
                app.controls.chart.igDataChart("option", "series", [series[i]]);
            }
            app.render.chart(app.data, app.controls.chart);
        });

        buttons.map.click(function (e) {

            if (interval) {
                interval = window.clearInterval(interval);
                buttons.map.text(Resources.Play).removeClass('selected');
                return;
            }

            interval = window.setInterval(function () {
                if (++app.data.mapCurrent.current >= app.data.end.trafficStats.length) {
                    app.data.mapCurrent.current = 0;
                }
                app.controls.mapProgress.progressbar('option', 'value', app.data.mapCurrent.current);
                updateMapData(app.data.end.trafficStats[app.data.mapCurrent.current].perLocation);
            }, 1000);

            buttons.map.text(Resources.Pause).addClass('selected');
        });

        buttons.hideRandomDataModal.click(function () {
            localStorage.showRandomDataMessage = false;
        });

        app.containers.question.click(function () {
            app.modals.randomData.modal();
        });

        var showRandomDataMessage = function () {
            return localStorage.showRandomDataMessage === undefined ||
                    localStorage.showRandomDataMessage === "true";
        };

        app.dataService.get()
                       .then(function (data) {
                            interval = window.clearInterval(interval);
                            renderData(data);

                            setDatePickerValues(365);

                            $('.deferred').fadeIn(300, function () {
                                if (showRandomDataMessage()) {
                                    app.modals.randomData.modal();
                                }
                            });
                       })
                       .fail(showError);;
    });

}(jQuery, window.app));