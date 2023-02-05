CREATE MIGRATION m1ht7uey3lz7d4wwlm6opzpamnqjt33vk372rfny4n7ocphhb4nraa
    ONTO m1w2qzzaj3vpecl2gfwpr6rdob5tju7co4gge7lz7xzegudup2nodq
{
  ALTER TYPE default::Brand {
      ALTER PROPERTY number {
          SET TYPE std::int64;
      };
  };
};
