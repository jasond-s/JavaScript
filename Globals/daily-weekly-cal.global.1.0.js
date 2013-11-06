DAILY_WEEKLY_CAL = function CalendarDatePicker () {
    var sD = '', eD = '';
    var sSd = function(date) { sD = date; };
    var sEd = function (date) { eD = date; };
    var util = {
        init: function(type) {
            $('#datePickerInput').datepicker('destroy');
            var op = 'weekly';
            if (type === 'weekly') {
                op = 'daily';
            }
            if (type === 'daily') {
                op = 'weekly';
            }
            $('#ui-datepicker-div').removeClass('ui-datepicker-' + op);
            $('#datePickerButton').removeClass('button-datepicker-' + op);
            $('#datePickerButton').addClass('button-datepicker-' + type);
            $('#ui-datepicker-div').addClass('ui-datepicker-' + type);
            util.slctCrrntDay();
        },
        slctCrrntDay: function() {
            window.setTimeout(function() {
                $('#datePickerInput').find('.ui-datepicker-current-day td').addClass('ui-state-active');
            }, 1);
        }
    };
    return {
        getStartDate : function() { return sD; },
        getEndDate : function() { return eD; },
        toDateString : function(day, month, year, seperator) {
            var fullDay, fullMonth, fullYear;
            if (day < 10) {
                fullDay = '0' + day;
            } else {
                fullDay = day;
            }
            if (month < 10) {
                fullMonth = '0' + month;
            } else {
                fullMonth = month;
            }
            fullYear = year;
            return fullDay + seperator + fullMonth + seperator + fullYear;
        },
        ToAndFrom : function() {
            $('#ui-datepicker-div').datepicker('destroy');
            $('#ui-datepicker-div').removeClass('ui-datepicker-weekly');
            $('#ui-datepicker-div').addClass('ui-datepicker-daily');
            $("#datepickerFrom").datepicker({
                changeMonth: true,
                changeYear: true,
                showOtherMonths: true,
                selectOtherMonths: true,
                dateFormat: 'dd/mm/yy',
                firstDay: 1,
                beforeShow: function(input, inst) {
                    inst.dpDiv.css({ marginTop: '0px', marginLeft: '0px' });
                }
            });
            $("#datepickerTo").datepicker({
                changeMonth: true,
                changeYear: true,
                showOtherMonths: true,
                selectOtherMonths: true,
                dateFormat: 'dd/mm/yy',
                firstDay: 1,
                beforeShow: function(input, inst) {
                    inst.dpDiv.css({ marginTop: '0px', marginLeft: '0px' });
                }
            });
            $(".ui-datepicker").css({ display: "none" });
        },
        Weekly : function() {
            var datePicker = this;
            util.init('weekly');
            $('#datePickerInput').datepicker({
                showOn: 'both',
                dateFormat: 'dd/mm/yy',
                buttonImage: '../Content/themes/base/images/EmptyInput.png',
                buttonImageOnly: true,
                changeMonth: true,
                changeYear: true,
                firstDay: 1,
                showOtherMonths: true,
                selectOtherMonths: true,
                onSelect: function(dateText, inst) {
                    var date = $(this).datepicker('getDate');
                    var start = new Date(date.getFullYear(), date.getMonth(), date.getDate() - date.getDay() + 1);
                    var end = new Date(date.getFullYear(), date.getMonth(), date.getDate() - date.getDay() + 7);
                    sSd(datePicker.toDateString(start.getDate(), start.getMonth() + 1, start.getFullYear(), '/'));
                    sEd(datePicker.toDateString(end.getDate(), end.getMonth() + 1, end.getFullYear(), '/'));
                    $('#datePickerLink').click();
                    util.slctCrrntDay();
                },
                beforeShowDay: function(date) {
                    return [true, date >= datePicker.startDate && date <= datePicker.endDate ? 'ui-datepicker-current-day' : ''];
                },
                onChangeMonthYear: function(year, month, inst) {
                    util.slctCrrntDay();
                },
                beforeShow: function(input, inst) {
                    inst.dpDiv.css({ marginTop: (48) + 'px', marginLeft: 3 + 'px' });
                }
            });
            $('.ui-datepicker').css({ display: 'none' });
        },
        Daily : function() {
            var datePicker = this;
            util.init('daily');
            $('#datePickerInput').datepicker({
                showOn: 'both',
                dateFormat: 'dd/mm/yy',
                buttonImage: '../Content/themes/base/images/EmptyInput.png',
                buttonImageOnly: true,
                changeMonth: true,
                changeYear: true,
                firstDay: 1,
                showOtherMonths: true,
                selectOtherMonths: true,
                onSelect: function(dateText, inst) {
                    var date = $(this).datepicker('getDate');
                    sSd(datePicker.toDateString(date.getDate(), date.getMonth() + 1, date.getFullYear(), '/'));
                    sEd(datePicker.toDateString(date.getDate(), date.getMonth() + 1, date.getFullYear(), '/'));
                    $('#datePickerLink').click();
                    util.slctCrrntDay();
                },
                beforeShowDay: function(date) {
                    return [true, date >= datePicker.startDate && date <= datePicker.endDate ? 'ui-datepicker-current-day' : ''];
                },
                onChangeMonthYear: function(year, month, inst) {
                    util.slctCrrntDay();
                },
                beforeShow: function(input, inst) {
                    inst.dpDiv.css({ marginTop: (48) + 'px', marginLeft: 3 + 'px' });
                }
            });
            $('.ui-datepicker').css({ display: 'none' });
        }
    };
}();