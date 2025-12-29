import { CustomCSVParser } from "../src/csv/custom-csv-parser.js";

describe('CustomCSVParser', () => {
    let csvParser: CustomCSVParser;

    it('should successfully parse and transform a custom sample csv', async() => {
        csvParser = new CustomCSVParser('tests/samples/sample-custom.csv');
        const rows = await csvParser.parse();
        
        expect(rows.length).toEqual(1);
        expect(rows[0]).toEqual({
            title: 'Murder On the Orient Express',
            author: 'Agatha Christie'
        });
    });

    it('should rename headers to the appropriate values', async() => {
        csvParser = new CustomCSVParser('tests/samples/sample-custom-bad-headers.csv');
        const rows = await csvParser.parse();

        expect(rows.length).toEqual(1);
        expect(rows[0]).toEqual({
            title: 'Murder On the Orient Express',
            author: 'Agatha Christie'
        });
    });

    it('should throw an error if the file does not exist', async() => {
        expect(() => new CustomCSVParser('tests/samples/non-existent-file.csv')).toThrow();
    });
});