#! /usr/bin/env node

import { CustomCSVParser } from "./csv/custom-csv-parser.js";
import { GoodreadsCSVParser } from "./csv/goodreads-csv-parser.js";
import { HardcoverAPI } from "./api/hardcover.js";
import yargs from "yargs";

interface CLIArgs {
    goodreads?: boolean;
    "custom-csv"?: boolean;
    hardcover?: boolean;
    "file-path"?: string;
    "api-key"?: string;
}

const argv: CLIArgs = yargs(process.argv.slice(2))
    .option("goodreads", {
        type: "boolean",
        description: "Parse a Goodreads CSV file",
    })
    .option("custom-csv", {
        type: "boolean",
        description: "Parse a custom CSV file",
    })
    .option("hardcover", {
        type: "boolean",
        description: "Fetch books from Hardcover API",
    })
    .option("file-path", {
        type: "string",
        description: "Path to the CSV file to parse",
        alias: "path"
    })
    .option("api-key", {
        type: "string",
        description: "API key for Hardcover API",
    })
    .help()
    .parseSync() as CLIArgs;

if (argv.goodreads && !argv["file-path"]) {
    console.error("Please provide a file path for the Goodreads CSV parser using --file-path");
    process.exit(1);
}

if (argv["custom-csv"] && !argv["file-path"]) {
    console.error("Please provide a file path for the Custom CSV parser using --file-path");
    process.exit(1);
}

if (argv.hardcover && !argv["api-key"]) {
    console.error("Please provide an API key for the Hardcover API using --api-key");
    process.exit(1);
}

let books;

if (argv.goodreads) {
    const parser: GoodreadsCSVParser = new GoodreadsCSVParser(argv["file-path"]!);
    books = await parser.parse();
} else if (argv["custom-csv"]) {
    const customParser: CustomCSVParser = new CustomCSVParser(argv["file-path"]!);
    books = await customParser.parse();
} else if (argv.hardcover) {
    const hardcover: HardcoverAPI = new HardcoverAPI(argv["api-key"]!);
    books = await hardcover.getBooks();
} else {
    console.error("Please specify at least one action: --goodreads, --custom-csv, or --hardcover");
    process.exit(1);
}

const randomIdx = Math.floor(Math.random() * ((books.length - 1) + 1));
console.log('Next random read', books[randomIdx]);

process.exit(0);