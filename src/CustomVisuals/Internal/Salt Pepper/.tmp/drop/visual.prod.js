/*
 *  Power BI Visualizations
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */
var powerbi;
(function (powerbi) {
    var extensibility;
    (function (extensibility) {
        var utils;
        (function (utils) {
            var dataview;
            (function (dataview) {
                // TODO: refactor & focus DataViewTransform into a service with well-defined dependencies.
                var DataViewTransform;
                (function (DataViewTransform) {
                    // TODO: refactor this, setGrouped, and groupValues to a test helper to stop using it in the product
                    function createValueColumns(values, valueIdentityFields, source) {
                        if (values === void 0) { values = []; }
                        var result = values;
                        setGrouped(result);
                        if (valueIdentityFields) {
                            result.identityFields = valueIdentityFields;
                        }
                        if (source) {
                            result.source = source;
                        }
                        return result;
                    }
                    DataViewTransform.createValueColumns = createValueColumns;
                    function setGrouped(values, groupedResult) {
                        values.grouped = groupedResult
                            ? function () { return groupedResult; }
                            : function () { return groupValues(values); };
                    }
                    DataViewTransform.setGrouped = setGrouped;
                    /** Group together the values with a common identity. */
                    function groupValues(values) {
                        var groups = [], currentGroup;
                        for (var i = 0, len = values.length; i < len; i++) {
                            var value = values[i];
                            if (!currentGroup || currentGroup.identity !== value.identity) {
                                currentGroup = {
                                    values: []
                                };
                                if (value.identity) {
                                    currentGroup.identity = value.identity;
                                    var source = value.source;
                                    // allow null, which will be formatted as (Blank).
                                    if (source.groupName !== undefined) {
                                        currentGroup.name = source.groupName;
                                    }
                                    else if (source.displayName) {
                                        currentGroup.name = source.displayName;
                                    }
                                }
                                groups.push(currentGroup);
                            }
                            currentGroup.values.push(value);
                        }
                        return groups;
                    }
                    DataViewTransform.groupValues = groupValues;
                })(DataViewTransform = dataview.DataViewTransform || (dataview.DataViewTransform = {}));
            })(dataview = utils.dataview || (utils.dataview = {}));
        })(utils = extensibility.utils || (extensibility.utils = {}));
    })(extensibility = powerbi.extensibility || (powerbi.extensibility = {}));
})(powerbi || (powerbi = {}));
/*
 *  Power BI Visualizations
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */
var powerbi;
(function (powerbi) {
    var extensibility;
    (function (extensibility) {
        var utils;
        (function (utils) {
            var dataview;
            (function (dataview) {
                var DataRoleHelper;
                (function (DataRoleHelper) {
                    function getMeasureIndexOfRole(grouped, roleName) {
                        if (!grouped || !grouped.length) {
                            return -1;
                        }
                        var firstGroup = grouped[0];
                        if (firstGroup.values && firstGroup.values.length > 0) {
                            for (var i = 0, len = firstGroup.values.length; i < len; ++i) {
                                var value = firstGroup.values[i];
                                if (value && value.source) {
                                    if (hasRole(value.source, roleName)) {
                                        return i;
                                    }
                                }
                            }
                        }
                        return -1;
                    }
                    DataRoleHelper.getMeasureIndexOfRole = getMeasureIndexOfRole;
                    function getCategoryIndexOfRole(categories, roleName) {
                        if (categories && categories.length) {
                            for (var i = 0, ilen = categories.length; i < ilen; i++) {
                                if (hasRole(categories[i].source, roleName)) {
                                    return i;
                                }
                            }
                        }
                        return -1;
                    }
                    DataRoleHelper.getCategoryIndexOfRole = getCategoryIndexOfRole;
                    function hasRole(column, name) {
                        var roles = column.roles;
                        return roles && roles[name];
                    }
                    DataRoleHelper.hasRole = hasRole;
                    function hasRoleInDataView(dataView, name) {
                        return dataView != null
                            && dataView.metadata != null
                            && dataView.metadata.columns
                            && dataView.metadata.columns.some(function (c) { return c.roles && c.roles[name] !== undefined; }); // any is an alias of some
                    }
                    DataRoleHelper.hasRoleInDataView = hasRoleInDataView;
                    function hasRoleInValueColumn(valueColumn, name) {
                        return valueColumn
                            && valueColumn.source
                            && valueColumn.source.roles
                            && (valueColumn.source.roles[name] === true);
                    }
                    DataRoleHelper.hasRoleInValueColumn = hasRoleInValueColumn;
                })(DataRoleHelper = dataview.DataRoleHelper || (dataview.DataRoleHelper = {}));
            })(dataview = utils.dataview || (utils.dataview = {}));
        })(utils = extensibility.utils || (extensibility.utils = {}));
    })(extensibility = powerbi.extensibility || (powerbi.extensibility = {}));
})(powerbi || (powerbi = {}));
/*
 *  Power BI Visualizations
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */
var powerbi;
(function (powerbi) {
    var extensibility;
    (function (extensibility) {
        var utils;
        (function (utils) {
            var dataview;
            (function (dataview) {
                var DataViewObject;
                (function (DataViewObject) {
                    function getValue(object, propertyName, defaultValue) {
                        if (!object) {
                            return defaultValue;
                        }
                        var propertyValue = object[propertyName];
                        if (propertyValue === undefined) {
                            return defaultValue;
                        }
                        return propertyValue;
                    }
                    DataViewObject.getValue = getValue;
                    /** Gets the solid color from a fill property using only a propertyName */
                    function getFillColorByPropertyName(object, propertyName, defaultColor) {
                        var value = getValue(object, propertyName);
                        if (!value || !value.solid) {
                            return defaultColor;
                        }
                        return value.solid.color;
                    }
                    DataViewObject.getFillColorByPropertyName = getFillColorByPropertyName;
                })(DataViewObject = dataview.DataViewObject || (dataview.DataViewObject = {}));
            })(dataview = utils.dataview || (utils.dataview = {}));
        })(utils = extensibility.utils || (extensibility.utils = {}));
    })(extensibility = powerbi.extensibility || (powerbi.extensibility = {}));
})(powerbi || (powerbi = {}));
/*
 *  Power BI Visualizations
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */
var powerbi;
(function (powerbi) {
    var extensibility;
    (function (extensibility) {
        var utils;
        (function (utils) {
            var dataview;
            (function (dataview) {
                var DataViewObjects;
                (function (DataViewObjects) {
                    /** Gets the value of the given object/property pair. */
                    function getValue(objects, propertyId, defaultValue) {
                        if (!objects) {
                            return defaultValue;
                        }
                        return dataview.DataViewObject.getValue(objects[propertyId.objectName], propertyId.propertyName, defaultValue);
                    }
                    DataViewObjects.getValue = getValue;
                    /** Gets an object from objects. */
                    function getObject(objects, objectName, defaultValue) {
                        if (objects && objects[objectName]) {
                            return objects[objectName];
                        }
                        return defaultValue;
                    }
                    DataViewObjects.getObject = getObject;
                    /** Gets the solid color from a fill property. */
                    function getFillColor(objects, propertyId, defaultColor) {
                        var value = getValue(objects, propertyId);
                        if (!value || !value.solid) {
                            return defaultColor;
                        }
                        return value.solid.color;
                    }
                    DataViewObjects.getFillColor = getFillColor;
                    function getCommonValue(objects, propertyId, defaultValue) {
                        var value = getValue(objects, propertyId, defaultValue);
                        if (value && value.solid) {
                            return value.solid.color;
                        }
                        if (value === undefined
                            || value === null
                            || (typeof value === "object" && !value.solid)) {
                            return defaultValue;
                        }
                        return value;
                    }
                    DataViewObjects.getCommonValue = getCommonValue;
                })(DataViewObjects = dataview.DataViewObjects || (dataview.DataViewObjects = {}));
            })(dataview = utils.dataview || (utils.dataview = {}));
        })(utils = extensibility.utils || (extensibility.utils = {}));
    })(extensibility = powerbi.extensibility || (powerbi.extensibility = {}));
})(powerbi || (powerbi = {}));
/*
 *  Power BI Visualizations
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */
var powerbi;
(function (powerbi) {
    var extensibility;
    (function (extensibility) {
        var utils;
        (function (utils) {
            var dataview;
            (function (dataview) {
                // powerbi.extensibility.utils.dataview
                var DataRoleHelper = powerbi.extensibility.utils.dataview.DataRoleHelper;
                var converterHelper;
                (function (converterHelper) {
                    function categoryIsAlsoSeriesRole(dataView, seriesRoleName, categoryRoleName) {
                        if (dataView.categories && dataView.categories.length > 0) {
                            // Need to pivot data if our category soure is a series role
                            var category = dataView.categories[0];
                            return category.source &&
                                DataRoleHelper.hasRole(category.source, seriesRoleName) &&
                                DataRoleHelper.hasRole(category.source, categoryRoleName);
                        }
                        return false;
                    }
                    converterHelper.categoryIsAlsoSeriesRole = categoryIsAlsoSeriesRole;
                    function getSeriesName(source) {
                        return (source.groupName !== undefined)
                            ? source.groupName
                            : source.queryName;
                    }
                    converterHelper.getSeriesName = getSeriesName;
                    function isImageUrlColumn(column) {
                        var misc = getMiscellaneousTypeDescriptor(column);
                        return misc != null && misc.imageUrl === true;
                    }
                    converterHelper.isImageUrlColumn = isImageUrlColumn;
                    function isWebUrlColumn(column) {
                        var misc = getMiscellaneousTypeDescriptor(column);
                        return misc != null && misc.webUrl === true;
                    }
                    converterHelper.isWebUrlColumn = isWebUrlColumn;
                    function getMiscellaneousTypeDescriptor(column) {
                        return column
                            && column.type
                            && column.type.misc;
                    }
                    converterHelper.getMiscellaneousTypeDescriptor = getMiscellaneousTypeDescriptor;
                    function hasImageUrlColumn(dataView) {
                        if (!dataView || !dataView.metadata || !dataView.metadata.columns || !dataView.metadata.columns.length) {
                            return false;
                        }
                        return dataView.metadata.columns.some(function (column) { return isImageUrlColumn(column) === true; });
                    }
                    converterHelper.hasImageUrlColumn = hasImageUrlColumn;
                })(converterHelper = dataview.converterHelper || (dataview.converterHelper = {}));
            })(dataview = utils.dataview || (utils.dataview = {}));
        })(utils = extensibility.utils || (extensibility.utils = {}));
    })(extensibility = powerbi.extensibility || (powerbi.extensibility = {}));
})(powerbi || (powerbi = {}));
/*
 *  Power BI Visualizations
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */
var powerbi;
(function (powerbi) {
    var extensibility;
    (function (extensibility) {
        var utils;
        (function (utils) {
            var dataview;
            (function (dataview) {
                var DataViewObjectsParser = (function () {
                    function DataViewObjectsParser() {
                    }
                    DataViewObjectsParser.getDefault = function () {
                        return new this();
                    };
                    DataViewObjectsParser.createPropertyIdentifier = function (objectName, propertyName) {
                        return {
                            objectName: objectName,
                            propertyName: propertyName
                        };
                    };
                    DataViewObjectsParser.parse = function (dataView) {
                        var dataViewObjectParser = this.getDefault(), properties;
                        if (!dataView || !dataView.metadata || !dataView.metadata.objects) {
                            return dataViewObjectParser;
                        }
                        properties = dataViewObjectParser.getProperties();
                        for (var objectName in properties) {
                            for (var propertyName in properties[objectName]) {
                                var defaultValue = dataViewObjectParser[objectName][propertyName];
                                dataViewObjectParser[objectName][propertyName] = dataview.DataViewObjects.getCommonValue(dataView.metadata.objects, properties[objectName][propertyName], defaultValue);
                            }
                        }
                        return dataViewObjectParser;
                    };
                    DataViewObjectsParser.isPropertyEnumerable = function (propertyName) {
                        return !DataViewObjectsParser.InnumerablePropertyPrefix.test(propertyName);
                    };
                    DataViewObjectsParser.enumerateObjectInstances = function (dataViewObjectParser, options) {
                        var dataViewProperties = dataViewObjectParser && dataViewObjectParser[options.objectName];
                        if (!dataViewProperties) {
                            return [];
                        }
                        var instance = {
                            objectName: options.objectName,
                            selector: null,
                            properties: {}
                        };
                        for (var key in dataViewProperties) {
                            if (dataViewProperties.hasOwnProperty(key)) {
                                instance.properties[key] = dataViewProperties[key];
                            }
                        }
                        return {
                            instances: [instance]
                        };
                    };
                    DataViewObjectsParser.prototype.getProperties = function () {
                        var _this = this;
                        var properties = {}, objectNames = Object.keys(this);
                        objectNames.forEach(function (objectName) {
                            if (DataViewObjectsParser.isPropertyEnumerable(objectName)) {
                                var propertyNames = Object.keys(_this[objectName]);
                                properties[objectName] = {};
                                propertyNames.forEach(function (propertyName) {
                                    if (DataViewObjectsParser.isPropertyEnumerable(objectName)) {
                                        properties[objectName][propertyName] =
                                            DataViewObjectsParser.createPropertyIdentifier(objectName, propertyName);
                                    }
                                });
                            }
                        });
                        return properties;
                    };
                    return DataViewObjectsParser;
                }());
                DataViewObjectsParser.InnumerablePropertyPrefix = /^_/;
                dataview.DataViewObjectsParser = DataViewObjectsParser;
            })(dataview = utils.dataview || (utils.dataview = {}));
        })(utils = extensibility.utils || (extensibility.utils = {}));
    })(extensibility = powerbi.extensibility || (powerbi.extensibility = {}));
})(powerbi || (powerbi = {}));

/*!
 * Globalize
 *
 * http://github.com/jquery/globalize
 *
 * Copyright Software Freedom Conservancy, Inc.
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 */

(function( window, undefined ) {

var Globalize,
	// private variables
	regexHex,
	regexInfinity,
	regexParseFloat,
	regexTrim,
	// private JavaScript utility functions
	arrayIndexOf,
	endsWith,
	extend,
	isArray,
	isFunction,
	isObject,
	startsWith,
	trim,
	zeroPad,
	// private Globalization utility functions
	appendPreOrPostMatch,
	expandFormat,
	formatDate,
	formatNumber,
	getTokenRegExp,
	getEra,
	getEraYear,
	parseExact,
	parseNegativePattern;

// Global variable (Globalize) or CommonJS module (globalize)
Globalize = function( cultureSelector ) {
	return new Globalize.prototype.init( cultureSelector );
};

if ( typeof require !== "undefined"
	&& typeof exports !== "undefined"
	&& typeof module !== "undefined" ) {
	// Assume CommonJS
	module.exports = Globalize;
} else {
	// Export as global variable
	window.Globalize = Globalize;
}

Globalize.cultures = {};

Globalize.prototype = {
	constructor: Globalize,
	init: function( cultureSelector ) {
		this.cultures = Globalize.cultures;
		this.cultureSelector = cultureSelector;

		return this;
	}
};
Globalize.prototype.init.prototype = Globalize.prototype;

// 1.	 When defining a culture, all fields are required except the ones stated as optional.
// 2.	 Each culture should have a ".calendars" object with at least one calendar named "standard"
//		 which serves as the default calendar in use by that culture.
// 3.	 Each culture should have a ".calendar" object which is the current calendar being used,
//		 it may be dynamically changed at any time to one of the calendars in ".calendars".
Globalize.cultures[ "default" ] = {
	// A unique name for the culture in the form <language code>-<country/region code>
	name: "en",
	// the name of the culture in the english language
	englishName: "English",
	// the name of the culture in its own language
	nativeName: "English",
	// whether the culture uses right-to-left text
	isRTL: false,
	// "language" is used for so-called "specific" cultures.
	// For example, the culture "es-CL" means "Spanish, in Chili".
	// It represents the Spanish-speaking culture as it is in Chili,
	// which might have different formatting rules or even translations
	// than Spanish in Spain. A "neutral" culture is one that is not
	// specific to a region. For example, the culture "es" is the generic
	// Spanish culture, which may be a more generalized version of the language
	// that may or may not be what a specific culture expects.
	// For a specific culture like "es-CL", the "language" field refers to the
	// neutral, generic culture information for the language it is using.
	// This is not always a simple matter of the string before the dash.
	// For example, the "zh-Hans" culture is netural (Simplified Chinese).
	// And the "zh-SG" culture is Simplified Chinese in Singapore, whose lanugage
	// field is "zh-CHS", not "zh".
	// This field should be used to navigate from a specific culture to it's
	// more general, neutral culture. If a culture is already as general as it
	// can get, the language may refer to itself.
	language: "en",
	// numberFormat defines general number formatting rules, like the digits in
	// each grouping, the group separator, and how negative numbers are displayed.
	numberFormat: {
		// [negativePattern]
		// Note, numberFormat.pattern has no "positivePattern" unlike percent and currency,
		// but is still defined as an array for consistency with them.
		//   negativePattern: one of "(n)|-n|- n|n-|n -"
		pattern: [ "-n" ],
		// number of decimal places normally shown
		decimals: 2,
		// string that separates number groups, as in 1,000,000
		",": ",",
		// string that separates a number from the fractional portion, as in 1.99
		".": ".",
		// array of numbers indicating the size of each number group.
		// TODO: more detailed description and example
		groupSizes: [ 3 ],
		// symbol used for positive numbers
		"+": "+",
		// symbol used for negative numbers
		"-": "-",
		percent: {
			// [negativePattern, positivePattern]
			//   negativePattern: one of "-n %|-n%|-%n|%-n|%n-|n-%|n%-|-% n|n %-|% n-|% -n|n- %"
			//   positivePattern: one of "n %|n%|%n|% n"
			pattern: [ "-n %", "n %" ],
			// number of decimal places normally shown
			decimals: 2,
			// array of numbers indicating the size of each number group.
			// TODO: more detailed description and example
			groupSizes: [ 3 ],
			// string that separates number groups, as in 1,000,000
			",": ",",
			// string that separates a number from the fractional portion, as in 1.99
			".": ".",
			// symbol used to represent a percentage
			symbol: "%"
		},
		currency: {
			// [negativePattern, positivePattern]
			//   negativePattern: one of "($n)|-$n|$-n|$n-|(n$)|-n$|n-$|n$-|-n $|-$ n|n $-|$ n-|$ -n|n- $|($ n)|(n $)"
			//   positivePattern: one of "$n|n$|$ n|n $"
			pattern: [ "($n)", "$n" ],
			// number of decimal places normally shown
			decimals: 2,
			// array of numbers indicating the size of each number group.
			// TODO: more detailed description and example
			groupSizes: [ 3 ],
			// string that separates number groups, as in 1,000,000
			",": ",",
			// string that separates a number from the fractional portion, as in 1.99
			".": ".",
			// symbol used to represent currency
			symbol: "$"
		}
	},
	// calendars defines all the possible calendars used by this culture.
	// There should be at least one defined with name "standard", and is the default
	// calendar used by the culture.
	// A calendar contains information about how dates are formatted, information about
	// the calendar's eras, a standard set of the date formats,
	// translations for day and month names, and if the calendar is not based on the Gregorian
	// calendar, conversion functions to and from the Gregorian calendar.
	calendars: {
		standard: {
			// name that identifies the type of calendar this is
			name: "Gregorian_USEnglish",
			// separator of parts of a date (e.g. "/" in 11/05/1955)
			"/": "/",
			// separator of parts of a time (e.g. ":" in 05:44 PM)
			":": ":",
			// the first day of the week (0 = Sunday, 1 = Monday, etc)
			firstDay: 0,
			days: {
				// full day names
				names: [ "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday" ],
				// abbreviated day names
				namesAbbr: [ "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat" ],
				// shortest day names
				namesShort: [ "Su", "Mo", "Tu", "We", "Th", "Fr", "Sa" ]
			},
			months: {
				// full month names (13 months for lunar calendards -- 13th month should be "" if not lunar)
				names: [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December", "" ],
				// abbreviated month names
				namesAbbr: [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "" ]
			},
			// AM and PM designators in one of these forms:
			// The usual view, and the upper and lower case versions
			//   [ standard, lowercase, uppercase ]
			// The culture does not use AM or PM (likely all standard date formats use 24 hour time)
			//   null
			AM: [ "AM", "am", "AM" ],
			PM: [ "PM", "pm", "PM" ],
			eras: [
				// eras in reverse chronological order.
				// name: the name of the era in this culture (e.g. A.D., C.E.)
				// start: when the era starts in ticks (gregorian, gmt), null if it is the earliest supported era.
				// offset: offset in years from gregorian calendar
				{
					"name": "A.D.",
					"start": null,
					"offset": 0
				}
			],
			// when a two digit year is given, it will never be parsed as a four digit
			// year greater than this year (in the appropriate era for the culture)
			// Set it as a full year (e.g. 2029) or use an offset format starting from
			// the current year: "+19" would correspond to 2029 if the current year 2010.
			twoDigitYearMax: 2029,
			// set of predefined date and time patterns used by the culture
			// these represent the format someone in this culture would expect
			// to see given the portions of the date that are shown.
			patterns: {
				// short date pattern
				d: "M/d/yyyy",
				// long date pattern
				D: "dddd, MMMM dd, yyyy",
				// short time pattern
				t: "h:mm tt",
				// long time pattern
				T: "h:mm:ss tt",
				// long date, short time pattern
				f: "dddd, MMMM dd, yyyy h:mm tt",
				// long date, long time pattern
				F: "dddd, MMMM dd, yyyy h:mm:ss tt",
				// month/day pattern
				M: "MMMM dd",
				// month/year pattern
				Y: "yyyy MMMM",
				// S is a sortable format that does not vary by culture
				S: "yyyy\u0027-\u0027MM\u0027-\u0027dd\u0027T\u0027HH\u0027:\u0027mm\u0027:\u0027ss"
			}
			// optional fields for each calendar:
			/*
			monthsGenitive:
				Same as months but used when the day preceeds the month.
				Omit if the culture has no genitive distinction in month names.
				For an explaination of genitive months, see http://blogs.msdn.com/michkap/archive/2004/12/25/332259.aspx
			convert:
				Allows for the support of non-gregorian based calendars. This convert object is used to
				to convert a date to and from a gregorian calendar date to handle parsing and formatting.
				The two functions:
					fromGregorian( date )
						Given the date as a parameter, return an array with parts [ year, month, day ]
						corresponding to the non-gregorian based year, month, and day for the calendar.
					toGregorian( year, month, day )
						Given the non-gregorian year, month, and day, return a new Date() object
						set to the corresponding date in the gregorian calendar.
			*/
		}
	},
	// For localized strings
	messages: {}
};

Globalize.cultures[ "default" ].calendar = Globalize.cultures[ "default" ].calendars.standard;

Globalize.cultures[ "en" ] = Globalize.cultures[ "default" ];

Globalize.cultureSelector = "en";

//
// private variables
//

regexHex = /^0x[a-f0-9]+$/i;
regexInfinity = /^[+-]?infinity$/i;
regexParseFloat = /^[+-]?\d*\.?\d*(e[+-]?\d+)?$/;
regexTrim = /^\s+|\s+$/g;

//
// private JavaScript utility functions
//

arrayIndexOf = function( array, item ) {
	if ( array.indexOf ) {
		return array.indexOf( item );
	}
	for ( var i = 0, length = array.length; i < length; i++ ) {
		if ( array[i] === item ) {
			return i;
		}
	}
	return -1;
};

endsWith = function( value, pattern ) {
	return value.substr( value.length - pattern.length ) === pattern;
};

extend = function( deep ) {
	var options, name, src, copy, copyIsArray, clone,
		target = arguments[0] || {},
		i = 1,
		length = arguments.length,
		deep = false;

	// Handle a deep copy situation
	if ( typeof target === "boolean" ) {
		deep = target;
		target = arguments[1] || {};
		// skip the boolean and the target
		i = 2;
	}

	// Handle case when target is a string or something (possible in deep copy)
	if ( typeof target !== "object" && !isFunction(target) ) {
		target = {};
	}

	for ( ; i < length; i++ ) {
		// Only deal with non-null/undefined values
		if ( (options = arguments[ i ]) != null ) {
			// Extend the base object
			for ( name in options ) {
				src = target[ name ];
				copy = options[ name ];

				// Prevent never-ending loop
				if ( target === copy ) {
					continue;
				}

				// Recurse if we're merging plain objects or arrays
				if ( deep && copy && ( isObject(copy) || (copyIsArray = isArray(copy)) ) ) {
					if ( copyIsArray ) {
						copyIsArray = false;
						clone = src && isArray(src) ? src : [];

					} else {
						clone = src && isObject(src) ? src : {};
					}

					// Never move original objects, clone them
					target[ name ] = extend( deep, clone, copy );

				// Don't bring in undefined values
				} else if ( copy !== undefined ) {
					target[ name ] = copy;
				}
			}
		}
	}

	// Return the modified object
	return target;
};

isArray = Array.isArray || function( obj ) {
	return Object.prototype.toString.call( obj ) === "[object Array]";
};

isFunction = function( obj ) {
	return Object.prototype.toString.call( obj ) === "[object Function]"
}

isObject = function( obj ) {
	return Object.prototype.toString.call( obj ) === "[object Object]";
};

startsWith = function( value, pattern ) {
	return value.indexOf( pattern ) === 0;
};

trim = function( value ) {
	return ( value + "" ).replace( regexTrim, "" );
};

zeroPad = function( str, count, left ) {
	var l;
	for ( l = str.length; l < count; l += 1 ) {
		str = ( left ? ("0" + str) : (str + "0") );
	}
	return str;
};

//
// private Globalization utility functions
//

appendPreOrPostMatch = function( preMatch, strings ) {
	// appends pre- and post- token match strings while removing escaped characters.
	// Returns a single quote count which is used to determine if the token occurs
	// in a string literal.
	var quoteCount = 0,
		escaped = false;
	for ( var i = 0, il = preMatch.length; i < il; i++ ) {
		var c = preMatch.charAt( i );
		switch ( c ) {
			case "\'":
				if ( escaped ) {
					strings.push( "\'" );
				}
				else {
					quoteCount++;
				}
				escaped = false;
				break;
			case "\\":
				if ( escaped ) {
					strings.push( "\\" );
				}
				escaped = !escaped;
				break;
			default:
				strings.push( c );
				escaped = false;
				break;
		}
	}
	return quoteCount;
};

expandFormat = function( cal, format ) {
	// expands unspecified or single character date formats into the full pattern.
	format = format || "F";
	var pattern,
		patterns = cal.patterns,
		len = format.length;
	if ( len === 1 ) {
		pattern = patterns[ format ];
		if ( !pattern ) {
			throw "Invalid date format string \'" + format + "\'.";
		}
		format = pattern;
	}
	else if ( len === 2 && format.charAt(0) === "%" ) {
		// %X escape format -- intended as a custom format string that is only one character, not a built-in format.
		format = format.charAt( 1 );
	}
	return format;
};

formatDate = function( value, format, culture ) {
	var cal = culture.calendar,
		convert = cal.convert;

	if ( !format || !format.length || format === "i" ) {
		var ret;
		if ( culture && culture.name.length ) {
			if ( convert ) {
				// non-gregorian calendar, so we cannot use built-in toLocaleString()
				ret = formatDate( value, cal.patterns.F, culture );
			}
			else {
				var eraDate = new Date( value.getTime() ),
					era = getEra( value, cal.eras );
				eraDate.setFullYear( getEraYear(value, cal, era) );
				ret = eraDate.toLocaleString();
			}
		}
		else {
			ret = value.toString();
		}
		return ret;
	}

	var eras = cal.eras,
		sortable = format === "s";
	format = expandFormat( cal, format );

	// Start with an empty string
	ret = [];
	var hour,
		zeros = [ "0", "00", "000" ],
		foundDay,
		checkedDay,
		dayPartRegExp = /([^d]|^)(d|dd)([^d]|$)/g,
		quoteCount = 0,
		tokenRegExp = getTokenRegExp(),
		converted;

	function padZeros( num, c ) {
		var r, s = num + "";
		if ( c > 1 && s.length < c ) {
			r = ( zeros[c - 2] + s);
			return r.substr( r.length - c, c );
		}
		else {
			r = s;
		}
		return r;
	}

	function hasDay() {
		if ( foundDay || checkedDay ) {
			return foundDay;
		}
		foundDay = dayPartRegExp.test( format );
		checkedDay = true;
		return foundDay;
	}

	function getPart( date, part ) {
		if ( converted ) {
			return converted[ part ];
		}
		switch ( part ) {
			case 0: return date.getFullYear();
			case 1: return date.getMonth();
			case 2: return date.getDate();
		}
	}

	if ( !sortable && convert ) {
		converted = convert.fromGregorian( value );
	}

	for ( ; ; ) {
		// Save the current index
		var index = tokenRegExp.lastIndex,
			// Look for the next pattern
			ar = tokenRegExp.exec( format );

		// Append the text before the pattern (or the end of the string if not found)
		var preMatch = format.slice( index, ar ? ar.index : format.length );
		quoteCount += appendPreOrPostMatch( preMatch, ret );

		if ( !ar ) {
			break;
		}

		// do not replace any matches that occur inside a string literal.
		if ( quoteCount % 2 ) {
			ret.push( ar[0] );
			continue;
		}

		var current = ar[ 0 ],
			clength = current.length;

		switch ( current ) {
			case "ddd":
				//Day of the week, as a three-letter abbreviation
			case "dddd":
				// Day of the week, using the full name
				var names = ( clength === 3 ) ? cal.days.namesAbbr : cal.days.names;
				ret.push( names[value.getDay()] );
				break;
			case "d":
				// Day of month, without leading zero for single-digit days
			case "dd":
				// Day of month, with leading zero for single-digit days
				foundDay = true;
				ret.push(
					padZeros( getPart(value, 2), clength )
				);
				break;
			case "MMM":
				// Month, as a three-letter abbreviation
			case "MMMM":
				// Month, using the full name
				var part = getPart( value, 1 );
				ret.push(
					( cal.monthsGenitive && hasDay() )
					?
					cal.monthsGenitive[ clength === 3 ? "namesAbbr" : "names" ][ part ]
					:
					cal.months[ clength === 3 ? "namesAbbr" : "names" ][ part ]
				);
				break;
			case "M":
				// Month, as digits, with no leading zero for single-digit months
			case "MM":
				// Month, as digits, with leading zero for single-digit months
				ret.push(
					padZeros( getPart(value, 1) + 1, clength )
				);
				break;
			case "y":
				// Year, as two digits, but with no leading zero for years less than 10
			case "yy":
				// Year, as two digits, with leading zero for years less than 10
			case "yyyy":
				// Year represented by four full digits
				part = converted ? converted[ 0 ] : getEraYear( value, cal, getEra(value, eras), sortable );
				if ( clength < 4 ) {
					part = part % 100;
				}
				ret.push(
					padZeros( part, clength )
				);
				break;
			case "h":
				// Hours with no leading zero for single-digit hours, using 12-hour clock
			case "hh":
				// Hours with leading zero for single-digit hours, using 12-hour clock
				hour = value.getHours() % 12;
				if ( hour === 0 ) hour = 12;
				ret.push(
					padZeros( hour, clength )
				);
				break;
			case "H":
				// Hours with no leading zero for single-digit hours, using 24-hour clock
			case "HH":
				// Hours with leading zero for single-digit hours, using 24-hour clock
				ret.push(
					padZeros( value.getHours(), clength )
				);
				break;
			case "m":
				// Minutes with no leading zero for single-digit minutes
			case "mm":
				// Minutes with leading zero for single-digit minutes
				ret.push(
					padZeros( value.getMinutes(), clength )
				);
				break;
			case "s":
				// Seconds with no leading zero for single-digit seconds
			case "ss":
				// Seconds with leading zero for single-digit seconds
				ret.push(
					padZeros( value.getSeconds(), clength )
				);
				break;
			case "t":
				// One character am/pm indicator ("a" or "p")
			case "tt":
				// Multicharacter am/pm indicator
				part = value.getHours() < 12 ? ( cal.AM ? cal.AM[0] : " " ) : ( cal.PM ? cal.PM[0] : " " );
				ret.push( clength === 1 ? part.charAt(0) : part );
				break;
			case "f":
				// Deciseconds
			case "ff":
				// Centiseconds
			case "fff":
				// Milliseconds
				ret.push(
					padZeros( value.getMilliseconds(), 3 ).substr( 0, clength )
				);
				break;
			case "z":
				// Time zone offset, no leading zero
			case "zz":
				// Time zone offset with leading zero
				hour = value.getTimezoneOffset() / 60;
				ret.push(
					( hour <= 0 ? "+" : "-" ) + padZeros( Math.floor(Math.abs(hour)), clength )
				);
				break;
			case "zzz":
				// Time zone offset with leading zero
				hour = value.getTimezoneOffset() / 60;
				ret.push(
					( hour <= 0 ? "+" : "-" ) + padZeros( Math.floor(Math.abs(hour)), 2 )
					// Hard coded ":" separator, rather than using cal.TimeSeparator
					// Repeated here for consistency, plus ":" was already assumed in date parsing.
					+ ":" + padZeros( Math.abs(value.getTimezoneOffset() % 60), 2 )
				);
				break;
			case "g":
			case "gg":
				if ( cal.eras ) {
					ret.push(
						cal.eras[ getEra(value, eras) ].name
					);
				}
				break;
		case "/":
			ret.push( cal["/"] );
			break;
		default:
			throw "Invalid date format pattern \'" + current + "\'.";
			break;
		}
	}
	return ret.join( "" );
};

// formatNumber
(function() {
	var expandNumber;

	expandNumber = function( number, precision, formatInfo ) {
		var groupSizes = formatInfo.groupSizes,
			curSize = groupSizes[ 0 ],
			curGroupIndex = 1,
			factor = Math.pow( 10, precision ),
			rounded = Math.round( number * factor ) / factor;

		if ( !isFinite(rounded) ) {
			rounded = number;
		}
		number = rounded;

		var numberString = number+"",
			right = "",
			split = numberString.split( /e/i ),
			exponent = split.length > 1 ? parseInt( split[1], 10 ) : 0;
		numberString = split[ 0 ];
		split = numberString.split( "." );
		numberString = split[ 0 ];
		right = split.length > 1 ? split[ 1 ] : "";

		var l;
		if ( exponent > 0 ) {
			right = zeroPad( right, exponent, false );
			numberString += right.slice( 0, exponent );
			right = right.substr( exponent );
		}
		else if ( exponent < 0 ) {
			exponent = -exponent;
			numberString = zeroPad( numberString, exponent + 1 );
			right = numberString.slice( -exponent, numberString.length ) + right;
			numberString = numberString.slice( 0, -exponent );
		}

		if ( precision > 0 ) {
			right = formatInfo[ "." ] +
				( (right.length > precision) ? right.slice(0, precision) : zeroPad(right, precision) );
		}
		else {
			right = "";
		}

		var stringIndex = numberString.length - 1,
			sep = formatInfo[ "," ],
			ret = "";

		while ( stringIndex >= 0 ) {
			if ( curSize === 0 || curSize > stringIndex ) {
				return numberString.slice( 0, stringIndex + 1 ) + ( ret.length ? (sep + ret + right) : right );
			}
			ret = numberString.slice( stringIndex - curSize + 1, stringIndex + 1 ) + ( ret.length ? (sep + ret) : "" );

			stringIndex -= curSize;

			if ( curGroupIndex < groupSizes.length ) {
				curSize = groupSizes[ curGroupIndex ];
				curGroupIndex++;
			}
		}

		return numberString.slice( 0, stringIndex + 1 ) + sep + ret + right;
	};

	formatNumber = function( value, format, culture ) {
		if ( !format || format === "i" ) {
			return culture.name.length ? value.toLocaleString() : value.toString();
		}
		format = format || "D";

		var nf = culture.numberFormat,
			number = Math.abs( value ),
			precision = -1,
			pattern;
		if ( format.length > 1 ) precision = parseInt( format.slice(1), 10 );

		var current = format.charAt( 0 ).toUpperCase(),
			formatInfo;

		switch ( current ) {
			case "D":
				pattern = "n";
				if ( precision !== -1 ) {
					number = zeroPad( "" + number, precision, true );
				}
				if ( value < 0 ) number = -number;
				break;
			case "N":
				formatInfo = nf;
				// fall through
			case "C":
				formatInfo = formatInfo || nf.currency;
				// fall through
			case "P":
				formatInfo = formatInfo || nf.percent;
				pattern = value < 0 ? formatInfo.pattern[ 0 ] : ( formatInfo.pattern[1] || "n" );
				if ( precision === -1 ) precision = formatInfo.decimals;
				number = expandNumber( number * (current === "P" ? 100 : 1), precision, formatInfo );
				break;
			default:
				throw "Bad number format specifier: " + current;
		}

		var patternParts = /n|\$|-|%/g,
			ret = "";
		for ( ; ; ) {
			var index = patternParts.lastIndex,
				ar = patternParts.exec( pattern );

			ret += pattern.slice( index, ar ? ar.index : pattern.length );

			if ( !ar ) {
				break;
			}

			switch ( ar[0] ) {
				case "n":
					ret += number;
					break;
				case "$":
					ret += nf.currency.symbol;
					break;
				case "-":
					// don't make 0 negative
					if ( /[1-9]/.test(number) ) {
						ret += nf[ "-" ];
					}
					break;
				case "%":
					ret += nf.percent.symbol;
					break;
			}
		}

		return ret;
	};

}());

getTokenRegExp = function() {
	// regular expression for matching date and time tokens in format strings.
	return /\/|dddd|ddd|dd|d|MMMM|MMM|MM|M|yyyy|yy|y|hh|h|HH|H|mm|m|ss|s|tt|t|fff|ff|f|zzz|zz|z|gg|g/g;
};

getEra = function( date, eras ) {
	if ( !eras ) return 0;
	var start, ticks = date.getTime();
	for ( var i = 0, l = eras.length; i < l; i++ ) {
		start = eras[ i ].start;
		if ( start === null || ticks >= start ) {
			return i;
		}
	}
	return 0;
};

getEraYear = function( date, cal, era, sortable ) {
	var year = date.getFullYear();
	if ( !sortable && cal.eras ) {
		// convert normal gregorian year to era-shifted gregorian
		// year by subtracting the era offset
		year -= cal.eras[ era ].offset;
	}
	return year;
};

// parseExact
(function() {
	var expandYear,
		getDayIndex,
		getMonthIndex,
		getParseRegExp,
		outOfRange,
		toUpper,
		toUpperArray;

	expandYear = function( cal, year ) {
		// expands 2-digit year into 4 digits.
		var now = new Date(),
			era = getEra( now );
		if ( year < 100 ) {
			var twoDigitYearMax = cal.twoDigitYearMax;
			twoDigitYearMax = typeof twoDigitYearMax === "string" ? new Date().getFullYear() % 100 + parseInt( twoDigitYearMax, 10 ) : twoDigitYearMax;
			var curr = getEraYear( now, cal, era );
			year += curr - ( curr % 100 );
			if ( year > twoDigitYearMax ) {
				year -= 100;
			}
		}
		return year;
	};

	getDayIndex = function	( cal, value, abbr ) {
		var ret,
			days = cal.days,
			upperDays = cal._upperDays;
		if ( !upperDays ) {
			cal._upperDays = upperDays = [
				toUpperArray( days.names ),
				toUpperArray( days.namesAbbr ),
				toUpperArray( days.namesShort )
			];
		}
		value = toUpper( value );
		if ( abbr ) {
			ret = arrayIndexOf( upperDays[1], value );
			if ( ret === -1 ) {
				ret = arrayIndexOf( upperDays[2], value );
			}
		}
		else {
			ret = arrayIndexOf( upperDays[0], value );
		}
		return ret;
	};

	getMonthIndex = function( cal, value, abbr ) {
		var months = cal.months,
			monthsGen = cal.monthsGenitive || cal.months,
			upperMonths = cal._upperMonths,
			upperMonthsGen = cal._upperMonthsGen;
		if ( !upperMonths ) {
			cal._upperMonths = upperMonths = [
				toUpperArray( months.names ),
				toUpperArray( months.namesAbbr )
			];
			cal._upperMonthsGen = upperMonthsGen = [
				toUpperArray( monthsGen.names ),
				toUpperArray( monthsGen.namesAbbr )
			];
		}
		value = toUpper( value );
		var i = arrayIndexOf( abbr ? upperMonths[1] : upperMonths[0], value );
		if ( i < 0 ) {
			i = arrayIndexOf( abbr ? upperMonthsGen[1] : upperMonthsGen[0], value );
		}
		return i;
	};

	getParseRegExp = function( cal, format ) {
		// converts a format string into a regular expression with groups that
		// can be used to extract date fields from a date string.
		// check for a cached parse regex.
		var re = cal._parseRegExp;
		if ( !re ) {
			cal._parseRegExp = re = {};
		}
		else {
			var reFormat = re[ format ];
			if ( reFormat ) {
				return reFormat;
			}
		}

		// expand single digit formats, then escape regular expression characters.
		var expFormat = expandFormat( cal, format ).replace( /([\^\$\.\*\+\?\|\[\]\(\)\{\}])/g, "\\\\$1" ),
			regexp = [ "^" ],
			groups = [],
			index = 0,
			quoteCount = 0,
			tokenRegExp = getTokenRegExp(),
			match;

		// iterate through each date token found.
		while ( (match = tokenRegExp.exec(expFormat)) !== null ) {
			var preMatch = expFormat.slice( index, match.index );
			index = tokenRegExp.lastIndex;

			// don't replace any matches that occur inside a string literal.
			quoteCount += appendPreOrPostMatch( preMatch, regexp );
			if ( quoteCount % 2 ) {
				regexp.push( match[0] );
				continue;
			}

			// add a regex group for the token.
			var m = match[ 0 ],
				len = m.length,
				add;
			switch ( m ) {
				case "dddd": case "ddd":
				case "MMMM": case "MMM":
				case "gg": case "g":
					add = "(\\D+)";
					break;
				case "tt": case "t":
					add = "(\\D*)";
					break;
				case "yyyy":
				case "fff":
				case "ff":
				case "f":
					add = "(\\d{" + len + "})";
					break;
				case "dd": case "d":
				case "MM": case "M":
				case "yy": case "y":
				case "HH": case "H":
				case "hh": case "h":
				case "mm": case "m":
				case "ss": case "s":
					add = "(\\d\\d?)";
					break;
				case "zzz":
					add = "([+-]?\\d\\d?:\\d{2})";
					break;
				case "zz": case "z":
					add = "([+-]?\\d\\d?)";
					break;
				case "/":
					add = "(\\" + cal[ "/" ] + ")";
					break;
				default:
					throw "Invalid date format pattern \'" + m + "\'.";
					break;
			}
			if ( add ) {
				regexp.push( add );
			}
			groups.push( match[0] );
		}
		appendPreOrPostMatch( expFormat.slice(index), regexp );
		regexp.push( "$" );

		// allow whitespace to differ when matching formats.
		var regexpStr = regexp.join( "" ).replace( /\s+/g, "\\s+" ),
			parseRegExp = { "regExp": regexpStr, "groups": groups };

		// cache the regex for this format.
		return re[ format ] = parseRegExp;
	};

	outOfRange = function( value, low, high ) {
		return value < low || value > high;
	};

	toUpper = function( value ) {
		// "he-IL" has non-breaking space in weekday names.
		return value.split( "\u00A0" ).join( " " ).toUpperCase();
	};

	toUpperArray = function( arr ) {
		var results = [];
		for ( var i = 0, l = arr.length; i < l; i++ ) {
			results[ i ] = toUpper( arr[i] );
		}
		return results;
	};

	parseExact = function( value, format, culture ) {
		// try to parse the date string by matching against the format string
		// while using the specified culture for date field names.
		value = trim( value );
		var cal = culture.calendar,
			// convert date formats into regular expressions with groupings.
			// use the regexp to determine the input format and extract the date fields.
			parseInfo = getParseRegExp( cal, format ),
			match = new RegExp( parseInfo.regExp ).exec( value );
		if ( match === null ) {
			return null;
		}
		// found a date format that matches the input.
		var groups = parseInfo.groups,
			era = null, year = null, month = null, date = null, weekDay = null,
			hour = 0, hourOffset, min = 0, sec = 0, msec = 0, tzMinOffset = null,
			pmHour = false;
		// iterate the format groups to extract and set the date fields.
		for ( var j = 0, jl = groups.length; j < jl; j++ ) {
			var matchGroup = match[ j + 1 ];
			if ( matchGroup ) {
				var current = groups[ j ],
					clength = current.length,
					matchInt = parseInt( matchGroup, 10 );
				switch ( current ) {
					case "dd": case "d":
						// Day of month.
						date = matchInt;
						// check that date is generally in valid range, also checking overflow below.
						if ( outOfRange(date, 1, 31) ) return null;
						break;
					case "MMM": case "MMMM":
						month = getMonthIndex( cal, matchGroup, clength === 3 );
						if ( outOfRange(month, 0, 11) ) return null;
						break;
					case "M": case "MM":
						// Month.
						month = matchInt - 1;
						if ( outOfRange(month, 0, 11) ) return null;
						break;
					case "y": case "yy":
					case "yyyy":
						year = clength < 4 ? expandYear( cal, matchInt ) : matchInt;
						if ( outOfRange(year, 0, 9999) ) return null;
						break;
					case "h": case "hh":
						// Hours (12-hour clock).
						hour = matchInt;
						if ( hour === 12 ) hour = 0;
						if ( outOfRange(hour, 0, 11) ) return null;
						break;
					case "H": case "HH":
						// Hours (24-hour clock).
						hour = matchInt;
						if ( outOfRange(hour, 0, 23) ) return null;
						break;
					case "m": case "mm":
						// Minutes.
						min = matchInt;
						if ( outOfRange(min, 0, 59) ) return null;
						break;
					case "s": case "ss":
						// Seconds.
						sec = matchInt;
						if ( outOfRange(sec, 0, 59) ) return null;
						break;
					case "tt": case "t":
						// AM/PM designator.
						// see if it is standard, upper, or lower case PM. If not, ensure it is at least one of
						// the AM tokens. If not, fail the parse for this format.
						pmHour = cal.PM && ( matchGroup === cal.PM[0] || matchGroup === cal.PM[1] || matchGroup === cal.PM[2] );
						if (
							!pmHour && (
								!cal.AM || ( matchGroup !== cal.AM[0] && matchGroup !== cal.AM[1] && matchGroup !== cal.AM[2] )
							)
						) return null;
						break;
					case "f":
						// Deciseconds.
					case "ff":
						// Centiseconds.
					case "fff":
						// Milliseconds.
						msec = matchInt * Math.pow( 10, 3 - clength );
						if ( outOfRange(msec, 0, 999) ) return null;
						break;
					case "ddd":
						// Day of week.
					case "dddd":
						// Day of week.
						weekDay = getDayIndex( cal, matchGroup, clength === 3 );
						if ( outOfRange(weekDay, 0, 6) ) return null;
						break;
					case "zzz":
						// Time zone offset in +/- hours:min.
						var offsets = matchGroup.split( /:/ );
						if ( offsets.length !== 2 ) return null;
						hourOffset = parseInt( offsets[0], 10 );
						if ( outOfRange(hourOffset, -12, 13) ) return null;
						var minOffset = parseInt( offsets[1], 10 );
						if ( outOfRange(minOffset, 0, 59) ) return null;
						tzMinOffset = ( hourOffset * 60 ) + ( startsWith(matchGroup, "-") ? -minOffset : minOffset );
						break;
					case "z": case "zz":
						// Time zone offset in +/- hours.
						hourOffset = matchInt;
						if ( outOfRange(hourOffset, -12, 13) ) return null;
						tzMinOffset = hourOffset * 60;
						break;
					case "g": case "gg":
						var eraName = matchGroup;
						if ( !eraName || !cal.eras ) return null;
						eraName = trim( eraName.toLowerCase() );
						for ( var i = 0, l = cal.eras.length; i < l; i++ ) {
							if ( eraName === cal.eras[i].name.toLowerCase() ) {
								era = i;
								break;
							}
						}
						// could not find an era with that name
						if ( era === null ) return null;
						break;
				}
			}
		}
		var result = new Date(), defaultYear, convert = cal.convert;
		defaultYear = convert ? convert.fromGregorian( result )[ 0 ] : result.getFullYear();
		if ( year === null ) {
			year = defaultYear;
		}
		else if ( cal.eras ) {
			// year must be shifted to normal gregorian year
			// but not if year was not specified, its already normal gregorian
			// per the main if clause above.
			year += cal.eras[( era || 0 )].offset;
		}
		// set default day and month to 1 and January, so if unspecified, these are the defaults
		// instead of the current day/month.
		if ( month === null ) {
			month = 0;
		}
		if ( date === null ) {
			date = 1;
		}
		// now have year, month, and date, but in the culture's calendar.
		// convert to gregorian if necessary
		if ( convert ) {
			result = convert.toGregorian( year, month, date );
			// conversion failed, must be an invalid match
			if ( result === null ) return null;
		}
		else {
			// have to set year, month and date together to avoid overflow based on current date.
			result.setFullYear( year, month, date );
			// check to see if date overflowed for specified month (only checked 1-31 above).
			if ( result.getDate() !== date ) return null;
			// invalid day of week.
			if ( weekDay !== null && result.getDay() !== weekDay ) {
				return null;
			}
		}
		// if pm designator token was found make sure the hours fit the 24-hour clock.
		if ( pmHour && hour < 12 ) {
			hour += 12;
		}
		result.setHours( hour, min, sec, msec );
		if ( tzMinOffset !== null ) {
			// adjust timezone to utc before applying local offset.
			var adjustedMin = result.getMinutes() - ( tzMinOffset + result.getTimezoneOffset() );
			// Safari limits hours and minutes to the range of -127 to 127.	 We need to use setHours
			// to ensure both these fields will not exceed this range.	adjustedMin will range
			// somewhere between -1440 and 1500, so we only need to split this into hours.
			result.setHours( result.getHours() + parseInt(adjustedMin / 60, 10), adjustedMin % 60 );
		}
		return result;
	};
}());

parseNegativePattern = function( value, nf, negativePattern ) {
	var neg = nf[ "-" ],
		pos = nf[ "+" ],
		ret;
	switch ( negativePattern ) {
		case "n -":
			neg = " " + neg;
			pos = " " + pos;
			// fall through
		case "n-":
			if ( endsWith(value, neg) ) {
				ret = [ "-", value.substr(0, value.length - neg.length) ];
			}
			else if ( endsWith(value, pos) ) {
				ret = [ "+", value.substr(0, value.length - pos.length) ];
			}
			break;
		case "- n":
			neg += " ";
			pos += " ";
			// fall through
		case "-n":
			if ( startsWith(value, neg) ) {
				ret = [ "-", value.substr(neg.length) ];
			}
			else if ( startsWith(value, pos) ) {
				ret = [ "+", value.substr(pos.length) ];
			}
			break;
		case "(n)":
			if ( startsWith(value, "(") && endsWith(value, ")") ) {
				ret = [ "-", value.substr(1, value.length - 2) ];
			}
			break;
	}
	return ret || [ "", value ];
};

//
// public instance functions
//

Globalize.prototype.findClosestCulture = function( cultureSelector ) {
	return Globalize.findClosestCulture.call( this, cultureSelector );
};

Globalize.prototype.format = function( value, format, cultureSelector ) {
	return Globalize.format.call( this, value, format, cultureSelector );
};

Globalize.prototype.localize = function( key, cultureSelector ) {
	return Globalize.localize.call( this, key, cultureSelector );
};

Globalize.prototype.parseInt = function( value, radix, cultureSelector ) {
	return Globalize.parseInt.call( this, value, radix, cultureSelector );
};

Globalize.prototype.parseFloat = function( value, radix, cultureSelector ) {
	return Globalize.parseFloat.call( this, value, radix, cultureSelector );
};

Globalize.prototype.culture = function( cultureSelector ) {
	return Globalize.culture.call( this, cultureSelector );
};

//
// public singleton functions
//

Globalize.addCultureInfo = function( cultureName, baseCultureName, info ) {

	var base = {},
		isNew = false;

	if ( typeof cultureName !== "string" ) {
		// cultureName argument is optional string. If not specified, assume info is first
		// and only argument. Specified info deep-extends current culture.
		info = cultureName;
		cultureName = this.culture().name;
		base = this.cultures[ cultureName ];
	} else if ( typeof baseCultureName !== "string" ) {
		// baseCultureName argument is optional string. If not specified, assume info is second
		// argument. Specified info deep-extends specified culture.
		// If specified culture does not exist, create by deep-extending default
		info = baseCultureName;
		isNew = ( this.cultures[ cultureName ] == null );
		base = this.cultures[ cultureName ] || this.cultures[ "default" ];
	} else {
		// cultureName and baseCultureName specified. Assume a new culture is being created
		// by deep-extending an specified base culture
		isNew = true;
		base = this.cultures[ baseCultureName ];
	}

	this.cultures[ cultureName ] = extend(true, {},
		base,
		info
	);
	// Make the standard calendar the current culture if it's a new culture
	if ( isNew ) {
		this.cultures[ cultureName ].calendar = this.cultures[ cultureName ].calendars.standard;
	}
};

Globalize.findClosestCulture = function( name ) {
	var match;
	if ( !name ) {
		return this.cultures[ this.cultureSelector ] || this.cultures[ "default" ];
	}
	if ( typeof name === "string" ) {
		name = name.split( "," );
	}
	if ( isArray(name) ) {
		var lang,
			cultures = this.cultures,
			list = name,
			i, l = list.length,
			prioritized = [];
		for ( i = 0; i < l; i++ ) {
			name = trim( list[i] );
			var pri, parts = name.split( ";" );
			lang = trim( parts[0] );
			if ( parts.length === 1 ) {
				pri = 1;
			}
			else {
				name = trim( parts[1] );
				if ( name.indexOf("q=") === 0 ) {
					name = name.substr( 2 );
					pri = parseFloat( name );
					pri = isNaN( pri ) ? 0 : pri;
				}
				else {
					pri = 1;
				}
			}
			prioritized.push({ lang: lang, pri: pri });
		}
		prioritized.sort(function( a, b ) {
			return a.pri < b.pri ? 1 : -1;
		});

		// exact match
		for ( i = 0; i < l; i++ ) {
			lang = prioritized[ i ].lang;
			match = cultures[ lang ];
			if ( match ) {
				return match;
			}
		}

		// neutral language match
		for ( i = 0; i < l; i++ ) {
			lang = prioritized[ i ].lang;
			do {
				var index = lang.lastIndexOf( "-" );
				if ( index === -1 ) {
					break;
				}
				// strip off the last part. e.g. en-US => en
				lang = lang.substr( 0, index );
				match = cultures[ lang ];
				if ( match ) {
					return match;
				}
			}
			while ( 1 );
		}

		// last resort: match first culture using that language
		for ( i = 0; i < l; i++ ) {
			lang = prioritized[ i ].lang;
			for ( var cultureKey in cultures ) {
				var culture = cultures[ cultureKey ];
				if ( culture.language == lang ) {
					return culture;
				}
			}
		}
	}
	else if ( typeof name === "object" ) {
		return name;
	}
	return match || null;
};

Globalize.format = function( value, format, cultureSelector ) {
	culture = this.findClosestCulture( cultureSelector );
	if ( value instanceof Date ) {
		value = formatDate( value, format, culture );
	}
	else if ( typeof value === "number" ) {
		value = formatNumber( value, format, culture );
	}
	return value;
};

Globalize.localize = function( key, cultureSelector ) {
	return (
		this.findClosestCulture( cultureSelector ).messages[ key ]
		||
		this.cultures[ "default" ].messages[ "key" ]
	);
};

Globalize.parseDate = function( value, formats, culture ) {
	culture = this.findClosestCulture( culture );

	var date, prop, patterns;
	if ( formats ) {
		if ( typeof formats === "string" ) {
			formats = [ formats ];
		}
		if ( formats.length ) {
			for ( var i = 0, l = formats.length; i < l; i++ ) {
				var format = formats[ i ];
				if ( format ) {
					date = parseExact( value, format, culture );
					if ( date ) {
						break;
					}
				}
			}
		}
	} else {
		patterns = culture.calendar.patterns;
		for ( prop in patterns ) {
			date = parseExact( value, patterns[prop], culture );
			if ( date ) {
				break;
			}
		}
	}

	return date || null;
};

Globalize.parseInt = function( value, radix, cultureSelector ) {
	return Math.floor( Globalize.parseFloat(value, radix, cultureSelector) );
};

Globalize.parseFloat = function( value, radix, cultureSelector ) {
	// radix argument is optional
	if ( typeof radix !== "number" ) {
		cultureSelector = radix;
		radix = 10;
	}

	var culture = this.findClosestCulture( cultureSelector );
	var ret = NaN,
		nf = culture.numberFormat;

	if ( value.indexOf(culture.numberFormat.currency.symbol) > -1 ) {
		// remove currency symbol
		value = value.replace( culture.numberFormat.currency.symbol, "" );
		// replace decimal seperator
		value = value.replace( culture.numberFormat.currency["."], culture.numberFormat["."] );
	}

	// trim leading and trailing whitespace
	value = trim( value );

	// allow infinity or hexidecimal
	if ( regexInfinity.test(value) ) {
		ret = parseFloat( value );
	}
	else if ( !radix && regexHex.test(value) ) {
		ret = parseInt( value, 16 );
	}
	else {
		var signInfo = parseNegativePattern( value, nf, nf.pattern[0] ),
			sign = signInfo[ 0 ],
			num = signInfo[ 1 ];
		// determine sign and number
		if ( sign === "" && nf.pattern[0] !== "-n" ) {
			signInfo = parseNegativePattern( value, nf, "-n" );
			sign = signInfo[ 0 ];
			num = signInfo[ 1 ];
		}
		sign = sign || "+";
		// determine exponent and number
		var exponent,
			intAndFraction,
			exponentPos = num.indexOf( "e" );
		if ( exponentPos < 0 ) exponentPos = num.indexOf( "E" );
		if ( exponentPos < 0 ) {
			intAndFraction = num;
			exponent = null;
		}
		else {
			intAndFraction = num.substr( 0, exponentPos );
			exponent = num.substr( exponentPos + 1 );
		}
		// determine decimal position
		var integer,
			fraction,
			decSep = nf[ "." ],
			decimalPos = intAndFraction.indexOf( decSep );
		if ( decimalPos < 0 ) {
			integer = intAndFraction;
			fraction = null;
		}
		else {
			integer = intAndFraction.substr( 0, decimalPos );
			fraction = intAndFraction.substr( decimalPos + decSep.length );
		}
		// handle groups (e.g. 1,000,000)
		var groupSep = nf[ "," ];
		integer = integer.split( groupSep ).join( "" );
		var altGroupSep = groupSep.replace( /\u00A0/g, " " );
		if ( groupSep !== altGroupSep ) {
			integer = integer.split( altGroupSep ).join( "" );
		}
		// build a natively parsable number string
		var p = sign + integer;
		if ( fraction !== null ) {
			p += "." + fraction;
		}
		if ( exponent !== null ) {
			// exponent itself may have a number patternd
			var expSignInfo = parseNegativePattern( exponent, nf, "-n" );
			p += "e" + ( expSignInfo[0] || "+" ) + expSignInfo[ 1 ];
		}
		if ( regexParseFloat.test(p) ) {
			ret = parseFloat( p );
		}
	}
	return ret;
};

Globalize.culture = function( cultureSelector ) {
	// setter
	if ( typeof cultureSelector !== "undefined" ) {
		this.cultureSelector = cultureSelector;
	}
	// getter
	return this.findClosestCulture( cultureSelector ) || this.culture[ "default" ];
};

}( this ));

/*
 * Globalize Culture en-US
 *
 * http://github.com/jquery/globalize
 *
 * Copyright Software Freedom Conservancy, Inc.
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * This file was generated by the Globalize Culture Generator
 * Translation: bugs found in this file need to be fixed in the generator
 */

(function( window, undefined ) {

var Globalize;

if ( typeof require !== "undefined"
	&& typeof exports !== "undefined"
	&& typeof module !== "undefined" ) {
	// Assume CommonJS
	Globalize = require( "globalize" );
} else {
	// Global variable
	Globalize = window.Globalize;
}

Globalize.addCultureInfo( "en-US", "default", {
	englishName: "English (United States)"
});

}( this ));

/*
 *  Power BI Visualizations
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */
var powerbi;
(function (powerbi) {
    var extensibility;
    (function (extensibility) {
        var utils;
        (function (utils) {
            var type;
            (function (type) {
                /**
                 * Module Double contains a set of constants and precision based utility methods
                 * for dealing with doubles and their decimal garbage in the javascript.
                 */
                var Double;
                (function (Double) {
                    // Constants.
                    Double.MIN_VALUE = -Number.MAX_VALUE;
                    Double.MAX_VALUE = Number.MAX_VALUE;
                    Double.MIN_EXP = -308;
                    Double.MAX_EXP = 308;
                    Double.EPSILON = 1E-323;
                    Double.DEFAULT_PRECISION = 0.0001;
                    Double.DEFAULT_PRECISION_IN_DECIMAL_DIGITS = 12;
                    Double.LOG_E_10 = Math.log(10);
                    Double.POSITIVE_POWERS = [
                        1E0, 1E1, 1E2, 1E3, 1E4, 1E5, 1E6, 1E7, 1E8, 1E9, 1E10, 1E11, 1E12, 1E13, 1E14, 1E15, 1E16, 1E17, 1E18, 1E19, 1E20, 1E21, 1E22, 1E23, 1E24, 1E25, 1E26, 1E27, 1E28, 1E29, 1E30, 1E31, 1E32, 1E33, 1E34, 1E35, 1E36, 1E37, 1E38, 1E39, 1E40, 1E41, 1E42, 1E43, 1E44, 1E45, 1E46, 1E47, 1E48, 1E49, 1E50, 1E51, 1E52, 1E53, 1E54, 1E55, 1E56, 1E57, 1E58, 1E59, 1E60, 1E61, 1E62, 1E63, 1E64, 1E65, 1E66, 1E67, 1E68, 1E69, 1E70, 1E71, 1E72, 1E73, 1E74, 1E75, 1E76, 1E77, 1E78, 1E79, 1E80, 1E81, 1E82, 1E83, 1E84, 1E85, 1E86, 1E87, 1E88, 1E89, 1E90, 1E91, 1E92, 1E93, 1E94, 1E95, 1E96, 1E97, 1E98, 1E99,
                        1E100, 1E101, 1E102, 1E103, 1E104, 1E105, 1E106, 1E107, 1E108, 1E109, 1E110, 1E111, 1E112, 1E113, 1E114, 1E115, 1E116, 1E117, 1E118, 1E119, 1E120, 1E121, 1E122, 1E123, 1E124, 1E125, 1E126, 1E127, 1E128, 1E129, 1E130, 1E131, 1E132, 1E133, 1E134, 1E135, 1E136, 1E137, 1E138, 1E139, 1E140, 1E141, 1E142, 1E143, 1E144, 1E145, 1E146, 1E147, 1E148, 1E149, 1E150, 1E151, 1E152, 1E153, 1E154, 1E155, 1E156, 1E157, 1E158, 1E159, 1E160, 1E161, 1E162, 1E163, 1E164, 1E165, 1E166, 1E167, 1E168, 1E169, 1E170, 1E171, 1E172, 1E173, 1E174, 1E175, 1E176, 1E177, 1E178, 1E179, 1E180, 1E181, 1E182, 1E183, 1E184, 1E185, 1E186, 1E187, 1E188, 1E189, 1E190, 1E191, 1E192, 1E193, 1E194, 1E195, 1E196, 1E197, 1E198, 1E199,
                        1E200, 1E201, 1E202, 1E203, 1E204, 1E205, 1E206, 1E207, 1E208, 1E209, 1E210, 1E211, 1E212, 1E213, 1E214, 1E215, 1E216, 1E217, 1E218, 1E219, 1E220, 1E221, 1E222, 1E223, 1E224, 1E225, 1E226, 1E227, 1E228, 1E229, 1E230, 1E231, 1E232, 1E233, 1E234, 1E235, 1E236, 1E237, 1E238, 1E239, 1E240, 1E241, 1E242, 1E243, 1E244, 1E245, 1E246, 1E247, 1E248, 1E249, 1E250, 1E251, 1E252, 1E253, 1E254, 1E255, 1E256, 1E257, 1E258, 1E259, 1E260, 1E261, 1E262, 1E263, 1E264, 1E265, 1E266, 1E267, 1E268, 1E269, 1E270, 1E271, 1E272, 1E273, 1E274, 1E275, 1E276, 1E277, 1E278, 1E279, 1E280, 1E281, 1E282, 1E283, 1E284, 1E285, 1E286, 1E287, 1E288, 1E289, 1E290, 1E291, 1E292, 1E293, 1E294, 1E295, 1E296, 1E297, 1E298, 1E299,
                        1E300, 1E301, 1E302, 1E303, 1E304, 1E305, 1E306, 1E307, 1E308
                    ];
                    Double.NEGATIVE_POWERS = [
                        1E0, 1E-1, 1E-2, 1E-3, 1E-4, 1E-5, 1E-6, 1E-7, 1E-8, 1E-9, 1E-10, 1E-11, 1E-12, 1E-13, 1E-14, 1E-15, 1E-16, 1E-17, 1E-18, 1E-19, 1E-20, 1E-21, 1E-22, 1E-23, 1E-24, 1E-25, 1E-26, 1E-27, 1E-28, 1E-29, 1E-30, 1E-31, 1E-32, 1E-33, 1E-34, 1E-35, 1E-36, 1E-37, 1E-38, 1E-39, 1E-40, 1E-41, 1E-42, 1E-43, 1E-44, 1E-45, 1E-46, 1E-47, 1E-48, 1E-49, 1E-50, 1E-51, 1E-52, 1E-53, 1E-54, 1E-55, 1E-56, 1E-57, 1E-58, 1E-59, 1E-60, 1E-61, 1E-62, 1E-63, 1E-64, 1E-65, 1E-66, 1E-67, 1E-68, 1E-69, 1E-70, 1E-71, 1E-72, 1E-73, 1E-74, 1E-75, 1E-76, 1E-77, 1E-78, 1E-79, 1E-80, 1E-81, 1E-82, 1E-83, 1E-84, 1E-85, 1E-86, 1E-87, 1E-88, 1E-89, 1E-90, 1E-91, 1E-92, 1E-93, 1E-94, 1E-95, 1E-96, 1E-97, 1E-98, 1E-99,
                        1E-100, 1E-101, 1E-102, 1E-103, 1E-104, 1E-105, 1E-106, 1E-107, 1E-108, 1E-109, 1E-110, 1E-111, 1E-112, 1E-113, 1E-114, 1E-115, 1E-116, 1E-117, 1E-118, 1E-119, 1E-120, 1E-121, 1E-122, 1E-123, 1E-124, 1E-125, 1E-126, 1E-127, 1E-128, 1E-129, 1E-130, 1E-131, 1E-132, 1E-133, 1E-134, 1E-135, 1E-136, 1E-137, 1E-138, 1E-139, 1E-140, 1E-141, 1E-142, 1E-143, 1E-144, 1E-145, 1E-146, 1E-147, 1E-148, 1E-149, 1E-150, 1E-151, 1E-152, 1E-153, 1E-154, 1E-155, 1E-156, 1E-157, 1E-158, 1E-159, 1E-160, 1E-161, 1E-162, 1E-163, 1E-164, 1E-165, 1E-166, 1E-167, 1E-168, 1E-169, 1E-170, 1E-171, 1E-172, 1E-173, 1E-174, 1E-175, 1E-176, 1E-177, 1E-178, 1E-179, 1E-180, 1E-181, 1E-182, 1E-183, 1E-184, 1E-185, 1E-186, 1E-187, 1E-188, 1E-189, 1E-190, 1E-191, 1E-192, 1E-193, 1E-194, 1E-195, 1E-196, 1E-197, 1E-198, 1E-199,
                        1E-200, 1E-201, 1E-202, 1E-203, 1E-204, 1E-205, 1E-206, 1E-207, 1E-208, 1E-209, 1E-210, 1E-211, 1E-212, 1E-213, 1E-214, 1E-215, 1E-216, 1E-217, 1E-218, 1E-219, 1E-220, 1E-221, 1E-222, 1E-223, 1E-224, 1E-225, 1E-226, 1E-227, 1E-228, 1E-229, 1E-230, 1E-231, 1E-232, 1E-233, 1E-234, 1E-235, 1E-236, 1E-237, 1E-238, 1E-239, 1E-240, 1E-241, 1E-242, 1E-243, 1E-244, 1E-245, 1E-246, 1E-247, 1E-248, 1E-249, 1E-250, 1E-251, 1E-252, 1E-253, 1E-254, 1E-255, 1E-256, 1E-257, 1E-258, 1E-259, 1E-260, 1E-261, 1E-262, 1E-263, 1E-264, 1E-265, 1E-266, 1E-267, 1E-268, 1E-269, 1E-270, 1E-271, 1E-272, 1E-273, 1E-274, 1E-275, 1E-276, 1E-277, 1E-278, 1E-279, 1E-280, 1E-281, 1E-282, 1E-283, 1E-284, 1E-285, 1E-286, 1E-287, 1E-288, 1E-289, 1E-290, 1E-291, 1E-292, 1E-293, 1E-294, 1E-295, 1E-296, 1E-297, 1E-298, 1E-299,
                        1E-300, 1E-301, 1E-302, 1E-303, 1E-304, 1E-305, 1E-306, 1E-307, 1E-308, 1E-309, 1E-310, 1E-311, 1E-312, 1E-313, 1E-314, 1E-315, 1E-316, 1E-317, 1E-318, 1E-319, 1E-320, 1E-321, 1E-322, 1E-323, 1E-324
                    ];
                    /**
                     * Returns powers of 10.
                     * Unlike the Math.pow this function produces no decimal garbage.
                     * @param exp Exponent.
                     */
                    function pow10(exp) {
                        // Positive & zero
                        if (exp >= 0) {
                            if (exp < Double.POSITIVE_POWERS.length) {
                                return Double.POSITIVE_POWERS[exp];
                            }
                            else {
                                return Infinity;
                            }
                        }
                        // Negative
                        exp = -exp;
                        if (exp > 0 && exp < Double.NEGATIVE_POWERS.length) {
                            return Double.NEGATIVE_POWERS[exp];
                        }
                        else {
                            return 0;
                        }
                    }
                    Double.pow10 = pow10;
                    /**
                     * Returns the 10 base logarithm of the number.
                     * Unlike Math.log function this produces integer results with no decimal garbage.
                     * @param val Positive value or zero.
                     */
                    function log10(val) {
                        // Fast Log10() algorithm
                        if (val > 1 && val < 1E16) {
                            if (val < 1E8) {
                                if (val < 1E4) {
                                    if (val < 1E2) {
                                        if (val < 1E1) {
                                            return 0;
                                        }
                                        else {
                                            return 1;
                                        }
                                    }
                                    else {
                                        if (val < 1E3) {
                                            return 2;
                                        }
                                        else {
                                            return 3;
                                        }
                                    }
                                }
                                else {
                                    if (val < 1E6) {
                                        if (val < 1E5) {
                                            return 4;
                                        }
                                        else {
                                            return 5;
                                        }
                                    }
                                    else {
                                        if (val < 1E7) {
                                            return 6;
                                        }
                                        else {
                                            return 7;
                                        }
                                    }
                                }
                            }
                            else {
                                if (val < 1E12) {
                                    if (val < 1E10) {
                                        if (val < 1E9) {
                                            return 8;
                                        }
                                        else {
                                            return 9;
                                        }
                                    }
                                    else {
                                        if (val < 1E11) {
                                            return 10;
                                        }
                                        else {
                                            return 11;
                                        }
                                    }
                                }
                                else {
                                    if (val < 1E14) {
                                        if (val < 1E13) {
                                            return 12;
                                        }
                                        else {
                                            return 13;
                                        }
                                    }
                                    else {
                                        if (val < 1E15) {
                                            return 14;
                                        }
                                        else {
                                            return 15;
                                        }
                                    }
                                }
                            }
                        }
                        if (val > 1E-16 && val < 1) {
                            if (val < 1E-8) {
                                if (val < 1E-12) {
                                    if (val < 1E-14) {
                                        if (val < 1E-15) {
                                            return -16;
                                        }
                                        else {
                                            return -15;
                                        }
                                    }
                                    else {
                                        if (val < 1E-13) {
                                            return -14;
                                        }
                                        else {
                                            return -13;
                                        }
                                    }
                                }
                                else {
                                    if (val < 1E-10) {
                                        if (val < 1E-11) {
                                            return -12;
                                        }
                                        else {
                                            return -11;
                                        }
                                    }
                                    else {
                                        if (val < 1E-9) {
                                            return -10;
                                        }
                                        else {
                                            return -9;
                                        }
                                    }
                                }
                            }
                            else {
                                if (val < 1E-4) {
                                    if (val < 1E-6) {
                                        if (val < 1E-7) {
                                            return -8;
                                        }
                                        else {
                                            return -7;
                                        }
                                    }
                                    else {
                                        if (val < 1E-5) {
                                            return -6;
                                        }
                                        else {
                                            return -5;
                                        }
                                    }
                                }
                                else {
                                    if (val < 1E-2) {
                                        if (val < 1E-3) {
                                            return -4;
                                        }
                                        else {
                                            return -3;
                                        }
                                    }
                                    else {
                                        if (val < 1E-1) {
                                            return -2;
                                        }
                                        else {
                                            return -1;
                                        }
                                    }
                                }
                            }
                        }
                        // JS Math provides only natural log function so we need to calc the 10 base logarithm:
                        // logb(x) = logk(x)/logk(b);
                        var log10 = Math.log(val) / Double.LOG_E_10;
                        return Double.floorWithPrecision(log10);
                    }
                    Double.log10 = log10;
                    /**
                     * Returns a power of 10 representing precision of the number based on the number of meaningful decimal digits.
                     * For example the precision of 56,263.3767 with the 6 meaningful decimal digit is 0.1.
                     * @param x Value.
                     * @param decimalDigits How many decimal digits are meaningfull.
                     */
                    function getPrecision(x, decimalDigits) {
                        if (decimalDigits === undefined) {
                            decimalDigits = Double.DEFAULT_PRECISION_IN_DECIMAL_DIGITS;
                        }
                        if (!x || !isFinite(x)) {
                            return undefined;
                        }
                        var exp = Double.log10(Math.abs(x));
                        if (exp < Double.MIN_EXP) {
                            return 0;
                        }
                        var precisionExp = Math.max(exp - decimalDigits, -Double.NEGATIVE_POWERS.length + 1);
                        return Double.pow10(precisionExp);
                    }
                    Double.getPrecision = getPrecision;
                    /**
                     * Checks if a delta between 2 numbers is less than provided precision.
                     * @param x One value.
                     * @param y Another value.
                     * @param precision Precision value.
                     */
                    function equalWithPrecision(x, y, precision) {
                        precision = detectPrecision(precision, x, y);
                        return x === y || Math.abs(x - y) < precision;
                    }
                    Double.equalWithPrecision = equalWithPrecision;
                    /**
                     * Checks if a first value is less than another taking
                     * into account the loose precision based equality.
                     * @param x One value.
                     * @param y Another value.
                     * @param precision Precision value.
                     */
                    function lessWithPrecision(x, y, precision) {
                        precision = detectPrecision(precision, x, y);
                        return x < y && Math.abs(x - y) > precision;
                    }
                    Double.lessWithPrecision = lessWithPrecision;
                    /**
                     * Checks if a first value is less or equal than another taking
                     * into account the loose precision based equality.
                     * @param x One value.
                     * @param y Another value.
                     * @param precision Precision value.
                     */
                    function lessOrEqualWithPrecision(x, y, precision) {
                        precision = detectPrecision(precision, x, y);
                        return x < y || Math.abs(x - y) < precision;
                    }
                    Double.lessOrEqualWithPrecision = lessOrEqualWithPrecision;
                    /**
                     * Checks if a first value is greater than another taking
                     * into account the loose precision based equality.
                     * @param x One value.
                     * @param y Another value.
                     * @param precision Precision value.
                     */
                    function greaterWithPrecision(x, y, precision) {
                        precision = detectPrecision(precision, x, y);
                        return x > y && Math.abs(x - y) > precision;
                    }
                    Double.greaterWithPrecision = greaterWithPrecision;
                    /**
                     * Checks if a first value is greater or equal to another taking
                     * into account the loose precision based equality.
                     * @param x One value.
                     * @param y Another value.
                     * @param precision Precision value.
                     */
                    function greaterOrEqualWithPrecision(x, y, precision) {
                        precision = detectPrecision(precision, x, y);
                        return x > y || Math.abs(x - y) < precision;
                    }
                    Double.greaterOrEqualWithPrecision = greaterOrEqualWithPrecision;
                    /**
                     * Floors the number unless it's withing the precision distance from the higher int.
                     * @param x One value.
                     * @param precision Precision value.
                     */
                    function floorWithPrecision(x, precision) {
                        precision = precision != null ? precision : Double.DEFAULT_PRECISION;
                        var roundX = Math.round(x);
                        if (Math.abs(x - roundX) < precision) {
                            return roundX;
                        }
                        else {
                            return Math.floor(x);
                        }
                    }
                    Double.floorWithPrecision = floorWithPrecision;
                    /**
                     * Ceils the number unless it's withing the precision distance from the lower int.
                     * @param x One value.
                     * @param precision Precision value.
                     */
                    function ceilWithPrecision(x, precision) {
                        precision = detectPrecision(precision, Double.DEFAULT_PRECISION);
                        var roundX = Math.round(x);
                        if (Math.abs(x - roundX) < precision) {
                            return roundX;
                        }
                        else {
                            return Math.ceil(x);
                        }
                    }
                    Double.ceilWithPrecision = ceilWithPrecision;
                    /**
                     * Floors the number to the provided precision.
                     * For example 234,578 floored to 1,000 precision is 234,000.
                     * @param x One value.
                     * @param precision Precision value.
                     */
                    function floorToPrecision(x, precision) {
                        precision = detectPrecision(precision, Double.DEFAULT_PRECISION);
                        if (precision === 0 || x === 0) {
                            return x;
                        }
                        // Precision must be a Power of 10
                        return Math.floor(x / precision) * precision;
                    }
                    Double.floorToPrecision = floorToPrecision;
                    /**
                     * Ceils the number to the provided precision.
                     * For example 234,578 floored to 1,000 precision is 235,000.
                     * @param x One value.
                     * @param precision Precision value.
                     */
                    function ceilToPrecision(x, precision) {
                        precision = detectPrecision(precision, Double.DEFAULT_PRECISION);
                        if (precision === 0 || x === 0) {
                            return x;
                        }
                        // Precision must be a Power of 10
                        return Math.ceil(x / precision) * precision;
                    }
                    Double.ceilToPrecision = ceilToPrecision;
                    /**
                     * Rounds the number to the provided precision.
                     * For example 234,578 floored to 1,000 precision is 235,000.
                     * @param x One value.
                     * @param precision Precision value.
                     */
                    function roundToPrecision(x, precision) {
                        precision = detectPrecision(precision, Double.DEFAULT_PRECISION);
                        if (precision === 0 || x === 0) {
                            return x;
                        }
                        // Precision must be a Power of 10
                        var result = Math.round(x / precision) * precision;
                        var decimalDigits = Math.round(Double.log10(Math.abs(x)) - Double.log10(precision)) + 1;
                        if (decimalDigits > 0 && decimalDigits < 16) {
                            result = parseFloat(result.toPrecision(decimalDigits));
                        }
                        return result;
                    }
                    Double.roundToPrecision = roundToPrecision;
                    /**
                     * Returns the value making sure that it's restricted to the provided range.
                     * @param x One value.
                     * @param min Range min boundary.
                     * @param max Range max boundary.
                     */
                    function ensureInRange(x, min, max) {
                        if (x === undefined || x === null) {
                            return x;
                        }
                        if (x < min) {
                            return min;
                        }
                        if (x > max) {
                            return max;
                        }
                        return x;
                    }
                    Double.ensureInRange = ensureInRange;
                    /**
                     * Rounds the value - this method is actually faster than Math.round - used in the graphics utils.
                     * @param x Value to round.
                     */
                    function round(x) {
                        return (0.5 + x) << 0;
                    }
                    Double.round = round;
                    /**
                     * Projects the value from the source range into the target range.
                     * @param value Value to project.
                     * @param fromMin Minimum of the source range.
                     * @param toMin Minimum of the target range.
                     * @param toMax Maximum of the target range.
                     */
                    function project(value, fromMin, fromSize, toMin, toSize) {
                        if (fromSize === 0 || toSize === 0) {
                            if (fromMin <= value && value <= fromMin + fromSize) {
                                return toMin;
                            }
                            else {
                                return NaN;
                            }
                        }
                        var relativeX = (value - fromMin) / fromSize;
                        var projectedX = toMin + relativeX * toSize;
                        return projectedX;
                    }
                    Double.project = project;
                    /**
                     * Removes decimal noise.
                     * @param value Value to be processed.
                     */
                    function removeDecimalNoise(value) {
                        return roundToPrecision(value, getPrecision(value));
                    }
                    Double.removeDecimalNoise = removeDecimalNoise;
                    /**
                     * Checks whether the number is integer.
                     * @param value Value to be checked.
                     */
                    function isInteger(value) {
                        return value !== null && value % 1 === 0;
                    }
                    Double.isInteger = isInteger;
                    /**
                     * Dividing by increment will give us count of increments
                     * Round out the rough edges into even integer
                     * Multiply back by increment to get rounded value
                     * e.g. Rounder.toIncrement(0.647291, 0.05) => 0.65
                     * @param value - value to round to nearest increment
                     * @param increment - smallest increment to round toward
                     */
                    function toIncrement(value, increment) {
                        return Math.round(value / increment) * increment;
                    }
                    Double.toIncrement = toIncrement;
                    /**
                     * Overrides the given precision with defaults if necessary. Exported only for tests
                     *
                     * precision defined returns precision
                     * x defined with y undefined returns twelve digits of precision based on x
                     * x defined but zero with y defined; returns twelve digits of precision based on y
                     * x and y defined retursn twelve digits of precision based on the minimum of the two
                     * if no applicable precision is found based on those (such as x and y being zero), the default precision is used
                     */
                    function detectPrecision(precision, x, y) {
                        if (precision !== undefined) {
                            return precision;
                        }
                        var calculatedPrecision;
                        if (!y) {
                            calculatedPrecision = Double.getPrecision(x);
                        }
                        else if (!x) {
                            calculatedPrecision = Double.getPrecision(y);
                        }
                        else {
                            calculatedPrecision = Double.getPrecision(Math.min(Math.abs(x), Math.abs(y)));
                        }
                        return calculatedPrecision || Double.DEFAULT_PRECISION;
                    }
                    Double.detectPrecision = detectPrecision;
                })(Double = type.Double || (type.Double = {}));
            })(type = utils.type || (utils.type = {}));
        })(utils = extensibility.utils || (extensibility.utils = {}));
    })(extensibility = powerbi.extensibility || (powerbi.extensibility = {}));
})(powerbi || (powerbi = {}));
/*
 *  Power BI Visualizations
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */
var powerbi;
(function (powerbi) {
    var extensibility;
    (function (extensibility) {
        var utils;
        (function (utils) {
            var type;
            (function (type) {
                var Prototype;
                (function (Prototype) {
                    /**
                     * Returns a new object with the provided obj as its prototype.
                     */
                    function inherit(obj, extension) {
                        function wrapCtor() { }
                        wrapCtor.prototype = obj;
                        var inherited = new wrapCtor();
                        if (extension)
                            extension(inherited);
                        return inherited;
                    }
                    Prototype.inherit = inherit;
                    /**
                     * Returns a new object with the provided obj as its prototype
                     * if, and only if, the prototype has not been previously set
                     */
                    function inheritSingle(obj) {
                        var proto = Object.getPrototypeOf(obj);
                        if (proto === Object.prototype || proto === Array.prototype)
                            obj = inherit(obj);
                        return obj;
                    }
                    Prototype.inheritSingle = inheritSingle;
                    /**
                     * Uses the provided callback function to selectively replace contents in the provided array.
                     * @return A new array with those values overriden
                     * or undefined if no overrides are necessary.
                     */
                    function overrideArray(prototype, override) {
                        if (!prototype)
                            return;
                        var overwritten;
                        for (var i = 0, len = prototype.length; i < len; i++) {
                            var value = override(prototype[i]);
                            if (value) {
                                if (!overwritten)
                                    overwritten = inherit(prototype);
                                overwritten[i] = value;
                            }
                        }
                        return overwritten;
                    }
                    Prototype.overrideArray = overrideArray;
                })(Prototype = type.Prototype || (type.Prototype = {}));
            })(type = utils.type || (utils.type = {}));
        })(utils = extensibility.utils || (extensibility.utils = {}));
    })(extensibility = powerbi.extensibility || (powerbi.extensibility = {}));
})(powerbi || (powerbi = {}));
/*
 *  Power BI Visualizations
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */
var powerbi;
(function (powerbi) {
    var extensibility;
    (function (extensibility) {
        var utils;
        (function (utils) {
            var type;
            (function (type) {
                var ArrayExtensions;
                (function (ArrayExtensions) {
                    /**
                     * Returns items that exist in target and other.
                     */
                    function intersect(target, other) {
                        var result = [];
                        for (var i = target.length - 1; i >= 0; --i) {
                            if (other.indexOf(target[i]) !== -1) {
                                result.push(target[i]);
                            }
                        }
                        return result;
                    }
                    ArrayExtensions.intersect = intersect;
                    /**
                     * Return elements exists in target but not exists in other.
                     */
                    function diff(target, other) {
                        var result = [];
                        for (var i = target.length - 1; i >= 0; --i) {
                            var value = target[i];
                            if (other.indexOf(value) === -1) {
                                result.push(value);
                            }
                        }
                        return result;
                    }
                    ArrayExtensions.diff = diff;
                    /**
                     * Return an array with only the distinct items in the source.
                     */
                    function distinct(source) {
                        var result = [];
                        for (var i = 0, len = source.length; i < len; i++) {
                            var value = source[i];
                            if (result.indexOf(value) === -1) {
                                result.push(value);
                            }
                        }
                        return result;
                    }
                    ArrayExtensions.distinct = distinct;
                    /**
                     * Pushes content of source onto target,
                     * for parts of course that do not already exist in target.
                     */
                    function union(target, source) {
                        for (var i = 0, len = source.length; i < len; ++i) {
                            unionSingle(target, source[i]);
                        }
                    }
                    ArrayExtensions.union = union;
                    /**
                     * Pushes value onto target, if value does not already exist in target.
                     */
                    function unionSingle(target, value) {
                        if (target.indexOf(value) < 0) {
                            target.push(value);
                        }
                    }
                    ArrayExtensions.unionSingle = unionSingle;
                    /**
                     * Returns an array with a range of items from source,
                     * including the startIndex & endIndex.
                     */
                    function range(source, startIndex, endIndex) {
                        var result = [];
                        for (var i = startIndex; i <= endIndex; ++i) {
                            result.push(source[i]);
                        }
                        return result;
                    }
                    ArrayExtensions.range = range;
                    /**
                     * Returns an array that includes items from source, up to the specified count.
                     */
                    function take(source, count) {
                        var result = [];
                        for (var i = 0; i < count; ++i) {
                            result.push(source[i]);
                        }
                        return result;
                    }
                    ArrayExtensions.take = take;
                    function copy(source) {
                        return take(source, source.length);
                    }
                    ArrayExtensions.copy = copy;
                    /**
                      * Returns a value indicating whether the arrays have the same values in the same sequence.
                      */
                    function sequenceEqual(left, right, comparison) {
                        // Normalize falsy to null
                        if (!left) {
                            left = null;
                        }
                        if (!right) {
                            right = null;
                        }
                        // T can be same as U, and it is possible for left and right to be the same array object...
                        if (left === right) {
                            return true;
                        }
                        if (!!left !== !!right) {
                            return false;
                        }
                        var len = left.length;
                        if (len !== right.length) {
                            return false;
                        }
                        var i = 0;
                        while (i < len && comparison(left[i], right[i])) {
                            ++i;
                        }
                        return i === len;
                    }
                    ArrayExtensions.sequenceEqual = sequenceEqual;
                    /**
                     * Returns null if the specified array is empty.
                     * Otherwise returns the specified array.
                     */
                    function emptyToNull(array) {
                        if (array && array.length === 0) {
                            return null;
                        }
                        return array;
                    }
                    ArrayExtensions.emptyToNull = emptyToNull;
                    function indexOf(array, predicate) {
                        for (var i = 0, len = array.length; i < len; ++i) {
                            if (predicate(array[i])) {
                                return i;
                            }
                        }
                        return -1;
                    }
                    ArrayExtensions.indexOf = indexOf;
                    /**
                     * Returns a copy of the array rotated by the specified offset.
                     */
                    function rotate(array, offset) {
                        if (offset === 0)
                            return array.slice();
                        var rotated = array.slice(offset);
                        Array.prototype.push.apply(rotated, array.slice(0, offset));
                        return rotated;
                    }
                    ArrayExtensions.rotate = rotate;
                    function createWithId() {
                        return extendWithId([]);
                    }
                    ArrayExtensions.createWithId = createWithId;
                    function extendWithId(array) {
                        var extended = array;
                        extended.withId = withId;
                        return extended;
                    }
                    ArrayExtensions.extendWithId = extendWithId;
                    /**
                     * Finds and returns the first item with a matching ID.
                     */
                    function findWithId(array, id) {
                        for (var i = 0, len = array.length; i < len; i++) {
                            var item = array[i];
                            if (item.id === id)
                                return item;
                        }
                    }
                    ArrayExtensions.findWithId = findWithId;
                    function withId(id) {
                        return ArrayExtensions.findWithId(this, id);
                    }
                    function createWithName() {
                        return extendWithName([]);
                    }
                    ArrayExtensions.createWithName = createWithName;
                    function extendWithName(array) {
                        var extended = array;
                        extended.withName = withName;
                        return extended;
                    }
                    ArrayExtensions.extendWithName = extendWithName;
                    function findItemWithName(array, name) {
                        var index = indexWithName(array, name);
                        if (index >= 0)
                            return array[index];
                    }
                    ArrayExtensions.findItemWithName = findItemWithName;
                    function indexWithName(array, name) {
                        for (var i = 0, len = array.length; i < len; i++) {
                            var item = array[i];
                            if (item.name === name)
                                return i;
                        }
                        return -1;
                    }
                    ArrayExtensions.indexWithName = indexWithName;
                    /**
                     * Inserts a number in sorted order into a list of numbers already in sorted order.
                     * @returns True if the item was added, false if it already existed.
                     */
                    function insertSorted(list, value) {
                        var len = list.length;
                        // NOTE: iterate backwards because incoming values tend to be sorted already.
                        for (var i = len - 1; i >= 0; i--) {
                            var diff_1 = list[i] - value;
                            if (diff_1 === 0)
                                return false;
                            if (diff_1 > 0)
                                continue;
                            // diff < 0
                            list.splice(i + 1, 0, value);
                            return true;
                        }
                        list.unshift(value);
                        return true;
                    }
                    ArrayExtensions.insertSorted = insertSorted;
                    /**
                     * Removes the first occurrence of a value from a list if it exists.
                     * @returns True if the value was removed, false if it did not exist in the list.
                     */
                    function removeFirst(list, value) {
                        var index = list.indexOf(value);
                        if (index < 0)
                            return false;
                        list.splice(index, 1);
                        return true;
                    }
                    ArrayExtensions.removeFirst = removeFirst;
                    /**
                     * Finds and returns the first item with a matching name.
                     */
                    function withName(name) {
                        var array = this;
                        return findItemWithName(array, name);
                    }
                    /**
                     * Deletes all items from the array.
                     */
                    function clear(array) {
                        if (!array)
                            return;
                        while (array.length > 0)
                            array.pop();
                    }
                    ArrayExtensions.clear = clear;
                    function isUndefinedOrEmpty(array) {
                        if (!array || array.length === 0) {
                            return true;
                        }
                        return false;
                    }
                    ArrayExtensions.isUndefinedOrEmpty = isUndefinedOrEmpty;
                    function swap(array, firstIndex, secondIndex) {
                        var temp = array[firstIndex];
                        array[firstIndex] = array[secondIndex];
                        array[secondIndex] = temp;
                    }
                    ArrayExtensions.swap = swap;
                    function isInArray(array, lookupItem, compareCallback) {
                        return array.some(function (item) { return compareCallback(item, lookupItem); });
                    }
                    ArrayExtensions.isInArray = isInArray;
                    /** Checks if the given object is an Array, and looking all the way up the prototype chain. */
                    function isArrayOrInheritedArray(obj) {
                        var nextPrototype = obj;
                        while (nextPrototype != null) {
                            if (Array.isArray(nextPrototype))
                                return true;
                            nextPrototype = Object.getPrototypeOf(nextPrototype);
                        }
                        return false;
                    }
                    ArrayExtensions.isArrayOrInheritedArray = isArrayOrInheritedArray;
                    /**
                     * Returns true if the specified values array is sorted in an order as determined by the specified compareFunction.
                     */
                    function isSorted(values, compareFunction) {
                        var ilen = values.length;
                        if (ilen >= 2) {
                            for (var i = 1; i < ilen; i++) {
                                if (compareFunction(values[i - 1], values[i]) > 0) {
                                    return false;
                                }
                            }
                        }
                        return true;
                    }
                    ArrayExtensions.isSorted = isSorted;
                    /**
                     * Returns true if the specified number values array is sorted in ascending order
                     * (or descending order if the specified descendingOrder is truthy).
                     */
                    function isSortedNumeric(values, descendingOrder) {
                        var compareFunction = descendingOrder ?
                            function (a, b) { return b - a; } :
                            function (a, b) { return a - b; };
                        return isSorted(values, compareFunction);
                    }
                    ArrayExtensions.isSortedNumeric = isSortedNumeric;
                    /**
                     * Ensures that the given T || T[] is in array form, either returning the array or
                     * converting single items into an array of length one.
                     */
                    function ensureArray(value) {
                        if (Array.isArray(value)) {
                            return value;
                        }
                        return [value];
                    }
                    ArrayExtensions.ensureArray = ensureArray;
                })(ArrayExtensions = type.ArrayExtensions || (type.ArrayExtensions = {}));
            })(type = utils.type || (utils.type = {}));
        })(utils = extensibility.utils || (extensibility.utils = {}));
    })(extensibility = powerbi.extensibility || (powerbi.extensibility = {}));
})(powerbi || (powerbi = {}));
/*
 *  Power BI Visualizations
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */
var powerbi;
(function (powerbi) {
    var extensibility;
    (function (extensibility) {
        var utils;
        (function (utils) {
            var type;
            (function (type) {
                // NOTE: this file includes standalone utilities that should have no dependencies on external libraries, including jQuery.
                var Double = powerbi.extensibility.utils.type.Double;
                /**
                 * Extensions for Enumerations.
                 */
                var EnumExtensions;
                (function (EnumExtensions) {
                    /**
                     * Gets a value indicating whether the value has the bit flags set.
                     */
                    function hasFlag(value, flag) {
                        return (value & flag) === flag;
                    }
                    EnumExtensions.hasFlag = hasFlag;
                    /**
                     * Sets a value of a flag without modifying any other flags.
                     */
                    function setFlag(value, flag) {
                        return value |= flag;
                    }
                    EnumExtensions.setFlag = setFlag;
                    /**
                     * Resets a value of a flag without modifying any other flags.
                     */
                    function resetFlag(value, flag) {
                        return value &= ~flag;
                    }
                    EnumExtensions.resetFlag = resetFlag;
                    /**
                     * According to the TypeScript Handbook, this is safe to do.
                     */
                    function toString(enumType, value) {
                        return enumType[value];
                    }
                    EnumExtensions.toString = toString;
                    /**
                     * Returns the number of 1's in the specified value that is a set of binary bit flags.
                     */
                    function getBitCount(value) {
                        if (!Double.isInteger(value))
                            return 0;
                        var bitCount = 0;
                        var shiftingValue = value;
                        while (shiftingValue !== 0) {
                            if ((shiftingValue & 1) === 1) {
                                bitCount++;
                            }
                            shiftingValue = shiftingValue >>> 1;
                        }
                        return bitCount;
                    }
                    EnumExtensions.getBitCount = getBitCount;
                })(EnumExtensions = type.EnumExtensions || (type.EnumExtensions = {}));
            })(type = utils.type || (utils.type = {}));
        })(utils = extensibility.utils || (extensibility.utils = {}));
    })(extensibility = powerbi.extensibility || (powerbi.extensibility = {}));
})(powerbi || (powerbi = {}));
/*
 *  Power BI Visualizations
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */
var powerbi;
(function (powerbi) {
    var extensibility;
    (function (extensibility) {
        var utils;
        (function (utils) {
            var type;
            (function (type) {
                var Double = powerbi.extensibility.utils.type.Double;
                var NumericSequenceRange = (function () {
                    function NumericSequenceRange() {
                    }
                    NumericSequenceRange.prototype._ensureIncludeZero = function () {
                        if (this.includeZero) {
                            // fixed min and max has higher priority than includeZero
                            if (this.min > 0 && !this.hasFixedMin) {
                                this.min = 0;
                            }
                            if (this.max < 0 && !this.hasFixedMax) {
                                this.max = 0;
                            }
                        }
                    };
                    NumericSequenceRange.prototype._ensureNotEmpty = function () {
                        if (this.min === this.max) {
                            if (!this.min) {
                                this.min = 0;
                                this.max = NumericSequenceRange.DEFAULT_MAX;
                                this.hasFixedMin = true;
                                this.hasFixedMax = true;
                            }
                            else {
                                // We are dealing with a single data value (includeZero is not set)
                                // In order to fix the range we need to extend it in both directions by half of the interval.
                                // Interval is calculated based on the number:
                                // 1. Integers below 10,000 are extended by 0.5: so the [2006-2006] empty range is extended to [2005.5-2006.5] range and the ForsedSingleStop=2006
                                // 2. Other numbers are extended by half of their power: [700,001-700,001] => [650,001-750,001] and the ForsedSingleStop=null as we want the intervals to be calculated to cover the range.
                                var value = this.min;
                                var exp = Double.log10(Math.abs(value));
                                var step = void 0;
                                if (exp >= 0 && exp < 4) {
                                    step = 0.5;
                                    this.forcedSingleStop = value;
                                }
                                else {
                                    step = Double.pow10(exp) / 2;
                                    this.forcedSingleStop = null;
                                }
                                this.min = value - step;
                                this.max = value + step;
                            }
                        }
                    };
                    NumericSequenceRange.prototype._ensureDirection = function () {
                        if (this.min > this.max) {
                            var temp = this.min;
                            this.min = this.max;
                            this.max = temp;
                        }
                    };
                    NumericSequenceRange.prototype.getSize = function () {
                        return this.max - this.min;
                    };
                    NumericSequenceRange.prototype.shrinkByStep = function (range, step) {
                        var oldCount = this.min / step;
                        var newCount = range.min / step;
                        var deltaCount = Math.floor(newCount - oldCount);
                        this.min += deltaCount * step;
                        oldCount = this.max / step;
                        newCount = range.max / step;
                        deltaCount = Math.ceil(newCount - oldCount);
                        this.max += deltaCount * step;
                    };
                    NumericSequenceRange.calculate = function (dataMin, dataMax, fixedMin, fixedMax, includeZero) {
                        var result = new NumericSequenceRange();
                        result.includeZero = includeZero ? true : false;
                        result.hasDataRange = ValueUtil.hasValue(dataMin) && ValueUtil.hasValue(dataMax);
                        result.hasFixedMin = ValueUtil.hasValue(fixedMin);
                        result.hasFixedMax = ValueUtil.hasValue(fixedMax);
                        dataMin = Double.ensureInRange(dataMin, NumericSequenceRange.MIN_SUPPORTED_DOUBLE, NumericSequenceRange.MAX_SUPPORTED_DOUBLE);
                        dataMax = Double.ensureInRange(dataMax, NumericSequenceRange.MIN_SUPPORTED_DOUBLE, NumericSequenceRange.MAX_SUPPORTED_DOUBLE);
                        // Calculate the range using the min, max, dataRange
                        if (result.hasFixedMin && result.hasFixedMax) {
                            result.min = fixedMin;
                            result.max = fixedMax;
                        }
                        else if (result.hasFixedMin) {
                            result.min = fixedMin;
                            result.max = dataMax > fixedMin ? dataMax : fixedMin;
                        }
                        else if (result.hasFixedMax) {
                            result.min = dataMin < fixedMax ? dataMin : fixedMax;
                            result.max = fixedMax;
                        }
                        else if (result.hasDataRange) {
                            result.min = dataMin;
                            result.max = dataMax;
                        }
                        else {
                            result.min = 0;
                            result.max = 0;
                        }
                        result._ensureIncludeZero();
                        result._ensureNotEmpty();
                        result._ensureDirection();
                        if (result.min === 0) {
                            result.hasFixedMin = true; // If the range starts from zero we should prevent extending the intervals into the negative range
                        }
                        else if (result.max === 0) {
                            result.hasFixedMax = true; // If the range ends at zero we should prevent extending the intervals into the positive range
                        }
                        return result;
                    };
                    NumericSequenceRange.calculateDataRange = function (dataMin, dataMax, includeZero) {
                        if (!ValueUtil.hasValue(dataMin) || !ValueUtil.hasValue(dataMax)) {
                            return NumericSequenceRange.calculateFixedRange(0, NumericSequenceRange.DEFAULT_MAX);
                        }
                        else {
                            return NumericSequenceRange.calculate(dataMin, dataMax, null, null, includeZero);
                        }
                    };
                    NumericSequenceRange.calculateFixedRange = function (fixedMin, fixedMax, includeZero) {
                        var result = new NumericSequenceRange();
                        result.hasDataRange = false;
                        result.includeZero = includeZero;
                        result.min = fixedMin;
                        result.max = fixedMax;
                        result._ensureIncludeZero();
                        result._ensureNotEmpty();
                        result._ensureDirection();
                        result.hasFixedMin = true;
                        result.hasFixedMax = true;
                        return result;
                    };
                    return NumericSequenceRange;
                }());
                NumericSequenceRange.DEFAULT_MAX = 10;
                NumericSequenceRange.MIN_SUPPORTED_DOUBLE = -1E307;
                NumericSequenceRange.MAX_SUPPORTED_DOUBLE = 1E307;
                type.NumericSequenceRange = NumericSequenceRange;
                /** Note: Exported for testability */
                var ValueUtil;
                (function (ValueUtil) {
                    function hasValue(value) {
                        return value !== undefined && value !== null;
                    }
                    ValueUtil.hasValue = hasValue;
                })(ValueUtil = type.ValueUtil || (type.ValueUtil = {}));
            })(type = utils.type || (utils.type = {}));
        })(utils = extensibility.utils || (extensibility.utils = {}));
    })(extensibility = powerbi.extensibility || (powerbi.extensibility = {}));
})(powerbi || (powerbi = {}));
/*
 *  Power BI Visualizations
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */
var powerbi;
(function (powerbi) {
    var extensibility;
    (function (extensibility) {
        var utils;
        (function (utils) {
            var type;
            (function (type) {
                var Double = powerbi.extensibility.utils.type.Double;
                var NumericSequenceRange = powerbi.extensibility.utils.type.NumericSequenceRange;
                var NumericSequence = (function () {
                    function NumericSequence() {
                    }
                    NumericSequence.calculate = function (range, expectedCount, maxAllowedMargin, minPower, useZeroRefPoint, steps) {
                        var result = new NumericSequence();
                        if (expectedCount === undefined)
                            expectedCount = 10;
                        else
                            expectedCount = Double.ensureInRange(expectedCount, NumericSequence.MIN_COUNT, NumericSequence.MAX_COUNT);
                        if (minPower === undefined)
                            minPower = Double.MIN_EXP;
                        if (useZeroRefPoint === undefined)
                            useZeroRefPoint = false;
                        if (maxAllowedMargin === undefined)
                            maxAllowedMargin = 1;
                        if (steps === undefined)
                            steps = [1, 2, 5];
                        // Handle single stop case
                        if (range.forcedSingleStop) {
                            result.interval = range.getSize();
                            result.intervalOffset = result.interval - (range.forcedSingleStop - range.min);
                            result.min = range.min;
                            result.max = range.max;
                            result.sequence = [range.forcedSingleStop];
                            return result;
                        }
                        var interval = 0;
                        var min = 0;
                        var max = 9;
                        var canExtendMin = maxAllowedMargin > 0 && !range.hasFixedMin;
                        var canExtendMax = maxAllowedMargin > 0 && !range.hasFixedMax;
                        var size = range.getSize();
                        var exp = Double.log10(size);
                        // Account for Exp of steps
                        var stepExp = Double.log10(steps[0]);
                        exp = exp - stepExp;
                        // Account for MaxCount
                        var expectedCountExp = Double.log10(expectedCount);
                        exp = exp - expectedCountExp;
                        // Account for MinPower
                        exp = Math.max(exp, minPower - stepExp + 1);
                        var count = undefined;
                        // Create array of "good looking" numbers
                        if (interval !== 0) {
                            // If explicit interval is defined - use it instead of the steps array.
                            var power = Double.pow10(exp);
                            var roundMin = Double.floorToPrecision(range.min, power);
                            var roundMax = Double.ceilToPrecision(range.max, power);
                            var roundRange = NumericSequenceRange.calculateFixedRange(roundMin, roundMax);
                            roundRange.shrinkByStep(range, interval);
                            min = roundRange.min;
                            max = roundRange.max;
                            count = Math.floor(roundRange.getSize() / interval);
                        }
                        else {
                            // No interval defined -> find optimal interval
                            var dexp = void 0;
                            for (dexp = 0; dexp < 3; dexp++) {
                                var e = exp + dexp;
                                var power = Double.pow10(e);
                                var roundMin = Double.floorToPrecision(range.min, power);
                                var roundMax = Double.ceilToPrecision(range.max, power);
                                // Go throught the steps array looking for the smallest step that produces the right interval count.
                                var stepsCount = steps.length;
                                var stepPower = Double.pow10(e - 1);
                                for (var i = 0; i < stepsCount; i++) {
                                    var step = steps[i] * stepPower;
                                    var roundRange = NumericSequenceRange.calculateFixedRange(roundMin, roundMax, useZeroRefPoint);
                                    roundRange.shrinkByStep(range, step);
                                    // If the range is based on Data we might need to extend it to provide nice data margins.
                                    if (canExtendMin && range.min === roundRange.min && maxAllowedMargin >= 1)
                                        roundRange.min -= step;
                                    if (canExtendMax && range.max === roundRange.max && maxAllowedMargin >= 1)
                                        roundRange.max += step;
                                    // Count the intervals
                                    count = Double.ceilWithPrecision(roundRange.getSize() / step, Double.DEFAULT_PRECISION);
                                    if (count <= expectedCount || (dexp === 2 && i === stepsCount - 1) || (expectedCount === 1 && count === 2 && (step > range.getSize() || (range.min < 0 && range.max > 0 && step * 2 >= range.getSize())))) {
                                        interval = step;
                                        min = roundRange.min;
                                        max = roundRange.max;
                                        break;
                                    }
                                }
                                // Increase the scale power until the interval is found
                                if (interval !== 0)
                                    break;
                            }
                        }
                        // Avoid extreme count cases (>1000 ticks)
                        if (count > expectedCount * 32 || count > NumericSequence.MAX_COUNT) {
                            count = Math.min(expectedCount * 32, NumericSequence.MAX_COUNT);
                            interval = (max - min) / count;
                        }
                        result.min = min;
                        result.max = max;
                        result.interval = interval;
                        result.intervalOffset = min - range.min;
                        result.maxAllowedMargin = maxAllowedMargin;
                        result.canExtendMin = canExtendMin;
                        result.canExtendMax = canExtendMax;
                        // Fill in the Sequence
                        var precision = Double.getPrecision(interval, 0);
                        result.precision = precision;
                        var sequence = [];
                        var x = Double.roundToPrecision(min, precision);
                        sequence.push(x);
                        for (var i = 0; i < count; i++) {
                            x = Double.roundToPrecision(x + interval, precision);
                            sequence.push(x);
                        }
                        result.sequence = sequence;
                        result.trimMinMax(range.min, range.max);
                        return result;
                    };
                    /**
                     * Calculates the sequence of int numbers which are mapped to the multiples of the units grid.
                     * @min - The minimum of the range.
                     * @max - The maximum of the range.
                     * @maxCount - The max count of intervals.
                     * @steps - array of intervals.
                     */
                    NumericSequence.calculateUnits = function (min, max, maxCount, steps) {
                        // Initialization actions
                        maxCount = Double.ensureInRange(maxCount, NumericSequence.MIN_COUNT, NumericSequence.MAX_COUNT);
                        if (min === max) {
                            max = min + 1;
                        }
                        var stepCount = 0;
                        var step = 0;
                        // Calculate step
                        for (var i = 0; i < steps.length; i++) {
                            step = steps[i];
                            var maxStepCount = Double.ceilWithPrecision(max / step);
                            var minStepCount = Double.floorWithPrecision(min / step);
                            stepCount = maxStepCount - minStepCount;
                            if (stepCount <= maxCount) {
                                break;
                            }
                        }
                        // Calculate the offset
                        var offset = -min;
                        offset = offset % step;
                        // Create sequence
                        var result = new NumericSequence();
                        result.sequence = [];
                        for (var x = min + offset;; x += step) {
                            result.sequence.push(x);
                            if (x >= max)
                                break;
                        }
                        result.interval = step;
                        result.intervalOffset = offset;
                        result.min = result.sequence[0];
                        result.max = result.sequence[result.sequence.length - 1];
                        return result;
                    };
                    NumericSequence.prototype.trimMinMax = function (min, max) {
                        var minMargin = (min - this.min) / this.interval;
                        var maxMargin = (this.max - max) / this.interval;
                        var marginPrecision = 0.001;
                        if (!this.canExtendMin || (minMargin > this.maxAllowedMargin && minMargin > marginPrecision)) {
                            this.min = min;
                        }
                        if (!this.canExtendMax || (maxMargin > this.maxAllowedMargin && maxMargin > marginPrecision)) {
                            this.max = max;
                        }
                    };
                    return NumericSequence;
                }());
                NumericSequence.MIN_COUNT = 1;
                NumericSequence.MAX_COUNT = 1000;
                type.NumericSequence = NumericSequence;
            })(type = utils.type || (utils.type = {}));
        })(utils = extensibility.utils || (extensibility.utils = {}));
    })(extensibility = powerbi.extensibility || (powerbi.extensibility = {}));
})(powerbi || (powerbi = {}));
/*
 *  Power BI Visualizations
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */
var powerbi;
(function (powerbi) {
    var extensibility;
    (function (extensibility) {
        var utils;
        (function (utils) {
            var type;
            (function (type) {
                var PixelConverter;
                (function (PixelConverter) {
                    var PxPtRatio = 4 / 3;
                    var PixelString = "px";
                    /**
                     * Appends 'px' to the end of number value for use as pixel string in styles
                     */
                    function toString(px) {
                        return px + PixelString;
                    }
                    PixelConverter.toString = toString;
                    /**
                     * Converts point value (pt) to pixels
                     * Returns a string for font-size property
                     * e.g. fromPoint(8) => '24px'
                     */
                    function fromPoint(pt) {
                        return toString(fromPointToPixel(pt));
                    }
                    PixelConverter.fromPoint = fromPoint;
                    /**
                     * Converts point value (pt) to pixels
                     * Returns a number for font-size property
                     * e.g. fromPoint(8) => 24px
                     */
                    function fromPointToPixel(pt) {
                        return (PxPtRatio * pt);
                    }
                    PixelConverter.fromPointToPixel = fromPointToPixel;
                    /**
                     * Converts pixel value (px) to pt
                     * e.g. toPoint(24) => 8
                     */
                    function toPoint(px) {
                        return px / PxPtRatio;
                    }
                    PixelConverter.toPoint = toPoint;
                })(PixelConverter = type.PixelConverter || (type.PixelConverter = {}));
            })(type = utils.type || (utils.type = {}));
        })(utils = extensibility.utils || (extensibility.utils = {}));
    })(extensibility = powerbi.extensibility || (powerbi.extensibility = {}));
})(powerbi || (powerbi = {}));
/*
 *  Power BI Visualizations
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */
var powerbi;
(function (powerbi) {
    var extensibility;
    (function (extensibility) {
        var utils;
        (function (utils) {
            var type;
            (function (type) {
                // NOTE: this file includes standalone utilities that should have no dependencies on external libraries, including jQuery.
                var RegExpExtensions;
                (function (RegExpExtensions) {
                    /**
                     * Runs exec on regex starting from 0 index
                     * This is the expected behavior but RegExp actually remember
                     * the last index they stopped at (found match at) and will
                     * return unexpected results when run in sequence.
                     * @param regex - regular expression object
                     * @param value - string to search wiht regex
                     * @param start - index within value to start regex
                     */
                    function run(regex, value, start) {
                        regex.lastIndex = start || 0;
                        return regex.exec(value);
                    }
                    RegExpExtensions.run = run;
                })(RegExpExtensions = type.RegExpExtensions || (type.RegExpExtensions = {}));
            })(type = utils.type || (utils.type = {}));
        })(utils = extensibility.utils || (extensibility.utils = {}));
    })(extensibility = powerbi.extensibility || (powerbi.extensibility = {}));
})(powerbi || (powerbi = {}));
/*
 *  Power BI Visualizations
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */
var powerbi;
(function (powerbi) {
    var extensibility;
    (function (extensibility) {
        var utils;
        (function (utils) {
            var type;
            (function (type) {
                /**
                 * Extensions to String class.
                 */
                var StringExtensions;
                (function (StringExtensions) {
                    /**
                     * Checks if a string ends with a sub-string.
                     */
                    function endsWith(str, suffix) {
                        return str.indexOf(suffix, str.length - suffix.length) !== -1;
                    }
                    StringExtensions.endsWith = endsWith;
                })(StringExtensions = type.StringExtensions || (type.StringExtensions = {}));
            })(type = utils.type || (utils.type = {}));
        })(utils = extensibility.utils || (extensibility.utils = {}));
    })(extensibility = powerbi.extensibility || (powerbi.extensibility = {}));
})(powerbi || (powerbi = {}));
/*
 *  Power BI Visualizations
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */
var powerbi;
(function (powerbi) {
    var extensibility;
    (function (extensibility) {
        var utils;
        (function (utils) {
            var type;
            (function (type) {
                // NOTE: this file includes standalone utilities that should have no dependencies on external libraries, including jQuery.
                var LogicExtensions;
                (function (LogicExtensions) {
                    function XOR(a, b) {
                        return (a || b) && !(a && b);
                    }
                    LogicExtensions.XOR = XOR;
                })(LogicExtensions = type.LogicExtensions || (type.LogicExtensions = {}));
            })(type = utils.type || (utils.type = {}));
        })(utils = extensibility.utils || (extensibility.utils = {}));
    })(extensibility = powerbi.extensibility || (powerbi.extensibility = {}));
})(powerbi || (powerbi = {}));
/*
 *  Power BI Visualizations
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */
var powerbi;
(function (powerbi) {
    var extensibility;
    (function (extensibility) {
        var utils;
        (function (utils) {
            var type;
            (function (type) {
                // NOTE: this file includes standalone utilities that should have no dependencies on external libraries, including jQuery.
                var JsonComparer;
                (function (JsonComparer) {
                    /**
                     * Performs JSON-style comparison of two objects.
                     */
                    function equals(x, y) {
                        if (x === y)
                            return true;
                        return JSON.stringify(x) === JSON.stringify(y);
                    }
                    JsonComparer.equals = equals;
                })(JsonComparer = type.JsonComparer || (type.JsonComparer = {}));
            })(type = utils.type || (utils.type = {}));
        })(utils = extensibility.utils || (extensibility.utils = {}));
    })(extensibility = powerbi.extensibility || (powerbi.extensibility = {}));
})(powerbi || (powerbi = {}));
/*
 *  Power BI Visualizations
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */
var powerbi;
(function (powerbi) {
    var extensibility;
    (function (extensibility) {
        var utils;
        (function (utils) {
            var type;
            (function (type) {
                // NOTE: this file includes standalone utilities that should have no dependencies on external libraries, including jQuery.
                /**
                 * Values are in terms of 'pt'
                 * Convert to pixels using PixelConverter.fromPoint
                 */
                var TextSizeDefaults;
                (function (TextSizeDefaults) {
                    /**
                     * Stored in terms of 'pt'
                     * Convert to pixels using PixelConverter.fromPoint
                     */
                    TextSizeDefaults.TextSizeMin = 8;
                    /**
                     * Stored in terms of 'pt'
                     * Convert to pixels using PixelConverter.fromPoint
                     */
                    TextSizeDefaults.TextSizeMax = 40;
                    var TextSizeRange = TextSizeDefaults.TextSizeMax - TextSizeDefaults.TextSizeMin;
                    /**
                     * Returns the percentage of this value relative to the TextSizeMax
                     * @param textSize - should be given in terms of 'pt'
                     */
                    function getScale(textSize) {
                        return (textSize - TextSizeDefaults.TextSizeMin) / TextSizeRange;
                    }
                    TextSizeDefaults.getScale = getScale;
                })(TextSizeDefaults = type.TextSizeDefaults || (type.TextSizeDefaults = {}));
            })(type = utils.type || (utils.type = {}));
        })(utils = extensibility.utils || (extensibility.utils = {}));
    })(extensibility = powerbi.extensibility || (powerbi.extensibility = {}));
})(powerbi || (powerbi = {}));
/*
 *  Power BI Visualizations
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */
var powerbi;
(function (powerbi) {
    var extensibility;
    (function (extensibility) {
        var utils;
        (function (utils) {
            var type;
            (function (type) {
                // powerbi.extensibility.utils.type
                var EnumExtensions = powerbi.extensibility.utils.type.EnumExtensions;
                /** Describes a data value type, including a primitive type and extended type if any (derived from data category). */
                var ValueType = (function () {
                    /** Do not call the ValueType constructor directly. Use the ValueType.fromXXX methods. */
                    function ValueType(underlyingType, category, enumType, variantTypes) {
                        this.underlyingType = underlyingType;
                        this.category = category;
                        if (EnumExtensions.hasFlag(underlyingType, ExtendedType.Temporal)) {
                            this.temporalType = new TemporalType(underlyingType);
                        }
                        if (EnumExtensions.hasFlag(underlyingType, ExtendedType.Geography)) {
                            this.geographyType = new GeographyType(underlyingType);
                        }
                        if (EnumExtensions.hasFlag(underlyingType, ExtendedType.Miscellaneous)) {
                            this.miscType = new MiscellaneousType(underlyingType);
                        }
                        if (EnumExtensions.hasFlag(underlyingType, ExtendedType.Formatting)) {
                            this.formattingType = new FormattingType(underlyingType);
                        }
                        if (EnumExtensions.hasFlag(underlyingType, ExtendedType.Enumeration)) {
                            this.enumType = enumType;
                        }
                        if (EnumExtensions.hasFlag(underlyingType, ExtendedType.Scripting)) {
                            this.scriptingType = new ScriptType(underlyingType);
                        }
                        if (EnumExtensions.hasFlag(underlyingType, ExtendedType.Variant)) {
                            this.variationTypes = variantTypes;
                        }
                    }
                    /** Creates or retrieves a ValueType object based on the specified ValueTypeDescriptor. */
                    ValueType.fromDescriptor = function (descriptor) {
                        descriptor = descriptor || {};
                        // Simplified primitive types
                        if (descriptor.text)
                            return ValueType.fromExtendedType(ExtendedType.Text);
                        if (descriptor.integer)
                            return ValueType.fromExtendedType(ExtendedType.Integer);
                        if (descriptor.numeric)
                            return ValueType.fromExtendedType(ExtendedType.Double);
                        if (descriptor.bool)
                            return ValueType.fromExtendedType(ExtendedType.Boolean);
                        if (descriptor.dateTime)
                            return ValueType.fromExtendedType(ExtendedType.DateTime);
                        if (descriptor.duration)
                            return ValueType.fromExtendedType(ExtendedType.Duration);
                        if (descriptor.binary)
                            return ValueType.fromExtendedType(ExtendedType.Binary);
                        if (descriptor.none)
                            return ValueType.fromExtendedType(ExtendedType.None);
                        // Extended types
                        if (descriptor.scripting) {
                            if (descriptor.scripting.source)
                                return ValueType.fromExtendedType(ExtendedType.ScriptSource);
                        }
                        if (descriptor.enumeration)
                            return ValueType.fromEnum(descriptor.enumeration);
                        if (descriptor.temporal) {
                            if (descriptor.temporal.year)
                                return ValueType.fromExtendedType(ExtendedType.Years_Integer);
                            if (descriptor.temporal.quarter)
                                return ValueType.fromExtendedType(ExtendedType.Quarters_Integer);
                            if (descriptor.temporal.month)
                                return ValueType.fromExtendedType(ExtendedType.Months_Integer);
                            if (descriptor.temporal.day)
                                return ValueType.fromExtendedType(ExtendedType.DayOfMonth_Integer);
                            if (descriptor.temporal.paddedDateTableDate)
                                return ValueType.fromExtendedType(ExtendedType.PaddedDateTableDates);
                        }
                        if (descriptor.geography) {
                            if (descriptor.geography.address)
                                return ValueType.fromExtendedType(ExtendedType.Address);
                            if (descriptor.geography.city)
                                return ValueType.fromExtendedType(ExtendedType.City);
                            if (descriptor.geography.continent)
                                return ValueType.fromExtendedType(ExtendedType.Continent);
                            if (descriptor.geography.country)
                                return ValueType.fromExtendedType(ExtendedType.Country);
                            if (descriptor.geography.county)
                                return ValueType.fromExtendedType(ExtendedType.County);
                            if (descriptor.geography.region)
                                return ValueType.fromExtendedType(ExtendedType.Region);
                            if (descriptor.geography.postalCode)
                                return ValueType.fromExtendedType(ExtendedType.PostalCode_Text);
                            if (descriptor.geography.stateOrProvince)
                                return ValueType.fromExtendedType(ExtendedType.StateOrProvince);
                            if (descriptor.geography.place)
                                return ValueType.fromExtendedType(ExtendedType.Place);
                            if (descriptor.geography.latitude)
                                return ValueType.fromExtendedType(ExtendedType.Latitude_Double);
                            if (descriptor.geography.longitude)
                                return ValueType.fromExtendedType(ExtendedType.Longitude_Double);
                        }
                        if (descriptor.misc) {
                            if (descriptor.misc.image)
                                return ValueType.fromExtendedType(ExtendedType.Image);
                            if (descriptor.misc.imageUrl)
                                return ValueType.fromExtendedType(ExtendedType.ImageUrl);
                            if (descriptor.misc.webUrl)
                                return ValueType.fromExtendedType(ExtendedType.WebUrl);
                            if (descriptor.misc.barcode)
                                return ValueType.fromExtendedType(ExtendedType.Barcode_Text);
                        }
                        if (descriptor.formatting) {
                            if (descriptor.formatting.color)
                                return ValueType.fromExtendedType(ExtendedType.Color);
                            if (descriptor.formatting.formatString)
                                return ValueType.fromExtendedType(ExtendedType.FormatString);
                            if (descriptor.formatting.alignment)
                                return ValueType.fromExtendedType(ExtendedType.Alignment);
                            if (descriptor.formatting.labelDisplayUnits)
                                return ValueType.fromExtendedType(ExtendedType.LabelDisplayUnits);
                            if (descriptor.formatting.fontSize)
                                return ValueType.fromExtendedType(ExtendedType.FontSize);
                            if (descriptor.formatting.labelDensity)
                                return ValueType.fromExtendedType(ExtendedType.LabelDensity);
                        }
                        if (descriptor.extendedType) {
                            return ValueType.fromExtendedType(descriptor.extendedType);
                        }
                        if (descriptor.operations) {
                            if (descriptor.operations.searchEnabled)
                                return ValueType.fromExtendedType(ExtendedType.SearchEnabled);
                        }
                        if (descriptor.variant) {
                            var variantTypes = descriptor.variant.map(function (variantType) { return ValueType.fromDescriptor(variantType); });
                            return ValueType.fromVariant(variantTypes);
                        }
                        return ValueType.fromExtendedType(ExtendedType.Null);
                    };
                    /** Advanced: Generally use fromDescriptor instead. Creates or retrieves a ValueType object for the specified ExtendedType. */
                    ValueType.fromExtendedType = function (extendedType) {
                        extendedType = extendedType || ExtendedType.Null;
                        var primitiveType = getPrimitiveType(extendedType), category = getCategoryFromExtendedType(extendedType);
                        return ValueType.fromPrimitiveTypeAndCategory(primitiveType, category);
                    };
                    /** Creates or retrieves a ValueType object for the specified PrimitiveType and data category. */
                    ValueType.fromPrimitiveTypeAndCategory = function (primitiveType, category) {
                        primitiveType = primitiveType || PrimitiveType.Null;
                        category = category || null;
                        var id = primitiveType.toString();
                        if (category)
                            id += "|" + category;
                        return ValueType.typeCache[id] || (ValueType.typeCache[id] = new ValueType(toExtendedType(primitiveType, category), category));
                    };
                    /** Creates a ValueType to describe the given IEnumType. */
                    ValueType.fromEnum = function (enumType) {
                        return new ValueType(ExtendedType.Enumeration, null, enumType);
                    };
                    /** Creates a ValueType to describe the given Variant type. */
                    ValueType.fromVariant = function (variantTypes) {
                        return new ValueType(ExtendedType.Variant, /* category */ null, /* enumType */ null, variantTypes);
                    };
                    /** Determines if the specified type is compatible from at least one of the otherTypes. */
                    ValueType.isCompatibleTo = function (typeDescriptor, otherTypes) {
                        var valueType = ValueType.fromDescriptor(typeDescriptor);
                        for (var _i = 0, otherTypes_1 = otherTypes; _i < otherTypes_1.length; _i++) {
                            var otherType = otherTypes_1[_i];
                            var otherValueType = ValueType.fromDescriptor(otherType);
                            if (otherValueType.isCompatibleFrom(valueType))
                                return true;
                        }
                        return false;
                    };
                    /** Determines if the instance ValueType is convertable from the 'other' ValueType. */
                    ValueType.prototype.isCompatibleFrom = function (other) {
                        var otherPrimitiveType = other.primitiveType;
                        if (this === other ||
                            this.primitiveType === otherPrimitiveType ||
                            otherPrimitiveType === PrimitiveType.Null ||
                            // Return true if both types are numbers
                            (this.numeric && other.numeric))
                            return true;
                        return false;
                    };
                    /**
                     * Determines if the instance ValueType is equal to the 'other' ValueType
                     * @param {ValueType} other the other ValueType to check equality against
                     * @returns True if the instance ValueType is equal to the 'other' ValueType
                     */
                    ValueType.prototype.equals = function (other) {
                        return type.JsonComparer.equals(this, other);
                    };
                    Object.defineProperty(ValueType.prototype, "primitiveType", {
                        /** Gets the exact primitive type of this ValueType. */
                        get: function () {
                            return getPrimitiveType(this.underlyingType);
                        },
                        enumerable: true,
                        configurable: true
                    });
                    Object.defineProperty(ValueType.prototype, "extendedType", {
                        /** Gets the exact extended type of this ValueType. */
                        get: function () {
                            return this.underlyingType;
                        },
                        enumerable: true,
                        configurable: true
                    });
                    Object.defineProperty(ValueType.prototype, "categoryString", {
                        /** Gets the data category string (if any) for this ValueType. */
                        get: function () {
                            return this.category;
                        },
                        enumerable: true,
                        configurable: true
                    });
                    Object.defineProperty(ValueType.prototype, "text", {
                        // Simplified primitive types
                        /** Indicates whether the type represents text values. */
                        get: function () {
                            return this.primitiveType === PrimitiveType.Text;
                        },
                        enumerable: true,
                        configurable: true
                    });
                    Object.defineProperty(ValueType.prototype, "numeric", {
                        /** Indicates whether the type represents any numeric value. */
                        get: function () {
                            return EnumExtensions.hasFlag(this.underlyingType, ExtendedType.Numeric);
                        },
                        enumerable: true,
                        configurable: true
                    });
                    Object.defineProperty(ValueType.prototype, "integer", {
                        /** Indicates whether the type represents integer numeric values. */
                        get: function () {
                            return this.primitiveType === PrimitiveType.Integer;
                        },
                        enumerable: true,
                        configurable: true
                    });
                    Object.defineProperty(ValueType.prototype, "bool", {
                        /** Indicates whether the type represents Boolean values. */
                        get: function () {
                            return this.primitiveType === PrimitiveType.Boolean;
                        },
                        enumerable: true,
                        configurable: true
                    });
                    Object.defineProperty(ValueType.prototype, "dateTime", {
                        /** Indicates whether the type represents any date/time values. */
                        get: function () {
                            return this.primitiveType === PrimitiveType.DateTime ||
                                this.primitiveType === PrimitiveType.Date ||
                                this.primitiveType === PrimitiveType.Time;
                        },
                        enumerable: true,
                        configurable: true
                    });
                    Object.defineProperty(ValueType.prototype, "duration", {
                        /** Indicates whether the type represents duration values. */
                        get: function () {
                            return this.primitiveType === PrimitiveType.Duration;
                        },
                        enumerable: true,
                        configurable: true
                    });
                    Object.defineProperty(ValueType.prototype, "binary", {
                        /** Indicates whether the type represents binary values. */
                        get: function () {
                            return this.primitiveType === PrimitiveType.Binary;
                        },
                        enumerable: true,
                        configurable: true
                    });
                    Object.defineProperty(ValueType.prototype, "none", {
                        /** Indicates whether the type represents none values. */
                        get: function () {
                            return this.primitiveType === PrimitiveType.None;
                        },
                        enumerable: true,
                        configurable: true
                    });
                    Object.defineProperty(ValueType.prototype, "temporal", {
                        // Extended types
                        /** Returns an object describing temporal values represented by the type, if it represents a temporal type. */
                        get: function () {
                            return this.temporalType;
                        },
                        enumerable: true,
                        configurable: true
                    });
                    Object.defineProperty(ValueType.prototype, "geography", {
                        /** Returns an object describing geographic values represented by the type, if it represents a geographic type. */
                        get: function () {
                            return this.geographyType;
                        },
                        enumerable: true,
                        configurable: true
                    });
                    Object.defineProperty(ValueType.prototype, "misc", {
                        /** Returns an object describing the specific values represented by the type, if it represents a miscellaneous extended type. */
                        get: function () {
                            return this.miscType;
                        },
                        enumerable: true,
                        configurable: true
                    });
                    Object.defineProperty(ValueType.prototype, "formatting", {
                        /** Returns an object describing the formatting values represented by the type, if it represents a formatting type. */
                        get: function () {
                            return this.formattingType;
                        },
                        enumerable: true,
                        configurable: true
                    });
                    Object.defineProperty(ValueType.prototype, "enumeration", {
                        /** Returns an object describing the enum values represented by the type, if it represents an enumeration type. */
                        get: function () {
                            return this.enumType;
                        },
                        enumerable: true,
                        configurable: true
                    });
                    Object.defineProperty(ValueType.prototype, "scripting", {
                        get: function () {
                            return this.scriptingType;
                        },
                        enumerable: true,
                        configurable: true
                    });
                    Object.defineProperty(ValueType.prototype, "variant", {
                        /** Returns an array describing the variant values represented by the type, if it represents an Variant type. */
                        get: function () {
                            return this.variationTypes;
                        },
                        enumerable: true,
                        configurable: true
                    });
                    return ValueType;
                }());
                ValueType.typeCache = {};
                type.ValueType = ValueType;
                var ScriptType = (function () {
                    function ScriptType(underlyingType) {
                        this.underlyingType = underlyingType;
                    }
                    Object.defineProperty(ScriptType.prototype, "source", {
                        get: function () {
                            return matchesExtendedTypeWithAnyPrimitive(this.underlyingType, ExtendedType.ScriptSource);
                        },
                        enumerable: true,
                        configurable: true
                    });
                    return ScriptType;
                }());
                type.ScriptType = ScriptType;
                var TemporalType = (function () {
                    function TemporalType(underlyingType) {
                        this.underlyingType = underlyingType;
                    }
                    Object.defineProperty(TemporalType.prototype, "year", {
                        get: function () {
                            return matchesExtendedTypeWithAnyPrimitive(this.underlyingType, ExtendedType.Years);
                        },
                        enumerable: true,
                        configurable: true
                    });
                    Object.defineProperty(TemporalType.prototype, "quarter", {
                        get: function () {
                            return matchesExtendedTypeWithAnyPrimitive(this.underlyingType, ExtendedType.Quarters);
                        },
                        enumerable: true,
                        configurable: true
                    });
                    Object.defineProperty(TemporalType.prototype, "month", {
                        get: function () {
                            return matchesExtendedTypeWithAnyPrimitive(this.underlyingType, ExtendedType.Months);
                        },
                        enumerable: true,
                        configurable: true
                    });
                    Object.defineProperty(TemporalType.prototype, "day", {
                        get: function () {
                            return matchesExtendedTypeWithAnyPrimitive(this.underlyingType, ExtendedType.DayOfMonth);
                        },
                        enumerable: true,
                        configurable: true
                    });
                    Object.defineProperty(TemporalType.prototype, "paddedDateTableDate", {
                        get: function () {
                            return matchesExtendedTypeWithAnyPrimitive(this.underlyingType, ExtendedType.PaddedDateTableDates);
                        },
                        enumerable: true,
                        configurable: true
                    });
                    return TemporalType;
                }());
                type.TemporalType = TemporalType;
                var GeographyType = (function () {
                    function GeographyType(underlyingType) {
                        this.underlyingType = underlyingType;
                    }
                    Object.defineProperty(GeographyType.prototype, "address", {
                        get: function () {
                            return matchesExtendedTypeWithAnyPrimitive(this.underlyingType, ExtendedType.Address);
                        },
                        enumerable: true,
                        configurable: true
                    });
                    Object.defineProperty(GeographyType.prototype, "city", {
                        get: function () {
                            return matchesExtendedTypeWithAnyPrimitive(this.underlyingType, ExtendedType.City);
                        },
                        enumerable: true,
                        configurable: true
                    });
                    Object.defineProperty(GeographyType.prototype, "continent", {
                        get: function () {
                            return matchesExtendedTypeWithAnyPrimitive(this.underlyingType, ExtendedType.Continent);
                        },
                        enumerable: true,
                        configurable: true
                    });
                    Object.defineProperty(GeographyType.prototype, "country", {
                        get: function () {
                            return matchesExtendedTypeWithAnyPrimitive(this.underlyingType, ExtendedType.Country);
                        },
                        enumerable: true,
                        configurable: true
                    });
                    Object.defineProperty(GeographyType.prototype, "county", {
                        get: function () {
                            return matchesExtendedTypeWithAnyPrimitive(this.underlyingType, ExtendedType.County);
                        },
                        enumerable: true,
                        configurable: true
                    });
                    Object.defineProperty(GeographyType.prototype, "region", {
                        get: function () {
                            return matchesExtendedTypeWithAnyPrimitive(this.underlyingType, ExtendedType.Region);
                        },
                        enumerable: true,
                        configurable: true
                    });
                    Object.defineProperty(GeographyType.prototype, "postalCode", {
                        get: function () {
                            return matchesExtendedTypeWithAnyPrimitive(this.underlyingType, ExtendedType.PostalCode);
                        },
                        enumerable: true,
                        configurable: true
                    });
                    Object.defineProperty(GeographyType.prototype, "stateOrProvince", {
                        get: function () {
                            return matchesExtendedTypeWithAnyPrimitive(this.underlyingType, ExtendedType.StateOrProvince);
                        },
                        enumerable: true,
                        configurable: true
                    });
                    Object.defineProperty(GeographyType.prototype, "place", {
                        get: function () {
                            return matchesExtendedTypeWithAnyPrimitive(this.underlyingType, ExtendedType.Place);
                        },
                        enumerable: true,
                        configurable: true
                    });
                    Object.defineProperty(GeographyType.prototype, "latitude", {
                        get: function () {
                            return matchesExtendedTypeWithAnyPrimitive(this.underlyingType, ExtendedType.Latitude);
                        },
                        enumerable: true,
                        configurable: true
                    });
                    Object.defineProperty(GeographyType.prototype, "longitude", {
                        get: function () {
                            return matchesExtendedTypeWithAnyPrimitive(this.underlyingType, ExtendedType.Longitude);
                        },
                        enumerable: true,
                        configurable: true
                    });
                    return GeographyType;
                }());
                type.GeographyType = GeographyType;
                var MiscellaneousType = (function () {
                    function MiscellaneousType(underlyingType) {
                        this.underlyingType = underlyingType;
                    }
                    Object.defineProperty(MiscellaneousType.prototype, "image", {
                        get: function () {
                            return matchesExtendedTypeWithAnyPrimitive(this.underlyingType, ExtendedType.Image);
                        },
                        enumerable: true,
                        configurable: true
                    });
                    Object.defineProperty(MiscellaneousType.prototype, "imageUrl", {
                        get: function () {
                            return matchesExtendedTypeWithAnyPrimitive(this.underlyingType, ExtendedType.ImageUrl);
                        },
                        enumerable: true,
                        configurable: true
                    });
                    Object.defineProperty(MiscellaneousType.prototype, "webUrl", {
                        get: function () {
                            return matchesExtendedTypeWithAnyPrimitive(this.underlyingType, ExtendedType.WebUrl);
                        },
                        enumerable: true,
                        configurable: true
                    });
                    Object.defineProperty(MiscellaneousType.prototype, "barcode", {
                        get: function () {
                            return matchesExtendedTypeWithAnyPrimitive(this.underlyingType, ExtendedType.Barcode);
                        },
                        enumerable: true,
                        configurable: true
                    });
                    return MiscellaneousType;
                }());
                type.MiscellaneousType = MiscellaneousType;
                var FormattingType = (function () {
                    function FormattingType(underlyingType) {
                        this.underlyingType = underlyingType;
                    }
                    Object.defineProperty(FormattingType.prototype, "color", {
                        get: function () {
                            return matchesExtendedTypeWithAnyPrimitive(this.underlyingType, ExtendedType.Color);
                        },
                        enumerable: true,
                        configurable: true
                    });
                    Object.defineProperty(FormattingType.prototype, "formatString", {
                        get: function () {
                            return matchesExtendedTypeWithAnyPrimitive(this.underlyingType, ExtendedType.FormatString);
                        },
                        enumerable: true,
                        configurable: true
                    });
                    Object.defineProperty(FormattingType.prototype, "alignment", {
                        get: function () {
                            return matchesExtendedTypeWithAnyPrimitive(this.underlyingType, ExtendedType.Alignment);
                        },
                        enumerable: true,
                        configurable: true
                    });
                    Object.defineProperty(FormattingType.prototype, "labelDisplayUnits", {
                        get: function () {
                            return matchesExtendedTypeWithAnyPrimitive(this.underlyingType, ExtendedType.LabelDisplayUnits);
                        },
                        enumerable: true,
                        configurable: true
                    });
                    Object.defineProperty(FormattingType.prototype, "fontSize", {
                        get: function () {
                            return matchesExtendedTypeWithAnyPrimitive(this.underlyingType, ExtendedType.FontSize);
                        },
                        enumerable: true,
                        configurable: true
                    });
                    Object.defineProperty(FormattingType.prototype, "labelDensity", {
                        get: function () {
                            return matchesExtendedTypeWithAnyPrimitive(this.underlyingType, ExtendedType.LabelDensity);
                        },
                        enumerable: true,
                        configurable: true
                    });
                    return FormattingType;
                }());
                type.FormattingType = FormattingType;
                /** Defines primitive value types. Must be consistent with types defined by server conceptual schema. */
                var PrimitiveType;
                (function (PrimitiveType) {
                    PrimitiveType[PrimitiveType["Null"] = 0] = "Null";
                    PrimitiveType[PrimitiveType["Text"] = 1] = "Text";
                    PrimitiveType[PrimitiveType["Decimal"] = 2] = "Decimal";
                    PrimitiveType[PrimitiveType["Double"] = 3] = "Double";
                    PrimitiveType[PrimitiveType["Integer"] = 4] = "Integer";
                    PrimitiveType[PrimitiveType["Boolean"] = 5] = "Boolean";
                    PrimitiveType[PrimitiveType["Date"] = 6] = "Date";
                    PrimitiveType[PrimitiveType["DateTime"] = 7] = "DateTime";
                    PrimitiveType[PrimitiveType["DateTimeZone"] = 8] = "DateTimeZone";
                    PrimitiveType[PrimitiveType["Time"] = 9] = "Time";
                    PrimitiveType[PrimitiveType["Duration"] = 10] = "Duration";
                    PrimitiveType[PrimitiveType["Binary"] = 11] = "Binary";
                    PrimitiveType[PrimitiveType["None"] = 12] = "None";
                    PrimitiveType[PrimitiveType["Variant"] = 13] = "Variant";
                })(PrimitiveType = type.PrimitiveType || (type.PrimitiveType = {}));
                var PrimitiveTypeStrings;
                (function (PrimitiveTypeStrings) {
                    PrimitiveTypeStrings[PrimitiveTypeStrings["Null"] = 0] = "Null";
                    PrimitiveTypeStrings[PrimitiveTypeStrings["Text"] = 1] = "Text";
                    PrimitiveTypeStrings[PrimitiveTypeStrings["Decimal"] = 2] = "Decimal";
                    PrimitiveTypeStrings[PrimitiveTypeStrings["Double"] = 3] = "Double";
                    PrimitiveTypeStrings[PrimitiveTypeStrings["Integer"] = 4] = "Integer";
                    PrimitiveTypeStrings[PrimitiveTypeStrings["Boolean"] = 5] = "Boolean";
                    PrimitiveTypeStrings[PrimitiveTypeStrings["Date"] = 6] = "Date";
                    PrimitiveTypeStrings[PrimitiveTypeStrings["DateTime"] = 7] = "DateTime";
                    PrimitiveTypeStrings[PrimitiveTypeStrings["DateTimeZone"] = 8] = "DateTimeZone";
                    PrimitiveTypeStrings[PrimitiveTypeStrings["Time"] = 9] = "Time";
                    PrimitiveTypeStrings[PrimitiveTypeStrings["Duration"] = 10] = "Duration";
                    PrimitiveTypeStrings[PrimitiveTypeStrings["Binary"] = 11] = "Binary";
                    PrimitiveTypeStrings[PrimitiveTypeStrings["None"] = 12] = "None";
                    PrimitiveTypeStrings[PrimitiveTypeStrings["Variant"] = 13] = "Variant";
                })(PrimitiveTypeStrings || (PrimitiveTypeStrings = {}));
                /** Defines extended value types, which include primitive types and known data categories constrained to expected primitive types. */
                var ExtendedType;
                (function (ExtendedType) {
                    // Flags (1 << 8-15 range [0xFF00])
                    // Important: Enum members must be declared before they are used in TypeScript.
                    ExtendedType[ExtendedType["Numeric"] = 256] = "Numeric";
                    ExtendedType[ExtendedType["Temporal"] = 512] = "Temporal";
                    ExtendedType[ExtendedType["Geography"] = 1024] = "Geography";
                    ExtendedType[ExtendedType["Miscellaneous"] = 2048] = "Miscellaneous";
                    ExtendedType[ExtendedType["Formatting"] = 4096] = "Formatting";
                    ExtendedType[ExtendedType["Scripting"] = 8192] = "Scripting";
                    // Primitive types (0-255 range [0xFF] | flags)
                    // The member names and base values must match those in PrimitiveType.
                    ExtendedType[ExtendedType["Null"] = 0] = "Null";
                    ExtendedType[ExtendedType["Text"] = 1] = "Text";
                    ExtendedType[ExtendedType["Decimal"] = 258] = "Decimal";
                    ExtendedType[ExtendedType["Double"] = 259] = "Double";
                    ExtendedType[ExtendedType["Integer"] = 260] = "Integer";
                    ExtendedType[ExtendedType["Boolean"] = 5] = "Boolean";
                    ExtendedType[ExtendedType["Date"] = 518] = "Date";
                    ExtendedType[ExtendedType["DateTime"] = 519] = "DateTime";
                    ExtendedType[ExtendedType["DateTimeZone"] = 520] = "DateTimeZone";
                    ExtendedType[ExtendedType["Time"] = 521] = "Time";
                    ExtendedType[ExtendedType["Duration"] = 10] = "Duration";
                    ExtendedType[ExtendedType["Binary"] = 11] = "Binary";
                    ExtendedType[ExtendedType["None"] = 12] = "None";
                    ExtendedType[ExtendedType["Variant"] = 13] = "Variant";
                    // Extended types (0-32767 << 16 range [0xFFFF0000] | corresponding primitive type | flags)
                    // Temporal
                    ExtendedType[ExtendedType["Years"] = 66048] = "Years";
                    ExtendedType[ExtendedType["Years_Text"] = 66049] = "Years_Text";
                    ExtendedType[ExtendedType["Years_Integer"] = 66308] = "Years_Integer";
                    ExtendedType[ExtendedType["Years_Date"] = 66054] = "Years_Date";
                    ExtendedType[ExtendedType["Years_DateTime"] = 66055] = "Years_DateTime";
                    ExtendedType[ExtendedType["Months"] = 131584] = "Months";
                    ExtendedType[ExtendedType["Months_Text"] = 131585] = "Months_Text";
                    ExtendedType[ExtendedType["Months_Integer"] = 131844] = "Months_Integer";
                    ExtendedType[ExtendedType["Months_Date"] = 131590] = "Months_Date";
                    ExtendedType[ExtendedType["Months_DateTime"] = 131591] = "Months_DateTime";
                    ExtendedType[ExtendedType["PaddedDateTableDates"] = 197127] = "PaddedDateTableDates";
                    ExtendedType[ExtendedType["Quarters"] = 262656] = "Quarters";
                    ExtendedType[ExtendedType["Quarters_Text"] = 262657] = "Quarters_Text";
                    ExtendedType[ExtendedType["Quarters_Integer"] = 262916] = "Quarters_Integer";
                    ExtendedType[ExtendedType["Quarters_Date"] = 262662] = "Quarters_Date";
                    ExtendedType[ExtendedType["Quarters_DateTime"] = 262663] = "Quarters_DateTime";
                    ExtendedType[ExtendedType["DayOfMonth"] = 328192] = "DayOfMonth";
                    ExtendedType[ExtendedType["DayOfMonth_Text"] = 328193] = "DayOfMonth_Text";
                    ExtendedType[ExtendedType["DayOfMonth_Integer"] = 328452] = "DayOfMonth_Integer";
                    ExtendedType[ExtendedType["DayOfMonth_Date"] = 328198] = "DayOfMonth_Date";
                    ExtendedType[ExtendedType["DayOfMonth_DateTime"] = 328199] = "DayOfMonth_DateTime";
                    // Geography
                    ExtendedType[ExtendedType["Address"] = 6554625] = "Address";
                    ExtendedType[ExtendedType["City"] = 6620161] = "City";
                    ExtendedType[ExtendedType["Continent"] = 6685697] = "Continent";
                    ExtendedType[ExtendedType["Country"] = 6751233] = "Country";
                    ExtendedType[ExtendedType["County"] = 6816769] = "County";
                    ExtendedType[ExtendedType["Region"] = 6882305] = "Region";
                    ExtendedType[ExtendedType["PostalCode"] = 6947840] = "PostalCode";
                    ExtendedType[ExtendedType["PostalCode_Text"] = 6947841] = "PostalCode_Text";
                    ExtendedType[ExtendedType["PostalCode_Integer"] = 6948100] = "PostalCode_Integer";
                    ExtendedType[ExtendedType["StateOrProvince"] = 7013377] = "StateOrProvince";
                    ExtendedType[ExtendedType["Place"] = 7078913] = "Place";
                    ExtendedType[ExtendedType["Latitude"] = 7144448] = "Latitude";
                    ExtendedType[ExtendedType["Latitude_Decimal"] = 7144706] = "Latitude_Decimal";
                    ExtendedType[ExtendedType["Latitude_Double"] = 7144707] = "Latitude_Double";
                    ExtendedType[ExtendedType["Longitude"] = 7209984] = "Longitude";
                    ExtendedType[ExtendedType["Longitude_Decimal"] = 7210242] = "Longitude_Decimal";
                    ExtendedType[ExtendedType["Longitude_Double"] = 7210243] = "Longitude_Double";
                    // Miscellaneous
                    ExtendedType[ExtendedType["Image"] = 13109259] = "Image";
                    ExtendedType[ExtendedType["ImageUrl"] = 13174785] = "ImageUrl";
                    ExtendedType[ExtendedType["WebUrl"] = 13240321] = "WebUrl";
                    ExtendedType[ExtendedType["Barcode"] = 13305856] = "Barcode";
                    ExtendedType[ExtendedType["Barcode_Text"] = 13305857] = "Barcode_Text";
                    ExtendedType[ExtendedType["Barcode_Integer"] = 13306116] = "Barcode_Integer";
                    // Formatting
                    ExtendedType[ExtendedType["Color"] = 19664897] = "Color";
                    ExtendedType[ExtendedType["FormatString"] = 19730433] = "FormatString";
                    ExtendedType[ExtendedType["Alignment"] = 20058113] = "Alignment";
                    ExtendedType[ExtendedType["LabelDisplayUnits"] = 20123649] = "LabelDisplayUnits";
                    ExtendedType[ExtendedType["FontSize"] = 20189443] = "FontSize";
                    ExtendedType[ExtendedType["LabelDensity"] = 20254979] = "LabelDensity";
                    // Enumeration
                    ExtendedType[ExtendedType["Enumeration"] = 26214401] = "Enumeration";
                    // Scripting
                    ExtendedType[ExtendedType["ScriptSource"] = 32776193] = "ScriptSource";
                    // NOTE: To avoid confusion, underscores should be used only to delimit primitive type variants of an extended type
                    // (e.g. Year_Integer or Latitude_Double above)
                    // Operations
                    ExtendedType[ExtendedType["SearchEnabled"] = 65541] = "SearchEnabled";
                })(ExtendedType = type.ExtendedType || (type.ExtendedType = {}));
                var ExtendedTypeStrings;
                (function (ExtendedTypeStrings) {
                    ExtendedTypeStrings[ExtendedTypeStrings["Numeric"] = 256] = "Numeric";
                    ExtendedTypeStrings[ExtendedTypeStrings["Temporal"] = 512] = "Temporal";
                    ExtendedTypeStrings[ExtendedTypeStrings["Geography"] = 1024] = "Geography";
                    ExtendedTypeStrings[ExtendedTypeStrings["Miscellaneous"] = 2048] = "Miscellaneous";
                    ExtendedTypeStrings[ExtendedTypeStrings["Formatting"] = 4096] = "Formatting";
                    ExtendedTypeStrings[ExtendedTypeStrings["Scripting"] = 8192] = "Scripting";
                    ExtendedTypeStrings[ExtendedTypeStrings["Null"] = 0] = "Null";
                    ExtendedTypeStrings[ExtendedTypeStrings["Text"] = 1] = "Text";
                    ExtendedTypeStrings[ExtendedTypeStrings["Decimal"] = 258] = "Decimal";
                    ExtendedTypeStrings[ExtendedTypeStrings["Double"] = 259] = "Double";
                    ExtendedTypeStrings[ExtendedTypeStrings["Integer"] = 260] = "Integer";
                    ExtendedTypeStrings[ExtendedTypeStrings["Boolean"] = 5] = "Boolean";
                    ExtendedTypeStrings[ExtendedTypeStrings["Date"] = 518] = "Date";
                    ExtendedTypeStrings[ExtendedTypeStrings["DateTime"] = 519] = "DateTime";
                    ExtendedTypeStrings[ExtendedTypeStrings["DateTimeZone"] = 520] = "DateTimeZone";
                    ExtendedTypeStrings[ExtendedTypeStrings["Time"] = 521] = "Time";
                    ExtendedTypeStrings[ExtendedTypeStrings["Duration"] = 10] = "Duration";
                    ExtendedTypeStrings[ExtendedTypeStrings["Binary"] = 11] = "Binary";
                    ExtendedTypeStrings[ExtendedTypeStrings["None"] = 12] = "None";
                    ExtendedTypeStrings[ExtendedTypeStrings["Variant"] = 13] = "Variant";
                    ExtendedTypeStrings[ExtendedTypeStrings["Years"] = 66048] = "Years";
                    ExtendedTypeStrings[ExtendedTypeStrings["Years_Text"] = 66049] = "Years_Text";
                    ExtendedTypeStrings[ExtendedTypeStrings["Years_Integer"] = 66308] = "Years_Integer";
                    ExtendedTypeStrings[ExtendedTypeStrings["Years_Date"] = 66054] = "Years_Date";
                    ExtendedTypeStrings[ExtendedTypeStrings["Years_DateTime"] = 66055] = "Years_DateTime";
                    ExtendedTypeStrings[ExtendedTypeStrings["Months"] = 131584] = "Months";
                    ExtendedTypeStrings[ExtendedTypeStrings["Months_Text"] = 131585] = "Months_Text";
                    ExtendedTypeStrings[ExtendedTypeStrings["Months_Integer"] = 131844] = "Months_Integer";
                    ExtendedTypeStrings[ExtendedTypeStrings["Months_Date"] = 131590] = "Months_Date";
                    ExtendedTypeStrings[ExtendedTypeStrings["Months_DateTime"] = 131591] = "Months_DateTime";
                    ExtendedTypeStrings[ExtendedTypeStrings["PaddedDateTableDates"] = 197127] = "PaddedDateTableDates";
                    ExtendedTypeStrings[ExtendedTypeStrings["Quarters"] = 262656] = "Quarters";
                    ExtendedTypeStrings[ExtendedTypeStrings["Quarters_Text"] = 262657] = "Quarters_Text";
                    ExtendedTypeStrings[ExtendedTypeStrings["Quarters_Integer"] = 262916] = "Quarters_Integer";
                    ExtendedTypeStrings[ExtendedTypeStrings["Quarters_Date"] = 262662] = "Quarters_Date";
                    ExtendedTypeStrings[ExtendedTypeStrings["Quarters_DateTime"] = 262663] = "Quarters_DateTime";
                    ExtendedTypeStrings[ExtendedTypeStrings["DayOfMonth"] = 328192] = "DayOfMonth";
                    ExtendedTypeStrings[ExtendedTypeStrings["DayOfMonth_Text"] = 328193] = "DayOfMonth_Text";
                    ExtendedTypeStrings[ExtendedTypeStrings["DayOfMonth_Integer"] = 328452] = "DayOfMonth_Integer";
                    ExtendedTypeStrings[ExtendedTypeStrings["DayOfMonth_Date"] = 328198] = "DayOfMonth_Date";
                    ExtendedTypeStrings[ExtendedTypeStrings["DayOfMonth_DateTime"] = 328199] = "DayOfMonth_DateTime";
                    ExtendedTypeStrings[ExtendedTypeStrings["Address"] = 6554625] = "Address";
                    ExtendedTypeStrings[ExtendedTypeStrings["City"] = 6620161] = "City";
                    ExtendedTypeStrings[ExtendedTypeStrings["Continent"] = 6685697] = "Continent";
                    ExtendedTypeStrings[ExtendedTypeStrings["Country"] = 6751233] = "Country";
                    ExtendedTypeStrings[ExtendedTypeStrings["County"] = 6816769] = "County";
                    ExtendedTypeStrings[ExtendedTypeStrings["Region"] = 6882305] = "Region";
                    ExtendedTypeStrings[ExtendedTypeStrings["PostalCode"] = 6947840] = "PostalCode";
                    ExtendedTypeStrings[ExtendedTypeStrings["PostalCode_Text"] = 6947841] = "PostalCode_Text";
                    ExtendedTypeStrings[ExtendedTypeStrings["PostalCode_Integer"] = 6948100] = "PostalCode_Integer";
                    ExtendedTypeStrings[ExtendedTypeStrings["StateOrProvince"] = 7013377] = "StateOrProvince";
                    ExtendedTypeStrings[ExtendedTypeStrings["Place"] = 7078913] = "Place";
                    ExtendedTypeStrings[ExtendedTypeStrings["Latitude"] = 7144448] = "Latitude";
                    ExtendedTypeStrings[ExtendedTypeStrings["Latitude_Decimal"] = 7144706] = "Latitude_Decimal";
                    ExtendedTypeStrings[ExtendedTypeStrings["Latitude_Double"] = 7144707] = "Latitude_Double";
                    ExtendedTypeStrings[ExtendedTypeStrings["Longitude"] = 7209984] = "Longitude";
                    ExtendedTypeStrings[ExtendedTypeStrings["Longitude_Decimal"] = 7210242] = "Longitude_Decimal";
                    ExtendedTypeStrings[ExtendedTypeStrings["Longitude_Double"] = 7210243] = "Longitude_Double";
                    ExtendedTypeStrings[ExtendedTypeStrings["Image"] = 13109259] = "Image";
                    ExtendedTypeStrings[ExtendedTypeStrings["ImageUrl"] = 13174785] = "ImageUrl";
                    ExtendedTypeStrings[ExtendedTypeStrings["WebUrl"] = 13240321] = "WebUrl";
                    ExtendedTypeStrings[ExtendedTypeStrings["Barcode"] = 13305856] = "Barcode";
                    ExtendedTypeStrings[ExtendedTypeStrings["Barcode_Text"] = 13305857] = "Barcode_Text";
                    ExtendedTypeStrings[ExtendedTypeStrings["Barcode_Integer"] = 13306116] = "Barcode_Integer";
                    ExtendedTypeStrings[ExtendedTypeStrings["Color"] = 19664897] = "Color";
                    ExtendedTypeStrings[ExtendedTypeStrings["FormatString"] = 19730433] = "FormatString";
                    ExtendedTypeStrings[ExtendedTypeStrings["Alignment"] = 20058113] = "Alignment";
                    ExtendedTypeStrings[ExtendedTypeStrings["LabelDisplayUnits"] = 20123649] = "LabelDisplayUnits";
                    ExtendedTypeStrings[ExtendedTypeStrings["FontSize"] = 20189443] = "FontSize";
                    ExtendedTypeStrings[ExtendedTypeStrings["LabelDensity"] = 20254979] = "LabelDensity";
                    ExtendedTypeStrings[ExtendedTypeStrings["Enumeration"] = 26214401] = "Enumeration";
                    ExtendedTypeStrings[ExtendedTypeStrings["ScriptSource"] = 32776193] = "ScriptSource";
                    ExtendedTypeStrings[ExtendedTypeStrings["SearchEnabled"] = 65541] = "SearchEnabled";
                })(ExtendedTypeStrings || (ExtendedTypeStrings = {}));
                var PrimitiveTypeMask = 0xFF;
                var PrimitiveTypeWithFlagsMask = 0xFFFF;
                var PrimitiveTypeFlagsExcludedMask = 0xFFFF0000;
                function getPrimitiveType(extendedType) {
                    return extendedType & PrimitiveTypeMask;
                }
                function isPrimitiveType(extendedType) {
                    return (extendedType & PrimitiveTypeWithFlagsMask) === extendedType;
                }
                function getCategoryFromExtendedType(extendedType) {
                    if (isPrimitiveType(extendedType))
                        return null;
                    var category = ExtendedTypeStrings[extendedType];
                    if (category) {
                        // Check for ExtendedType declaration without a primitive type.
                        // If exists, use it as category (e.g. Longitude rather than Longitude_Double)
                        // Otherwise use the ExtendedType declaration with a primitive type (e.g. Address)
                        var delimIdx = category.lastIndexOf("_");
                        if (delimIdx > 0) {
                            var baseCategory = category.slice(0, delimIdx);
                            if (ExtendedTypeStrings[baseCategory]) {
                                category = baseCategory;
                            }
                        }
                    }
                    return category || null;
                }
                function toExtendedType(primitiveType, category) {
                    var primitiveString = PrimitiveTypeStrings[primitiveType];
                    var t = ExtendedTypeStrings[primitiveString];
                    if (t == null) {
                        t = ExtendedType.Null;
                    }
                    if (primitiveType && category) {
                        var categoryType = ExtendedTypeStrings[category];
                        if (categoryType) {
                            var categoryPrimitiveType = getPrimitiveType(categoryType);
                            if (categoryPrimitiveType === PrimitiveType.Null) {
                                // Category supports multiple primitive types, check if requested primitive type is supported
                                // (note: important to use t here rather than primitiveType as it may include primitive type flags)
                                categoryType = t | categoryType;
                                if (ExtendedTypeStrings[categoryType]) {
                                    t = categoryType;
                                }
                            }
                            else if (categoryPrimitiveType === primitiveType) {
                                // Primitive type matches the single supported type for the category
                                t = categoryType;
                            }
                        }
                    }
                    return t;
                }
                function matchesExtendedTypeWithAnyPrimitive(a, b) {
                    return (a & PrimitiveTypeFlagsExcludedMask) === (b & PrimitiveTypeFlagsExcludedMask);
                }
            })(type = utils.type || (utils.type = {}));
        })(utils = extensibility.utils || (extensibility.utils = {}));
    })(extensibility = powerbi.extensibility || (powerbi.extensibility = {}));
})(powerbi || (powerbi = {}));

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
// Custom implementation of Globalize from PowerView team
// The public implementation from https://github.com/borisyankov/DefinitelyTyped/tree/master/globalize doesn't work
"use strict";
/* tslint:disable:no-var-keyword */
var Globalize = Globalize || window["Globalize"];
/* tslint:enable */
/*
 *  Power BI Visualizations
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */
"use strict";
/*
 *  Power BI Visualizations
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */
"use strict";
var powerbi;
(function (powerbi) {
    var extensibility;
    (function (extensibility) {
        var utils;
        (function (utils) {
            var formatting;
            (function (formatting) {
                var LocalStorageService = (function () {
                    function LocalStorageService() {
                    }
                    LocalStorageService.prototype.getData = function (key) {
                        try {
                            if (localStorage) {
                                var value = localStorage[key];
                                if (value) {
                                    return JSON.parse(value);
                                }
                            }
                        }
                        catch (exception) { }
                        return null;
                    };
                    LocalStorageService.prototype.setData = function (key, data) {
                        try {
                            if (localStorage) {
                                localStorage[key] = JSON.stringify(data);
                            }
                        }
                        catch (e) { }
                    };
                    return LocalStorageService;
                }());
                formatting.LocalStorageService = LocalStorageService;
            })(formatting = utils.formatting || (utils.formatting = {}));
        })(utils = extensibility.utils || (extensibility.utils = {}));
    })(extensibility = powerbi.extensibility || (powerbi.extensibility = {}));
})(powerbi || (powerbi = {}));
/*
 *  Power BI Visualizations
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */
"use strict";
var powerbi;
(function (powerbi) {
    var extensibility;
    (function (extensibility) {
        var utils;
        (function (utils) {
            var formatting;
            (function (formatting) {
                var EphemeralStorageService = (function () {
                    function EphemeralStorageService(clearCacheInterval) {
                        this.cache = {};
                        this.clearCacheInterval = (clearCacheInterval != null)
                            ? clearCacheInterval
                            : EphemeralStorageService.defaultClearCacheInterval;
                        this.clearCache();
                    }
                    EphemeralStorageService.prototype.getData = function (key) {
                        return this.cache[key];
                    };
                    EphemeralStorageService.prototype.setData = function (key, data) {
                        var _this = this;
                        this.cache[key] = data;
                        if (this.clearCacheTimerId == null) {
                            this.clearCacheTimerId = setTimeout(function () { return _this.clearCache(); }, this.clearCacheInterval);
                        }
                    };
                    EphemeralStorageService.prototype.clearCache = function () {
                        this.cache = {};
                        this.clearCacheTimerId = undefined;
                    };
                    return EphemeralStorageService;
                }());
                EphemeralStorageService.defaultClearCacheInterval = (1000 * 60 * 60 * 24); // 1 day
                formatting.EphemeralStorageService = EphemeralStorageService;
                formatting.ephemeralStorageService = new EphemeralStorageService();
            })(formatting = utils.formatting || (utils.formatting = {}));
        })(utils = extensibility.utils || (extensibility.utils = {}));
    })(extensibility = powerbi.extensibility || (powerbi.extensibility = {}));
})(powerbi || (powerbi = {}));
/*
 *  Power BI Visualizations
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */
"use strict";
var powerbi;
(function (powerbi) {
    var extensibility;
    (function (extensibility) {
        var utils;
        (function (utils) {
            var formatting;
            (function (formatting) {
                /**
                 * Extensions to String class.
                 */
                var stringExtensions;
                (function (stringExtensions) {
                    var HtmlTagRegex = new RegExp("[<>]", "g");
                    /**
                     * Checks if a string ends with a sub-string.
                     */
                    function endsWith(str, suffix) {
                        return str.indexOf(suffix, str.length - suffix.length) !== -1;
                    }
                    stringExtensions.endsWith = endsWith;
                    function format() {
                        var args = [];
                        for (var _i = 0; _i < arguments.length; _i++) {
                            args[_i] = arguments[_i];
                        }
                        var s = args[0];
                        if (isNullOrUndefinedOrWhiteSpaceString(s))
                            return s;
                        for (var i = 0; i < args.length - 1; i++) {
                            var reg = new RegExp("\\{" + i + "\\}", "gm");
                            s = s.replace(reg, args[i + 1]);
                        }
                        return s;
                    }
                    stringExtensions.format = format;
                    /**
                     * Compares two strings for equality, ignoring case.
                     */
                    function equalIgnoreCase(a, b) {
                        return stringExtensions.normalizeCase(a) === stringExtensions.normalizeCase(b);
                    }
                    stringExtensions.equalIgnoreCase = equalIgnoreCase;
                    function startsWithIgnoreCase(a, b) {
                        var normalizedSearchString = stringExtensions.normalizeCase(b);
                        return stringExtensions.normalizeCase(a).indexOf(normalizedSearchString) === 0;
                    }
                    stringExtensions.startsWithIgnoreCase = startsWithIgnoreCase;
                    function startsWith(a, b) {
                        return a.indexOf(b) === 0;
                    }
                    stringExtensions.startsWith = startsWith;
                    /** Determines whether a string contains a specified substring (by case-sensitive comparison). */
                    function contains(source, substring) {
                        if (source == null)
                            return false;
                        return source.indexOf(substring) !== -1;
                    }
                    stringExtensions.contains = contains;
                    /** Determines whether a string contains a specified substring (while ignoring case). */
                    function containsIgnoreCase(source, substring) {
                        if (source == null)
                            return false;
                        return contains(normalizeCase(source), normalizeCase(substring));
                    }
                    stringExtensions.containsIgnoreCase = containsIgnoreCase;
                    /**
                     * Normalizes case for a string.
                     * Used by equalIgnoreCase method.
                     */
                    function normalizeCase(value) {
                        return value.toUpperCase();
                    }
                    stringExtensions.normalizeCase = normalizeCase;
                    /**
                     * Receives a string and returns an ArrayBuffer of its characters.
                     * @return An ArrayBuffer of the string's characters.
                     * If the string is empty or null or undefined - returns null.
                     */
                    function stringToArrayBuffer(str) {
                        if (isNullOrEmpty(str)) {
                            return null;
                        }
                        var buffer = new ArrayBuffer(str.length);
                        var bufferView = new Uint8Array(buffer);
                        for (var i = 0, strLen = str.length; i < strLen; i++) {
                            bufferView[i] = str.charCodeAt(i);
                        }
                        return bufferView;
                    }
                    stringExtensions.stringToArrayBuffer = stringToArrayBuffer;
                    /**
                     * Is string null or empty or undefined?
                     * @return True if the value is null or undefined or empty string,
                     * otherwise false.
                     */
                    function isNullOrEmpty(value) {
                        return (value == null) || (value.length === 0);
                    }
                    stringExtensions.isNullOrEmpty = isNullOrEmpty;
                    /**
                     * Returns true if the string is null, undefined, empty, or only includes white spaces.
                     * @return True if the str is null, undefined, empty, or only includes white spaces,
                     * otherwise false.
                     */
                    function isNullOrUndefinedOrWhiteSpaceString(str) {
                        return stringExtensions.isNullOrEmpty(str) || stringExtensions.isNullOrEmpty(str.trim());
                    }
                    stringExtensions.isNullOrUndefinedOrWhiteSpaceString = isNullOrUndefinedOrWhiteSpaceString;
                    /**
                     * Returns a value indicating whether the str contains any whitespace.
                     */
                    function containsWhitespace(str) {
                        var expr = /\s/;
                        return expr.test(str);
                    }
                    stringExtensions.containsWhitespace = containsWhitespace;
                    /**
                     * Returns a value indicating whether the str is a whitespace string.
                     */
                    function isWhitespace(str) {
                        return str.trim() === "";
                    }
                    stringExtensions.isWhitespace = isWhitespace;
                    /**
                     * Returns the string with any trailing whitespace from str removed.
                     */
                    function trimTrailingWhitespace(str) {
                        return str.replace(/\s+$/, "");
                    }
                    stringExtensions.trimTrailingWhitespace = trimTrailingWhitespace;
                    /**
                     * Returns the string with any leading and trailing whitespace from str removed.
                     */
                    function trimWhitespace(str) {
                        return str.replace(/^\s+/, "").replace(/\s+$/, "");
                    }
                    stringExtensions.trimWhitespace = trimWhitespace;
                    /**
                     * Returns length difference between the two provided strings.
                     */
                    function getLengthDifference(left, right) {
                        return Math.abs(left.length - right.length);
                    }
                    stringExtensions.getLengthDifference = getLengthDifference;
                    /**
                     * Repeat char or string several times.
                     * @param char The string to repeat.
                     * @param count How many times to repeat the string.
                     */
                    function repeat(char, count) {
                        var result = "";
                        for (var i = 0; i < count; i++) {
                            result += char;
                        }
                        return result;
                    }
                    stringExtensions.repeat = repeat;
                    /**
                     * Replace all the occurrences of the textToFind in the text with the textToReplace.
                     * @param text The original string.
                     * @param textToFind Text to find in the original string.
                     * @param textToReplace New text replacing the textToFind.
                     */
                    function replaceAll(text, textToFind, textToReplace) {
                        if (!textToFind)
                            return text;
                        var pattern = escapeStringForRegex(textToFind);
                        return text.replace(new RegExp(pattern, "gi"), textToReplace);
                    }
                    stringExtensions.replaceAll = replaceAll;
                    function ensureUniqueNames(names) {
                        var usedNames = {};
                        // Make sure we are giving fair chance for all columns to stay with their original name
                        // First we fill the used names map to contain all the original unique names from the list.
                        for (var _i = 0, names_1 = names; _i < names_1.length; _i++) {
                            var name_1 = names_1[_i];
                            usedNames[name_1] = false;
                        }
                        var uniqueNames = [];
                        // Now we go over all names and find a unique name for each
                        for (var _a = 0, names_2 = names; _a < names_2.length; _a++) {
                            var name_2 = names_2[_a];
                            var uniqueName = name_2;
                            // If the (original) column name is already taken lets try to find another name
                            if (usedNames[uniqueName]) {
                                var counter = 0;
                                // Find a name that is not already in the map
                                while (usedNames[uniqueName] !== undefined) {
                                    uniqueName = name_2 + "." + (++counter);
                                }
                            }
                            uniqueNames.push(uniqueName);
                            usedNames[uniqueName] = true;
                        }
                        return uniqueNames;
                    }
                    stringExtensions.ensureUniqueNames = ensureUniqueNames;
                    /**
                     * Returns a name that is not specified in the values.
                     */
                    function findUniqueName(usedNames, baseName) {
                        // Find a unique name
                        var i = 0, uniqueName = baseName;
                        while (usedNames[uniqueName]) {
                            uniqueName = baseName + (++i);
                        }
                        return uniqueName;
                    }
                    stringExtensions.findUniqueName = findUniqueName;
                    function constructNameFromList(list, separator, maxCharacter) {
                        var labels = [];
                        var exceeded;
                        var length = 0;
                        for (var _i = 0, list_1 = list; _i < list_1.length; _i++) {
                            var item = list_1[_i];
                            if (length + item.length > maxCharacter && labels.length > 0) {
                                exceeded = true;
                                break;
                            }
                            labels.push(item);
                            length += item.length;
                        }
                        var separatorWithSpace = " " + separator + " ";
                        var name = labels.join(separatorWithSpace);
                        if (exceeded)
                            name += separatorWithSpace + "...";
                        return name;
                    }
                    stringExtensions.constructNameFromList = constructNameFromList;
                    function escapeStringForRegex(s) {
                        return s.replace(/([-()\[\]{}+?*.$\^|,:#<!\\])/g, "\\$1");
                    }
                    stringExtensions.escapeStringForRegex = escapeStringForRegex;
                    /**
                     * Remove file name reserved characters <>:"/\|?* from input string.
                     */
                    function normalizeFileName(fileName) {
                        return fileName.replace(/[\<\>\:"\/\\\|\?*]/g, "");
                    }
                    stringExtensions.normalizeFileName = normalizeFileName;
                    /**
                     * Similar to JSON.stringify, but strips away escape sequences so that the resulting
                     * string is human-readable (and parsable by JSON formatting/validating tools).
                     */
                    function stringifyAsPrettyJSON(object) {
                        // let specialCharacterRemover = (key: string, value: string) => value.replace(/[^\w\s]/gi, "");
                        return JSON.stringify(object /*, specialCharacterRemover*/);
                    }
                    stringExtensions.stringifyAsPrettyJSON = stringifyAsPrettyJSON;
                    /**
                     * Derive a CLS-compliant name from a specified string.  If no allowed characters are present, return a fallback string instead.
                     * TODO (6708134): this should have a fully Unicode-aware implementation
                     */
                    function deriveClsCompliantName(input, fallback) {
                        var result = input.replace(/^[^A-Za-z]*/g, "").replace(/[ :\.\/\\\-\u00a0\u1680\u180e\u2000-\u200a\u2028\u2029\u202f\u205f\u3000]/g, "_").replace(/[\W]/g, "");
                        return result.length > 0 ? result : fallback;
                    }
                    stringExtensions.deriveClsCompliantName = deriveClsCompliantName;
                    /** Performs cheap sanitization by stripping away HTML tag (<>) characters. */
                    function stripTagDelimiters(s) {
                        return s.replace(HtmlTagRegex, "");
                    }
                    stringExtensions.stripTagDelimiters = stripTagDelimiters;
                })(stringExtensions = formatting.stringExtensions || (formatting.stringExtensions = {}));
            })(formatting = utils.formatting || (utils.formatting = {}));
        })(utils = extensibility.utils || (extensibility.utils = {}));
    })(extensibility = powerbi.extensibility || (powerbi.extensibility = {}));
})(powerbi || (powerbi = {}));
/*
 *  Power BI Visualizations
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */
"use strict";
var powerbi;
(function (powerbi) {
    var extensibility;
    (function (extensibility) {
        var utils;
        (function (utils) {
            var formatting;
            (function (formatting) {
                var wordBreaker;
                (function (wordBreaker) {
                    var SPACE = " ";
                    var BREAKERS_REGEX = /[\s\n]+/g;
                    function search(index, content, backward) {
                        if (backward) {
                            for (var i = index - 1; i > -1; i--) {
                                if (hasBreakers(content[i]))
                                    return i + 1;
                            }
                        }
                        else {
                            for (var i = index, ilen = content.length; i < ilen; i++) {
                                if (hasBreakers(content[i]))
                                    return i;
                            }
                        }
                        return backward ? 0 : content.length;
                    }
                    /**
                     * Find the word nearest the cursor specified within content
                     * @param index - point within content to search forward/backward from
                     * @param content - string to search
                    */
                    function find(index, content) {
                        var result = { start: 0, end: 0 };
                        if (content.length === 0) {
                            return result;
                        }
                        result.start = search(index, content, true);
                        result.end = search(index, content, false);
                        return result;
                    }
                    wordBreaker.find = find;
                    /**
                     * Test for presence of breakers within content
                     * @param content - string to test
                    */
                    function hasBreakers(content) {
                        BREAKERS_REGEX.lastIndex = 0;
                        return BREAKERS_REGEX.test(content);
                    }
                    wordBreaker.hasBreakers = hasBreakers;
                    /**
                     * Count the number of pieces when broken by BREAKERS_REGEX
                     * ~2.7x faster than WordBreaker.split(content).length
                     * @param content - string to break and count
                    */
                    function wordCount(content) {
                        var count = 1;
                        BREAKERS_REGEX.lastIndex = 0;
                        BREAKERS_REGEX.exec(content);
                        while (BREAKERS_REGEX.lastIndex !== 0) {
                            count++;
                            BREAKERS_REGEX.exec(content);
                        }
                        return count;
                    }
                    wordBreaker.wordCount = wordCount;
                    function getMaxWordWidth(content, textWidthMeasurer, properties) {
                        var words = split(content);
                        var maxWidth = 0;
                        for (var _i = 0, words_1 = words; _i < words_1.length; _i++) {
                            var w = words_1[_i];
                            properties.text = w;
                            maxWidth = Math.max(maxWidth, textWidthMeasurer(properties));
                        }
                        return maxWidth;
                    }
                    wordBreaker.getMaxWordWidth = getMaxWordWidth;
                    function split(content) {
                        return content.split(BREAKERS_REGEX);
                    }
                    function getWidth(content, properties, textWidthMeasurer) {
                        properties.text = content;
                        return textWidthMeasurer(properties);
                    }
                    function truncate(content, properties, truncator, maxWidth) {
                        properties.text = content;
                        return truncator(properties, maxWidth);
                    }
                    /**
                     * Split content by breakers (words) and greedy fit as many words
                     * into each index in the result based on max width and number of lines
                     * e.g. Each index in result corresponds to a line of content
                     *      when used by AxisHelper.LabelLayoutStrategy.wordBreak
                     * @param content - string to split
                     * @param properties - text properties to be used by @param:textWidthMeasurer
                     * @param textWidthMeasurer - function to calculate width of given text content
                     * @param maxWidth - maximum allowed width of text content in each result
                     * @param maxNumLines - maximum number of results we will allow, valid values must be greater than 0
                     * @param truncator - (optional) if specified, used as a function to truncate content to a given width
                    */
                    function splitByWidth(content, properties, textWidthMeasurer, maxWidth, maxNumLines, truncator) {
                        // Default truncator returns string as-is
                        truncator = truncator ? truncator : function (properties, maxWidth) { return properties.text; };
                        var result = [];
                        var words = split(content);
                        var usedWidth = 0;
                        var wordsInLine = [];
                        for (var _i = 0, words_2 = words; _i < words_2.length; _i++) {
                            var word = words_2[_i];
                            // Last line? Just add whatever is left
                            if ((maxNumLines > 0) && (result.length >= maxNumLines - 1)) {
                                wordsInLine.push(word);
                                continue;
                            }
                            // Determine width if we add this word
                            // Account for SPACE we will add when joining...
                            var wordWidth = wordsInLine.length === 0
                                ? getWidth(word, properties, textWidthMeasurer)
                                : getWidth(SPACE + word, properties, textWidthMeasurer);
                            // If width would exceed max width,
                            // then push used words and start new split result
                            if (usedWidth + wordWidth > maxWidth) {
                                // Word alone exceeds max width, just add it.
                                if (wordsInLine.length === 0) {
                                    result.push(truncate(word, properties, truncator, maxWidth));
                                    usedWidth = 0;
                                    wordsInLine = [];
                                    continue;
                                }
                                result.push(truncate(wordsInLine.join(SPACE), properties, truncator, maxWidth));
                                usedWidth = 0;
                                wordsInLine = [];
                            }
                            // ...otherwise, add word and continue
                            wordsInLine.push(word);
                            usedWidth += wordWidth;
                        }
                        // Push remaining words onto result (if any)
                        if (wordsInLine && wordsInLine.length) {
                            result.push(truncate(wordsInLine.join(SPACE), properties, truncator, maxWidth));
                        }
                        return result;
                    }
                    wordBreaker.splitByWidth = splitByWidth;
                })(wordBreaker = formatting.wordBreaker || (formatting.wordBreaker = {}));
            })(formatting = utils.formatting || (utils.formatting = {}));
        })(utils = extensibility.utils || (extensibility.utils = {}));
    })(extensibility = powerbi.extensibility || (powerbi.extensibility = {}));
})(powerbi || (powerbi = {}));
/*
 *  Power BI Visualizations
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */
"use strict";
var powerbi;
(function (powerbi) {
    var extensibility;
    (function (extensibility) {
        var utils;
        (function (utils) {
            var formatting;
            (function (formatting) {
                /** Enumeration of DateTimeUnits */
                var DateTimeUnit;
                (function (DateTimeUnit) {
                    DateTimeUnit[DateTimeUnit["Year"] = 0] = "Year";
                    DateTimeUnit[DateTimeUnit["Month"] = 1] = "Month";
                    DateTimeUnit[DateTimeUnit["Week"] = 2] = "Week";
                    DateTimeUnit[DateTimeUnit["Day"] = 3] = "Day";
                    DateTimeUnit[DateTimeUnit["Hour"] = 4] = "Hour";
                    DateTimeUnit[DateTimeUnit["Minute"] = 5] = "Minute";
                    DateTimeUnit[DateTimeUnit["Second"] = 6] = "Second";
                    DateTimeUnit[DateTimeUnit["Millisecond"] = 7] = "Millisecond";
                })(DateTimeUnit = formatting.DateTimeUnit || (formatting.DateTimeUnit = {}));
            })(formatting = utils.formatting || (utils.formatting = {}));
        })(utils = extensibility.utils || (extensibility.utils = {}));
    })(extensibility = powerbi.extensibility || (powerbi.extensibility = {}));
})(powerbi || (powerbi = {}));
/*
 *  Power BI Visualizations
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */
"use strict";
var powerbi;
(function (powerbi) {
    var extensibility;
    (function (extensibility) {
        var utils;
        (function (utils) {
            var formatting;
            (function (formatting) {
                // powerbi.extensibility.utils.type
                var PixelConverter = powerbi.extensibility.utils.type.PixelConverter;
                var Prototype = powerbi.extensibility.utils.type.Prototype;
                // powerbi.extensibility.utils.formatting
                var wordBreaker = powerbi.extensibility.utils.formatting.wordBreaker;
                var textMeasurementService;
                (function (textMeasurementService) {
                    var ellipsis = "...";
                    var spanElement;
                    var svgTextElement;
                    var canvasCtx;
                    var fallbackFontFamily;
                    /**
                     * Idempotent function for adding the elements to the DOM.
                     */
                    function ensureDOM() {
                        if (spanElement) {
                            return;
                        }
                        spanElement = document.createElement("span");
                        document.body.appendChild(spanElement);
                        // The style hides the svg element from the canvas, preventing canvas from scrolling down to show svg black square.
                        var svgElement = document.createElementNS("http://www.w3.org/2000/svg", "svg");
                        svgElement.setAttribute("height", "0");
                        svgElement.setAttribute("width", "0");
                        svgElement.setAttribute("position", "absolute");
                        svgTextElement = document.createElementNS("http://www.w3.org/2000/svg", "text");
                        svgElement.appendChild(svgTextElement);
                        document.body.appendChild(svgElement);
                        var canvasElement = document.createElement("canvas");
                        canvasCtx = canvasElement.getContext("2d");
                        var style = window.getComputedStyle(svgTextElement);
                        if (style) {
                            fallbackFontFamily = style.fontFamily;
                        }
                        else {
                            fallbackFontFamily = "";
                        }
                    }
                    /**
                     * Removes spanElement from DOM.
                     */
                    function removeSpanElement() {
                        if (spanElement && spanElement.remove) {
                            spanElement.remove();
                        }
                        spanElement = null;
                    }
                    textMeasurementService.removeSpanElement = removeSpanElement;
                    /**
                     * This method measures the width of the text with the given SVG text properties.
                     * @param textProperties The text properties to use for text measurement.
                     * @param text The text to measure.
                     */
                    function measureSvgTextWidth(textProperties, text) {
                        ensureDOM();
                        canvasCtx.font =
                            (textProperties.fontStyle || "") + " " +
                                (textProperties.fontVariant || "") + " " +
                                (textProperties.fontWeight || "") + " " +
                                textProperties.fontSize + " " +
                                (textProperties.fontFamily || fallbackFontFamily);
                        return canvasCtx.measureText(text || textProperties.text).width;
                    }
                    textMeasurementService.measureSvgTextWidth = measureSvgTextWidth;
                    /**
                     * This method return the rect with the given SVG text properties.
                     * @param textProperties The text properties to use for text measurement.
                     * @param text The text to measure.
                     */
                    function measureSvgTextRect(textProperties, text) {
                        ensureDOM();
                        svgTextElement.setAttribute("style", null);
                        svgTextElement.style.visibility = "hidden";
                        svgTextElement.style.fontFamily = textProperties.fontFamily || fallbackFontFamily;
                        svgTextElement.style.fontVariant = textProperties.fontVariant;
                        svgTextElement.style.fontSize = textProperties.fontSize;
                        svgTextElement.style.fontWeight = textProperties.fontWeight;
                        svgTextElement.style.fontStyle = textProperties.fontStyle;
                        svgTextElement.style.whiteSpace = textProperties.whiteSpace || "nowrap";
                        svgTextElement.appendChild(document.createTextNode(text || textProperties.text));
                        // We're expecting the browser to give a synchronous measurement here
                        // We're using SVGTextElement because it works across all browsers
                        return svgTextElement.getBBox();
                    }
                    textMeasurementService.measureSvgTextRect = measureSvgTextRect;
                    /**
                     * This method measures the height of the text with the given SVG text properties.
                     * @param textProperties The text properties to use for text measurement.
                     * @param text The text to measure.
                     */
                    function measureSvgTextHeight(textProperties, text) {
                        return measureSvgTextRect(textProperties, text).height;
                    }
                    textMeasurementService.measureSvgTextHeight = measureSvgTextHeight;
                    /**
                     * This method returns the text Rect with the given SVG text properties.
                     * Does NOT return text width; obliterates text value
                     * @param {TextProperties} textProperties - The text properties to use for text measurement
                     */
                    function estimateSvgTextRect(textProperties) {
                        var propertiesKey = textProperties.fontFamily + textProperties.fontSize;
                        var rect = formatting.ephemeralStorageService.getData(propertiesKey);
                        if (rect == null) {
                            // To estimate we check the height of a particular character, once it is cached, subsequent
                            // calls should always get the height from the cache (regardless of the text).
                            var estimatedTextProperties = {
                                fontFamily: textProperties.fontFamily,
                                fontSize: textProperties.fontSize,
                                text: "M",
                            };
                            rect = textMeasurementService.measureSvgTextRect(estimatedTextProperties);
                            // NOTE: In some cases (disconnected/hidden DOM) we may provide incorrect measurement results (zero sized bounding-box), so
                            // we only store values in the cache if we are confident they are correct.
                            if (rect.height > 0)
                                formatting.ephemeralStorageService.setData(propertiesKey, rect);
                        }
                        return rect;
                    }
                    /**
                     * This method returns the text Rect with the given SVG text properties.
                     * @param {TextProperties} textProperties - The text properties to use for text measurement
                     */
                    function estimateSvgTextBaselineDelta(textProperties) {
                        var rect = estimateSvgTextRect(textProperties);
                        return rect.y + rect.height;
                    }
                    textMeasurementService.estimateSvgTextBaselineDelta = estimateSvgTextBaselineDelta;
                    /**
                     * This method estimates the height of the text with the given SVG text properties.
                     * @param {TextProperties} textProperties - The text properties to use for text measurement
                     */
                    function estimateSvgTextHeight(textProperties, tightFightForNumeric) {
                        if (tightFightForNumeric === void 0) { tightFightForNumeric = false; }
                        var height = estimateSvgTextRect(textProperties).height;
                        // TODO: replace it with new baseline calculation
                        if (tightFightForNumeric)
                            height *= 0.7;
                        return height;
                    }
                    textMeasurementService.estimateSvgTextHeight = estimateSvgTextHeight;
                    /**
                     * This method measures the width of the svgElement.
                     * @param svgElement The SVGTextElement to be measured.
                     */
                    function measureSvgTextElementWidth(svgElement) {
                        return measureSvgTextWidth(getSvgMeasurementProperties(svgElement));
                    }
                    textMeasurementService.measureSvgTextElementWidth = measureSvgTextElementWidth;
                    /**
                     * This method fetches the text measurement properties of the given DOM element.
                     * @param element The selector for the DOM Element.
                     */
                    function getMeasurementProperties(element) {
                        var style = window.getComputedStyle(element);
                        return {
                            text: element.value || element.textContent,
                            fontFamily: style.fontFamily,
                            fontSize: style.fontSize,
                            fontWeight: style.fontWeight,
                            fontStyle: style.fontStyle,
                            fontVariant: style.fontVariant,
                            whiteSpace: style.whiteSpace
                        };
                    }
                    textMeasurementService.getMeasurementProperties = getMeasurementProperties;
                    /**
                     * This method fetches the text measurement properties of the given SVG text element.
                     * @param element The SVGTextElement to be measured.
                     */
                    function getSvgMeasurementProperties(element) {
                        var style = window.getComputedStyle(element);
                        if (style) {
                            return {
                                text: element.textContent,
                                fontFamily: style.fontFamily,
                                fontSize: style.fontSize,
                                fontWeight: style.fontWeight,
                                fontStyle: style.fontStyle,
                                fontVariant: style.fontVariant,
                                whiteSpace: style.whiteSpace
                            };
                        }
                        else {
                            return {
                                text: element.textContent,
                                fontFamily: "",
                                fontSize: "0",
                            };
                        }
                    }
                    textMeasurementService.getSvgMeasurementProperties = getSvgMeasurementProperties;
                    /**
                     * This method returns the width of a div element.
                     * @param element The div element.
                     */
                    function getDivElementWidth(element) {
                        var style = window.getComputedStyle(element);
                        if (style)
                            return style.width;
                        else
                            return "0";
                    }
                    textMeasurementService.getDivElementWidth = getDivElementWidth;
                    /**
                     * Compares labels text size to the available size and renders ellipses when the available size is smaller.
                     * @param textProperties The text properties (including text content) to use for text measurement.
                     * @param maxWidth The maximum width available for rendering the text.
                     */
                    function getTailoredTextOrDefault(textProperties, maxWidth) {
                        ensureDOM();
                        var strLength = textProperties.text.length;
                        if (strLength === 0) {
                            return textProperties.text;
                        }
                        var width = measureSvgTextWidth(textProperties);
                        if (width < maxWidth) {
                            return textProperties.text;
                        }
                        // Create a copy of the textProperties so we don't modify the one that's passed in.
                        var copiedTextProperties = Prototype.inherit(textProperties);
                        // Take the properties and apply them to svgTextElement
                        // Then, do the binary search to figure out the substring we want
                        // Set the substring on textElement argument
                        var text = copiedTextProperties.text = ellipsis + copiedTextProperties.text;
                        var min = 1;
                        var max = text.length;
                        var i = ellipsis.length;
                        while (min <= max) {
                            // num | 0 prefered to Math.floor(num) for performance benefits
                            i = (min + max) / 2 | 0;
                            copiedTextProperties.text = text.substr(0, i);
                            width = measureSvgTextWidth(copiedTextProperties);
                            if (maxWidth > width) {
                                min = i + 1;
                            }
                            else if (maxWidth < width) {
                                max = i - 1;
                            }
                            else {
                                break;
                            }
                        }
                        // Since the search algorithm almost never finds an exact match,
                        // it will pick one of the closest two, which could result in a
                        // value bigger with than 'maxWidth' thus we need to go back by
                        // one to guarantee a smaller width than 'maxWidth'.
                        copiedTextProperties.text = text.substr(0, i);
                        width = measureSvgTextWidth(copiedTextProperties);
                        if (width > maxWidth) {
                            i--;
                        }
                        return text.substr(ellipsis.length, i - ellipsis.length) + ellipsis;
                    }
                    textMeasurementService.getTailoredTextOrDefault = getTailoredTextOrDefault;
                    /**
                     * Compares labels text size to the available size and renders ellipses when the available size is smaller.
                     * @param textElement The SVGTextElement containing the text to render.
                     * @param maxWidth The maximum width available for rendering the text.
                     */
                    function svgEllipsis(textElement, maxWidth) {
                        var properties = getSvgMeasurementProperties(textElement);
                        var originalText = properties.text;
                        var tailoredText = getTailoredTextOrDefault(properties, maxWidth);
                        if (originalText !== tailoredText) {
                            textElement.textContent = tailoredText;
                        }
                    }
                    textMeasurementService.svgEllipsis = svgEllipsis;
                    /**
                     * Word break textContent of <text> SVG element into <tspan>s
                     * Each tspan will be the height of a single line of text
                     * @param textElement - the SVGTextElement containing the text to wrap
                     * @param maxWidth - the maximum width available
                     * @param maxHeight - the maximum height available (defaults to single line)
                     * @param linePadding - (optional) padding to add to line height
                     */
                    function wordBreak(textElement, maxWidth, maxHeight, linePadding) {
                        if (linePadding === void 0) { linePadding = 0; }
                        var properties = getSvgMeasurementProperties(textElement);
                        var height = estimateSvgTextHeight(properties) + linePadding;
                        var maxNumLines = Math.max(1, Math.floor(maxHeight / height));
                        // Save y of parent textElement to apply as first tspan dy
                        var firstDY = textElement ? textElement.getAttribute("y") : null;
                        // Store and clear text content
                        var labelText = textElement ? textElement.textContent : null;
                        textElement.textContent = null;
                        // Append a tspan for each word broken section
                        var words = wordBreaker.splitByWidth(labelText, properties, measureSvgTextWidth, maxWidth, maxNumLines);
                        var fragment = document.createDocumentFragment();
                        for (var i = 0, ilen = words.length; i < ilen; i++) {
                            var dy = i === 0 ? firstDY : height;
                            properties.text = words[i];
                            var textElement_1 = document.createElementNS("http://www.w3.org/2000/svg", "tspan");
                            textElement_1.setAttribute("x", "0");
                            textElement_1.setAttribute("dy", dy ? dy.toString() : null);
                            textElement_1.appendChild(document.createTextNode(getTailoredTextOrDefault(properties, maxWidth)));
                            fragment.appendChild(textElement_1);
                        }
                        textElement.appendChild(fragment);
                    }
                    textMeasurementService.wordBreak = wordBreak;
                    /**
                     * Word break textContent of span element into <span>s
                     * Each span will be the height of a single line of text
                     * @param textElement - the element containing the text to wrap
                     * @param maxWidth - the maximum width available
                     * @param maxHeight - the maximum height available (defaults to single line)
                     * @param linePadding - (optional) padding to add to line height
                     */
                    function wordBreakOverflowingText(textElement, maxWidth, maxHeight, linePadding) {
                        if (linePadding === void 0) { linePadding = 0; }
                        var properties = getSvgMeasurementProperties(textElement);
                        var height = estimateSvgTextHeight(properties) + linePadding;
                        var maxNumLines = Math.max(1, Math.floor(maxHeight / height));
                        // Store and clear text content
                        var labelText = textElement.textContent;
                        textElement.textContent = null;
                        // Append a span for each word broken section
                        var words = wordBreaker.splitByWidth(labelText, properties, measureSvgTextWidth, maxWidth, maxNumLines);
                        var fragment = document.createDocumentFragment();
                        for (var i = 0; i < words.length; i++) {
                            var span = document.createElement("span");
                            span.classList.add("overflowingText");
                            span.style.width = PixelConverter.toString(maxWidth);
                            span.appendChild(document.createTextNode(words[i]));
                            span.appendChild(document.createTextNode(getTailoredTextOrDefault(properties, maxWidth)));
                            fragment.appendChild(span);
                        }
                        textElement.appendChild(fragment);
                    }
                    textMeasurementService.wordBreakOverflowingText = wordBreakOverflowingText;
                })(textMeasurementService = formatting.textMeasurementService || (formatting.textMeasurementService = {}));
            })(formatting = utils.formatting || (utils.formatting = {}));
        })(utils = extensibility.utils || (extensibility.utils = {}));
    })(extensibility = powerbi.extensibility || (powerbi.extensibility = {}));
})(powerbi || (powerbi = {}));
/*
 *  Power BI Visualizations
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */
"use strict";
var powerbi;
(function (powerbi) {
    var extensibility;
    (function (extensibility) {
        var utils;
        (function (utils) {
            var formatting;
            (function (formatting) {
                /** dateUtils module provides DateTimeSequence with set of additional date manipulation routines */
                var dateUtils;
                (function (dateUtils) {
                    var MonthDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
                    var MonthDaysLeap = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
                    /**
                     * Returns bool indicating weither the provided year is a leap year.
                     * @param year - year value
                     */
                    function isLeap(year) {
                        return ((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0);
                    }
                    /**
                     * Returns number of days in the provided year/month.
                     * @param year - year value
                     * @param month - month value
                     */
                    function getMonthDays(year, month) {
                        return isLeap(year) ? MonthDaysLeap[month] : MonthDays[month];
                    }
                    /**
                     * Adds a specified number of years to the provided date.
                     * @param date - date value
                     * @param yearDelta - number of years to add
                     */
                    function addYears(date, yearDelta) {
                        var year = date.getFullYear();
                        var month = date.getMonth();
                        var day = date.getDate();
                        var isLeapDay = month === 2 && day === 29;
                        var result = new Date(date.getTime());
                        year = year + yearDelta;
                        if (isLeapDay && !isLeap(year)) {
                            day = 28;
                        }
                        result.setFullYear(year, month, day);
                        return result;
                    }
                    dateUtils.addYears = addYears;
                    /**
                     * Adds a specified number of months to the provided date.
                     * @param date - date value
                     * @param monthDelta - number of months to add
                     */
                    function addMonths(date, monthDelta) {
                        var year = date.getFullYear();
                        var month = date.getMonth();
                        var day = date.getDate();
                        var result = new Date(date.getTime());
                        year += (monthDelta - (monthDelta % 12)) / 12;
                        month += monthDelta % 12;
                        // VSTS 1325771: Certain column charts don't display any data
                        // Wrap arround the month if is after december (value 11)
                        if (month > 11) {
                            month = month % 12;
                            year++;
                        }
                        day = Math.min(day, getMonthDays(year, month));
                        result.setFullYear(year, month, day);
                        return result;
                    }
                    dateUtils.addMonths = addMonths;
                    /**
                     * Adds a specified number of weeks to the provided date.
                     * @param date - date value
                     * @param weeks - number of weeks to add
                     */
                    function addWeeks(date, weeks) {
                        return addDays(date, weeks * 7);
                    }
                    dateUtils.addWeeks = addWeeks;
                    /**
                     * Adds a specified number of days to the provided date.
                     * @param date - date value
                     * @param days - number of days to add
                     */
                    function addDays(date, days) {
                        var year = date.getFullYear();
                        var month = date.getMonth();
                        var day = date.getDate();
                        var result = new Date(date.getTime());
                        result.setFullYear(year, month, day + days);
                        return result;
                    }
                    dateUtils.addDays = addDays;
                    /**
                     * Adds a specified number of hours to the provided date.
                     * @param date - date value
                     * @param hours - number of hours to add
                     */
                    function addHours(date, hours) {
                        return new Date(date.getTime() + hours * 3600000);
                    }
                    dateUtils.addHours = addHours;
                    /**
                     * Adds a specified number of minutes to the provided date.
                     * @param date - date value
                     * @param minutes - number of minutes to add
                     */
                    function addMinutes(date, minutes) {
                        return new Date(date.getTime() + minutes * 60000);
                    }
                    dateUtils.addMinutes = addMinutes;
                    /**
                     * Adds a specified number of seconds to the provided date.
                     * @param date - date value
                     * @param seconds - number of seconds to add
                     */
                    function addSeconds(date, seconds) {
                        return new Date(date.getTime() + seconds * 1000);
                    }
                    dateUtils.addSeconds = addSeconds;
                    /**
                     * Adds a specified number of milliseconds to the provided date.
                     * @param date - date value
                     * @param milliseconds - number of milliseconds to add
                     */
                    function addMilliseconds(date, milliseconds) {
                        return new Date(date.getTime() + milliseconds);
                    }
                    dateUtils.addMilliseconds = addMilliseconds;
                })(dateUtils = formatting.dateUtils || (formatting.dateUtils = {}));
            })(formatting = utils.formatting || (utils.formatting = {}));
        })(utils = extensibility.utils || (extensibility.utils = {}));
    })(extensibility = powerbi.extensibility || (powerbi.extensibility = {}));
})(powerbi || (powerbi = {}));
/*
 *  Power BI Visualizations
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */
"use strict";
var powerbi;
(function (powerbi) {
    var extensibility;
    (function (extensibility) {
        var utils;
        (function (utils) {
            var formatting;
            (function (formatting) {
                // powerbi.extensibility.utils.type
                var NumericSequenceRange = powerbi.extensibility.utils.type.NumericSequenceRange;
                var NumericSequence = powerbi.extensibility.utils.type.NumericSequence;
                var Double = powerbi.extensibility.utils.type.Double;
                // powerbi.extensibility.utils.formatting
                var DateTimeUnit = powerbi.extensibility.utils.formatting.DateTimeUnit;
                /** Repreasents the sequence of the dates/times */
                var DateTimeSequence = (function () {
                    // Constructors
                    /** Creates new instance of the DateTimeSequence */
                    function DateTimeSequence(unit) {
                        this.unit = unit;
                        this.sequence = [];
                        this.min = new Date("9999-12-31T23:59:59.999");
                        this.max = new Date("0001-01-01T00:00:00.000");
                    }
                    // Methods
                    /**
                     * Add a new Date to a sequence.
                     * @param date - date to add
                     */
                    DateTimeSequence.prototype.add = function (date) {
                        if (date < this.min) {
                            this.min = date;
                        }
                        if (date > this.max) {
                            this.max = date;
                        }
                        this.sequence.push(date);
                    };
                    // Methods
                    /**
                     * Extends the sequence to cover new date range
                     * @param min - new min to be covered by sequence
                     * @param max - new max to be covered by sequence
                     */
                    DateTimeSequence.prototype.extendToCover = function (min, max) {
                        var x = this.min;
                        while (min < x) {
                            x = DateTimeSequence.addInterval(x, -this.interval, this.unit);
                            this.sequence.splice(0, 0, x);
                        }
                        this.min = x;
                        x = this.max;
                        while (x < max) {
                            x = DateTimeSequence.addInterval(x, this.interval, this.unit);
                            this.sequence.push(x);
                        }
                        this.max = x;
                    };
                    /**
                     * Move the sequence to cover new date range
                     * @param min - new min to be covered by sequence
                     * @param max - new max to be covered by sequence
                     */
                    DateTimeSequence.prototype.moveToCover = function (min, max) {
                        var delta = DateTimeSequence.getDelta(min, max, this.unit);
                        var count = Math.floor(delta / this.interval);
                        this.min = DateTimeSequence.addInterval(this.min, count * this.interval, this.unit);
                        this.sequence = [];
                        this.sequence.push(this.min);
                        this.max = this.min;
                        while (this.max < max) {
                            this.max = DateTimeSequence.addInterval(this.max, this.interval, this.unit);
                            this.sequence.push(this.max);
                        }
                    };
                    // Static
                    /**
                     * Calculate a new DateTimeSequence
                     * @param dataMin - Date representing min of the data range
                     * @param dataMax - Date representing max of the data range
                     * @param expectedCount - expected number of intervals in the sequence
                     * @param unit - of the intervals in the sequence
                     */
                    DateTimeSequence.calculate = function (dataMin, dataMax, expectedCount, unit) {
                        if (!unit) {
                            unit = DateTimeSequence.getIntervalUnit(dataMin, dataMax, expectedCount);
                        }
                        switch (unit) {
                            case DateTimeUnit.Year:
                                return DateTimeSequence.calculateYears(dataMin, dataMax, expectedCount);
                            case DateTimeUnit.Month:
                                return DateTimeSequence.calculateMonths(dataMin, dataMax, expectedCount);
                            case DateTimeUnit.Week:
                                return DateTimeSequence.calculateWeeks(dataMin, dataMax, expectedCount);
                            case DateTimeUnit.Day:
                                return DateTimeSequence.calculateDays(dataMin, dataMax, expectedCount);
                            case DateTimeUnit.Hour:
                                return DateTimeSequence.calculateHours(dataMin, dataMax, expectedCount);
                            case DateTimeUnit.Minute:
                                return DateTimeSequence.calculateMinutes(dataMin, dataMax, expectedCount);
                            case DateTimeUnit.Second:
                                return DateTimeSequence.calculateSeconds(dataMin, dataMax, expectedCount);
                            case DateTimeUnit.Millisecond:
                                return DateTimeSequence.calculateMilliseconds(dataMin, dataMax, expectedCount);
                        }
                    };
                    DateTimeSequence.calculateYears = function (dataMin, dataMax, expectedCount) {
                        // Calculate range and sequence
                        var yearsRange = NumericSequenceRange.calculateDataRange(dataMin.getFullYear(), dataMax.getFullYear(), false);
                        // Calculate year sequence
                        var sequence = NumericSequence.calculate(NumericSequenceRange.calculate(0, yearsRange.max - yearsRange.min), expectedCount, 0, null, null, [1, 2, 5]);
                        var newMinYear = Math.floor(yearsRange.min / sequence.interval) * sequence.interval;
                        var date = new Date(newMinYear, 0, 1);
                        // Convert to date sequence
                        var result = DateTimeSequence.fromNumericSequence(date, sequence, DateTimeUnit.Year);
                        return result;
                    };
                    DateTimeSequence.calculateMonths = function (dataMin, dataMax, expectedCount) {
                        // Calculate range
                        var minYear = dataMin.getFullYear();
                        var maxYear = dataMax.getFullYear();
                        var minMonth = dataMin.getMonth();
                        var maxMonth = (maxYear - minYear) * 12 + dataMax.getMonth();
                        var date = new Date(minYear, 0, 1);
                        // Calculate month sequence
                        var sequence = NumericSequence.calculateUnits(minMonth, maxMonth, expectedCount, [1, 2, 3, 6, 12]);
                        // Convert to date sequence
                        var result = DateTimeSequence.fromNumericSequence(date, sequence, DateTimeUnit.Month);
                        return result;
                    };
                    DateTimeSequence.calculateWeeks = function (dataMin, dataMax, expectedCount) {
                        var firstDayOfWeek = 0;
                        var minDayOfWeek = dataMin.getDay();
                        var dayOffset = (minDayOfWeek - firstDayOfWeek + 7) % 7;
                        var minDay = dataMin.getDate() - dayOffset;
                        // Calculate range
                        var date = new Date(dataMin.getFullYear(), dataMin.getMonth(), minDay);
                        var min = 0;
                        var max = Double.ceilWithPrecision(DateTimeSequence.getDelta(date, dataMax, DateTimeUnit.Week));
                        // Calculate week sequence
                        var sequence = NumericSequence.calculateUnits(min, max, expectedCount, [1, 2, 4, 8]);
                        // Convert to date sequence
                        var result = DateTimeSequence.fromNumericSequence(date, sequence, DateTimeUnit.Week);
                        return result;
                    };
                    DateTimeSequence.calculateDays = function (dataMin, dataMax, expectedCount) {
                        // Calculate range
                        var date = new Date(dataMin.getFullYear(), dataMin.getMonth(), dataMin.getDate());
                        var min = 0;
                        var max = Double.ceilWithPrecision(DateTimeSequence.getDelta(dataMin, dataMax, DateTimeUnit.Day));
                        // Calculate day sequence
                        var sequence = NumericSequence.calculateUnits(min, max, expectedCount, [1, 2, 7, 14]);
                        // Convert to date sequence
                        var result = DateTimeSequence.fromNumericSequence(date, sequence, DateTimeUnit.Day);
                        return result;
                    };
                    DateTimeSequence.calculateHours = function (dataMin, dataMax, expectedCount) {
                        // Calculate range
                        var date = new Date(dataMin.getFullYear(), dataMin.getMonth(), dataMin.getDate());
                        var min = Double.floorWithPrecision(DateTimeSequence.getDelta(date, dataMin, DateTimeUnit.Hour));
                        var max = Double.ceilWithPrecision(DateTimeSequence.getDelta(date, dataMax, DateTimeUnit.Hour));
                        // Calculate hour sequence
                        var sequence = NumericSequence.calculateUnits(min, max, expectedCount, [1, 2, 3, 6, 12, 24]);
                        // Convert to date sequence
                        var result = DateTimeSequence.fromNumericSequence(date, sequence, DateTimeUnit.Hour);
                        return result;
                    };
                    DateTimeSequence.calculateMinutes = function (dataMin, dataMax, expectedCount) {
                        // Calculate range
                        var date = new Date(dataMin.getFullYear(), dataMin.getMonth(), dataMin.getDate(), dataMin.getHours());
                        var min = Double.floorWithPrecision(DateTimeSequence.getDelta(date, dataMin, DateTimeUnit.Minute));
                        var max = Double.ceilWithPrecision(DateTimeSequence.getDelta(date, dataMax, DateTimeUnit.Minute));
                        // Calculate minutes numeric sequence
                        var sequence = NumericSequence.calculateUnits(min, max, expectedCount, [1, 2, 5, 10, 15, 30, 60, 60 * 2, 60 * 3, 60 * 6, 60 * 12, 60 * 24]);
                        // Convert to date sequence
                        var result = DateTimeSequence.fromNumericSequence(date, sequence, DateTimeUnit.Minute);
                        return result;
                    };
                    DateTimeSequence.calculateSeconds = function (dataMin, dataMax, expectedCount) {
                        // Calculate range
                        var date = new Date(dataMin.getFullYear(), dataMin.getMonth(), dataMin.getDate(), dataMin.getHours(), dataMin.getMinutes());
                        var min = Double.floorWithPrecision(DateTimeSequence.getDelta(date, dataMin, DateTimeUnit.Second));
                        var max = Double.ceilWithPrecision(DateTimeSequence.getDelta(date, dataMax, DateTimeUnit.Second));
                        // Calculate minutes numeric sequence
                        var sequence = NumericSequence.calculateUnits(min, max, expectedCount, [1, 2, 5, 10, 15, 30, 60, 60 * 2, 60 * 5, 60 * 10, 60 * 15, 60 * 30, 60 * 60]);
                        // Convert to date sequence
                        var result = DateTimeSequence.fromNumericSequence(date, sequence, DateTimeUnit.Second);
                        return result;
                    };
                    DateTimeSequence.calculateMilliseconds = function (dataMin, dataMax, expectedCount) {
                        // Calculate range
                        var date = new Date(dataMin.getFullYear(), dataMin.getMonth(), dataMin.getDate(), dataMin.getHours(), dataMin.getMinutes(), dataMin.getSeconds());
                        var min = DateTimeSequence.getDelta(date, dataMin, DateTimeUnit.Millisecond);
                        var max = DateTimeSequence.getDelta(date, dataMax, DateTimeUnit.Millisecond);
                        // Calculate milliseconds numeric sequence
                        var sequence = NumericSequence.calculate(NumericSequenceRange.calculate(min, max), expectedCount, 0);
                        // Convert to date sequence
                        var result = DateTimeSequence.fromNumericSequence(date, sequence, DateTimeUnit.Millisecond);
                        return result;
                    };
                    DateTimeSequence.addInterval = function (value, interval, unit) {
                        interval = Math.round(interval);
                        switch (unit) {
                            case DateTimeUnit.Year:
                                return formatting.dateUtils.addYears(value, interval);
                            case DateTimeUnit.Month:
                                return formatting.dateUtils.addMonths(value, interval);
                            case DateTimeUnit.Week:
                                return formatting.dateUtils.addWeeks(value, interval);
                            case DateTimeUnit.Day:
                                return formatting.dateUtils.addDays(value, interval);
                            case DateTimeUnit.Hour:
                                return formatting.dateUtils.addHours(value, interval);
                            case DateTimeUnit.Minute:
                                return formatting.dateUtils.addMinutes(value, interval);
                            case DateTimeUnit.Second:
                                return formatting.dateUtils.addSeconds(value, interval);
                            case DateTimeUnit.Millisecond:
                                return formatting.dateUtils.addMilliseconds(value, interval);
                        }
                    };
                    DateTimeSequence.fromNumericSequence = function (date, sequence, unit) {
                        var result = new DateTimeSequence(unit);
                        for (var i = 0; i < sequence.sequence.length; i++) {
                            var x = sequence.sequence[i];
                            var d = DateTimeSequence.addInterval(date, x, unit);
                            result.add(d);
                        }
                        result.interval = sequence.interval;
                        result.intervalOffset = sequence.intervalOffset;
                        return result;
                    };
                    DateTimeSequence.getDelta = function (min, max, unit) {
                        var delta = 0;
                        switch (unit) {
                            case DateTimeUnit.Year:
                                delta = max.getFullYear() - min.getFullYear();
                                break;
                            case DateTimeUnit.Month:
                                delta = (max.getFullYear() - min.getFullYear()) * 12 + max.getMonth() - min.getMonth();
                                break;
                            case DateTimeUnit.Week:
                                delta = (max.getTime() - min.getTime()) / (7 * 24 * 3600000);
                                break;
                            case DateTimeUnit.Day:
                                delta = (max.getTime() - min.getTime()) / (24 * 3600000);
                                break;
                            case DateTimeUnit.Hour:
                                delta = (max.getTime() - min.getTime()) / 3600000;
                                break;
                            case DateTimeUnit.Minute:
                                delta = (max.getTime() - min.getTime()) / 60000;
                                break;
                            case DateTimeUnit.Second:
                                delta = (max.getTime() - min.getTime()) / 1000;
                                break;
                            case DateTimeUnit.Millisecond:
                                delta = max.getTime() - min.getTime();
                                break;
                        }
                        return delta;
                    };
                    DateTimeSequence.getIntervalUnit = function (min, max, maxCount) {
                        maxCount = Math.max(maxCount, 2);
                        var totalDays = DateTimeSequence.getDelta(min, max, DateTimeUnit.Day);
                        if (totalDays > 356 && totalDays >= 30 * 6 * maxCount)
                            return DateTimeUnit.Year;
                        if (totalDays > 60 && totalDays > 7 * maxCount)
                            return DateTimeUnit.Month;
                        if (totalDays > 14 && totalDays > 2 * maxCount)
                            return DateTimeUnit.Week;
                        var totalHours = DateTimeSequence.getDelta(min, max, DateTimeUnit.Hour);
                        if (totalDays > 2 && totalHours > 12 * maxCount)
                            return DateTimeUnit.Day;
                        if (totalHours >= 24 && totalHours >= maxCount)
                            return DateTimeUnit.Hour;
                        var totalMinutes = DateTimeSequence.getDelta(min, max, DateTimeUnit.Minute);
                        if (totalMinutes > 2 && totalMinutes >= maxCount)
                            return DateTimeUnit.Minute;
                        var totalSeconds = DateTimeSequence.getDelta(min, max, DateTimeUnit.Second);
                        if (totalSeconds > 2 && totalSeconds >= 0.8 * maxCount)
                            return DateTimeUnit.Second;
                        var totalMilliseconds = DateTimeSequence.getDelta(min, max, DateTimeUnit.Millisecond);
                        if (totalMilliseconds > 0)
                            return DateTimeUnit.Millisecond;
                        // If the size of the range is 0 we need to guess the unit based on the date's non-zero values starting with milliseconds
                        var date = min;
                        if (date.getMilliseconds() !== 0)
                            return DateTimeUnit.Millisecond;
                        if (date.getSeconds() !== 0)
                            return DateTimeUnit.Second;
                        if (date.getMinutes() !== 0)
                            return DateTimeUnit.Minute;
                        if (date.getHours() !== 0)
                            return DateTimeUnit.Hour;
                        if (date.getDate() !== 1)
                            return DateTimeUnit.Day;
                        if (date.getMonth() !== 0)
                            return DateTimeUnit.Month;
                        return DateTimeUnit.Year;
                    };
                    return DateTimeSequence;
                }());
                // Constants
                DateTimeSequence.MIN_COUNT = 1;
                DateTimeSequence.MAX_COUNT = 1000;
                formatting.DateTimeSequence = DateTimeSequence;
            })(formatting = utils.formatting || (utils.formatting = {}));
        })(utils = extensibility.utils || (extensibility.utils = {}));
    })(extensibility = powerbi.extensibility || (powerbi.extensibility = {}));
})(powerbi || (powerbi = {}));
/*
 *  Power BI Visualizations
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */
"use strict";
var powerbi;
(function (powerbi) {
    var extensibility;
    (function (extensibility) {
        var utils;
        (function (utils) {
            var formatting;
            (function (formatting) {
                var regexCache;
                /**
                 * Translate .NET format into something supported by jQuery.Globalize.
                 */
                function findDateFormat(value, format, cultureName) {
                    switch (format) {
                        case "m":
                            // Month + day
                            format = "M";
                            break;
                        case "O":
                        case "o":
                            // Roundtrip
                            format = "yyyy'-'MM'-'dd'T'HH':'mm':'ss'.'fff'0000'";
                            break;
                        case "R":
                        case "r":
                            // RFC1123 pattern - - time must be converted to UTC before formatting
                            value = new Date(value.getUTCFullYear(), value.getUTCMonth(), value.getUTCDate(), value.getUTCHours(), value.getUTCMinutes(), value.getUTCSeconds(), value.getUTCMilliseconds());
                            format = "ddd, dd MMM yyyy HH':'mm':'ss 'GMT'";
                            break;
                        case "s":
                            // Sortable - should use invariant culture
                            format = "S";
                            break;
                        case "u":
                            // Universal sortable - should convert to UTC before applying the "yyyy'-'MM'-'dd HH':'mm':'ss'Z' format.
                            value = new Date(value.getUTCFullYear(), value.getUTCMonth(), value.getUTCDate(), value.getUTCHours(), value.getUTCMinutes(), value.getUTCSeconds(), value.getUTCMilliseconds());
                            format = "yyyy'-'MM'-'dd HH':'mm':'ss'Z'";
                            break;
                        case "U":
                            // Universal full - the pattern is same as F but the time must be converted to UTC before formatting
                            value = new Date(value.getUTCFullYear(), value.getUTCMonth(), value.getUTCDate(), value.getUTCHours(), value.getUTCMinutes(), value.getUTCSeconds(), value.getUTCMilliseconds());
                            format = "F";
                            break;
                        case "y":
                        case "Y":
                            // Year and month
                            switch (cultureName) {
                                case "default":
                                case "en":
                                case "en-US":
                                    format = "MMMM, yyyy"; // Fix the default year-month pattern for english
                                    break;
                                default:
                                    format = "Y"; // For other cultures - use the localized pattern
                            }
                            break;
                    }
                    return { value: value, format: format };
                }
                formatting.findDateFormat = findDateFormat;
                /**
                 * Translates unsupported .NET custom format expressions to the custom expressions supported by JQuery.Globalize.
                 */
                function fixDateTimeFormat(format) {
                    // Fix for the "K" format (timezone):
                    // T he js dates don't have a kind property so we'll support only local kind which is equavalent to zzz format.
                    format = format.replace(/%K/g, "zzz");
                    format = format.replace(/K/g, "zzz");
                    format = format.replace(/fffffff/g, "fff0000");
                    format = format.replace(/ffffff/g, "fff000");
                    format = format.replace(/fffff/g, "fff00");
                    format = format.replace(/ffff/g, "fff0");
                    // Fix for the 5 digit year: "yyyyy" format.
                    // The Globalize doesn't support dates greater than 9999 so we replace the "yyyyy" with "0yyyy".
                    format = format.replace(/yyyyy/g, "0yyyy");
                    // Fix for the 3 digit year: "yyy" format.
                    // The Globalize doesn't support this formatting so we need to replace it with the 4 digit year "yyyy" format.
                    format = format.replace(/(^y|^)yyy(^y|$)/g, "yyyy");
                    if (!regexCache) {
                        // Creating Regexes for cases "Using single format specifier"
                        // - http://msdn.microsoft.com/en-us/library/8kb3ddd4.aspx#UsingSingleSpecifiers
                        // This is not supported from The Globalize.
                        // The case covers all single "%" lead specifier (like "%d" but not %dd)
                        // The cases as single "%d" are filtered in if the bellow.
                        // (?!S) where S is the specifier make sure that we only one symbol for specifier.
                        regexCache = ["d", "f", "F", "g", "h", "H", "K", "m", "M", "s", "t", "y", "z", ":", "/"].map(function (s) {
                            return { r: new RegExp("\%" + s + "(?!" + s + ")", "g"), s: s };
                        });
                    }
                    if (format.indexOf("%") !== -1 && format.length > 2) {
                        for (var i = 0; i < regexCache.length; i++) {
                            format = format.replace(regexCache[i].r, regexCache[i].s);
                        }
                    }
                    return format;
                }
                formatting.fixDateTimeFormat = fixDateTimeFormat;
            })(formatting = utils.formatting || (utils.formatting = {}));
        })(utils = extensibility.utils || (extensibility.utils = {}));
    })(extensibility = powerbi.extensibility || (powerbi.extensibility = {}));
})(powerbi || (powerbi = {}));
/*
 *  Power BI Visualizations
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */
"use strict";
var powerbi;
(function (powerbi) {
    var extensibility;
    (function (extensibility) {
        var utils;
        (function (utils) {
            var formatting;
            (function (formatting) {
                var font;
                (function (font_1) {
                    var FamilyInfo = (function () {
                        function FamilyInfo(families) {
                            this.families = families;
                        }
                        Object.defineProperty(FamilyInfo.prototype, "family", {
                            /**
                             * Gets the first font "wf_" font family since it will always be loaded.
                             */
                            get: function () {
                                return this.getFamily();
                            },
                            enumerable: true,
                            configurable: true
                        });
                        /**
                        * Gets the first font family that matches regex (if provided).
                        * Default regex looks for "wf_" fonts which are always loaded.
                        */
                        FamilyInfo.prototype.getFamily = function (regex) {
                            if (regex === void 0) { regex = /^wf_/; }
                            if (!this.families) {
                                return null;
                            }
                            if (regex) {
                                for (var _i = 0, _a = this.families; _i < _a.length; _i++) {
                                    var fontFamily = _a[_i];
                                    if (regex.test(fontFamily)) {
                                        return fontFamily;
                                    }
                                }
                            }
                            return this.families[0];
                        };
                        Object.defineProperty(FamilyInfo.prototype, "css", {
                            /**
                             * Gets the CSS string for the "font-family" CSS attribute.
                             */
                            get: function () {
                                return this.getCSS();
                            },
                            enumerable: true,
                            configurable: true
                        });
                        /**
                         * Gets the CSS string for the "font-family" CSS attribute.
                         */
                        FamilyInfo.prototype.getCSS = function () {
                            return this.families ? this.families.map((function (font) { return font.indexOf(" ") > 0 ? "'" + font + "'" : font; })).join(", ") : null;
                        };
                        return FamilyInfo;
                    }());
                    font_1.FamilyInfo = FamilyInfo;
                })(font = formatting.font || (formatting.font = {}));
            })(formatting = utils.formatting || (utils.formatting = {}));
        })(utils = extensibility.utils || (extensibility.utils = {}));
    })(extensibility = powerbi.extensibility || (powerbi.extensibility = {}));
})(powerbi || (powerbi = {}));
/*
 *  Power BI Visualizations
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */
"use strict";
var powerbi;
(function (powerbi) {
    var extensibility;
    (function (extensibility) {
        var utils;
        (function (utils) {
            var formatting;
            (function (formatting) {
                var font;
                (function (font) {
                    font.fallbackFonts = ["helvetica", "arial", "sans-serif"];
                    font.Family = {
                        light: new font.FamilyInfo(font.fallbackFonts),
                        semilight: new font.FamilyInfo(font.fallbackFonts),
                        regular: new font.FamilyInfo(font.fallbackFonts),
                        semibold: new font.FamilyInfo(font.fallbackFonts),
                        bold: new font.FamilyInfo(font.fallbackFonts),
                        lightSecondary: new font.FamilyInfo(font.fallbackFonts),
                        regularSecondary: new font.FamilyInfo(font.fallbackFonts),
                        boldSecondary: new font.FamilyInfo(font.fallbackFonts)
                    };
                })(font = formatting.font || (formatting.font = {}));
            })(formatting = utils.formatting || (utils.formatting = {}));
        })(utils = extensibility.utils || (extensibility.utils = {}));
    })(extensibility = powerbi.extensibility || (powerbi.extensibility = {}));
})(powerbi || (powerbi = {}));
/*
 *  Power BI Visualizations
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */
"use strict";
var powerbi;
(function (powerbi) {
    var extensibility;
    (function (extensibility) {
        var utils;
        (function (utils) {
            var formatting;
            (function (formatting) {
                // powerbi.extensibility.utils.type
                var Double = powerbi.extensibility.utils.type.Double;
                var RegExpExtensions = powerbi.extensibility.utils.type.RegExpExtensions;
                // powerbi.extensibility.utils.formatting
                var stringExtensions = powerbi.extensibility.utils.formatting.stringExtensions;
                var findDateFormat = powerbi.extensibility.utils.formatting.findDateFormat;
                var fixDateTimeFormat = powerbi.extensibility.utils.formatting.fixDateTimeFormat;
                var DateTimeUnit = powerbi.extensibility.utils.formatting.DateTimeUnit;
                /** Formatting Encoder */
                var formattingEncoder;
                (function (formattingEncoder) {
                    // quoted and escaped literal patterns
                    // NOTE: the final three cases match .NET behavior
                    var literalPatterns = [
                        "'[^']*'",
                        "\"[^\"]*\"",
                        "\\\\.",
                        "'[^']*$",
                        "\"[^\"]*$",
                        "\\\\$",
                    ];
                    var literalMatcher = new RegExp(literalPatterns.join("|"), "g");
                    // Unicode U+E000 - U+F8FF is a private area and so we can use the chars from the range to encode the escaped sequences
                    function removeLiterals(format) {
                        literalMatcher.lastIndex = 0;
                        // just in case consecutive non-literals have some meaning
                        return format.replace(literalMatcher, "\uE100");
                    }
                    formattingEncoder.removeLiterals = removeLiterals;
                    function preserveLiterals(format, literals) {
                        literalMatcher.lastIndex = 0;
                        for (;;) {
                            var match = literalMatcher.exec(format);
                            if (!match)
                                break;
                            var literal = match[0];
                            var literalOffset = literalMatcher.lastIndex - literal.length;
                            var token = String.fromCharCode(0xE100 + literals.length);
                            literals.push(literal);
                            format = format.substr(0, literalOffset) + token + format.substr(literalMatcher.lastIndex);
                            // back to avoid skipping due to removed literal substring
                            literalMatcher.lastIndex = literalOffset + 1;
                        }
                        return format;
                    }
                    formattingEncoder.preserveLiterals = preserveLiterals;
                    function restoreLiterals(format, literals, quoted) {
                        if (quoted === void 0) { quoted = true; }
                        var count = literals.length;
                        for (var i = 0; i < count; i++) {
                            var token = String.fromCharCode(0xE100 + i);
                            var literal = literals[i];
                            if (!quoted) {
                                // caller wants literals to be re-inserted without escaping
                                var firstChar = literal[0];
                                if (firstChar === "\\" || literal.length === 1 || literal[literal.length - 1] !== firstChar) {
                                    // either escaped literal OR quoted literal that's missing the trailing quote
                                    // in either case we only remove the leading character
                                    literal = literal.substring(1);
                                }
                                else {
                                    // so must be a quoted literal with both starting and ending quote
                                    literal = literal.substring(1, literal.length - 1);
                                }
                            }
                            format = format.replace(token, literal);
                        }
                        return format;
                    }
                    formattingEncoder.restoreLiterals = restoreLiterals;
                })(formattingEncoder || (formattingEncoder = {}));
                var IndexedTokensRegex = /({{)|(}})|{(\d+[^}]*)}/g;
                var ZeroPlaceholder = "0";
                var DigitPlaceholder = "#";
                var ExponentialFormatChar = "E";
                var NumericPlaceholders = [ZeroPlaceholder, DigitPlaceholder];
                var NumericPlaceholderRegex = new RegExp(NumericPlaceholders.join("|"), "g");
                /** Formatting Service */
                var FormattingService = (function () {
                    function FormattingService() {
                    }
                    FormattingService.prototype.formatValue = function (value, format, cultureSelector) {
                        // Handle special cases
                        if (value === undefined || value === null) {
                            return "";
                        }
                        var gculture = this.getCulture(cultureSelector);
                        if (dateTimeFormat.canFormat(value)) {
                            // Dates
                            return dateTimeFormat.format(value, format, gculture);
                        }
                        else if (numberFormat.canFormat(value)) {
                            // Numbers
                            return numberFormat.format(value, format, gculture);
                        }
                        // Other data types - return as string
                        return value.toString();
                    };
                    FormattingService.prototype.format = function (formatWithIndexedTokens, args, culture) {
                        var _this = this;
                        if (!formatWithIndexedTokens) {
                            return "";
                        }
                        var result = formatWithIndexedTokens.replace(IndexedTokensRegex, function (match, left, right, argToken) {
                            if (left) {
                                return "{";
                            }
                            else if (right) {
                                return "}";
                            }
                            else {
                                var parts = argToken.split(":");
                                var argIndex = parseInt(parts[0], 10);
                                var argFormat = parts[1];
                                return _this.formatValue(args[argIndex], argFormat, culture);
                            }
                        });
                        return result;
                    };
                    FormattingService.prototype.isStandardNumberFormat = function (format) {
                        return numberFormat.isStandardFormat(format);
                    };
                    FormattingService.prototype.formatNumberWithCustomOverride = function (value, format, nonScientificOverrideFormat, culture) {
                        var gculture = this.getCulture(culture);
                        return numberFormat.formatWithCustomOverride(value, format, nonScientificOverrideFormat, gculture);
                    };
                    FormattingService.prototype.dateFormatString = function (unit) {
                        if (!this._dateTimeScaleFormatInfo)
                            this.initialize();
                        return this._dateTimeScaleFormatInfo.getFormatString(unit);
                    };
                    /**
                     * Sets the current localization culture
                     * @param cultureSelector - name of a culture: "en", "en-UK", "fr-FR" etc. (See National Language Support (NLS) for full lists. Use "default" for invariant culture).
                     */
                    FormattingService.prototype.setCurrentCulture = function (cultureSelector) {
                        if (this._currentCultureSelector !== cultureSelector) {
                            this._currentCulture = this.getCulture(cultureSelector);
                            this._currentCultureSelector = cultureSelector;
                            this._dateTimeScaleFormatInfo = new DateTimeScaleFormatInfo(this._currentCulture);
                        }
                    };
                    /**
                     * Gets the culture assotiated with the specified cultureSelector ("en", "en-US", "fr-FR" etc).
                     * @param cultureSelector - name of a culture: "en", "en-UK", "fr-FR" etc. (See National Language Support (NLS) for full lists. Use "default" for invariant culture).
                     * Exposing this function for testability of unsupported cultures
                     */
                    FormattingService.prototype.getCulture = function (cultureSelector) {
                        if (cultureSelector == null) {
                            if (this._currentCulture == null) {
                                this.initialize();
                            }
                            return this._currentCulture;
                        }
                        else {
                            var culture = Globalize.findClosestCulture(cultureSelector);
                            if (!culture)
                                culture = Globalize.culture("en-US");
                            return culture;
                        }
                    };
                    /** By default the Globalization module initializes to the culture/calendar provided in the language/culture URL params */
                    FormattingService.prototype.initialize = function () {
                        var cultureName = this.getCurrentCulture();
                        this.setCurrentCulture(cultureName);
                        var calendarName = this.getUrlParam("calendar");
                        if (calendarName) {
                            var culture = this._currentCulture;
                            var c = culture.calendars[calendarName];
                            if (c) {
                                culture.calendar = c;
                            }
                        }
                    };
                    /**
                     *  Exposing this function for testability
                     */
                    FormattingService.prototype.getCurrentCulture = function () {
                        var urlParam = this.getUrlParam("language");
                        if (urlParam) {
                            return urlParam;
                        }
                        if (powerbi && powerbi.common && powerbi.common.cultureInfo) {
                            // Get cultureInfo set in powerbi
                            return powerbi.common.cultureInfo;
                        }
                        return window.navigator.userLanguage || window.navigator["language"] || Globalize.culture().name;
                    };
                    /**
                     *  Exposing this function for testability
                     *  @param name: queryString name
                     */
                    FormattingService.prototype.getUrlParam = function (name) {
                        var param = window.location.search.match(RegExp("[?&]" + name + "=([^&]*)"));
                        return param ? param[1] : undefined;
                    };
                    return FormattingService;
                }());
                formatting.FormattingService = FormattingService;
                /**
                 * DateTimeFormat module contains the static methods for formatting the DateTimes.
                 * It extends the JQuery.Globalize functionality to support complete set of .NET
                 * formatting expressions for dates.
                 */
                var dateTimeFormat;
                (function (dateTimeFormat) {
                    var _currentCachedFormat;
                    var _currentCachedProcessedFormat;
                    /** Evaluates if the value can be formatted using the NumberFormat */
                    function canFormat(value) {
                        var result = value instanceof Date;
                        return result;
                    }
                    dateTimeFormat.canFormat = canFormat;
                    /** Formats the date using provided format and culture */
                    function format(value, format, culture) {
                        format = format || "G";
                        var isStandard = format.length === 1;
                        try {
                            if (isStandard) {
                                return formatDateStandard(value, format, culture);
                            }
                            else {
                                return formatDateCustom(value, format, culture);
                            }
                        }
                        catch (e) {
                            return formatDateStandard(value, "G", culture);
                        }
                    }
                    dateTimeFormat.format = format;
                    /** Formats the date using standard format expression */
                    function formatDateStandard(value, format, culture) {
                        // In order to provide parity with .NET we have to support additional set of DateTime patterns.
                        var patterns = culture.calendar.patterns;
                        // Extend supported set of patterns
                        ensurePatterns(culture.calendar);
                        // Handle extended set of formats
                        var output = findDateFormat(value, format, culture.name);
                        if (output.format.length === 1)
                            format = patterns[output.format];
                        else
                            format = output.format;
                        // need to revisit when globalization is enabled
                        if (!culture) {
                            culture = Globalize.culture("en-US");
                        }
                        return Globalize.format(output.value, format, culture);
                    }
                    /** Formats the date using custom format expression */
                    function formatDateCustom(value, format, culture) {
                        var result;
                        var literals = [];
                        format = formattingEncoder.preserveLiterals(format, literals);
                        if (format.indexOf("F") > -1) {
                            // F is not supported so we need to replace the F with f based on the milliseconds
                            // Replace all sequences of F longer than 3 with "FFF"
                            format = stringExtensions.replaceAll(format, "FFFF", "FFF");
                            // Based on milliseconds update the format to use fff
                            var milliseconds = value.getMilliseconds();
                            if (milliseconds % 10 >= 1) {
                                format = stringExtensions.replaceAll(format, "FFF", "fff");
                            }
                            format = stringExtensions.replaceAll(format, "FFF", "FF");
                            if ((milliseconds % 100) / 10 >= 1) {
                                format = stringExtensions.replaceAll(format, "FF", "ff");
                            }
                            format = stringExtensions.replaceAll(format, "FF", "F");
                            if ((milliseconds % 1000) / 100 >= 1) {
                                format = stringExtensions.replaceAll(format, "F", "f");
                            }
                            format = stringExtensions.replaceAll(format, "F", "");
                            if (format === "" || format === "%")
                                return "";
                        }
                        format = processCustomDateTimeFormat(format);
                        result = Globalize.format(value, format, culture);
                        result = localize(result, culture.calendar);
                        result = formattingEncoder.restoreLiterals(result, literals, false);
                        return result;
                    }
                    /** Translates unsupported .NET custom format expressions to the custom expressions supported by JQuery.Globalize */
                    function processCustomDateTimeFormat(format) {
                        if (format === _currentCachedFormat) {
                            return _currentCachedProcessedFormat;
                        }
                        _currentCachedFormat = format;
                        format = fixDateTimeFormat(format);
                        _currentCachedProcessedFormat = format;
                        return format;
                    }
                    /** Localizes the time separator symbol */
                    function localize(value, dictionary) {
                        var timeSeparator = dictionary[":"];
                        if (timeSeparator === ":") {
                            return value;
                        }
                        var result = "";
                        var count = value.length;
                        for (var i = 0; i < count; i++) {
                            var char = value.charAt(i);
                            switch (char) {
                                case ":":
                                    result += timeSeparator;
                                    break;
                                default:
                                    result += char;
                                    break;
                            }
                        }
                        return result;
                    }
                    function ensurePatterns(calendar) {
                        var patterns = calendar.patterns;
                        if (patterns["g"] === undefined) {
                            patterns["g"] = patterns["f"].replace(patterns["D"], patterns["d"]); // Generic: Short date, short time
                            patterns["G"] = patterns["F"].replace(patterns["D"], patterns["d"]); // Generic: Short date, long time
                        }
                    }
                })(dateTimeFormat || (dateTimeFormat = {}));
                /**
                 * NumberFormat module contains the static methods for formatting the numbers.
                 * It extends the JQuery.Globalize functionality to support complete set of .NET
                 * formatting expressions for numeric types including custom formats.
                 */
                var numberFormat;
                (function (numberFormat) {
                    var NonScientificFormatRegex = /^\{.+\}.*/;
                    var NumericalPlaceHolderRegex = /\{.+\}/;
                    var ScientificFormatRegex = /e[+-]*[0#]+/i;
                    var StandardFormatRegex = /^[a-z]\d{0,2}$/i; // a letter + up to 2 digits for precision specifier
                    var TrailingZerosRegex = /0+$/;
                    var DecimalFormatRegex = /\.([0#]*)/g;
                    var NumericFormatRegex = /[0#,\.]+[0,#]*/g;
                    // (?=...) is a positive lookahead assertion. The RE is asking for the last digit placeholder, [0#],
                    // which is followed by non-digit placeholders and the end of string, [^0#]*$. But it only matches
                    // the last digit placeholder, not anything that follows because the positive lookahead isn"t included
                    // in the match - it is only a condition.
                    var LastNumericPlaceholderRegex = /([0#])(?=[^0#]*$)/;
                    var DecimalFormatCharacter = ".";
                    numberFormat.NumberFormatComponentsDelimeter = ";";
                    function getNonScientificFormatWithPrecision(baseFormat, numericFormat) {
                        if (!numericFormat || baseFormat === undefined)
                            return baseFormat;
                        var newFormat = "{0:" + numericFormat + "}";
                        return baseFormat.replace("{0}", newFormat);
                    }
                    function getNumericFormat(value, baseFormat) {
                        if (baseFormat == null)
                            return baseFormat;
                        if (hasFormatComponents(baseFormat)) {
                            var _a = numberFormat.getComponents(baseFormat), positive = _a.positive, negative = _a.negative, zero = _a.zero;
                            if (value > 0)
                                return getNumericFormatFromComponent(value, positive);
                            else if (value === 0)
                                return getNumericFormatFromComponent(value, zero);
                            return getNumericFormatFromComponent(value, negative);
                        }
                        return getNumericFormatFromComponent(value, baseFormat);
                    }
                    numberFormat.getNumericFormat = getNumericFormat;
                    function getNumericFormatFromComponent(value, format) {
                        var match = RegExpExtensions.run(NumericFormatRegex, format);
                        if (match)
                            return match[0];
                        return format;
                    }
                    function addDecimalsToFormat(baseFormat, decimals, trailingZeros) {
                        if (decimals == null)
                            return baseFormat;
                        // Default format string
                        if (baseFormat == null)
                            baseFormat = ZeroPlaceholder;
                        if (hasFormatComponents(baseFormat)) {
                            var _a = numberFormat.getComponents(baseFormat), positive = _a.positive, negative = _a.negative, zero = _a.zero;
                            var formats = [positive, negative, zero];
                            for (var i = 0; i < formats.length; i++) {
                                // Update format in formats array
                                formats[i] = addDecimalsToFormatComponent(formats[i], decimals, trailingZeros);
                            }
                            return formats.join(numberFormat.NumberFormatComponentsDelimeter);
                        }
                        return addDecimalsToFormatComponent(baseFormat, decimals, trailingZeros);
                    }
                    numberFormat.addDecimalsToFormat = addDecimalsToFormat;
                    function addDecimalsToFormatComponent(format, decimals, trailingZeros) {
                        decimals = Math.abs(decimals);
                        if (decimals >= 0) {
                            var literals = [];
                            format = formattingEncoder.preserveLiterals(format, literals);
                            var placeholder = trailingZeros ? ZeroPlaceholder : DigitPlaceholder;
                            var decimalPlaceholders = stringExtensions.repeat(placeholder, Math.abs(decimals));
                            var match = RegExpExtensions.run(DecimalFormatRegex, format);
                            if (match) {
                                var beforeDecimal = format.substr(0, match.index);
                                var formatDecimal = format.substr(match.index + 1, match[1].length);
                                var afterDecimal = format.substr(match.index + match[0].length);
                                if (trailingZeros)
                                    // Use explicit decimals argument as placeholders
                                    formatDecimal = decimalPlaceholders;
                                else {
                                    var decimalChange = decimalPlaceholders.length - formatDecimal.length;
                                    if (decimalChange > 0)
                                        // Append decimalPlaceholders to existing decimal portion of format string
                                        formatDecimal = formatDecimal + decimalPlaceholders.slice(-decimalChange);
                                    else if (decimalChange < 0)
                                        // Remove decimals from formatDecimal
                                        formatDecimal = formatDecimal.slice(0, decimalChange);
                                }
                                if (formatDecimal.length > 0)
                                    formatDecimal = DecimalFormatCharacter + formatDecimal;
                                format = beforeDecimal + formatDecimal + afterDecimal;
                            }
                            else if (decimalPlaceholders.length > 0) {
                                // Replace last numeric placeholder with decimal portion
                                format = format.replace(LastNumericPlaceholderRegex, "$1" + DecimalFormatCharacter + decimalPlaceholders);
                            }
                            if (literals.length !== 0)
                                format = formattingEncoder.restoreLiterals(format, literals);
                        }
                        return format;
                    }
                    function hasFormatComponents(format) {
                        return formattingEncoder.removeLiterals(format).indexOf(numberFormat.NumberFormatComponentsDelimeter) !== -1;
                    }
                    numberFormat.hasFormatComponents = hasFormatComponents;
                    function getComponents(format) {
                        var signFormat = {
                            hasNegative: false,
                            positive: format,
                            negative: format,
                            zero: format,
                        };
                        // escape literals so semi-colon in a literal isn't interpreted as a delimiter
                        // NOTE: OK to use the literals extracted here for all three components before since the literals are indexed.
                        // For example, "'pos-lit';'neg-lit'" will get preserved as "\uE000;\uE001" and the literal array will be
                        // ['pos-lit', 'neg-lit']. When the negative components is restored, its \uE001 will select the second
                        // literal.
                        var literals = [];
                        format = formattingEncoder.preserveLiterals(format, literals);
                        var signSpecificFormats = format.split(numberFormat.NumberFormatComponentsDelimeter);
                        var formatCount = signSpecificFormats.length;
                        if (formatCount > 1) {
                            if (literals.length !== 0)
                                signSpecificFormats = signSpecificFormats.map(function (signSpecificFormat) { return formattingEncoder.restoreLiterals(signSpecificFormat, literals); });
                            signFormat.hasNegative = true;
                            signFormat.positive = signFormat.zero = signSpecificFormats[0];
                            signFormat.negative = signSpecificFormats[1];
                            if (formatCount > 2)
                                signFormat.zero = signSpecificFormats[2];
                        }
                        return signFormat;
                    }
                    numberFormat.getComponents = getComponents;
                    var _lastCustomFormatMeta;
                    /** Evaluates if the value can be formatted using the NumberFormat */
                    function canFormat(value) {
                        var result = typeof (value) === "number";
                        return result;
                    }
                    numberFormat.canFormat = canFormat;
                    function isStandardFormat(format) {
                        return StandardFormatRegex.test(format);
                    }
                    numberFormat.isStandardFormat = isStandardFormat;
                    /** Formats the number using specified format expression and culture */
                    function format(value, format, culture) {
                        format = format || "G";
                        try {
                            if (isStandardFormat(format))
                                return formatNumberStandard(value, format, culture);
                            return formatNumberCustom(value, format, culture);
                        }
                        catch (e) {
                            return Globalize.format(value, undefined, culture);
                        }
                    }
                    numberFormat.format = format;
                    /** Performs a custom format with a value override.  Typically used for custom formats showing scaled values. */
                    function formatWithCustomOverride(value, format, nonScientificOverrideFormat, culture) {
                        return formatNumberCustom(value, format, culture, nonScientificOverrideFormat);
                    }
                    numberFormat.formatWithCustomOverride = formatWithCustomOverride;
                    /** Formats the number using standard format expression */
                    function formatNumberStandard(value, format, culture) {
                        var result;
                        var precision = (format.length > 1 ? parseInt(format.substr(1, format.length - 1), 10) : undefined);
                        var numberFormatInfo = culture.numberFormat;
                        var formatChar = format.charAt(0);
                        switch (formatChar) {
                            case "e":
                            case "E":
                                if (precision === undefined) {
                                    precision = 6;
                                }
                                var mantissaDecimalDigits = stringExtensions.repeat("0", precision);
                                format = "0." + mantissaDecimalDigits + formatChar + "+000";
                                result = formatNumberCustom(value, format, culture);
                                break;
                            case "f":
                            case "F":
                                result = precision !== undefined ? value.toFixed(precision) : value.toFixed(numberFormatInfo.decimals);
                                result = localize(result, numberFormatInfo);
                                break;
                            case "g":
                            case "G":
                                var abs = Math.abs(value);
                                if (abs === 0 || (1E-4 <= abs && abs < 1E15)) {
                                    // For the range of 0.0001 to 1,000,000,000,000,000 - use the normal form
                                    result = precision !== undefined ? value.toPrecision(precision) : value.toString();
                                }
                                else {
                                    // Otherwise use exponential
                                    // Assert that value is a number and fall back on returning value if it is not
                                    if (typeof (value) !== "number")
                                        return String(value);
                                    result = precision !== undefined ? value.toExponential(precision) : value.toExponential();
                                    result = result.replace("e", "E");
                                }
                                result = localize(result, numberFormatInfo);
                                break;
                            case "r":
                            case "R":
                                result = value.toString();
                                result = localize(result, numberFormatInfo);
                                break;
                            case "x":
                            case "X":
                                result = value.toString(16);
                                if (formatChar === "X") {
                                    result = result.toUpperCase();
                                }
                                if (precision !== undefined) {
                                    var actualPrecision = result.length;
                                    var isNegative = value < 0;
                                    if (isNegative) {
                                        actualPrecision--;
                                    }
                                    var paddingZerosCount = precision - actualPrecision;
                                    var paddingZeros = undefined;
                                    if (paddingZerosCount > 0) {
                                        paddingZeros = stringExtensions.repeat("0", paddingZerosCount);
                                    }
                                    if (isNegative) {
                                        result = "-" + paddingZeros + result.substr(1);
                                    }
                                    else {
                                        result = paddingZeros + result;
                                    }
                                }
                                result = localize(result, numberFormatInfo);
                                break;
                            default:
                                result = Globalize.format(value, format, culture);
                        }
                        return result;
                    }
                    /** Formats the number using custom format expression */
                    function formatNumberCustom(value, format, culture, nonScientificOverrideFormat) {
                        var result;
                        var numberFormatInfo = culture.numberFormat;
                        if (isFinite(value)) {
                            // Split format by positive[;negative;zero] pattern
                            var formatComponents = getComponents(format);
                            // Pick a format based on the sign of value
                            if (value > 0) {
                                format = formatComponents.positive;
                            }
                            else if (value === 0) {
                                format = formatComponents.zero;
                            }
                            else {
                                format = formatComponents.negative;
                            }
                            // Normalize value if we have an explicit negative format
                            if (formatComponents.hasNegative)
                                value = Math.abs(value);
                            // Get format metadata
                            var formatMeta = getCustomFormatMetadata(format, true /*calculatePrecision*/);
                            // Preserve literals and escaped chars
                            var literals = [];
                            if (formatMeta.hasLiterals) {
                                format = formattingEncoder.preserveLiterals(format, literals);
                            }
                            // Scientific format
                            if (formatMeta.hasE && !nonScientificOverrideFormat) {
                                var scientificMatch = RegExpExtensions.run(ScientificFormatRegex, format);
                                if (scientificMatch) {
                                    // Case 2.1. Scientific custom format
                                    var formatM = format.substr(0, scientificMatch.index);
                                    var formatE = format.substr(scientificMatch.index + 2); // E(+|-)
                                    var precision = getCustomFormatPrecision(formatM, formatMeta);
                                    var scale = getCustomFormatScale(formatM, formatMeta);
                                    if (scale !== 1) {
                                        value = value * scale;
                                    }
                                    // Assert that value is a number and fall back on returning value if it is not
                                    if (typeof (value) !== "number")
                                        return String(value);
                                    var s = value.toExponential(precision);
                                    var indexOfE = s.indexOf("e");
                                    var mantissa = s.substr(0, indexOfE);
                                    var exp = s.substr(indexOfE + 1);
                                    var resultM = fuseNumberWithCustomFormat(mantissa, formatM, numberFormatInfo);
                                    var resultE = fuseNumberWithCustomFormat(exp, formatE, numberFormatInfo);
                                    if (resultE.charAt(0) === "+" && scientificMatch[0].charAt(1) !== "+") {
                                        resultE = resultE.substr(1);
                                    }
                                    var e = scientificMatch[0].charAt(0);
                                    result = resultM + e + resultE;
                                }
                            }
                            // Non scientific format
                            if (result === undefined) {
                                var valueFormatted = void 0;
                                var isValueGlobalized = false;
                                var precision = getCustomFormatPrecision(format, formatMeta);
                                var scale = getCustomFormatScale(format, formatMeta);
                                if (scale !== 1)
                                    value = value * scale;
                                // Rounding
                                value = parseFloat(toNonScientific(value, precision));
                                if (!isFinite(value)) {
                                    // very large and small finite values can become infinite by parseFloat(toNonScientific())
                                    return Globalize.format(value, undefined);
                                }
                                if (nonScientificOverrideFormat) {
                                    // Get numeric format from format string
                                    var numericFormat = numberFormat.getNumericFormat(value, format);
                                    // Add separators and decimalFormat to nonScientificFormat
                                    nonScientificOverrideFormat = getNonScientificFormatWithPrecision(nonScientificOverrideFormat, numericFormat);
                                    // Format the value
                                    valueFormatted = formatting.formattingService.format(nonScientificOverrideFormat, [value], culture.name);
                                    isValueGlobalized = true;
                                }
                                else
                                    valueFormatted = toNonScientific(value, precision);
                                result = fuseNumberWithCustomFormat(valueFormatted, format, numberFormatInfo, nonScientificOverrideFormat, isValueGlobalized);
                            }
                            if (formatMeta.hasLiterals) {
                                result = formattingEncoder.restoreLiterals(result, literals, false);
                            }
                            _lastCustomFormatMeta = formatMeta;
                        }
                        else {
                            return Globalize.format(value, undefined);
                        }
                        return result;
                    }
                    /** Returns string with the fixed point respresentation of the number */
                    function toNonScientific(value, precision) {
                        var result = "";
                        var precisionZeros = 0;
                        // Double precision numbers support actual 15-16 decimal digits of precision.
                        if (precision > 16) {
                            precisionZeros = precision - 16;
                            precision = 16;
                        }
                        var digitsBeforeDecimalPoint = Double.log10(Math.abs(value));
                        if (digitsBeforeDecimalPoint < 16) {
                            if (digitsBeforeDecimalPoint > 0) {
                                var maxPrecision = 16 - digitsBeforeDecimalPoint;
                                if (precision > maxPrecision) {
                                    precisionZeros += precision - maxPrecision;
                                    precision = maxPrecision;
                                }
                            }
                            result = value.toFixed(precision);
                        }
                        else if (digitsBeforeDecimalPoint === 16) {
                            result = value.toFixed(0);
                            precisionZeros += precision;
                            if (precisionZeros > 0) {
                                result += ".";
                            }
                        }
                        else {
                            // Different browsers have different implementations of the toFixed().
                            // In IE it returns fixed format no matter what's the number. In FF and Chrome the method returns exponential format for numbers greater than 1E21.
                            // So we need to check for range and convert the to exponential with the max precision.
                            // Then we convert exponential string to fixed by removing the dot and padding with "power" zeros.
                            // Assert that value is a number and fall back on returning value if it is not
                            if (typeof (value) !== "number")
                                return String(value);
                            result = value.toExponential(15);
                            var indexOfE = result.indexOf("e");
                            if (indexOfE > 0) {
                                var indexOfDot = result.indexOf(".");
                                var mantissa = result.substr(0, indexOfE);
                                var exp = result.substr(indexOfE + 1);
                                var powerZeros = parseInt(exp, 10) - (mantissa.length - indexOfDot - 1);
                                result = mantissa.replace(".", "") + stringExtensions.repeat("0", powerZeros);
                                if (precision > 0) {
                                    result = result + "." + stringExtensions.repeat("0", precision);
                                }
                            }
                        }
                        if (precisionZeros > 0) {
                            result = result + stringExtensions.repeat("0", precisionZeros);
                        }
                        return result;
                    }
                    /**
                     * Returns the formatMetadata of the format
                     * When calculating precision and scale, if format string of
                     * positive[;negative;zero] => positive format will be used
                     * @param (required) format - format string
                     * @param (optional) calculatePrecision - calculate precision of positive format
                     * @param (optional) calculateScale - calculate scale of positive format
                     */
                    function getCustomFormatMetadata(format, calculatePrecision, calculateScale, calculatePartsPerScale) {
                        if (_lastCustomFormatMeta !== undefined && format === _lastCustomFormatMeta.format) {
                            return _lastCustomFormatMeta;
                        }
                        var literals = [];
                        var escaped = formattingEncoder.preserveLiterals(format, literals);
                        var result = {
                            format: format,
                            hasLiterals: literals.length !== 0,
                            hasE: false,
                            hasCommas: false,
                            hasDots: false,
                            hasPercent: false,
                            hasPermile: false,
                            precision: undefined,
                            scale: undefined,
                            partsPerScale: undefined,
                        };
                        for (var i = 0, length_1 = escaped.length; i < length_1; i++) {
                            var c = escaped.charAt(i);
                            switch (c) {
                                case "e":
                                case "E":
                                    result.hasE = true;
                                    break;
                                case ",":
                                    result.hasCommas = true;
                                    break;
                                case ".":
                                    result.hasDots = true;
                                    break;
                                case "%":
                                    result.hasPercent = true;
                                    break;
                                case "\u2030":
                                    result.hasPermile = true;
                                    break;
                            }
                        }
                        // Use positive format for calculating these values
                        var formatComponents = getComponents(format);
                        if (calculatePrecision)
                            result.precision = getCustomFormatPrecision(formatComponents.positive, result);
                        if (calculatePartsPerScale)
                            result.partsPerScale = getCustomFormatPartsPerScale(formatComponents.positive, result);
                        if (calculateScale)
                            result.scale = getCustomFormatScale(formatComponents.positive, result);
                        return result;
                    }
                    numberFormat.getCustomFormatMetadata = getCustomFormatMetadata;
                    /** Returns the decimal precision of format based on the number of # and 0 chars after the decimal point
                      * Important: The input format string needs to be split to the appropriate pos/neg/zero portion to work correctly */
                    function getCustomFormatPrecision(format, formatMeta) {
                        if (formatMeta.precision > -1) {
                            return formatMeta.precision;
                        }
                        var result = 0;
                        if (formatMeta.hasDots) {
                            if (formatMeta.hasLiterals) {
                                format = formattingEncoder.removeLiterals(format);
                            }
                            var dotIndex = format.indexOf(".");
                            if (dotIndex > -1) {
                                var count = format.length;
                                for (var i = dotIndex; i < count; i++) {
                                    var char = format.charAt(i);
                                    if (char.match(NumericPlaceholderRegex))
                                        result++;
                                    // 0.00E+0 :: Break before counting 0 in
                                    // exponential portion of format string
                                    if (char === ExponentialFormatChar)
                                        break;
                                }
                                result = Math.min(19, result);
                            }
                        }
                        formatMeta.precision = result;
                        return result;
                    }
                    function getCustomFormatPartsPerScale(format, formatMeta) {
                        if (formatMeta.partsPerScale != null)
                            return formatMeta.partsPerScale;
                        var result = 1;
                        if (formatMeta.hasPercent && format.indexOf("%") > -1) {
                            result = result * 100;
                        }
                        if (formatMeta.hasPermile && format.indexOf(/* ‰ */ "\u2030") > -1) {
                            result = result * 1000;
                        }
                        formatMeta.partsPerScale = result;
                        return result;
                    }
                    /** Returns the scale factor of the format based on the "%" and scaling "," chars in the format */
                    function getCustomFormatScale(format, formatMeta) {
                        if (formatMeta.scale > -1) {
                            return formatMeta.scale;
                        }
                        var result = getCustomFormatPartsPerScale(format, formatMeta);
                        if (formatMeta.hasCommas) {
                            var dotIndex = format.indexOf(".");
                            if (dotIndex === -1) {
                                dotIndex = format.length;
                            }
                            for (var i = dotIndex - 1; i > -1; i--) {
                                var char = format.charAt(i);
                                if (char === ",") {
                                    result = result / 1000;
                                }
                                else {
                                    break;
                                }
                            }
                        }
                        formatMeta.scale = result;
                        return result;
                    }
                    function fuseNumberWithCustomFormat(value, format, numberFormatInfo, nonScientificOverrideFormat, isValueGlobalized) {
                        var suppressModifyValue = !!nonScientificOverrideFormat;
                        var formatParts = format.split(".", 2);
                        if (formatParts.length === 2) {
                            var wholeFormat = formatParts[0];
                            var fractionFormat = formatParts[1];
                            var displayUnit = "";
                            // Remove display unit from value before splitting on "." as localized display units sometimes end with "."
                            if (nonScientificOverrideFormat) {
                                displayUnit = nonScientificOverrideFormat.replace(NumericalPlaceHolderRegex, "");
                                value = value.replace(displayUnit, "");
                            }
                            var globalizedDecimalSeparator = numberFormatInfo["."];
                            var decimalSeparator = isValueGlobalized ? globalizedDecimalSeparator : ".";
                            var valueParts = value.split(decimalSeparator, 2);
                            var wholeValue = valueParts.length === 1 ? valueParts[0] + displayUnit : valueParts[0];
                            var fractionValue = valueParts.length === 2 ? valueParts[1] + displayUnit : "";
                            fractionValue = fractionValue.replace(TrailingZerosRegex, "");
                            var wholeFormattedValue = fuseNumberWithCustomFormatLeft(wholeValue, wholeFormat, numberFormatInfo, suppressModifyValue);
                            var fractionFormattedValue = fuseNumberWithCustomFormatRight(fractionValue, fractionFormat, suppressModifyValue);
                            if (fractionFormattedValue.fmtOnly || fractionFormattedValue.value === "")
                                return wholeFormattedValue + fractionFormattedValue.value;
                            return wholeFormattedValue + globalizedDecimalSeparator + fractionFormattedValue.value;
                        }
                        return fuseNumberWithCustomFormatLeft(value, format, numberFormatInfo, suppressModifyValue);
                    }
                    function fuseNumberWithCustomFormatLeft(value, format, numberFormatInfo, suppressModifyValue) {
                        var groupSymbolIndex = format.indexOf(",");
                        var enableGroups = groupSymbolIndex > -1 && groupSymbolIndex < Math.max(format.lastIndexOf("0"), format.lastIndexOf("#")) && numberFormatInfo[","];
                        var groupDigitCount = 0;
                        var groupIndex = 0;
                        var groupSizes = numberFormatInfo.groupSizes || [3];
                        var groupSize = groupSizes[0];
                        var groupSeparator = numberFormatInfo[","];
                        var sign = "";
                        var firstChar = value.charAt(0);
                        if (firstChar === "+" || firstChar === "-") {
                            sign = numberFormatInfo[firstChar];
                            value = value.substr(1);
                        }
                        var isZero = value === "0";
                        var result = "";
                        var leftBuffer = "";
                        var vi = value.length - 1;
                        var fmtOnly = true;
                        // Iterate through format chars and replace 0 and # with the digits from the value string
                        for (var fi = format.length - 1; fi > -1; fi--) {
                            var formatChar = format.charAt(fi);
                            switch (formatChar) {
                                case ZeroPlaceholder:
                                case DigitPlaceholder:
                                    fmtOnly = false;
                                    if (leftBuffer !== "") {
                                        result = leftBuffer + result;
                                        leftBuffer = "";
                                    }
                                    if (!suppressModifyValue) {
                                        if (vi > -1 || formatChar === ZeroPlaceholder) {
                                            if (enableGroups) {
                                                // If the groups are enabled we'll need to keep track of the current group index and periodically insert group separator,
                                                if (groupDigitCount === groupSize) {
                                                    result = groupSeparator + result;
                                                    groupIndex++;
                                                    if (groupIndex < groupSizes.length) {
                                                        groupSize = groupSizes[groupIndex];
                                                    }
                                                    groupDigitCount = 1;
                                                }
                                                else {
                                                    groupDigitCount++;
                                                }
                                            }
                                        }
                                        if (vi > -1) {
                                            if (isZero && formatChar === DigitPlaceholder) {
                                            }
                                            else {
                                                result = value.charAt(vi) + result;
                                            }
                                            vi--;
                                        }
                                        else if (formatChar !== DigitPlaceholder) {
                                            result = formatChar + result;
                                        }
                                    }
                                    break;
                                case ",":
                                    // We should skip all the , chars
                                    break;
                                default:
                                    leftBuffer = formatChar + leftBuffer;
                                    break;
                            }
                        }
                        // If the value didn't fit into the number of zeros provided in the format then we should insert the missing part of the value into the result
                        if (!suppressModifyValue) {
                            if (vi > -1 && result !== "") {
                                if (enableGroups) {
                                    while (vi > -1) {
                                        if (groupDigitCount === groupSize) {
                                            result = groupSeparator + result;
                                            groupIndex++;
                                            if (groupIndex < groupSizes.length) {
                                                groupSize = groupSizes[groupIndex];
                                            }
                                            groupDigitCount = 1;
                                        }
                                        else {
                                            groupDigitCount++;
                                        }
                                        result = value.charAt(vi) + result;
                                        vi--;
                                    }
                                }
                                else {
                                    result = value.substr(0, vi + 1) + result;
                                }
                            }
                            // Insert sign in front of the leftBuffer and result
                            return sign + leftBuffer + result;
                        }
                        if (fmtOnly)
                            // If the format doesn't specify any digits to be displayed, then just return the format we've parsed up until now.
                            return sign + leftBuffer + result;
                        return sign + leftBuffer + value + result;
                    }
                    function fuseNumberWithCustomFormatRight(value, format, suppressModifyValue) {
                        var vi = 0;
                        var fCount = format.length;
                        var vCount = value.length;
                        if (suppressModifyValue) {
                            var lastChar = format.charAt(fCount - 1);
                            if (!lastChar.match(NumericPlaceholderRegex))
                                return {
                                    value: value + lastChar,
                                    fmtOnly: value === "",
                                };
                            return {
                                value: value,
                                fmtOnly: value === "",
                            };
                        }
                        var result = "", fmtOnly = true;
                        for (var fi = 0; fi < fCount; fi++) {
                            var formatChar = format.charAt(fi);
                            if (vi < vCount) {
                                switch (formatChar) {
                                    case ZeroPlaceholder:
                                    case DigitPlaceholder:
                                        result += value[vi++];
                                        fmtOnly = false;
                                        break;
                                    default:
                                        result += formatChar;
                                }
                            }
                            else {
                                if (formatChar !== DigitPlaceholder) {
                                    result += formatChar;
                                    fmtOnly = fmtOnly && (formatChar !== ZeroPlaceholder);
                                }
                            }
                        }
                        return {
                            value: result,
                            fmtOnly: fmtOnly,
                        };
                    }
                    function localize(value, dictionary) {
                        var plus = dictionary["+"];
                        var minus = dictionary["-"];
                        var dot = dictionary["."];
                        var comma = dictionary[","];
                        if (plus === "+" && minus === "-" && dot === "." && comma === ",") {
                            return value;
                        }
                        var count = value.length;
                        var result = "";
                        for (var i = 0; i < count; i++) {
                            var char = value.charAt(i);
                            switch (char) {
                                case "+":
                                    result = result + plus;
                                    break;
                                case "-":
                                    result = result + minus;
                                    break;
                                case ".":
                                    result = result + dot;
                                    break;
                                case ",":
                                    result = result + comma;
                                    break;
                                default:
                                    result = result + char;
                                    break;
                            }
                        }
                        return result;
                    }
                })(numberFormat = formatting.numberFormat || (formatting.numberFormat = {}));
                /** DateTimeScaleFormatInfo is used to calculate and keep the Date formats used for different units supported by the DateTimeScaleModel */
                var DateTimeScaleFormatInfo = (function () {
                    // Constructor
                    /**
                     * Creates new instance of the DateTimeScaleFormatInfo class.
                     * @param culture - culture which calendar info is going to be used to derive the formats.
                     */
                    function DateTimeScaleFormatInfo(culture) {
                        var calendar = culture.calendar;
                        var patterns = calendar.patterns;
                        var monthAbbreviations = calendar["months"]["namesAbbr"];
                        var cultureHasMonthAbbr = monthAbbreviations && monthAbbreviations[0];
                        var yearMonthPattern = patterns["Y"];
                        var monthDayPattern = patterns["M"];
                        var fullPattern = patterns["f"];
                        var longTimePattern = patterns["T"];
                        var shortTimePattern = patterns["t"];
                        var separator = fullPattern.indexOf(",") > -1 ? ", " : " ";
                        var hasYearSymbol = yearMonthPattern.indexOf("yyyy'") === 0 && yearMonthPattern.length > 6 && yearMonthPattern[6] === "\'";
                        this.YearPattern = hasYearSymbol ? yearMonthPattern.substr(0, 7) : "yyyy";
                        var yearPos = fullPattern.indexOf("yy");
                        var monthPos = fullPattern.indexOf("MMMM");
                        this.MonthPattern = cultureHasMonthAbbr && monthPos > -1 ? (yearPos > monthPos ? "MMM yyyy" : "yyyy MMM") : yearMonthPattern;
                        this.DayPattern = cultureHasMonthAbbr ? monthDayPattern.replace("MMMM", "MMM") : monthDayPattern;
                        var minutePos = fullPattern.indexOf("mm");
                        var pmPos = fullPattern.indexOf("tt");
                        var shortHourPattern = pmPos > -1 ? shortTimePattern.replace(":mm ", "") : shortTimePattern;
                        this.HourPattern = yearPos < minutePos ? this.DayPattern + separator + shortHourPattern : shortHourPattern + separator + this.DayPattern;
                        this.MinutePattern = shortTimePattern;
                        this.SecondPattern = longTimePattern;
                        this.MillisecondPattern = longTimePattern.replace("ss", "ss.fff");
                        // Special cases
                        switch (culture.name) {
                            case "fi-FI":
                                this.DayPattern = this.DayPattern.replace("'ta'", ""); // Fix for finish 'ta' suffix for month names.
                                this.HourPattern = this.HourPattern.replace("'ta'", "");
                                break;
                        }
                    }
                    // Methods
                    /**
                     * Returns the format string of the provided DateTimeUnit.
                     * @param unit - date or time unit
                     */
                    DateTimeScaleFormatInfo.prototype.getFormatString = function (unit) {
                        switch (unit) {
                            case DateTimeUnit.Year:
                                return this.YearPattern;
                            case DateTimeUnit.Month:
                                return this.MonthPattern;
                            case DateTimeUnit.Week:
                            case DateTimeUnit.Day:
                                return this.DayPattern;
                            case DateTimeUnit.Hour:
                                return this.HourPattern;
                            case DateTimeUnit.Minute:
                                return this.MinutePattern;
                            case DateTimeUnit.Second:
                                return this.SecondPattern;
                            case DateTimeUnit.Millisecond:
                                return this.MillisecondPattern;
                        }
                    };
                    return DateTimeScaleFormatInfo;
                }());
                formatting.formattingService = new FormattingService();
            })(formatting = utils.formatting || (utils.formatting = {}));
        })(utils = extensibility.utils || (extensibility.utils = {}));
    })(extensibility = powerbi.extensibility || (powerbi.extensibility = {}));
})(powerbi || (powerbi = {}));
/*
 *  Power BI Visualizations
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */
"use strict";
var powerbi;
(function (powerbi) {
    var extensibility;
    (function (extensibility) {
        var utils;
        (function (utils) {
            var formatting;
            (function (formatting) {
                /** The system used to determine display units used during formatting */
                var DisplayUnitSystemType;
                (function (DisplayUnitSystemType) {
                    /** Default display unit system, which saves space by using units such as K, M, bn with PowerView rules for when to pick a unit. Suitable for chart axes. */
                    DisplayUnitSystemType[DisplayUnitSystemType["Default"] = 0] = "Default";
                    /** A verbose display unit system that will only respect the formatting defined in the model. Suitable for explore mode single-value cards. */
                    DisplayUnitSystemType[DisplayUnitSystemType["Verbose"] = 1] = "Verbose";
                    /**
                     * A display unit system that uses units such as K, M, bn if we have at least one of those units (e.g. 0.9M is not valid as it's less than 1 million).
                     * Suitable for dashboard tile cards
                     */
                    DisplayUnitSystemType[DisplayUnitSystemType["WholeUnits"] = 2] = "WholeUnits";
                    /**A display unit system that also contains Auto and None units for data labels*/
                    DisplayUnitSystemType[DisplayUnitSystemType["DataLabels"] = 3] = "DataLabels";
                })(DisplayUnitSystemType = formatting.DisplayUnitSystemType || (formatting.DisplayUnitSystemType = {}));
            })(formatting = utils.formatting || (utils.formatting = {}));
        })(utils = extensibility.utils || (extensibility.utils = {}));
    })(extensibility = powerbi.extensibility || (powerbi.extensibility = {}));
})(powerbi || (powerbi = {}));
/*
 *  Power BI Visualizations
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */
"use strict";
var powerbi;
(function (powerbi) {
    var extensibility;
    (function (extensibility) {
        var utils;
        (function (utils) {
            var formatting;
            (function (formatting) {
                var Double = powerbi.extensibility.utils.type.Double;
                var NumberFormat = powerbi.extensibility.utils.formatting.numberFormat;
                var formattingService = powerbi.extensibility.utils.formatting.formattingService;
                // Constants
                var maxExponent = 24;
                var defaultScientificBigNumbersBoundary = 1E15;
                var scientificSmallNumbersBoundary = 1E-4;
                var PERCENTAGE_FORMAT = "%";
                var SCIENTIFIC_FORMAT = "E+0";
                var DEFAULT_SCIENTIFIC_FORMAT = "0.##" + SCIENTIFIC_FORMAT;
                // Regular expressions
                /**
                 * This regex looks for strings that match one of the following conditions:
                 *   - Optionally contain "0", "#", followed by a period, followed by at least one "0" or "#" (Ex. ###,000.###)
                 *   - Contains at least one of "0", "#", or "," (Ex. ###,000)
                 *   - Contain a "g" (indicates to use the general .NET numeric format string)
                 * The entire string (start to end) must match, and the match is not case-sensitive.
                 */
                var SUPPORTED_SCIENTIFIC_FORMATS = /^([0\#,]*\.[0\#]+|[0\#,]+|g)$/i;
                var DisplayUnit = (function () {
                    function DisplayUnit() {
                    }
                    // Methods
                    DisplayUnit.prototype.project = function (value) {
                        if (this.value) {
                            return Double.removeDecimalNoise(value / this.value);
                        }
                        else {
                            return value;
                        }
                    };
                    DisplayUnit.prototype.reverseProject = function (value) {
                        if (this.value) {
                            return value * this.value;
                        }
                        else {
                            return value;
                        }
                    };
                    DisplayUnit.prototype.isApplicableTo = function (value) {
                        value = Math.abs(value);
                        var precision = Double.getPrecision(value, 3);
                        return Double.greaterOrEqualWithPrecision(value, this.applicableRangeMin, precision) && Double.lessWithPrecision(value, this.applicableRangeMax, precision);
                    };
                    DisplayUnit.prototype.isScaling = function () {
                        return this.value > 1;
                    };
                    return DisplayUnit;
                }());
                formatting.DisplayUnit = DisplayUnit;
                var DisplayUnitSystem = (function () {
                    // Constructor
                    function DisplayUnitSystem(units) {
                        this.units = units ? units : [];
                    }
                    Object.defineProperty(DisplayUnitSystem.prototype, "title", {
                        // Properties
                        get: function () {
                            return this.displayUnit ? this.displayUnit.title : undefined;
                        },
                        enumerable: true,
                        configurable: true
                    });
                    // Methods
                    DisplayUnitSystem.prototype.update = function (value) {
                        if (value === undefined)
                            return;
                        this.unitBaseValue = value;
                        this.displayUnit = this.findApplicableDisplayUnit(value);
                    };
                    DisplayUnitSystem.prototype.findApplicableDisplayUnit = function (value) {
                        for (var _i = 0, _a = this.units; _i < _a.length; _i++) {
                            var unit = _a[_i];
                            if (unit.isApplicableTo(value))
                                return unit;
                        }
                        return undefined;
                    };
                    DisplayUnitSystem.prototype.format = function (value, format, decimals, trailingZeros, cultureSelector) {
                        decimals = this.getNumberOfDecimalsForFormatting(format, decimals);
                        var nonScientificFormat = "";
                        if (this.isFormatSupported(format)
                            && !this.hasScientitifcFormat(format)
                            && this.isScalingUnit()
                            && this.shouldRespectScalingUnit(format)) {
                            value = this.displayUnit.project(value);
                            nonScientificFormat = this.displayUnit.labelFormat;
                        }
                        return this.formatHelper({
                            value: value,
                            nonScientificFormat: nonScientificFormat,
                            format: format,
                            decimals: decimals,
                            trailingZeros: trailingZeros,
                            cultureSelector: cultureSelector
                        });
                    };
                    DisplayUnitSystem.prototype.isFormatSupported = function (format) {
                        return !DisplayUnitSystem.UNSUPPORTED_FORMATS.test(format);
                    };
                    DisplayUnitSystem.prototype.isPercentageFormat = function (format) {
                        return format && format.indexOf(PERCENTAGE_FORMAT) >= 0;
                    };
                    DisplayUnitSystem.prototype.shouldRespectScalingUnit = function (format) {
                        return true;
                    };
                    DisplayUnitSystem.prototype.getNumberOfDecimalsForFormatting = function (format, decimals) {
                        return decimals;
                    };
                    DisplayUnitSystem.prototype.isScalingUnit = function () {
                        return this.displayUnit && this.displayUnit.isScaling();
                    };
                    DisplayUnitSystem.prototype.formatHelper = function (options) {
                        var value = options.value, nonScientificFormat = options.nonScientificFormat, cultureSelector = options.cultureSelector, format = options.format, decimals = options.decimals, trailingZeros = options.trailingZeros;
                        // If the format is "general" and we want to override the number of decimal places then use the default numeric format string.
                        if ((format === "g" || format === "G") && decimals != null) {
                            format = "#,0.00";
                        }
                        format = NumberFormat.addDecimalsToFormat(format, decimals, trailingZeros);
                        if (format && !formattingService.isStandardNumberFormat(format))
                            return formattingService.formatNumberWithCustomOverride(value, format, nonScientificFormat, cultureSelector);
                        if (!format) {
                            format = "G";
                        }
                        if (!nonScientificFormat) {
                            nonScientificFormat = "{0}";
                        }
                        var text = formattingService.formatValue(value, format, cultureSelector);
                        return formattingService.format(nonScientificFormat, [text]);
                    };
                    /** Formats a single value by choosing an appropriate base for the DisplayUnitSystem before formatting. */
                    DisplayUnitSystem.prototype.formatSingleValue = function (value, format, decimals, trailingZeros, cultureSelector) {
                        // Change unit base to a value appropriate for this value
                        this.update(this.shouldUseValuePrecision(value) ? Double.getPrecision(value, 8) : value);
                        return this.format(value, format, decimals, trailingZeros, cultureSelector);
                    };
                    DisplayUnitSystem.prototype.shouldUseValuePrecision = function (value) {
                        if (this.units.length === 0)
                            return true;
                        // Check if the value is big enough to have a valid unit by checking against the smallest unit (that it's value bigger than 1).
                        var applicableRangeMin = 0;
                        for (var i = 0; i < this.units.length; i++) {
                            if (this.units[i].isScaling()) {
                                applicableRangeMin = this.units[i].applicableRangeMin;
                                break;
                            }
                        }
                        return Math.abs(value) < applicableRangeMin;
                    };
                    DisplayUnitSystem.prototype.isScientific = function (value) {
                        return value < -defaultScientificBigNumbersBoundary || value > defaultScientificBigNumbersBoundary ||
                            (-scientificSmallNumbersBoundary < value && value < scientificSmallNumbersBoundary && value !== 0);
                    };
                    DisplayUnitSystem.prototype.hasScientitifcFormat = function (format) {
                        return format && format.toUpperCase().indexOf("E") !== -1;
                    };
                    DisplayUnitSystem.prototype.supportsScientificFormat = function (format) {
                        if (format)
                            return SUPPORTED_SCIENTIFIC_FORMATS.test(format);
                        return true;
                    };
                    DisplayUnitSystem.prototype.shouldFallbackToScientific = function (value, format) {
                        return !this.hasScientitifcFormat(format)
                            && this.supportsScientificFormat(format)
                            && this.isScientific(value);
                    };
                    DisplayUnitSystem.prototype.getScientificFormat = function (data, format, decimals, trailingZeros) {
                        // Use scientific format outside of the range
                        if (this.isFormatSupported(format) && this.shouldFallbackToScientific(data, format)) {
                            var numericFormat = NumberFormat.getNumericFormat(data, format);
                            if (decimals)
                                numericFormat = NumberFormat.addDecimalsToFormat(numericFormat ? numericFormat : "0", Math.abs(decimals), trailingZeros);
                            if (numericFormat)
                                return numericFormat + SCIENTIFIC_FORMAT;
                            else
                                return DEFAULT_SCIENTIFIC_FORMAT;
                        }
                        return format;
                    };
                    return DisplayUnitSystem;
                }());
                DisplayUnitSystem.UNSUPPORTED_FORMATS = /^(p\d*)|(e\d*)$/i;
                formatting.DisplayUnitSystem = DisplayUnitSystem;
                /** Provides a unit system that is defined by formatting in the model, and is suitable for visualizations shown in single number visuals in explore mode. */
                var NoDisplayUnitSystem = (function (_super) {
                    __extends(NoDisplayUnitSystem, _super);
                    // Constructor
                    function NoDisplayUnitSystem() {
                        return _super.call(this, []) || this;
                    }
                    return NoDisplayUnitSystem;
                }(DisplayUnitSystem));
                formatting.NoDisplayUnitSystem = NoDisplayUnitSystem;
                /** Provides a unit system that creates a more concise format for displaying values. This is suitable for most of the cases where
                    we are showing values (chart axes) and as such it is the default unit system. */
                var DefaultDisplayUnitSystem = (function (_super) {
                    __extends(DefaultDisplayUnitSystem, _super);
                    // Constructor
                    function DefaultDisplayUnitSystem(unitLookup) {
                        return _super.call(this, DefaultDisplayUnitSystem.getUnits(unitLookup)) || this;
                    }
                    // Methods
                    DefaultDisplayUnitSystem.prototype.format = function (data, format, decimals, trailingZeros, cultureSelector) {
                        format = this.getScientificFormat(data, format, decimals, trailingZeros);
                        return _super.prototype.format.call(this, data, format, decimals, trailingZeros, cultureSelector);
                    };
                    DefaultDisplayUnitSystem.reset = function () {
                        DefaultDisplayUnitSystem.units = null;
                    };
                    DefaultDisplayUnitSystem.getUnits = function (unitLookup) {
                        if (!DefaultDisplayUnitSystem.units) {
                            DefaultDisplayUnitSystem.units = createDisplayUnits(unitLookup, function (value, previousUnitValue, min) {
                                // When dealing with millions/billions/trillions we need to switch to millions earlier: for example instead of showing 100K 200K 300K we should show 0.1M 0.2M 0.3M etc
                                if (value - previousUnitValue >= 1000) {
                                    return value / 10;
                                }
                                return min;
                            });
                            // Ensure last unit has max of infinity
                            DefaultDisplayUnitSystem.units[DefaultDisplayUnitSystem.units.length - 1].applicableRangeMax = Infinity;
                        }
                        return DefaultDisplayUnitSystem.units;
                    };
                    return DefaultDisplayUnitSystem;
                }(DisplayUnitSystem));
                formatting.DefaultDisplayUnitSystem = DefaultDisplayUnitSystem;
                /** Provides a unit system that creates a more concise format for displaying values, but only allows showing a unit if we have at least
                    one of those units (e.g. 0.9M is not allowed since it's less than 1 million). This is suitable for cases such as dashboard tiles
                    where we have restricted space but do not want to show partial units. */
                var WholeUnitsDisplayUnitSystem = (function (_super) {
                    __extends(WholeUnitsDisplayUnitSystem, _super);
                    // Constructor
                    function WholeUnitsDisplayUnitSystem(unitLookup) {
                        return _super.call(this, WholeUnitsDisplayUnitSystem.getUnits(unitLookup)) || this;
                    }
                    WholeUnitsDisplayUnitSystem.reset = function () {
                        WholeUnitsDisplayUnitSystem.units = null;
                    };
                    WholeUnitsDisplayUnitSystem.getUnits = function (unitLookup) {
                        if (!WholeUnitsDisplayUnitSystem.units) {
                            WholeUnitsDisplayUnitSystem.units = createDisplayUnits(unitLookup);
                            // Ensure last unit has max of infinity
                            WholeUnitsDisplayUnitSystem.units[WholeUnitsDisplayUnitSystem.units.length - 1].applicableRangeMax = Infinity;
                        }
                        return WholeUnitsDisplayUnitSystem.units;
                    };
                    WholeUnitsDisplayUnitSystem.prototype.format = function (data, format, decimals, trailingZeros, cultureSelector) {
                        format = this.getScientificFormat(data, format, decimals, trailingZeros);
                        return _super.prototype.format.call(this, data, format, decimals, trailingZeros, cultureSelector);
                    };
                    return WholeUnitsDisplayUnitSystem;
                }(DisplayUnitSystem));
                formatting.WholeUnitsDisplayUnitSystem = WholeUnitsDisplayUnitSystem;
                var DataLabelsDisplayUnitSystem = (function (_super) {
                    __extends(DataLabelsDisplayUnitSystem, _super);
                    function DataLabelsDisplayUnitSystem(unitLookup) {
                        return _super.call(this, DataLabelsDisplayUnitSystem.getUnits(unitLookup)) || this;
                    }
                    DataLabelsDisplayUnitSystem.prototype.isFormatSupported = function (format) {
                        return !DataLabelsDisplayUnitSystem.UNSUPPORTED_FORMATS.test(format);
                    };
                    DataLabelsDisplayUnitSystem.getUnits = function (unitLookup) {
                        if (!DataLabelsDisplayUnitSystem.units) {
                            var units = [];
                            var adjustMinBasedOnPreviousUnit = function (value, previousUnitValue, min) {
                                // Never returns true, we are always ignoring
                                // We do not early switch (e.g. 100K instead of 0.1M)
                                // Intended? If so, remove this function, otherwise, remove if statement
                                if (value === -1)
                                    if (value - previousUnitValue >= 1000) {
                                        return value / 10;
                                    }
                                return min;
                            };
                            // Add Auto & None
                            var names = unitLookup(-1);
                            addUnitIfNonEmpty(units, DataLabelsDisplayUnitSystem.AUTO_DISPLAYUNIT_VALUE, names.title, names.format, adjustMinBasedOnPreviousUnit);
                            names = unitLookup(0);
                            addUnitIfNonEmpty(units, DataLabelsDisplayUnitSystem.NONE_DISPLAYUNIT_VALUE, names.title, names.format, adjustMinBasedOnPreviousUnit);
                            // Add normal units
                            DataLabelsDisplayUnitSystem.units = units.concat(createDisplayUnits(unitLookup, adjustMinBasedOnPreviousUnit));
                            // Ensure last unit has max of infinity
                            DataLabelsDisplayUnitSystem.units[DataLabelsDisplayUnitSystem.units.length - 1].applicableRangeMax = Infinity;
                        }
                        return DataLabelsDisplayUnitSystem.units;
                    };
                    DataLabelsDisplayUnitSystem.prototype.format = function (data, format, decimals, trailingZeros, cultureSelector) {
                        format = this.getScientificFormat(data, format, decimals, trailingZeros);
                        return _super.prototype.format.call(this, data, format, decimals, trailingZeros, cultureSelector);
                    };
                    return DataLabelsDisplayUnitSystem;
                }(DisplayUnitSystem));
                // Constants
                DataLabelsDisplayUnitSystem.AUTO_DISPLAYUNIT_VALUE = 0;
                DataLabelsDisplayUnitSystem.NONE_DISPLAYUNIT_VALUE = 1;
                DataLabelsDisplayUnitSystem.UNSUPPORTED_FORMATS = /^(e\d*)$/i;
                formatting.DataLabelsDisplayUnitSystem = DataLabelsDisplayUnitSystem;
                function createDisplayUnits(unitLookup, adjustMinBasedOnPreviousUnit) {
                    var units = [];
                    for (var i = 3; i < maxExponent; i++) {
                        var names = unitLookup(i);
                        if (names)
                            addUnitIfNonEmpty(units, Double.pow10(i), names.title, names.format, adjustMinBasedOnPreviousUnit);
                    }
                    return units;
                }
                function addUnitIfNonEmpty(units, value, title, labelFormat, adjustMinBasedOnPreviousUnit) {
                    if (title || labelFormat) {
                        var min = value;
                        if (units.length > 0) {
                            var previousUnit = units[units.length - 1];
                            if (adjustMinBasedOnPreviousUnit)
                                min = adjustMinBasedOnPreviousUnit(value, previousUnit.value, min);
                            previousUnit.applicableRangeMax = min;
                        }
                        var unit = new DisplayUnit();
                        unit.value = value;
                        unit.applicableRangeMin = min;
                        unit.applicableRangeMax = min * 1000;
                        unit.title = title;
                        unit.labelFormat = labelFormat;
                        units.push(unit);
                    }
                }
            })(formatting = utils.formatting || (utils.formatting = {}));
        })(utils = extensibility.utils || (extensibility.utils = {}));
    })(extensibility = powerbi.extensibility || (powerbi.extensibility = {}));
})(powerbi || (powerbi = {}));
/*
 *  Power BI Visualizations
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */
"use strict";
/**
 * Contains functions/constants to aid in text manupilation.
 */
var powerbi;
(function (powerbi) {
    var extensibility;
    (function (extensibility) {
        var utils;
        (function (utils) {
            var formatting;
            (function (formatting) {
                var textUtil;
                (function (textUtil) {
                    /**
                     * Remove breaking spaces from given string and replace by none breaking space (&nbsp).
                     */
                    function removeBreakingSpaces(str) {
                        return str.toString().replace(new RegExp(" ", "g"), "&nbsp");
                    }
                    textUtil.removeBreakingSpaces = removeBreakingSpaces;
                    /**
                     * Remove ellipses from a given string
                     */
                    function removeEllipses(str) {
                        return str.replace(/(…)|(\.\.\.)/g, "");
                    }
                    textUtil.removeEllipses = removeEllipses;
                    /**
                    * Replace every whitespace (0x20) with Non-Breaking Space (0xA0)
                     * @param {string} txt String to replace White spaces
                     * @returns Text after replcing white spaces
                     */
                    function replaceSpaceWithNBSP(txt) {
                        if (txt != null) {
                            return txt.replace(/ /g, "\xA0");
                        }
                    }
                    textUtil.replaceSpaceWithNBSP = replaceSpaceWithNBSP;
                })(textUtil = formatting.textUtil || (formatting.textUtil = {}));
            })(formatting = utils.formatting || (utils.formatting = {}));
        })(utils = extensibility.utils || (extensibility.utils = {}));
    })(extensibility = powerbi.extensibility || (powerbi.extensibility = {}));
})(powerbi || (powerbi = {}));
/*
 *  Power BI Visualizations
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */
"use strict";
var powerbi;
(function (powerbi) {
    var extensibility;
    (function (extensibility) {
        var utils;
        (function (utils) {
            var formatting;
            (function (formatting) {
                // powerbi.extensibility.utils.type
                var ValueType = powerbi.extensibility.utils.type.ValueType;
                var PrimitiveType = powerbi.extensibility.utils.type.PrimitiveType;
                var Double = powerbi.extensibility.utils.type.Double;
                // powerbi.extensibility.utils.formatting
                var stringExtensions = powerbi.extensibility.utils.formatting.stringExtensions;
                var DisplayUnitSystemType = powerbi.extensibility.utils.formatting.DisplayUnitSystemType;
                var DefaultDisplayUnitSystem = powerbi.extensibility.utils.formatting.DefaultDisplayUnitSystem;
                var NumberFormat = powerbi.extensibility.utils.formatting.numberFormat;
                var WholeUnitsDisplayUnitSystem = powerbi.extensibility.utils.formatting.WholeUnitsDisplayUnitSystem;
                var DateTimeSequence = powerbi.extensibility.utils.formatting.DateTimeSequence;
                var NoDisplayUnitSystem = powerbi.extensibility.utils.formatting.NoDisplayUnitSystem;
                var DataLabelsDisplayUnitSystem = powerbi.extensibility.utils.formatting.DataLabelsDisplayUnitSystem;
                var formattingService = powerbi.extensibility.utils.formatting.formattingService;
                // powerbi.extensibility.utils.dataview
                var DataViewObjects = powerbi.extensibility.utils.dataview.DataViewObjects;
                var valueFormatter;
                (function (valueFormatter) {
                    var StringExtensions = stringExtensions;
                    var BeautifiedFormat = {
                        "0.00 %;-0.00 %;0.00 %": "Percentage",
                        "0.0 %;-0.0 %;0.0 %": "Percentage1",
                    };
                    valueFormatter.DefaultIntegerFormat = "g";
                    valueFormatter.DefaultNumericFormat = "#,0.00";
                    valueFormatter.DefaultDateFormat = "d";
                    var defaultLocalizedStrings = {
                        "NullValue": "(Blank)",
                        "BooleanTrue": "True",
                        "BooleanFalse": "False",
                        "NaNValue": "NaN",
                        "InfinityValue": "+Infinity",
                        "NegativeInfinityValue": "-Infinity",
                        "RestatementComma": "{0}, {1}",
                        "RestatementCompoundAnd": "{0} and {1}",
                        "RestatementCompoundOr": "{0} or {1}",
                        "DisplayUnitSystem_EAuto_Title": "Auto",
                        "DisplayUnitSystem_E0_Title": "None",
                        "DisplayUnitSystem_E3_LabelFormat": "{0}K",
                        "DisplayUnitSystem_E3_Title": "Thousands",
                        "DisplayUnitSystem_E6_LabelFormat": "{0}M",
                        "DisplayUnitSystem_E6_Title": "Millions",
                        "DisplayUnitSystem_E9_LabelFormat": "{0}bn",
                        "DisplayUnitSystem_E9_Title": "Billions",
                        "DisplayUnitSystem_E12_LabelFormat": "{0}T",
                        "DisplayUnitSystem_E12_Title": "Trillions",
                        "Percentage": "#,0.##%",
                        "Percentage1": "#,0.#%",
                        "TableTotalLabel": "Total",
                        "Tooltip_HighlightedValueDisplayName": "Highlighted",
                        "Funnel_PercentOfFirst": "Percent of first",
                        "Funnel_PercentOfPrevious": "Percent of previous",
                        "Funnel_PercentOfFirst_Highlight": "Percent of first (highlighted)",
                        "Funnel_PercentOfPrevious_Highlight": "Percent of previous (highlighted)",
                        // Geotagging strings
                        "GeotaggingString_Continent": "continent",
                        "GeotaggingString_Continents": "continents",
                        "GeotaggingString_Country": "country",
                        "GeotaggingString_Countries": "countries",
                        "GeotaggingString_State": "state",
                        "GeotaggingString_States": "states",
                        "GeotaggingString_City": "city",
                        "GeotaggingString_Cities": "cities",
                        "GeotaggingString_Town": "town",
                        "GeotaggingString_Towns": "towns",
                        "GeotaggingString_Province": "province",
                        "GeotaggingString_Provinces": "provinces",
                        "GeotaggingString_County": "county",
                        "GeotaggingString_Counties": "counties",
                        "GeotaggingString_Village": "village",
                        "GeotaggingString_Villages": "villages",
                        "GeotaggingString_Post": "post",
                        "GeotaggingString_Zip": "zip",
                        "GeotaggingString_Code": "code",
                        "GeotaggingString_Place": "place",
                        "GeotaggingString_Places": "places",
                        "GeotaggingString_Address": "address",
                        "GeotaggingString_Addresses": "addresses",
                        "GeotaggingString_Street": "street",
                        "GeotaggingString_Streets": "streets",
                        "GeotaggingString_Longitude": "longitude",
                        "GeotaggingString_Longitude_Short": "lon",
                        "GeotaggingString_Longitude_Short2": "long",
                        "GeotaggingString_Latitude": "latitude",
                        "GeotaggingString_Latitude_Short": "lat",
                        "GeotaggingString_PostalCode": "postal code",
                        "GeotaggingString_PostalCodes": "postal codes",
                        "GeotaggingString_ZipCode": "zip code",
                        "GeotaggingString_ZipCodes": "zip codes",
                        "GeotaggingString_Territory": "territory",
                        "GeotaggingString_Territories": "territories",
                    };
                    function beautify(format) {
                        var key = BeautifiedFormat[format];
                        if (key)
                            return defaultLocalizedStrings[key] || format;
                        return format;
                    }
                    function describeUnit(exponent) {
                        var exponentLookup = (exponent === -1) ? "Auto" : exponent.toString();
                        var title = defaultLocalizedStrings["DisplayUnitSystem_E" + exponentLookup + "_Title"];
                        var format = (exponent <= 0) ? "{0}" : defaultLocalizedStrings["DisplayUnitSystem_E" + exponentLookup + "_LabelFormat"];
                        if (title || format)
                            return { title: title, format: format };
                    }
                    function getLocalizedString(stringId) {
                        return defaultLocalizedStrings[stringId];
                    }
                    valueFormatter.getLocalizedString = getLocalizedString;
                    // NOTE: Define default locale options, but these can be overriden by setLocaleOptions.
                    var localizationOptions = {
                        nullValue: defaultLocalizedStrings["NullValue"],
                        trueValue: defaultLocalizedStrings["BooleanTrue"],
                        falseValue: defaultLocalizedStrings["BooleanFalse"],
                        NaN: defaultLocalizedStrings["NaNValue"],
                        infinity: defaultLocalizedStrings["InfinityValue"],
                        negativeInfinity: defaultLocalizedStrings["NegativeInfinityValue"],
                        beautify: function (format) { return beautify(format); },
                        describe: function (exponent) { return describeUnit(exponent); },
                        restatementComma: defaultLocalizedStrings["RestatementComma"],
                        restatementCompoundAnd: defaultLocalizedStrings["RestatementCompoundAnd"],
                        restatementCompoundOr: defaultLocalizedStrings["RestatementCompoundOr"],
                    };
                    var MaxScaledDecimalPlaces = 2;
                    var MaxValueForDisplayUnitRounding = 1000;
                    var MinIntegerValueForDisplayUnits = 10000;
                    var MinPrecisionForDisplayUnits = 2;
                    var DateTimeMetadataColumn = {
                        displayName: "",
                        type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.DateTime),
                    };
                    function getFormatMetadata(format) {
                        return NumberFormat.getCustomFormatMetadata(format);
                    }
                    valueFormatter.getFormatMetadata = getFormatMetadata;
                    function setLocaleOptions(options) {
                        localizationOptions = options;
                        DefaultDisplayUnitSystem.reset();
                        WholeUnitsDisplayUnitSystem.reset();
                    }
                    valueFormatter.setLocaleOptions = setLocaleOptions;
                    function createDefaultFormatter(formatString, allowFormatBeautification, cultureSelector) {
                        var formatBeautified = allowFormatBeautification
                            ? localizationOptions.beautify(formatString)
                            : formatString;
                        return {
                            format: function (value) {
                                if (value == null) {
                                    return localizationOptions.nullValue;
                                }
                                return formatCore({
                                    value: value,
                                    cultureSelector: cultureSelector,
                                    format: formatBeautified
                                });
                            }
                        };
                    }
                    valueFormatter.createDefaultFormatter = createDefaultFormatter;
                    /** Creates an IValueFormatter to be used for a range of values. */
                    function create(options) {
                        var format = !!options.allowFormatBeautification
                            ? localizationOptions.beautify(options.format)
                            : options.format;
                        var cultureSelector = options.cultureSelector;
                        if (shouldUseNumericDisplayUnits(options)) {
                            var displayUnitSystem_1 = createDisplayUnitSystem(options.displayUnitSystemType);
                            var singleValueFormattingMode_1 = !!options.formatSingleValues;
                            displayUnitSystem_1.update(Math.max(Math.abs(options.value || 0), Math.abs(options.value2 || 0)));
                            var forcePrecision_1 = options.precision != null;
                            var decimals_1;
                            if (forcePrecision_1)
                                decimals_1 = -options.precision;
                            else if (displayUnitSystem_1.displayUnit && displayUnitSystem_1.displayUnit.value > 1)
                                decimals_1 = -MaxScaledDecimalPlaces;
                            return {
                                format: function (value) {
                                    var formattedValue = getStringFormat(value, true /*nullsAreBlank*/);
                                    if (!StringExtensions.isNullOrUndefinedOrWhiteSpaceString(formattedValue)) {
                                        return formattedValue;
                                    }
                                    // Round to Double.DEFAULT_PRECISION
                                    if (value
                                        && !displayUnitSystem_1.isScalingUnit()
                                        && Math.abs(value) < MaxValueForDisplayUnitRounding
                                        && !forcePrecision_1) {
                                        value = Double.roundToPrecision(value);
                                    }
                                    return singleValueFormattingMode_1
                                        ? displayUnitSystem_1.formatSingleValue(value, format, decimals_1, forcePrecision_1, cultureSelector)
                                        : displayUnitSystem_1.format(value, format, decimals_1, forcePrecision_1, cultureSelector);
                                },
                                displayUnit: displayUnitSystem_1.displayUnit,
                                options: options
                            };
                        }
                        if (shouldUseDateUnits(options.value, options.value2, options.tickCount)) {
                            var unit_1 = DateTimeSequence.getIntervalUnit(options.value /* minDate */, options.value2 /* maxDate */, options.tickCount);
                            return {
                                format: function (value) {
                                    if (value == null) {
                                        return localizationOptions.nullValue;
                                    }
                                    var formatString = formattingService.dateFormatString(unit_1);
                                    return formatCore({
                                        value: value,
                                        cultureSelector: cultureSelector,
                                        format: formatString,
                                    });
                                },
                                options: options
                            };
                        }
                        return createDefaultFormatter(format, false, cultureSelector);
                    }
                    valueFormatter.create = create;
                    function format(value, format, allowFormatBeautification, cultureSelector) {
                        if (value == null) {
                            return localizationOptions.nullValue;
                        }
                        var formatString = !!allowFormatBeautification
                            ? localizationOptions.beautify(format)
                            : format;
                        return formatCore({
                            value: value,
                            cultureSelector: cultureSelector,
                            format: formatString
                        });
                    }
                    valueFormatter.format = format;
                    /**
                     * Value formatting function to handle variant measures.
                     * For a Date/Time value within a non-date/time field, it's formatted with the default date/time formatString instead of as a number
                     * @param {any} value Value to be formatted
                     * @param {DataViewMetadataColumn} column Field which the value belongs to
                     * @param {DataViewObjectPropertyIdentifier} formatStringProp formatString Property ID
                     * @param {boolean} nullsAreBlank? Whether to show "(Blank)" instead of empty string for null values
                     * @returns Formatted value
                     */
                    function formatVariantMeasureValue(value, column, formatStringProp, nullsAreBlank, cultureSelector) {
                        // If column type is not datetime, but the value is of time datetime,
                        // then use the default date format string
                        if (!(column && column.type && column.type.dateTime) && value instanceof Date) {
                            var valueFormat = getFormatString(DateTimeMetadataColumn, null, false);
                            return formatCore({
                                value: value,
                                nullsAreBlank: nullsAreBlank,
                                cultureSelector: cultureSelector,
                                format: valueFormat
                            });
                        }
                        else {
                            var valueFormat = getFormatString(column, formatStringProp);
                            return formatCore({
                                value: value,
                                nullsAreBlank: nullsAreBlank,
                                cultureSelector: cultureSelector,
                                format: valueFormat
                            });
                        }
                    }
                    valueFormatter.formatVariantMeasureValue = formatVariantMeasureValue;
                    function createDisplayUnitSystem(displayUnitSystemType) {
                        if (displayUnitSystemType == null)
                            return new DefaultDisplayUnitSystem(localizationOptions.describe);
                        switch (displayUnitSystemType) {
                            case DisplayUnitSystemType.Default:
                                return new DefaultDisplayUnitSystem(localizationOptions.describe);
                            case DisplayUnitSystemType.WholeUnits:
                                return new WholeUnitsDisplayUnitSystem(localizationOptions.describe);
                            case DisplayUnitSystemType.Verbose:
                                return new NoDisplayUnitSystem();
                            case DisplayUnitSystemType.DataLabels:
                                return new DataLabelsDisplayUnitSystem(localizationOptions.describe);
                            default:
                                return new DefaultDisplayUnitSystem(localizationOptions.describe);
                        }
                    }
                    valueFormatter.createDisplayUnitSystem = createDisplayUnitSystem;
                    function shouldUseNumericDisplayUnits(options) {
                        var value = options.value;
                        var value2 = options.value2;
                        var format = options.format;
                        // For singleValue visuals like card, gauge we don't want to roundoff data to the nearest thousands so format the whole number / integers below 10K to not use display units
                        if (options.formatSingleValues && format) {
                            if (Math.abs(value) < MinIntegerValueForDisplayUnits) {
                                var isCustomFormat = !NumberFormat.isStandardFormat(format);
                                if (isCustomFormat) {
                                    var precision = NumberFormat.getCustomFormatMetadata(format, true /*calculatePrecision*/).precision;
                                    if (precision < MinPrecisionForDisplayUnits)
                                        return false;
                                }
                                else if (Double.isInteger(value))
                                    return false;
                            }
                        }
                        if ((typeof value === "number") || (typeof value2 === "number")) {
                            return true;
                        }
                    }
                    function shouldUseDateUnits(value, value2, tickCount) {
                        // must check both value and value2 because we'll need to get an interval for date units
                        return (value instanceof Date) && (value2 instanceof Date) && (tickCount !== undefined && tickCount !== null);
                    }
                    /*
                     * Get the column format. Order of precendence is:
                     *  1. Column format
                     *  2. Default PowerView policy for column type
                     */
                    function getFormatString(column, formatStringProperty, suppressTypeFallback) {
                        if (column) {
                            if (formatStringProperty) {
                                var propertyValue = DataViewObjects.getValue(column.objects, formatStringProperty);
                                if (propertyValue)
                                    return propertyValue;
                            }
                            if (!suppressTypeFallback) {
                                var columnType = column.type;
                                if (columnType) {
                                    if (columnType.dateTime)
                                        return valueFormatter.DefaultDateFormat;
                                    if (columnType.integer) {
                                        if (columnType.temporal && columnType.temporal.year)
                                            return "0";
                                        return valueFormatter.DefaultIntegerFormat;
                                    }
                                    if (columnType.numeric)
                                        return valueFormatter.DefaultNumericFormat;
                                }
                            }
                        }
                    }
                    valueFormatter.getFormatString = getFormatString;
                    function getFormatStringByColumn(column, suppressTypeFallback) {
                        if (column) {
                            if (column.format) {
                                return column.format;
                            }
                            if (!suppressTypeFallback) {
                                var columnType = column.type;
                                if (columnType) {
                                    if (columnType.dateTime) {
                                        return valueFormatter.DefaultDateFormat;
                                    }
                                    if (columnType.integer) {
                                        if (columnType.temporal && columnType.temporal.year) {
                                            return "0";
                                        }
                                        return valueFormatter.DefaultIntegerFormat;
                                    }
                                    if (columnType.numeric) {
                                        return valueFormatter.DefaultNumericFormat;
                                    }
                                }
                            }
                        }
                        return undefined;
                    }
                    valueFormatter.getFormatStringByColumn = getFormatStringByColumn;
                    function formatListCompound(strings, conjunction) {
                        var result;
                        if (!strings) {
                            return null;
                        }
                        var length = strings.length;
                        if (length > 0) {
                            result = strings[0];
                            var lastIndex = length - 1;
                            for (var i = 1, len = lastIndex; i < len; i++) {
                                var value = strings[i];
                                result = StringExtensions.format(localizationOptions.restatementComma, result, value);
                            }
                            if (length > 1) {
                                var value = strings[lastIndex];
                                result = StringExtensions.format(conjunction, result, value);
                            }
                        }
                        else {
                            result = null;
                        }
                        return result;
                    }
                    /** The returned string will look like 'A, B, ..., and C'  */
                    function formatListAnd(strings) {
                        return formatListCompound(strings, localizationOptions.restatementCompoundAnd);
                    }
                    valueFormatter.formatListAnd = formatListAnd;
                    /** The returned string will look like 'A, B, ..., or C' */
                    function formatListOr(strings) {
                        return formatListCompound(strings, localizationOptions.restatementCompoundOr);
                    }
                    valueFormatter.formatListOr = formatListOr;
                    function formatCore(options) {
                        var value = options.value, format = options.format, nullsAreBlank = options.nullsAreBlank, cultureSelector = options.cultureSelector;
                        var formattedValue = getStringFormat(value, nullsAreBlank ? nullsAreBlank : false);
                        if (!StringExtensions.isNullOrUndefinedOrWhiteSpaceString(formattedValue)) {
                            return formattedValue;
                        }
                        return formattingService.formatValue(value, format, cultureSelector);
                    }
                    function getStringFormat(value, nullsAreBlank) {
                        if (value == null && nullsAreBlank) {
                            return localizationOptions.nullValue;
                        }
                        if (value === true) {
                            return localizationOptions.trueValue;
                        }
                        if (value === false) {
                            return localizationOptions.falseValue;
                        }
                        if (typeof value === "number" && isNaN(value)) {
                            return localizationOptions.NaN;
                        }
                        if (value === Number.NEGATIVE_INFINITY) {
                            return localizationOptions.negativeInfinity;
                        }
                        if (value === Number.POSITIVE_INFINITY) {
                            return localizationOptions.infinity;
                        }
                        return "";
                    }
                    function getDisplayUnits(displayUnitSystemType) {
                        var displayUnitSystem = createDisplayUnitSystem(displayUnitSystemType);
                        return displayUnitSystem.units;
                    }
                    valueFormatter.getDisplayUnits = getDisplayUnits;
                })(valueFormatter = formatting.valueFormatter || (formatting.valueFormatter = {}));
            })(formatting = utils.formatting || (utils.formatting = {}));
        })(utils = extensibility.utils || (extensibility.utils = {}));
    })(extensibility = powerbi.extensibility || (powerbi.extensibility = {}));
})(powerbi || (powerbi = {}));
!function(){function n(n){return n&&(n.ownerDocument||n.document||n).documentElement}function t(n){return n&&(n.ownerDocument&&n.ownerDocument.defaultView||n.document&&n||n.defaultView)}function e(n,t){return t>n?-1:n>t?1:n>=t?0:0/0}function r(n){return null===n?0/0:+n}function u(n){return!isNaN(n)}function i(n){return{left:function(t,e,r,u){for(arguments.length<3&&(r=0),arguments.length<4&&(u=t.length);u>r;){var i=r+u>>>1;n(t[i],e)<0?r=i+1:u=i}return r},right:function(t,e,r,u){for(arguments.length<3&&(r=0),arguments.length<4&&(u=t.length);u>r;){var i=r+u>>>1;n(t[i],e)>0?u=i:r=i+1}return r}}}function o(n){return n.length}function a(n){for(var t=1;n*t%1;)t*=10;return t}function c(n,t){for(var e in t)Object.defineProperty(n.prototype,e,{value:t[e],enumerable:!1})}function l(){this._=Object.create(null)}function s(n){return(n+="")===pa||n[0]===va?va+n:n}function f(n){return(n+="")[0]===va?n.slice(1):n}function h(n){return s(n)in this._}function g(n){return(n=s(n))in this._&&delete this._[n]}function p(){var n=[];for(var t in this._)n.push(f(t));return n}function v(){var n=0;for(var t in this._)++n;return n}function d(){for(var n in this._)return!1;return!0}function m(){this._=Object.create(null)}function y(n){return n}function M(n,t,e){return function(){var r=e.apply(t,arguments);return r===t?n:r}}function x(n,t){if(t in n)return t;t=t.charAt(0).toUpperCase()+t.slice(1);for(var e=0,r=da.length;r>e;++e){var u=da[e]+t;if(u in n)return u}}function b(){}function _(){}function w(n){function t(){for(var t,r=e,u=-1,i=r.length;++u<i;)(t=r[u].on)&&t.apply(this,arguments);return n}var e=[],r=new l;return t.on=function(t,u){var i,o=r.get(t);return arguments.length<2?o&&o.on:(o&&(o.on=null,e=e.slice(0,i=e.indexOf(o)).concat(e.slice(i+1)),r.remove(t)),u&&e.push(r.set(t,{on:u})),n)},t}function S(){ta.event.preventDefault()}function k(){for(var n,t=ta.event;n=t.sourceEvent;)t=n;return t}function E(n){for(var t=new _,e=0,r=arguments.length;++e<r;)t[arguments[e]]=w(t);return t.of=function(e,r){return function(u){try{var i=u.sourceEvent=ta.event;u.target=n,ta.event=u,t[u.type].apply(e,r)}finally{ta.event=i}}},t}function A(n){return ya(n,_a),n}function N(n){return"function"==typeof n?n:function(){return Ma(n,this)}}function C(n){return"function"==typeof n?n:function(){return xa(n,this)}}function z(n,t){function e(){this.removeAttribute(n)}function r(){this.removeAttributeNS(n.space,n.local)}function u(){this.setAttribute(n,t)}function i(){this.setAttributeNS(n.space,n.local,t)}function o(){var e=t.apply(this,arguments);null==e?this.removeAttribute(n):this.setAttribute(n,e)}function a(){var e=t.apply(this,arguments);null==e?this.removeAttributeNS(n.space,n.local):this.setAttributeNS(n.space,n.local,e)}return n=ta.ns.qualify(n),null==t?n.local?r:e:"function"==typeof t?n.local?a:o:n.local?i:u}function q(n){return n.trim().replace(/\s+/g," ")}function L(n){return new RegExp("(?:^|\\s+)"+ta.requote(n)+"(?:\\s+|$)","g")}function T(n){return(n+"").trim().split(/^|\s+/)}function R(n,t){function e(){for(var e=-1;++e<u;)n[e](this,t)}function r(){for(var e=-1,r=t.apply(this,arguments);++e<u;)n[e](this,r)}n=T(n).map(D);var u=n.length;return"function"==typeof t?r:e}function D(n){var t=L(n);return function(e,r){if(u=e.classList)return r?u.add(n):u.remove(n);var u=e.getAttribute("class")||"";r?(t.lastIndex=0,t.test(u)||e.setAttribute("class",q(u+" "+n))):e.setAttribute("class",q(u.replace(t," ")))}}function P(n,t,e){function r(){this.style.removeProperty(n)}function u(){this.style.setProperty(n,t,e)}function i(){var r=t.apply(this,arguments);null==r?this.style.removeProperty(n):this.style.setProperty(n,r,e)}return null==t?r:"function"==typeof t?i:u}function U(n,t){function e(){delete this[n]}function r(){this[n]=t}function u(){var e=t.apply(this,arguments);null==e?delete this[n]:this[n]=e}return null==t?e:"function"==typeof t?u:r}function j(n){function t(){var t=this.ownerDocument,e=this.namespaceURI;return e?t.createElementNS(e,n):t.createElement(n)}function e(){return this.ownerDocument.createElementNS(n.space,n.local)}return"function"==typeof n?n:(n=ta.ns.qualify(n)).local?e:t}function F(){var n=this.parentNode;n&&n.removeChild(this)}function H(n){return{__data__:n}}function O(n){return function(){return ba(this,n)}}function I(n){return arguments.length||(n=e),function(t,e){return t&&e?n(t.__data__,e.__data__):!t-!e}}function Y(n,t){for(var e=0,r=n.length;r>e;e++)for(var u,i=n[e],o=0,a=i.length;a>o;o++)(u=i[o])&&t(u,o,e);return n}function Z(n){return ya(n,Sa),n}function V(n){var t,e;return function(r,u,i){var o,a=n[i].update,c=a.length;for(i!=e&&(e=i,t=0),u>=t&&(t=u+1);!(o=a[t])&&++t<c;);return o}}function X(n,t,e){function r(){var t=this[o];t&&(this.removeEventListener(n,t,t.$),delete this[o])}function u(){var u=c(t,ra(arguments));r.call(this),this.addEventListener(n,this[o]=u,u.$=e),u._=t}function i(){var t,e=new RegExp("^__on([^.]+)"+ta.requote(n)+"$");for(var r in this)if(t=r.match(e)){var u=this[r];this.removeEventListener(t[1],u,u.$),delete this[r]}}var o="__on"+n,a=n.indexOf("."),c=$;a>0&&(n=n.slice(0,a));var l=ka.get(n);return l&&(n=l,c=B),a?t?u:r:t?b:i}function $(n,t){return function(e){var r=ta.event;ta.event=e,t[0]=this.__data__;try{n.apply(this,t)}finally{ta.event=r}}}function B(n,t){var e=$(n,t);return function(n){var t=this,r=n.relatedTarget;r&&(r===t||8&r.compareDocumentPosition(t))||e.call(t,n)}}function W(e){var r=".dragsuppress-"+ ++Aa,u="click"+r,i=ta.select(t(e)).on("touchmove"+r,S).on("dragstart"+r,S).on("selectstart"+r,S);if(null==Ea&&(Ea="onselectstart"in e?!1:x(e.style,"userSelect")),Ea){var o=n(e).style,a=o[Ea];o[Ea]="none"}return function(n){if(i.on(r,null),Ea&&(o[Ea]=a),n){var t=function(){i.on(u,null)};i.on(u,function(){S(),t()},!0),setTimeout(t,0)}}}function J(n,e){e.changedTouches&&(e=e.changedTouches[0]);var r=n.ownerSVGElement||n;if(r.createSVGPoint){var u=r.createSVGPoint();if(0>Na){var i=t(n);if(i.scrollX||i.scrollY){r=ta.select("body").append("svg").style({position:"absolute",top:0,left:0,margin:0,padding:0,border:"none"},"important");var o=r[0][0].getScreenCTM();Na=!(o.f||o.e),r.remove()}}return Na?(u.x=e.pageX,u.y=e.pageY):(u.x=e.clientX,u.y=e.clientY),u=u.matrixTransform(n.getScreenCTM().inverse()),[u.x,u.y]}var a=n.getBoundingClientRect();return[e.clientX-a.left-n.clientLeft,e.clientY-a.top-n.clientTop]}function G(){return ta.event.changedTouches[0].identifier}function K(n){return n>0?1:0>n?-1:0}function Q(n,t,e){return(t[0]-n[0])*(e[1]-n[1])-(t[1]-n[1])*(e[0]-n[0])}function nt(n){return n>1?0:-1>n?qa:Math.acos(n)}function tt(n){return n>1?Ra:-1>n?-Ra:Math.asin(n)}function et(n){return((n=Math.exp(n))-1/n)/2}function rt(n){return((n=Math.exp(n))+1/n)/2}function ut(n){return((n=Math.exp(2*n))-1)/(n+1)}function it(n){return(n=Math.sin(n/2))*n}function ot(){}function at(n,t,e){return this instanceof at?(this.h=+n,this.s=+t,void(this.l=+e)):arguments.length<2?n instanceof at?new at(n.h,n.s,n.l):bt(""+n,_t,at):new at(n,t,e)}function ct(n,t,e){function r(n){return n>360?n-=360:0>n&&(n+=360),60>n?i+(o-i)*n/60:180>n?o:240>n?i+(o-i)*(240-n)/60:i}function u(n){return Math.round(255*r(n))}var i,o;return n=isNaN(n)?0:(n%=360)<0?n+360:n,t=isNaN(t)?0:0>t?0:t>1?1:t,e=0>e?0:e>1?1:e,o=.5>=e?e*(1+t):e+t-e*t,i=2*e-o,new mt(u(n+120),u(n),u(n-120))}function lt(n,t,e){return this instanceof lt?(this.h=+n,this.c=+t,void(this.l=+e)):arguments.length<2?n instanceof lt?new lt(n.h,n.c,n.l):n instanceof ft?gt(n.l,n.a,n.b):gt((n=wt((n=ta.rgb(n)).r,n.g,n.b)).l,n.a,n.b):new lt(n,t,e)}function st(n,t,e){return isNaN(n)&&(n=0),isNaN(t)&&(t=0),new ft(e,Math.cos(n*=Da)*t,Math.sin(n)*t)}function ft(n,t,e){return this instanceof ft?(this.l=+n,this.a=+t,void(this.b=+e)):arguments.length<2?n instanceof ft?new ft(n.l,n.a,n.b):n instanceof lt?st(n.h,n.c,n.l):wt((n=mt(n)).r,n.g,n.b):new ft(n,t,e)}function ht(n,t,e){var r=(n+16)/116,u=r+t/500,i=r-e/200;return u=pt(u)*Xa,r=pt(r)*$a,i=pt(i)*Ba,new mt(dt(3.2404542*u-1.5371385*r-.4985314*i),dt(-.969266*u+1.8760108*r+.041556*i),dt(.0556434*u-.2040259*r+1.0572252*i))}function gt(n,t,e){return n>0?new lt(Math.atan2(e,t)*Pa,Math.sqrt(t*t+e*e),n):new lt(0/0,0/0,n)}function pt(n){return n>.206893034?n*n*n:(n-4/29)/7.787037}function vt(n){return n>.008856?Math.pow(n,1/3):7.787037*n+4/29}function dt(n){return Math.round(255*(.00304>=n?12.92*n:1.055*Math.pow(n,1/2.4)-.055))}function mt(n,t,e){return this instanceof mt?(this.r=~~n,this.g=~~t,void(this.b=~~e)):arguments.length<2?n instanceof mt?new mt(n.r,n.g,n.b):bt(""+n,mt,ct):new mt(n,t,e)}function yt(n){return new mt(n>>16,n>>8&255,255&n)}function Mt(n){return yt(n)+""}function xt(n){return 16>n?"0"+Math.max(0,n).toString(16):Math.min(255,n).toString(16)}function bt(n,t,e){var r,u,i,o=0,a=0,c=0;if(r=/([a-z]+)\((.*)\)/i.exec(n))switch(u=r[2].split(","),r[1]){case"hsl":return e(parseFloat(u[0]),parseFloat(u[1])/100,parseFloat(u[2])/100);case"rgb":return t(kt(u[0]),kt(u[1]),kt(u[2]))}return(i=Ga.get(n.toLowerCase()))?t(i.r,i.g,i.b):(null==n||"#"!==n.charAt(0)||isNaN(i=parseInt(n.slice(1),16))||(4===n.length?(o=(3840&i)>>4,o=o>>4|o,a=240&i,a=a>>4|a,c=15&i,c=c<<4|c):7===n.length&&(o=(16711680&i)>>16,a=(65280&i)>>8,c=255&i)),t(o,a,c))}function _t(n,t,e){var r,u,i=Math.min(n/=255,t/=255,e/=255),o=Math.max(n,t,e),a=o-i,c=(o+i)/2;return a?(u=.5>c?a/(o+i):a/(2-o-i),r=n==o?(t-e)/a+(e>t?6:0):t==o?(e-n)/a+2:(n-t)/a+4,r*=60):(r=0/0,u=c>0&&1>c?0:r),new at(r,u,c)}function wt(n,t,e){n=St(n),t=St(t),e=St(e);var r=vt((.4124564*n+.3575761*t+.1804375*e)/Xa),u=vt((.2126729*n+.7151522*t+.072175*e)/$a),i=vt((.0193339*n+.119192*t+.9503041*e)/Ba);return ft(116*u-16,500*(r-u),200*(u-i))}function St(n){return(n/=255)<=.04045?n/12.92:Math.pow((n+.055)/1.055,2.4)}function kt(n){var t=parseFloat(n);return"%"===n.charAt(n.length-1)?Math.round(2.55*t):t}function Et(n){return"function"==typeof n?n:function(){return n}}function At(n){return function(t,e,r){return 2===arguments.length&&"function"==typeof e&&(r=e,e=null),Nt(t,e,n,r)}}function Nt(n,t,e,r){function u(){var n,t=c.status;if(!t&&zt(c)||t>=200&&300>t||304===t){try{n=e.call(i,c)}catch(r){return void o.error.call(i,r)}o.load.call(i,n)}else o.error.call(i,c)}var i={},o=ta.dispatch("beforesend","progress","load","error"),a={},c=new XMLHttpRequest,l=null;return!this.XDomainRequest||"withCredentials"in c||!/^(http(s)?:)?\/\//.test(n)||(c=new XDomainRequest),"onload"in c?c.onload=c.onerror=u:c.onreadystatechange=function(){c.readyState>3&&u()},c.onprogress=function(n){var t=ta.event;ta.event=n;try{o.progress.call(i,c)}finally{ta.event=t}},i.header=function(n,t){return n=(n+"").toLowerCase(),arguments.length<2?a[n]:(null==t?delete a[n]:a[n]=t+"",i)},i.mimeType=function(n){return arguments.length?(t=null==n?null:n+"",i):t},i.responseType=function(n){return arguments.length?(l=n,i):l},i.response=function(n){return e=n,i},["get","post"].forEach(function(n){i[n]=function(){return i.send.apply(i,[n].concat(ra(arguments)))}}),i.send=function(e,r,u){if(2===arguments.length&&"function"==typeof r&&(u=r,r=null),c.open(e,n,!0),null==t||"accept"in a||(a.accept=t+",*/*"),c.setRequestHeader)for(var s in a)c.setRequestHeader(s,a[s]);return null!=t&&c.overrideMimeType&&c.overrideMimeType(t),null!=l&&(c.responseType=l),null!=u&&i.on("error",u).on("load",function(n){u(null,n)}),o.beforesend.call(i,c),c.send(null==r?null:r),i},i.abort=function(){return c.abort(),i},ta.rebind(i,o,"on"),null==r?i:i.get(Ct(r))}function Ct(n){return 1===n.length?function(t,e){n(null==t?e:null)}:n}function zt(n){var t=n.responseType;return t&&"text"!==t?n.response:n.responseText}function qt(){var n=Lt(),t=Tt()-n;t>24?(isFinite(t)&&(clearTimeout(tc),tc=setTimeout(qt,t)),nc=0):(nc=1,rc(qt))}function Lt(){var n=Date.now();for(ec=Ka;ec;)n>=ec.t&&(ec.f=ec.c(n-ec.t)),ec=ec.n;return n}function Tt(){for(var n,t=Ka,e=1/0;t;)t.f?t=n?n.n=t.n:Ka=t.n:(t.t<e&&(e=t.t),t=(n=t).n);return Qa=n,e}function Rt(n,t){return t-(n?Math.ceil(Math.log(n)/Math.LN10):1)}function Dt(n,t){var e=Math.pow(10,3*ga(8-t));return{scale:t>8?function(n){return n/e}:function(n){return n*e},symbol:n}}function Pt(n){var t=n.decimal,e=n.thousands,r=n.grouping,u=n.currency,i=r&&e?function(n,t){for(var u=n.length,i=[],o=0,a=r[0],c=0;u>0&&a>0&&(c+a+1>t&&(a=Math.max(1,t-c)),i.push(n.substring(u-=a,u+a)),!((c+=a+1)>t));)a=r[o=(o+1)%r.length];return i.reverse().join(e)}:y;return function(n){var e=ic.exec(n),r=e[1]||" ",o=e[2]||">",a=e[3]||"-",c=e[4]||"",l=e[5],s=+e[6],f=e[7],h=e[8],g=e[9],p=1,v="",d="",m=!1,y=!0;switch(h&&(h=+h.substring(1)),(l||"0"===r&&"="===o)&&(l=r="0",o="="),g){case"n":f=!0,g="g";break;case"%":p=100,d="%",g="f";break;case"p":p=100,d="%",g="r";break;case"b":case"o":case"x":case"X":"#"===c&&(v="0"+g.toLowerCase());case"c":y=!1;case"d":m=!0,h=0;break;case"s":p=-1,g="r"}"$"===c&&(v=u[0],d=u[1]),"r"!=g||h||(g="g"),null!=h&&("g"==g?h=Math.max(1,Math.min(21,h)):("e"==g||"f"==g)&&(h=Math.max(0,Math.min(20,h)))),g=oc.get(g)||Ut;var M=l&&f;return function(n){var e=d;if(m&&n%1)return"";var u=0>n||0===n&&0>1/n?(n=-n,"-"):"-"===a?"":a;if(0>p){var c=ta.formatPrefix(n,h);n=c.scale(n),e=c.symbol+d}else n*=p;n=g(n,h);var x,b,_=n.lastIndexOf(".");if(0>_){var w=y?n.lastIndexOf("e"):-1;0>w?(x=n,b=""):(x=n.substring(0,w),b=n.substring(w))}else x=n.substring(0,_),b=t+n.substring(_+1);!l&&f&&(x=i(x,1/0));var S=v.length+x.length+b.length+(M?0:u.length),k=s>S?new Array(S=s-S+1).join(r):"";return M&&(x=i(k+x,k.length?s-b.length:1/0)),u+=v,n=x+b,("<"===o?u+n+k:">"===o?k+u+n:"^"===o?k.substring(0,S>>=1)+u+n+k.substring(S):u+(M?n:k+n))+e}}}function Ut(n){return n+""}function jt(){this._=new Date(arguments.length>1?Date.UTC.apply(this,arguments):arguments[0])}function Ft(n,t,e){function r(t){var e=n(t),r=i(e,1);return r-t>t-e?e:r}function u(e){return t(e=n(new cc(e-1)),1),e}function i(n,e){return t(n=new cc(+n),e),n}function o(n,r,i){var o=u(n),a=[];if(i>1)for(;r>o;)e(o)%i||a.push(new Date(+o)),t(o,1);else for(;r>o;)a.push(new Date(+o)),t(o,1);return a}function a(n,t,e){try{cc=jt;var r=new jt;return r._=n,o(r,t,e)}finally{cc=Date}}n.floor=n,n.round=r,n.ceil=u,n.offset=i,n.range=o;var c=n.utc=Ht(n);return c.floor=c,c.round=Ht(r),c.ceil=Ht(u),c.offset=Ht(i),c.range=a,n}function Ht(n){return function(t,e){try{cc=jt;var r=new jt;return r._=t,n(r,e)._}finally{cc=Date}}}function Ot(n){function t(n){function t(t){for(var e,u,i,o=[],a=-1,c=0;++a<r;)37===n.charCodeAt(a)&&(o.push(n.slice(c,a)),null!=(u=sc[e=n.charAt(++a)])&&(e=n.charAt(++a)),(i=N[e])&&(e=i(t,null==u?"e"===e?" ":"0":u)),o.push(e),c=a+1);return o.push(n.slice(c,a)),o.join("")}var r=n.length;return t.parse=function(t){var r={y:1900,m:0,d:1,H:0,M:0,S:0,L:0,Z:null},u=e(r,n,t,0);if(u!=t.length)return null;"p"in r&&(r.H=r.H%12+12*r.p);var i=null!=r.Z&&cc!==jt,o=new(i?jt:cc);return"j"in r?o.setFullYear(r.y,0,r.j):"w"in r&&("W"in r||"U"in r)?(o.setFullYear(r.y,0,1),o.setFullYear(r.y,0,"W"in r?(r.w+6)%7+7*r.W-(o.getDay()+5)%7:r.w+7*r.U-(o.getDay()+6)%7)):o.setFullYear(r.y,r.m,r.d),o.setHours(r.H+(r.Z/100|0),r.M+r.Z%100,r.S,r.L),i?o._:o},t.toString=function(){return n},t}function e(n,t,e,r){for(var u,i,o,a=0,c=t.length,l=e.length;c>a;){if(r>=l)return-1;if(u=t.charCodeAt(a++),37===u){if(o=t.charAt(a++),i=C[o in sc?t.charAt(a++):o],!i||(r=i(n,e,r))<0)return-1}else if(u!=e.charCodeAt(r++))return-1}return r}function r(n,t,e){_.lastIndex=0;var r=_.exec(t.slice(e));return r?(n.w=w.get(r[0].toLowerCase()),e+r[0].length):-1}function u(n,t,e){x.lastIndex=0;var r=x.exec(t.slice(e));return r?(n.w=b.get(r[0].toLowerCase()),e+r[0].length):-1}function i(n,t,e){E.lastIndex=0;var r=E.exec(t.slice(e));return r?(n.m=A.get(r[0].toLowerCase()),e+r[0].length):-1}function o(n,t,e){S.lastIndex=0;var r=S.exec(t.slice(e));return r?(n.m=k.get(r[0].toLowerCase()),e+r[0].length):-1}function a(n,t,r){return e(n,N.c.toString(),t,r)}function c(n,t,r){return e(n,N.x.toString(),t,r)}function l(n,t,r){return e(n,N.X.toString(),t,r)}function s(n,t,e){var r=M.get(t.slice(e,e+=2).toLowerCase());return null==r?-1:(n.p=r,e)}var f=n.dateTime,h=n.date,g=n.time,p=n.periods,v=n.days,d=n.shortDays,m=n.months,y=n.shortMonths;t.utc=function(n){function e(n){try{cc=jt;var t=new cc;return t._=n,r(t)}finally{cc=Date}}var r=t(n);return e.parse=function(n){try{cc=jt;var t=r.parse(n);return t&&t._}finally{cc=Date}},e.toString=r.toString,e},t.multi=t.utc.multi=ae;var M=ta.map(),x=Yt(v),b=Zt(v),_=Yt(d),w=Zt(d),S=Yt(m),k=Zt(m),E=Yt(y),A=Zt(y);p.forEach(function(n,t){M.set(n.toLowerCase(),t)});var N={a:function(n){return d[n.getDay()]},A:function(n){return v[n.getDay()]},b:function(n){return y[n.getMonth()]},B:function(n){return m[n.getMonth()]},c:t(f),d:function(n,t){return It(n.getDate(),t,2)},e:function(n,t){return It(n.getDate(),t,2)},H:function(n,t){return It(n.getHours(),t,2)},I:function(n,t){return It(n.getHours()%12||12,t,2)},j:function(n,t){return It(1+ac.dayOfYear(n),t,3)},L:function(n,t){return It(n.getMilliseconds(),t,3)},m:function(n,t){return It(n.getMonth()+1,t,2)},M:function(n,t){return It(n.getMinutes(),t,2)},p:function(n){return p[+(n.getHours()>=12)]},S:function(n,t){return It(n.getSeconds(),t,2)},U:function(n,t){return It(ac.sundayOfYear(n),t,2)},w:function(n){return n.getDay()},W:function(n,t){return It(ac.mondayOfYear(n),t,2)},x:t(h),X:t(g),y:function(n,t){return It(n.getFullYear()%100,t,2)},Y:function(n,t){return It(n.getFullYear()%1e4,t,4)},Z:ie,"%":function(){return"%"}},C={a:r,A:u,b:i,B:o,c:a,d:Qt,e:Qt,H:te,I:te,j:ne,L:ue,m:Kt,M:ee,p:s,S:re,U:Xt,w:Vt,W:$t,x:c,X:l,y:Wt,Y:Bt,Z:Jt,"%":oe};return t}function It(n,t,e){var r=0>n?"-":"",u=(r?-n:n)+"",i=u.length;return r+(e>i?new Array(e-i+1).join(t)+u:u)}function Yt(n){return new RegExp("^(?:"+n.map(ta.requote).join("|")+")","i")}function Zt(n){for(var t=new l,e=-1,r=n.length;++e<r;)t.set(n[e].toLowerCase(),e);return t}function Vt(n,t,e){fc.lastIndex=0;var r=fc.exec(t.slice(e,e+1));return r?(n.w=+r[0],e+r[0].length):-1}function Xt(n,t,e){fc.lastIndex=0;var r=fc.exec(t.slice(e));return r?(n.U=+r[0],e+r[0].length):-1}function $t(n,t,e){fc.lastIndex=0;var r=fc.exec(t.slice(e));return r?(n.W=+r[0],e+r[0].length):-1}function Bt(n,t,e){fc.lastIndex=0;var r=fc.exec(t.slice(e,e+4));return r?(n.y=+r[0],e+r[0].length):-1}function Wt(n,t,e){fc.lastIndex=0;var r=fc.exec(t.slice(e,e+2));return r?(n.y=Gt(+r[0]),e+r[0].length):-1}function Jt(n,t,e){return/^[+-]\d{4}$/.test(t=t.slice(e,e+5))?(n.Z=-t,e+5):-1}function Gt(n){return n+(n>68?1900:2e3)}function Kt(n,t,e){fc.lastIndex=0;var r=fc.exec(t.slice(e,e+2));return r?(n.m=r[0]-1,e+r[0].length):-1}function Qt(n,t,e){fc.lastIndex=0;var r=fc.exec(t.slice(e,e+2));return r?(n.d=+r[0],e+r[0].length):-1}function ne(n,t,e){fc.lastIndex=0;var r=fc.exec(t.slice(e,e+3));return r?(n.j=+r[0],e+r[0].length):-1}function te(n,t,e){fc.lastIndex=0;var r=fc.exec(t.slice(e,e+2));return r?(n.H=+r[0],e+r[0].length):-1}function ee(n,t,e){fc.lastIndex=0;var r=fc.exec(t.slice(e,e+2));return r?(n.M=+r[0],e+r[0].length):-1}function re(n,t,e){fc.lastIndex=0;var r=fc.exec(t.slice(e,e+2));return r?(n.S=+r[0],e+r[0].length):-1}function ue(n,t,e){fc.lastIndex=0;var r=fc.exec(t.slice(e,e+3));return r?(n.L=+r[0],e+r[0].length):-1}function ie(n){var t=n.getTimezoneOffset(),e=t>0?"-":"+",r=ga(t)/60|0,u=ga(t)%60;return e+It(r,"0",2)+It(u,"0",2)}function oe(n,t,e){hc.lastIndex=0;var r=hc.exec(t.slice(e,e+1));return r?e+r[0].length:-1}function ae(n){for(var t=n.length,e=-1;++e<t;)n[e][0]=this(n[e][0]);return function(t){for(var e=0,r=n[e];!r[1](t);)r=n[++e];return r[0](t)}}function ce(){}function le(n,t,e){var r=e.s=n+t,u=r-n,i=r-u;e.t=n-i+(t-u)}function se(n,t){n&&dc.hasOwnProperty(n.type)&&dc[n.type](n,t)}function fe(n,t,e){var r,u=-1,i=n.length-e;for(t.lineStart();++u<i;)r=n[u],t.point(r[0],r[1],r[2]);t.lineEnd()}function he(n,t){var e=-1,r=n.length;for(t.polygonStart();++e<r;)fe(n[e],t,1);t.polygonEnd()}function ge(){function n(n,t){n*=Da,t=t*Da/2+qa/4;var e=n-r,o=e>=0?1:-1,a=o*e,c=Math.cos(t),l=Math.sin(t),s=i*l,f=u*c+s*Math.cos(a),h=s*o*Math.sin(a);yc.add(Math.atan2(h,f)),r=n,u=c,i=l}var t,e,r,u,i;Mc.point=function(o,a){Mc.point=n,r=(t=o)*Da,u=Math.cos(a=(e=a)*Da/2+qa/4),i=Math.sin(a)},Mc.lineEnd=function(){n(t,e)}}function pe(n){var t=n[0],e=n[1],r=Math.cos(e);return[r*Math.cos(t),r*Math.sin(t),Math.sin(e)]}function ve(n,t){return n[0]*t[0]+n[1]*t[1]+n[2]*t[2]}function de(n,t){return[n[1]*t[2]-n[2]*t[1],n[2]*t[0]-n[0]*t[2],n[0]*t[1]-n[1]*t[0]]}function me(n,t){n[0]+=t[0],n[1]+=t[1],n[2]+=t[2]}function ye(n,t){return[n[0]*t,n[1]*t,n[2]*t]}function Me(n){var t=Math.sqrt(n[0]*n[0]+n[1]*n[1]+n[2]*n[2]);n[0]/=t,n[1]/=t,n[2]/=t}function xe(n){return[Math.atan2(n[1],n[0]),tt(n[2])]}function be(n,t){return ga(n[0]-t[0])<Ca&&ga(n[1]-t[1])<Ca}function _e(n,t){n*=Da;var e=Math.cos(t*=Da);we(e*Math.cos(n),e*Math.sin(n),Math.sin(t))}function we(n,t,e){++xc,_c+=(n-_c)/xc,wc+=(t-wc)/xc,Sc+=(e-Sc)/xc}function Se(){function n(n,u){n*=Da;var i=Math.cos(u*=Da),o=i*Math.cos(n),a=i*Math.sin(n),c=Math.sin(u),l=Math.atan2(Math.sqrt((l=e*c-r*a)*l+(l=r*o-t*c)*l+(l=t*a-e*o)*l),t*o+e*a+r*c);bc+=l,kc+=l*(t+(t=o)),Ec+=l*(e+(e=a)),Ac+=l*(r+(r=c)),we(t,e,r)}var t,e,r;qc.point=function(u,i){u*=Da;var o=Math.cos(i*=Da);t=o*Math.cos(u),e=o*Math.sin(u),r=Math.sin(i),qc.point=n,we(t,e,r)}}function ke(){qc.point=_e}function Ee(){function n(n,t){n*=Da;var e=Math.cos(t*=Da),o=e*Math.cos(n),a=e*Math.sin(n),c=Math.sin(t),l=u*c-i*a,s=i*o-r*c,f=r*a-u*o,h=Math.sqrt(l*l+s*s+f*f),g=r*o+u*a+i*c,p=h&&-nt(g)/h,v=Math.atan2(h,g);Nc+=p*l,Cc+=p*s,zc+=p*f,bc+=v,kc+=v*(r+(r=o)),Ec+=v*(u+(u=a)),Ac+=v*(i+(i=c)),we(r,u,i)}var t,e,r,u,i;qc.point=function(o,a){t=o,e=a,qc.point=n,o*=Da;var c=Math.cos(a*=Da);r=c*Math.cos(o),u=c*Math.sin(o),i=Math.sin(a),we(r,u,i)},qc.lineEnd=function(){n(t,e),qc.lineEnd=ke,qc.point=_e}}function Ae(n,t){function e(e,r){return e=n(e,r),t(e[0],e[1])}return n.invert&&t.invert&&(e.invert=function(e,r){return e=t.invert(e,r),e&&n.invert(e[0],e[1])}),e}function Ne(){return!0}function Ce(n,t,e,r,u){var i=[],o=[];if(n.forEach(function(n){if(!((t=n.length-1)<=0)){var t,e=n[0],r=n[t];if(be(e,r)){u.lineStart();for(var a=0;t>a;++a)u.point((e=n[a])[0],e[1]);return void u.lineEnd()}var c=new qe(e,n,null,!0),l=new qe(e,null,c,!1);c.o=l,i.push(c),o.push(l),c=new qe(r,n,null,!1),l=new qe(r,null,c,!0),c.o=l,i.push(c),o.push(l)}}),o.sort(t),ze(i),ze(o),i.length){for(var a=0,c=e,l=o.length;l>a;++a)o[a].e=c=!c;for(var s,f,h=i[0];;){for(var g=h,p=!0;g.v;)if((g=g.n)===h)return;s=g.z,u.lineStart();do{if(g.v=g.o.v=!0,g.e){if(p)for(var a=0,l=s.length;l>a;++a)u.point((f=s[a])[0],f[1]);else r(g.x,g.n.x,1,u);g=g.n}else{if(p){s=g.p.z;for(var a=s.length-1;a>=0;--a)u.point((f=s[a])[0],f[1])}else r(g.x,g.p.x,-1,u);g=g.p}g=g.o,s=g.z,p=!p}while(!g.v);u.lineEnd()}}}function ze(n){if(t=n.length){for(var t,e,r=0,u=n[0];++r<t;)u.n=e=n[r],e.p=u,u=e;u.n=e=n[0],e.p=u}}function qe(n,t,e,r){this.x=n,this.z=t,this.o=e,this.e=r,this.v=!1,this.n=this.p=null}function Le(n,t,e,r){return function(u,i){function o(t,e){var r=u(t,e);n(t=r[0],e=r[1])&&i.point(t,e)}function a(n,t){var e=u(n,t);d.point(e[0],e[1])}function c(){y.point=a,d.lineStart()}function l(){y.point=o,d.lineEnd()}function s(n,t){v.push([n,t]);var e=u(n,t);x.point(e[0],e[1])}function f(){x.lineStart(),v=[]}function h(){s(v[0][0],v[0][1]),x.lineEnd();var n,t=x.clean(),e=M.buffer(),r=e.length;if(v.pop(),p.push(v),v=null,r)if(1&t){n=e[0];var u,r=n.length-1,o=-1;if(r>0){for(b||(i.polygonStart(),b=!0),i.lineStart();++o<r;)i.point((u=n[o])[0],u[1]);i.lineEnd()}}else r>1&&2&t&&e.push(e.pop().concat(e.shift())),g.push(e.filter(Te))}var g,p,v,d=t(i),m=u.invert(r[0],r[1]),y={point:o,lineStart:c,lineEnd:l,polygonStart:function(){y.point=s,y.lineStart=f,y.lineEnd=h,g=[],p=[]},polygonEnd:function(){y.point=o,y.lineStart=c,y.lineEnd=l,g=ta.merge(g);var n=Fe(m,p);g.length?(b||(i.polygonStart(),b=!0),Ce(g,De,n,e,i)):n&&(b||(i.polygonStart(),b=!0),i.lineStart(),e(null,null,1,i),i.lineEnd()),b&&(i.polygonEnd(),b=!1),g=p=null},sphere:function(){i.polygonStart(),i.lineStart(),e(null,null,1,i),i.lineEnd(),i.polygonEnd()}},M=Re(),x=t(M),b=!1;return y}}function Te(n){return n.length>1}function Re(){var n,t=[];return{lineStart:function(){t.push(n=[])},point:function(t,e){n.push([t,e])},lineEnd:b,buffer:function(){var e=t;return t=[],n=null,e},rejoin:function(){t.length>1&&t.push(t.pop().concat(t.shift()))}}}function De(n,t){return((n=n.x)[0]<0?n[1]-Ra-Ca:Ra-n[1])-((t=t.x)[0]<0?t[1]-Ra-Ca:Ra-t[1])}function Pe(n){var t,e=0/0,r=0/0,u=0/0;return{lineStart:function(){n.lineStart(),t=1},point:function(i,o){var a=i>0?qa:-qa,c=ga(i-e);ga(c-qa)<Ca?(n.point(e,r=(r+o)/2>0?Ra:-Ra),n.point(u,r),n.lineEnd(),n.lineStart(),n.point(a,r),n.point(i,r),t=0):u!==a&&c>=qa&&(ga(e-u)<Ca&&(e-=u*Ca),ga(i-a)<Ca&&(i-=a*Ca),r=Ue(e,r,i,o),n.point(u,r),n.lineEnd(),n.lineStart(),n.point(a,r),t=0),n.point(e=i,r=o),u=a},lineEnd:function(){n.lineEnd(),e=r=0/0},clean:function(){return 2-t}}}function Ue(n,t,e,r){var u,i,o=Math.sin(n-e);return ga(o)>Ca?Math.atan((Math.sin(t)*(i=Math.cos(r))*Math.sin(e)-Math.sin(r)*(u=Math.cos(t))*Math.sin(n))/(u*i*o)):(t+r)/2}function je(n,t,e,r){var u;if(null==n)u=e*Ra,r.point(-qa,u),r.point(0,u),r.point(qa,u),r.point(qa,0),r.point(qa,-u),r.point(0,-u),r.point(-qa,-u),r.point(-qa,0),r.point(-qa,u);else if(ga(n[0]-t[0])>Ca){var i=n[0]<t[0]?qa:-qa;u=e*i/2,r.point(-i,u),r.point(0,u),r.point(i,u)}else r.point(t[0],t[1])}function Fe(n,t){var e=n[0],r=n[1],u=[Math.sin(e),-Math.cos(e),0],i=0,o=0;yc.reset();for(var a=0,c=t.length;c>a;++a){var l=t[a],s=l.length;if(s)for(var f=l[0],h=f[0],g=f[1]/2+qa/4,p=Math.sin(g),v=Math.cos(g),d=1;;){d===s&&(d=0),n=l[d];var m=n[0],y=n[1]/2+qa/4,M=Math.sin(y),x=Math.cos(y),b=m-h,_=b>=0?1:-1,w=_*b,S=w>qa,k=p*M;if(yc.add(Math.atan2(k*_*Math.sin(w),v*x+k*Math.cos(w))),i+=S?b+_*La:b,S^h>=e^m>=e){var E=de(pe(f),pe(n));Me(E);var A=de(u,E);Me(A);var N=(S^b>=0?-1:1)*tt(A[2]);(r>N||r===N&&(E[0]||E[1]))&&(o+=S^b>=0?1:-1)}if(!d++)break;h=m,p=M,v=x,f=n}}return(-Ca>i||Ca>i&&0>yc)^1&o}function He(n){function t(n,t){return Math.cos(n)*Math.cos(t)>i}function e(n){var e,i,c,l,s;return{lineStart:function(){l=c=!1,s=1},point:function(f,h){var g,p=[f,h],v=t(f,h),d=o?v?0:u(f,h):v?u(f+(0>f?qa:-qa),h):0;if(!e&&(l=c=v)&&n.lineStart(),v!==c&&(g=r(e,p),(be(e,g)||be(p,g))&&(p[0]+=Ca,p[1]+=Ca,v=t(p[0],p[1]))),v!==c)s=0,v?(n.lineStart(),g=r(p,e),n.point(g[0],g[1])):(g=r(e,p),n.point(g[0],g[1]),n.lineEnd()),e=g;else if(a&&e&&o^v){var m;d&i||!(m=r(p,e,!0))||(s=0,o?(n.lineStart(),n.point(m[0][0],m[0][1]),n.point(m[1][0],m[1][1]),n.lineEnd()):(n.point(m[1][0],m[1][1]),n.lineEnd(),n.lineStart(),n.point(m[0][0],m[0][1])))}!v||e&&be(e,p)||n.point(p[0],p[1]),e=p,c=v,i=d},lineEnd:function(){c&&n.lineEnd(),e=null},clean:function(){return s|(l&&c)<<1}}}function r(n,t,e){var r=pe(n),u=pe(t),o=[1,0,0],a=de(r,u),c=ve(a,a),l=a[0],s=c-l*l;if(!s)return!e&&n;var f=i*c/s,h=-i*l/s,g=de(o,a),p=ye(o,f),v=ye(a,h);me(p,v);var d=g,m=ve(p,d),y=ve(d,d),M=m*m-y*(ve(p,p)-1);if(!(0>M)){var x=Math.sqrt(M),b=ye(d,(-m-x)/y);if(me(b,p),b=xe(b),!e)return b;var _,w=n[0],S=t[0],k=n[1],E=t[1];w>S&&(_=w,w=S,S=_);var A=S-w,N=ga(A-qa)<Ca,C=N||Ca>A;if(!N&&k>E&&(_=k,k=E,E=_),C?N?k+E>0^b[1]<(ga(b[0]-w)<Ca?k:E):k<=b[1]&&b[1]<=E:A>qa^(w<=b[0]&&b[0]<=S)){var z=ye(d,(-m+x)/y);return me(z,p),[b,xe(z)]}}}function u(t,e){var r=o?n:qa-n,u=0;return-r>t?u|=1:t>r&&(u|=2),-r>e?u|=4:e>r&&(u|=8),u}var i=Math.cos(n),o=i>0,a=ga(i)>Ca,c=gr(n,6*Da);return Le(t,e,c,o?[0,-n]:[-qa,n-qa])}function Oe(n,t,e,r){return function(u){var i,o=u.a,a=u.b,c=o.x,l=o.y,s=a.x,f=a.y,h=0,g=1,p=s-c,v=f-l;if(i=n-c,p||!(i>0)){if(i/=p,0>p){if(h>i)return;g>i&&(g=i)}else if(p>0){if(i>g)return;i>h&&(h=i)}if(i=e-c,p||!(0>i)){if(i/=p,0>p){if(i>g)return;i>h&&(h=i)}else if(p>0){if(h>i)return;g>i&&(g=i)}if(i=t-l,v||!(i>0)){if(i/=v,0>v){if(h>i)return;g>i&&(g=i)}else if(v>0){if(i>g)return;i>h&&(h=i)}if(i=r-l,v||!(0>i)){if(i/=v,0>v){if(i>g)return;i>h&&(h=i)}else if(v>0){if(h>i)return;g>i&&(g=i)}return h>0&&(u.a={x:c+h*p,y:l+h*v}),1>g&&(u.b={x:c+g*p,y:l+g*v}),u}}}}}}function Ie(n,t,e,r){function u(r,u){return ga(r[0]-n)<Ca?u>0?0:3:ga(r[0]-e)<Ca?u>0?2:1:ga(r[1]-t)<Ca?u>0?1:0:u>0?3:2}function i(n,t){return o(n.x,t.x)}function o(n,t){var e=u(n,1),r=u(t,1);return e!==r?e-r:0===e?t[1]-n[1]:1===e?n[0]-t[0]:2===e?n[1]-t[1]:t[0]-n[0]}return function(a){function c(n){for(var t=0,e=d.length,r=n[1],u=0;e>u;++u)for(var i,o=1,a=d[u],c=a.length,l=a[0];c>o;++o)i=a[o],l[1]<=r?i[1]>r&&Q(l,i,n)>0&&++t:i[1]<=r&&Q(l,i,n)<0&&--t,l=i;return 0!==t}function l(i,a,c,l){var s=0,f=0;if(null==i||(s=u(i,c))!==(f=u(a,c))||o(i,a)<0^c>0){do l.point(0===s||3===s?n:e,s>1?r:t);while((s=(s+c+4)%4)!==f)}else l.point(a[0],a[1])}function s(u,i){return u>=n&&e>=u&&i>=t&&r>=i}function f(n,t){s(n,t)&&a.point(n,t)}function h(){C.point=p,d&&d.push(m=[]),S=!0,w=!1,b=_=0/0}function g(){v&&(p(y,M),x&&w&&A.rejoin(),v.push(A.buffer())),C.point=f,w&&a.lineEnd()}function p(n,t){n=Math.max(-Tc,Math.min(Tc,n)),t=Math.max(-Tc,Math.min(Tc,t));var e=s(n,t);if(d&&m.push([n,t]),S)y=n,M=t,x=e,S=!1,e&&(a.lineStart(),a.point(n,t));else if(e&&w)a.point(n,t);else{var r={a:{x:b,y:_},b:{x:n,y:t}};N(r)?(w||(a.lineStart(),a.point(r.a.x,r.a.y)),a.point(r.b.x,r.b.y),e||a.lineEnd(),k=!1):e&&(a.lineStart(),a.point(n,t),k=!1)}b=n,_=t,w=e}var v,d,m,y,M,x,b,_,w,S,k,E=a,A=Re(),N=Oe(n,t,e,r),C={point:f,lineStart:h,lineEnd:g,polygonStart:function(){a=A,v=[],d=[],k=!0},polygonEnd:function(){a=E,v=ta.merge(v);var t=c([n,r]),e=k&&t,u=v.length;(e||u)&&(a.polygonStart(),e&&(a.lineStart(),l(null,null,1,a),a.lineEnd()),u&&Ce(v,i,t,l,a),a.polygonEnd()),v=d=m=null}};return C}}function Ye(n){var t=0,e=qa/3,r=ir(n),u=r(t,e);return u.parallels=function(n){return arguments.length?r(t=n[0]*qa/180,e=n[1]*qa/180):[t/qa*180,e/qa*180]},u}function Ze(n,t){function e(n,t){var e=Math.sqrt(i-2*u*Math.sin(t))/u;return[e*Math.sin(n*=u),o-e*Math.cos(n)]}var r=Math.sin(n),u=(r+Math.sin(t))/2,i=1+r*(2*u-r),o=Math.sqrt(i)/u;return e.invert=function(n,t){var e=o-t;return[Math.atan2(n,e)/u,tt((i-(n*n+e*e)*u*u)/(2*u))]},e}function Ve(){function n(n,t){Dc+=u*n-r*t,r=n,u=t}var t,e,r,u;Hc.point=function(i,o){Hc.point=n,t=r=i,e=u=o},Hc.lineEnd=function(){n(t,e)}}function Xe(n,t){Pc>n&&(Pc=n),n>jc&&(jc=n),Uc>t&&(Uc=t),t>Fc&&(Fc=t)}function $e(){function n(n,t){o.push("M",n,",",t,i)}function t(n,t){o.push("M",n,",",t),a.point=e}function e(n,t){o.push("L",n,",",t)}function r(){a.point=n}function u(){o.push("Z")}var i=Be(4.5),o=[],a={point:n,lineStart:function(){a.point=t},lineEnd:r,polygonStart:function(){a.lineEnd=u},polygonEnd:function(){a.lineEnd=r,a.point=n},pointRadius:function(n){return i=Be(n),a},result:function(){if(o.length){var n=o.join("");return o=[],n}}};return a}function Be(n){return"m0,"+n+"a"+n+","+n+" 0 1,1 0,"+-2*n+"a"+n+","+n+" 0 1,1 0,"+2*n+"z"}function We(n,t){_c+=n,wc+=t,++Sc}function Je(){function n(n,r){var u=n-t,i=r-e,o=Math.sqrt(u*u+i*i);kc+=o*(t+n)/2,Ec+=o*(e+r)/2,Ac+=o,We(t=n,e=r)}var t,e;Ic.point=function(r,u){Ic.point=n,We(t=r,e=u)}}function Ge(){Ic.point=We}function Ke(){function n(n,t){var e=n-r,i=t-u,o=Math.sqrt(e*e+i*i);kc+=o*(r+n)/2,Ec+=o*(u+t)/2,Ac+=o,o=u*n-r*t,Nc+=o*(r+n),Cc+=o*(u+t),zc+=3*o,We(r=n,u=t)}var t,e,r,u;Ic.point=function(i,o){Ic.point=n,We(t=r=i,e=u=o)},Ic.lineEnd=function(){n(t,e)}}function Qe(n){function t(t,e){n.moveTo(t+o,e),n.arc(t,e,o,0,La)}function e(t,e){n.moveTo(t,e),a.point=r}function r(t,e){n.lineTo(t,e)}function u(){a.point=t}function i(){n.closePath()}var o=4.5,a={point:t,lineStart:function(){a.point=e},lineEnd:u,polygonStart:function(){a.lineEnd=i},polygonEnd:function(){a.lineEnd=u,a.point=t},pointRadius:function(n){return o=n,a},result:b};return a}function nr(n){function t(n){return(a?r:e)(n)}function e(t){return rr(t,function(e,r){e=n(e,r),t.point(e[0],e[1])})}function r(t){function e(e,r){e=n(e,r),t.point(e[0],e[1])}function r(){M=0/0,S.point=i,t.lineStart()}function i(e,r){var i=pe([e,r]),o=n(e,r);u(M,x,y,b,_,w,M=o[0],x=o[1],y=e,b=i[0],_=i[1],w=i[2],a,t),t.point(M,x)}function o(){S.point=e,t.lineEnd()}function c(){r(),S.point=l,S.lineEnd=s}function l(n,t){i(f=n,h=t),g=M,p=x,v=b,d=_,m=w,S.point=i}function s(){u(M,x,y,b,_,w,g,p,f,v,d,m,a,t),S.lineEnd=o,o()}var f,h,g,p,v,d,m,y,M,x,b,_,w,S={point:e,lineStart:r,lineEnd:o,polygonStart:function(){t.polygonStart(),S.lineStart=c
},polygonEnd:function(){t.polygonEnd(),S.lineStart=r}};return S}function u(t,e,r,a,c,l,s,f,h,g,p,v,d,m){var y=s-t,M=f-e,x=y*y+M*M;if(x>4*i&&d--){var b=a+g,_=c+p,w=l+v,S=Math.sqrt(b*b+_*_+w*w),k=Math.asin(w/=S),E=ga(ga(w)-1)<Ca||ga(r-h)<Ca?(r+h)/2:Math.atan2(_,b),A=n(E,k),N=A[0],C=A[1],z=N-t,q=C-e,L=M*z-y*q;(L*L/x>i||ga((y*z+M*q)/x-.5)>.3||o>a*g+c*p+l*v)&&(u(t,e,r,a,c,l,N,C,E,b/=S,_/=S,w,d,m),m.point(N,C),u(N,C,E,b,_,w,s,f,h,g,p,v,d,m))}}var i=.5,o=Math.cos(30*Da),a=16;return t.precision=function(n){return arguments.length?(a=(i=n*n)>0&&16,t):Math.sqrt(i)},t}function tr(n){var t=nr(function(t,e){return n([t*Pa,e*Pa])});return function(n){return or(t(n))}}function er(n){this.stream=n}function rr(n,t){return{point:t,sphere:function(){n.sphere()},lineStart:function(){n.lineStart()},lineEnd:function(){n.lineEnd()},polygonStart:function(){n.polygonStart()},polygonEnd:function(){n.polygonEnd()}}}function ur(n){return ir(function(){return n})()}function ir(n){function t(n){return n=a(n[0]*Da,n[1]*Da),[n[0]*h+c,l-n[1]*h]}function e(n){return n=a.invert((n[0]-c)/h,(l-n[1])/h),n&&[n[0]*Pa,n[1]*Pa]}function r(){a=Ae(o=lr(m,M,x),i);var n=i(v,d);return c=g-n[0]*h,l=p+n[1]*h,u()}function u(){return s&&(s.valid=!1,s=null),t}var i,o,a,c,l,s,f=nr(function(n,t){return n=i(n,t),[n[0]*h+c,l-n[1]*h]}),h=150,g=480,p=250,v=0,d=0,m=0,M=0,x=0,b=Lc,_=y,w=null,S=null;return t.stream=function(n){return s&&(s.valid=!1),s=or(b(o,f(_(n)))),s.valid=!0,s},t.clipAngle=function(n){return arguments.length?(b=null==n?(w=n,Lc):He((w=+n)*Da),u()):w},t.clipExtent=function(n){return arguments.length?(S=n,_=n?Ie(n[0][0],n[0][1],n[1][0],n[1][1]):y,u()):S},t.scale=function(n){return arguments.length?(h=+n,r()):h},t.translate=function(n){return arguments.length?(g=+n[0],p=+n[1],r()):[g,p]},t.center=function(n){return arguments.length?(v=n[0]%360*Da,d=n[1]%360*Da,r()):[v*Pa,d*Pa]},t.rotate=function(n){return arguments.length?(m=n[0]%360*Da,M=n[1]%360*Da,x=n.length>2?n[2]%360*Da:0,r()):[m*Pa,M*Pa,x*Pa]},ta.rebind(t,f,"precision"),function(){return i=n.apply(this,arguments),t.invert=i.invert&&e,r()}}function or(n){return rr(n,function(t,e){n.point(t*Da,e*Da)})}function ar(n,t){return[n,t]}function cr(n,t){return[n>qa?n-La:-qa>n?n+La:n,t]}function lr(n,t,e){return n?t||e?Ae(fr(n),hr(t,e)):fr(n):t||e?hr(t,e):cr}function sr(n){return function(t,e){return t+=n,[t>qa?t-La:-qa>t?t+La:t,e]}}function fr(n){var t=sr(n);return t.invert=sr(-n),t}function hr(n,t){function e(n,t){var e=Math.cos(t),a=Math.cos(n)*e,c=Math.sin(n)*e,l=Math.sin(t),s=l*r+a*u;return[Math.atan2(c*i-s*o,a*r-l*u),tt(s*i+c*o)]}var r=Math.cos(n),u=Math.sin(n),i=Math.cos(t),o=Math.sin(t);return e.invert=function(n,t){var e=Math.cos(t),a=Math.cos(n)*e,c=Math.sin(n)*e,l=Math.sin(t),s=l*i-c*o;return[Math.atan2(c*i+l*o,a*r+s*u),tt(s*r-a*u)]},e}function gr(n,t){var e=Math.cos(n),r=Math.sin(n);return function(u,i,o,a){var c=o*t;null!=u?(u=pr(e,u),i=pr(e,i),(o>0?i>u:u>i)&&(u+=o*La)):(u=n+o*La,i=n-.5*c);for(var l,s=u;o>0?s>i:i>s;s-=c)a.point((l=xe([e,-r*Math.cos(s),-r*Math.sin(s)]))[0],l[1])}}function pr(n,t){var e=pe(t);e[0]-=n,Me(e);var r=nt(-e[1]);return((-e[2]<0?-r:r)+2*Math.PI-Ca)%(2*Math.PI)}function vr(n,t,e){var r=ta.range(n,t-Ca,e).concat(t);return function(n){return r.map(function(t){return[n,t]})}}function dr(n,t,e){var r=ta.range(n,t-Ca,e).concat(t);return function(n){return r.map(function(t){return[t,n]})}}function mr(n){return n.source}function yr(n){return n.target}function Mr(n,t,e,r){var u=Math.cos(t),i=Math.sin(t),o=Math.cos(r),a=Math.sin(r),c=u*Math.cos(n),l=u*Math.sin(n),s=o*Math.cos(e),f=o*Math.sin(e),h=2*Math.asin(Math.sqrt(it(r-t)+u*o*it(e-n))),g=1/Math.sin(h),p=h?function(n){var t=Math.sin(n*=h)*g,e=Math.sin(h-n)*g,r=e*c+t*s,u=e*l+t*f,o=e*i+t*a;return[Math.atan2(u,r)*Pa,Math.atan2(o,Math.sqrt(r*r+u*u))*Pa]}:function(){return[n*Pa,t*Pa]};return p.distance=h,p}function xr(){function n(n,u){var i=Math.sin(u*=Da),o=Math.cos(u),a=ga((n*=Da)-t),c=Math.cos(a);Yc+=Math.atan2(Math.sqrt((a=o*Math.sin(a))*a+(a=r*i-e*o*c)*a),e*i+r*o*c),t=n,e=i,r=o}var t,e,r;Zc.point=function(u,i){t=u*Da,e=Math.sin(i*=Da),r=Math.cos(i),Zc.point=n},Zc.lineEnd=function(){Zc.point=Zc.lineEnd=b}}function br(n,t){function e(t,e){var r=Math.cos(t),u=Math.cos(e),i=n(r*u);return[i*u*Math.sin(t),i*Math.sin(e)]}return e.invert=function(n,e){var r=Math.sqrt(n*n+e*e),u=t(r),i=Math.sin(u),o=Math.cos(u);return[Math.atan2(n*i,r*o),Math.asin(r&&e*i/r)]},e}function _r(n,t){function e(n,t){o>0?-Ra+Ca>t&&(t=-Ra+Ca):t>Ra-Ca&&(t=Ra-Ca);var e=o/Math.pow(u(t),i);return[e*Math.sin(i*n),o-e*Math.cos(i*n)]}var r=Math.cos(n),u=function(n){return Math.tan(qa/4+n/2)},i=n===t?Math.sin(n):Math.log(r/Math.cos(t))/Math.log(u(t)/u(n)),o=r*Math.pow(u(n),i)/i;return i?(e.invert=function(n,t){var e=o-t,r=K(i)*Math.sqrt(n*n+e*e);return[Math.atan2(n,e)/i,2*Math.atan(Math.pow(o/r,1/i))-Ra]},e):Sr}function wr(n,t){function e(n,t){var e=i-t;return[e*Math.sin(u*n),i-e*Math.cos(u*n)]}var r=Math.cos(n),u=n===t?Math.sin(n):(r-Math.cos(t))/(t-n),i=r/u+n;return ga(u)<Ca?ar:(e.invert=function(n,t){var e=i-t;return[Math.atan2(n,e)/u,i-K(u)*Math.sqrt(n*n+e*e)]},e)}function Sr(n,t){return[n,Math.log(Math.tan(qa/4+t/2))]}function kr(n){var t,e=ur(n),r=e.scale,u=e.translate,i=e.clipExtent;return e.scale=function(){var n=r.apply(e,arguments);return n===e?t?e.clipExtent(null):e:n},e.translate=function(){var n=u.apply(e,arguments);return n===e?t?e.clipExtent(null):e:n},e.clipExtent=function(n){var o=i.apply(e,arguments);if(o===e){if(t=null==n){var a=qa*r(),c=u();i([[c[0]-a,c[1]-a],[c[0]+a,c[1]+a]])}}else t&&(o=null);return o},e.clipExtent(null)}function Er(n,t){return[Math.log(Math.tan(qa/4+t/2)),-n]}function Ar(n){return n[0]}function Nr(n){return n[1]}function Cr(n){for(var t=n.length,e=[0,1],r=2,u=2;t>u;u++){for(;r>1&&Q(n[e[r-2]],n[e[r-1]],n[u])<=0;)--r;e[r++]=u}return e.slice(0,r)}function zr(n,t){return n[0]-t[0]||n[1]-t[1]}function qr(n,t,e){return(e[0]-t[0])*(n[1]-t[1])<(e[1]-t[1])*(n[0]-t[0])}function Lr(n,t,e,r){var u=n[0],i=e[0],o=t[0]-u,a=r[0]-i,c=n[1],l=e[1],s=t[1]-c,f=r[1]-l,h=(a*(c-l)-f*(u-i))/(f*o-a*s);return[u+h*o,c+h*s]}function Tr(n){var t=n[0],e=n[n.length-1];return!(t[0]-e[0]||t[1]-e[1])}function Rr(){tu(this),this.edge=this.site=this.circle=null}function Dr(n){var t=el.pop()||new Rr;return t.site=n,t}function Pr(n){Xr(n),Qc.remove(n),el.push(n),tu(n)}function Ur(n){var t=n.circle,e=t.x,r=t.cy,u={x:e,y:r},i=n.P,o=n.N,a=[n];Pr(n);for(var c=i;c.circle&&ga(e-c.circle.x)<Ca&&ga(r-c.circle.cy)<Ca;)i=c.P,a.unshift(c),Pr(c),c=i;a.unshift(c),Xr(c);for(var l=o;l.circle&&ga(e-l.circle.x)<Ca&&ga(r-l.circle.cy)<Ca;)o=l.N,a.push(l),Pr(l),l=o;a.push(l),Xr(l);var s,f=a.length;for(s=1;f>s;++s)l=a[s],c=a[s-1],Kr(l.edge,c.site,l.site,u);c=a[0],l=a[f-1],l.edge=Jr(c.site,l.site,null,u),Vr(c),Vr(l)}function jr(n){for(var t,e,r,u,i=n.x,o=n.y,a=Qc._;a;)if(r=Fr(a,o)-i,r>Ca)a=a.L;else{if(u=i-Hr(a,o),!(u>Ca)){r>-Ca?(t=a.P,e=a):u>-Ca?(t=a,e=a.N):t=e=a;break}if(!a.R){t=a;break}a=a.R}var c=Dr(n);if(Qc.insert(t,c),t||e){if(t===e)return Xr(t),e=Dr(t.site),Qc.insert(c,e),c.edge=e.edge=Jr(t.site,c.site),Vr(t),void Vr(e);if(!e)return void(c.edge=Jr(t.site,c.site));Xr(t),Xr(e);var l=t.site,s=l.x,f=l.y,h=n.x-s,g=n.y-f,p=e.site,v=p.x-s,d=p.y-f,m=2*(h*d-g*v),y=h*h+g*g,M=v*v+d*d,x={x:(d*y-g*M)/m+s,y:(h*M-v*y)/m+f};Kr(e.edge,l,p,x),c.edge=Jr(l,n,null,x),e.edge=Jr(n,p,null,x),Vr(t),Vr(e)}}function Fr(n,t){var e=n.site,r=e.x,u=e.y,i=u-t;if(!i)return r;var o=n.P;if(!o)return-1/0;e=o.site;var a=e.x,c=e.y,l=c-t;if(!l)return a;var s=a-r,f=1/i-1/l,h=s/l;return f?(-h+Math.sqrt(h*h-2*f*(s*s/(-2*l)-c+l/2+u-i/2)))/f+r:(r+a)/2}function Hr(n,t){var e=n.N;if(e)return Fr(e,t);var r=n.site;return r.y===t?r.x:1/0}function Or(n){this.site=n,this.edges=[]}function Ir(n){for(var t,e,r,u,i,o,a,c,l,s,f=n[0][0],h=n[1][0],g=n[0][1],p=n[1][1],v=Kc,d=v.length;d--;)if(i=v[d],i&&i.prepare())for(a=i.edges,c=a.length,o=0;c>o;)s=a[o].end(),r=s.x,u=s.y,l=a[++o%c].start(),t=l.x,e=l.y,(ga(r-t)>Ca||ga(u-e)>Ca)&&(a.splice(o,0,new Qr(Gr(i.site,s,ga(r-f)<Ca&&p-u>Ca?{x:f,y:ga(t-f)<Ca?e:p}:ga(u-p)<Ca&&h-r>Ca?{x:ga(e-p)<Ca?t:h,y:p}:ga(r-h)<Ca&&u-g>Ca?{x:h,y:ga(t-h)<Ca?e:g}:ga(u-g)<Ca&&r-f>Ca?{x:ga(e-g)<Ca?t:f,y:g}:null),i.site,null)),++c)}function Yr(n,t){return t.angle-n.angle}function Zr(){tu(this),this.x=this.y=this.arc=this.site=this.cy=null}function Vr(n){var t=n.P,e=n.N;if(t&&e){var r=t.site,u=n.site,i=e.site;if(r!==i){var o=u.x,a=u.y,c=r.x-o,l=r.y-a,s=i.x-o,f=i.y-a,h=2*(c*f-l*s);if(!(h>=-za)){var g=c*c+l*l,p=s*s+f*f,v=(f*g-l*p)/h,d=(c*p-s*g)/h,f=d+a,m=rl.pop()||new Zr;m.arc=n,m.site=u,m.x=v+o,m.y=f+Math.sqrt(v*v+d*d),m.cy=f,n.circle=m;for(var y=null,M=tl._;M;)if(m.y<M.y||m.y===M.y&&m.x<=M.x){if(!M.L){y=M.P;break}M=M.L}else{if(!M.R){y=M;break}M=M.R}tl.insert(y,m),y||(nl=m)}}}}function Xr(n){var t=n.circle;t&&(t.P||(nl=t.N),tl.remove(t),rl.push(t),tu(t),n.circle=null)}function $r(n){for(var t,e=Gc,r=Oe(n[0][0],n[0][1],n[1][0],n[1][1]),u=e.length;u--;)t=e[u],(!Br(t,n)||!r(t)||ga(t.a.x-t.b.x)<Ca&&ga(t.a.y-t.b.y)<Ca)&&(t.a=t.b=null,e.splice(u,1))}function Br(n,t){var e=n.b;if(e)return!0;var r,u,i=n.a,o=t[0][0],a=t[1][0],c=t[0][1],l=t[1][1],s=n.l,f=n.r,h=s.x,g=s.y,p=f.x,v=f.y,d=(h+p)/2,m=(g+v)/2;if(v===g){if(o>d||d>=a)return;if(h>p){if(i){if(i.y>=l)return}else i={x:d,y:c};e={x:d,y:l}}else{if(i){if(i.y<c)return}else i={x:d,y:l};e={x:d,y:c}}}else if(r=(h-p)/(v-g),u=m-r*d,-1>r||r>1)if(h>p){if(i){if(i.y>=l)return}else i={x:(c-u)/r,y:c};e={x:(l-u)/r,y:l}}else{if(i){if(i.y<c)return}else i={x:(l-u)/r,y:l};e={x:(c-u)/r,y:c}}else if(v>g){if(i){if(i.x>=a)return}else i={x:o,y:r*o+u};e={x:a,y:r*a+u}}else{if(i){if(i.x<o)return}else i={x:a,y:r*a+u};e={x:o,y:r*o+u}}return n.a=i,n.b=e,!0}function Wr(n,t){this.l=n,this.r=t,this.a=this.b=null}function Jr(n,t,e,r){var u=new Wr(n,t);return Gc.push(u),e&&Kr(u,n,t,e),r&&Kr(u,t,n,r),Kc[n.i].edges.push(new Qr(u,n,t)),Kc[t.i].edges.push(new Qr(u,t,n)),u}function Gr(n,t,e){var r=new Wr(n,null);return r.a=t,r.b=e,Gc.push(r),r}function Kr(n,t,e,r){n.a||n.b?n.l===e?n.b=r:n.a=r:(n.a=r,n.l=t,n.r=e)}function Qr(n,t,e){var r=n.a,u=n.b;this.edge=n,this.site=t,this.angle=e?Math.atan2(e.y-t.y,e.x-t.x):n.l===t?Math.atan2(u.x-r.x,r.y-u.y):Math.atan2(r.x-u.x,u.y-r.y)}function nu(){this._=null}function tu(n){n.U=n.C=n.L=n.R=n.P=n.N=null}function eu(n,t){var e=t,r=t.R,u=e.U;u?u.L===e?u.L=r:u.R=r:n._=r,r.U=u,e.U=r,e.R=r.L,e.R&&(e.R.U=e),r.L=e}function ru(n,t){var e=t,r=t.L,u=e.U;u?u.L===e?u.L=r:u.R=r:n._=r,r.U=u,e.U=r,e.L=r.R,e.L&&(e.L.U=e),r.R=e}function uu(n){for(;n.L;)n=n.L;return n}function iu(n,t){var e,r,u,i=n.sort(ou).pop();for(Gc=[],Kc=new Array(n.length),Qc=new nu,tl=new nu;;)if(u=nl,i&&(!u||i.y<u.y||i.y===u.y&&i.x<u.x))(i.x!==e||i.y!==r)&&(Kc[i.i]=new Or(i),jr(i),e=i.x,r=i.y),i=n.pop();else{if(!u)break;Ur(u.arc)}t&&($r(t),Ir(t));var o={cells:Kc,edges:Gc};return Qc=tl=Gc=Kc=null,o}function ou(n,t){return t.y-n.y||t.x-n.x}function au(n,t,e){return(n.x-e.x)*(t.y-n.y)-(n.x-t.x)*(e.y-n.y)}function cu(n){return n.x}function lu(n){return n.y}function su(){return{leaf:!0,nodes:[],point:null,x:null,y:null}}function fu(n,t,e,r,u,i){if(!n(t,e,r,u,i)){var o=.5*(e+u),a=.5*(r+i),c=t.nodes;c[0]&&fu(n,c[0],e,r,o,a),c[1]&&fu(n,c[1],o,r,u,a),c[2]&&fu(n,c[2],e,a,o,i),c[3]&&fu(n,c[3],o,a,u,i)}}function hu(n,t,e,r,u,i,o){var a,c=1/0;return function l(n,s,f,h,g){if(!(s>i||f>o||r>h||u>g)){if(p=n.point){var p,v=t-n.x,d=e-n.y,m=v*v+d*d;if(c>m){var y=Math.sqrt(c=m);r=t-y,u=e-y,i=t+y,o=e+y,a=p}}for(var M=n.nodes,x=.5*(s+h),b=.5*(f+g),_=t>=x,w=e>=b,S=w<<1|_,k=S+4;k>S;++S)if(n=M[3&S])switch(3&S){case 0:l(n,s,f,x,b);break;case 1:l(n,x,f,h,b);break;case 2:l(n,s,b,x,g);break;case 3:l(n,x,b,h,g)}}}(n,r,u,i,o),a}function gu(n,t){n=ta.rgb(n),t=ta.rgb(t);var e=n.r,r=n.g,u=n.b,i=t.r-e,o=t.g-r,a=t.b-u;return function(n){return"#"+xt(Math.round(e+i*n))+xt(Math.round(r+o*n))+xt(Math.round(u+a*n))}}function pu(n,t){var e,r={},u={};for(e in n)e in t?r[e]=mu(n[e],t[e]):u[e]=n[e];for(e in t)e in n||(u[e]=t[e]);return function(n){for(e in r)u[e]=r[e](n);return u}}function vu(n,t){return n=+n,t=+t,function(e){return n*(1-e)+t*e}}function du(n,t){var e,r,u,i=il.lastIndex=ol.lastIndex=0,o=-1,a=[],c=[];for(n+="",t+="";(e=il.exec(n))&&(r=ol.exec(t));)(u=r.index)>i&&(u=t.slice(i,u),a[o]?a[o]+=u:a[++o]=u),(e=e[0])===(r=r[0])?a[o]?a[o]+=r:a[++o]=r:(a[++o]=null,c.push({i:o,x:vu(e,r)})),i=ol.lastIndex;return i<t.length&&(u=t.slice(i),a[o]?a[o]+=u:a[++o]=u),a.length<2?c[0]?(t=c[0].x,function(n){return t(n)+""}):function(){return t}:(t=c.length,function(n){for(var e,r=0;t>r;++r)a[(e=c[r]).i]=e.x(n);return a.join("")})}function mu(n,t){for(var e,r=ta.interpolators.length;--r>=0&&!(e=ta.interpolators[r](n,t)););return e}function yu(n,t){var e,r=[],u=[],i=n.length,o=t.length,a=Math.min(n.length,t.length);for(e=0;a>e;++e)r.push(mu(n[e],t[e]));for(;i>e;++e)u[e]=n[e];for(;o>e;++e)u[e]=t[e];return function(n){for(e=0;a>e;++e)u[e]=r[e](n);return u}}function Mu(n){return function(t){return 0>=t?0:t>=1?1:n(t)}}function xu(n){return function(t){return 1-n(1-t)}}function bu(n){return function(t){return.5*(.5>t?n(2*t):2-n(2-2*t))}}function _u(n){return n*n}function wu(n){return n*n*n}function Su(n){if(0>=n)return 0;if(n>=1)return 1;var t=n*n,e=t*n;return 4*(.5>n?e:3*(n-t)+e-.75)}function ku(n){return function(t){return Math.pow(t,n)}}function Eu(n){return 1-Math.cos(n*Ra)}function Au(n){return Math.pow(2,10*(n-1))}function Nu(n){return 1-Math.sqrt(1-n*n)}function Cu(n,t){var e;return arguments.length<2&&(t=.45),arguments.length?e=t/La*Math.asin(1/n):(n=1,e=t/4),function(r){return 1+n*Math.pow(2,-10*r)*Math.sin((r-e)*La/t)}}function zu(n){return n||(n=1.70158),function(t){return t*t*((n+1)*t-n)}}function qu(n){return 1/2.75>n?7.5625*n*n:2/2.75>n?7.5625*(n-=1.5/2.75)*n+.75:2.5/2.75>n?7.5625*(n-=2.25/2.75)*n+.9375:7.5625*(n-=2.625/2.75)*n+.984375}function Lu(n,t){n=ta.hcl(n),t=ta.hcl(t);var e=n.h,r=n.c,u=n.l,i=t.h-e,o=t.c-r,a=t.l-u;return isNaN(o)&&(o=0,r=isNaN(r)?t.c:r),isNaN(i)?(i=0,e=isNaN(e)?t.h:e):i>180?i-=360:-180>i&&(i+=360),function(n){return st(e+i*n,r+o*n,u+a*n)+""}}function Tu(n,t){n=ta.hsl(n),t=ta.hsl(t);var e=n.h,r=n.s,u=n.l,i=t.h-e,o=t.s-r,a=t.l-u;return isNaN(o)&&(o=0,r=isNaN(r)?t.s:r),isNaN(i)?(i=0,e=isNaN(e)?t.h:e):i>180?i-=360:-180>i&&(i+=360),function(n){return ct(e+i*n,r+o*n,u+a*n)+""}}function Ru(n,t){n=ta.lab(n),t=ta.lab(t);var e=n.l,r=n.a,u=n.b,i=t.l-e,o=t.a-r,a=t.b-u;return function(n){return ht(e+i*n,r+o*n,u+a*n)+""}}function Du(n,t){return t-=n,function(e){return Math.round(n+t*e)}}function Pu(n){var t=[n.a,n.b],e=[n.c,n.d],r=ju(t),u=Uu(t,e),i=ju(Fu(e,t,-u))||0;t[0]*e[1]<e[0]*t[1]&&(t[0]*=-1,t[1]*=-1,r*=-1,u*=-1),this.rotate=(r?Math.atan2(t[1],t[0]):Math.atan2(-e[0],e[1]))*Pa,this.translate=[n.e,n.f],this.scale=[r,i],this.skew=i?Math.atan2(u,i)*Pa:0}function Uu(n,t){return n[0]*t[0]+n[1]*t[1]}function ju(n){var t=Math.sqrt(Uu(n,n));return t&&(n[0]/=t,n[1]/=t),t}function Fu(n,t,e){return n[0]+=e*t[0],n[1]+=e*t[1],n}function Hu(n,t){var e,r=[],u=[],i=ta.transform(n),o=ta.transform(t),a=i.translate,c=o.translate,l=i.rotate,s=o.rotate,f=i.skew,h=o.skew,g=i.scale,p=o.scale;return a[0]!=c[0]||a[1]!=c[1]?(r.push("translate(",null,",",null,")"),u.push({i:1,x:vu(a[0],c[0])},{i:3,x:vu(a[1],c[1])})):r.push(c[0]||c[1]?"translate("+c+")":""),l!=s?(l-s>180?s+=360:s-l>180&&(l+=360),u.push({i:r.push(r.pop()+"rotate(",null,")")-2,x:vu(l,s)})):s&&r.push(r.pop()+"rotate("+s+")"),f!=h?u.push({i:r.push(r.pop()+"skewX(",null,")")-2,x:vu(f,h)}):h&&r.push(r.pop()+"skewX("+h+")"),g[0]!=p[0]||g[1]!=p[1]?(e=r.push(r.pop()+"scale(",null,",",null,")"),u.push({i:e-4,x:vu(g[0],p[0])},{i:e-2,x:vu(g[1],p[1])})):(1!=p[0]||1!=p[1])&&r.push(r.pop()+"scale("+p+")"),e=u.length,function(n){for(var t,i=-1;++i<e;)r[(t=u[i]).i]=t.x(n);return r.join("")}}function Ou(n,t){return t=(t-=n=+n)||1/t,function(e){return(e-n)/t}}function Iu(n,t){return t=(t-=n=+n)||1/t,function(e){return Math.max(0,Math.min(1,(e-n)/t))}}function Yu(n){for(var t=n.source,e=n.target,r=Vu(t,e),u=[t];t!==r;)t=t.parent,u.push(t);for(var i=u.length;e!==r;)u.splice(i,0,e),e=e.parent;return u}function Zu(n){for(var t=[],e=n.parent;null!=e;)t.push(n),n=e,e=e.parent;return t.push(n),t}function Vu(n,t){if(n===t)return n;for(var e=Zu(n),r=Zu(t),u=e.pop(),i=r.pop(),o=null;u===i;)o=u,u=e.pop(),i=r.pop();return o}function Xu(n){n.fixed|=2}function $u(n){n.fixed&=-7}function Bu(n){n.fixed|=4,n.px=n.x,n.py=n.y}function Wu(n){n.fixed&=-5}function Ju(n,t,e){var r=0,u=0;if(n.charge=0,!n.leaf)for(var i,o=n.nodes,a=o.length,c=-1;++c<a;)i=o[c],null!=i&&(Ju(i,t,e),n.charge+=i.charge,r+=i.charge*i.cx,u+=i.charge*i.cy);if(n.point){n.leaf||(n.point.x+=Math.random()-.5,n.point.y+=Math.random()-.5);var l=t*e[n.point.index];n.charge+=n.pointCharge=l,r+=l*n.point.x,u+=l*n.point.y}n.cx=r/n.charge,n.cy=u/n.charge}function Gu(n,t){return ta.rebind(n,t,"sort","children","value"),n.nodes=n,n.links=ri,n}function Ku(n,t){for(var e=[n];null!=(n=e.pop());)if(t(n),(u=n.children)&&(r=u.length))for(var r,u;--r>=0;)e.push(u[r])}function Qu(n,t){for(var e=[n],r=[];null!=(n=e.pop());)if(r.push(n),(i=n.children)&&(u=i.length))for(var u,i,o=-1;++o<u;)e.push(i[o]);for(;null!=(n=r.pop());)t(n)}function ni(n){return n.children}function ti(n){return n.value}function ei(n,t){return t.value-n.value}function ri(n){return ta.merge(n.map(function(n){return(n.children||[]).map(function(t){return{source:n,target:t}})}))}function ui(n){return n.x}function ii(n){return n.y}function oi(n,t,e){n.y0=t,n.y=e}function ai(n){return ta.range(n.length)}function ci(n){for(var t=-1,e=n[0].length,r=[];++t<e;)r[t]=0;return r}function li(n){for(var t,e=1,r=0,u=n[0][1],i=n.length;i>e;++e)(t=n[e][1])>u&&(r=e,u=t);return r}function si(n){return n.reduce(fi,0)}function fi(n,t){return n+t[1]}function hi(n,t){return gi(n,Math.ceil(Math.log(t.length)/Math.LN2+1))}function gi(n,t){for(var e=-1,r=+n[0],u=(n[1]-r)/t,i=[];++e<=t;)i[e]=u*e+r;return i}function pi(n){return[ta.min(n),ta.max(n)]}function vi(n,t){return n.value-t.value}function di(n,t){var e=n._pack_next;n._pack_next=t,t._pack_prev=n,t._pack_next=e,e._pack_prev=t}function mi(n,t){n._pack_next=t,t._pack_prev=n}function yi(n,t){var e=t.x-n.x,r=t.y-n.y,u=n.r+t.r;return.999*u*u>e*e+r*r}function Mi(n){function t(n){s=Math.min(n.x-n.r,s),f=Math.max(n.x+n.r,f),h=Math.min(n.y-n.r,h),g=Math.max(n.y+n.r,g)}if((e=n.children)&&(l=e.length)){var e,r,u,i,o,a,c,l,s=1/0,f=-1/0,h=1/0,g=-1/0;if(e.forEach(xi),r=e[0],r.x=-r.r,r.y=0,t(r),l>1&&(u=e[1],u.x=u.r,u.y=0,t(u),l>2))for(i=e[2],wi(r,u,i),t(i),di(r,i),r._pack_prev=i,di(i,u),u=r._pack_next,o=3;l>o;o++){wi(r,u,i=e[o]);var p=0,v=1,d=1;for(a=u._pack_next;a!==u;a=a._pack_next,v++)if(yi(a,i)){p=1;break}if(1==p)for(c=r._pack_prev;c!==a._pack_prev&&!yi(c,i);c=c._pack_prev,d++);p?(d>v||v==d&&u.r<r.r?mi(r,u=a):mi(r=c,u),o--):(di(r,i),u=i,t(i))}var m=(s+f)/2,y=(h+g)/2,M=0;for(o=0;l>o;o++)i=e[o],i.x-=m,i.y-=y,M=Math.max(M,i.r+Math.sqrt(i.x*i.x+i.y*i.y));n.r=M,e.forEach(bi)}}function xi(n){n._pack_next=n._pack_prev=n}function bi(n){delete n._pack_next,delete n._pack_prev}function _i(n,t,e,r){var u=n.children;if(n.x=t+=r*n.x,n.y=e+=r*n.y,n.r*=r,u)for(var i=-1,o=u.length;++i<o;)_i(u[i],t,e,r)}function wi(n,t,e){var r=n.r+e.r,u=t.x-n.x,i=t.y-n.y;if(r&&(u||i)){var o=t.r+e.r,a=u*u+i*i;o*=o,r*=r;var c=.5+(r-o)/(2*a),l=Math.sqrt(Math.max(0,2*o*(r+a)-(r-=a)*r-o*o))/(2*a);e.x=n.x+c*u+l*i,e.y=n.y+c*i-l*u}else e.x=n.x+r,e.y=n.y}function Si(n,t){return n.parent==t.parent?1:2}function ki(n){var t=n.children;return t.length?t[0]:n.t}function Ei(n){var t,e=n.children;return(t=e.length)?e[t-1]:n.t}function Ai(n,t,e){var r=e/(t.i-n.i);t.c-=r,t.s+=e,n.c+=r,t.z+=e,t.m+=e}function Ni(n){for(var t,e=0,r=0,u=n.children,i=u.length;--i>=0;)t=u[i],t.z+=e,t.m+=e,e+=t.s+(r+=t.c)}function Ci(n,t,e){return n.a.parent===t.parent?n.a:e}function zi(n){return 1+ta.max(n,function(n){return n.y})}function qi(n){return n.reduce(function(n,t){return n+t.x},0)/n.length}function Li(n){var t=n.children;return t&&t.length?Li(t[0]):n}function Ti(n){var t,e=n.children;return e&&(t=e.length)?Ti(e[t-1]):n}function Ri(n){return{x:n.x,y:n.y,dx:n.dx,dy:n.dy}}function Di(n,t){var e=n.x+t[3],r=n.y+t[0],u=n.dx-t[1]-t[3],i=n.dy-t[0]-t[2];return 0>u&&(e+=u/2,u=0),0>i&&(r+=i/2,i=0),{x:e,y:r,dx:u,dy:i}}function Pi(n){var t=n[0],e=n[n.length-1];return e>t?[t,e]:[e,t]}function Ui(n){return n.rangeExtent?n.rangeExtent():Pi(n.range())}function ji(n,t,e,r){var u=e(n[0],n[1]),i=r(t[0],t[1]);return function(n){return i(u(n))}}function Fi(n,t){var e,r=0,u=n.length-1,i=n[r],o=n[u];return i>o&&(e=r,r=u,u=e,e=i,i=o,o=e),n[r]=t.floor(i),n[u]=t.ceil(o),n}function Hi(n){return n?{floor:function(t){return Math.floor(t/n)*n},ceil:function(t){return Math.ceil(t/n)*n}}:ml}function Oi(n,t,e,r){var u=[],i=[],o=0,a=Math.min(n.length,t.length)-1;for(n[a]<n[0]&&(n=n.slice().reverse(),t=t.slice().reverse());++o<=a;)u.push(e(n[o-1],n[o])),i.push(r(t[o-1],t[o]));return function(t){var e=ta.bisect(n,t,1,a)-1;return i[e](u[e](t))}}function Ii(n,t,e,r){function u(){var u=Math.min(n.length,t.length)>2?Oi:ji,c=r?Iu:Ou;return o=u(n,t,c,e),a=u(t,n,c,mu),i}function i(n){return o(n)}var o,a;return i.invert=function(n){return a(n)},i.domain=function(t){return arguments.length?(n=t.map(Number),u()):n},i.range=function(n){return arguments.length?(t=n,u()):t},i.rangeRound=function(n){return i.range(n).interpolate(Du)},i.clamp=function(n){return arguments.length?(r=n,u()):r},i.interpolate=function(n){return arguments.length?(e=n,u()):e},i.ticks=function(t){return Xi(n,t)},i.tickFormat=function(t,e){return $i(n,t,e)},i.nice=function(t){return Zi(n,t),u()},i.copy=function(){return Ii(n,t,e,r)},u()}function Yi(n,t){return ta.rebind(n,t,"range","rangeRound","interpolate","clamp")}function Zi(n,t){return Fi(n,Hi(Vi(n,t)[2]))}function Vi(n,t){null==t&&(t=10);var e=Pi(n),r=e[1]-e[0],u=Math.pow(10,Math.floor(Math.log(r/t)/Math.LN10)),i=t/r*u;return.15>=i?u*=10:.35>=i?u*=5:.75>=i&&(u*=2),e[0]=Math.ceil(e[0]/u)*u,e[1]=Math.floor(e[1]/u)*u+.5*u,e[2]=u,e}function Xi(n,t){return ta.range.apply(ta,Vi(n,t))}function $i(n,t,e){var r=Vi(n,t);if(e){var u=ic.exec(e);if(u.shift(),"s"===u[8]){var i=ta.formatPrefix(Math.max(ga(r[0]),ga(r[1])));return u[7]||(u[7]="."+Bi(i.scale(r[2]))),u[8]="f",e=ta.format(u.join("")),function(n){return e(i.scale(n))+i.symbol}}u[7]||(u[7]="."+Wi(u[8],r)),e=u.join("")}else e=",."+Bi(r[2])+"f";return ta.format(e)}function Bi(n){return-Math.floor(Math.log(n)/Math.LN10+.01)}function Wi(n,t){var e=Bi(t[2]);return n in yl?Math.abs(e-Bi(Math.max(ga(t[0]),ga(t[1]))))+ +("e"!==n):e-2*("%"===n)}function Ji(n,t,e,r){function u(n){return(e?Math.log(0>n?0:n):-Math.log(n>0?0:-n))/Math.log(t)}function i(n){return e?Math.pow(t,n):-Math.pow(t,-n)}function o(t){return n(u(t))}return o.invert=function(t){return i(n.invert(t))},o.domain=function(t){return arguments.length?(e=t[0]>=0,n.domain((r=t.map(Number)).map(u)),o):r},o.base=function(e){return arguments.length?(t=+e,n.domain(r.map(u)),o):t},o.nice=function(){var t=Fi(r.map(u),e?Math:xl);return n.domain(t),r=t.map(i),o},o.ticks=function(){var n=Pi(r),o=[],a=n[0],c=n[1],l=Math.floor(u(a)),s=Math.ceil(u(c)),f=t%1?2:t;if(isFinite(s-l)){if(e){for(;s>l;l++)for(var h=1;f>h;h++)o.push(i(l)*h);o.push(i(l))}else for(o.push(i(l));l++<s;)for(var h=f-1;h>0;h--)o.push(i(l)*h);for(l=0;o[l]<a;l++);for(s=o.length;o[s-1]>c;s--);o=o.slice(l,s)}return o},o.tickFormat=function(n,t){if(!arguments.length)return Ml;arguments.length<2?t=Ml:"function"!=typeof t&&(t=ta.format(t));var r,a=Math.max(.1,n/o.ticks().length),c=e?(r=1e-12,Math.ceil):(r=-1e-12,Math.floor);return function(n){return n/i(c(u(n)+r))<=a?t(n):""}},o.copy=function(){return Ji(n.copy(),t,e,r)},Yi(o,n)}function Gi(n,t,e){function r(t){return n(u(t))}var u=Ki(t),i=Ki(1/t);return r.invert=function(t){return i(n.invert(t))},r.domain=function(t){return arguments.length?(n.domain((e=t.map(Number)).map(u)),r):e},r.ticks=function(n){return Xi(e,n)},r.tickFormat=function(n,t){return $i(e,n,t)},r.nice=function(n){return r.domain(Zi(e,n))},r.exponent=function(o){return arguments.length?(u=Ki(t=o),i=Ki(1/t),n.domain(e.map(u)),r):t},r.copy=function(){return Gi(n.copy(),t,e)},Yi(r,n)}function Ki(n){return function(t){return 0>t?-Math.pow(-t,n):Math.pow(t,n)}}function Qi(n,t){function e(e){return i[((u.get(e)||("range"===t.t?u.set(e,n.push(e)):0/0))-1)%i.length]}function r(t,e){return ta.range(n.length).map(function(n){return t+e*n})}var u,i,o;return e.domain=function(r){if(!arguments.length)return n;n=[],u=new l;for(var i,o=-1,a=r.length;++o<a;)u.has(i=r[o])||u.set(i,n.push(i));return e[t.t].apply(e,t.a)},e.range=function(n){return arguments.length?(i=n,o=0,t={t:"range",a:arguments},e):i},e.rangePoints=function(u,a){arguments.length<2&&(a=0);var c=u[0],l=u[1],s=n.length<2?(c=(c+l)/2,0):(l-c)/(n.length-1+a);return i=r(c+s*a/2,s),o=0,t={t:"rangePoints",a:arguments},e},e.rangeRoundPoints=function(u,a){arguments.length<2&&(a=0);var c=u[0],l=u[1],s=n.length<2?(c=l=Math.round((c+l)/2),0):(l-c)/(n.length-1+a)|0;return i=r(c+Math.round(s*a/2+(l-c-(n.length-1+a)*s)/2),s),o=0,t={t:"rangeRoundPoints",a:arguments},e},e.rangeBands=function(u,a,c){arguments.length<2&&(a=0),arguments.length<3&&(c=a);var l=u[1]<u[0],s=u[l-0],f=u[1-l],h=(f-s)/(n.length-a+2*c);return i=r(s+h*c,h),l&&i.reverse(),o=h*(1-a),t={t:"rangeBands",a:arguments},e},e.rangeRoundBands=function(u,a,c){arguments.length<2&&(a=0),arguments.length<3&&(c=a);var l=u[1]<u[0],s=u[l-0],f=u[1-l],h=Math.floor((f-s)/(n.length-a+2*c));return i=r(s+Math.round((f-s-(n.length-a)*h)/2),h),l&&i.reverse(),o=Math.round(h*(1-a)),t={t:"rangeRoundBands",a:arguments},e},e.rangeBand=function(){return o},e.rangeExtent=function(){return Pi(t.a[0])},e.copy=function(){return Qi(n,t)},e.domain(n)}function no(n,t){function i(){var e=0,r=t.length;for(a=[];++e<r;)a[e-1]=ta.quantile(n,e/r);return o}function o(n){return isNaN(n=+n)?void 0:t[ta.bisect(a,n)]}var a;return o.domain=function(t){return arguments.length?(n=t.map(r).filter(u).sort(e),i()):n},o.range=function(n){return arguments.length?(t=n,i()):t},o.quantiles=function(){return a},o.invertExtent=function(e){return e=t.indexOf(e),0>e?[0/0,0/0]:[e>0?a[e-1]:n[0],e<a.length?a[e]:n[n.length-1]]},o.copy=function(){return no(n,t)},i()}function to(n,t,e){function r(t){return e[Math.max(0,Math.min(o,Math.floor(i*(t-n))))]}function u(){return i=e.length/(t-n),o=e.length-1,r}var i,o;return r.domain=function(e){return arguments.length?(n=+e[0],t=+e[e.length-1],u()):[n,t]},r.range=function(n){return arguments.length?(e=n,u()):e},r.invertExtent=function(t){return t=e.indexOf(t),t=0>t?0/0:t/i+n,[t,t+1/i]},r.copy=function(){return to(n,t,e)},u()}function eo(n,t){function e(e){return e>=e?t[ta.bisect(n,e)]:void 0}return e.domain=function(t){return arguments.length?(n=t,e):n},e.range=function(n){return arguments.length?(t=n,e):t},e.invertExtent=function(e){return e=t.indexOf(e),[n[e-1],n[e]]},e.copy=function(){return eo(n,t)},e}function ro(n){function t(n){return+n}return t.invert=t,t.domain=t.range=function(e){return arguments.length?(n=e.map(t),t):n},t.ticks=function(t){return Xi(n,t)},t.tickFormat=function(t,e){return $i(n,t,e)},t.copy=function(){return ro(n)},t}function uo(){return 0}function io(n){return n.innerRadius}function oo(n){return n.outerRadius}function ao(n){return n.startAngle}function co(n){return n.endAngle}function lo(n){return n&&n.padAngle}function so(n,t,e,r){return(n-e)*t-(t-r)*n>0?0:1}function fo(n,t,e,r,u){var i=n[0]-t[0],o=n[1]-t[1],a=(u?r:-r)/Math.sqrt(i*i+o*o),c=a*o,l=-a*i,s=n[0]+c,f=n[1]+l,h=t[0]+c,g=t[1]+l,p=(s+h)/2,v=(f+g)/2,d=h-s,m=g-f,y=d*d+m*m,M=e-r,x=s*g-h*f,b=(0>m?-1:1)*Math.sqrt(M*M*y-x*x),_=(x*m-d*b)/y,w=(-x*d-m*b)/y,S=(x*m+d*b)/y,k=(-x*d+m*b)/y,E=_-p,A=w-v,N=S-p,C=k-v;return E*E+A*A>N*N+C*C&&(_=S,w=k),[[_-c,w-l],[_*e/M,w*e/M]]}function ho(n){function t(t){function o(){l.push("M",i(n(s),a))}for(var c,l=[],s=[],f=-1,h=t.length,g=Et(e),p=Et(r);++f<h;)u.call(this,c=t[f],f)?s.push([+g.call(this,c,f),+p.call(this,c,f)]):s.length&&(o(),s=[]);return s.length&&o(),l.length?l.join(""):null}var e=Ar,r=Nr,u=Ne,i=go,o=i.key,a=.7;return t.x=function(n){return arguments.length?(e=n,t):e},t.y=function(n){return arguments.length?(r=n,t):r},t.defined=function(n){return arguments.length?(u=n,t):u},t.interpolate=function(n){return arguments.length?(o="function"==typeof n?i=n:(i=El.get(n)||go).key,t):o},t.tension=function(n){return arguments.length?(a=n,t):a},t}function go(n){return n.join("L")}function po(n){return go(n)+"Z"}function vo(n){for(var t=0,e=n.length,r=n[0],u=[r[0],",",r[1]];++t<e;)u.push("H",(r[0]+(r=n[t])[0])/2,"V",r[1]);return e>1&&u.push("H",r[0]),u.join("")}function mo(n){for(var t=0,e=n.length,r=n[0],u=[r[0],",",r[1]];++t<e;)u.push("V",(r=n[t])[1],"H",r[0]);return u.join("")}function yo(n){for(var t=0,e=n.length,r=n[0],u=[r[0],",",r[1]];++t<e;)u.push("H",(r=n[t])[0],"V",r[1]);return u.join("")}function Mo(n,t){return n.length<4?go(n):n[1]+_o(n.slice(1,-1),wo(n,t))}function xo(n,t){return n.length<3?go(n):n[0]+_o((n.push(n[0]),n),wo([n[n.length-2]].concat(n,[n[1]]),t))}function bo(n,t){return n.length<3?go(n):n[0]+_o(n,wo(n,t))}function _o(n,t){if(t.length<1||n.length!=t.length&&n.length!=t.length+2)return go(n);var e=n.length!=t.length,r="",u=n[0],i=n[1],o=t[0],a=o,c=1;if(e&&(r+="Q"+(i[0]-2*o[0]/3)+","+(i[1]-2*o[1]/3)+","+i[0]+","+i[1],u=n[1],c=2),t.length>1){a=t[1],i=n[c],c++,r+="C"+(u[0]+o[0])+","+(u[1]+o[1])+","+(i[0]-a[0])+","+(i[1]-a[1])+","+i[0]+","+i[1];for(var l=2;l<t.length;l++,c++)i=n[c],a=t[l],r+="S"+(i[0]-a[0])+","+(i[1]-a[1])+","+i[0]+","+i[1]}if(e){var s=n[c];r+="Q"+(i[0]+2*a[0]/3)+","+(i[1]+2*a[1]/3)+","+s[0]+","+s[1]}return r}function wo(n,t){for(var e,r=[],u=(1-t)/2,i=n[0],o=n[1],a=1,c=n.length;++a<c;)e=i,i=o,o=n[a],r.push([u*(o[0]-e[0]),u*(o[1]-e[1])]);return r}function So(n){if(n.length<3)return go(n);var t=1,e=n.length,r=n[0],u=r[0],i=r[1],o=[u,u,u,(r=n[1])[0]],a=[i,i,i,r[1]],c=[u,",",i,"L",No(Cl,o),",",No(Cl,a)];for(n.push(n[e-1]);++t<=e;)r=n[t],o.shift(),o.push(r[0]),a.shift(),a.push(r[1]),Co(c,o,a);return n.pop(),c.push("L",r),c.join("")}function ko(n){if(n.length<4)return go(n);for(var t,e=[],r=-1,u=n.length,i=[0],o=[0];++r<3;)t=n[r],i.push(t[0]),o.push(t[1]);for(e.push(No(Cl,i)+","+No(Cl,o)),--r;++r<u;)t=n[r],i.shift(),i.push(t[0]),o.shift(),o.push(t[1]),Co(e,i,o);return e.join("")}function Eo(n){for(var t,e,r=-1,u=n.length,i=u+4,o=[],a=[];++r<4;)e=n[r%u],o.push(e[0]),a.push(e[1]);for(t=[No(Cl,o),",",No(Cl,a)],--r;++r<i;)e=n[r%u],o.shift(),o.push(e[0]),a.shift(),a.push(e[1]),Co(t,o,a);return t.join("")}function Ao(n,t){var e=n.length-1;if(e)for(var r,u,i=n[0][0],o=n[0][1],a=n[e][0]-i,c=n[e][1]-o,l=-1;++l<=e;)r=n[l],u=l/e,r[0]=t*r[0]+(1-t)*(i+u*a),r[1]=t*r[1]+(1-t)*(o+u*c);return So(n)}function No(n,t){return n[0]*t[0]+n[1]*t[1]+n[2]*t[2]+n[3]*t[3]}function Co(n,t,e){n.push("C",No(Al,t),",",No(Al,e),",",No(Nl,t),",",No(Nl,e),",",No(Cl,t),",",No(Cl,e))}function zo(n,t){return(t[1]-n[1])/(t[0]-n[0])}function qo(n){for(var t=0,e=n.length-1,r=[],u=n[0],i=n[1],o=r[0]=zo(u,i);++t<e;)r[t]=(o+(o=zo(u=i,i=n[t+1])))/2;return r[t]=o,r}function Lo(n){for(var t,e,r,u,i=[],o=qo(n),a=-1,c=n.length-1;++a<c;)t=zo(n[a],n[a+1]),ga(t)<Ca?o[a]=o[a+1]=0:(e=o[a]/t,r=o[a+1]/t,u=e*e+r*r,u>9&&(u=3*t/Math.sqrt(u),o[a]=u*e,o[a+1]=u*r));for(a=-1;++a<=c;)u=(n[Math.min(c,a+1)][0]-n[Math.max(0,a-1)][0])/(6*(1+o[a]*o[a])),i.push([u||0,o[a]*u||0]);return i}function To(n){return n.length<3?go(n):n[0]+_o(n,Lo(n))}function Ro(n){for(var t,e,r,u=-1,i=n.length;++u<i;)t=n[u],e=t[0],r=t[1]-Ra,t[0]=e*Math.cos(r),t[1]=e*Math.sin(r);return n}function Do(n){function t(t){function c(){v.push("M",a(n(m),f),s,l(n(d.reverse()),f),"Z")}for(var h,g,p,v=[],d=[],m=[],y=-1,M=t.length,x=Et(e),b=Et(u),_=e===r?function(){return g}:Et(r),w=u===i?function(){return p}:Et(i);++y<M;)o.call(this,h=t[y],y)?(d.push([g=+x.call(this,h,y),p=+b.call(this,h,y)]),m.push([+_.call(this,h,y),+w.call(this,h,y)])):d.length&&(c(),d=[],m=[]);return d.length&&c(),v.length?v.join(""):null}var e=Ar,r=Ar,u=0,i=Nr,o=Ne,a=go,c=a.key,l=a,s="L",f=.7;return t.x=function(n){return arguments.length?(e=r=n,t):r},t.x0=function(n){return arguments.length?(e=n,t):e},t.x1=function(n){return arguments.length?(r=n,t):r
},t.y=function(n){return arguments.length?(u=i=n,t):i},t.y0=function(n){return arguments.length?(u=n,t):u},t.y1=function(n){return arguments.length?(i=n,t):i},t.defined=function(n){return arguments.length?(o=n,t):o},t.interpolate=function(n){return arguments.length?(c="function"==typeof n?a=n:(a=El.get(n)||go).key,l=a.reverse||a,s=a.closed?"M":"L",t):c},t.tension=function(n){return arguments.length?(f=n,t):f},t}function Po(n){return n.radius}function Uo(n){return[n.x,n.y]}function jo(n){return function(){var t=n.apply(this,arguments),e=t[0],r=t[1]-Ra;return[e*Math.cos(r),e*Math.sin(r)]}}function Fo(){return 64}function Ho(){return"circle"}function Oo(n){var t=Math.sqrt(n/qa);return"M0,"+t+"A"+t+","+t+" 0 1,1 0,"+-t+"A"+t+","+t+" 0 1,1 0,"+t+"Z"}function Io(n){return function(){var t,e;(t=this[n])&&(e=t[t.active])&&(--t.count?delete t[t.active]:delete this[n],t.active+=.5,e.event&&e.event.interrupt.call(this,this.__data__,e.index))}}function Yo(n,t,e){return ya(n,Pl),n.namespace=t,n.id=e,n}function Zo(n,t,e,r){var u=n.id,i=n.namespace;return Y(n,"function"==typeof e?function(n,o,a){n[i][u].tween.set(t,r(e.call(n,n.__data__,o,a)))}:(e=r(e),function(n){n[i][u].tween.set(t,e)}))}function Vo(n){return null==n&&(n=""),function(){this.textContent=n}}function Xo(n){return null==n?"__transition__":"__transition_"+n+"__"}function $o(n,t,e,r,u){var i=n[e]||(n[e]={active:0,count:0}),o=i[r];if(!o){var a=u.time;o=i[r]={tween:new l,time:a,delay:u.delay,duration:u.duration,ease:u.ease,index:t},u=null,++i.count,ta.timer(function(u){function c(e){if(i.active>r)return s();var u=i[i.active];u&&(--i.count,delete i[i.active],u.event&&u.event.interrupt.call(n,n.__data__,u.index)),i.active=r,o.event&&o.event.start.call(n,n.__data__,t),o.tween.forEach(function(e,r){(r=r.call(n,n.__data__,t))&&v.push(r)}),h=o.ease,f=o.duration,ta.timer(function(){return p.c=l(e||1)?Ne:l,1},0,a)}function l(e){if(i.active!==r)return 1;for(var u=e/f,a=h(u),c=v.length;c>0;)v[--c].call(n,a);return u>=1?(o.event&&o.event.end.call(n,n.__data__,t),s()):void 0}function s(){return--i.count?delete i[r]:delete n[e],1}var f,h,g=o.delay,p=ec,v=[];return p.t=g+a,u>=g?c(u-g):void(p.c=c)},0,a)}}function Bo(n,t,e){n.attr("transform",function(n){var r=t(n);return"translate("+(isFinite(r)?r:e(n))+",0)"})}function Wo(n,t,e){n.attr("transform",function(n){var r=t(n);return"translate(0,"+(isFinite(r)?r:e(n))+")"})}function Jo(n){return n.toISOString()}function Go(n,t,e){function r(t){return n(t)}function u(n,e){var r=n[1]-n[0],u=r/e,i=ta.bisect(Vl,u);return i==Vl.length?[t.year,Vi(n.map(function(n){return n/31536e6}),e)[2]]:i?t[u/Vl[i-1]<Vl[i]/u?i-1:i]:[Bl,Vi(n,e)[2]]}return r.invert=function(t){return Ko(n.invert(t))},r.domain=function(t){return arguments.length?(n.domain(t),r):n.domain().map(Ko)},r.nice=function(n,t){function e(e){return!isNaN(e)&&!n.range(e,Ko(+e+1),t).length}var i=r.domain(),o=Pi(i),a=null==n?u(o,10):"number"==typeof n&&u(o,n);return a&&(n=a[0],t=a[1]),r.domain(Fi(i,t>1?{floor:function(t){for(;e(t=n.floor(t));)t=Ko(t-1);return t},ceil:function(t){for(;e(t=n.ceil(t));)t=Ko(+t+1);return t}}:n))},r.ticks=function(n,t){var e=Pi(r.domain()),i=null==n?u(e,10):"number"==typeof n?u(e,n):!n.range&&[{range:n},t];return i&&(n=i[0],t=i[1]),n.range(e[0],Ko(+e[1]+1),1>t?1:t)},r.tickFormat=function(){return e},r.copy=function(){return Go(n.copy(),t,e)},Yi(r,n)}function Ko(n){return new Date(n)}function Qo(n){return JSON.parse(n.responseText)}function na(n){var t=ua.createRange();return t.selectNode(ua.body),t.createContextualFragment(n.responseText)}var ta={version:"3.5.5"},ea=[].slice,ra=function(n){return ea.call(n)},ua=this.document;if(ua)try{ra(ua.documentElement.childNodes)[0].nodeType}catch(ia){ra=function(n){for(var t=n.length,e=new Array(t);t--;)e[t]=n[t];return e}}if(Date.now||(Date.now=function(){return+new Date}),ua)try{ua.createElement("DIV").style.setProperty("opacity",0,"")}catch(oa){var aa=this.Element.prototype,ca=aa.setAttribute,la=aa.setAttributeNS,sa=this.CSSStyleDeclaration.prototype,fa=sa.setProperty;aa.setAttribute=function(n,t){ca.call(this,n,t+"")},aa.setAttributeNS=function(n,t,e){la.call(this,n,t,e+"")},sa.setProperty=function(n,t,e){fa.call(this,n,t+"",e)}}ta.ascending=e,ta.descending=function(n,t){return n>t?-1:t>n?1:t>=n?0:0/0},ta.min=function(n,t){var e,r,u=-1,i=n.length;if(1===arguments.length){for(;++u<i;)if(null!=(r=n[u])&&r>=r){e=r;break}for(;++u<i;)null!=(r=n[u])&&e>r&&(e=r)}else{for(;++u<i;)if(null!=(r=t.call(n,n[u],u))&&r>=r){e=r;break}for(;++u<i;)null!=(r=t.call(n,n[u],u))&&e>r&&(e=r)}return e},ta.max=function(n,t){var e,r,u=-1,i=n.length;if(1===arguments.length){for(;++u<i;)if(null!=(r=n[u])&&r>=r){e=r;break}for(;++u<i;)null!=(r=n[u])&&r>e&&(e=r)}else{for(;++u<i;)if(null!=(r=t.call(n,n[u],u))&&r>=r){e=r;break}for(;++u<i;)null!=(r=t.call(n,n[u],u))&&r>e&&(e=r)}return e},ta.extent=function(n,t){var e,r,u,i=-1,o=n.length;if(1===arguments.length){for(;++i<o;)if(null!=(r=n[i])&&r>=r){e=u=r;break}for(;++i<o;)null!=(r=n[i])&&(e>r&&(e=r),r>u&&(u=r))}else{for(;++i<o;)if(null!=(r=t.call(n,n[i],i))&&r>=r){e=u=r;break}for(;++i<o;)null!=(r=t.call(n,n[i],i))&&(e>r&&(e=r),r>u&&(u=r))}return[e,u]},ta.sum=function(n,t){var e,r=0,i=n.length,o=-1;if(1===arguments.length)for(;++o<i;)u(e=+n[o])&&(r+=e);else for(;++o<i;)u(e=+t.call(n,n[o],o))&&(r+=e);return r},ta.mean=function(n,t){var e,i=0,o=n.length,a=-1,c=o;if(1===arguments.length)for(;++a<o;)u(e=r(n[a]))?i+=e:--c;else for(;++a<o;)u(e=r(t.call(n,n[a],a)))?i+=e:--c;return c?i/c:void 0},ta.quantile=function(n,t){var e=(n.length-1)*t+1,r=Math.floor(e),u=+n[r-1],i=e-r;return i?u+i*(n[r]-u):u},ta.median=function(n,t){var i,o=[],a=n.length,c=-1;if(1===arguments.length)for(;++c<a;)u(i=r(n[c]))&&o.push(i);else for(;++c<a;)u(i=r(t.call(n,n[c],c)))&&o.push(i);return o.length?ta.quantile(o.sort(e),.5):void 0},ta.variance=function(n,t){var e,i,o=n.length,a=0,c=0,l=-1,s=0;if(1===arguments.length)for(;++l<o;)u(e=r(n[l]))&&(i=e-a,a+=i/++s,c+=i*(e-a));else for(;++l<o;)u(e=r(t.call(n,n[l],l)))&&(i=e-a,a+=i/++s,c+=i*(e-a));return s>1?c/(s-1):void 0},ta.deviation=function(){var n=ta.variance.apply(this,arguments);return n?Math.sqrt(n):n};var ha=i(e);ta.bisectLeft=ha.left,ta.bisect=ta.bisectRight=ha.right,ta.bisector=function(n){return i(1===n.length?function(t,r){return e(n(t),r)}:n)},ta.shuffle=function(n,t,e){(i=arguments.length)<3&&(e=n.length,2>i&&(t=0));for(var r,u,i=e-t;i;)u=Math.random()*i--|0,r=n[i+t],n[i+t]=n[u+t],n[u+t]=r;return n},ta.permute=function(n,t){for(var e=t.length,r=new Array(e);e--;)r[e]=n[t[e]];return r},ta.pairs=function(n){for(var t,e=0,r=n.length-1,u=n[0],i=new Array(0>r?0:r);r>e;)i[e]=[t=u,u=n[++e]];return i},ta.zip=function(){if(!(r=arguments.length))return[];for(var n=-1,t=ta.min(arguments,o),e=new Array(t);++n<t;)for(var r,u=-1,i=e[n]=new Array(r);++u<r;)i[u]=arguments[u][n];return e},ta.transpose=function(n){return ta.zip.apply(ta,n)},ta.keys=function(n){var t=[];for(var e in n)t.push(e);return t},ta.values=function(n){var t=[];for(var e in n)t.push(n[e]);return t},ta.entries=function(n){var t=[];for(var e in n)t.push({key:e,value:n[e]});return t},ta.merge=function(n){for(var t,e,r,u=n.length,i=-1,o=0;++i<u;)o+=n[i].length;for(e=new Array(o);--u>=0;)for(r=n[u],t=r.length;--t>=0;)e[--o]=r[t];return e};var ga=Math.abs;ta.range=function(n,t,e){if(arguments.length<3&&(e=1,arguments.length<2&&(t=n,n=0)),(t-n)/e===1/0)throw new Error("infinite range");var r,u=[],i=a(ga(e)),o=-1;if(n*=i,t*=i,e*=i,0>e)for(;(r=n+e*++o)>t;)u.push(r/i);else for(;(r=n+e*++o)<t;)u.push(r/i);return u},ta.map=function(n,t){var e=new l;if(n instanceof l)n.forEach(function(n,t){e.set(n,t)});else if(Array.isArray(n)){var r,u=-1,i=n.length;if(1===arguments.length)for(;++u<i;)e.set(u,n[u]);else for(;++u<i;)e.set(t.call(n,r=n[u],u),r)}else for(var o in n)e.set(o,n[o]);return e};var pa="__proto__",va="\x00";c(l,{has:h,get:function(n){return this._[s(n)]},set:function(n,t){return this._[s(n)]=t},remove:g,keys:p,values:function(){var n=[];for(var t in this._)n.push(this._[t]);return n},entries:function(){var n=[];for(var t in this._)n.push({key:f(t),value:this._[t]});return n},size:v,empty:d,forEach:function(n){for(var t in this._)n.call(this,f(t),this._[t])}}),ta.nest=function(){function n(t,o,a){if(a>=i.length)return r?r.call(u,o):e?o.sort(e):o;for(var c,s,f,h,g=-1,p=o.length,v=i[a++],d=new l;++g<p;)(h=d.get(c=v(s=o[g])))?h.push(s):d.set(c,[s]);return t?(s=t(),f=function(e,r){s.set(e,n(t,r,a))}):(s={},f=function(e,r){s[e]=n(t,r,a)}),d.forEach(f),s}function t(n,e){if(e>=i.length)return n;var r=[],u=o[e++];return n.forEach(function(n,u){r.push({key:n,values:t(u,e)})}),u?r.sort(function(n,t){return u(n.key,t.key)}):r}var e,r,u={},i=[],o=[];return u.map=function(t,e){return n(e,t,0)},u.entries=function(e){return t(n(ta.map,e,0),0)},u.key=function(n){return i.push(n),u},u.sortKeys=function(n){return o[i.length-1]=n,u},u.sortValues=function(n){return e=n,u},u.rollup=function(n){return r=n,u},u},ta.set=function(n){var t=new m;if(n)for(var e=0,r=n.length;r>e;++e)t.add(n[e]);return t},c(m,{has:h,add:function(n){return this._[s(n+="")]=!0,n},remove:g,values:p,size:v,empty:d,forEach:function(n){for(var t in this._)n.call(this,f(t))}}),ta.behavior={},ta.rebind=function(n,t){for(var e,r=1,u=arguments.length;++r<u;)n[e=arguments[r]]=M(n,t,t[e]);return n};var da=["webkit","ms","moz","Moz","o","O"];ta.dispatch=function(){for(var n=new _,t=-1,e=arguments.length;++t<e;)n[arguments[t]]=w(n);return n},_.prototype.on=function(n,t){var e=n.indexOf("."),r="";if(e>=0&&(r=n.slice(e+1),n=n.slice(0,e)),n)return arguments.length<2?this[n].on(r):this[n].on(r,t);if(2===arguments.length){if(null==t)for(n in this)this.hasOwnProperty(n)&&this[n].on(r,null);return this}},ta.event=null,ta.requote=function(n){return n.replace(ma,"\\$&")};var ma=/[\\\^\$\*\+\?\|\[\]\(\)\.\{\}]/g,ya={}.__proto__?function(n,t){n.__proto__=t}:function(n,t){for(var e in t)n[e]=t[e]},Ma=function(n,t){return t.querySelector(n)},xa=function(n,t){return t.querySelectorAll(n)},ba=function(n,t){var e=n.matches||n[x(n,"matchesSelector")];return(ba=function(n,t){return e.call(n,t)})(n,t)};"function"==typeof Sizzle&&(Ma=function(n,t){return Sizzle(n,t)[0]||null},xa=Sizzle,ba=Sizzle.matchesSelector),ta.selection=function(){return ta.select(ua.documentElement)};var _a=ta.selection.prototype=[];_a.select=function(n){var t,e,r,u,i=[];n=N(n);for(var o=-1,a=this.length;++o<a;){i.push(t=[]),t.parentNode=(r=this[o]).parentNode;for(var c=-1,l=r.length;++c<l;)(u=r[c])?(t.push(e=n.call(u,u.__data__,c,o)),e&&"__data__"in u&&(e.__data__=u.__data__)):t.push(null)}return A(i)},_a.selectAll=function(n){var t,e,r=[];n=C(n);for(var u=-1,i=this.length;++u<i;)for(var o=this[u],a=-1,c=o.length;++a<c;)(e=o[a])&&(r.push(t=ra(n.call(e,e.__data__,a,u))),t.parentNode=e);return A(r)};var wa={svg:"http://www.w3.org/2000/svg",xhtml:"http://www.w3.org/1999/xhtml",xlink:"http://www.w3.org/1999/xlink",xml:"http://www.w3.org/XML/1998/namespace",xmlns:"http://www.w3.org/2000/xmlns/"};ta.ns={prefix:wa,qualify:function(n){var t=n.indexOf(":"),e=n;return t>=0&&(e=n.slice(0,t),n=n.slice(t+1)),wa.hasOwnProperty(e)?{space:wa[e],local:n}:n}},_a.attr=function(n,t){if(arguments.length<2){if("string"==typeof n){var e=this.node();return n=ta.ns.qualify(n),n.local?e.getAttributeNS(n.space,n.local):e.getAttribute(n)}for(t in n)this.each(z(t,n[t]));return this}return this.each(z(n,t))},_a.classed=function(n,t){if(arguments.length<2){if("string"==typeof n){var e=this.node(),r=(n=T(n)).length,u=-1;if(t=e.classList){for(;++u<r;)if(!t.contains(n[u]))return!1}else for(t=e.getAttribute("class");++u<r;)if(!L(n[u]).test(t))return!1;return!0}for(t in n)this.each(R(t,n[t]));return this}return this.each(R(n,t))},_a.style=function(n,e,r){var u=arguments.length;if(3>u){if("string"!=typeof n){2>u&&(e="");for(r in n)this.each(P(r,n[r],e));return this}if(2>u){var i=this.node();return t(i).getComputedStyle(i,null).getPropertyValue(n)}r=""}return this.each(P(n,e,r))},_a.property=function(n,t){if(arguments.length<2){if("string"==typeof n)return this.node()[n];for(t in n)this.each(U(t,n[t]));return this}return this.each(U(n,t))},_a.text=function(n){return arguments.length?this.each("function"==typeof n?function(){var t=n.apply(this,arguments);this.textContent=null==t?"":t}:null==n?function(){this.textContent=""}:function(){this.textContent=n}):this.node().textContent},_a.html=function(n){return arguments.length?this.each("function"==typeof n?function(){var t=n.apply(this,arguments);this.innerHTML=null==t?"":t}:null==n?function(){this.innerHTML=""}:function(){this.innerHTML=n}):this.node().innerHTML},_a.append=function(n){return n=j(n),this.select(function(){return this.appendChild(n.apply(this,arguments))})},_a.insert=function(n,t){return n=j(n),t=N(t),this.select(function(){return this.insertBefore(n.apply(this,arguments),t.apply(this,arguments)||null)})},_a.remove=function(){return this.each(F)},_a.data=function(n,t){function e(n,e){var r,u,i,o=n.length,f=e.length,h=Math.min(o,f),g=new Array(f),p=new Array(f),v=new Array(o);if(t){var d,m=new l,y=new Array(o);for(r=-1;++r<o;)m.has(d=t.call(u=n[r],u.__data__,r))?v[r]=u:m.set(d,u),y[r]=d;for(r=-1;++r<f;)(u=m.get(d=t.call(e,i=e[r],r)))?u!==!0&&(g[r]=u,u.__data__=i):p[r]=H(i),m.set(d,!0);for(r=-1;++r<o;)m.get(y[r])!==!0&&(v[r]=n[r])}else{for(r=-1;++r<h;)u=n[r],i=e[r],u?(u.__data__=i,g[r]=u):p[r]=H(i);for(;f>r;++r)p[r]=H(e[r]);for(;o>r;++r)v[r]=n[r]}p.update=g,p.parentNode=g.parentNode=v.parentNode=n.parentNode,a.push(p),c.push(g),s.push(v)}var r,u,i=-1,o=this.length;if(!arguments.length){for(n=new Array(o=(r=this[0]).length);++i<o;)(u=r[i])&&(n[i]=u.__data__);return n}var a=Z([]),c=A([]),s=A([]);if("function"==typeof n)for(;++i<o;)e(r=this[i],n.call(r,r.parentNode.__data__,i));else for(;++i<o;)e(r=this[i],n);return c.enter=function(){return a},c.exit=function(){return s},c},_a.datum=function(n){return arguments.length?this.property("__data__",n):this.property("__data__")},_a.filter=function(n){var t,e,r,u=[];"function"!=typeof n&&(n=O(n));for(var i=0,o=this.length;o>i;i++){u.push(t=[]),t.parentNode=(e=this[i]).parentNode;for(var a=0,c=e.length;c>a;a++)(r=e[a])&&n.call(r,r.__data__,a,i)&&t.push(r)}return A(u)},_a.order=function(){for(var n=-1,t=this.length;++n<t;)for(var e,r=this[n],u=r.length-1,i=r[u];--u>=0;)(e=r[u])&&(i&&i!==e.nextSibling&&i.parentNode.insertBefore(e,i),i=e);return this},_a.sort=function(n){n=I.apply(this,arguments);for(var t=-1,e=this.length;++t<e;)this[t].sort(n);return this.order()},_a.each=function(n){return Y(this,function(t,e,r){n.call(t,t.__data__,e,r)})},_a.call=function(n){var t=ra(arguments);return n.apply(t[0]=this,t),this},_a.empty=function(){return!this.node()},_a.node=function(){for(var n=0,t=this.length;t>n;n++)for(var e=this[n],r=0,u=e.length;u>r;r++){var i=e[r];if(i)return i}return null},_a.size=function(){var n=0;return Y(this,function(){++n}),n};var Sa=[];ta.selection.enter=Z,ta.selection.enter.prototype=Sa,Sa.append=_a.append,Sa.empty=_a.empty,Sa.node=_a.node,Sa.call=_a.call,Sa.size=_a.size,Sa.select=function(n){for(var t,e,r,u,i,o=[],a=-1,c=this.length;++a<c;){r=(u=this[a]).update,o.push(t=[]),t.parentNode=u.parentNode;for(var l=-1,s=u.length;++l<s;)(i=u[l])?(t.push(r[l]=e=n.call(u.parentNode,i.__data__,l,a)),e.__data__=i.__data__):t.push(null)}return A(o)},Sa.insert=function(n,t){return arguments.length<2&&(t=V(this)),_a.insert.call(this,n,t)},ta.select=function(t){var e;return"string"==typeof t?(e=[Ma(t,ua)],e.parentNode=ua.documentElement):(e=[t],e.parentNode=n(t)),A([e])},ta.selectAll=function(n){var t;return"string"==typeof n?(t=ra(xa(n,ua)),t.parentNode=ua.documentElement):(t=n,t.parentNode=null),A([t])},_a.on=function(n,t,e){var r=arguments.length;if(3>r){if("string"!=typeof n){2>r&&(t=!1);for(e in n)this.each(X(e,n[e],t));return this}if(2>r)return(r=this.node()["__on"+n])&&r._;e=!1}return this.each(X(n,t,e))};var ka=ta.map({mouseenter:"mouseover",mouseleave:"mouseout"});ua&&ka.forEach(function(n){"on"+n in ua&&ka.remove(n)});var Ea,Aa=0;ta.mouse=function(n){return J(n,k())};var Na=this.navigator&&/WebKit/.test(this.navigator.userAgent)?-1:0;ta.touch=function(n,t,e){if(arguments.length<3&&(e=t,t=k().changedTouches),t)for(var r,u=0,i=t.length;i>u;++u)if((r=t[u]).identifier===e)return J(n,r)},ta.behavior.drag=function(){function n(){this.on("mousedown.drag",i).on("touchstart.drag",o)}function e(n,t,e,i,o){return function(){function a(){var n,e,r=t(h,v);r&&(n=r[0]-M[0],e=r[1]-M[1],p|=n|e,M=r,g({type:"drag",x:r[0]+l[0],y:r[1]+l[1],dx:n,dy:e}))}function c(){t(h,v)&&(m.on(i+d,null).on(o+d,null),y(p&&ta.event.target===f),g({type:"dragend"}))}var l,s=this,f=ta.event.target,h=s.parentNode,g=r.of(s,arguments),p=0,v=n(),d=".drag"+(null==v?"":"-"+v),m=ta.select(e(f)).on(i+d,a).on(o+d,c),y=W(f),M=t(h,v);u?(l=u.apply(s,arguments),l=[l.x-M[0],l.y-M[1]]):l=[0,0],g({type:"dragstart"})}}var r=E(n,"drag","dragstart","dragend"),u=null,i=e(b,ta.mouse,t,"mousemove","mouseup"),o=e(G,ta.touch,y,"touchmove","touchend");return n.origin=function(t){return arguments.length?(u=t,n):u},ta.rebind(n,r,"on")},ta.touches=function(n,t){return arguments.length<2&&(t=k().touches),t?ra(t).map(function(t){var e=J(n,t);return e.identifier=t.identifier,e}):[]};var Ca=1e-6,za=Ca*Ca,qa=Math.PI,La=2*qa,Ta=La-Ca,Ra=qa/2,Da=qa/180,Pa=180/qa,Ua=Math.SQRT2,ja=2,Fa=4;ta.interpolateZoom=function(n,t){function e(n){var t=n*y;if(m){var e=rt(v),o=i/(ja*h)*(e*ut(Ua*t+v)-et(v));return[r+o*l,u+o*s,i*e/rt(Ua*t+v)]}return[r+n*l,u+n*s,i*Math.exp(Ua*t)]}var r=n[0],u=n[1],i=n[2],o=t[0],a=t[1],c=t[2],l=o-r,s=a-u,f=l*l+s*s,h=Math.sqrt(f),g=(c*c-i*i+Fa*f)/(2*i*ja*h),p=(c*c-i*i-Fa*f)/(2*c*ja*h),v=Math.log(Math.sqrt(g*g+1)-g),d=Math.log(Math.sqrt(p*p+1)-p),m=d-v,y=(m||Math.log(c/i))/Ua;return e.duration=1e3*y,e},ta.behavior.zoom=function(){function n(n){n.on(q,f).on(Oa+".zoom",g).on("dblclick.zoom",p).on(R,h)}function e(n){return[(n[0]-k.x)/k.k,(n[1]-k.y)/k.k]}function r(n){return[n[0]*k.k+k.x,n[1]*k.k+k.y]}function u(n){k.k=Math.max(N[0],Math.min(N[1],n))}function i(n,t){t=r(t),k.x+=n[0]-t[0],k.y+=n[1]-t[1]}function o(t,e,r,o){t.__chart__={x:k.x,y:k.y,k:k.k},u(Math.pow(2,o)),i(d=e,r),t=ta.select(t),C>0&&(t=t.transition().duration(C)),t.call(n.event)}function a(){b&&b.domain(x.range().map(function(n){return(n-k.x)/k.k}).map(x.invert)),w&&w.domain(_.range().map(function(n){return(n-k.y)/k.k}).map(_.invert))}function c(n){z++||n({type:"zoomstart"})}function l(n){a(),n({type:"zoom",scale:k.k,translate:[k.x,k.y]})}function s(n){--z||n({type:"zoomend"}),d=null}function f(){function n(){f=1,i(ta.mouse(u),g),l(a)}function r(){h.on(L,null).on(T,null),p(f&&ta.event.target===o),s(a)}var u=this,o=ta.event.target,a=D.of(u,arguments),f=0,h=ta.select(t(u)).on(L,n).on(T,r),g=e(ta.mouse(u)),p=W(u);Dl.call(u),c(a)}function h(){function n(){var n=ta.touches(p);return g=k.k,n.forEach(function(n){n.identifier in d&&(d[n.identifier]=e(n))}),n}function t(){var t=ta.event.target;ta.select(t).on(x,r).on(b,a),_.push(t);for(var e=ta.event.changedTouches,u=0,i=e.length;i>u;++u)d[e[u].identifier]=null;var c=n(),l=Date.now();if(1===c.length){if(500>l-M){var s=c[0];o(p,s,d[s.identifier],Math.floor(Math.log(k.k)/Math.LN2)+1),S()}M=l}else if(c.length>1){var s=c[0],f=c[1],h=s[0]-f[0],g=s[1]-f[1];m=h*h+g*g}}function r(){var n,t,e,r,o=ta.touches(p);Dl.call(p);for(var a=0,c=o.length;c>a;++a,r=null)if(e=o[a],r=d[e.identifier]){if(t)break;n=e,t=r}if(r){var s=(s=e[0]-n[0])*s+(s=e[1]-n[1])*s,f=m&&Math.sqrt(s/m);n=[(n[0]+e[0])/2,(n[1]+e[1])/2],t=[(t[0]+r[0])/2,(t[1]+r[1])/2],u(f*g)}M=null,i(n,t),l(v)}function a(){if(ta.event.touches.length){for(var t=ta.event.changedTouches,e=0,r=t.length;r>e;++e)delete d[t[e].identifier];for(var u in d)return void n()}ta.selectAll(_).on(y,null),w.on(q,f).on(R,h),E(),s(v)}var g,p=this,v=D.of(p,arguments),d={},m=0,y=".zoom-"+ta.event.changedTouches[0].identifier,x="touchmove"+y,b="touchend"+y,_=[],w=ta.select(p),E=W(p);t(),c(v),w.on(q,null).on(R,t)}function g(){var n=D.of(this,arguments);y?clearTimeout(y):(v=e(d=m||ta.mouse(this)),Dl.call(this),c(n)),y=setTimeout(function(){y=null,s(n)},50),S(),u(Math.pow(2,.002*Ha())*k.k),i(d,v),l(n)}function p(){var n=ta.mouse(this),t=Math.log(k.k)/Math.LN2;o(this,n,e(n),ta.event.shiftKey?Math.ceil(t)-1:Math.floor(t)+1)}var v,d,m,y,M,x,b,_,w,k={x:0,y:0,k:1},A=[960,500],N=Ia,C=250,z=0,q="mousedown.zoom",L="mousemove.zoom",T="mouseup.zoom",R="touchstart.zoom",D=E(n,"zoomstart","zoom","zoomend");return Oa||(Oa="onwheel"in ua?(Ha=function(){return-ta.event.deltaY*(ta.event.deltaMode?120:1)},"wheel"):"onmousewheel"in ua?(Ha=function(){return ta.event.wheelDelta},"mousewheel"):(Ha=function(){return-ta.event.detail},"MozMousePixelScroll")),n.event=function(n){n.each(function(){var n=D.of(this,arguments),t=k;Tl?ta.select(this).transition().each("start.zoom",function(){k=this.__chart__||{x:0,y:0,k:1},c(n)}).tween("zoom:zoom",function(){var e=A[0],r=A[1],u=d?d[0]:e/2,i=d?d[1]:r/2,o=ta.interpolateZoom([(u-k.x)/k.k,(i-k.y)/k.k,e/k.k],[(u-t.x)/t.k,(i-t.y)/t.k,e/t.k]);return function(t){var r=o(t),a=e/r[2];this.__chart__=k={x:u-r[0]*a,y:i-r[1]*a,k:a},l(n)}}).each("interrupt.zoom",function(){s(n)}).each("end.zoom",function(){s(n)}):(this.__chart__=k,c(n),l(n),s(n))})},n.translate=function(t){return arguments.length?(k={x:+t[0],y:+t[1],k:k.k},a(),n):[k.x,k.y]},n.scale=function(t){return arguments.length?(k={x:k.x,y:k.y,k:+t},a(),n):k.k},n.scaleExtent=function(t){return arguments.length?(N=null==t?Ia:[+t[0],+t[1]],n):N},n.center=function(t){return arguments.length?(m=t&&[+t[0],+t[1]],n):m},n.size=function(t){return arguments.length?(A=t&&[+t[0],+t[1]],n):A},n.duration=function(t){return arguments.length?(C=+t,n):C},n.x=function(t){return arguments.length?(b=t,x=t.copy(),k={x:0,y:0,k:1},n):b},n.y=function(t){return arguments.length?(w=t,_=t.copy(),k={x:0,y:0,k:1},n):w},ta.rebind(n,D,"on")};var Ha,Oa,Ia=[0,1/0];ta.color=ot,ot.prototype.toString=function(){return this.rgb()+""},ta.hsl=at;var Ya=at.prototype=new ot;Ya.brighter=function(n){return n=Math.pow(.7,arguments.length?n:1),new at(this.h,this.s,this.l/n)},Ya.darker=function(n){return n=Math.pow(.7,arguments.length?n:1),new at(this.h,this.s,n*this.l)},Ya.rgb=function(){return ct(this.h,this.s,this.l)},ta.hcl=lt;var Za=lt.prototype=new ot;Za.brighter=function(n){return new lt(this.h,this.c,Math.min(100,this.l+Va*(arguments.length?n:1)))},Za.darker=function(n){return new lt(this.h,this.c,Math.max(0,this.l-Va*(arguments.length?n:1)))},Za.rgb=function(){return st(this.h,this.c,this.l).rgb()},ta.lab=ft;var Va=18,Xa=.95047,$a=1,Ba=1.08883,Wa=ft.prototype=new ot;Wa.brighter=function(n){return new ft(Math.min(100,this.l+Va*(arguments.length?n:1)),this.a,this.b)},Wa.darker=function(n){return new ft(Math.max(0,this.l-Va*(arguments.length?n:1)),this.a,this.b)},Wa.rgb=function(){return ht(this.l,this.a,this.b)},ta.rgb=mt;var Ja=mt.prototype=new ot;Ja.brighter=function(n){n=Math.pow(.7,arguments.length?n:1);var t=this.r,e=this.g,r=this.b,u=30;return t||e||r?(t&&u>t&&(t=u),e&&u>e&&(e=u),r&&u>r&&(r=u),new mt(Math.min(255,t/n),Math.min(255,e/n),Math.min(255,r/n))):new mt(u,u,u)},Ja.darker=function(n){return n=Math.pow(.7,arguments.length?n:1),new mt(n*this.r,n*this.g,n*this.b)},Ja.hsl=function(){return _t(this.r,this.g,this.b)},Ja.toString=function(){return"#"+xt(this.r)+xt(this.g)+xt(this.b)};var Ga=ta.map({aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074});Ga.forEach(function(n,t){Ga.set(n,yt(t))}),ta.functor=Et,ta.xhr=At(y),ta.dsv=function(n,t){function e(n,e,i){arguments.length<3&&(i=e,e=null);var o=Nt(n,t,null==e?r:u(e),i);return o.row=function(n){return arguments.length?o.response(null==(e=n)?r:u(n)):e},o}function r(n){return e.parse(n.responseText)}function u(n){return function(t){return e.parse(t.responseText,n)}}function i(t){return t.map(o).join(n)}function o(n){return a.test(n)?'"'+n.replace(/\"/g,'""')+'"':n}var a=new RegExp('["'+n+"\n]"),c=n.charCodeAt(0);return e.parse=function(n,t){var r;return e.parseRows(n,function(n,e){if(r)return r(n,e-1);var u=new Function("d","return {"+n.map(function(n,t){return JSON.stringify(n)+": d["+t+"]"}).join(",")+"}");r=t?function(n,e){return t(u(n),e)}:u})},e.parseRows=function(n,t){function e(){if(s>=l)return o;if(u)return u=!1,i;var t=s;if(34===n.charCodeAt(t)){for(var e=t;e++<l;)if(34===n.charCodeAt(e)){if(34!==n.charCodeAt(e+1))break;++e}s=e+2;var r=n.charCodeAt(e+1);return 13===r?(u=!0,10===n.charCodeAt(e+2)&&++s):10===r&&(u=!0),n.slice(t+1,e).replace(/""/g,'"')}for(;l>s;){var r=n.charCodeAt(s++),a=1;if(10===r)u=!0;else if(13===r)u=!0,10===n.charCodeAt(s)&&(++s,++a);else if(r!==c)continue;return n.slice(t,s-a)}return n.slice(t)}for(var r,u,i={},o={},a=[],l=n.length,s=0,f=0;(r=e())!==o;){for(var h=[];r!==i&&r!==o;)h.push(r),r=e();t&&null==(h=t(h,f++))||a.push(h)}return a},e.format=function(t){if(Array.isArray(t[0]))return e.formatRows(t);var r=new m,u=[];return t.forEach(function(n){for(var t in n)r.has(t)||u.push(r.add(t))}),[u.map(o).join(n)].concat(t.map(function(t){return u.map(function(n){return o(t[n])}).join(n)})).join("\n")},e.formatRows=function(n){return n.map(i).join("\n")},e},ta.csv=ta.dsv(",","text/csv"),ta.tsv=ta.dsv("	","text/tab-separated-values");var Ka,Qa,nc,tc,ec,rc=this[x(this,"requestAnimationFrame")]||function(n){setTimeout(n,17)};ta.timer=function(n,t,e){var r=arguments.length;2>r&&(t=0),3>r&&(e=Date.now());var u=e+t,i={c:n,t:u,f:!1,n:null};Qa?Qa.n=i:Ka=i,Qa=i,nc||(tc=clearTimeout(tc),nc=1,rc(qt))},ta.timer.flush=function(){Lt(),Tt()},ta.round=function(n,t){return t?Math.round(n*(t=Math.pow(10,t)))/t:Math.round(n)};var uc=["y","z","a","f","p","n","\xb5","m","","k","M","G","T","P","E","Z","Y"].map(Dt);ta.formatPrefix=function(n,t){var e=0;return n&&(0>n&&(n*=-1),t&&(n=ta.round(n,Rt(n,t))),e=1+Math.floor(1e-12+Math.log(n)/Math.LN10),e=Math.max(-24,Math.min(24,3*Math.floor((e-1)/3)))),uc[8+e/3]};var ic=/(?:([^{])?([<>=^]))?([+\- ])?([$#])?(0)?(\d+)?(,)?(\.-?\d+)?([a-z%])?/i,oc=ta.map({b:function(n){return n.toString(2)},c:function(n){return String.fromCharCode(n)},o:function(n){return n.toString(8)},x:function(n){return n.toString(16)},X:function(n){return n.toString(16).toUpperCase()},g:function(n,t){return n.toPrecision(t)},e:function(n,t){return n.toExponential(t)},f:function(n,t){return n.toFixed(t)},r:function(n,t){return(n=ta.round(n,Rt(n,t))).toFixed(Math.max(0,Math.min(20,Rt(n*(1+1e-15),t))))}}),ac=ta.time={},cc=Date;jt.prototype={getDate:function(){return this._.getUTCDate()},getDay:function(){return this._.getUTCDay()},getFullYear:function(){return this._.getUTCFullYear()},getHours:function(){return this._.getUTCHours()},getMilliseconds:function(){return this._.getUTCMilliseconds()},getMinutes:function(){return this._.getUTCMinutes()},getMonth:function(){return this._.getUTCMonth()},getSeconds:function(){return this._.getUTCSeconds()},getTime:function(){return this._.getTime()},getTimezoneOffset:function(){return 0},valueOf:function(){return this._.valueOf()},setDate:function(){lc.setUTCDate.apply(this._,arguments)},setDay:function(){lc.setUTCDay.apply(this._,arguments)},setFullYear:function(){lc.setUTCFullYear.apply(this._,arguments)},setHours:function(){lc.setUTCHours.apply(this._,arguments)},setMilliseconds:function(){lc.setUTCMilliseconds.apply(this._,arguments)},setMinutes:function(){lc.setUTCMinutes.apply(this._,arguments)},setMonth:function(){lc.setUTCMonth.apply(this._,arguments)},setSeconds:function(){lc.setUTCSeconds.apply(this._,arguments)},setTime:function(){lc.setTime.apply(this._,arguments)}};var lc=Date.prototype;ac.year=Ft(function(n){return n=ac.day(n),n.setMonth(0,1),n},function(n,t){n.setFullYear(n.getFullYear()+t)},function(n){return n.getFullYear()}),ac.years=ac.year.range,ac.years.utc=ac.year.utc.range,ac.day=Ft(function(n){var t=new cc(2e3,0);return t.setFullYear(n.getFullYear(),n.getMonth(),n.getDate()),t},function(n,t){n.setDate(n.getDate()+t)},function(n){return n.getDate()-1}),ac.days=ac.day.range,ac.days.utc=ac.day.utc.range,ac.dayOfYear=function(n){var t=ac.year(n);return Math.floor((n-t-6e4*(n.getTimezoneOffset()-t.getTimezoneOffset()))/864e5)},["sunday","monday","tuesday","wednesday","thursday","friday","saturday"].forEach(function(n,t){t=7-t;var e=ac[n]=Ft(function(n){return(n=ac.day(n)).setDate(n.getDate()-(n.getDay()+t)%7),n},function(n,t){n.setDate(n.getDate()+7*Math.floor(t))},function(n){var e=ac.year(n).getDay();return Math.floor((ac.dayOfYear(n)+(e+t)%7)/7)-(e!==t)});ac[n+"s"]=e.range,ac[n+"s"].utc=e.utc.range,ac[n+"OfYear"]=function(n){var e=ac.year(n).getDay();return Math.floor((ac.dayOfYear(n)+(e+t)%7)/7)}}),ac.week=ac.sunday,ac.weeks=ac.sunday.range,ac.weeks.utc=ac.sunday.utc.range,ac.weekOfYear=ac.sundayOfYear;var sc={"-":"",_:" ",0:"0"},fc=/^\s*\d+/,hc=/^%/;ta.locale=function(n){return{numberFormat:Pt(n),timeFormat:Ot(n)}};var gc=ta.locale({decimal:".",thousands:",",grouping:[3],currency:["$",""],dateTime:"%a %b %e %X %Y",date:"%m/%d/%Y",time:"%H:%M:%S",periods:["AM","PM"],days:["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],shortDays:["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],months:["January","February","March","April","May","June","July","August","September","October","November","December"],shortMonths:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]});ta.format=gc.numberFormat,ta.geo={},ce.prototype={s:0,t:0,add:function(n){le(n,this.t,pc),le(pc.s,this.s,this),this.s?this.t+=pc.t:this.s=pc.t
},reset:function(){this.s=this.t=0},valueOf:function(){return this.s}};var pc=new ce;ta.geo.stream=function(n,t){n&&vc.hasOwnProperty(n.type)?vc[n.type](n,t):se(n,t)};var vc={Feature:function(n,t){se(n.geometry,t)},FeatureCollection:function(n,t){for(var e=n.features,r=-1,u=e.length;++r<u;)se(e[r].geometry,t)}},dc={Sphere:function(n,t){t.sphere()},Point:function(n,t){n=n.coordinates,t.point(n[0],n[1],n[2])},MultiPoint:function(n,t){for(var e=n.coordinates,r=-1,u=e.length;++r<u;)n=e[r],t.point(n[0],n[1],n[2])},LineString:function(n,t){fe(n.coordinates,t,0)},MultiLineString:function(n,t){for(var e=n.coordinates,r=-1,u=e.length;++r<u;)fe(e[r],t,0)},Polygon:function(n,t){he(n.coordinates,t)},MultiPolygon:function(n,t){for(var e=n.coordinates,r=-1,u=e.length;++r<u;)he(e[r],t)},GeometryCollection:function(n,t){for(var e=n.geometries,r=-1,u=e.length;++r<u;)se(e[r],t)}};ta.geo.area=function(n){return mc=0,ta.geo.stream(n,Mc),mc};var mc,yc=new ce,Mc={sphere:function(){mc+=4*qa},point:b,lineStart:b,lineEnd:b,polygonStart:function(){yc.reset(),Mc.lineStart=ge},polygonEnd:function(){var n=2*yc;mc+=0>n?4*qa+n:n,Mc.lineStart=Mc.lineEnd=Mc.point=b}};ta.geo.bounds=function(){function n(n,t){M.push(x=[s=n,h=n]),f>t&&(f=t),t>g&&(g=t)}function t(t,e){var r=pe([t*Da,e*Da]);if(m){var u=de(m,r),i=[u[1],-u[0],0],o=de(i,u);Me(o),o=xe(o);var c=t-p,l=c>0?1:-1,v=o[0]*Pa*l,d=ga(c)>180;if(d^(v>l*p&&l*t>v)){var y=o[1]*Pa;y>g&&(g=y)}else if(v=(v+360)%360-180,d^(v>l*p&&l*t>v)){var y=-o[1]*Pa;f>y&&(f=y)}else f>e&&(f=e),e>g&&(g=e);d?p>t?a(s,t)>a(s,h)&&(h=t):a(t,h)>a(s,h)&&(s=t):h>=s?(s>t&&(s=t),t>h&&(h=t)):t>p?a(s,t)>a(s,h)&&(h=t):a(t,h)>a(s,h)&&(s=t)}else n(t,e);m=r,p=t}function e(){b.point=t}function r(){x[0]=s,x[1]=h,b.point=n,m=null}function u(n,e){if(m){var r=n-p;y+=ga(r)>180?r+(r>0?360:-360):r}else v=n,d=e;Mc.point(n,e),t(n,e)}function i(){Mc.lineStart()}function o(){u(v,d),Mc.lineEnd(),ga(y)>Ca&&(s=-(h=180)),x[0]=s,x[1]=h,m=null}function a(n,t){return(t-=n)<0?t+360:t}function c(n,t){return n[0]-t[0]}function l(n,t){return t[0]<=t[1]?t[0]<=n&&n<=t[1]:n<t[0]||t[1]<n}var s,f,h,g,p,v,d,m,y,M,x,b={point:n,lineStart:e,lineEnd:r,polygonStart:function(){b.point=u,b.lineStart=i,b.lineEnd=o,y=0,Mc.polygonStart()},polygonEnd:function(){Mc.polygonEnd(),b.point=n,b.lineStart=e,b.lineEnd=r,0>yc?(s=-(h=180),f=-(g=90)):y>Ca?g=90:-Ca>y&&(f=-90),x[0]=s,x[1]=h}};return function(n){g=h=-(s=f=1/0),M=[],ta.geo.stream(n,b);var t=M.length;if(t){M.sort(c);for(var e,r=1,u=M[0],i=[u];t>r;++r)e=M[r],l(e[0],u)||l(e[1],u)?(a(u[0],e[1])>a(u[0],u[1])&&(u[1]=e[1]),a(e[0],u[1])>a(u[0],u[1])&&(u[0]=e[0])):i.push(u=e);for(var o,e,p=-1/0,t=i.length-1,r=0,u=i[t];t>=r;u=e,++r)e=i[r],(o=a(u[1],e[0]))>p&&(p=o,s=e[0],h=u[1])}return M=x=null,1/0===s||1/0===f?[[0/0,0/0],[0/0,0/0]]:[[s,f],[h,g]]}}(),ta.geo.centroid=function(n){xc=bc=_c=wc=Sc=kc=Ec=Ac=Nc=Cc=zc=0,ta.geo.stream(n,qc);var t=Nc,e=Cc,r=zc,u=t*t+e*e+r*r;return za>u&&(t=kc,e=Ec,r=Ac,Ca>bc&&(t=_c,e=wc,r=Sc),u=t*t+e*e+r*r,za>u)?[0/0,0/0]:[Math.atan2(e,t)*Pa,tt(r/Math.sqrt(u))*Pa]};var xc,bc,_c,wc,Sc,kc,Ec,Ac,Nc,Cc,zc,qc={sphere:b,point:_e,lineStart:Se,lineEnd:ke,polygonStart:function(){qc.lineStart=Ee},polygonEnd:function(){qc.lineStart=Se}},Lc=Le(Ne,Pe,je,[-qa,-qa/2]),Tc=1e9;ta.geo.clipExtent=function(){var n,t,e,r,u,i,o={stream:function(n){return u&&(u.valid=!1),u=i(n),u.valid=!0,u},extent:function(a){return arguments.length?(i=Ie(n=+a[0][0],t=+a[0][1],e=+a[1][0],r=+a[1][1]),u&&(u.valid=!1,u=null),o):[[n,t],[e,r]]}};return o.extent([[0,0],[960,500]])},(ta.geo.conicEqualArea=function(){return Ye(Ze)}).raw=Ze,ta.geo.albers=function(){return ta.geo.conicEqualArea().rotate([96,0]).center([-.6,38.7]).parallels([29.5,45.5]).scale(1070)},ta.geo.albersUsa=function(){function n(n){var i=n[0],o=n[1];return t=null,e(i,o),t||(r(i,o),t)||u(i,o),t}var t,e,r,u,i=ta.geo.albers(),o=ta.geo.conicEqualArea().rotate([154,0]).center([-2,58.5]).parallels([55,65]),a=ta.geo.conicEqualArea().rotate([157,0]).center([-3,19.9]).parallels([8,18]),c={point:function(n,e){t=[n,e]}};return n.invert=function(n){var t=i.scale(),e=i.translate(),r=(n[0]-e[0])/t,u=(n[1]-e[1])/t;return(u>=.12&&.234>u&&r>=-.425&&-.214>r?o:u>=.166&&.234>u&&r>=-.214&&-.115>r?a:i).invert(n)},n.stream=function(n){var t=i.stream(n),e=o.stream(n),r=a.stream(n);return{point:function(n,u){t.point(n,u),e.point(n,u),r.point(n,u)},sphere:function(){t.sphere(),e.sphere(),r.sphere()},lineStart:function(){t.lineStart(),e.lineStart(),r.lineStart()},lineEnd:function(){t.lineEnd(),e.lineEnd(),r.lineEnd()},polygonStart:function(){t.polygonStart(),e.polygonStart(),r.polygonStart()},polygonEnd:function(){t.polygonEnd(),e.polygonEnd(),r.polygonEnd()}}},n.precision=function(t){return arguments.length?(i.precision(t),o.precision(t),a.precision(t),n):i.precision()},n.scale=function(t){return arguments.length?(i.scale(t),o.scale(.35*t),a.scale(t),n.translate(i.translate())):i.scale()},n.translate=function(t){if(!arguments.length)return i.translate();var l=i.scale(),s=+t[0],f=+t[1];return e=i.translate(t).clipExtent([[s-.455*l,f-.238*l],[s+.455*l,f+.238*l]]).stream(c).point,r=o.translate([s-.307*l,f+.201*l]).clipExtent([[s-.425*l+Ca,f+.12*l+Ca],[s-.214*l-Ca,f+.234*l-Ca]]).stream(c).point,u=a.translate([s-.205*l,f+.212*l]).clipExtent([[s-.214*l+Ca,f+.166*l+Ca],[s-.115*l-Ca,f+.234*l-Ca]]).stream(c).point,n},n.scale(1070)};var Rc,Dc,Pc,Uc,jc,Fc,Hc={point:b,lineStart:b,lineEnd:b,polygonStart:function(){Dc=0,Hc.lineStart=Ve},polygonEnd:function(){Hc.lineStart=Hc.lineEnd=Hc.point=b,Rc+=ga(Dc/2)}},Oc={point:Xe,lineStart:b,lineEnd:b,polygonStart:b,polygonEnd:b},Ic={point:We,lineStart:Je,lineEnd:Ge,polygonStart:function(){Ic.lineStart=Ke},polygonEnd:function(){Ic.point=We,Ic.lineStart=Je,Ic.lineEnd=Ge}};ta.geo.path=function(){function n(n){return n&&("function"==typeof a&&i.pointRadius(+a.apply(this,arguments)),o&&o.valid||(o=u(i)),ta.geo.stream(n,o)),i.result()}function t(){return o=null,n}var e,r,u,i,o,a=4.5;return n.area=function(n){return Rc=0,ta.geo.stream(n,u(Hc)),Rc},n.centroid=function(n){return _c=wc=Sc=kc=Ec=Ac=Nc=Cc=zc=0,ta.geo.stream(n,u(Ic)),zc?[Nc/zc,Cc/zc]:Ac?[kc/Ac,Ec/Ac]:Sc?[_c/Sc,wc/Sc]:[0/0,0/0]},n.bounds=function(n){return jc=Fc=-(Pc=Uc=1/0),ta.geo.stream(n,u(Oc)),[[Pc,Uc],[jc,Fc]]},n.projection=function(n){return arguments.length?(u=(e=n)?n.stream||tr(n):y,t()):e},n.context=function(n){return arguments.length?(i=null==(r=n)?new $e:new Qe(n),"function"!=typeof a&&i.pointRadius(a),t()):r},n.pointRadius=function(t){return arguments.length?(a="function"==typeof t?t:(i.pointRadius(+t),+t),n):a},n.projection(ta.geo.albersUsa()).context(null)},ta.geo.transform=function(n){return{stream:function(t){var e=new er(t);for(var r in n)e[r]=n[r];return e}}},er.prototype={point:function(n,t){this.stream.point(n,t)},sphere:function(){this.stream.sphere()},lineStart:function(){this.stream.lineStart()},lineEnd:function(){this.stream.lineEnd()},polygonStart:function(){this.stream.polygonStart()},polygonEnd:function(){this.stream.polygonEnd()}},ta.geo.projection=ur,ta.geo.projectionMutator=ir,(ta.geo.equirectangular=function(){return ur(ar)}).raw=ar.invert=ar,ta.geo.rotation=function(n){function t(t){return t=n(t[0]*Da,t[1]*Da),t[0]*=Pa,t[1]*=Pa,t}return n=lr(n[0]%360*Da,n[1]*Da,n.length>2?n[2]*Da:0),t.invert=function(t){return t=n.invert(t[0]*Da,t[1]*Da),t[0]*=Pa,t[1]*=Pa,t},t},cr.invert=ar,ta.geo.circle=function(){function n(){var n="function"==typeof r?r.apply(this,arguments):r,t=lr(-n[0]*Da,-n[1]*Da,0).invert,u=[];return e(null,null,1,{point:function(n,e){u.push(n=t(n,e)),n[0]*=Pa,n[1]*=Pa}}),{type:"Polygon",coordinates:[u]}}var t,e,r=[0,0],u=6;return n.origin=function(t){return arguments.length?(r=t,n):r},n.angle=function(r){return arguments.length?(e=gr((t=+r)*Da,u*Da),n):t},n.precision=function(r){return arguments.length?(e=gr(t*Da,(u=+r)*Da),n):u},n.angle(90)},ta.geo.distance=function(n,t){var e,r=(t[0]-n[0])*Da,u=n[1]*Da,i=t[1]*Da,o=Math.sin(r),a=Math.cos(r),c=Math.sin(u),l=Math.cos(u),s=Math.sin(i),f=Math.cos(i);return Math.atan2(Math.sqrt((e=f*o)*e+(e=l*s-c*f*a)*e),c*s+l*f*a)},ta.geo.graticule=function(){function n(){return{type:"MultiLineString",coordinates:t()}}function t(){return ta.range(Math.ceil(i/d)*d,u,d).map(h).concat(ta.range(Math.ceil(l/m)*m,c,m).map(g)).concat(ta.range(Math.ceil(r/p)*p,e,p).filter(function(n){return ga(n%d)>Ca}).map(s)).concat(ta.range(Math.ceil(a/v)*v,o,v).filter(function(n){return ga(n%m)>Ca}).map(f))}var e,r,u,i,o,a,c,l,s,f,h,g,p=10,v=p,d=90,m=360,y=2.5;return n.lines=function(){return t().map(function(n){return{type:"LineString",coordinates:n}})},n.outline=function(){return{type:"Polygon",coordinates:[h(i).concat(g(c).slice(1),h(u).reverse().slice(1),g(l).reverse().slice(1))]}},n.extent=function(t){return arguments.length?n.majorExtent(t).minorExtent(t):n.minorExtent()},n.majorExtent=function(t){return arguments.length?(i=+t[0][0],u=+t[1][0],l=+t[0][1],c=+t[1][1],i>u&&(t=i,i=u,u=t),l>c&&(t=l,l=c,c=t),n.precision(y)):[[i,l],[u,c]]},n.minorExtent=function(t){return arguments.length?(r=+t[0][0],e=+t[1][0],a=+t[0][1],o=+t[1][1],r>e&&(t=r,r=e,e=t),a>o&&(t=a,a=o,o=t),n.precision(y)):[[r,a],[e,o]]},n.step=function(t){return arguments.length?n.majorStep(t).minorStep(t):n.minorStep()},n.majorStep=function(t){return arguments.length?(d=+t[0],m=+t[1],n):[d,m]},n.minorStep=function(t){return arguments.length?(p=+t[0],v=+t[1],n):[p,v]},n.precision=function(t){return arguments.length?(y=+t,s=vr(a,o,90),f=dr(r,e,y),h=vr(l,c,90),g=dr(i,u,y),n):y},n.majorExtent([[-180,-90+Ca],[180,90-Ca]]).minorExtent([[-180,-80-Ca],[180,80+Ca]])},ta.geo.greatArc=function(){function n(){return{type:"LineString",coordinates:[t||r.apply(this,arguments),e||u.apply(this,arguments)]}}var t,e,r=mr,u=yr;return n.distance=function(){return ta.geo.distance(t||r.apply(this,arguments),e||u.apply(this,arguments))},n.source=function(e){return arguments.length?(r=e,t="function"==typeof e?null:e,n):r},n.target=function(t){return arguments.length?(u=t,e="function"==typeof t?null:t,n):u},n.precision=function(){return arguments.length?n:0},n},ta.geo.interpolate=function(n,t){return Mr(n[0]*Da,n[1]*Da,t[0]*Da,t[1]*Da)},ta.geo.length=function(n){return Yc=0,ta.geo.stream(n,Zc),Yc};var Yc,Zc={sphere:b,point:b,lineStart:xr,lineEnd:b,polygonStart:b,polygonEnd:b},Vc=br(function(n){return Math.sqrt(2/(1+n))},function(n){return 2*Math.asin(n/2)});(ta.geo.azimuthalEqualArea=function(){return ur(Vc)}).raw=Vc;var Xc=br(function(n){var t=Math.acos(n);return t&&t/Math.sin(t)},y);(ta.geo.azimuthalEquidistant=function(){return ur(Xc)}).raw=Xc,(ta.geo.conicConformal=function(){return Ye(_r)}).raw=_r,(ta.geo.conicEquidistant=function(){return Ye(wr)}).raw=wr;var $c=br(function(n){return 1/n},Math.atan);(ta.geo.gnomonic=function(){return ur($c)}).raw=$c,Sr.invert=function(n,t){return[n,2*Math.atan(Math.exp(t))-Ra]},(ta.geo.mercator=function(){return kr(Sr)}).raw=Sr;var Bc=br(function(){return 1},Math.asin);(ta.geo.orthographic=function(){return ur(Bc)}).raw=Bc;var Wc=br(function(n){return 1/(1+n)},function(n){return 2*Math.atan(n)});(ta.geo.stereographic=function(){return ur(Wc)}).raw=Wc,Er.invert=function(n,t){return[-t,2*Math.atan(Math.exp(n))-Ra]},(ta.geo.transverseMercator=function(){var n=kr(Er),t=n.center,e=n.rotate;return n.center=function(n){return n?t([-n[1],n[0]]):(n=t(),[n[1],-n[0]])},n.rotate=function(n){return n?e([n[0],n[1],n.length>2?n[2]+90:90]):(n=e(),[n[0],n[1],n[2]-90])},e([0,0,90])}).raw=Er,ta.geom={},ta.geom.hull=function(n){function t(n){if(n.length<3)return[];var t,u=Et(e),i=Et(r),o=n.length,a=[],c=[];for(t=0;o>t;t++)a.push([+u.call(this,n[t],t),+i.call(this,n[t],t),t]);for(a.sort(zr),t=0;o>t;t++)c.push([a[t][0],-a[t][1]]);var l=Cr(a),s=Cr(c),f=s[0]===l[0],h=s[s.length-1]===l[l.length-1],g=[];for(t=l.length-1;t>=0;--t)g.push(n[a[l[t]][2]]);for(t=+f;t<s.length-h;++t)g.push(n[a[s[t]][2]]);return g}var e=Ar,r=Nr;return arguments.length?t(n):(t.x=function(n){return arguments.length?(e=n,t):e},t.y=function(n){return arguments.length?(r=n,t):r},t)},ta.geom.polygon=function(n){return ya(n,Jc),n};var Jc=ta.geom.polygon.prototype=[];Jc.area=function(){for(var n,t=-1,e=this.length,r=this[e-1],u=0;++t<e;)n=r,r=this[t],u+=n[1]*r[0]-n[0]*r[1];return.5*u},Jc.centroid=function(n){var t,e,r=-1,u=this.length,i=0,o=0,a=this[u-1];for(arguments.length||(n=-1/(6*this.area()));++r<u;)t=a,a=this[r],e=t[0]*a[1]-a[0]*t[1],i+=(t[0]+a[0])*e,o+=(t[1]+a[1])*e;return[i*n,o*n]},Jc.clip=function(n){for(var t,e,r,u,i,o,a=Tr(n),c=-1,l=this.length-Tr(this),s=this[l-1];++c<l;){for(t=n.slice(),n.length=0,u=this[c],i=t[(r=t.length-a)-1],e=-1;++e<r;)o=t[e],qr(o,s,u)?(qr(i,s,u)||n.push(Lr(i,o,s,u)),n.push(o)):qr(i,s,u)&&n.push(Lr(i,o,s,u)),i=o;a&&n.push(n[0]),s=u}return n};var Gc,Kc,Qc,nl,tl,el=[],rl=[];Or.prototype.prepare=function(){for(var n,t=this.edges,e=t.length;e--;)n=t[e].edge,n.b&&n.a||t.splice(e,1);return t.sort(Yr),t.length},Qr.prototype={start:function(){return this.edge.l===this.site?this.edge.a:this.edge.b},end:function(){return this.edge.l===this.site?this.edge.b:this.edge.a}},nu.prototype={insert:function(n,t){var e,r,u;if(n){if(t.P=n,t.N=n.N,n.N&&(n.N.P=t),n.N=t,n.R){for(n=n.R;n.L;)n=n.L;n.L=t}else n.R=t;e=n}else this._?(n=uu(this._),t.P=null,t.N=n,n.P=n.L=t,e=n):(t.P=t.N=null,this._=t,e=null);for(t.L=t.R=null,t.U=e,t.C=!0,n=t;e&&e.C;)r=e.U,e===r.L?(u=r.R,u&&u.C?(e.C=u.C=!1,r.C=!0,n=r):(n===e.R&&(eu(this,e),n=e,e=n.U),e.C=!1,r.C=!0,ru(this,r))):(u=r.L,u&&u.C?(e.C=u.C=!1,r.C=!0,n=r):(n===e.L&&(ru(this,e),n=e,e=n.U),e.C=!1,r.C=!0,eu(this,r))),e=n.U;this._.C=!1},remove:function(n){n.N&&(n.N.P=n.P),n.P&&(n.P.N=n.N),n.N=n.P=null;var t,e,r,u=n.U,i=n.L,o=n.R;if(e=i?o?uu(o):i:o,u?u.L===n?u.L=e:u.R=e:this._=e,i&&o?(r=e.C,e.C=n.C,e.L=i,i.U=e,e!==o?(u=e.U,e.U=n.U,n=e.R,u.L=n,e.R=o,o.U=e):(e.U=u,u=e,n=e.R)):(r=n.C,n=e),n&&(n.U=u),!r){if(n&&n.C)return void(n.C=!1);do{if(n===this._)break;if(n===u.L){if(t=u.R,t.C&&(t.C=!1,u.C=!0,eu(this,u),t=u.R),t.L&&t.L.C||t.R&&t.R.C){t.R&&t.R.C||(t.L.C=!1,t.C=!0,ru(this,t),t=u.R),t.C=u.C,u.C=t.R.C=!1,eu(this,u),n=this._;break}}else if(t=u.L,t.C&&(t.C=!1,u.C=!0,ru(this,u),t=u.L),t.L&&t.L.C||t.R&&t.R.C){t.L&&t.L.C||(t.R.C=!1,t.C=!0,eu(this,t),t=u.L),t.C=u.C,u.C=t.L.C=!1,ru(this,u),n=this._;break}t.C=!0,n=u,u=u.U}while(!n.C);n&&(n.C=!1)}}},ta.geom.voronoi=function(n){function t(n){var t=new Array(n.length),r=a[0][0],u=a[0][1],i=a[1][0],o=a[1][1];return iu(e(n),a).cells.forEach(function(e,a){var c=e.edges,l=e.site,s=t[a]=c.length?c.map(function(n){var t=n.start();return[t.x,t.y]}):l.x>=r&&l.x<=i&&l.y>=u&&l.y<=o?[[r,o],[i,o],[i,u],[r,u]]:[];s.point=n[a]}),t}function e(n){return n.map(function(n,t){return{x:Math.round(i(n,t)/Ca)*Ca,y:Math.round(o(n,t)/Ca)*Ca,i:t}})}var r=Ar,u=Nr,i=r,o=u,a=ul;return n?t(n):(t.links=function(n){return iu(e(n)).edges.filter(function(n){return n.l&&n.r}).map(function(t){return{source:n[t.l.i],target:n[t.r.i]}})},t.triangles=function(n){var t=[];return iu(e(n)).cells.forEach(function(e,r){for(var u,i,o=e.site,a=e.edges.sort(Yr),c=-1,l=a.length,s=a[l-1].edge,f=s.l===o?s.r:s.l;++c<l;)u=s,i=f,s=a[c].edge,f=s.l===o?s.r:s.l,r<i.i&&r<f.i&&au(o,i,f)<0&&t.push([n[r],n[i.i],n[f.i]])}),t},t.x=function(n){return arguments.length?(i=Et(r=n),t):r},t.y=function(n){return arguments.length?(o=Et(u=n),t):u},t.clipExtent=function(n){return arguments.length?(a=null==n?ul:n,t):a===ul?null:a},t.size=function(n){return arguments.length?t.clipExtent(n&&[[0,0],n]):a===ul?null:a&&a[1]},t)};var ul=[[-1e6,-1e6],[1e6,1e6]];ta.geom.delaunay=function(n){return ta.geom.voronoi().triangles(n)},ta.geom.quadtree=function(n,t,e,r,u){function i(n){function i(n,t,e,r,u,i,o,a){if(!isNaN(e)&&!isNaN(r))if(n.leaf){var c=n.x,s=n.y;if(null!=c)if(ga(c-e)+ga(s-r)<.01)l(n,t,e,r,u,i,o,a);else{var f=n.point;n.x=n.y=n.point=null,l(n,f,c,s,u,i,o,a),l(n,t,e,r,u,i,o,a)}else n.x=e,n.y=r,n.point=t}else l(n,t,e,r,u,i,o,a)}function l(n,t,e,r,u,o,a,c){var l=.5*(u+a),s=.5*(o+c),f=e>=l,h=r>=s,g=h<<1|f;n.leaf=!1,n=n.nodes[g]||(n.nodes[g]=su()),f?u=l:a=l,h?o=s:c=s,i(n,t,e,r,u,o,a,c)}var s,f,h,g,p,v,d,m,y,M=Et(a),x=Et(c);if(null!=t)v=t,d=e,m=r,y=u;else if(m=y=-(v=d=1/0),f=[],h=[],p=n.length,o)for(g=0;p>g;++g)s=n[g],s.x<v&&(v=s.x),s.y<d&&(d=s.y),s.x>m&&(m=s.x),s.y>y&&(y=s.y),f.push(s.x),h.push(s.y);else for(g=0;p>g;++g){var b=+M(s=n[g],g),_=+x(s,g);v>b&&(v=b),d>_&&(d=_),b>m&&(m=b),_>y&&(y=_),f.push(b),h.push(_)}var w=m-v,S=y-d;w>S?y=d+w:m=v+S;var k=su();if(k.add=function(n){i(k,n,+M(n,++g),+x(n,g),v,d,m,y)},k.visit=function(n){fu(n,k,v,d,m,y)},k.find=function(n){return hu(k,n[0],n[1],v,d,m,y)},g=-1,null==t){for(;++g<p;)i(k,n[g],f[g],h[g],v,d,m,y);--g}else n.forEach(k.add);return f=h=n=s=null,k}var o,a=Ar,c=Nr;return(o=arguments.length)?(a=cu,c=lu,3===o&&(u=e,r=t,e=t=0),i(n)):(i.x=function(n){return arguments.length?(a=n,i):a},i.y=function(n){return arguments.length?(c=n,i):c},i.extent=function(n){return arguments.length?(null==n?t=e=r=u=null:(t=+n[0][0],e=+n[0][1],r=+n[1][0],u=+n[1][1]),i):null==t?null:[[t,e],[r,u]]},i.size=function(n){return arguments.length?(null==n?t=e=r=u=null:(t=e=0,r=+n[0],u=+n[1]),i):null==t?null:[r-t,u-e]},i)},ta.interpolateRgb=gu,ta.interpolateObject=pu,ta.interpolateNumber=vu,ta.interpolateString=du;var il=/[-+]?(?:\d+\.?\d*|\.?\d+)(?:[eE][-+]?\d+)?/g,ol=new RegExp(il.source,"g");ta.interpolate=mu,ta.interpolators=[function(n,t){var e=typeof t;return("string"===e?Ga.has(t)||/^(#|rgb\(|hsl\()/.test(t)?gu:du:t instanceof ot?gu:Array.isArray(t)?yu:"object"===e&&isNaN(t)?pu:vu)(n,t)}],ta.interpolateArray=yu;var al=function(){return y},cl=ta.map({linear:al,poly:ku,quad:function(){return _u},cubic:function(){return wu},sin:function(){return Eu},exp:function(){return Au},circle:function(){return Nu},elastic:Cu,back:zu,bounce:function(){return qu}}),ll=ta.map({"in":y,out:xu,"in-out":bu,"out-in":function(n){return bu(xu(n))}});ta.ease=function(n){var t=n.indexOf("-"),e=t>=0?n.slice(0,t):n,r=t>=0?n.slice(t+1):"in";return e=cl.get(e)||al,r=ll.get(r)||y,Mu(r(e.apply(null,ea.call(arguments,1))))},ta.interpolateHcl=Lu,ta.interpolateHsl=Tu,ta.interpolateLab=Ru,ta.interpolateRound=Du,ta.transform=function(n){var t=ua.createElementNS(ta.ns.prefix.svg,"g");return(ta.transform=function(n){if(null!=n){t.setAttribute("transform",n);var e=t.transform.baseVal.consolidate()}return new Pu(e?e.matrix:sl)})(n)},Pu.prototype.toString=function(){return"translate("+this.translate+")rotate("+this.rotate+")skewX("+this.skew+")scale("+this.scale+")"};var sl={a:1,b:0,c:0,d:1,e:0,f:0};ta.interpolateTransform=Hu,ta.layout={},ta.layout.bundle=function(){return function(n){for(var t=[],e=-1,r=n.length;++e<r;)t.push(Yu(n[e]));return t}},ta.layout.chord=function(){function n(){var n,l,f,h,g,p={},v=[],d=ta.range(i),m=[];for(e=[],r=[],n=0,h=-1;++h<i;){for(l=0,g=-1;++g<i;)l+=u[h][g];v.push(l),m.push(ta.range(i)),n+=l}for(o&&d.sort(function(n,t){return o(v[n],v[t])}),a&&m.forEach(function(n,t){n.sort(function(n,e){return a(u[t][n],u[t][e])})}),n=(La-s*i)/n,l=0,h=-1;++h<i;){for(f=l,g=-1;++g<i;){var y=d[h],M=m[y][g],x=u[y][M],b=l,_=l+=x*n;p[y+"-"+M]={index:y,subindex:M,startAngle:b,endAngle:_,value:x}}r[y]={index:y,startAngle:f,endAngle:l,value:(l-f)/n},l+=s}for(h=-1;++h<i;)for(g=h-1;++g<i;){var w=p[h+"-"+g],S=p[g+"-"+h];(w.value||S.value)&&e.push(w.value<S.value?{source:S,target:w}:{source:w,target:S})}c&&t()}function t(){e.sort(function(n,t){return c((n.source.value+n.target.value)/2,(t.source.value+t.target.value)/2)})}var e,r,u,i,o,a,c,l={},s=0;return l.matrix=function(n){return arguments.length?(i=(u=n)&&u.length,e=r=null,l):u},l.padding=function(n){return arguments.length?(s=n,e=r=null,l):s},l.sortGroups=function(n){return arguments.length?(o=n,e=r=null,l):o},l.sortSubgroups=function(n){return arguments.length?(a=n,e=null,l):a},l.sortChords=function(n){return arguments.length?(c=n,e&&t(),l):c},l.chords=function(){return e||n(),e},l.groups=function(){return r||n(),r},l},ta.layout.force=function(){function n(n){return function(t,e,r,u){if(t.point!==n){var i=t.cx-n.x,o=t.cy-n.y,a=u-e,c=i*i+o*o;if(c>a*a/d){if(p>c){var l=t.charge/c;n.px-=i*l,n.py-=o*l}return!0}if(t.point&&c&&p>c){var l=t.pointCharge/c;n.px-=i*l,n.py-=o*l}}return!t.charge}}function t(n){n.px=ta.event.x,n.py=ta.event.y,a.resume()}var e,r,u,i,o,a={},c=ta.dispatch("start","tick","end"),l=[1,1],s=.9,f=fl,h=hl,g=-30,p=gl,v=.1,d=.64,m=[],M=[];return a.tick=function(){if((r*=.99)<.005)return c.end({type:"end",alpha:r=0}),!0;var t,e,a,f,h,p,d,y,x,b=m.length,_=M.length;for(e=0;_>e;++e)a=M[e],f=a.source,h=a.target,y=h.x-f.x,x=h.y-f.y,(p=y*y+x*x)&&(p=r*i[e]*((p=Math.sqrt(p))-u[e])/p,y*=p,x*=p,h.x-=y*(d=f.weight/(h.weight+f.weight)),h.y-=x*d,f.x+=y*(d=1-d),f.y+=x*d);if((d=r*v)&&(y=l[0]/2,x=l[1]/2,e=-1,d))for(;++e<b;)a=m[e],a.x+=(y-a.x)*d,a.y+=(x-a.y)*d;if(g)for(Ju(t=ta.geom.quadtree(m),r,o),e=-1;++e<b;)(a=m[e]).fixed||t.visit(n(a));for(e=-1;++e<b;)a=m[e],a.fixed?(a.x=a.px,a.y=a.py):(a.x-=(a.px-(a.px=a.x))*s,a.y-=(a.py-(a.py=a.y))*s);c.tick({type:"tick",alpha:r})},a.nodes=function(n){return arguments.length?(m=n,a):m},a.links=function(n){return arguments.length?(M=n,a):M},a.size=function(n){return arguments.length?(l=n,a):l},a.linkDistance=function(n){return arguments.length?(f="function"==typeof n?n:+n,a):f},a.distance=a.linkDistance,a.linkStrength=function(n){return arguments.length?(h="function"==typeof n?n:+n,a):h},a.friction=function(n){return arguments.length?(s=+n,a):s},a.charge=function(n){return arguments.length?(g="function"==typeof n?n:+n,a):g},a.chargeDistance=function(n){return arguments.length?(p=n*n,a):Math.sqrt(p)},a.gravity=function(n){return arguments.length?(v=+n,a):v},a.theta=function(n){return arguments.length?(d=n*n,a):Math.sqrt(d)},a.alpha=function(n){return arguments.length?(n=+n,r?r=n>0?n:0:n>0&&(c.start({type:"start",alpha:r=n}),ta.timer(a.tick)),a):r},a.start=function(){function n(n,r){if(!e){for(e=new Array(c),a=0;c>a;++a)e[a]=[];for(a=0;s>a;++a){var u=M[a];e[u.source.index].push(u.target),e[u.target.index].push(u.source)}}for(var i,o=e[t],a=-1,l=o.length;++a<l;)if(!isNaN(i=o[a][n]))return i;return Math.random()*r}var t,e,r,c=m.length,s=M.length,p=l[0],v=l[1];for(t=0;c>t;++t)(r=m[t]).index=t,r.weight=0;for(t=0;s>t;++t)r=M[t],"number"==typeof r.source&&(r.source=m[r.source]),"number"==typeof r.target&&(r.target=m[r.target]),++r.source.weight,++r.target.weight;for(t=0;c>t;++t)r=m[t],isNaN(r.x)&&(r.x=n("x",p)),isNaN(r.y)&&(r.y=n("y",v)),isNaN(r.px)&&(r.px=r.x),isNaN(r.py)&&(r.py=r.y);if(u=[],"function"==typeof f)for(t=0;s>t;++t)u[t]=+f.call(this,M[t],t);else for(t=0;s>t;++t)u[t]=f;if(i=[],"function"==typeof h)for(t=0;s>t;++t)i[t]=+h.call(this,M[t],t);else for(t=0;s>t;++t)i[t]=h;if(o=[],"function"==typeof g)for(t=0;c>t;++t)o[t]=+g.call(this,m[t],t);else for(t=0;c>t;++t)o[t]=g;return a.resume()},a.resume=function(){return a.alpha(.1)},a.stop=function(){return a.alpha(0)},a.drag=function(){return e||(e=ta.behavior.drag().origin(y).on("dragstart.force",Xu).on("drag.force",t).on("dragend.force",$u)),arguments.length?void this.on("mouseover.force",Bu).on("mouseout.force",Wu).call(e):e},ta.rebind(a,c,"on")};var fl=20,hl=1,gl=1/0;ta.layout.hierarchy=function(){function n(u){var i,o=[u],a=[];for(u.depth=0;null!=(i=o.pop());)if(a.push(i),(l=e.call(n,i,i.depth))&&(c=l.length)){for(var c,l,s;--c>=0;)o.push(s=l[c]),s.parent=i,s.depth=i.depth+1;r&&(i.value=0),i.children=l}else r&&(i.value=+r.call(n,i,i.depth)||0),delete i.children;return Qu(u,function(n){var e,u;t&&(e=n.children)&&e.sort(t),r&&(u=n.parent)&&(u.value+=n.value)}),a}var t=ei,e=ni,r=ti;return n.sort=function(e){return arguments.length?(t=e,n):t},n.children=function(t){return arguments.length?(e=t,n):e},n.value=function(t){return arguments.length?(r=t,n):r},n.revalue=function(t){return r&&(Ku(t,function(n){n.children&&(n.value=0)}),Qu(t,function(t){var e;t.children||(t.value=+r.call(n,t,t.depth)||0),(e=t.parent)&&(e.value+=t.value)})),t},n},ta.layout.partition=function(){function n(t,e,r,u){var i=t.children;if(t.x=e,t.y=t.depth*u,t.dx=r,t.dy=u,i&&(o=i.length)){var o,a,c,l=-1;for(r=t.value?r/t.value:0;++l<o;)n(a=i[l],e,c=a.value*r,u),e+=c}}function t(n){var e=n.children,r=0;if(e&&(u=e.length))for(var u,i=-1;++i<u;)r=Math.max(r,t(e[i]));return 1+r}function e(e,i){var o=r.call(this,e,i);return n(o[0],0,u[0],u[1]/t(o[0])),o}var r=ta.layout.hierarchy(),u=[1,1];return e.size=function(n){return arguments.length?(u=n,e):u},Gu(e,r)},ta.layout.pie=function(){function n(o){var a,c=o.length,l=o.map(function(e,r){return+t.call(n,e,r)}),s=+("function"==typeof r?r.apply(this,arguments):r),f=("function"==typeof u?u.apply(this,arguments):u)-s,h=Math.min(Math.abs(f)/c,+("function"==typeof i?i.apply(this,arguments):i)),g=h*(0>f?-1:1),p=(f-c*g)/ta.sum(l),v=ta.range(c),d=[];return null!=e&&v.sort(e===pl?function(n,t){return l[t]-l[n]}:function(n,t){return e(o[n],o[t])}),v.forEach(function(n){d[n]={data:o[n],value:a=l[n],startAngle:s,endAngle:s+=a*p+g,padAngle:h}}),d}var t=Number,e=pl,r=0,u=La,i=0;return n.value=function(e){return arguments.length?(t=e,n):t},n.sort=function(t){return arguments.length?(e=t,n):e},n.startAngle=function(t){return arguments.length?(r=t,n):r},n.endAngle=function(t){return arguments.length?(u=t,n):u},n.padAngle=function(t){return arguments.length?(i=t,n):i},n};var pl={};ta.layout.stack=function(){function n(a,c){if(!(h=a.length))return a;var l=a.map(function(e,r){return t.call(n,e,r)}),s=l.map(function(t){return t.map(function(t,e){return[i.call(n,t,e),o.call(n,t,e)]})}),f=e.call(n,s,c);l=ta.permute(l,f),s=ta.permute(s,f);var h,g,p,v,d=r.call(n,s,c),m=l[0].length;for(p=0;m>p;++p)for(u.call(n,l[0][p],v=d[p],s[0][p][1]),g=1;h>g;++g)u.call(n,l[g][p],v+=s[g-1][p][1],s[g][p][1]);return a}var t=y,e=ai,r=ci,u=oi,i=ui,o=ii;return n.values=function(e){return arguments.length?(t=e,n):t},n.order=function(t){return arguments.length?(e="function"==typeof t?t:vl.get(t)||ai,n):e},n.offset=function(t){return arguments.length?(r="function"==typeof t?t:dl.get(t)||ci,n):r},n.x=function(t){return arguments.length?(i=t,n):i},n.y=function(t){return arguments.length?(o=t,n):o},n.out=function(t){return arguments.length?(u=t,n):u},n};var vl=ta.map({"inside-out":function(n){var t,e,r=n.length,u=n.map(li),i=n.map(si),o=ta.range(r).sort(function(n,t){return u[n]-u[t]}),a=0,c=0,l=[],s=[];for(t=0;r>t;++t)e=o[t],c>a?(a+=i[e],l.push(e)):(c+=i[e],s.push(e));return s.reverse().concat(l)},reverse:function(n){return ta.range(n.length).reverse()},"default":ai}),dl=ta.map({silhouette:function(n){var t,e,r,u=n.length,i=n[0].length,o=[],a=0,c=[];for(e=0;i>e;++e){for(t=0,r=0;u>t;t++)r+=n[t][e][1];r>a&&(a=r),o.push(r)}for(e=0;i>e;++e)c[e]=(a-o[e])/2;return c},wiggle:function(n){var t,e,r,u,i,o,a,c,l,s=n.length,f=n[0],h=f.length,g=[];for(g[0]=c=l=0,e=1;h>e;++e){for(t=0,u=0;s>t;++t)u+=n[t][e][1];for(t=0,i=0,a=f[e][0]-f[e-1][0];s>t;++t){for(r=0,o=(n[t][e][1]-n[t][e-1][1])/(2*a);t>r;++r)o+=(n[r][e][1]-n[r][e-1][1])/a;i+=o*n[t][e][1]}g[e]=c-=u?i/u*a:0,l>c&&(l=c)}for(e=0;h>e;++e)g[e]-=l;return g},expand:function(n){var t,e,r,u=n.length,i=n[0].length,o=1/u,a=[];for(e=0;i>e;++e){for(t=0,r=0;u>t;t++)r+=n[t][e][1];if(r)for(t=0;u>t;t++)n[t][e][1]/=r;else for(t=0;u>t;t++)n[t][e][1]=o}for(e=0;i>e;++e)a[e]=0;return a},zero:ci});ta.layout.histogram=function(){function n(n,i){for(var o,a,c=[],l=n.map(e,this),s=r.call(this,l,i),f=u.call(this,s,l,i),i=-1,h=l.length,g=f.length-1,p=t?1:1/h;++i<g;)o=c[i]=[],o.dx=f[i+1]-(o.x=f[i]),o.y=0;if(g>0)for(i=-1;++i<h;)a=l[i],a>=s[0]&&a<=s[1]&&(o=c[ta.bisect(f,a,1,g)-1],o.y+=p,o.push(n[i]));return c}var t=!0,e=Number,r=pi,u=hi;return n.value=function(t){return arguments.length?(e=t,n):e},n.range=function(t){return arguments.length?(r=Et(t),n):r},n.bins=function(t){return arguments.length?(u="number"==typeof t?function(n){return gi(n,t)}:Et(t),n):u},n.frequency=function(e){return arguments.length?(t=!!e,n):t},n},ta.layout.pack=function(){function n(n,i){var o=e.call(this,n,i),a=o[0],c=u[0],l=u[1],s=null==t?Math.sqrt:"function"==typeof t?t:function(){return t};if(a.x=a.y=0,Qu(a,function(n){n.r=+s(n.value)}),Qu(a,Mi),r){var f=r*(t?1:Math.max(2*a.r/c,2*a.r/l))/2;Qu(a,function(n){n.r+=f}),Qu(a,Mi),Qu(a,function(n){n.r-=f})}return _i(a,c/2,l/2,t?1:1/Math.max(2*a.r/c,2*a.r/l)),o}var t,e=ta.layout.hierarchy().sort(vi),r=0,u=[1,1];return n.size=function(t){return arguments.length?(u=t,n):u},n.radius=function(e){return arguments.length?(t=null==e||"function"==typeof e?e:+e,n):t},n.padding=function(t){return arguments.length?(r=+t,n):r},Gu(n,e)},ta.layout.tree=function(){function n(n,u){var s=o.call(this,n,u),f=s[0],h=t(f);if(Qu(h,e),h.parent.m=-h.z,Ku(h,r),l)Ku(f,i);else{var g=f,p=f,v=f;Ku(f,function(n){n.x<g.x&&(g=n),n.x>p.x&&(p=n),n.depth>v.depth&&(v=n)});var d=a(g,p)/2-g.x,m=c[0]/(p.x+a(p,g)/2+d),y=c[1]/(v.depth||1);Ku(f,function(n){n.x=(n.x+d)*m,n.y=n.depth*y})}return s}function t(n){for(var t,e={A:null,children:[n]},r=[e];null!=(t=r.pop());)for(var u,i=t.children,o=0,a=i.length;a>o;++o)r.push((i[o]=u={_:i[o],parent:t,children:(u=i[o].children)&&u.slice()||[],A:null,a:null,z:0,m:0,c:0,s:0,t:null,i:o}).a=u);return e.children[0]}function e(n){var t=n.children,e=n.parent.children,r=n.i?e[n.i-1]:null;if(t.length){Ni(n);var i=(t[0].z+t[t.length-1].z)/2;r?(n.z=r.z+a(n._,r._),n.m=n.z-i):n.z=i}else r&&(n.z=r.z+a(n._,r._));n.parent.A=u(n,r,n.parent.A||e[0])}function r(n){n._.x=n.z+n.parent.m,n.m+=n.parent.m}function u(n,t,e){if(t){for(var r,u=n,i=n,o=t,c=u.parent.children[0],l=u.m,s=i.m,f=o.m,h=c.m;o=Ei(o),u=ki(u),o&&u;)c=ki(c),i=Ei(i),i.a=n,r=o.z+f-u.z-l+a(o._,u._),r>0&&(Ai(Ci(o,n,e),n,r),l+=r,s+=r),f+=o.m,l+=u.m,h+=c.m,s+=i.m;o&&!Ei(i)&&(i.t=o,i.m+=f-s),u&&!ki(c)&&(c.t=u,c.m+=l-h,e=n)}return e}function i(n){n.x*=c[0],n.y=n.depth*c[1]}var o=ta.layout.hierarchy().sort(null).value(null),a=Si,c=[1,1],l=null;return n.separation=function(t){return arguments.length?(a=t,n):a},n.size=function(t){return arguments.length?(l=null==(c=t)?i:null,n):l?null:c},n.nodeSize=function(t){return arguments.length?(l=null==(c=t)?null:i,n):l?c:null},Gu(n,o)},ta.layout.cluster=function(){function n(n,i){var o,a=t.call(this,n,i),c=a[0],l=0;Qu(c,function(n){var t=n.children;t&&t.length?(n.x=qi(t),n.y=zi(t)):(n.x=o?l+=e(n,o):0,n.y=0,o=n)});var s=Li(c),f=Ti(c),h=s.x-e(s,f)/2,g=f.x+e(f,s)/2;return Qu(c,u?function(n){n.x=(n.x-c.x)*r[0],n.y=(c.y-n.y)*r[1]}:function(n){n.x=(n.x-h)/(g-h)*r[0],n.y=(1-(c.y?n.y/c.y:1))*r[1]}),a}var t=ta.layout.hierarchy().sort(null).value(null),e=Si,r=[1,1],u=!1;return n.separation=function(t){return arguments.length?(e=t,n):e},n.size=function(t){return arguments.length?(u=null==(r=t),n):u?null:r},n.nodeSize=function(t){return arguments.length?(u=null!=(r=t),n):u?r:null},Gu(n,t)},ta.layout.treemap=function(){function n(n,t){for(var e,r,u=-1,i=n.length;++u<i;)r=(e=n[u]).value*(0>t?0:t),e.area=isNaN(r)||0>=r?0:r}function t(e){var i=e.children;if(i&&i.length){var o,a,c,l=f(e),s=[],h=i.slice(),p=1/0,v="slice"===g?l.dx:"dice"===g?l.dy:"slice-dice"===g?1&e.depth?l.dy:l.dx:Math.min(l.dx,l.dy);for(n(h,l.dx*l.dy/e.value),s.area=0;(c=h.length)>0;)s.push(o=h[c-1]),s.area+=o.area,"squarify"!==g||(a=r(s,v))<=p?(h.pop(),p=a):(s.area-=s.pop().area,u(s,v,l,!1),v=Math.min(l.dx,l.dy),s.length=s.area=0,p=1/0);s.length&&(u(s,v,l,!0),s.length=s.area=0),i.forEach(t)}}function e(t){var r=t.children;if(r&&r.length){var i,o=f(t),a=r.slice(),c=[];for(n(a,o.dx*o.dy/t.value),c.area=0;i=a.pop();)c.push(i),c.area+=i.area,null!=i.z&&(u(c,i.z?o.dx:o.dy,o,!a.length),c.length=c.area=0);r.forEach(e)}}function r(n,t){for(var e,r=n.area,u=0,i=1/0,o=-1,a=n.length;++o<a;)(e=n[o].area)&&(i>e&&(i=e),e>u&&(u=e));return r*=r,t*=t,r?Math.max(t*u*p/r,r/(t*i*p)):1/0}function u(n,t,e,r){var u,i=-1,o=n.length,a=e.x,l=e.y,s=t?c(n.area/t):0;if(t==e.dx){for((r||s>e.dy)&&(s=e.dy);++i<o;)u=n[i],u.x=a,u.y=l,u.dy=s,a+=u.dx=Math.min(e.x+e.dx-a,s?c(u.area/s):0);u.z=!0,u.dx+=e.x+e.dx-a,e.y+=s,e.dy-=s}else{for((r||s>e.dx)&&(s=e.dx);++i<o;)u=n[i],u.x=a,u.y=l,u.dx=s,l+=u.dy=Math.min(e.y+e.dy-l,s?c(u.area/s):0);u.z=!1,u.dy+=e.y+e.dy-l,e.x+=s,e.dx-=s}}function i(r){var u=o||a(r),i=u[0];return i.x=0,i.y=0,i.dx=l[0],i.dy=l[1],o&&a.revalue(i),n([i],i.dx*i.dy/i.value),(o?e:t)(i),h&&(o=u),u}var o,a=ta.layout.hierarchy(),c=Math.round,l=[1,1],s=null,f=Ri,h=!1,g="squarify",p=.5*(1+Math.sqrt(5));
return i.size=function(n){return arguments.length?(l=n,i):l},i.padding=function(n){function t(t){var e=n.call(i,t,t.depth);return null==e?Ri(t):Di(t,"number"==typeof e?[e,e,e,e]:e)}function e(t){return Di(t,n)}if(!arguments.length)return s;var r;return f=null==(s=n)?Ri:"function"==(r=typeof n)?t:"number"===r?(n=[n,n,n,n],e):e,i},i.round=function(n){return arguments.length?(c=n?Math.round:Number,i):c!=Number},i.sticky=function(n){return arguments.length?(h=n,o=null,i):h},i.ratio=function(n){return arguments.length?(p=n,i):p},i.mode=function(n){return arguments.length?(g=n+"",i):g},Gu(i,a)},ta.random={normal:function(n,t){var e=arguments.length;return 2>e&&(t=1),1>e&&(n=0),function(){var e,r,u;do e=2*Math.random()-1,r=2*Math.random()-1,u=e*e+r*r;while(!u||u>1);return n+t*e*Math.sqrt(-2*Math.log(u)/u)}},logNormal:function(){var n=ta.random.normal.apply(ta,arguments);return function(){return Math.exp(n())}},bates:function(n){var t=ta.random.irwinHall(n);return function(){return t()/n}},irwinHall:function(n){return function(){for(var t=0,e=0;n>e;e++)t+=Math.random();return t}}},ta.scale={};var ml={floor:y,ceil:y};ta.scale.linear=function(){return Ii([0,1],[0,1],mu,!1)};var yl={s:1,g:1,p:1,r:1,e:1};ta.scale.log=function(){return Ji(ta.scale.linear().domain([0,1]),10,!0,[1,10])};var Ml=ta.format(".0e"),xl={floor:function(n){return-Math.ceil(-n)},ceil:function(n){return-Math.floor(-n)}};ta.scale.pow=function(){return Gi(ta.scale.linear(),1,[0,1])},ta.scale.sqrt=function(){return ta.scale.pow().exponent(.5)},ta.scale.ordinal=function(){return Qi([],{t:"range",a:[[]]})},ta.scale.category10=function(){return ta.scale.ordinal().range(bl)},ta.scale.category20=function(){return ta.scale.ordinal().range(_l)},ta.scale.category20b=function(){return ta.scale.ordinal().range(wl)},ta.scale.category20c=function(){return ta.scale.ordinal().range(Sl)};var bl=[2062260,16744206,2924588,14034728,9725885,9197131,14907330,8355711,12369186,1556175].map(Mt),_l=[2062260,11454440,16744206,16759672,2924588,10018698,14034728,16750742,9725885,12955861,9197131,12885140,14907330,16234194,8355711,13092807,12369186,14408589,1556175,10410725].map(Mt),wl=[3750777,5395619,7040719,10264286,6519097,9216594,11915115,13556636,9202993,12426809,15186514,15190932,8666169,11356490,14049643,15177372,8077683,10834324,13528509,14589654].map(Mt),Sl=[3244733,7057110,10406625,13032431,15095053,16616764,16625259,16634018,3253076,7652470,10607003,13101504,7695281,10394312,12369372,14342891,6513507,9868950,12434877,14277081].map(Mt);ta.scale.quantile=function(){return no([],[])},ta.scale.quantize=function(){return to(0,1,[0,1])},ta.scale.threshold=function(){return eo([.5],[0,1])},ta.scale.identity=function(){return ro([0,1])},ta.svg={},ta.svg.arc=function(){function n(){var n=Math.max(0,+e.apply(this,arguments)),l=Math.max(0,+r.apply(this,arguments)),s=o.apply(this,arguments)-Ra,f=a.apply(this,arguments)-Ra,h=Math.abs(f-s),g=s>f?0:1;if(n>l&&(p=l,l=n,n=p),h>=Ta)return t(l,g)+(n?t(n,1-g):"")+"Z";var p,v,d,m,y,M,x,b,_,w,S,k,E=0,A=0,N=[];if((m=(+c.apply(this,arguments)||0)/2)&&(d=i===kl?Math.sqrt(n*n+l*l):+i.apply(this,arguments),g||(A*=-1),l&&(A=tt(d/l*Math.sin(m))),n&&(E=tt(d/n*Math.sin(m)))),l){y=l*Math.cos(s+A),M=l*Math.sin(s+A),x=l*Math.cos(f-A),b=l*Math.sin(f-A);var C=Math.abs(f-s-2*A)<=qa?0:1;if(A&&so(y,M,x,b)===g^C){var z=(s+f)/2;y=l*Math.cos(z),M=l*Math.sin(z),x=b=null}}else y=M=0;if(n){_=n*Math.cos(f-E),w=n*Math.sin(f-E),S=n*Math.cos(s+E),k=n*Math.sin(s+E);var q=Math.abs(s-f+2*E)<=qa?0:1;if(E&&so(_,w,S,k)===1-g^q){var L=(s+f)/2;_=n*Math.cos(L),w=n*Math.sin(L),S=k=null}}else _=w=0;if((p=Math.min(Math.abs(l-n)/2,+u.apply(this,arguments)))>.001){v=l>n^g?0:1;var T=null==S?[_,w]:null==x?[y,M]:Lr([y,M],[S,k],[x,b],[_,w]),R=y-T[0],D=M-T[1],P=x-T[0],U=b-T[1],j=1/Math.sin(Math.acos((R*P+D*U)/(Math.sqrt(R*R+D*D)*Math.sqrt(P*P+U*U)))/2),F=Math.sqrt(T[0]*T[0]+T[1]*T[1]);if(null!=x){var H=Math.min(p,(l-F)/(j+1)),O=fo(null==S?[_,w]:[S,k],[y,M],l,H,g),I=fo([x,b],[_,w],l,H,g);p===H?N.push("M",O[0],"A",H,",",H," 0 0,",v," ",O[1],"A",l,",",l," 0 ",1-g^so(O[1][0],O[1][1],I[1][0],I[1][1]),",",g," ",I[1],"A",H,",",H," 0 0,",v," ",I[0]):N.push("M",O[0],"A",H,",",H," 0 1,",v," ",I[0])}else N.push("M",y,",",M);if(null!=S){var Y=Math.min(p,(n-F)/(j-1)),Z=fo([y,M],[S,k],n,-Y,g),V=fo([_,w],null==x?[y,M]:[x,b],n,-Y,g);p===Y?N.push("L",V[0],"A",Y,",",Y," 0 0,",v," ",V[1],"A",n,",",n," 0 ",g^so(V[1][0],V[1][1],Z[1][0],Z[1][1]),",",1-g," ",Z[1],"A",Y,",",Y," 0 0,",v," ",Z[0]):N.push("L",V[0],"A",Y,",",Y," 0 0,",v," ",Z[0])}else N.push("L",_,",",w)}else N.push("M",y,",",M),null!=x&&N.push("A",l,",",l," 0 ",C,",",g," ",x,",",b),N.push("L",_,",",w),null!=S&&N.push("A",n,",",n," 0 ",q,",",1-g," ",S,",",k);return N.push("Z"),N.join("")}function t(n,t){return"M0,"+n+"A"+n+","+n+" 0 1,"+t+" 0,"+-n+"A"+n+","+n+" 0 1,"+t+" 0,"+n}var e=io,r=oo,u=uo,i=kl,o=ao,a=co,c=lo;return n.innerRadius=function(t){return arguments.length?(e=Et(t),n):e},n.outerRadius=function(t){return arguments.length?(r=Et(t),n):r},n.cornerRadius=function(t){return arguments.length?(u=Et(t),n):u},n.padRadius=function(t){return arguments.length?(i=t==kl?kl:Et(t),n):i},n.startAngle=function(t){return arguments.length?(o=Et(t),n):o},n.endAngle=function(t){return arguments.length?(a=Et(t),n):a},n.padAngle=function(t){return arguments.length?(c=Et(t),n):c},n.centroid=function(){var n=(+e.apply(this,arguments)+ +r.apply(this,arguments))/2,t=(+o.apply(this,arguments)+ +a.apply(this,arguments))/2-Ra;return[Math.cos(t)*n,Math.sin(t)*n]},n};var kl="auto";ta.svg.line=function(){return ho(y)};var El=ta.map({linear:go,"linear-closed":po,step:vo,"step-before":mo,"step-after":yo,basis:So,"basis-open":ko,"basis-closed":Eo,bundle:Ao,cardinal:bo,"cardinal-open":Mo,"cardinal-closed":xo,monotone:To});El.forEach(function(n,t){t.key=n,t.closed=/-closed$/.test(n)});var Al=[0,2/3,1/3,0],Nl=[0,1/3,2/3,0],Cl=[0,1/6,2/3,1/6];ta.svg.line.radial=function(){var n=ho(Ro);return n.radius=n.x,delete n.x,n.angle=n.y,delete n.y,n},mo.reverse=yo,yo.reverse=mo,ta.svg.area=function(){return Do(y)},ta.svg.area.radial=function(){var n=Do(Ro);return n.radius=n.x,delete n.x,n.innerRadius=n.x0,delete n.x0,n.outerRadius=n.x1,delete n.x1,n.angle=n.y,delete n.y,n.startAngle=n.y0,delete n.y0,n.endAngle=n.y1,delete n.y1,n},ta.svg.chord=function(){function n(n,a){var c=t(this,i,n,a),l=t(this,o,n,a);return"M"+c.p0+r(c.r,c.p1,c.a1-c.a0)+(e(c,l)?u(c.r,c.p1,c.r,c.p0):u(c.r,c.p1,l.r,l.p0)+r(l.r,l.p1,l.a1-l.a0)+u(l.r,l.p1,c.r,c.p0))+"Z"}function t(n,t,e,r){var u=t.call(n,e,r),i=a.call(n,u,r),o=c.call(n,u,r)-Ra,s=l.call(n,u,r)-Ra;return{r:i,a0:o,a1:s,p0:[i*Math.cos(o),i*Math.sin(o)],p1:[i*Math.cos(s),i*Math.sin(s)]}}function e(n,t){return n.a0==t.a0&&n.a1==t.a1}function r(n,t,e){return"A"+n+","+n+" 0 "+ +(e>qa)+",1 "+t}function u(n,t,e,r){return"Q 0,0 "+r}var i=mr,o=yr,a=Po,c=ao,l=co;return n.radius=function(t){return arguments.length?(a=Et(t),n):a},n.source=function(t){return arguments.length?(i=Et(t),n):i},n.target=function(t){return arguments.length?(o=Et(t),n):o},n.startAngle=function(t){return arguments.length?(c=Et(t),n):c},n.endAngle=function(t){return arguments.length?(l=Et(t),n):l},n},ta.svg.diagonal=function(){function n(n,u){var i=t.call(this,n,u),o=e.call(this,n,u),a=(i.y+o.y)/2,c=[i,{x:i.x,y:a},{x:o.x,y:a},o];return c=c.map(r),"M"+c[0]+"C"+c[1]+" "+c[2]+" "+c[3]}var t=mr,e=yr,r=Uo;return n.source=function(e){return arguments.length?(t=Et(e),n):t},n.target=function(t){return arguments.length?(e=Et(t),n):e},n.projection=function(t){return arguments.length?(r=t,n):r},n},ta.svg.diagonal.radial=function(){var n=ta.svg.diagonal(),t=Uo,e=n.projection;return n.projection=function(n){return arguments.length?e(jo(t=n)):t},n},ta.svg.symbol=function(){function n(n,r){return(zl.get(t.call(this,n,r))||Oo)(e.call(this,n,r))}var t=Ho,e=Fo;return n.type=function(e){return arguments.length?(t=Et(e),n):t},n.size=function(t){return arguments.length?(e=Et(t),n):e},n};var zl=ta.map({circle:Oo,cross:function(n){var t=Math.sqrt(n/5)/2;return"M"+-3*t+","+-t+"H"+-t+"V"+-3*t+"H"+t+"V"+-t+"H"+3*t+"V"+t+"H"+t+"V"+3*t+"H"+-t+"V"+t+"H"+-3*t+"Z"},diamond:function(n){var t=Math.sqrt(n/(2*Ll)),e=t*Ll;return"M0,"+-t+"L"+e+",0 0,"+t+" "+-e+",0Z"},square:function(n){var t=Math.sqrt(n)/2;return"M"+-t+","+-t+"L"+t+","+-t+" "+t+","+t+" "+-t+","+t+"Z"},"triangle-down":function(n){var t=Math.sqrt(n/ql),e=t*ql/2;return"M0,"+e+"L"+t+","+-e+" "+-t+","+-e+"Z"},"triangle-up":function(n){var t=Math.sqrt(n/ql),e=t*ql/2;return"M0,"+-e+"L"+t+","+e+" "+-t+","+e+"Z"}});ta.svg.symbolTypes=zl.keys();var ql=Math.sqrt(3),Ll=Math.tan(30*Da);_a.transition=function(n){for(var t,e,r=Tl||++Ul,u=Xo(n),i=[],o=Rl||{time:Date.now(),ease:Su,delay:0,duration:250},a=-1,c=this.length;++a<c;){i.push(t=[]);for(var l=this[a],s=-1,f=l.length;++s<f;)(e=l[s])&&$o(e,s,u,r,o),t.push(e)}return Yo(i,u,r)},_a.interrupt=function(n){return this.each(null==n?Dl:Io(Xo(n)))};var Tl,Rl,Dl=Io(Xo()),Pl=[],Ul=0;Pl.call=_a.call,Pl.empty=_a.empty,Pl.node=_a.node,Pl.size=_a.size,ta.transition=function(n,t){return n&&n.transition?Tl?n.transition(t):n:ta.selection().transition(n)},ta.transition.prototype=Pl,Pl.select=function(n){var t,e,r,u=this.id,i=this.namespace,o=[];n=N(n);for(var a=-1,c=this.length;++a<c;){o.push(t=[]);for(var l=this[a],s=-1,f=l.length;++s<f;)(r=l[s])&&(e=n.call(r,r.__data__,s,a))?("__data__"in r&&(e.__data__=r.__data__),$o(e,s,i,u,r[i][u]),t.push(e)):t.push(null)}return Yo(o,i,u)},Pl.selectAll=function(n){var t,e,r,u,i,o=this.id,a=this.namespace,c=[];n=C(n);for(var l=-1,s=this.length;++l<s;)for(var f=this[l],h=-1,g=f.length;++h<g;)if(r=f[h]){i=r[a][o],e=n.call(r,r.__data__,h,l),c.push(t=[]);for(var p=-1,v=e.length;++p<v;)(u=e[p])&&$o(u,p,a,o,i),t.push(u)}return Yo(c,a,o)},Pl.filter=function(n){var t,e,r,u=[];"function"!=typeof n&&(n=O(n));for(var i=0,o=this.length;o>i;i++){u.push(t=[]);for(var e=this[i],a=0,c=e.length;c>a;a++)(r=e[a])&&n.call(r,r.__data__,a,i)&&t.push(r)}return Yo(u,this.namespace,this.id)},Pl.tween=function(n,t){var e=this.id,r=this.namespace;return arguments.length<2?this.node()[r][e].tween.get(n):Y(this,null==t?function(t){t[r][e].tween.remove(n)}:function(u){u[r][e].tween.set(n,t)})},Pl.attr=function(n,t){function e(){this.removeAttribute(a)}function r(){this.removeAttributeNS(a.space,a.local)}function u(n){return null==n?e:(n+="",function(){var t,e=this.getAttribute(a);return e!==n&&(t=o(e,n),function(n){this.setAttribute(a,t(n))})})}function i(n){return null==n?r:(n+="",function(){var t,e=this.getAttributeNS(a.space,a.local);return e!==n&&(t=o(e,n),function(n){this.setAttributeNS(a.space,a.local,t(n))})})}if(arguments.length<2){for(t in n)this.attr(t,n[t]);return this}var o="transform"==n?Hu:mu,a=ta.ns.qualify(n);return Zo(this,"attr."+n,t,a.local?i:u)},Pl.attrTween=function(n,t){function e(n,e){var r=t.call(this,n,e,this.getAttribute(u));return r&&function(n){this.setAttribute(u,r(n))}}function r(n,e){var r=t.call(this,n,e,this.getAttributeNS(u.space,u.local));return r&&function(n){this.setAttributeNS(u.space,u.local,r(n))}}var u=ta.ns.qualify(n);return this.tween("attr."+n,u.local?r:e)},Pl.style=function(n,e,r){function u(){this.style.removeProperty(n)}function i(e){return null==e?u:(e+="",function(){var u,i=t(this).getComputedStyle(this,null).getPropertyValue(n);return i!==e&&(u=mu(i,e),function(t){this.style.setProperty(n,u(t),r)})})}var o=arguments.length;if(3>o){if("string"!=typeof n){2>o&&(e="");for(r in n)this.style(r,n[r],e);return this}r=""}return Zo(this,"style."+n,e,i)},Pl.styleTween=function(n,e,r){function u(u,i){var o=e.call(this,u,i,t(this).getComputedStyle(this,null).getPropertyValue(n));return o&&function(t){this.style.setProperty(n,o(t),r)}}return arguments.length<3&&(r=""),this.tween("style."+n,u)},Pl.text=function(n){return Zo(this,"text",n,Vo)},Pl.remove=function(){var n=this.namespace;return this.each("end.transition",function(){var t;this[n].count<2&&(t=this.parentNode)&&t.removeChild(this)})},Pl.ease=function(n){var t=this.id,e=this.namespace;return arguments.length<1?this.node()[e][t].ease:("function"!=typeof n&&(n=ta.ease.apply(ta,arguments)),Y(this,function(r){r[e][t].ease=n}))},Pl.delay=function(n){var t=this.id,e=this.namespace;return arguments.length<1?this.node()[e][t].delay:Y(this,"function"==typeof n?function(r,u,i){r[e][t].delay=+n.call(r,r.__data__,u,i)}:(n=+n,function(r){r[e][t].delay=n}))},Pl.duration=function(n){var t=this.id,e=this.namespace;return arguments.length<1?this.node()[e][t].duration:Y(this,"function"==typeof n?function(r,u,i){r[e][t].duration=Math.max(1,n.call(r,r.__data__,u,i))}:(n=Math.max(1,n),function(r){r[e][t].duration=n}))},Pl.each=function(n,t){var e=this.id,r=this.namespace;if(arguments.length<2){var u=Rl,i=Tl;try{Tl=e,Y(this,function(t,u,i){Rl=t[r][e],n.call(t,t.__data__,u,i)})}finally{Rl=u,Tl=i}}else Y(this,function(u){var i=u[r][e];(i.event||(i.event=ta.dispatch("start","end","interrupt"))).on(n,t)});return this},Pl.transition=function(){for(var n,t,e,r,u=this.id,i=++Ul,o=this.namespace,a=[],c=0,l=this.length;l>c;c++){a.push(n=[]);for(var t=this[c],s=0,f=t.length;f>s;s++)(e=t[s])&&(r=e[o][u],$o(e,s,o,i,{time:r.time,ease:r.ease,delay:r.delay+r.duration,duration:r.duration})),n.push(e)}return Yo(a,o,i)},ta.svg.axis=function(){function n(n){n.each(function(){var n,l=ta.select(this),s=this.__chart__||e,f=this.__chart__=e.copy(),h=null==c?f.ticks?f.ticks.apply(f,a):f.domain():c,g=null==t?f.tickFormat?f.tickFormat.apply(f,a):y:t,p=l.selectAll(".tick").data(h,f),v=p.enter().insert("g",".domain").attr("class","tick").style("opacity",Ca),d=ta.transition(p.exit()).style("opacity",Ca).remove(),m=ta.transition(p.order()).style("opacity",1),M=Math.max(u,0)+o,x=Ui(f),b=l.selectAll(".domain").data([0]),_=(b.enter().append("path").attr("class","domain"),ta.transition(b));v.append("line"),v.append("text");var w,S,k,E,A=v.select("line"),N=m.select("line"),C=p.select("text").text(g),z=v.select("text"),q=m.select("text"),L="top"===r||"left"===r?-1:1;if("bottom"===r||"top"===r?(n=Bo,w="x",k="y",S="x2",E="y2",C.attr("dy",0>L?"0em":".71em").style("text-anchor","middle"),_.attr("d","M"+x[0]+","+L*i+"V0H"+x[1]+"V"+L*i)):(n=Wo,w="y",k="x",S="y2",E="x2",C.attr("dy",".32em").style("text-anchor",0>L?"end":"start"),_.attr("d","M"+L*i+","+x[0]+"H0V"+x[1]+"H"+L*i)),A.attr(E,L*u),z.attr(k,L*M),N.attr(S,0).attr(E,L*u),q.attr(w,0).attr(k,L*M),f.rangeBand){var T=f,R=T.rangeBand()/2;s=f=function(n){return T(n)+R}}else s.rangeBand?s=f:d.call(n,f,s);v.call(n,s,f),m.call(n,f,f)})}var t,e=ta.scale.linear(),r=jl,u=6,i=6,o=3,a=[10],c=null;return n.scale=function(t){return arguments.length?(e=t,n):e},n.orient=function(t){return arguments.length?(r=t in Fl?t+"":jl,n):r},n.ticks=function(){return arguments.length?(a=arguments,n):a},n.tickValues=function(t){return arguments.length?(c=t,n):c},n.tickFormat=function(e){return arguments.length?(t=e,n):t},n.tickSize=function(t){var e=arguments.length;return e?(u=+t,i=+arguments[e-1],n):u},n.innerTickSize=function(t){return arguments.length?(u=+t,n):u},n.outerTickSize=function(t){return arguments.length?(i=+t,n):i},n.tickPadding=function(t){return arguments.length?(o=+t,n):o},n.tickSubdivide=function(){return arguments.length&&n},n};var jl="bottom",Fl={top:1,right:1,bottom:1,left:1};ta.svg.brush=function(){function n(t){t.each(function(){var t=ta.select(this).style("pointer-events","all").style("-webkit-tap-highlight-color","rgba(0,0,0,0)").on("mousedown.brush",i).on("touchstart.brush",i),o=t.selectAll(".background").data([0]);o.enter().append("rect").attr("class","background").style("visibility","hidden").style("cursor","crosshair"),t.selectAll(".extent").data([0]).enter().append("rect").attr("class","extent").style("cursor","move");var a=t.selectAll(".resize").data(v,y);a.exit().remove(),a.enter().append("g").attr("class",function(n){return"resize "+n}).style("cursor",function(n){return Hl[n]}).append("rect").attr("x",function(n){return/[ew]$/.test(n)?-3:null}).attr("y",function(n){return/^[ns]/.test(n)?-3:null}).attr("width",6).attr("height",6).style("visibility","hidden"),a.style("display",n.empty()?"none":null);var c,f=ta.transition(t),h=ta.transition(o);l&&(c=Ui(l),h.attr("x",c[0]).attr("width",c[1]-c[0]),r(f)),s&&(c=Ui(s),h.attr("y",c[0]).attr("height",c[1]-c[0]),u(f)),e(f)})}function e(n){n.selectAll(".resize").attr("transform",function(n){return"translate("+f[+/e$/.test(n)]+","+h[+/^s/.test(n)]+")"})}function r(n){n.select(".extent").attr("x",f[0]),n.selectAll(".extent,.n>rect,.s>rect").attr("width",f[1]-f[0])}function u(n){n.select(".extent").attr("y",h[0]),n.selectAll(".extent,.e>rect,.w>rect").attr("height",h[1]-h[0])}function i(){function i(){32==ta.event.keyCode&&(C||(M=null,q[0]-=f[1],q[1]-=h[1],C=2),S())}function v(){32==ta.event.keyCode&&2==C&&(q[0]+=f[1],q[1]+=h[1],C=0,S())}function d(){var n=ta.mouse(b),t=!1;x&&(n[0]+=x[0],n[1]+=x[1]),C||(ta.event.altKey?(M||(M=[(f[0]+f[1])/2,(h[0]+h[1])/2]),q[0]=f[+(n[0]<M[0])],q[1]=h[+(n[1]<M[1])]):M=null),A&&m(n,l,0)&&(r(k),t=!0),N&&m(n,s,1)&&(u(k),t=!0),t&&(e(k),w({type:"brush",mode:C?"move":"resize"}))}function m(n,t,e){var r,u,i=Ui(t),c=i[0],l=i[1],s=q[e],v=e?h:f,d=v[1]-v[0];return C&&(c-=s,l-=d+s),r=(e?p:g)?Math.max(c,Math.min(l,n[e])):n[e],C?u=(r+=s)+d:(M&&(s=Math.max(c,Math.min(l,2*M[e]-r))),r>s?(u=r,r=s):u=s),v[0]!=r||v[1]!=u?(e?a=null:o=null,v[0]=r,v[1]=u,!0):void 0}function y(){d(),k.style("pointer-events","all").selectAll(".resize").style("display",n.empty()?"none":null),ta.select("body").style("cursor",null),L.on("mousemove.brush",null).on("mouseup.brush",null).on("touchmove.brush",null).on("touchend.brush",null).on("keydown.brush",null).on("keyup.brush",null),z(),w({type:"brushend"})}var M,x,b=this,_=ta.select(ta.event.target),w=c.of(b,arguments),k=ta.select(b),E=_.datum(),A=!/^(n|s)$/.test(E)&&l,N=!/^(e|w)$/.test(E)&&s,C=_.classed("extent"),z=W(b),q=ta.mouse(b),L=ta.select(t(b)).on("keydown.brush",i).on("keyup.brush",v);if(ta.event.changedTouches?L.on("touchmove.brush",d).on("touchend.brush",y):L.on("mousemove.brush",d).on("mouseup.brush",y),k.interrupt().selectAll("*").interrupt(),C)q[0]=f[0]-q[0],q[1]=h[0]-q[1];else if(E){var T=+/w$/.test(E),R=+/^n/.test(E);x=[f[1-T]-q[0],h[1-R]-q[1]],q[0]=f[T],q[1]=h[R]}else ta.event.altKey&&(M=q.slice());k.style("pointer-events","none").selectAll(".resize").style("display",null),ta.select("body").style("cursor",_.style("cursor")),w({type:"brushstart"}),d()}var o,a,c=E(n,"brushstart","brush","brushend"),l=null,s=null,f=[0,0],h=[0,0],g=!0,p=!0,v=Ol[0];return n.event=function(n){n.each(function(){var n=c.of(this,arguments),t={x:f,y:h,i:o,j:a},e=this.__chart__||t;this.__chart__=t,Tl?ta.select(this).transition().each("start.brush",function(){o=e.i,a=e.j,f=e.x,h=e.y,n({type:"brushstart"})}).tween("brush:brush",function(){var e=yu(f,t.x),r=yu(h,t.y);return o=a=null,function(u){f=t.x=e(u),h=t.y=r(u),n({type:"brush",mode:"resize"})}}).each("end.brush",function(){o=t.i,a=t.j,n({type:"brush",mode:"resize"}),n({type:"brushend"})}):(n({type:"brushstart"}),n({type:"brush",mode:"resize"}),n({type:"brushend"}))})},n.x=function(t){return arguments.length?(l=t,v=Ol[!l<<1|!s],n):l},n.y=function(t){return arguments.length?(s=t,v=Ol[!l<<1|!s],n):s},n.clamp=function(t){return arguments.length?(l&&s?(g=!!t[0],p=!!t[1]):l?g=!!t:s&&(p=!!t),n):l&&s?[g,p]:l?g:s?p:null},n.extent=function(t){var e,r,u,i,c;return arguments.length?(l&&(e=t[0],r=t[1],s&&(e=e[0],r=r[0]),o=[e,r],l.invert&&(e=l(e),r=l(r)),e>r&&(c=e,e=r,r=c),(e!=f[0]||r!=f[1])&&(f=[e,r])),s&&(u=t[0],i=t[1],l&&(u=u[1],i=i[1]),a=[u,i],s.invert&&(u=s(u),i=s(i)),u>i&&(c=u,u=i,i=c),(u!=h[0]||i!=h[1])&&(h=[u,i])),n):(l&&(o?(e=o[0],r=o[1]):(e=f[0],r=f[1],l.invert&&(e=l.invert(e),r=l.invert(r)),e>r&&(c=e,e=r,r=c))),s&&(a?(u=a[0],i=a[1]):(u=h[0],i=h[1],s.invert&&(u=s.invert(u),i=s.invert(i)),u>i&&(c=u,u=i,i=c))),l&&s?[[e,u],[r,i]]:l?[e,r]:s&&[u,i])},n.clear=function(){return n.empty()||(f=[0,0],h=[0,0],o=a=null),n},n.empty=function(){return!!l&&f[0]==f[1]||!!s&&h[0]==h[1]},ta.rebind(n,c,"on")};var Hl={n:"ns-resize",e:"ew-resize",s:"ns-resize",w:"ew-resize",nw:"nwse-resize",ne:"nesw-resize",se:"nwse-resize",sw:"nesw-resize"},Ol=[["n","e","s","w","nw","ne","se","sw"],["e","w"],["n","s"],[]],Il=ac.format=gc.timeFormat,Yl=Il.utc,Zl=Yl("%Y-%m-%dT%H:%M:%S.%LZ");Il.iso=Date.prototype.toISOString&&+new Date("2000-01-01T00:00:00.000Z")?Jo:Zl,Jo.parse=function(n){var t=new Date(n);return isNaN(t)?null:t},Jo.toString=Zl.toString,ac.second=Ft(function(n){return new cc(1e3*Math.floor(n/1e3))},function(n,t){n.setTime(n.getTime()+1e3*Math.floor(t))},function(n){return n.getSeconds()}),ac.seconds=ac.second.range,ac.seconds.utc=ac.second.utc.range,ac.minute=Ft(function(n){return new cc(6e4*Math.floor(n/6e4))},function(n,t){n.setTime(n.getTime()+6e4*Math.floor(t))},function(n){return n.getMinutes()}),ac.minutes=ac.minute.range,ac.minutes.utc=ac.minute.utc.range,ac.hour=Ft(function(n){var t=n.getTimezoneOffset()/60;return new cc(36e5*(Math.floor(n/36e5-t)+t))},function(n,t){n.setTime(n.getTime()+36e5*Math.floor(t))},function(n){return n.getHours()}),ac.hours=ac.hour.range,ac.hours.utc=ac.hour.utc.range,ac.month=Ft(function(n){return n=ac.day(n),n.setDate(1),n},function(n,t){n.setMonth(n.getMonth()+t)},function(n){return n.getMonth()}),ac.months=ac.month.range,ac.months.utc=ac.month.utc.range;var Vl=[1e3,5e3,15e3,3e4,6e4,3e5,9e5,18e5,36e5,108e5,216e5,432e5,864e5,1728e5,6048e5,2592e6,7776e6,31536e6],Xl=[[ac.second,1],[ac.second,5],[ac.second,15],[ac.second,30],[ac.minute,1],[ac.minute,5],[ac.minute,15],[ac.minute,30],[ac.hour,1],[ac.hour,3],[ac.hour,6],[ac.hour,12],[ac.day,1],[ac.day,2],[ac.week,1],[ac.month,1],[ac.month,3],[ac.year,1]],$l=Il.multi([[".%L",function(n){return n.getMilliseconds()}],[":%S",function(n){return n.getSeconds()}],["%I:%M",function(n){return n.getMinutes()}],["%I %p",function(n){return n.getHours()}],["%a %d",function(n){return n.getDay()&&1!=n.getDate()}],["%b %d",function(n){return 1!=n.getDate()}],["%B",function(n){return n.getMonth()}],["%Y",Ne]]),Bl={range:function(n,t,e){return ta.range(Math.ceil(n/e)*e,+t,e).map(Ko)},floor:y,ceil:y};Xl.year=ac.year,ac.scale=function(){return Go(ta.scale.linear(),Xl,$l)};var Wl=Xl.map(function(n){return[n[0].utc,n[1]]}),Jl=Yl.multi([[".%L",function(n){return n.getUTCMilliseconds()}],[":%S",function(n){return n.getUTCSeconds()}],["%I:%M",function(n){return n.getUTCMinutes()}],["%I %p",function(n){return n.getUTCHours()}],["%a %d",function(n){return n.getUTCDay()&&1!=n.getUTCDate()}],["%b %d",function(n){return 1!=n.getUTCDate()}],["%B",function(n){return n.getUTCMonth()}],["%Y",Ne]]);Wl.year=ac.year.utc,ac.scale.utc=function(){return Go(ta.scale.linear(),Wl,Jl)},ta.text=At(function(n){return n.responseText}),ta.json=function(n,t){return Nt(n,"application/json",Qo,t)},ta.html=function(n,t){return Nt(n,"text/html",na,t)},ta.xml=At(function(n){return n.responseXML}),"function"==typeof define&&define.amd?define(ta):"object"==typeof module&&module.exports&&(module.exports=ta),this.d3=ta}();
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var powerbi;
(function (powerbi) {
    var extensibility;
    (function (extensibility) {
        var visual;
        (function (visual) {
            var saltPepperByMAQSoftware726F8878F79F4EF39D5005F1D06A8F1F;
            (function (saltPepperByMAQSoftware726F8878F79F4EF39D5005F1D06A8F1F) {
                var DefaultHandleTouchDelay = 1000;
                function createTooltipServiceWrapper(tooltipService, rootElement, handleTouchDelay) {
                    if (handleTouchDelay === void 0) { handleTouchDelay = DefaultHandleTouchDelay; }
                    return new TooltipServiceWrapper(tooltipService, rootElement, handleTouchDelay);
                }
                saltPepperByMAQSoftware726F8878F79F4EF39D5005F1D06A8F1F.createTooltipServiceWrapper = createTooltipServiceWrapper;
                var TooltipServiceWrapper = (function () {
                    function TooltipServiceWrapper(tooltipService, rootElement, handleTouchDelay) {
                        this.visualHostTooltipService = tooltipService;
                        this.handleTouchDelay = handleTouchDelay;
                        this.rootElement = rootElement;
                    }
                    TooltipServiceWrapper.prototype.addTooltip = function (selection, getTooltipInfoDelegate, getDataPointIdentity, reloadTooltipDataOnMouseMove) {
                        var _this = this;
                        if (!selection || !this.visualHostTooltipService.enabled()) {
                            return;
                        }
                        var rootNode = this.rootElement;
                        // Mouse events
                        selection.on("mouseover.tooltip", function () {
                            // Ignore mouseover while handling touch events
                            if (!_this.canDisplayTooltip(d3.event))
                                return;
                            var tooltipEventArgs = _this.makeTooltipEventArgs(rootNode, true, false);
                            if (!tooltipEventArgs)
                                return;
                            var tooltipInfo = getTooltipInfoDelegate(tooltipEventArgs);
                            if (tooltipInfo == null)
                                return;
                            var selectionId = getDataPointIdentity(tooltipEventArgs);
                            _this.visualHostTooltipService.show({
                                coordinates: tooltipEventArgs.coordinates,
                                isTouchEvent: false,
                                dataItems: tooltipInfo,
                                identities: selectionId ? [selectionId] : [],
                            });
                        });
                        selection.on("mouseout.tooltip", function () {
                            _this.visualHostTooltipService.hide({
                                isTouchEvent: false,
                                immediately: false,
                            });
                        });
                        selection.on("mousemove.tooltip", function () {
                            // Ignore mousemove while handling touch events
                            if (!_this.canDisplayTooltip(d3.event))
                                return;
                            var tooltipEventArgs = _this.makeTooltipEventArgs(rootNode, true, false);
                            if (!tooltipEventArgs)
                                return;
                            var tooltipInfo;
                            if (reloadTooltipDataOnMouseMove) {
                                tooltipInfo = getTooltipInfoDelegate(tooltipEventArgs);
                                if (tooltipInfo == null)
                                    return;
                            }
                            var selectionId = getDataPointIdentity(tooltipEventArgs);
                            _this.visualHostTooltipService.move({
                                coordinates: tooltipEventArgs.coordinates,
                                isTouchEvent: false,
                                dataItems: tooltipInfo,
                                identities: selectionId ? [selectionId] : [],
                            });
                        });
                        // --- Touch events ---
                        var touchStartEventName = TooltipServiceWrapper.touchStartEventName();
                        var touchEndEventName = TooltipServiceWrapper.touchEndEventName();
                        var isPointerEvent = TooltipServiceWrapper.usePointerEvents();
                        selection.on(touchStartEventName + '.tooltip', function () {
                            _this.visualHostTooltipService.hide({
                                isTouchEvent: true,
                                immediately: true,
                            });
                            var tooltipEventArgs = _this.makeTooltipEventArgs(rootNode, isPointerEvent, true);
                            if (!tooltipEventArgs)
                                return;
                            var tooltipInfo = getTooltipInfoDelegate(tooltipEventArgs);
                            var selectionId = getDataPointIdentity(tooltipEventArgs);
                            _this.visualHostTooltipService.show({
                                coordinates: tooltipEventArgs.coordinates,
                                isTouchEvent: true,
                                dataItems: tooltipInfo,
                                identities: selectionId ? [selectionId] : [],
                            });
                        });
                        selection.on(touchEndEventName + '.tooltip', function () {
                            _this.visualHostTooltipService.hide({
                                isTouchEvent: true,
                                immediately: false,
                            });
                            if (_this.handleTouchTimeoutId)
                                clearTimeout(_this.handleTouchTimeoutId);
                            // At the end of touch action, set a timeout that will let us ignore the incoming mouse events for a small amount of time
                            // TODO: any better way to do this?
                            _this.handleTouchTimeoutId = setTimeout(function () {
                                _this.handleTouchTimeoutId = undefined;
                            }, _this.handleTouchDelay);
                        });
                    };
                    TooltipServiceWrapper.prototype.hide = function () {
                        this.visualHostTooltipService.hide({ immediately: true, isTouchEvent: false });
                    };
                    TooltipServiceWrapper.prototype.makeTooltipEventArgs = function (rootNode, isPointerEvent, isTouchEvent) {
                        var target = d3.event.target;
                        var data = d3.select(target).datum();
                        var mouseCoordinates = this.getCoordinates(rootNode, isPointerEvent);
                        var elementCoordinates = this.getCoordinates(target, isPointerEvent);
                        var tooltipEventArgs = {
                            data: data,
                            coordinates: mouseCoordinates,
                            elementCoordinates: elementCoordinates,
                            context: target,
                            isTouchEvent: isTouchEvent
                        };
                        return tooltipEventArgs;
                    };
                    TooltipServiceWrapper.prototype.canDisplayTooltip = function (d3Event) {
                        var canDisplay = true;
                        var mouseEvent = d3Event;
                        if (mouseEvent.buttons !== undefined) {
                            // Check mouse buttons state
                            var hasMouseButtonPressed = mouseEvent.buttons !== 0;
                            canDisplay = !hasMouseButtonPressed;
                        }
                        // Make sure we are not ignoring mouse events immediately after touch end.
                        canDisplay = canDisplay && (this.handleTouchTimeoutId == null);
                        return canDisplay;
                    };
                    TooltipServiceWrapper.prototype.getCoordinates = function (rootNode, isPointerEvent) {
                        var coordinates;
                        if (isPointerEvent) {
                            // copied from d3_eventSource (which is not exposed)
                            var e = d3.event, s = void 0;
                            while (s = e.sourceEvent)
                                e = s;
                            var rect = rootNode.getBoundingClientRect();
                            coordinates = [e.clientX - rect.left - rootNode.clientLeft, e.clientY - rect.top - rootNode.clientTop];
                        }
                        else {
                            var touchCoordinates = d3.touches(rootNode);
                            if (touchCoordinates && touchCoordinates.length > 0) {
                                coordinates = touchCoordinates[0];
                            }
                        }
                        return coordinates;
                    };
                    TooltipServiceWrapper.touchStartEventName = function () {
                        var eventName = "touchstart";
                        if (window["PointerEvent"]) {
                            // IE11
                            eventName = "pointerdown";
                        }
                        return eventName;
                    };
                    TooltipServiceWrapper.touchMoveEventName = function () {
                        var eventName = "touchmove";
                        if (window["PointerEvent"]) {
                            // IE11
                            eventName = "pointermove";
                        }
                        return eventName;
                    };
                    TooltipServiceWrapper.touchEndEventName = function () {
                        var eventName = "touchend";
                        if (window["PointerEvent"]) {
                            // IE11
                            eventName = "pointerup";
                        }
                        return eventName;
                    };
                    TooltipServiceWrapper.usePointerEvents = function () {
                        var eventName = TooltipServiceWrapper.touchStartEventName();
                        return eventName === "pointerdown" || eventName === "MSPointerDown";
                    };
                    return TooltipServiceWrapper;
                }());
            })(saltPepperByMAQSoftware726F8878F79F4EF39D5005F1D06A8F1F = visual.saltPepperByMAQSoftware726F8878F79F4EF39D5005F1D06A8F1F || (visual.saltPepperByMAQSoftware726F8878F79F4EF39D5005F1D06A8F1F = {}));
        })(visual = extensibility.visual || (extensibility.visual = {}));
    })(extensibility = powerbi.extensibility || (powerbi.extensibility = {}));
})(powerbi || (powerbi = {}));
/*
 *  Power BI Visualizations
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the "Software"), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */
var powerbi;
(function (powerbi) {
    var extensibility;
    (function (extensibility) {
        var visual;
        (function (visual) {
            var saltPepperByMAQSoftware726F8878F79F4EF39D5005F1D06A8F1F;
            (function (saltPepperByMAQSoftware726F8878F79F4EF39D5005F1D06A8F1F) {
                'use strict';
                var DataViewObjectsParser = powerbi.extensibility.utils.dataview.DataViewObjectsParser;
                var VisualSettings = (function (_super) {
                    __extends(VisualSettings, _super);
                    function VisualSettings() {
                        var _this = _super !== null && _super.apply(this, arguments) || this;
                        _this.colorSettings = new ColorSettings();
                        _this.separatorSettings = new SeparatorSettings();
                        _this.categoryLabelSettings = new CategoryLabelSettings();
                        _this.legendSettings = new LegendSettings();
                        _this.enableTooltipSettings = new EnableTooltipSettings();
                        _this.conversionSettings = new ConversionSettings();
                        _this.detailLabelSettings = new DetailLabelSettings();
                        return _this;
                    }
                    return VisualSettings;
                }(DataViewObjectsParser));
                saltPepperByMAQSoftware726F8878F79F4EF39D5005F1D06A8F1F.VisualSettings = VisualSettings;
                var ColorSettings = (function () {
                    function ColorSettings() {
                        this.color = '';
                    }
                    return ColorSettings;
                }());
                saltPepperByMAQSoftware726F8878F79F4EF39D5005F1D06A8F1F.ColorSettings = ColorSettings;
                var CategoryLabelSettings = (function () {
                    function CategoryLabelSettings() {
                        this.show = true;
                        this.fontColor = '#000';
                        this.fontFamily = 'Segoe UI';
                        this.fontSize = 12;
                        this.textwrap = false;
                    }
                    return CategoryLabelSettings;
                }());
                saltPepperByMAQSoftware726F8878F79F4EF39D5005F1D06A8F1F.CategoryLabelSettings = CategoryLabelSettings;
                var SeparatorSettings = (function () {
                    function SeparatorSettings() {
                        this.show = true;
                        this.color = '#fff';
                        this.strokeWidth = 4;
                        this.lineStyle = 'dashed';
                    }
                    return SeparatorSettings;
                }());
                saltPepperByMAQSoftware726F8878F79F4EF39D5005F1D06A8F1F.SeparatorSettings = SeparatorSettings;
                var LegendSettings = (function () {
                    function LegendSettings() {
                        this.show = false;
                        this.position = 'top';
                    }
                    return LegendSettings;
                }());
                saltPepperByMAQSoftware726F8878F79F4EF39D5005F1D06A8F1F.LegendSettings = LegendSettings;
                var EnableTooltipSettings = (function () {
                    function EnableTooltipSettings() {
                        this.show = true;
                    }
                    return EnableTooltipSettings;
                }());
                saltPepperByMAQSoftware726F8878F79F4EF39D5005F1D06A8F1F.EnableTooltipSettings = EnableTooltipSettings;
                var ConversionSettings = (function () {
                    function ConversionSettings() {
                        this.show = true;
                        this.label = 'Conversion %';
                        this.labelfontColor = '#000';
                        this.fontSize = 8;
                        this.fontColor = '#000';
                        this.relativeWidth = false;
                    }
                    return ConversionSettings;
                }());
                saltPepperByMAQSoftware726F8878F79F4EF39D5005F1D06A8F1F.ConversionSettings = ConversionSettings;
                // Interface for Detail Labels
                var DetailLabelSettings = (function () {
                    function DetailLabelSettings() {
                        this.show = true;
                        this.fontSize = 12;
                        this.color = 'white';
                        this.labelDisplayUnits = 0;
                        this.labelPrecision = 0;
                    }
                    return DetailLabelSettings;
                }());
                saltPepperByMAQSoftware726F8878F79F4EF39D5005F1D06A8F1F.DetailLabelSettings = DetailLabelSettings;
            })(saltPepperByMAQSoftware726F8878F79F4EF39D5005F1D06A8F1F = visual.saltPepperByMAQSoftware726F8878F79F4EF39D5005F1D06A8F1F || (visual.saltPepperByMAQSoftware726F8878F79F4EF39D5005F1D06A8F1F = {}));
        })(visual = extensibility.visual || (extensibility.visual = {}));
    })(extensibility = powerbi.extensibility || (powerbi.extensibility = {}));
})(powerbi || (powerbi = {}));
/*
 *  Power BI Visual CLI
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ''Software''), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */
var powerbi;
(function (powerbi) {
    var extensibility;
    (function (extensibility) {
        var visual;
        (function (visual) {
            var saltPepperByMAQSoftware726F8878F79F4EF39D5005F1D06A8F1F;
            (function (saltPepperByMAQSoftware726F8878F79F4EF39D5005F1D06A8F1F) {
                'use strict';
                var textMeasurementService = powerbi.extensibility.utils.formatting.textMeasurementService;
                var ValueFormatter = powerbi.extensibility.utils.formatting.valueFormatter;
                /**
                 * Gets property value for a particular object in a category.
                 *
                 * @function
                 * @param {DataViewCategoryColumn} category  -  List of category objects.
                 * @param {number} index                     -  Index of category object.
                 * @param {string} objectName                -  Name of desired object.
                 * @param {string} propertyName              -  Name of desired property.
                 * @param {T} defaultValue                   -  Default value of desired property.
                 */
                function getCategoricalObjectValue(category, index, objectName, propertyName, defaultValue) {
                    var categoryObjects = category.objects;
                    if (categoryObjects) {
                        var categoryObject = categoryObjects[index];
                        if (categoryObject) {
                            var object = categoryObject[objectName];
                            if (object) {
                                var property = object[propertyName];
                                if (property !== undefined) {
                                    return property;
                                }
                            }
                        }
                    }
                    return defaultValue;
                }
                saltPepperByMAQSoftware726F8878F79F4EF39D5005F1D06A8F1F.getCategoricalObjectValue = getCategoricalObjectValue;
                function getAutoByUnits(dataValue, displayUnits) {
                    var dataValueLength;
                    if (dataValue === null || dataValue === '') {
                        return displayUnits;
                    }
                    else {
                        dataValueLength = dataValue.toString().length;
                    }
                    if (dataValueLength >= 4 && dataValueLength < 6) {
                        displayUnits = 1001;
                    }
                    else if (dataValueLength >= 6 && dataValueLength < 9) {
                        displayUnits = 1e6;
                    }
                    else if (dataValueLength >= 9 && dataValueLength < 12) {
                        displayUnits = 1e9;
                    }
                    else if (dataValueLength >= 12) {
                        displayUnits = 1e12;
                    }
                    return displayUnits;
                }
                saltPepperByMAQSoftware726F8878F79F4EF39D5005F1D06A8F1F.getAutoByUnits = getAutoByUnits;
                var Visual = (function () {
                    function Visual(options) {
                        this.host = options.host;
                        this.target = options.element;
                        this.tooltipServiceWrapper = saltPepperByMAQSoftware726F8878F79F4EF39D5005F1D06A8F1F.createTooltipServiceWrapper(this.host.tooltipService, options.element);
                        Visual.selectionManager = options.host.createSelectionManager();
                        // tslint:disable-next-line:no-any
                        var targetContainer = d3.select(this.target);
                        this.categoryLabelContainer = targetContainer
                            .append('div')
                            .classed('categoryLabelContainer', true);
                        this.mainContainer = targetContainer
                            .append('div')
                            .classed('mainContainer', true);
                        this.visualCont = this.mainContainer
                            .append('svg')
                            .classed('visualContainer', true);
                        this.labelDiv = this.mainContainer.append('div').attr({
                            id: 'mainDivContainer'
                        }).classed('mainDivContainer', true)
                            .style({
                            width: '30%',
                            height: '100%',
                            top: '0px',
                            position: 'absolute'
                        });
                    }
                    Visual.prototype.VisualTransform = function (options, host) {
                        var dataViews = options.dataViews;
                        var len;
                        var iIndexOfCategory = -1;
                        var iIndexOfSource = -1;
                        var iIndexOfDestination = -1;
                        var viewModel = {
                            dataPoints: [],
                            categoryName: '',
                            sourceName: '',
                            measureName: '',
                            destinationName: '',
                            sumOfSource: 0,
                            sumOfDestination: 0,
                            fontSize: 10,
                            fontColor: '#000'
                        };
                        if (options.dataViews[0].categorical.hasOwnProperty('categories')) {
                            iIndexOfCategory = 1;
                        }
                        if (options.dataViews[0].categorical.hasOwnProperty('values')) {
                            len = options.dataViews[0].categorical.values.length;
                        }
                        else {
                            this.displayBasicRequirement(4);
                            return;
                        }
                        for (var index = 0; index < len; index++) {
                            if (options.dataViews[0].categorical.values[index].source.roles.hasOwnProperty(Visual.sourceStringLiteral)) {
                                iIndexOfSource = 2;
                            }
                            else if (options.dataViews[0].categorical.values[index].source.roles
                                .hasOwnProperty(Visual.destinationStringLiteral)) {
                                iIndexOfDestination = 3;
                            }
                        }
                        if (iIndexOfCategory === -1) {
                            this.displayBasicRequirement(1);
                            return;
                        }
                        else if (iIndexOfSource === -1) {
                            this.displayBasicRequirement(2);
                            return;
                        }
                        else if (iIndexOfDestination === -1) {
                            this.displayBasicRequirement(3);
                            return;
                        }
                        Visual.settings = Visual.parseSettings(options && options.dataViews && options.dataViews[0]);
                        var dataPoints = [];
                        var categorical = dataViews[0].categorical;
                        var categories = dataViews[0].categorical.categories[0].values;
                        // tslint:disable-next-line:no-any
                        var sourceArr = [];
                        // tslint:disable-next-line:no-any
                        var destinationArr = [];
                        // tslint:disable-next-line:no-any
                        var measuresArr = [];
                        var sourceName;
                        var destinationName;
                        var measureName;
                        categorical.values.forEach(function (val) {
                            if (val.source.roles[Visual.sourceStringLiteral]) {
                                sourceArr = val.values;
                                sourceName = val.source.displayName;
                            }
                            else if (val.source.roles[Visual.destinationStringLiteral]) {
                                destinationArr = val.values;
                                destinationName = val.source.displayName;
                            }
                            else {
                                measuresArr = val.values;
                                measureName = val.source.displayName;
                            }
                        });
                        if (0 === measuresArr.length) {
                            var idxx = 0;
                            for (idxx = 0; idxx < categories.length; idxx++) {
                                measuresArr.push(Math.round(destinationArr[idxx] * 100 / sourceArr[idxx]));
                            }
                        }
                        var colorPalette = host.colorPalette;
                        var categoriesLength = categories.length;
                        var idx = 0;
                        for (idx = 0; idx < categoriesLength; idx++) {
                            var defaultColor = {
                                solid: {
                                    color: colorPalette.getColor(categorical.categories[0].values[idx] + Visual.emptyString).value
                                }
                            };
                            var dataPoint = {
                                category: categories[idx],
                                source: sourceArr[idx],
                                destination: destinationArr[idx],
                                measures: measuresArr[idx],
                                color: getCategoricalObjectValue(categorical.categories[0], idx, 'colorSettings', 'color', defaultColor).solid.color,
                                selectionId: host.createSelectionIdBuilder()
                                    .withCategory(categorical.categories[0], idx)
                                    .createSelectionId(),
                                dataPercentageSource: null,
                                dataPercentageDestination: null
                            };
                            dataPoints.push(dataPoint);
                        }
                        this.sourceFormat = dataViews[0].categorical.values[0].source.format;
                        this.destinationFormat = dataViews[0].categorical.values[1].source.format;
                        // tslint:disable-next-line:no-any
                        var getSum = function (total, val) {
                            return total + val;
                        };
                        return {
                            dataPoints: dataPoints,
                            categoryName: categorical.categories[0].source.displayName,
                            sourceName: sourceName,
                            destinationName: destinationName,
                            measureName: measureName,
                            sumOfSource: sourceArr.reduce(getSum),
                            sumOfDestination: destinationArr.reduce(getSum),
                            fontColor: Visual.settings.conversionSettings.fontColor,
                            fontSize: Visual.settings.conversionSettings.fontSize
                        };
                    };
                    Visual.prototype.displayBasicRequirement = function (iStatus) {
                        d3.select('.categoryLabelContainer').selectAll('*').empty();
                        d3.select('.visualContainer').selectAll('*').empty();
                        d3.select('.mainContainer').selectAll('*').empty();
                        d3.select(this.target).insert('div', ':first-child')
                            .attr('id', 'textToDisplay');
                        if (iStatus === 1) {
                            document.getElementById('textToDisplay').textContent = "Please select 'Category'";
                        }
                        else if (iStatus === 2) {
                            document.getElementById('textToDisplay').textContent = "Please select 'Source'";
                        }
                        else if (iStatus === 3) {
                            document.getElementById('textToDisplay').textContent = "Please select 'Destination'";
                        }
                        else if (iStatus === 4) {
                            document.getElementById('textToDisplay').textContent = "Please select 'Source' and 'Destination'";
                        }
                    };
                    // tslint:disable-next-line:cyclomatic-complexity
                    Visual.prototype.update = function (options) {
                        var $this = this;
                        d3.select('#textToDisplay').remove();
                        // tslint:disable-next-line:no-any
                        var dataView = options.dataViews[0].metadata.columns;
                        $this.dataViews = options.dataViews[0];
                        var viewModel = $this.visualModel = $this.VisualTransform(options, $this.host);
                        var viewportWidth = options.viewport.width;
                        var viewportHeight = options.viewport.height;
                        var maxBaseWidth = viewportWidth * Visual.MAXWIDTHRATIO; // use 70% of viewport
                        var summaryLabelColor = viewModel.fontColor;
                        var summaryLabelSize = viewModel.fontSize;
                        Visual.cX = viewportWidth - maxBaseWidth / 2;
                        Visual.cY = options.viewport.height;
                        var measureName = viewModel.measureName;
                        var isEllipses;
                        var iswidthSame;
                        var sourceLabelRelativeHeight = 0.053;
                        if (Visual.settings.categoryLabelSettings.show) {
                            var heightCategoryLabel = Visual.getCategoryLabelHeight();
                            Visual.cY -= heightCategoryLabel;
                        }
                        Visual.cY /= 2;
                        // Repainting all the elements
                        d3.selectAll('.funnel').remove();
                        d3.selectAll('.conversionContainer').remove();
                        d3.select('.conversionMsgContainer').remove();
                        d3.select('.measuresContainer').remove();
                        d3.selectAll('.labelValue').remove();
                        d3.selectAll('.separatorLine').remove();
                        d3.selectAll(Visual.dotLiteral + Visual.measureLabelLiteral).remove();
                        d3.selectAll(Visual.dotLiteral + Visual.measureLabelDestLiteral).remove();
                        var triData = $this.visualCont.selectAll('.funnel')
                            .data(viewModel.dataPoints);
                        var maxConversionBoxWidth = 65;
                        var maxConversionBoxHeight = 55;
                        var minConversionBoxWidth = 25;
                        var minConversionBoxHeight = 25;
                        var conversionBoxWidth = Math.min(viewportWidth * Visual.MINCONVERSIONBOXWIDTH, maxConversionBoxWidth);
                        var conversionBoxHeight = Math.min(viewportHeight * Visual.MINCONVERSIONBOXHEIGHT, maxConversionBoxHeight);
                        conversionBoxWidth = Math.max(conversionBoxWidth, minConversionBoxWidth);
                        conversionBoxHeight = Math.max(conversionBoxHeight, minConversionBoxHeight);
                        // tslint:disable-next-line:no-any
                        var noOfFunnels = (triData && triData[0]) ? triData[0].length : 0;
                        // tslint:disable-next-line:no-any
                        var conversionValues = [];
                        // tslint:disable-next-line:no-any
                        var sourceCumulative = [];
                        // tslint:disable-next-line:no-any
                        var destinationCumulative = [];
                        var startXLabel = 0;
                        var isLabelShrinked;
                        sourceCumulative[0] = viewModel.dataPoints[0].source;
                        destinationCumulative[0] = viewModel.dataPoints[0].destination;
                        for (var idx = 1; idx <= viewModel.dataPoints.length - 1; idx++) {
                            sourceCumulative[idx] = sourceCumulative[idx - 1] + viewModel.dataPoints[idx].source;
                            destinationCumulative[idx] = destinationCumulative[idx - 1] + viewModel.dataPoints[idx].destination;
                        }
                        $this.mainContainer.attr({
                            width: options.viewport.width,
                            height: options.viewport.height
                        }).style({
                            width: options.viewport.width,
                            height: options.viewport.height,
                            position: 'absolute'
                        });
                        $this.visualCont.attr({
                            width: options.viewport.width,
                            height: options.viewport.height
                        });
                        $this.categoryLabelContainer.attr({
                            width: '100%',
                            height: 30
                        });
                        // on enter
                        triData.enter()
                            .append('g')
                            .classed('funnel', true)
                            .each(function (d, i) {
                            // tslint:disable-next-line:no-any
                            var $$this = d3.select(this);
                            var catVar = d.category.toString();
                            catVar = catVar.replace(/\s/g, '');
                            $$this.append('path')
                                .classed(catVar + Visual.spaceLiteral + Visual.upperTriLiteral, true);
                            $$this.append('path')
                                .classed(catVar + Visual.spaceLiteral + Visual.lowerTriLiteral, true);
                            if (Visual.settings.separatorSettings.show) {
                                if ((noOfFunnels - 1) !== i) {
                                    $$this.append('path')
                                        .classed('separatorUpLine separatorLine', true);
                                    $$this.append('path')
                                        .classed('separatorDownLine separatorLine', true);
                                }
                            }
                        });
                        // on update
                        var setstartXLabel = false;
                        triData.each(function (d, i) {
                            // tslint:disable-next-line:no-any
                            var $$this = d3.select(this);
                            // tslint:disable-next-line:no-any
                            var conversionValue;
                            var baseUpTri;
                            var baseDownTri;
                            var startUpTriX;
                            var startDownTriX;
                            // tslint:disable-next-line:no-any
                            var dataLevel;
                            // tslint:disable-next-line:no-any
                            var dataValue;
                            // tslint:disable-next-line:no-any
                            var dataPercentage;
                            var baseWidth = 100;
                            var RELATIVERATIO = 0.7;
                            var strokeStyle = Visual.settings.separatorSettings.lineStyle;
                            if (strokeStyle === 'dashed') {
                                strokeStyle = '5 ,4';
                            }
                            else if (strokeStyle === 'dotted') {
                                strokeStyle = '2 ,1';
                            }
                            else if (strokeStyle === 'solid') {
                                strokeStyle = 'none';
                            }
                            iswidthSame = Visual.settings.conversionSettings.relativeWidth;
                            var catVar = d.category.toString();
                            catVar = catVar.replace(/\s/g, '');
                            $$this.select(Visual.dotLiteral + catVar + Visual.dotLiteral + Visual.upperTriLiteral)
                                .attr({
                                // tslint:disable-next-line:no-any
                                d: function (k) {
                                    var maxWidth = Visual.calculateUpperMaxWidth(maxBaseWidth, viewModel);
                                    if (maxWidth < maxBaseWidth * RELATIVERATIO && !iswidthSame) {
                                        maxWidth = maxBaseWidth * RELATIVERATIO;
                                    }
                                    var base = maxWidth * (d.source / viewModel.sumOfSource);
                                    var startX = options.viewport.width - maxWidth - (maxBaseWidth - maxWidth) / 2
                                        - base + (maxWidth * sourceCumulative[i] / viewModel.sumOfSource);
                                    startUpTriX = startX;
                                    baseUpTri = base;
                                    dataValue = d.source;
                                    dataPercentage = Math.round(d.source / viewModel.sumOfSource * 100) + Visual.percentageLiteral;
                                    dataLevel = dataValue + Visual.spaceLiteral + Visual.openBracketLiteral
                                        + dataPercentage + Visual.closeBracketLiteral;
                                    viewModel.dataPoints.forEach(function (cat) {
                                        if (cat.category === d.category) {
                                            cat.dataPercentageSource = dataPercentage;
                                        }
                                    });
                                    return Visual.GetTriangleUpPath(Visual.cX, Visual.cY, startX, Visual.cY, base);
                                },
                                fill: d.color
                            })
                                .on('click', function (k) {
                                var _this = this;
                                Visual.selectionManager.select(d.selectionId).then(function (ids) {
                                    var selSVG = d3.select(_this).attr('class');
                                    var oSelclassObj = selSVG.split(' ');
                                    if (!d3.select(_this).classed('selected')) {
                                        d3.selectAll(Visual.dotLiteral + Visual.upperTriLiteral).style({
                                            opacity: '0.5'
                                        });
                                        d3.selectAll(Visual.dotLiteral + Visual.lowerTriLiteral).style({
                                            opacity: '0.5'
                                        });
                                        d3.select(_this).classed('selected', true);
                                        d3.select(_this).style({
                                            opacity: '1'
                                        });
                                        d3.select(Visual.dotLiteral + oSelclassObj[0] + Visual.dotLiteral + Visual.lowerTriLiteral).style({
                                            opacity: '1'
                                        })
                                            .classed('selected', true);
                                    }
                                    else {
                                        d3.selectAll(Visual.dotLiteral + Visual.upperTriLiteral).style({
                                            opacity: '1'
                                        })
                                            .classed('selected', false);
                                        d3.selectAll(Visual.dotLiteral + Visual.lowerTriLiteral).style({
                                            opacity: '1'
                                        })
                                            .classed('selected', false);
                                        Visual.selectionManager.clear();
                                    }
                                });
                            });
                            var labelTextVisibility = Visual.findlabetTextAndVisibilitySource(dataLevel, startUpTriX, dataPercentage, baseUpTri, dataValue, Visual.cY, options, isEllipses);
                            // if (Visual.settings.detailLabelSettings.show && baseUpTri > baseWidth) {
                            if (Visual.settings.detailLabelSettings.show) {
                                $$this.append('text')
                                    .classed(Visual.textLabelLiteral, true)
                                    .style('font-size', Visual.settings.detailLabelSettings.fontSize + Visual.pxLiteral)
                                    .style('font-family', Visual.settings.categoryLabelSettings.fontFamily)
                                    .style('fill', Visual.settings.detailLabelSettings.color)
                                    .style('visibility', labelTextVisibility.visibility)
                                    .attr({
                                    x: labelTextVisibility.xAxis,
                                    y: labelTextVisibility.yAxis
                                })
                                    .text(labelTextVisibility.labelText);
                            }
                            var labelText = labelTextVisibility.labelText;
                            $$this.select(Visual.dotLiteral + catVar + Visual.dotLiteral + Visual.lowerTriLiteral)
                                .attr({
                                // tslint:disable-next-line:no-any
                                d: function (k) {
                                    var maxWidth = Visual.calculateLowerMaxWidth(maxBaseWidth, viewModel);
                                    if (maxWidth < maxBaseWidth * RELATIVERATIO && !iswidthSame) {
                                        maxWidth = maxBaseWidth * RELATIVERATIO;
                                    }
                                    var base = maxWidth * (k.destination / viewModel.sumOfDestination);
                                    baseDownTri = base;
                                    var startX = options.viewport.width - maxWidth - (maxBaseWidth - maxWidth) / 2
                                        - base + (maxWidth * destinationCumulative[i] / viewModel.sumOfDestination);
                                    startDownTriX = startX;
                                    conversionValue = k.destination / k.source * 100;
                                    if (conversionValue !== null) {
                                        conversionValue = parseFloat(Number(conversionValue).toFixed(0)).toString() + Visual.percentageLiteral;
                                    }
                                    conversionValues.push({
                                        percentageBg: Visual.percentageBgLiteral + i,
                                        percentageValue: Visual.percentageValueLiteral + i,
                                        value: conversionValue,
                                        color: k.color,
                                        categoryName: k.category
                                    });
                                    dataValue = k.destination;
                                    dataPercentage = k.destination / viewModel.sumOfDestination * 100;
                                    if (dataPercentage !== null) {
                                        dataPercentage = Math.round(dataPercentage).toString() + Visual.percentageLiteral;
                                    }
                                    dataLevel = dataValue + Visual.spaceLiteral + Visual.openBracketLiteral
                                        + dataPercentage + Visual.closeBracketLiteral;
                                    viewModel.dataPoints.forEach(function (ca) {
                                        if (ca.category === k.category) {
                                            ca.dataPercentageDestination = dataPercentage;
                                        }
                                    });
                                    return Visual.GetTriangleDownPath(Visual.cX, Visual.cY, startX, Visual.cY, base);
                                },
                                fill: d.color
                            })
                                .on('click', function (k) {
                                var _this = this;
                                Visual.selectionManager.select(d.selectionId).then(function (ids) {
                                    if (!d3.select(_this).classed('selected')) {
                                        d3.selectAll(Visual.dotLiteral + Visual.upperTriLiteral).style({
                                            opacity: '0.5'
                                        });
                                        d3.selectAll(Visual.dotLiteral + Visual.lowerTriLiteral).style({
                                            opacity: '0.5'
                                        });
                                        var selSVG = d3.select(_this).attr('class');
                                        var oSelclassObj = selSVG.split(' ');
                                        d3.select(_this).classed('selected', true);
                                        d3.select(_this).style({
                                            opacity: '1'
                                        });
                                        d3.select(Visual.dotLiteral + oSelclassObj[0] + Visual.dotLiteral + Visual.upperTriLiteral).style({
                                            opacity: '1'
                                        })
                                            .classed('selected', true);
                                    }
                                    else {
                                        d3.selectAll(Visual.dotLiteral + Visual.upperTriLiteral).style({
                                            opacity: '1'
                                        })
                                            .classed('selected', false);
                                        d3.selectAll(Visual.dotLiteral + Visual.lowerTriLiteral).style({
                                            opacity: '1'
                                        })
                                            .classed('selected', false);
                                        Visual.selectionManager.clear();
                                    }
                                });
                            });
                            var minTextWidth = 100;
                            var labelTextVisibilityDest = Visual.findlabelTextAndVisibilityDest(dataLevel, startDownTriX, dataPercentage, baseDownTri, options, dataValue, Visual.cX);
                            // if (Visual.settings.detailLabelSettings.show && baseDownTri >= minTextWidth) {
                            if (Visual.settings.detailLabelSettings.show) {
                                $$this.append('text')
                                    .classed(Visual.textLabelLiteral, true)
                                    .style('font-size', Visual.settings.detailLabelSettings.fontSize + Visual.pxLiteral)
                                    .style('font-family', Visual.settings.categoryLabelSettings.fontFamily)
                                    .style('fill', Visual.settings.detailLabelSettings.color)
                                    .style('visibility', labelTextVisibilityDest.visibility)
                                    .attr({
                                    x: labelTextVisibilityDest.xAxis,
                                    y: options.viewport.height * Visual.DESTINATIONDATALABELRELATIVEHEIGHT - Visual.getCategoryLabelHeight()
                                })
                                    .text(labelTextVisibilityDest.labelText);
                            }
                            if ((noOfFunnels - 1) !== i) {
                                $$this.select('.separatorUpLine')
                                    .attr({
                                    d: function (k) {
                                        return Visual.GetSeparatorUpPath(Visual.cX, Visual.cY, startUpTriX, Visual.cY, baseUpTri);
                                    },
                                    'stroke-width': Visual.settings.separatorSettings.strokeWidth,
                                    'stroke-dasharray': strokeStyle,
                                    stroke: Visual.settings.separatorSettings.color
                                });
                                $$this.select('.separatorDownLine')
                                    .attr({
                                    d: function (k) {
                                        return Visual.GetSeparatorDownPath(Visual.cX, Visual.cY, startDownTriX, Visual.cY, baseDownTri);
                                    },
                                    fill: 'none',
                                    'stroke-width': Visual.settings.separatorSettings.strokeWidth,
                                    'stroke-dasharray': strokeStyle,
                                    stroke: Visual.settings.separatorSettings.color
                                });
                            }
                        });
                        if (Visual.settings.conversionSettings.show) {
                            debugger;
                            triData.enter()
                                .append('g')
                                .classed('conversionContainer', true)
                                .each(function (d, i) {
                                // tslint:disable-next-line:no-any
                                var $$this = d3.select(this);
                                var conVar = d.category.toString();
                                conVar = conVar.replace(/\s/g, '');
                                $$this.append('rect')
                                    .classed(conVar + Visual.spaceLiteral + Visual.percentageBgLiteral, true);
                                $$this.append('text')
                                    .classed(Visual.conversionValueLiteral + Visual.spaceLiteral + Visual.percentageValueLiteral + i, true);
                            });
                            triData.each(function (d, i) {
                                var maxWidth = maxBaseWidth;
                                var measureValue = d.measures;
                                // tslint:disable-next-line:no-any
                                var conversionPercent;
                                if (viewModel.sumOfSource < viewModel.sumOfDestination) {
                                    maxWidth = maxBaseWidth * 0.8;
                                }
                                var visibility = 'visible';
                                debugger;
                                var conVar = d.category.toString();
                                conVar = conVar.replace(/\s/g, '');
                                d3.select(Visual.dotLiteral + conVar + Visual.dotLiteral + Visual.percentageBgLiteral)
                                    .attr({
                                    x: Visual.cX + (i * conversionBoxWidth) - (noOfFunnels * conversionBoxWidth) / 2,
                                    y: Visual.cY - (conversionBoxHeight / 2),
                                    width: conversionBoxWidth,
                                    height: conversionBoxHeight,
                                    fill: d.color
                                });
                                if (measureName && measureValue !== null) {
                                    conversionPercent = measureValue;
                                }
                                else if (measureValue == null) {
                                    conversionPercent = 'NA';
                                }
                                else {
                                    conversionPercent = conversionValues[i].value;
                                }
                                var textProperties = {
                                    text: conversionPercent,
                                    fontFamily: Visual.settings.categoryLabelSettings.fontFamily,
                                    fontSize: Visual.settings.conversionSettings.fontSize + Visual.pxLiteral
                                };
                                var boxPercentage = textMeasurementService.getTailoredTextOrDefault(textProperties, conversionBoxWidth - 10);
                                var boxPercentageLength = boxPercentage.length;
                                if (3 >= boxPercentageLength && '...' === boxPercentage) {
                                    visibility = 'hidden';
                                }
                                d3.select(Visual.dotLiteral + Visual.percentageValueLiteral + i)
                                    .attr({
                                    x: Visual.cX + (i * conversionBoxWidth) - (noOfFunnels * conversionBoxWidth) / 2 + conversionBoxWidth / 2,
                                    y: Visual.cY + (conversionBoxHeight / 8)
                                }).text(boxPercentage)
                                    .style('font-size', summaryLabelSize.toString() + Visual.pxLiteral)
                                    .style('font-family', Visual.settings.categoryLabelSettings.fontFamily)
                                    .style('fill', summaryLabelColor.toString())
                                    .style('visibility', visibility);
                                // Repainting Box Percentage after finding out how much width it will take in Box
                                // tslint:disable-next-line:no-any
                                var textElement;
                                textElement = d3.select(Visual.dotLiteral + Visual.percentageValueLiteral + i);
                                var widthSize = textMeasurementService.measureSvgTextElementWidth(textElement.node());
                                var xAxis = Visual.cX + (i * conversionBoxWidth) - (noOfFunnels * conversionBoxWidth) / 2
                                    + (conversionBoxWidth - widthSize) / 2;
                                if (xAxis < 0) {
                                    xAxis = 0;
                                }
                                d3.select(Visual.dotLiteral + Visual.percentageValueLiteral + i)
                                    .attr({
                                    x: xAxis
                                }).append('title').text(conversionPercent);
                            });
                        }
                        if (Visual.settings.categoryLabelSettings.show) {
                            var sourcetextProperties = {
                                text: viewModel.sourceName.toString(),
                                fontFamily: Visual.settings.categoryLabelSettings.fontFamily,
                                fontSize: Visual.settings.categoryLabelSettings.fontSize + Visual.pxLiteral
                            };
                            var destinationtextProperties = {
                                text: viewModel.destinationName.toString(),
                                fontFamily: Visual.settings.categoryLabelSettings.fontFamily,
                                fontSize: Visual.settings.categoryLabelSettings.fontSize + Visual.pxLiteral
                            };
                            var measureString = void 0;
                            var measureStringLength = void 0;
                            var visibility_1;
                            var xAxis = void 0;
                            var labelWidth = void 0;
                            var availableWidth = void 0;
                            var maxWidth_1;
                            var isNarrow = void 0;
                            var labelWidthDest = void 0;
                            isEllipses = !Visual.settings.categoryLabelSettings.textwrap;
                            isNarrow = false;
                            isLabelShrinked = false;
                            measureString = textMeasurementService.getTailoredTextOrDefault(sourcetextProperties, options.viewport.width * 0.29);
                            measureStringLength = measureString.length;
                            xAxis = options.viewport.width / 5; // -  (Visual.settings.categoryLabelSettings.fontSize * 2);
                            labelWidth = textMeasurementService.measureSvgTextWidth(sourcetextProperties);
                            labelWidthDest = textMeasurementService.measureSvgTextWidth(destinationtextProperties);
                            visibility_1 = 'visible';
                            if (3 >= measureStringLength || 40 >= options.viewport.width * 0.28 || labelWidth > options.viewport.width * 0.8) {
                                visibility_1 = 'hidden';
                            }
                            if (labelWidth < labelWidthDest) {
                                labelWidth = labelWidthDest;
                            }
                            // For gradually shifiting category labels to left while shrinking
                            availableWidth = options.viewport.width * Visual.MAXLENGTHMEASURELABEL;
                            maxWidth_1 = options.viewport.width * Visual.MAXWIDTHMEASURELABEL;
                            if (xAxis + labelWidth >= availableWidth) {
                                isNarrow = true;
                                isLabelShrinked = true;
                                if (availableWidth >= labelWidth) {
                                    while (1) {
                                        if (xAxis + labelWidth <= availableWidth) {
                                            break;
                                        }
                                        else {
                                            xAxis--;
                                        }
                                    }
                                }
                            }
                            var subStringlabel = measureString.substring(measureStringLength - 3, measureStringLength);
                            var measureStringDest = textMeasurementService.getTailoredTextOrDefault(destinationtextProperties, options.viewport.width * 0.29);
                            var measureStringDestLength = measureStringDest.length;
                            var subStringlabelDest = measureStringDest.substring(measureStringDestLength - 3, measureStringDestLength);
                            if ('...' === subStringlabel || '...' === subStringlabelDest) {
                                isNarrow = true;
                            }
                            else {
                                isNarrow = false;
                            }
                            if (xAxis < 0 || isNarrow) {
                                xAxis = 0;
                            }
                            if (!setstartXLabel) {
                                startXLabel = xAxis;
                                setstartXLabel = true;
                            }
                            // Adding Source Label and Aligning DataLabel(textlabel) with Measure Label.
                            var yAxis = options.viewport.height * Visual.SOURCEMEASURELABELRELATIVEHEIGHT;
                            if (options.viewport.height < 300) {
                                yAxis -= 5;
                            }
                            else if (options.viewport.height > 500) {
                                yAxis += 5;
                            }
                            debugger;
                            $this.labelDiv.append('div')
                                .classed(Visual.measureLabelLiteral, true)
                                .attr({
                                x: xAxis,
                                y: yAxis,
                                top: yAxis,
                                title: viewModel.sourceName.toString()
                            })
                                .style('width', (options.viewport.width * Visual.MAXLENGTHMEASURELABEL - xAxis) + Visual.pxLiteral)
                                .style('font-size', Visual.settings.categoryLabelSettings.fontSize + Visual.pxLiteral)
                                .style('font-family', Visual.settings.categoryLabelSettings.fontFamily)
                                .style('fill', Visual.settings.categoryLabelSettings.fontColor)
                                .style('visibility', visibility_1)
                                .style('color', Visual.settings.categoryLabelSettings.fontColor)
                                .style('top', yAxis + Visual.pxLiteral)
                                .style('left', xAxis + Visual.pxLiteral)
                                .style('title', viewModel.sourceName.toString());
                            // For updating properties of Source measure label
                            if (isEllipses) {
                                d3.select(Visual.dotLiteral + Visual.measureLabelLiteral)
                                    .text(measureString)
                                    .style('white-space', 'nowrap')
                                    .style('overflow', 'hidden')
                                    .style('text-overflow', 'ellipsis');
                            }
                            else {
                                measureString = viewModel.sourceName.toString();
                                d3.select(Visual.dotLiteral + Visual.measureLabelLiteral)
                                    .text(measureString)
                                    .style('word-wrap', ' break-word');
                            }
                            // Adding Destination Label
                            var top_1 = options.viewport.height * Visual.DESTINATIONMEASURELABELRELATIVEHEIGHT;
                            $this.labelDiv.append('div')
                                .classed(Visual.measureLabelDestLiteral, true)
                                .attr({
                                x: xAxis,
                                y: top_1,
                                title: viewModel.destinationName.toString()
                            })
                                .style('top', top_1 + Visual.pxLiteral)
                                .style('left', xAxis + Visual.pxLiteral)
                                .style('width', (options.viewport.width * Visual.MAXLENGTHMEASURELABEL - xAxis) + Visual.pxLiteral)
                                .style('font-size', Visual.settings.categoryLabelSettings.fontSize + Visual.pxLiteral)
                                .style('font-family', Visual.settings.categoryLabelSettings.fontFamily)
                                .style('fill', Visual.settings.categoryLabelSettings.fontColor)
                                .style('visibility', visibility_1)
                                .style('color', Visual.settings.categoryLabelSettings.fontColor)
                                .style('title', viewModel.sourceName.toString());
                            // For updating properties of Destination measure label
                            var yAxisOfDestHeight = void 0;
                            if (isEllipses) {
                                measureString = textMeasurementService.getTailoredTextOrDefault(destinationtextProperties, options.viewport.width * Visual.MAXLENGTHMEASURELABEL);
                                measureStringLength = measureString.length;
                                yAxisOfDestHeight = Visual.calculateYaxisDestination(document, options, isEllipses);
                                d3.select(Visual.dotLiteral + Visual.measureLabelDestLiteral)
                                    .text(measureString)
                                    .style('top', yAxisOfDestHeight + Visual.pxLiteral)
                                    .style('white-space', 'nowrap')
                                    .style('overflow', 'hidden')
                                    .style('text-overflow', 'ellipsis');
                            }
                            else {
                                measureString = viewModel.destinationName.toString();
                                measureStringLength = measureString.length;
                                d3.select(Visual.dotLiteral + Visual.measureLabelDestLiteral)
                                    .text(measureString)
                                    .style('word-wrap', ' break-word');
                                yAxisOfDestHeight = Visual.calculateYaxisDestination(document, options, isEllipses);
                                // After calculating correct position, change the top of measure
                                d3.select(Visual.dotLiteral + Visual.measureLabelDestLiteral).attr({
                                    x: xAxis + Visual.pxLiteral,
                                    y: yAxisOfDestHeight + Visual.pxLiteral,
                                    title: viewModel.destinationName.toString()
                                })
                                    .style('top', yAxisOfDestHeight + Visual.pxLiteral);
                            }
                            var previousWidth_1 = -1;
                            triData.each(function (d, i) {
                                // tslint:disable-next-line:no-any
                                var labelContainer = d3.select('.categoryLabelContainer');
                                maxWidth_1 = maxBaseWidth;
                                if (viewModel.sumOfSource < viewModel.sumOfDestination) {
                                    maxWidth_1 = maxBaseWidth * 0.8;
                                }
                                var base = maxWidth_1 * (d.source / viewModel.sumOfSource);
                                base -= 1;
                                var marginLeft = options.viewport.width - maxWidth_1 - (maxBaseWidth - maxWidth_1) / 2
                                    - base + (maxWidth_1 * sourceCumulative[i] / viewModel.sumOfSource);
                                if (previousWidth_1 !== -1) {
                                    marginLeft = 0;
                                }
                                previousWidth_1++;
                                var textProperties = {
                                    text: conversionValues[i].categoryName,
                                    fontFamily: Visual.settings.categoryLabelSettings.fontFamily,
                                    fontSize: Visual.settings.categoryLabelSettings.fontSize + Visual.pxLiteral
                                };
                                var categoryName = textMeasurementService.getTailoredTextOrDefault(textProperties, base + 1);
                                visibility_1 = 'visible';
                                if (maxWidth_1 < 80 || '...' === categoryName) {
                                    visibility_1 = 'hidden';
                                }
                                labelContainer.append('div')
                                    .classed('labelValue', true)
                                    .text(conversionValues[i].categoryName)
                                    .style('margin-left', marginLeft + Visual.pxLiteral)
                                    .style('width', base + Visual.pxLiteral)
                                    .style('font-size', Visual.settings.categoryLabelSettings.fontSize + Visual.pxLiteral)
                                    .style('font-family', Visual.settings.categoryLabelSettings.fontFamily)
                                    .style('color', Visual.settings.categoryLabelSettings.fontColor)
                                    .style('float', 'left')
                                    .style('text-align', 'center')
                                    .style('visibility', visibility_1);
                            });
                        }
                        if (Visual.settings.categoryLabelSettings.show && Visual.settings.conversionSettings.show) {
                            var converttextProperties = {
                                text: Visual.settings.conversionSettings.label,
                                fontFamily: Visual.settings.categoryLabelSettings.fontFamily,
                                fontSize: Visual.settings.categoryLabelSettings.fontSize + Visual.pxLiteral
                            };
                            var conversionString = void 0;
                            var conversionStringLength = void 0;
                            var visibility = void 0;
                            var xAxis = void 0;
                            xAxis = options.viewport.width / 5 - (Visual.settings.categoryLabelSettings.fontSize * 2);
                            if (xAxis < 0) {
                                xAxis = 0;
                            }
                            if (isEllipses) {
                                if (xAxis >= startXLabel && (isLabelShrinked || options.viewport.width * 0.4 <= 200)) {
                                    xAxis = startXLabel;
                                }
                                conversionString = textMeasurementService.getTailoredTextOrDefault(converttextProperties, options.viewport.width * 0.45);
                                conversionStringLength = conversionString.length;
                                visibility = 'visible';
                                if (3 >= conversionStringLength || 40 >= options.viewport.width * Visual.MAXLENGTHMEASURELABEL) {
                                    visibility = 'hidden';
                                }
                                debugger;
                                // let measurelabel: any = $(d3.select('.measureLabel')[0]).css('left');
                                // For aligning 'Conversion %' with Measure label
                                $this.labelDiv
                                    .append('div')
                                    .classed('conversionMsgContainer', true)
                                    .attr({
                                    x: xAxis,
                                    y: Visual.cY - (conversionBoxHeight / 6),
                                    title: Visual.settings.conversionSettings.label,
                                    id: 'conversionStringContainer'
                                })
                                    .text(conversionString)
                                    .style('id', 'conversionStringContainer')
                                    .style('font-size', Visual.settings.categoryLabelSettings.fontSize + Visual.pxLiteral)
                                    .style('fill', Visual.settings.categoryLabelSettings.fontColor)
                                    .style('visibility', visibility)
                                    .style('font-family', Visual.settings.categoryLabelSettings.fontFamily)
                                    .style('top', Visual.cY - (conversionBoxHeight / 6) + Visual.pxLiteral)
                                    .style('left', xAxis + 24 + Visual.pxLiteral)
                                    .style('white-space', 'nowrap')
                                    .style('overflow', 'hidden')
                                    .style('color', Visual.settings.categoryLabelSettings.fontColor)
                                    .style('title', Visual.settings.conversionSettings.label)
                                    .style('text-overflow', 'ellipsis');
                            }
                            else {
                                if (xAxis >= startXLabel && (isLabelShrinked || options.viewport.width * 0.4 <= 200)) {
                                    xAxis = startXLabel;
                                }
                                var labelWidth = textMeasurementService.measureSvgTextWidth(converttextProperties);
                                conversionString = Visual.settings.conversionSettings.label;
                                conversionStringLength = conversionString.length;
                                visibility = 'visible';
                                if (3 >= conversionStringLength || 50 >= options.viewport.width * 0.28) {
                                    visibility = 'hidden';
                                }
                                debugger;
                                $this.labelDiv
                                    .append('div')
                                    .classed('conversionMsgContainer', true)
                                    .attr({
                                    x: xAxis,
                                    y: Visual.cY - (conversionBoxHeight / 6),
                                    title: Visual.settings.conversionSettings.label
                                })
                                    .text(conversionString)
                                    .style('font-size', Visual.settings.categoryLabelSettings.fontSize + Visual.pxLiteral)
                                    .style('fill', Visual.settings.categoryLabelSettings.fontColor)
                                    .style('visibility', visibility)
                                    .style('font-family', Visual.settings.categoryLabelSettings.fontFamily)
                                    .style('top', Visual.cY - (conversionBoxHeight / 6) + Visual.pxLiteral)
                                    .style('color', Visual.settings.categoryLabelSettings.fontColor)
                                    .style('title', Visual.settings.conversionSettings.label)
                                    .style('left', xAxis + Visual.pxLiteral)
                                    .style('word-wrap', ' break-word');
                            }
                        }
                        $this.visualSelection = $this.visualCont
                            .selectAll('.funnel')
                            .data(viewModel.dataPoints);
                        $this.visualSelection
                            .enter()
                            .append('rect')
                            .classed('.funnel', true);
                        $this.tooltipServiceWrapper.addTooltip($this.visualCont.selectAll('.funnel'), function (tooltipEvent) { return $this.getTooltipData(tooltipEvent.data, viewModel.categoryName, viewModel.sourceName, viewModel.destinationName, Visual.settings.conversionSettings.label, viewModel.sumOfSource, viewModel.sumOfDestination, viewModel.dataPoints); }, function (tooltipEvent) { return null; });
                        triData.exit().remove();
                    };
                    // tslint:disable-next-line:no-any
                    Visual.findlabelTextAndVisibilityDest = function (dataLevel, startDownTriX, dataPercentage, 
                        // tslint:disable-next-line:no-any
                        baseDownTri, options, dataValue, cX) {
                        var textProperties = {
                            text: dataLevel,
                            fontFamily: Visual.settings.categoryLabelSettings.fontFamily,
                            fontSize: Visual.settings.detailLabelSettings.fontSize + Visual.pxLiteral
                        };
                        var finalValue = Visual.getValueByUnits(Visual.settings.detailLabelSettings.labelDisplayUnits, Visual.settings.detailLabelSettings.labelPrecision, dataValue);
                        var labelText = finalValue + Visual.spaceLiteral + Visual.openBracketLiteral
                            + dataPercentage + Visual.closeBracketLiteral;
                        dataLevel = labelText;
                        var labeltextProperties = {
                            text: labelText,
                            fontFamily: Visual.settings.categoryLabelSettings.fontFamily,
                            fontSize: Visual.settings.detailLabelSettings.fontSize + Visual.pxLiteral
                        };
                        var labelWidth;
                        labelWidth = textMeasurementService.measureSvgTextWidth(labeltextProperties);
                        if (labelWidth > baseDownTri * 0.65) {
                            labelText = textMeasurementService.getTailoredTextOrDefault(labeltextProperties, baseDownTri * 0.65);
                        }
                        else {
                            labelText = dataLevel;
                        }
                        var baseEnd = startDownTriX + baseDownTri;
                        var xAxis = ((startDownTriX + baseEnd + Visual.cX) / 3);
                        if (baseDownTri <= options.viewport.width * 0.3) {
                            labelText = textMeasurementService.getTailoredTextOrDefault(labeltextProperties, startDownTriX + baseDownTri - (xAxis));
                        }
                        var visibility = 'visible';
                        if (baseDownTri < labelWidth) {
                            visibility = 'hidden';
                        }
                        var subStringLabelText = labelText.substring(0, 4);
                        var subLabelText = labelText.substring(labelText.length - 4, labelText.length);
                        if (' ...' === subLabelText || '....' === subLabelText) {
                            labelText = labelText.substring(0, labelText.length - 4) + labelText.substring(labelText.length - 3, labelText.length - 0);
                        }
                        if ('null' === subStringLabelText || '...' === labelText) {
                            visibility = 'hidden';
                        }
                        if (!this.visibilityTextLabel && visibility) {
                            this.visibilityTextLabel = true;
                        }
                        return ({
                            visibility: visibility,
                            labelText: labelText,
                            xAxis: xAxis
                        });
                    };
                    // tslint:disable-next-line:no-any
                    Visual.getValueByUnits = function (displayUnits, precisionValue, dataValue) {
                        switch (Visual.settings.detailLabelSettings.labelDisplayUnits) {
                            case 1000:
                                displayUnits = 1001;
                                break;
                            case 1000000:
                                displayUnits = 1e6;
                                break;
                            case 1000000000:
                                displayUnits = 1e9;
                                break;
                            case 1000000000000:
                                displayUnits = 1e12;
                                break;
                            case 0:
                                displayUnits = getAutoByUnits(dataValue, displayUnits);
                                break;
                            default:
                                break;
                        }
                        var iValueFormatter;
                        if (precisionValue === 0) {
                            iValueFormatter = ValueFormatter.create({
                                value: displayUnits
                            });
                        }
                        else {
                            iValueFormatter = ValueFormatter.create({
                                value: displayUnits,
                                precision: precisionValue
                            });
                        }
                        return iValueFormatter.format(dataValue);
                    };
                    // tslint:disable-next-line:no-any
                    Visual.findlabetTextAndVisibilitySource = function (dataLevel, startUpTriX, dataPercentage, 
                        // tslint:disable-next-line:no-any
                        baseUpTri, dataValue, cY, options, isEllipses) {
                        var textProperties = {
                            text: dataLevel,
                            fontFamily: Visual.settings.categoryLabelSettings.fontFamily,
                            fontSize: Visual.settings.detailLabelSettings.fontSize + Visual.pxLiteral
                        };
                        var labelWidth;
                        var labelText;
                        var startXCurrent = startUpTriX;
                        // tslint:disable-next-line:no-any
                        var finalValue = Visual.getValueByUnits(Visual.settings.detailLabelSettings.labelDisplayUnits, Visual.settings.detailLabelSettings.labelPrecision, dataValue);
                        var newLabelText = finalValue + Visual.spaceLiteral + Visual.openBracketLiteral
                            + dataPercentage + Visual.closeBracketLiteral;
                        dataLevel = newLabelText;
                        var labeltextProperties = {
                            text: newLabelText,
                            fontFamily: Visual.settings.categoryLabelSettings.fontFamily,
                            fontSize: Visual.settings.detailLabelSettings.fontSize + Visual.pxLiteral
                        };
                        labelWidth = textMeasurementService.measureSvgTextWidth(labeltextProperties);
                        var baseEnd = startXCurrent + baseUpTri;
                        var xAxis = (baseEnd - startXCurrent) < 150 ? startXCurrent - 10 : ((startXCurrent + baseEnd + Visual.cX) / 3);
                        if (labelWidth > baseUpTri * 0.7) {
                            labelText = textMeasurementService.getTailoredTextOrDefault(labeltextProperties, baseUpTri * 0.7);
                        }
                        else {
                            labelText = dataLevel;
                        }
                        var visibility = 'visible';
                        var subStringLabelText = labelText.substring(0, 4);
                        if ('null' === subStringLabelText || '...' === labelText) {
                            visibility = 'hidden';
                        }
                        var subLabelText = labelText.substring(labelText.length - 4, labelText.length);
                        if (subLabelText === ' ...' || '....' === subLabelText) {
                            labelText = labelText.substring(0, labelText.length - 4) + labelText.substring(labelText.length - 3, labelText.length - 0);
                        }
                        var yAxis = options.viewport.height * Visual.SOURCEDATALABELRELATIVEHEIGHT;
                        return ({
                            visibility: visibility,
                            labelText: labelText,
                            xAxis: xAxis,
                            yAxis: yAxis
                        });
                    };
                    Visual.getCategoryLabelHeight = function () {
                        if (!Visual.settings.categoryLabelSettings.show) {
                            return 0;
                        }
                        var textProperties = {
                            text: 'dummyData',
                            fontFamily: Visual.settings.categoryLabelSettings.fontFamily,
                            fontSize: Visual.settings.categoryLabelSettings.fontSize + Visual.pxLiteral
                        };
                        return textMeasurementService.measureSvgTextHeight(textProperties);
                    };
                    Visual.getDataLabelHeight = function () {
                        if (!Visual.settings.detailLabelSettings.show) {
                            return 0;
                        }
                        var textProperties = {
                            text: 'dummyData',
                            fontFamily: Visual.settings.categoryLabelSettings.fontFamily,
                            fontSize: Visual.settings.detailLabelSettings.fontSize + Visual.pxLiteral
                        };
                        return textMeasurementService.measureSvgTextHeight(textProperties);
                    };
                    // tslint:disable-next-line:no-any
                    Visual.calculateYaxisDestination = function (document, options, isEllipses) {
                        var categoryLabelHeight = Visual.getCategoryLabelHeight();
                        var dataLabelHeight = Visual.getDataLabelHeight();
                        var baseOftextLabel = -1;
                        var yAxisOfDestHeight;
                        var lengthTextLabel = 0;
                        var destHeight = document.querySelectorAll(Visual.dotLiteral + Visual.measureLabelDestLiteral)[0].clientHeight;
                        if (Visual.settings.detailLabelSettings.show) {
                            lengthTextLabel = document.querySelectorAll(Visual.dotLiteral + Visual.textLabelLiteral).length;
                        }
                        if (Visual.settings.detailLabelSettings.show && this.visibilityTextLabel && lengthTextLabel > 0 && !isEllipses) {
                            var categoryTextHeight = Visual.getCategoryLabelHeight();
                            baseOftextLabel = options.viewport.height * Visual.DESTINATIONDATALABELRELATIVEHEIGHT - categoryTextHeight;
                            yAxisOfDestHeight = baseOftextLabel - destHeight;
                        }
                        else {
                            if (0 === destHeight) {
                                destHeight = categoryLabelHeight;
                            }
                            yAxisOfDestHeight = options.viewport.height * Visual.DESTINATIONDATALABELRELATIVEHEIGHT - categoryLabelHeight;
                            yAxisOfDestHeight = yAxisOfDestHeight - destHeight;
                            if (yAxisOfDestHeight + categoryLabelHeight > options.viewport.height * Visual.DESTINATIONDATALABELRELATIVEHEIGHT) {
                                yAxisOfDestHeight = options.viewport.height * Visual.DESTINATIONDATALABELRELATIVEHEIGHT - categoryLabelHeight;
                            }
                        }
                        return yAxisOfDestHeight;
                    };
                    // tslint:disable-next-line:no-any
                    Visual.calculateUpperMaxWidth = function (maxBaseWidth, viewModel) {
                        var sumOfSource = viewModel.sumOfSource;
                        var sumOfDestination = viewModel.sumOfDestination;
                        if (sumOfSource < sumOfDestination) {
                            maxBaseWidth = maxBaseWidth * (sumOfSource / sumOfDestination);
                        }
                        return maxBaseWidth;
                    };
                    // tslint:disable-next-line:no-any
                    Visual.calculateLowerMaxWidth = function (maxBaseWidth, viewModel) {
                        var sumOfSource = viewModel.sumOfSource;
                        var sumOfDestination = viewModel.sumOfDestination;
                        if (sumOfSource > sumOfDestination) {
                            maxBaseWidth = maxBaseWidth * (sumOfDestination / sumOfSource);
                        }
                        return maxBaseWidth;
                    };
                    Visual.calculatePercentage = function (numerator, denominator) {
                        return Math.round(numerator / denominator * 100) + Visual.pxLiteral;
                    };
                    Visual.GetTriangleUpPath = function (cX, cY, startX, height, base) {
                        // tslint:disable-next-line:prefer-template
                        return 'M' + cX + ' ' + cY
                            + ' L' + (startX) + ' ' + (cY - height)
                            + ' L' + (startX + base) + ' ' + (cY - height) + ' Z';
                    };
                    Visual.GetTriangleDownPath = function (cX, cY, startX, height, base) {
                        // tslint:disable-next-line:prefer-template
                        return 'M' + cX + ' ' + cY
                            + ' L' + (startX) + ' ' + (cY + height)
                            + ' L' + (startX + base) + ' ' + (cY + height) + ' Z';
                    };
                    Visual.GetSeparatorUpPath = function (cX, cY, startX, height, base) {
                        // tslint:disable-next-line:prefer-template
                        return 'M' + (startX + base) + ' ' + (cY - height)
                            + ' L' + cX + ' ' + cY;
                    };
                    Visual.GetSeparatorDownPath = function (cX, cY, startX, height, base) {
                        // tslint:disable-next-line:prefer-template
                        return 'M' + cX + ' ' + cY
                            + ' L' + (startX + base) + ' ' + (cY + height);
                    };
                    Visual.parseSettings = function (dataView) {
                        return saltPepperByMAQSoftware726F8878F79F4EF39D5005F1D06A8F1F.VisualSettings.parse(dataView);
                    };
                    /**
                     * This function gets called for each of the objects defined in the capabilities files and allows you to select which of the
                     * objects and properties you want to expose to the users in the property pane.
                     *
                     */
                    Visual.prototype.enumerateObjectInstances = function (options) {
                        var objectName = options.objectName;
                        var objectEnumeration = [];
                        switch (objectName) {
                            case 'colorSettings':
                                for (var _i = 0, _a = this.visualModel.dataPoints; _i < _a.length; _i++) {
                                    var visualDataPoint = _a[_i];
                                    objectEnumeration.push({
                                        objectName: objectName,
                                        displayName: visualDataPoint.category.toString(),
                                        properties: {
                                            color: visualDataPoint.color
                                        },
                                        selector: visualDataPoint.selectionId.getSelector()
                                    });
                                }
                                return objectEnumeration;
                            default:
                                return saltPepperByMAQSoftware726F8878F79F4EF39D5005F1D06A8F1F.VisualSettings.enumerateObjectInstances(Visual.settings || saltPepperByMAQSoftware726F8878F79F4EF39D5005F1D06A8F1F.VisualSettings.getDefault(), options);
                        }
                    };
                    // tslint:disable-next-line:no-any
                    Visual.prototype.getTooltipData = function (value, categoryName, sourceName, destinationName, conversionlabel, 
                        // tslint:disable-next-line:no-any
                        sumOfSource, sumOfDestination, dataPoints) {
                        var sourceCategory;
                        // tslint:disable-next-line:no-any
                        var sourceValue;
                        var sourceValueString;
                        var destinationCategory;
                        // tslint:disable-next-line:no-any
                        var destinationValue;
                        var destinationValueString;
                        // tslint:disable-next-line:no-any
                        var tooltipClass;
                        tooltipClass = event.target[Visual.classListLiteral][0];
                        if (tooltipClass.indexOf(Visual.upperTriLiteral) > -1) {
                            sourceCategory = sourceName;
                            sourceValue = value.source;
                            destinationCategory = destinationName;
                            destinationValue = value.destination;
                            sourceValueString = Visual.spaceLiteral + Visual.openBracketLiteral
                                + value.dataPercentageSource + Visual.closeBracketLiteral;
                            destinationValueString = Visual.spaceLiteral + Visual.openBracketLiteral
                                + value.dataPercentageDestination + Visual.closeBracketLiteral;
                        }
                        else if (tooltipClass.indexOf(Visual.lowerTriLiteral) > -1) {
                            sourceValue = value.destination;
                            sourceCategory = destinationName;
                            destinationCategory = sourceName;
                            destinationValue = value.source;
                            sourceValueString = Visual.spaceLiteral + Visual.openBracketLiteral
                                + value.dataPercentageDestination + Visual.closeBracketLiteral;
                            destinationValueString = Visual.spaceLiteral + Visual.openBracketLiteral
                                + value.dataPercentageSource + Visual.closeBracketLiteral;
                        }
                        if (sourceValue !== null && destinationValue !== null) {
                            var iValueSourceFormatter = ValueFormatter.create({
                                format: this.sourceFormat
                            });
                            var iValueDestinationFormatter = ValueFormatter.create({
                                format: this.destinationFormat
                            });
                            sourceValue = iValueSourceFormatter.format(sourceValue);
                            sourceValue += sourceValueString;
                            destinationValue = iValueDestinationFormatter.format(destinationValue);
                            destinationValue += destinationValueString;
                        }
                        if (sourceValue === '(Blank)undefined' || destinationValue === '(Blank)undefined') {
                            return null;
                        }
                        return [{
                                displayName: categoryName,
                                value: value.category.toString()
                            },
                            {
                                displayName: sourceCategory,
                                value: sourceValue
                            },
                            {
                                displayName: destinationCategory,
                                value: destinationValue
                            },
                            {
                                displayName: conversionlabel,
                                value: (Math.round(value.destination / value.source * 100)).toString() + Visual.percentageLiteral
                            }];
                    };
                    return Visual;
                }());
                Visual.visibilityTextLabel = true;
                // Constants
                Visual.MAXWIDTHRATIO = 0.7;
                Visual.SOURCEMEASURELABELRELATIVEHEIGHT = 0.053;
                Visual.DESTINATIONMEASURELABELRELATIVEHEIGHT = 0.873;
                Visual.MINCONVERSIONBOXWIDTH = 0.07;
                Visual.MINCONVERSIONBOXHEIGHT = 0.1;
                Visual.SOURCEDATALABELRELATIVEHEIGHT = 0.08;
                Visual.DESTINATIONDATALABELRELATIVEHEIGHT = 0.95;
                Visual.MAXLENGTHMEASURELABEL = 0.29;
                Visual.MAXWIDTHMEASURELABEL = 0.3;
                Visual.sourceStringLiteral = 'source';
                Visual.destinationStringLiteral = 'destination';
                Visual.percentageLiteral = '%';
                Visual.openBracketLiteral = '(';
                Visual.closeBracketLiteral = ')';
                Visual.pxLiteral = 'px';
                Visual.classListLiteral = 'classList';
                Visual.upperTriLiteral = 'upperTri';
                Visual.lowerTriLiteral = 'lowerTri';
                Visual.dotLiteral = '.';
                Visual.measureLabelDestLiteral = 'measureLabelDest';
                Visual.textLabelLiteral = 'textLabel';
                Visual.emptyString = '';
                Visual.measureLabelLiteral = 'measureLabel';
                Visual.percentageBgLiteral = 'percentageBg';
                Visual.conversionBoxLiteral = 'conversionBox';
                Visual.spaceLiteral = ' ';
                Visual.percentageValueLiteral = 'percentageValue';
                Visual.conversionValueLiteral = 'conversionValue';
                saltPepperByMAQSoftware726F8878F79F4EF39D5005F1D06A8F1F.Visual = Visual;
            })(saltPepperByMAQSoftware726F8878F79F4EF39D5005F1D06A8F1F = visual.saltPepperByMAQSoftware726F8878F79F4EF39D5005F1D06A8F1F || (visual.saltPepperByMAQSoftware726F8878F79F4EF39D5005F1D06A8F1F = {}));
        })(visual = extensibility.visual || (extensibility.visual = {}));
    })(extensibility = powerbi.extensibility || (powerbi.extensibility = {}));
})(powerbi || (powerbi = {}));
var powerbi;
(function (powerbi) {
    var visuals;
    (function (visuals) {
        var plugins;
        (function (plugins) {
            plugins.saltPepperByMAQSoftware726F8878F79F4EF39D5005F1D06A8F1F_DEBUG = {
                name: 'saltPepperByMAQSoftware726F8878F79F4EF39D5005F1D06A8F1F_DEBUG',
                displayName: 'SaltPepperByMAQSoftware',
                class: 'Visual',
                version: '1.0.0',
                apiVersion: '1.11.0',
                create: function (options) { return new powerbi.extensibility.visual.saltPepperByMAQSoftware726F8878F79F4EF39D5005F1D06A8F1F.Visual(options); },
                custom: true
            };
        })(plugins = visuals.plugins || (visuals.plugins = {}));
    })(visuals = powerbi.visuals || (powerbi.visuals = {}));
})(powerbi || (powerbi = {}));
//# sourceMappingURL=visual.js.map