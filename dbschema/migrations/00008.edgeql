CREATE MIGRATION m1pdndc6jfo5sp3qrb4qerx4otlbt57rhb2bw2bk7pgklqlucbhmmq
    ONTO m1gwfgn5kwbysj5mat4nqtlo3nkl5tvjgssrabzcvkkg5sxfqwdz3a
{
  ALTER TYPE default::Brand {
      CREATE PROPERTY type -> std::str;
  };
};
