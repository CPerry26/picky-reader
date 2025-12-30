# Picky Reader

I'm a picky reader. I finish my current reads, and sometimes, I just can't pick the next book. Well, why not just remove the illusion of choice and randomly select my next read?

This project is a simple CLI tool written in TypeScript and runs with NodeJS 24. It can parse a custom CSV, Goodreads library export, or call the Hardcover API with a token from your account.

## How to Use

### Initial Setup

#### Goodreads Export
This tool takes a Goodreads library export in CSV format and parses and transforms it (skipping any entry not marked as `to-read`). It then selects a random index in the set of parsed and transformed rows, and outputs the next read details. If you don't know how to export your Goodreads library, you can find that information [here](https://help.goodreads.com/s/article/How-do-I-import-or-export-my-books-1553870934590).

#### Custom CSV
The custom CSV option is quite basic. It can read a CSV file with two columns (`title` and `author`), and perform the same random logic as the Goodreads export.

As an aside, the reason this is so basic is limitations with the CSV parsing. Because you must pass a sparse index to transform and rename columns with `fast-csv`, without enforcing some consistency on the headers, it won't work. There may be a way to make this more extensible in the future (for example having the CLI allow header pass-in), but for now I went with the simple option.

#### Hardcover

[Hardcover](https://hardcover.app/) is an alternative to Goodreads and StoryGraph. In order to use this option, you will need a personal account as API keys are scoped to individual users. If you already have an account, you can visit your account settings to get an API key [here](https://hardcover.app/account/api). You will need to capture the entire part including `Bearer` and include that in quotes when passing via the CLI.

### Running

#### Usage
Below are some usage guidelines and examples.

If you are using CSV parsing, you must pass both the associated CSV option and file path. If you are using Hardcover, you must specify the hardcover option and API key option.

##### Goodreads
```
picky-reader --goodreads --file-path path/to/csv
```

##### Custom CSV
```
picky-reader --custom-csv --file-path path/to/csv
```

##### Hardcover
```
picky-reader --hardcover --api-key "Bearer TOKEN"
```

#### Node
To run picky reader, make sure you have Node 24 installed. If you use nvm, you can run `nvm install 24 && nvm use 24` to get setup.

#### Dependencies and Build
After Node is setup, run an `npm install` and then `npm run build`.

#### Run Options
To run picky reader, you have 3 options which are outlined below.

##### Node
You can run the compiled TypeScript directly by running `node ./dist/index.js`.

##### npm
You can use the package script to run picky reader. For example: `npm run next-read`.

##### Global
If you want to run this like a normal CLI globally, you can run `npm install -g .` in the root project directory. Once that is complete, you can then run `picky-reader` directly from your CLI.