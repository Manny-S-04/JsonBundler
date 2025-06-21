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

