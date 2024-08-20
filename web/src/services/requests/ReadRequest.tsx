import FilterParams from "../params/FilterParams";
import PaginationParams from "../params/PaginationParams";
import SortParams from "../params/SortParams";

class ReadRequest {
    pagination?: PaginationParams;
    sort?: SortParams;
    filter?: FilterParams;

    constructor(args: { pagination?: PaginationParams, sort?: SortParams, filter?: FilterParams }) {
        this.pagination = args.pagination;
        this.sort = args.sort;
        this.filter = args.filter;
    }
}

export default ReadRequest;