"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SQLQuery = void 0;
class SQLQuery {
    constructor(connection, tableName) {
        this.connection = connection;
        this.tableName = tableName;
    }
    async find(where) {
        try {
            const sql = `SELECT * FROM ${this.tableName}`;
            const [result] = await this.connection.query(sql);
            return result;
        }
        catch (error) {
            throw error;
        }
    }
    convertToPreparedStatement(data) {
        const columns = Object.keys(data).join(",");
        const values = Object.values(data);
        const placeholders = values.map((value) => "?").join(", ");
        return { columns, values, placeholders };
    }
    async findById(id) {
        try {
            const sql = `SELECT * FROM ${this.tableName} WHERE id=${id}`;
            const [result] = await this.connection.query(sql);
            if (result.length) {
                return result[0];
            }
            return result;
        }
        catch (error) {
            throw error;
        }
    }
    async create(data) {
        try {
            const { columns, values, placeholders } = this.convertToPreparedStatement(data);
            const sql = `INSERT INTO ${this.tableName} (${columns}) VALUES (${placeholders})`;
            const [rows, fields] = await this.connection.query(sql, values);
            console.log(rows);
        }
        catch (error) {
            throw error;
        }
    }
    async findByIdAndUpdate(id, data) {
        try {
            const keys = Object.keys(data);
            const values = Object.values(data);
            values.push(id);
            const conditionsDefinition = [];
            keys.forEach((key) => {
                conditionsDefinition.push(`${key}= ?`);
            });
            const conditions = conditionsDefinition.join(",");
            const sql = `UPDATE ${this.tableName} SET ${conditions} WHERE id = ? LIMIT 1`;
            const [rows, fields] = await this.connection.query(sql, values);
            return rows;
        }
        catch (error) {
            throw error;
        }
    }
    async findByIdAndDelete(id) {
        try {
            const sql = `DELETE FROM ${this.tableName} WHERE id = ? LIMIT 1`;
            const [result] = await this.connection.query(sql, [id]);
            return result;
        }
        catch (error) {
            throw error;
        }
    }
}
exports.SQLQuery = SQLQuery;
