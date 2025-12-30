import { jest } from "@jest/globals";
import { HardcoverAPI } from "../src/api/hardcover.js";

describe("HardcoverAPI", () => {
    let hardcoverApi: HardcoverAPI;
    let fetchMock: jest.SpiedFunction<typeof fetch>;

    beforeEach(() => {
        jest.spyOn(console, "log").mockImplementation(() => {});
        hardcoverApi = new HardcoverAPI("Bearer MOCK_API_KEY");
        fetchMock = jest.spyOn(global, "fetch") as jest.SpiedFunction<typeof fetch>;
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it("should successfully fetch books", async() => {
        const mockUserIdResponse = {
            data: {
                me: [{ id: 12345 }]
            }
        };

        const mockBooksResponse = {
            data: {
                user_books: [
                    {
                        book: {
                            title: "The Hobbit",
                            contributions: [
                                { author: { name: "J.R.R. Tolkien" } }
                            ]
                        }
                    },
                    {
                        book: {
                            title: "1984",
                            contributions: [
                                { author: { name: "George Orwell" } }
                            ]
                        }
                    }
                ]
            }
        };

        fetchMock
            .mockResolvedValueOnce({
                ok: true,
                json: async () => mockUserIdResponse,
            } as Response)
            .mockResolvedValueOnce({
                ok: true,
                json: async () => mockBooksResponse,
            } as Response);

        const books = await hardcoverApi.getBooks();
        
        expect(books.length).toEqual(2);
        expect(books[0]!.title).toEqual("The Hobbit");
        expect(books[0]!.author).toEqual("J.R.R. Tolkien");
        expect(books[1]!.title).toEqual("1984");
        expect(books[1]!.author).toEqual("George Orwell");
        expect(fetchMock).toHaveBeenCalledTimes(2);
    });

    it("should return an empty array if there are no want to read books", async() => {
        const mockUserIdResponse = {
            data: {
                me: [{ id: 12345 }]
            }
        };

        const mockEmptyBooksResponse = {
            data: {
                user_books: []
            }
        };

        fetchMock
            .mockResolvedValueOnce({
                ok: true,
                json: async () => mockUserIdResponse,
            } as Response)
            .mockResolvedValueOnce({
                ok: true,
                json: async () => mockEmptyBooksResponse,
            } as Response);

        const books = await hardcoverApi.getBooks();
        
        expect(books.length).toEqual(0);
        expect(books).toEqual([]);
    });

    it("should throw an error if fetching the user ID fails", async() => {
        fetchMock.mockResolvedValueOnce({
            ok: false,
            status: 401,
            statusText: "Unauthorized",
        } as Response);

        await expect(hardcoverApi.getBooks()).rejects.toThrow("Error fetching user ID from Hardcover: 401 Unauthorized");
        expect(fetchMock).toHaveBeenCalledTimes(1);
    });

    it("should throw an error if fetching books fails", async() => {
        const mockUserIdResponse = {
            data: {
                me: [{ id: 12345 }]
            }
        };

        fetchMock
            .mockResolvedValueOnce({
                ok: true,
                json: async () => mockUserIdResponse,
            } as Response)
            .mockResolvedValueOnce({
                ok: false,
                status: 500,
                statusText: "Internal Server Error",
            } as Response);

        await expect(hardcoverApi.getBooks()).rejects.toThrow("Error fetching books from Hardcover: 500 Internal Server Error");
        expect(fetchMock).toHaveBeenCalledTimes(2);
    });

    it("should handle if the user ID fetch fails", async() => {
        const mockInvalidResponse = {
            data: {
                me: []
            }
        };

        fetchMock.mockResolvedValueOnce({
            ok: true,
            json: async () => mockInvalidResponse,
        } as Response);

        await expect(hardcoverApi.getBooks()).rejects.toThrow("Error fetching user ID from Hardcover");
    });

    it("should handle if the books response is invalid", async() => {
        const mockUserIdResponse = {
            data: {
                me: [{ id: 12345 }]
            }
        };

        const mockInvalidResponse = {
            data: {}
        };

        fetchMock
            .mockResolvedValueOnce({
                ok: true,
                json: async () => mockUserIdResponse,
            } as Response)
            .mockResolvedValueOnce({
                ok: true,
                json: async () => mockInvalidResponse,
            } as Response);

        await expect(hardcoverApi.getBooks()).rejects.toThrow("Error fetching books from Hardcover");
    });

    it("should handle books with multiple authors", async() => {
        const mockUserIdResponse = {
            data: {
                me: [{ id: 12345 }]
            }
        };

        const mockBooksResponse = {
            data: {
                user_books: [
                    {
                        book: {
                            title: "Good Omens",
                            contributions: [
                                { author: { name: "Terry Pratchett" } },
                                { author: { name: "Neil Gaiman" } }
                            ]
                        }
                    }
                ]
            }
        };

        fetchMock
            .mockResolvedValueOnce({
                ok: true,
                json: async () => mockUserIdResponse,
            } as Response)
            .mockResolvedValueOnce({
                ok: true,
                json: async () => mockBooksResponse,
            } as Response);

        const books = await hardcoverApi.getBooks();
        
        expect(books.length).toEqual(1);
        expect(books[0]).toEqual({
            title: "Good Omens",
            author: "Terry Pratchett, Neil Gaiman"
        });
    });

});