declare type TODO = any;

/** @link source: https://stackoverflow.com/a/55032655/19535085 */
declare type Modify<T, R> = Omit<T, keyof R> & R; 
/** @link source: https://stackoverflow.com/a/72075415 */
declare type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;