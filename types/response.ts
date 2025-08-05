
export interface Response {
  status_code:number;
  message:string;
  data:<T>(data:T) => T;
}