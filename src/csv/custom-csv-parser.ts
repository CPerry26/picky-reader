import * as csv from 'fast-csv';
import { CSVParser } from './csv-parser.js';
import { type CustomCSVRow, customCSVHeaders } from '../types/custom-csv.js';
import { createReadStream, existsSync } from 'fs';
import { once } from 'events';
import { isAbsolute, resolve, normalize } from 'path';

export class CustomCSVParser extends CSVParser<CustomCSVRow> {
    private filepath: string;
    private finalRows: CustomCSVRow[];

    constructor(filepath: string) {
        super();

        const normalizedFilepath = isAbsolute(filepath) ? normalize(filepath) : normalize(resolve(filepath));
        
        if (!existsSync(normalizedFilepath)) {
            throw new Error(`File not found at path: ${normalizedFilepath}`);
        }
        
        this.filepath = normalizedFilepath;
        this.finalRows = [];
    }

    public override async parse(): Promise<CustomCSVRow[]> {
        const stream = createReadStream(this.filepath)
        .pipe(csv.parse<CustomCSVRow, CustomCSVRow>({ headers: customCSVHeaders, renameHeaders: true }))
        .transform(
            (row: CustomCSVRow): CustomCSVRow => ({
                title: row.title.trim(),
                author: row.author.trim()
            }),
        )
        .on('data', row => this.finalRows.push(row))
        .on('error', error => console.error(error))
        .on('end', (rowCount: number) => console.log(`Custom CSV parse complete - ${rowCount || this.finalRows.length}`, this.finalRows[0]));

        // Because createReadStream is async but can't be awaited, await the end event.
        await once(stream, 'end');

        return Promise.resolve(this.finalRows);
    }
}