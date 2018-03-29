export default function () {
    var lastType = null,
        lastRange = null;

    function isRangeTrue(range) {
        return range && range[0] && range[1];
    }
    return {
        fields: [{
            name: 'type',
            widget: 'radio',
            type: 'button',
            changeFilter: true,
            default: 'DAY',
            watch: ['range', function (dep, options, model) {
                if (isRangeTrue(dep.range)) {
                    lastType = null;
                    model.type = '';
                }
                return false;
            }],
            data: [{
                text: '今天',
                value: 'DAY'
            }, {
                text: '本月',
                value: 'MONTH'
            }, {
                text: '全部',
                value: 'ALL'
            }]
        }, {
            name: 'range',
            widget: 'date',
            placeholder: '请选择日期区间',
            changeFilter: true,
            watch: ['type', function (dep, options, model) {
                if (dep.type) {
                    lastRange = null;
                    model.range = [null, null];
                }
                return false;
            }],
            type: 'daterange'
        }],
        format(filter) {
            var type = filter.type,
                range = filter.range,
                result = {};
            if (!type && !isRangeTrue(range)) {
                return 'SKIP';
            }
            if (type == lastType && (isRangeTrue(range) && range.toString() == lastRange)) {
                return 'SKIP';
            }
            if (type && lastType != type) {
                switch (type) {
                    case 'DAY':
                        var now = new Date();
                        now.setHours(0);
                        now.setMinutes(0);
                        now.setSeconds(0);
                        now.setMilliseconds(0);
                        result.startTime = now.getTime();
                        result.endTime = now.getTime() + 86399999;
                        break;
                    case 'MONTH':
                        var now = new Date();
                        now.setHours(0);
                        now.setMinutes(0);
                        now.setSeconds(0);
                        now.setMilliseconds(0);
                        result.endTime = now.getTime() +
                            86399999;
                        now.setDate(1);
                        result.startTime = now.getTime();
                        break;
                    case 'ALL':  result.endTime = "";
                        result.startTime = "";
                        break;
                }
            } else if (isRangeTrue(range) && range.toString() != lastRange) {
                result.startTime = new Date(Sunset.Dates.format(range[0], 'yyyy-MM-dd 00:00:00')).getTime();
                result.endTime = new Date(Sunset.Dates.format(range[1], 'yyyy-MM-dd 23:59:59')).getTime();
            } else {
                return 'SKIP';
            }
            lastType = type;
            lastRange = isRangeTrue(range) && range.toString();
            return result;
        }
    };
}