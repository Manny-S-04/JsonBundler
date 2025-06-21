export type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | { [key: string]: JsonValue };

export type Token =
  | { type: "brace_open" }
  | { type: "brace_close" }
  | { type: "bracket_open" }
  | { type: "bracket_close" }
  | { type: "colon" }
  | { type: "comma" }
  | { type: "string"; value: string }
  | { type: "number"; value: number }
  | { type: "boolean"; value: boolean }
  | { type: "null" }
  | { type: "import"; value: string }

export function lexer(input: string): Token[] {
  const tokens: Token[] = [];
  let pos = 0;

  function skipWhitespace() {
    while (/\s/.test(input[pos])) pos++;
  }

  while (pos < input.length) {
    skipWhitespace();
    const char = input[pos];

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
          let result = "";
          while (pos < input.length) {
            const ch = input[pos];
            if (ch === '"') {
              pos++; 
              if(result === "--@import"){
                  tokens.push({ type: "import", value: result });
                  break;
              }
              tokens.push({ type: "string", value: result });
              break;
            }

            if (ch === '\\') {
              pos++;
              const next = input[pos];
              if (next === undefined) {
                throw new Error(`Invalid escape at end of input`);
              }
              result += next;
            } else {
              result += ch;
            }

            pos++;
          }
          if (input[pos - 1] !== '"') {
            throw new Error(`Unterminated string starting at position ${pos}`);
          }

          break;
        }
      default:
        if (char === '-' || isDigit(char)) {
          let start = pos;
          while (pos < input.length && isNumberChar(input[pos])) pos++;
          const num = parseFloat(input.slice(start, pos));
          tokens.push({ type: "number", value: num });
        } else if (input.startsWith("true", pos)) {
          tokens.push({ type: "boolean", value: true });
          pos += 4;
        } else if (input.startsWith("false", pos)) {
          tokens.push({ type: "boolean", value: false });
          pos += 5;
        } else if (input.startsWith("null", pos)) {
          tokens.push({ type: "null" });
          pos += 4;
        } else {
          throw new Error(`Unexpected character at position ${pos}: ${char}`);
        }
    }
  }

  return tokens;
}

export function parser(tokens: Token[]): JsonValue {
  let pos = 0;

  function peek(): Token {
    return tokens[pos];
  }

  function consume(expectedType?: Token["type"]): Token {
    const token = tokens[pos++];
    if (expectedType && token.type !== expectedType) {
      throw new Error(`Expected token type ${expectedType} but got ${token.type}`);
    }
    return token;
  }

  function parseValue(): JsonValue {
    const token = peek();
    switch (token.type) {
        case "import":
            return(consume() as { type: "import"; value: string }).value;
        case "string":
            return (consume() as { type: "string"; value: string }).value;
        case "number":
            return (consume() as { type: "number"; value: number }).value;
        case "boolean":
            return (consume() as { type: "boolean"; value: boolean }).value;
        case "null":
            consume("null");
            return null;
        case "brace_open":
            return parseObject();
        case "bracket_open":
            return parseArray();
        default:
            throw new Error(`Unexpected token at position ${pos}: ${token.type}`);
    }
  }

  function parseObject(): JsonValue {
    const obj: { [key: string]: JsonValue } = {};
    consume("brace_open");

    if (peek().type === "brace_close") {
      consume("brace_close");
      return obj;
    }

    while (true) {
        var keyToken: Token
        var isImport = false;
        try{
            keyToken = consume("string") as { type: "string"; value: string };
        } catch{
            pos--;
            keyToken = consume("import") as { type: "import"; value: string };
            isImport = true;
        }
      consume("colon");
      const value = parseValue();
      obj[isImport ? `${keyToken.value}__${pos}` : keyToken.value] = value;

      if (peek().type === "comma") {
        consume("comma");
      } else {
        break;
      }
    }

    consume("brace_close");
    return obj;
  }

  function parseArray(): JsonValue {
    const arr: JsonValue[] = [];
    consume("bracket_open");

    if (peek().type === "bracket_close") {
      consume("bracket_close");
      return arr;
    }

    while (true) {
      arr.push(parseValue());

      if (peek().type === "comma") {
        consume("comma");
      } else {
        break;
      }
    }

    consume("bracket_close");
    return arr;
  }

  const result = parseValue();

  if (pos !== tokens.length) {
    throw new Error(`Unexpected trailing tokens at position ${pos}`);
  }

  return result;
}

function isDigit(ch: string): boolean {
  return ch >= '0' && ch <= '9';
}

function isNumberChar(ch: string): boolean {
  return isDigit(ch) || ch === '-' || ch === '+' || ch === '.' || ch === 'e' || ch === 'E';
}
