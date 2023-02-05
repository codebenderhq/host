CREATE MIGRATION m14kw23cjqhladsuamjsvkohisddzlwspeishjybnfp2fsgpf3ekxq
    ONTO m1pdndc6jfo5sp3qrb4qerx4otlbt57rhb2bw2bk7pgklqlucbhmmq
{
  CREATE TYPE default::Receipt {
      CREATE LINK to -> default::Brand;
      CREATE PROPERTY from -> std::str;
      CREATE PROPERTY items -> std::json;
      CREATE PROPERTY metadata -> std::json;
      CREATE PROPERTY paid -> std::bool;
      CREATE PROPERTY total -> std::float64;
  };
};
