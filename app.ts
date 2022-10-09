import { errorMiddleware } from './middleware/error';
import { verifyMiddleware } from './middleware/jwt';
import  KoaStatic  from 'koa-static';
import  Koa  from 'koa';
import koaBody from 'koa-body';
import koaCors from 'koa-cors'
import {resolve} from 'path'
import { userRouter } from './router/user';
import { router } from './router/friend';
export const app=new Koa()
app.use(koaBody(
  {
    multipart:true,
    formidable:{
      uploadDir:'./public',
      keepExtensions:true
    }
  }
))
app.use(koaCors())
app.use(KoaStatic(resolve(__dirname,'public')))
app.use(errorMiddleware)
app.use(verifyMiddleware)
app.use(userRouter.routes())
app.use(router.routes())



