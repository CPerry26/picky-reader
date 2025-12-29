import { CustomCSVParser } from "./csv/custom-csv-parser.js";
import { GoodreadsCSVParser } from "./csv/goodreads-csv-parser.js";

const parser: GoodreadsCSVParser = new GoodreadsCSVParser('/Users/cody/development/picky-reader/sample/sample.csv');
const customParser: CustomCSVParser = new CustomCSVParser('/Users/cody/development/picky-reader/sample/sample-custom.csv')

const rows = await parser.parse();

// Compute a random index in the array for the next read. The formula looks slightly different because we're including 0.
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random#getting_a_random_integer_between_two_values_inclusive
const randomIdx = Math.floor(Math.random() * ((rows.length - 1) + 1));

console.log('Next random read', rows[randomIdx]);

const customRows = await customParser.parse();

// Compute a random index in the array for the next read. The formula looks slightly different because we're including 0.
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random#getting_a_random_integer_between_two_values_inclusive
const randomIdxCustom = Math.floor(Math.random() * ((customRows.length - 1) + 1));

console.log('Next random read', customRows[randomIdxCustom]);