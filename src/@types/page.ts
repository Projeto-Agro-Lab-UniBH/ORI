export type Page<T> = {
  info: {
    length: number,
    size: string,
    lastPage: number,
    page: number,
    startIndex: number,
    endIndex: number
}
  results: Array<T>;
};