CREATE MIGRATION m1gnop2srkputpx6laet36jejfgxow3sevpl6dbgpdg5r5owsqef7q
    ONTO m1mdvizejpbcwk7y65f2exslex5th3eoei6jbst4hxxk6zqxna5xpa
{
  ALTER TYPE default::Receipt {
      CREATE PROPERTY ref -> std::str {
          CREATE CONSTRAINT std::exclusive;
      };
  };
};
