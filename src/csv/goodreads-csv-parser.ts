import * as csv from 'fast-csv';
import { CSVParser } from './csv-parser.js';
import { type GoodreadsCSVRow, type GoodreadsRow, goodreadsHeaders } from '../types/goodreads.js';
import { createReadStream, existsSync } from 'fs';
import { once } from 'events';
import { isAbsolute, resolve, normalize } from 'path';

export class GoodreadsCSVParser extends CSVParser<GoodreadsRow> {
    private filepath: string;
    private finalRows: GoodreadsRow[];

    constructor(filepath: string) {
        super();

        const normalizedFilepath = isAbsolute(filepath) ? normalize(filepath) : normalize(resolve(filepath));

        if (!existsSync(normalizedFilepath)) {
            throw new Error(`File not found at path: ${normalizedFilepath}`);
        }

        this.filepath = normalizedFilepath;
        this.finalRows = [];
    }

    public override async parse(): Promise<GoodreadsRow[]> {
        const stream = createReadStream(this.filepath)
        .pipe(csv.parse({ headers: goodreadsHeaders, renameHeaders: true }))
        .pipe(csv.format<GoodreadsCSVRow, GoodreadsRow>({ headers: true }))
        .transform((row, next) => {
            const transformedRow = {
                title: row.title.trim(),
                author: row.author.trim(),
                shelf: row.exclusiveshelf.trim()
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