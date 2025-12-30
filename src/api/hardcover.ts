import type { HardcoverBook, HardcoverBooksResponse, HardcoverIdResponse } from "../types/hardcover.js";

export class HardcoverAPI {
    private apiKey: string;
    private baseUrl: string = "https://api.hardcover.app/v1/graphql";
    
    constructor(apiKey: string) {
        this.apiKey = apiKey;
    }

    public async getBooks(): Promise<HardcoverBook[]> {
        const userId = await this.getUserId();

        // 1 is the want to read status in Hardcover
        const query = `
        {
            user_books(
                where: {user_id: {_eq: ${userId}}, status_id: {_eq: 1}}
            ) {
                book {
                    title
                    contributions {
                        author {
                            name
                        }
                    }
                }
            }
        }`;

        const response = await fetch(this.baseUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `${this.apiKey}`,
            },
            body: JSON.stringify({ query }),
        });

        if (!response.ok) {
            throw new Error(`Error fetching books from Hardcover: ${response.status} ${response.statusText}`);
        }

        const data = await response.json() as HardcoverBooksResponse;

        console.log("Finished fetching books from Hardcover");

        if (!data.data.user_books) {
            throw new Error(`Error fetching books from Hardcover: ${JSON.stringify(data)}`);
        }

        return data.data.user_books.map((entry) => {
            return {
                title: entry.book.title,
                author: entry.book.contributions.map(contribution => contribution.author.name).join(", ")
            }
        });
    }

    private async getUserId(): Promise<number> {
        const query = `
        query GetUserId {
            me {
                id
            }
        }`;

        const response = await fetch(this.baseUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `${this.apiKey}`,
            },
            body: JSON.stringify({ query }),
        });

        if (!response.ok) {
            throw new Error(`Error fetching user ID from Hardcover: ${response.status} ${response.statusText}`);
        }

        const data = await response.json() as HardcoverIdResponse;

        if (!data.data.me || !data.data.me.length) {
            throw new Error(`Error fetching user ID from Hardcover: ${JSON.stringify(data)}`);
        }
        
        return data.data.me[0].id;
    }
}