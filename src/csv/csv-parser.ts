export abstract class CSVParser<T> {
    abstract parse(): Promise<T[]>;
};