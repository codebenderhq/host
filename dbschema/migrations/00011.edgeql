CREATE MIGRATION m1kwvauyre4ovryd77ogbxndtg4lw5igdjnpjzbk26kikawhpxj6xa
    ONTO m1kokvvoekacvcpoadrd3gn5jz6jn7eh2cige55cccbywrz32pbjca
{
  ALTER TYPE default::Brand {
      CREATE MULTI LINK receipts := (.<to[IS default::Receipt]);
  };
};
