import {
  TColumn,
  TColumnType,
  TConnection,
  TSchema,
  TSqlType,
} from "./@types/schema";
import { plural } from "pluralize";
import mysql from "mysql2/promise";
import { SQLQuery } from "./query";

class MySql {
  static connection: any;
  static mySqlConfig: TConnection;

  static Schema(column: TSchema): string {
    let columnDefinitions: string[] = [];
    const keys = Object.keys(column);
    keys.forEach((key) => {
      columnDefinitions.push(
        `${key} ${this.generateSqlDataType(key, column?.[key])}`
      );
    });
    const columns = columnDefinitions.join(",");
    return columns;
  }

  static async connect(config: TConnection) {
    try {
      this.mySqlConfig = config;
      const { synchronize, ...restOfConfig } = config;
      this.connection = await mysql.createConnection(restOfConfig);
      return this.connection;
    } catch (error) {
      throw error;
    }
  }

  private static generateSqlDataType(
    columnName: string,
    column: TColumn
  ): string {
    let columnType = "";
    if (column.type === String) {
      columnType = "VARCHAR(255)";
    } else if (column.type === Number) {
      columnType = "INT(11)";
    } else if (column.type === Boolean) {
      columnType = "BOOLEAN";
    } else {
      columnType = "VARCHAR(100)";
    }

    if (column.required) {
      columnType = `${columnType} NOT NULL CHECK(${columnName}>'')`;
    }
    if (column.unique) {
      columnType = `${columnType} UNIQUE`;
    }
    if (column.default) {
      columnType = `${columnType} DEFAULT ${column.default}`;
    }
    return columnType;
  }

  static getTableName(name: string) {
    return plural(name).toLocaleLowerCase();
  }

  static async model(name: string, columnDefinition: string) {
    const tableName = this.getTableName(name);
    if (this.mySqlConfig.synchronize) {
      await this.connection.query(`DROP TABLE IF EXISTS ${tableName}`);
    }
    const primaryKey = "id INT AUTO_INCREMENT PRIMARY KEY";
    const query = `CREATE TABLE ${tableName}  (${primaryKey} ,${columnDefinition})`;
    console.log(columnDefinition);
    const [rows, fields] = await this.connection.query(
      `SHOW TABLES LIKE '${tableName}'`
    );
    if (!rows.length) {
      await this.connection.query(query);
      console.log("table crated!");
    } else {
      console.log("table alreayd exists");
    }
    // need to pass something to do insert, udpat etc
    return new SQLQuery(this.connection, tableName);
  }
}
