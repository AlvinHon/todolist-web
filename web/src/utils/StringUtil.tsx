function shorterString(str: string, maxLength: number): string {
    return str.length > maxLength ? str.substring(0, maxLength) + "..." : str;
}

export { shorterString };