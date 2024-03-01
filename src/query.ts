export class SQLQuery<T> {
  constructor(private connection: any, private tableName: string) {}

  async find(where: T) {
    try {
      const sql = `SELECT * FROM ${this.tableName}`;
      const [result] = await this.connection.query(sql);
      return result;
    } catch (error) {
      throw error;
    }
  }

  private convertToPreparedStatement(data: any) {
    const columns = Object.keys(data).join(",");
    const values = Object.values(data);
    const placeholders = values.map((value) => "?").join(", ");
    return { columns, values, placeholders };
  }

  async findById(id: number) {
    try {
      const sql = `SELECT * FROM ${this.tableName} WHERE id=${id}`;
      const [result] = await this.connection.query(sql);
      if (result.length) {
        return result[0];
      }
      return result;
    } catch (error) {
      throw error;
    }
  }

  async create(data: T) {
    try {
      const { columns, values, placeholders } =
        this.convertToPreparedStatement(data);
      const sql = `INSERT INTO ${this.tableName} (${columns}) VALUES (${placeholders})`;
      const [rows, fields] = await this.connection.query(sql, values);
      console.log(rows);
    } catch (error) {
      throw error;
    }
  }

  async findByIdAndUpdate(id: number, data: any) {
    try {
      const keys = Object.keys(data);
      const values = Object.values(data);
      values.push(id);
      const conditionsDefinition: string[] = [];
      keys.forEach((key) => {
        conditionsDefinition.push(`${key}= ?`);
      });
      const conditions = conditionsDefinition.join(",");

      const sql = `UPDATE ${this.tableName} SET ${conditions} WHERE id = ? LIMIT 1`;
      const [rows, fields] = await this.connection.query(sql, values);
      return rows;
    } catch (error) {
      throw error;
    }
  }

  async findByIdAndDelete(id: number) {
    try {
      const sql = `DELETE FROM ${this.tableName} WHERE id = ? LIMIT 1`;
      const [result] = await this.connection.query(sql, [id]);
      return result;
    } catch (error) {
      throw error;
    }
  }
}
