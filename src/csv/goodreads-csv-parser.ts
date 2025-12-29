import * as csv from 'fast-csv';
import { CSVParser } from './csv-parser.ts';
import { type GoodreadsCSVRow, type GoodreadsRow, goodreadsHeaders } from '../types/goodreads.ts';
import { createReadStream } from 'fs';
import { once } from 'events';

export class GoodreadsCSVParser extends CSVParser<GoodreadsRow> {
    private filepath: string;
    private finalRows: GoodreadsRow[];

    constructor(filepath: string) {
        super();
        this.filepath = filepath;
        this.finalRows = [];
    }

    public override async parse(): Promise<GoodreadsRow[]> {
        const stream = createReadStream(this.filepath)
        .pipe(csv.parse({ headers: goodreadsHeaders, renameHeaders: true }))
        .pipe(csv.format<GoodreadsCSVRow, GoodreadsRow>({ headers: true }))
        .transform((row, next) => {
            const transformedRow = {
                title: row.title,
                author: row.author,
                shelf: row.exclusiveshelf
            } as GoodreadsRow;

            if (transformedRow.shelf === 'to-read') {
                this.finalRows.push(transformedRow);
            }
            
            return next(null);
        })
        .on('data', row => this.finalRows.push(row))
        .on('error', error => console.error(error))
        .on('end', (rowCount: number) => console.log(`Goodreads parse complete - ${rowCount || this.finalRows.length}`, this.finalRows[0]));

        // Because createReadStream is async but can't be awaited, await the end event.
        await once(stream, 'end');

        return Promise.resolve(this.finalRows);
    }
}