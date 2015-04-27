(function ($, Q) {

    'use strict';

    window.app = window.app || {};

    var svc = {
        get: function (range) {
            var deferred = Q.defer();

            range = app.utils.getDateRangeAsJSON(range);

            $.get(app.utils.rootUrl  + 'api/summary', range).done(function (response) {

                    var data = {
                        start: {},
                        end: {}
                    };

                    if (response.length > 0) {
                        data.start = response[0];
                        data.end = response[1];
                    }

                    deferred.resolve(data);

            }).fail(function (error) {
                deferred.reject(Resources.Error);
            });

            return deferred.promise;
        }
    };

    window.app.dataService = svc;

}(jQuery, Q));