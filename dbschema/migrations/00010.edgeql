CREATE MIGRATION m1kokvvoekacvcpoadrd3gn5jz6jn7eh2cige55cccbywrz32pbjca
    ONTO m14kw23cjqhladsuamjsvkohisddzlwspeishjybnfp2fsgpf3ekxq
{
  ALTER TYPE default::Brand {
      CREATE MULTI LINK bye := (.<brand[IS default::Bye]);
  };
};
