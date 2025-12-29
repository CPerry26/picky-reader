# Picky Reader

I'm a picky reader. I finish my current reads, and sometimes, I just can't pick the next book. Well, why not just remove the illusion of choice and randomly select my next read?

This project is a simple CLI tool written in TypeScript and runs with NodeJS 24. It can parse a custom CSV, Goodreads library export, or call the Hardcover API with a token from your account.

## How to Use

## Goodreads Export
This tool takes a Goodreads library export in CSV format and parses and transforms it (skipping any entry not marked as `to-read`). It then selects a random index in the set of parsed and transformed rows, and outputs the next read details. If you don't know how to export your Goodreads library, you can find that information [here](https://help.goodreads.com/s/article/How-do-I-import-or-export-my-books-1553870934590).

## Custom CSV
The custom CSV option is quite basic. It can read a CSV file with two columns (`title` and `author`), and perform the same random logic as the Goodreads export.

As an aside, the reason this is so basic is limitations with the CSV parsing. Because you must pass a sparse index to transform and rename columns with `fast-csv`, without enforcing some consistency on the headers, it won't work. There may be a way to make this more extensible in the future (for example having the CLI allow header pass-in), but for now I went with the simple option.

## Hardcover