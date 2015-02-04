(function ($, app) {

    'use strict';

    window.app = app || {};

    $(function () {

        window.app.datepickers = {
            startRangeBegin: $('#start-range-begin'),
            startRangeEnd: $('#start-range-end'),
            endRangeBegin: $('#end-range-begin'),
            endRangeEnd: $('#end-range-end')
        };

        window.app.modals = {
            randomData: $('#random-data-modal'),
            error: $('#error-modal')
        };

        window.app.controls = {
            map: $('#map-container'),
            mapProgress: $('#map-progress'),
            chart: $("#chart-container")
        };

        window.app.containers = {
            conversions: $('#conversions-container'),
            conversionsHighlight: $('#conversions-highlight'),
            status: $('#status-container'),
            question: $('#question-container'),
            errorMessage: app.modals.error.find('.modal-body')
        };

        window.app.buttons = {
            navigation: $('#navigation-container button'),
            chart: $('#chart-view-buttons button'),
            oneWeek: $('#one-week-button'),
            oneMonth: $('#one-month-button'),
            threeMonths: $('#three-months-button'),
            oneYear: $('#one-year-button'),
            allConversions: $('#all-button'),
            medium: $('#medium-button'),
            ppc: $('#ppc-button'),
            email: $('#email-button'),
            banners: $('#banners-button'),
            thirdParty: $('#thirdParty-button'),
            compare: $('#compare-button'),
            hideRandomDataModal: $('#hide-random-data-modal'),
            map: $("#map-play")
        };
    });


}(jQuery, window.app));