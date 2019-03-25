// doesn't flatten
function printCSV(cursor) {
    var headers = []


    while(cursor.hasNext()) {
        var flatRow = {};
        eachFlattenedProperty(cursor.next(), (key, value) => {
            flatRow[key] = value;
            if (headers.indexOf(key) == -1) {
                headers.push(key)
            }
        })
        var columns = headers.map(flatKey => flatRow[flatKey]).map(formatValue)
        print(columns.join(','))
    }
    print(headers.join(','))
}

function formatValue(value) {
    if (value == null) return '';
    return JSON.stringify(value)
}

function eachFlattenedProperty(obj, fn, opt = {prefix: '', pathSep: '.' }) {
    Object.getOwnPropertyNames(obj).forEach(nm => {
        var fullName = opt.prefix + nm;
        var val = obj[nm];
        if (Array.isArray(val)) {
            val = JSON.stringify(val)
        }
        if (val != null && typeof val == 'object') {
            eachFlattenedProperty(val, fn, { prefix: fullName + opt.pathSep, pathSep: opt.pathSep })
        }
        else {
            fn(fullName, val)
        }
    })
}

/*
DBQuery.prototype.toCSV = function(deliminator, textQualifier)
{
    var count = -1;
    var headers = [];
    var data = {};

    var cursor = this;

    deliminator = deliminator == null ? ',' : deliminator;
    textQualifier = textQualifier == null ? '\"' : textQualifier;

    while (cursor.hasNext()) {

        var array = new Array(cursor.next());

        count++;

        for (var index in array[0]) {
            if (headers.indexOf(index) == -1) {
                headers.push(index);
            }
        }

        for (var i = 0; i < array.length; i++) {
            for (var index in array[i]) {
                data[count + '_' + index] = array[i][index];
            }
        }
    }

    var line = '';

    for (var index in headers) {
        line += headers[index] + ',';
    }

    line = line.slice(0, -1);
    print(line);

    for (var i = 0; i < count + 1; i++) {

        var line = '';
        var cell = '';
        for (var j = 0; j < headers.length; j++) {
            cell = data[i + '_' + headers[j]];
            if (cell == undefined) cell = '';
            line += textQualifier + cell + textQualifier + deliminator;
        }

        line = line.slice(0, -1);
        print(line);
    }
}
*/
