import { Middleware } from 'koa';
export const errorMiddleware:Middleware=async (ctx,next)=>{
  try {
    await next()
  } catch (error:any) {
    console.log(error)
    ctx.status=403
    ctx.body={
      data:error.error,
      meta:{
        status:403,
        msg:error.msg
      }
    }
  }
}