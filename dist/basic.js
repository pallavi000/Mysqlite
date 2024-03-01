"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Mysqlite = void 0;
const mysql2_1 = __importDefault(require("mysql2"));
class Mysqlite {
    constructor(database) {
        this.connection = mysql2_1.default.createConnection({
            host: "localhost",
            user: "root",
            database: database,
            port: 3306,
            password: "",
        });
    }
    convertToPreparedStatement(data) {
        const columns = Object.keys(data).join(",");
        const values = Object.values(data);
        const placeholders = values.map((value) => "?").join(", ");
        return { columns, values, placeholders };
    }
    async createTable(name, columns) {
        try {
            const MAX_VARCHAR_LENGTH = 255;
            let columnDefinition = "";
            columns.forEach((column, index) => {
                if (column.type === "INT") {
                    columnDefinition += `${column.name} ${column.type}(11)`;
                }
                else {
                    columnDefinition += `${column.name} ${column.type}(${MAX_VARCHAR_LENGTH})`;
                }
                if (index < columns.length - 1) {
                    columnDefinition += ",";
                }
            });
            const primaryKey = "id INT AUTO_INCREMENT PRIMARY KEY";
            const [rows, fields] = await this.connection
                .promise()
                .query(`SHOW TABLES LIKE '${name}'`);
            if (!rows.length) {
                const sql = `CREATE TABLE ${name}  (${primaryKey} ,${columnDefinition})`;
                console.log(sql);
                await this.connection.promise().query(sql);
            }
            else {
                console.log("table already exists");
            }
            return `${name}  table created`;
        }
        catch (error) {
            console.log(error);
        }
    }
    async insert(tableName, data) {
        const { columns, values, placeholders } = this.convertToPreparedStatement(data);
        const sql = `INSERT INTO ${tableName} (${columns}) VALUES (${placeholders})`;
        try {
            const [result] = await this.connection.promise().query(sql, values);
            console.log(result);
            if (result && result.affectedRows > 0) {
                console.log("Data inserted successfully.");
                return true;
            }
            else {
                console.log("No data inserted.");
                return false;
            }
        }
        catch (error) {
            console.log(error);
        }
    }
    async find(name) {
        try {
            const sql = `SELECT * FROM ${name}`;
            const [rows, fields] = await this.connection.promise().query(sql);
            console.log(rows);
            return rows;
        }
        catch (error) {
            console.log(error);
        }
    }
    async findByIdAndUpdate(name, id, data) {
        try {
            const keys = Object.keys(data);
            const values = Object.values(data);
            values.push(id);
            const conditionsArray = [];
            keys.forEach((key) => {
                conditionsArray.push(`${key}=?`);
            });
            const conditions = conditionsArray.join(", ");
            const sql = `UPDATE ${name} SET ${conditions} WHERE id = ? LIMIT 1`;
            const [result] = await this.connection.promise().query(sql, values);
            console.log(result);
        }
        catch (error) { }
    }
    async findByIdAndDelete(name, id) {
        try {
            const sql = `DELETE FROM ${name} WHERE id= ${id} LIMIT 1`;
            const [result, fields] = await this.connection.promise().query(sql);
            if (result && result.affectedRows > 0) {
                // Return success response
                return {
                    success: true,
                    message: `Record with ID ${id} deleted successfully.`,
                };
            }
            else {
                // If no rows were affected, it means no record was found with the provided ID
                return { success: false, message: `Record with ID ${id} not found.` };
            }
        }
        catch (error) {
            console.log(error);
        }
    }
    async closeConnection() {
        await this.connection.end();
    }
}
exports.Mysqlite = Mysqlite;
