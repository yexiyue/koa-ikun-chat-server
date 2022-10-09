import { getUser, findUser, findUserCount, modifyUserDescription, modifyUserAvatar, findUserAny } from './../dbOperation/user';
import Router from "koa-router";
import JWT from 'jsonwebtoken'
import { createUser } from "../dbOperation/user";

export const userRouter=new Router()

userRouter.prefix('/api')

userRouter.post('/user/register',async(ctx,next)=>{
    try {
      const query=ctx.request.body
      const token=JWT.sign(query,'123456')
      const res=await createUser({...query,token:token})
      ctx.status=201
      ctx.body={
        data:res,
        meta:{
          msg:'注册成功',
          status:201
        }
      }
    } catch (error) {
      return Promise.reject({error:error,msg:'用户名或邮箱已被注册'})
    }
})

userRouter.post('/user',async (ctx)=>{
  try {
    const query=ctx.request.body
    const res=await getUser(query.email)
    if(res?.password===query.password){
      ctx.body={
        data:res,
        meta:{
          status:200,
          msg:'登录成功'
        }
      }
    }else{
      ctx.status=403
      ctx.body={
        data:null,
        meta:{
          status:403,
          msg:'账号或密码错误'
        }
      }
    }
  } catch (error) {
    return Promise.reject({
      error:error,
      msg:"登录失败"
    })
  }
})

userRouter.post('/user/:id',async (ctx)=>{
  try {
    const data:any=ctx.request.body
    let res:any,res2:any
    if(data){
      res=await modifyUserDescription(+ctx.params.id,{
        description:data.description,
      })
    }
    if(ctx.request.files){
      res2=await modifyUserAvatar(+ctx.params.id,{
        avatar:(ctx.request.files!.file as any).newFilename
      })
    }
    ctx.status=201
    ctx.body={
      data:{...res,...res2},
      meta:{
        status:201,
        msg:'修改成功'
      }
    }
  } catch (error) {
    return Promise.reject({
      error:error,
      msg:"修改失败"
    })
  }
})

userRouter.get('/user/:id',async(ctx)=>{
  try {
    const id=ctx.params.id
    const res=await findUser(+id)
    ctx.status=200
    ctx.body={
      data:res,
      meta:{
        status:200,
        msg:'查找成功'
      }
    }
  } catch (error) {
    return Promise.reject({
      error:error,
      msg:"查找失败"
    })
  }
})

userRouter.get('/count',async(ctx)=>{
  ctx.body={
    data:await findUserCount(),
    meta:{
      status:200,
      msg:'查找成功'
    }
  }
})

userRouter.post('/search',async(ctx)=>{
  try {
    const username=ctx.request.body.username
    const res=await findUserAny(username)
    ctx.status=200
    ctx.body={
      data:res,
      meta:{
        status:200,
        msg:'查找成功'
      }
    }
  } catch (error) {
    return Promise.reject({
      error:error,
      msg:"查找失败"
    })
  }
})
