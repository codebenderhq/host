CREATE MIGRATION m1aumjsv3b5yaimomikwnuzfzdzqarpynzladavwbnxt7pv3vencfa
    ONTO m1qhs5mbtftdy4qpphkvfz4e2ynutc3habejxspnbsqqi6ingfa2ua
{
  ALTER TYPE default::Bye {
      ALTER PROPERTY name {
          SET REQUIRED USING ('Demo');
      };
  };
};
