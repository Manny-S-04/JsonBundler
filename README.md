You just need the json-bundler.js file to use the application

# JSON bundler

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

will bundle to

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

