//
// --------------------------------------------- HTTP SERVICE REPLACEMENT -----
//
app.factory('nsHttp', ['$http',
    function($http) {

        var addDomainHeaders = function(method, config) {
            var conf = {};

            if (config) conf = config;
            else conf.headers = {};

            if (method) conf.headers['X-Ns-Domain-Data'] = method;

            return conf;
        };

        return {

            post: function(url, data, config, method) {
                return $http.post(url, data, addDomainHeaders(method, config));
            },
            put: function(url, data, config, method) {
                return $http.put(url, data, addDomainHeaders(method, config));
            },
            delete: function(url, config, method) {
                return $http.delete(url, addDomainHeaders(method, config));
            },

            // Returns a promise.
            get: function(url, config, method) {
                return $http.get(url, addDomainHeaders(method, config));
            }
        }
    }
]);

//
// --------------------------------------------- REQUEST INTERCEPTOR -----
//
app.factory('ahcDataInterceptor', function($q) {

    // Do some more interesting stuff here.

    var getHeaderValue = function() {
        return 'Some lazy loaded value from the interceptor';
    };

    return {
        response: function(config) {
            return config;
        },
        request: function(config) {
            // Do some other interesting stuff here.

            config.headers['X-Ns-Header'] = getHeaderValue();

            return config;
        }
    };
});

app.config(['$httpProvider',
    function($httpProvider) {
        $httpProvider.interceptors.push('ahcDataInterceptor');
    }
]);