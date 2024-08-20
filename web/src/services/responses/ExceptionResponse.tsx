class ExceptionResponse {
    error: string;

    constructor(args: { error: string }) {
        this.error = args.error;
    }
}

export default ExceptionResponse;