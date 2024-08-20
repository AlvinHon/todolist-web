
class SortParams {
    sortBy: string;
    direction: string;

    constructor(args: { sortBy: string, direction: string }) {
        this.sortBy = args.sortBy;
        this.direction = args.direction;
    }
}

export default SortParams;