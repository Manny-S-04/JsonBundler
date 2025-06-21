# JSON Compiler

# What it attempts to solve :
- Aims to simplify huge json by allowing the ability to import json files into a main json object

for example

```
main.jsonc:
{
    "@import" : "./user.json"
    "@import" : "./location.json"
}

user.json:
{
    "name" : "example"
}

location.json:
{
    "location" : {
        "street" : "street",
        "door_number" : 5
    }
}
```

will compile to

```
{
    "name" : "example",
    "location" : 
    {
        "street" : "street",
        "door_number" : 5
    }
}
```
1. custom parser parses the jsonc (starts an in memory main json)
2. finds any '@import' and attempts to find the relative file path json file
3. if fail then throw error
4. else import json into memory and validate
5. if invalid json then stop
6. else add to in memory json
7. do until EOF and finally validate main json
8. write to new file output.json (subject to -o name)
