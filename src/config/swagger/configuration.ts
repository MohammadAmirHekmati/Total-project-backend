import { registerAs } from '@nestjs/config';

export default registerAs("swagger",()=>({
  title:"Total Project",
  description:"Total Project APIS",
  version:"1.0",
  tag:"Total",
  authOptionsType:"http",
  authOptionsScheme:"bearer",
  authOptionsFormat:"JWT",
  authOptionsIn:"header",
  bearerAuthName:"access-token",
  prefix:"docs"
}))