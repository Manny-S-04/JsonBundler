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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var json_parser_1 = require("./parsers/json-parser");
var fs = require('node:fs');
function compile(jsonInput) {
    return __awaiter(this, void 0, void 0, function () {
        var tokens, mainJson, keys, newObj, _i, keys_1, k, filePath, fileStream, json, parsedJson, newKeys, replaceObj, _a, _b, _c, _d, key, embeddedfilePath, embeddedfs, importJson, embeddedJson, embeddedKeys, embeddedObj, _e, embeddedKeys_1, ek;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    tokens = (0, json_parser_1.lexer)(jsonInput.replace(/\s+/g, "").trim());
                    mainJson = (0, json_parser_1.parser)(tokens);
                    if (!isJObject(mainJson)) {
                        throw new Error("Parsed JSON is not a JSON object.");
                    }
                    keys = Object.keys(mainJson);
                    newObj = __assign({}, mainJson);
                    _i = 0, keys_1 = keys;
                    _f.label = 1;
                case 1:
                    if (!(_i < keys_1.length)) return [3 /*break*/, 9];
                    k = keys_1[_i];
                    if (!(k.includes("--@import") && mainJson[k])) return [3 /*break*/, 8];
                    filePath = mainJson[k].toString();
                    fileStream = fs.createReadStream(filePath, { encoding: 'utf8' });
                    return [4 /*yield*/, readFile(fileStream)];
                case 2:
                    json = _f.sent();
                    if (!json) {
                        console.error("Failed to read json file: ".concat(k));
                        return [3 /*break*/, 8];
                    }
                    parsedJson = (0, json_parser_1.parser)((0, json_parser_1.lexer)(json));
                    if (!parsedJson) {
                        console.error("Failed to parse json file: ".concat(k));
                        return [3 /*break*/, 8];
                    }
                    newKeys = Object.keys(parsedJson);
                    replaceObj = {};
                    delete newObj[k];
                    _a = newKeys;
                    _b = [];
                    for (_c in _a)
                        _b.push(_c);
                    _d = 0;
                    _f.label = 3;
                case 3:
                    if (!(_d < _b.length)) return [3 /*break*/, 8];
                    _c = _b[_d];
                    if (!(_c in _a)) return [3 /*break*/, 7];
                    key = _c;
                    if (!newKeys[key].includes("--@import")) return [3 /*break*/, 6];
                    embeddedfilePath = parsedJson[newKeys[key]].toString();
                    embeddedfs = fs.createReadStream(embeddedfilePath, { encoding: 'utf8' });
                    return [4 /*yield*/, readFile(embeddedfs)];
                case 4:
                    importJson = _f.sent();
                    if (!importJson) {
                        console.error("Failed to read jsonc file: ".concat(parsedJson[newKeys[key]]));
                        return [3 /*break*/, 7];
                    }
                    return [4 /*yield*/, compile(importJson)];
                case 5:
                    embeddedJson = _f.sent();
                    if (!embeddedJson) {
                        console.error("Invalid recursive json import");
                        return [2 /*return*/, null];
                    }
                    embeddedKeys = Object.keys(embeddedJson);
                    embeddedObj = {};
                    for (_e = 0, embeddedKeys_1 = embeddedKeys; _e < embeddedKeys_1.length; _e++) {
                        ek = embeddedKeys_1[_e];
                        newObj = renameKeys(newObj, embeddedObj);
                        newObj[ek] = embeddedJson[ek];
                    }
                    return [3 /*break*/, 7];
                case 6:
                    newObj = renameKeys(newObj, replaceObj);
                    newObj[newKeys[key]] = parsedJson[newKeys[key]];
                    _f.label = 7;
                case 7:
                    _d++;
                    return [3 /*break*/, 3];
                case 8:
                    _i++;
                    return [3 /*break*/, 1];
                case 9: return [2 /*return*/, newObj];
            }
        });
    });
}
function readFile(f) {
    return __awaiter(this, void 0, void 0, function () {
        var b, e_1_1, err_1;
        var _a, f_1, f_1_1;
        var _b, e_1, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    _e.trys.push([0, 13, , 14]);
                    _e.label = 1;
                case 1:
                    _e.trys.push([1, 6, 7, 12]);
                    _a = true, f_1 = __asyncValues(f);
                    _e.label = 2;
                case 2: return [4 /*yield*/, f_1.next()];
                case 3:
                    if (!(f_1_1 = _e.sent(), _b = f_1_1.done, !_b)) return [3 /*break*/, 5];
                    _d = f_1_1.value;
                    _a = false;
                    b = _d;
                    return [2 /*return*/, b.replace(/\s+/g, "")];
                case 4:
                    _a = true;
                    return [3 /*break*/, 2];
                case 5: return [3 /*break*/, 12];
                case 6:
                    e_1_1 = _e.sent();
                    e_1 = { error: e_1_1 };
                    return [3 /*break*/, 12];
                case 7:
                    _e.trys.push([7, , 10, 11]);
                    if (!(!_a && !_b && (_c = f_1.return))) return [3 /*break*/, 9];
                    return [4 /*yield*/, _c.call(f_1)];
                case 8:
                    _e.sent();
                    _e.label = 9;
                case 9: return [3 /*break*/, 11];
                case 10:
                    if (e_1) throw e_1.error;
                    return [7 /*endfinally*/];
                case 11: return [7 /*endfinally*/];
                case 12: return [3 /*break*/, 14];
                case 13:
                    err_1 = _e.sent();
                    console.error(err_1);
                    return [3 /*break*/, 14];
                case 14: return [2 /*return*/];
            }
        });
    });
}
function renameKeys(obj, newKeys) {
    var keyValues = Object.keys(obj).map(function (key) {
        var _a;
        var newKey = newKeys[key] || key;
        return _a = {}, _a[newKey] = obj[key], _a;
    });
    return Object.assign.apply(Object, __spreadArray([{}], keyValues, false));
}
function isJObject(value) {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
}
(function () { return __awaiter(void 0, void 0, void 0, function () {
    var args, outputFile, inputFile, i, err_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                args = process.argv.slice(2);
                outputFile = "";
                inputFile = "";
                for (i = 0; i < args.length; i++) {
                    switch (args[i]) {
                        case "-h":
                        case "--help":
                            console.log("Flags:\n");
                            console.log("-i : Input file must be .jsonc");
                            console.log("Use the '--@import' key and a 'module.json' value to import module.json in the same place as '--@import'");
                            console.log("Since json does not support duplicate keys be careful of duplicate keys across modules\n");
                            console.log("-o : Output file must be .json");
                            return [2 /*return*/];
                        case "-i":
                            if (!args[i + 1]) {
                                console.error("Invalid input file");
                            }
                            inputFile = args[i + 1];
                            i++;
                            break;
                        case "-o":
                            if (!args[i + 1]) {
                                console.error("Invalid output file");
                            }
                            outputFile = args[i + 1];
                            i++;
                            break;
                        default:
                            break;
                    }
                }
                if (!inputFile || !inputFile.includes(".jsonc") || inputFile.length === 0) {
                    console.error('Please provide a file path as an argument.');
                    process.exit(1);
                }
                if (!outputFile || !outputFile.includes(".json")) {
                    console.error('Error: No output file specified. Use -o <filename>');
                    process.exit(1);
                }
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, fs.readFile(inputFile, 'utf8', function (err, data) { return __awaiter(void 0, void 0, void 0, function () {
                        var mainjson;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    if (err !== null) {
                                        console.error(err);
                                        return [2 /*return*/];
                                    }
                                    return [4 /*yield*/, compile(data)];
                                case 1:
                                    mainjson = _a.sent();
                                    return [4 /*yield*/, fs.writeFile(outputFile, JSON.stringify(mainjson, null, 2), function (err) {
                                            if (err !== null) {
                                                console.error(err);
                                                return;
                                            }
                                        })];
                                case 2:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
            case 2:
                _a.sent();
                return [3 /*break*/, 4];
            case 3:
                err_2 = _a.sent();
                console.error(err_2);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); })();
