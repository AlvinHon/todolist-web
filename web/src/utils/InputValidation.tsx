import { FilterArgs } from "../types/Types";

function validStringOrUndefined(input: string): string | undefined {
    return input.trim() === '' ? undefined : input;
}

function validFilterArgsOrNull(input: FilterArgs): FilterArgs | null {
    return input.byStatus === undefined && input.byDueDate === undefined ? null : input;
}



export { validStringOrUndefined, validFilterArgsOrNull };