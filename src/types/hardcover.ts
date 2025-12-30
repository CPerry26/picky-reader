export type HardcoverBook = {
    title: string;
    author: string;
};

export type HardcoverIdResponse = {
    data: {
        me: [
            {
                id: number;
            }
        ]
    }
};

export type HardcoverBooksResponse = {
    data: {
        user_books: [
            {
                book: {
                    title: string;
                    contributions: [
                        {
                            author: {
                                name: string;
                            }
                        }
                    ]
                }
            }
        ]
    }
};