// Book Id	
// Title	
// Author	
// Author l-f	
// Additional Authors	
// ISBN	
// ISBN13	
// My Rating	
// Average Rating	
// Publisher	
// Binding	
// Number of Pages	
// Year Published	
// Original Publication Year
// Date Read	
// Date Added	
// Bookshelves	
// Bookshelves with positions	
// Exclusive Shelf	
// My Review	
// Spoiler	
// Private Notes	
// Read Count	
// Owned Copies
export type GoodreadsRow = {
    title: string;
    author: string;
    shelf: string;
};

export type GoodreadsCSVRow = {
    title: string;
    author: string;
    exclusiveshelf: string;
}

// Sparse array to ignore certain columns when parsing a Goodreads library export.
export const goodreadsHeaders = [
    undefined, 
    "title", 
    "author", 
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    "exclusiveshelf",
    undefined,
    undefined,
    undefined,
    undefined,
    undefined
];