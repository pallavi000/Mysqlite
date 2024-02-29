import mysql from "mysql2";
export class Mysqlite {
  private connection: any;
  constructor(database: string) {
    this.connection = mysql.createConnection({
      host: "localhost",
      user: "root",
      database: database,
      port: 3306,
      password: "",
    });
  }

  async createTable(name: string, columns: { name: string; type: string }[]) {
    try {
      const MAX_VARCHAR_LENGTH = 255;
      let columnDefinition = "";
      columns.forEach((column, index) => {
        if (column.type === "INT") {
          columnDefinition += `${column.name} ${column.type}(11)`;
        } else {
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
      } else {
        console.log("table already exists");
      }
      return `${name}  table created`;
    } catch (error) {
      console.log(error);
    }
  }
  async insert(tableName: string, data: any) {
    const columns = Object.keys(data).join(",");
    const values = Object.values(data);
    const placeholders = values.map((value) => "?").join(", ");
    const sql = `INSERT INTO ${tableName} (${columns}) VALUES (${placeholders})`;
    try {
      const [result] = await this.connection.promise().query(sql, values);
      console.log(result);
      if (result && result.affectedRows > 0) {
        console.log("Data inserted successfully.");
        return true;
      } else {
        console.log("No data inserted.");
        return false;
      }
    } catch (error) {
      console.log(error);
    }
  }

  async find(name: string) {
    try {
      const sql = `SELECT * FROM ${name}`;
      const [rows, fields] = await this.connection.promise().query(sql);
      console.log(rows);
      return rows;
    } catch (error) {
      console.log(error);
    }
  }

  async delete(name: string, id: number) {
    try {
      const sql = `DELETE FROM ${name} WHERE id= ${id} LIMIT 1`;
      const [result, fields] = await this.connection.promise().query(sql);

      if (result && result.affectedRows > 0) {
        // Return success response
        return {
          success: true,
          message: `Record with ID ${id} deleted successfully.`,
        };
      } else {
        // If no rows were affected, it means no record was found with the provided ID
        return { success: false, message: `Record with ID ${id} not found.` };
      }
    } catch (error) {
      console.log(error);
    }
  }

  async closeConnection() {
    await this.connection.end();
  }
}

const mysqlite = new Mysqlite("nest-test");

// const fxn = async () => {
//   const a = await mysqlite.createTable("result", [
//     { name: "subject", type: "VARCHAR" },
//     { name: "full", type: "VARCHAR" },
//     { name: "pass", type: "VARCHAR" },
//   ]);

//   console.log(a, "result");

//   const data = {
//     subject: "Science",
//     full: "Yes",
//     pass: "No",
//   };
//   const del = await mysqlite.delete("result", 2);
//   console.log(del);

//   const dat = await mysqlite.insert("result", data);
//   const res = await mysqlite.find("result");

// last call
//   mysqlite.closeConnection();
// };
// fxn();
