import { JsonValue, lexer, parser, Token } from "./parsers/json-parser";
const fs = require('node:fs');

async function compile(jsonInput: string) : Promise<JsonValue> {
    const tokens: Token[] = lexer(jsonInput.replace(/\s+/g, "").trim());
    const mainJson: JsonValue = parser(tokens);
    if (!isJObject(mainJson)) {
        throw new Error("Parsed JSON is not a JSON object.");
    }

    const keys = Object.keys(mainJson);
    let newObj: { [key: string]: JsonValue } = { ...mainJson };

    for (const k of keys) {
        if (k.includes("--@import") && mainJson[k]) {
            const filePath = mainJson[k].toString();
            const fileStream = fs.createReadStream(filePath, { encoding: 'utf8' });
            const json = await readFile(fileStream);
            if (!json) {
                console.error(`Failed to read json file: ${k}`);
                continue;
            }

            const parsedJson = parser(lexer(json));
            if (!parsedJson) {
                console.error(`Failed to parse json file: ${k}`);
                continue;
            }

            const newKeys = Object.keys(parsedJson);
            const replaceObj: { [key: string]: string } = {};

            delete newObj[k];
            for(const key in newKeys) {
                if(newKeys[key].includes("--@import")){
                    const embeddedfilePath = parsedJson[newKeys[key]].toString();
                    const embeddedfs = fs.createReadStream(embeddedfilePath, { encoding: 'utf8' });

                    const importJson = await readFile(embeddedfs);
                    if (!importJson) {
                        console.error(`Failed to read jsonc file: ${parsedJson[newKeys[key]]}`);
                        continue;
                    }

                    const embeddedJson = await compile(importJson);
                    if(!embeddedJson) {
                        console.error("Invalid recursive json import")
                        return null;
                    }
                    var embeddedKeys = Object.keys(embeddedJson);
                    var embeddedObj: { [key: string]: string } = {};

                    for(const ek of embeddedKeys){
                        newObj = renameKeys(newObj, embeddedObj);
                        newObj[ek] = embeddedJson[ek]; 
                    }

                    continue;
                }
                newObj = renameKeys(newObj, replaceObj);
                newObj[newKeys[key]] = parsedJson[newKeys[key]]; 
            }
        }
    }

    return newObj;
}

async function readFile(f:string){
    try{
        for await (const b of f){
           return b.replace(/\s+/g, "");
        }
    } catch (err){
        console.error(err);
    }
}

function renameKeys(obj: Object, newKeys:Object) {
  const keyValues = Object.keys(obj).map(key => {
    const newKey = newKeys[key] || key;
    return { [newKey]: obj[key] };
  });
  return Object.assign({}, ...keyValues);
}

function isJObject(value: JsonValue): value is { [key: string]: JsonValue } {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
}

(async () => {
    const args = process.argv.slice(2);
    let outputFile : string = ""; 
    let inputFile : string = "";

    for (let i = 0; i < args.length; i++) {
        switch (args[i]) {
            case "-h":
            case "--help":
                console.log("Flags:\n");
                console.log("-i : Input file must be .jsonc");
                console.log("Use the '--@import' key and a 'module.json' value to import module.json in the same place as '--@import'");
                console.log("Since json does not support duplicate keys be careful of duplicate keys across modules\n");
                console.log("-o : Output file must be .json");
                return;

            case "-i":
                if(!args[i + 1]) { console.error("Invalid input file"); }
                inputFile = args[i + 1];
                i++;
                break;
            case "-o":
                if(!args[i + 1]) { console.error("Invalid output file"); }
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
    try {
        await fs.readFile(inputFile, 'utf8', async (err:Error,data:string) => {
            if(err !== null){
                console.error(err);
                return;
            }
            const mainjson = await compile(data);
            await fs.writeFile(outputFile, JSON.stringify(mainjson, null, 2), (err:Error) => {
                if(err !== null){
                    console.error(err);
                    return;
                }
            });
        });
    } catch (err) {
        console.error(err);
    }
})();
