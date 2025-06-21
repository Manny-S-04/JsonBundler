"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.lexer = lexer;
exports.parser = parser;
function lexer(input) {
    var tokens = [];
    var pos = 0;
    function skipWhitespace() {
        while (/\s/.test(input[pos]))
            pos++;
    }
    while (pos < input.length) {
        skipWhitespace();
        var char = input[pos];
        switch (char) {
            case '{':
                tokens.push({ type: "brace_open" });
                pos++;
                break;
            case '}':
                tokens.push({ type: "brace_close" });
                pos++;
                break;
            case '[':
                tokens.push({ type: "bracket_open" });
                pos++;
                break;
            case ']':
                tokens.push({ type: "bracket_close" });
                pos++;
                break;
            case ':':
                tokens.push({ type: "colon" });
                pos++;
                break;
            case ',':
                tokens.push({ type: "comma" });
                pos++;
                break;
            case '"': {
                pos++;
                var result = "";
                while (pos < input.length) {
                    var ch = input[pos];
                    if (ch === '"') {
                        pos++;
                        if (result === "--@import") {
                            tokens.push({ type: "import", value: result });
                            break;
                        }
                        tokens.push({ type: "string", value: result });
                        break;
                    }
                    if (ch === '\\') {
                        pos++;
                        var next = input[pos];
                        if (next === undefined) {
                            throw new Error("Invalid escape at end of input");
                        }
                        result += next;
                    }
                    else {
                        result += ch;
                    }
                    pos++;
                }
                if (input[pos - 1] !== '"') {
                    throw new Error("Unterminated string starting at position ".concat(pos));
                }
                break;
            }
            default:
                if (char === '-' || isDigit(char)) {
                    var start = pos;
                    while (pos < input.length && isNumberChar(input[pos]))
                        pos++;
                    var num = parseFloat(input.slice(start, pos));
                    tokens.push({ type: "number", value: num });
                }
                else if (input.startsWith("true", pos)) {
                    tokens.push({ type: "boolean", value: true });
                    pos += 4;
                }
                else if (input.startsWith("false", pos)) {
                    tokens.push({ type: "boolean", value: false });
                    pos += 5;
                }
                else if (input.startsWith("null", pos)) {
                    tokens.push({ type: "null" });
                    pos += 4;
                }
                else {
                    throw new Error("Unexpected character at position ".concat(pos, ": ").concat(char));
                }
        }
    }
    return tokens;
}
function parser(tokens) {
    var pos = 0;
    function peek() {
        return tokens[pos];
    }
    function consume(expectedType) {
        var token = tokens[pos++];
        if (expectedType && token.type !== expectedType) {
            throw new Error("Expected token type ".concat(expectedType, " but got ").concat(token.type));
        }
        return token;
    }
    function parseValue() {
        var token = peek();
        switch (token.type) {
            case "import":
                return consume().value;
            case "string":
                return consume().value;
            case "number":
                return consume().value;
            case "boolean":
                return consume().value;
            case "null":
                consume("null");
                return null;
            case "brace_open":
                return parseObject();
            case "bracket_open":
                return parseArray();
            default:
                throw new Error("Unexpected token at position ".concat(pos, ": ").concat(token.type));
        }
    }
    function parseObject() {
        var obj = {};
        consume("brace_open");
        if (peek().type === "brace_close") {
            consume("brace_close");
            return obj;
        }
        while (true) {
            var keyToken;
            var isImport = false;
            try {
                keyToken = consume("string");
            }
            catch (_a) {
                pos--;
                keyToken = consume("import");
                isImport = true;
            }
            consume("colon");
            var value = parseValue();
            obj[isImport ? "".concat(keyToken.value, "__").concat(pos) : keyToken.value] = value;
            if (peek().type === "comma") {
                consume("comma");
            }
            else {
                break;
            }
        }
        consume("brace_close");
        return obj;
    }
    function parseArray() {
        var arr = [];
        consume("bracket_open");
        if (peek().type === "bracket_close") {
            consume("bracket_close");
            return arr;
        }
        while (true) {
            arr.push(parseValue());
            if (peek().type === "comma") {
                consume("comma");
            }
            else {
                break;
            }
        }
        consume("bracket_close");
        return arr;
    }
    var result = parseValue();
    if (pos !== tokens.length) {
        throw new Error("Unexpected trailing tokens at position ".concat(pos));
    }
    return result;
}
function isDigit(ch) {
    return ch >= '0' && ch <= '9';
}
function isNumberChar(ch) {
    return isDigit(ch) || ch === '-' || ch === '+' || ch === '.' || ch === 'e' || ch === 'E';
}
