module default {
    type Bye {
        required property name -> str;
        property description -> str;
        property price -> float64;
        property metadata -> json;
    }
}
