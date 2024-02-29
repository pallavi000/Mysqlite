export declare class Mysqlite {
    private connection;
    constructor(database: string);
    private convertToPreparedStatement;
    createTable(name: string, columns: {
        name: string;
        type: string;
    }[]): Promise<string | undefined>;
    insert(tableName: string, data: any): Promise<boolean | undefined>;
    find(name: string): Promise<any>;
    findByIdAndUpdate(name: string, id: number, data: any): Promise<void>;
    findByIdAndDelete(name: string, id: number): Promise<{
        success: boolean;
        message: string;
    } | undefined>;
    closeConnection(): Promise<void>;
}
