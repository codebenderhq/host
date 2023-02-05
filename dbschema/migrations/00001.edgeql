CREATE MIGRATION m1qhs5mbtftdy4qpphkvfz4e2ynutc3habejxspnbsqqi6ingfa2ua
    ONTO initial
{
  CREATE FUTURE nonrecursive_access_policies;
  CREATE TYPE default::Bye {
      CREATE PROPERTY description -> std::str;
      CREATE PROPERTY metadata -> std::json;
      CREATE PROPERTY name -> std::str;
      CREATE PROPERTY price -> std::float64;
  };
};
