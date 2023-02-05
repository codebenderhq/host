module default {
    type Bye {
        required property name -> str;
        property description -> str;
        property price -> float64;
        property metadata -> json;
        link brand -> Brand;
    }

    type Brand {
        required property name -> str {
            constraint exclusive;
        }
        property industry -> str;
        property type -> str;
        property phone_number -> int64;
        property founder -> str;
        property team -> json;
        property metadata -> json;
        multi link bye := .<brand[is Bye];
        multi link receipts := .<to[is Receipt];
    }

    type Receipt{
        property total -> float64;
        property items -> json;
        link to -> Brand;
        property from -> str;
        property paid -> bool;
        property metadata -> json;
    }
}
