import { neon, type NeonQueryFunction } from "@neondatabase/serverless";

export interface BaseRepository<T> {
  findOne(id: string): Promise<T | null>;
  findMany(filter?: Partial<T>): Promise<T[]>;
  insertOne(data: T): Promise<T>;
  updateOne(id: string, data: Partial<T>): Promise<T | null>;
  deleteOne(id: string): Promise<boolean>;
  countAll(): Promise<number>;
}

/**
 * A generic SQL-based repository for Postgres via Neon.
 * - T must extend Record<string, any> so we can dynamically set column => value.
 */
export class SqlBaseRepository<T extends Record<string, any>> implements BaseRepository<T> {
  protected sql: NeonQueryFunction<false, true>; // object rows + full result
  protected tableName: string;

  constructor(tableName: string) {
    // Pass fullResults: true so we get rowCount, fields, etc.
    this.sql = neon(process.env.DATABASE_URL!, { fullResults: true });
    this.tableName = tableName;
  }

  async findOne(id: string): Promise<T | null> {
    const query = `SELECT * FROM ${this.tableName} WHERE id = $1 LIMIT 1`;
    const result = await this.sql(query, [id]);
    // Cast row to T or return null if no row
    return (result.rows[0] as T) || null;
  }

  async findMany(filter?: Partial<T>): Promise<T[]> {
    // If no filter, fetch all
    if (!filter) {
      const query = `SELECT * FROM ${this.tableName}`;
      const result = await this.sql(query);
      return result.rows as T[];
    }

    // Build a WHERE clause from the filter object
    const entries = Object.entries(filter);
    if (entries.length === 0) {
      // No properties => no WHERE clause
      const query = `SELECT * FROM ${this.tableName}`;
      const result = await this.sql(query);
      return result.rows as T[];
    }

    // e.g. "name = $1 AND age = $2"
    const conditions = entries.map(([key], i) => `${key} = $${i + 1}`).join(" AND ");
    const values = entries.map(([, value]) => value);

    const query = `SELECT * FROM ${this.tableName} WHERE ${conditions}`;
    const result = await this.sql(query, values);
    return result.rows as T[];
  }

  async insertOne(data: T): Promise<T> {
    const keys = Object.keys(data);
    const values = Object.values(data);
    // e.g. "$1, $2, $3"
    const placeholders = keys.map((_, i) => `$${i + 1}`).join(", ");

    const query = `
      INSERT INTO ${this.tableName} (${keys.join(", ")})
      VALUES (${placeholders})
      RETURNING *
    `;

    const result = await this.sql(query, values);
    return result.rows[0] as T;
  }

  async updateOne(id: string, data: Partial<T>): Promise<T | null> {
    // If no fields to update, return null or handle as you like
    const entries = Object.entries(data);
    if (entries.length === 0) {
      return null;
    }

    // placeholders start at $2 because $1 is the "id"
    const setClause = entries.map(([key], i) => `${key} = $${i + 2}`).join(", ");
    const values = [id, ...entries.map(([, value]) => value)];

    const query = `
      UPDATE ${this.tableName}
      SET ${setClause}
      WHERE id = $1
      RETURNING *
    `;

    const result = await this.sql(query, values);
    return (result.rows[0] as T) || null;
  }

  async deleteOne(id: string): Promise<boolean> {
    const query = `DELETE FROM ${this.tableName} WHERE id = $1`;
    const result = await this.sql(query, [id]);
    // rowCount tells you how many rows were affected
    return result.rowCount > 0;
  }

  async countAll(): Promise<number> {
    const query = `SELECT COUNT(*) FROM ${this.tableName}`;
    const result = await this.sql(query);
    return parseInt(result.rows[0].count);
  }
}
