CREATE MIGRATION m1w2qzzaj3vpecl2gfwpr6rdob5tju7co4gge7lz7xzegudup2nodq
    ONTO m1aumjsv3b5yaimomikwnuzfzdzqarpynzladavwbnxt7pv3vencfa
{
  CREATE TYPE default::Brand {
      CREATE PROPERTY founder -> std::str;
      CREATE PROPERTY industry -> std::str;
      CREATE REQUIRED PROPERTY name -> std::str;
      CREATE PROPERTY number -> std::int16;
      CREATE PROPERTY team -> std::json;
  };
  ALTER TYPE default::Bye {
      CREATE LINK brand -> default::Brand;
  };
};
