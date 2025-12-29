import { GoodreadsCSVParser } from "../src/csv/goodreads-csv-parser.js";

describe('GoodreadsCSVParser', () => {
    let csvParser: GoodreadsCSVParser;

    it('should successfully parse, transform, and filter a goodreads sample csv', async() => {
        csvParser = new GoodreadsCSVParser('tests/samples/sample-goodreads.csv');
        const rows = await csvParser.parse();
        
        // Filter out Way of Kings, keep Master and Commander
        expect(rows.length).toEqual(1);
        expect(rows[0]).toEqual({
            title: 'Master and Commander (Aubrey & Maturin, #1)',
            author: "Patrick O'Brian",
            shelf: 'to-read'
        });
    });

    it('should throw an error if the file does not exist', async() => {
        expect(() => new GoodreadsCSVParser('tests/samples/non-existent-file.csv')).toThrow();
    });
});