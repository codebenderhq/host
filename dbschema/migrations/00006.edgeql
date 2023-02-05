CREATE MIGRATION m1szjq3o24zpy7h5jz5l3mwzc5vbvzsw7vi2xcjbl57fhqbcud6xka
    ONTO m1ubmx6hzfmgm435zltxoyhq3n2ivcqrxlixscgpmnyy5aap4bp6ba
{
  ALTER TYPE default::Brand {
      CREATE PROPERTY metadata -> std::json;
  };
};
