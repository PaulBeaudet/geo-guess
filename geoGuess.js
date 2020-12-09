"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
exports.__esModule = true;
exports.lambdaHandler = exports.geoGuess = void 0;
// geoGuess.js Copyright 2020 Paul Beaudet MIT Licence
var fs = require("fs");
var readline = require("readline");
var GeoPoint = require("geopoint");
var constants_1 = require("./constants");
// returns sorted list of guesses based on population
var popConfidence = function (results) {
    if (results.length === 1) {
        return [__assign(__assign({}, results[0]), { score: 0.9 })];
    }
    if (!results.length) {
        return [];
    }
    results = results.map(function (results) {
        return __assign(__assign({}, results), { pop: results.pop });
    });
    results.sort(function (a, b) {
        if (a.pop > b.pop) {
            return -1;
        }
        if (a.pop < b.pop) {
            return 1;
        }
        return 0;
    });
    results = results.map(function (result, index) {
        var score = index ? result.pop / results[0].pop : 0.9;
        return __assign(__assign({}, result), { score: Number(score.toFixed(2)) });
    });
    return results;
};
// returns sorted list of guesses based on location
var geoConfidence = function (results, lat, long) {
    if (results.length === 1) {
        return [__assign(__assign({}, results[0]), { score: 0.9 })];
    }
    if (!results.length) {
        return [];
    }
    var userPoint = new GeoPoint(lat, long, false);
    var distArray = results.map(function (result) {
        var guessPoint = new GeoPoint(result.lat, result.long, false);
        return __assign(__assign({}, result), { dist: userPoint.distanceTo(guessPoint, false) });
    });
    distArray.sort(function (a, b) {
        if (a.dist < b.dist) {
            return -1;
        }
        if (a.dist > b.dist) {
            return 1;
        }
        return 0;
    });
    var furthestDist = distArray[distArray.length - 1].dist;
    var shortestDist = distArray[0].dist;
    var score = 0.99;
    if (shortestDist) {
        score = shortestDist / furthestDist - 1;
        score = Math.abs(Number(score.toFixed(2)));
    }
    var newResults = [__assign(__assign({}, distArray[0]), { score: score })];
    // for everything in between, if there is any
    for (var i = 1; i < distArray.length - 1; i++) {
        score = distArray[i].dist / furthestDist - 1;
        score = Math.abs(Number(score.toFixed(2)));
        newResults.push(__assign(__assign({}, distArray[i]), { score: score }));
    }
    score = shortestDist ? shortestDist / furthestDist : 0.01;
    score = Math.abs(Number(score.toFixed(2)));
    newResults.push(__assign(__assign({}, distArray[distArray.length - 1]), { score: score }));
    return newResults;
};
// returns json that incudes array of guesses
var geoGuess = function (resultCb, query, lat, long) {
    if (lat === void 0) { lat = null; }
    if (long === void 0) { long = null; }
    var suggestions = [];
    if (!query) {
        resultCb({ results: suggestions });
        return;
    }
    var lowerQuery = query.toLowerCase();
    var regex = new RegExp(lowerQuery, 'g');
    var lineStream = readline.createInterface({
        input: fs.createReadStream(constants_1.citiesFileLocation),
        output: process.stdout,
        terminal: false
    });
    var found = false;
    var stopStream = false;
    var lineCount = 0;
    var onEnd = function () {
        if (found) {
            stopStream = true;
            lineStream.close();
            if (lat && long) {
                suggestions = geoConfidence(suggestions, Number(lat), Number(long));
            }
            else {
                suggestions = popConfidence(suggestions);
            }
            suggestions = suggestions.map(function (result) {
                delete result.pop;
                delete result.dist;
                return result;
            });
            resultCb({
                results: suggestions
            });
        }
    };
    lineStream.on('line', function (line) {
        // don't do anything until we are in the ballpark
        if (lineCount < constants_1.tsvIndex[lowerQuery[0]]) {
            lineCount++;
            return;
        }
        if (stopStream) {
            return;
        }
        var tabSep = line.split('\t');
        var name = tabSep[constants_1.tsvKey.ascii];
        var lowerName = name.toLowerCase();
        if (lowerName.search(regex) === 0) {
            suggestions.push({
                name: name,
                uniqueName: name + " " + tabSep[constants_1.tsvKey.a1] + " " + tabSep[constants_1.tsvKey.country],
                lat: Number(tabSep[constants_1.tsvKey.lat]),
                long: Number(tabSep[constants_1.tsvKey.long]),
                score: 0.01,
                pop: Number(tabSep[constants_1.tsvKey.population])
            });
            found = true;
        }
        else {
            // last match found last line
            onEnd();
        }
    });
    lineStream.on('close', function () {
        if (!found) {
            resultCb({ results: suggestions });
        }
        else if (lowerQuery[0] === 'z') {
            onEnd();
        }
    });
};
exports.geoGuess = geoGuess;
var lambdaHandler = function (event, context, callback) {
    var response = {
        statusCode: 200,
        headers: {
            'Content-type': 'application/json'
        },
        body: ''
    };
    if (!event.queryStringParameters) {
        response.body = 'no query';
        callback(null, response);
    }
    var _a = event.queryStringParameters, q = _a.q, latitude = _a.latitude, longitude = _a.longitude;
    var query = q;
    var lat = latitude ? latitude : null;
    var long = longitude ? longitude : null;
    geoGuess(function (results) {
        response.body = JSON.stringify(results);
        callback(null, response);
    }, query, lat, long);
};
exports.lambdaHandler = lambdaHandler;
