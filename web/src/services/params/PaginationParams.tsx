
class PaginationParams {
    page: number;
    limit: number;

    constructor(args: { page: number, limit: number }) {
        this.page = args.page;
        this.limit = args.limit;
    }
}

export default PaginationParams;