import { CustomCSVParser } from "../src/csv/custom-csv-parser.ts";
describe('CustomCSVParser', () => {
    let csvParser;
    beforeAll(() => {
        csvParser = new CustomCSVParser('./samples/sample-custom.csv');
    });
    it('should successfully parse a sample csv', async () => {
    });
    it('should rename headers to the appropriate values', async () => {
    });
});
//# sourceMappingURL=custom-csv-parser.test.js.map