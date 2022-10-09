import {createServer} from 'http'
import { app } from "./app"
import './ws/index'
export const server=createServer(app.callback())

server.listen(3557,()=>{
  console.log('server start http://localhost:3557/api')
})