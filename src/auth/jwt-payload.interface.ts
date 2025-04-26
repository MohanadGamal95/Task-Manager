export interface JwtPayload {
  username: string;
}

/* 
*** YOU CANNOT STORE SENSETIVE INFO IN JWT ***
since it can easily be dedcoded, so no password 
*/
