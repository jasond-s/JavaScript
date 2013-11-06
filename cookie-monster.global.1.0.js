COOKIE_MONSTER = function CookieHelper() {
    var parent = this;
    this.init = function() {
        // Possibly add Staffplan specific cookie initialisation here.
    };
    this.get = function(name) {
        var dc = document.cookie;
        var prefix = name + "=";
        var begin = dc.indexOf("; " + prefix);
        var end = null;
        if (begin == -1) {
            begin = dc.indexOf(prefix);
            if (begin != 0) return null;
        } else {
            begin += 2;
            end = document.cookie.indexOf(";", begin);
            if (end == -1) {
                end = dc.length;
            }
        }
        return unescape(dc.substring(begin + prefix.length, end));
    };
    this.create = function(name, value, days) {
        var expires;
        if (days) {
            var date = new Date();
            var daysIn = days;
            if (daysIn.toLowerCase() === "never") {
                days = 20 * 365;
            }
            if (daysIn.toLowerCase() === "session") {
                expires = "";
            } else {
                date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
                expires = "; expires=" + date.toGMTString();
            }
        } else {
            expires = "";
        }
        document.cookie = name + "=" + value + expires + "; path=/";
        this[name] = value;
    };
    this.delete = function(name) {
        this.create(name, '', -1);
        this[name] = undefined;
    };
}();