export declare class Mysqlite {
    private connection;
    constructor(database: string);
    createTable(name: string, columns: {
        name: string;
        type: string;
    }[]): Promise<string | undefined>;
    insert(tableName: string, data: any): Promise<boolean | undefined>;
    find(name: string): Promise<any>;
    delete(name: string, id: number): Promise<{
        success: boolean;
        message: string;
    } | undefined>;
    closeConnection(): Promise<void>;
}
