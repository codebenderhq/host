CREATE MIGRATION m1gwfgn5kwbysj5mat4nqtlo3nkl5tvjgssrabzcvkkg5sxfqwdz3a
    ONTO m1szjq3o24zpy7h5jz5l3mwzc5vbvzsw7vi2xcjbl57fhqbcud6xka
{
  ALTER TYPE default::Brand {
      ALTER PROPERTY number {
          RENAME TO phone_number;
      };
  };
};
