export declare class SQLQuery<T> {
    private connection;
    private tableName;
    constructor(connection: any, tableName: string);
    find(where: T): Promise<any>;
    private convertToPreparedStatement;
    findById(id: number): Promise<any>;
    create(data: T): Promise<void>;
    findByIdAndUpdate(id: number, data: any): Promise<any>;
    findByIdAndDelete(id: number): Promise<any>;
}
