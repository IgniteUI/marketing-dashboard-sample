(function ($, app) {

    'user strict';

    window.app = app || {};

    var svc = {

        startEnd: function (key, data, invertStyleRule) {
            var endString = data.end[key];
            var end = app.utils.convertToInt(endString);
            var startString = data.start[key];
            var start = app.utils.convertToInt(startString);
            var change = end - start;
            var isPositiveChange = change >= 0;
            var dec = change / start;
            var percent = Math.abs(Math.round(dec * 100));

            var $container = $('#' + key + '-container');
            var $end = $container.find('.end');
            var $start = $container.find('.start');
            var $percent = $container.find('.percent');
            var $direction = $container.find('.direction');

            var direction = 'down';
            var endClassName = 'danger';

            if (isPositiveChange) {
                direction = 'up';
                endClassName = 'success';
            }

            if (percent === 0) {
                direction = '';
                endClassName = '';
            }

            if (invertStyleRule) {
                endClassName = (endClassName === 'success') ? 'danger' : 'success';
            }

            $direction.removeClass('fa-chevron-up fa-chevron-down danger success').addClass('fa-chevron-' + direction);

            var directionColor = 'success';
            if (direction === 'up') {
                directionColor = 'success';
            } else {
                directionColor = 'danger';
            }

            if (invertStyleRule) {
                if (direction === 'up') {
                    directionColor = 'danger';
                } else {
                    directionColor = 'success';
                }
            }

            $direction.addClass(directionColor);

            $percent.text(percent);

            $start.text(startString);
            $end.text(endString).removeClass('danger success').addClass(endClassName);

        },

        value: function (key, period, data) {
            $('#' + key + '-container').find('.value').text(data[period][key]);
        },

        list: function (list, rootElement, $container) {
            if (!rootElement) rootElement = '<ul>';
            $container.html('');
            var root = $(rootElement);
            for (var i = 0; i < list.length; i++) {
                root.append('<li>' + list[i] + '</li>');
            }
            $container.append(root);
        },

        doughnut: function (name, data, colors, fadedColors, $container) {

            $container.css('background-color', 'rgba(0,0,0,0)');

            if ($container.data('igDoughnutChart')) {
                $container.igDoughnutChart("option", "series", [{ name: name, dataSource: data }, { name: name + "2", dataSource: data }]);
            }
            else {
                $container.igDoughnutChart({
                    width: '120%',
                    height: '200px',
                    innerExtent: 20,
                    allowSliceSelection: true,
                    sliceClick: function (e, ui) {
                        ui.slice.item.showLabel = ui.slice.isSelected = !ui.slice.isSelected;
                        $container.igDoughnutChart("updateSeries", { name: name, labelMemberPath: 'label' });
                        $container.igDoughnutChart("updateSeries", { name: name + "2", labelMemberPath: 'label' });
                    },
                    selectedStyle: { strokeThickness: 7 },
                    series:
                    [{
                        name: name + "2",
                        brushes: fadedColors,
                        outlines: fadedColors,
                        labelMemberPath: 'label',
                        valueMemberPath: 'prev',
                        dataSource: data,
                        startAngle: -90,
                        labelsPosition: 'center',
                        radiusFactor: 0.8,
                        formatLabel: function (context) {
                            if (!context.item.showLabel) return "";
                            return Math.round(context.percentValue) + "%";
                        }
                    }, {
                        name: name,
                        brushes: colors,
                        outlines: colors,
                        labelMemberPath: 'label',
                        valueMemberPath: 'value',
                        dataSource: data,
                        startAngle: -90,
                        labelsPosition: 'center',
                        formatLabel: function (context) {
                            if (!context.item.showLabel) return "";
                            return Math.round(context.percentValue) + "%";
                        }
                    }]
                });
            }
        },

        bulletgraph: function (data, $container) {

            var maxValue = app.utils.convertToInt(data.maximumValue);

            $container.igBulletGraph({
                height: '40px',
                width: '100%',
                minimumValue: 0,
                maximumValue: maxValue,
                backingBrush: 'transparent',
                backingOutline: 'transparent',
                interval: maxValue,
                targetValue: data.target,
                transitionDuration: 800,
                labelExtent: 0.4,
                fontBrush: data.labelBrush,
                font: "bold 14px Helvetica, Arial, sans-serif",
                formatLabel: function (evt, ui) {
                    ui.label = " " + ui.label;
                    if (ui.value == 0) {
                        if (ui.owner.options.ranges[0].endValue >= 1000){
                            ui.label = (ui.owner.options.ranges[0].endValue / 1000).toFixed(1) + "K";
                        }
                        else {
                            ui.label = ui.owner.options.ranges[0].endValue;
                        }
                    }
                    else {
                       ui.label = Math.round((ui.owner.options.ranges[0].endValue / ui.value * 2) * 100) + '%';
                    }
                },
                alignLabel: function (evt, ui) {
                    ui.height = 0;
                    if (ui.value == 0) {
                        ui.offsetX += 20;
                    }
                    else {
                        ui.offsetX += -25;
                    }
                },
                ranges: [
                    {
                        name: 'value',
                        startValue: 0,
                        endValue: data.value,
                        brush: data.valueBrush
                    },
                    {
                        name: 'remaining',
                        startValue: data.value,
                        endValue: maxValue,
                        brush: data.bkgBrush
                    }]
            });

        },

        map: function (data, range, $container) {
            $container.igMap({
                width: '100%',
                height: '280px',
                zoomable: false,
                dataSource: data.perLocation,
                windowRect: { left: 0, top: 0, height: 0.7, width: 0.7 },
                crosshairVisibility: 'collapsed',
                backgroundContent: null,
                series: [
                {
                    type: 'geographicShape',
                    name: 'world',
                    shapeDataSource: app.utils.rootUrl + 'Content/world.shp',
                    databaseSource: app.utils.rootUrl + 'Content/world.dbf',
                    brush: '#6F6B75',
                    outline: '#67626E'
                },
                {
                    type: 'geographicProportionalSymbol',
                    name: 'countryTraffic',
                    latitudeMemberPath: 'Latitude',
                    longitudeMemberPath: 'Longitude',
                    markerType: 'circle',
                    radiusMemberPath: 'scaledSessions',
                    markerOutline: '#ffff33',
                    markerBrush: '#ffff33',
                    showTooltip: true,
                    tooltipTemplate: '<span> ${item.country}, ${item.session} </span>'
                }],
            });

            app.controls.mapProgress.progressbar({
                max: range,
                value: 0
            });
        },

        chart: function (data, $container) {
            if ($container.data('igDataChart')) {
                if (app.chartMediumMode) {
                    $container.igDataChart('option', 'dataSource', app.data.end.trafficPerMedium);
                }
                else {
                    $container.igDataChart('option', 'dataSource', data.end.trafficStats)
                              .igDataChart('option', 'series',
                                  [{
                                      name: 'conversionPrev',
                                      dataSource: data.start.trafficStats
                                  }]
                              ).igDataChart('option', 'series',
                                  [{
                                      name: 'sessionsPrev',
                                      dataSource: data.start.trafficStats
                                  }]
                              );
                }
                return;
            }
            
            var barSeries = app.utils.barSeriesOptions();
            barSeries[2].dataSource = data.start.trafficStats;
            barSeries[3].dataSource = data.start.trafficStats;
            barSeries.push(
            {
                /* tooltips */
                name: 'categorySeries',
                type: 'categoryToolTipLayer',
                toolTipPosition: 'insideEnd',
                transitionDuration: 200
            });

            $container.igDataChart({
                width: '100%',
                height: '225px',
                dataSource: data.end.trafficStats,
                animateSeriesWhenAxisRangeChanges: true,
                axes: [
                    {
                        name: 'stats',
                        type: 'numericY',
                        title: 'LOG',
                        titleAngle: 270,
                        isLogarithmic: true,
                        formatLabel: function (value) {
                            var label = value;
                            if (value >= 1000) label = (value / 1000) + 'K';
                            return label;
                        }
                    },
                    {
                        name: 'time',
                        type: 'categoryX',
                        label: 'title',
                        gap: 0.5,
                        overlap: -0.3
                    },
                    {
                        name: 'timeConvers',
                        type: 'categoryX',
                        labelVisibility: "collapsed",
                        gap: 0.5,
                        overlap: -0.3
                    }
                ],
                series: barSeries,
                legend: {
                    element: 'chart-legend'
                }
            });
        },

        datePicker: function ($container) {
            $container.igDatePicker({
                width: 80,
                regional: Resources.Regional,
                textAlign : "center",
                focusOnDropDownOpen: false,
                dropDownOnReadOnly: true,
                datepickerOptions: {
                    showOtherMonths: true,
                    selectOtherMonths: true
                },
                focus: function (evt) {
                    if (Modernizr.touch) return;
                    $container.igDatePicker("dropDownVisible", true);
                }
            });
        }
    };

    window.app.render = svc;

}(jQuery, window.app));