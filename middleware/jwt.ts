import { getUser } from './../dbOperation/user'
import JWT from 'jsonwebtoken'
import { Middleware } from 'koa'

const whiteList = ['/api/user', '/api/user/register','/api/count']

export const verifyMiddleware: Middleware = async (ctx, next) => {
  if (whiteList.includes(ctx.path)) {
    await next()
  } else {
    const token = ctx.headers.authorization
    if (token) {
      const user = JWT.verify(token!, '123456') as {
        username: string
        email: string
        password: string
        iat: number
      }
      if (user) {
        const res = await getUser(user.email)
        if (res?.password == user.password) {
          await next()
        } else {
          ctx.status = 403
          ctx.body = {
            data: null,
            meta: {
              status: 401,
              msg: '用户鉴权失败,密码错误',
            },
          }
        }
      }
    } else {
      ctx.status = 403
      ctx.body = {
        data: null,
        meta: {
          status: 401,
          msg: '用户鉴权失败',
        },
      }
    }
  }
}
