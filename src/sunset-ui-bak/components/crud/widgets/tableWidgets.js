const widgets = {
	'Input': ['Input', 'Password'],
	'Radio': 'Radio',
	'Checkbox': 'Checkbox',
	'Select': 'Select',
	'Switch': 'Switch',
	'Date': 'Date',
	'Number': 'Number',
	'Region': 'Region',
	'Cascader': 'Cascader',
	'Textarea': 'Textarea',
	'Image': 'Image',
	'Editor': 'Editor',
	'Tableselect': 'Tableselect'
}


const apis = {};

for (var key in widgets) {
	if (widgets.hasOwnProperty(key)) {
		var widget = require(`./${key}`);
		var alias = widgets[key];
		if (typeof alias == "string") {
			apis[`Widget${alias}`] = widget;
		} else {
			alias.forEach(a => {
				apis[`Widget${a}`] = widget;
			});
		}
	}
}

export default apis;