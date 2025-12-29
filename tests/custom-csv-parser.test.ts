import { CustomCSVParser } from "../src/csv/custom-csv-parser";

describe('CustomCSVParser', () => {
    let csvParser;

    beforeAll(() => {
        csvParser = new CustomCSVParser('./samples/sample-custom.csv');
    });

    it('should successfully parse a sample csv', async() => {

    });

    it('should rename headers to the appropriate values', async() => {

    });
});