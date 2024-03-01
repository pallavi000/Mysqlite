"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pluralize_1 = require("pluralize");
const promise_1 = __importDefault(require("mysql2/promise"));
const query_1 = require("./query");
class MySql {
    static Schema(column) {
        let columnDefinitions = [];
        const keys = Object.keys(column);
        keys.forEach((key) => {
            columnDefinitions.push(`${key} ${this.generateSqlDataType(key, column === null || column === void 0 ? void 0 : column[key])}`);
        });
        const columns = columnDefinitions.join(",");
        return columns;
    }
    static async connect(config) {
        try {
            this.mySqlConfig = config;
            const { synchronize } = config, restOfConfig = __rest(config, ["synchronize"]);
            this.connection = await promise_1.default.createConnection(restOfConfig);
            return this.connection;
        }
        catch (error) {
            throw error;
        }
    }
    static generateSqlDataType(columnName, column) {
        let columnType = "";
        if (column.type === String) {
            columnType = "VARCHAR(255)";
        }
        else if (column.type === Number) {
            columnType = "INT(11)";
        }
        else if (column.type === Boolean) {
            columnType = "BOOLEAN";
        }
        else {
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
    static getTableName(name) {
        return (0, pluralize_1.plural)(name).toLocaleLowerCase();
    }
    static async model(name, columnDefinition) {
        const tableName = this.getTableName(name);
        if (this.mySqlConfig.synchronize) {
            await this.connection.query(`DROP TABLE IF EXISTS ${tableName}`);
        }
        const primaryKey = "id INT AUTO_INCREMENT PRIMARY KEY";
        const query = `CREATE TABLE ${tableName}  (${primaryKey} ,${columnDefinition})`;
        console.log(columnDefinition);
        const [rows, fields] = await this.connection.query(`SHOW TABLES LIKE '${tableName}'`);
        if (!rows.length) {
            await this.connection.query(query);
            console.log("table crated!");
        }
        else {
            console.log("table alreayd exists");
        }
        // need to pass something to do insert, udpat etc
        return new query_1.SQLQuery(this.connection, tableName);
    }
}
