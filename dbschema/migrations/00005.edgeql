CREATE MIGRATION m1ubmx6hzfmgm435zltxoyhq3n2ivcqrxlixscgpmnyy5aap4bp6ba
    ONTO m1ht7uey3lz7d4wwlm6opzpamnqjt33vk372rfny4n7ocphhb4nraa
{
  ALTER TYPE default::Brand {
      ALTER PROPERTY name {
          CREATE CONSTRAINT std::exclusive;
      };
  };
};
