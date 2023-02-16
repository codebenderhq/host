CREATE MIGRATION m1mdvizejpbcwk7y65f2exslex5th3eoei6jbst4hxxk6zqxna5xpa
    ONTO m1kwvauyre4ovryd77ogbxndtg4lw5igdjnpjzbk26kikawhpxj6xa
{
  CREATE TYPE default::User {
      CREATE PROPERTY auth -> std::str;
      CREATE REQUIRED PROPERTY email -> std::str {
          CREATE CONSTRAINT std::exclusive;
      };
      CREATE REQUIRED PROPERTY name -> std::str;
  };
};
