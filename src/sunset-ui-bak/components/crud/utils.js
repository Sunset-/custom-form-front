export default {
    //获取remote数据
    remoteData(data) {
        return Promise.resolve().then(() => {
            if (Sunset.isFunction(data)) {
                return data();
            } else {
                return data;
            }
        });
    },
    //生成多项
    generateItems(options, ctx) {
        return Promise.resolve().then(res => {
            var data = options.data,
                enumType = options.enum;
            var items = [];
            if (data) {
                return Promise.resolve().then(() => {
                    if (Sunset.isFunction(data)) {
                        return data(ctx);
                    }
                    return data;
                }).then(data => {
                    return this._generateArrayOrObjectItems(data, options);
                });
            } else if (enumType) {
                //字典型
                var enums = Base && Base.ENUMS && Base.ENUMS[enumType];
                return enums && enums.map(item => ({
                    value: item.key,
                    text: item.value
                })) || [];
            } else {
                return [];
            }
        });
    },
    _generateArrayOrObjectItems(data, options) {
        var items = [];
        if (Sunset.isArray(data)) {
            //数组型
            var valuePlace = options.valuePlace || 'value',
                textPlace = options.textPlace || 'text';
            data.forEach(item => {
                items.push({
                    value: item[valuePlace],
                    text: item[textPlace]
                });
            });
        } else if (Sunset.isObject(data)) {
            //对象型
            for (var key in data) {
                if (data.hasOwnProperty(key)) {
                    items.push({
                        value: key,
                        text: data[key]
                    });
                }
            }
            items.sort((o1, o2) => {
                return o1.key == o2.key ? 0 : (o1.key < o2.key ? -1 : 1);
            });
        }
        return items;
    }
};