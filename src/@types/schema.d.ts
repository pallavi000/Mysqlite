export type TColumnType = typeof String | typeof Number | typeof Boolean;

export type TSqlType = "VARCHAR(255)" | "INT(11)" | "BOOLEAN";

export type TColumn = {
  type: TColumnType;
  required?: Boolean;
  unique?: Boolean;
  default?: String | Number | Boolean;
};

export type TSchema = {
  [key: string]: TColumn;
};

export type TConnection = {
  host: string;
  user: string;
  database: string;
  port: number;
  password: string;
  synchronize: boolean;
};
