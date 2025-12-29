import * as csv from 'fast-csv';
import { CSVParser } from './csv-parser.ts';
import { type CustomCSVRow, customCSVHeaders } from '../types/custom-csv.ts';
import { createReadStream } from 'fs';
import { once } from 'events';

export class CustomCSVParser extends CSVParser<CustomCSVRow> {
    private filepath: string;
    private finalRows: CustomCSVRow[];

    constructor(filepath: string) {
        super();
        this.filepath = filepath;
        this.finalRows = [];
    }

    public override async parse(): Promise<CustomCSVRow[]> {
        const stream = createReadStream(this.filepath)
        .pipe(csv.parse({ headers: customCSVHeaders, renameHeaders: true }))
        .on('data', row => this.finalRows.push(row))
        .on('error', error => console.error(error))
        .on('end', (rowCount: number) => console.log(`Custom CSV parse complete - ${rowCount || this.finalRows.length}`, this.finalRows[0]));

        // Because createReadStream is async but can't be awaited, await the end event.
        await once(stream, 'end');

        return Promise.resolve(this.finalRows);
    }
}