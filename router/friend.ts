import { updateFriendApply, findFriendList } from './../dbOperation/friend';
import { Friend, User } from '@prisma/client';
import { findUser } from './../dbOperation/user';
import Router from "koa-router";
import { addFriend, findAnyApply, findAnyFriend } from "../dbOperation/friend";

export const router=new Router()
router.prefix('/api')

router.post('/friend/add',async (ctx)=>{
  try {
    const data=ctx.request.body
    const res=await addFriend(data)
    ctx.status=201
    ctx.body={
      data:res,
      meta:{
        status:201,
        msg:'成功发送好友请求'
      }
    }
  } catch (error) {
    console.log(error)
    return Promise.reject({
      error:error,
      msg:"添加失败"
    })
  }
})

router.get('/friend/friend/:id',async(ctx)=>{
  try {
    const res=await findAnyFriend(+ctx.params.id!)
    ctx.status=200
    ctx.body={
      data:res,
      meta:{
        status:200,
        msg:'成功查找好友请求'
      }
    }
  } catch (error) {
    console.log(error)
    return Promise.reject({
      error:error,
      msg:"查找失败"
    })
  }
})


router.get('/friend/apply/:id',async(ctx)=>{
  try {

    const res=await findAnyApply(+ctx.params.id!)
    /* let data:Array<Friend&{User:User}>=[]
    for(let item of res){
      const User=await findUser(item.otherId!)
      data.push({...item,User:User!}) 
    } */
    
    ctx.status=200
    ctx.body={
      data:res,
      meta:{
        status:200,
        msg:'成功查找好友请求'
      }
    }
  } catch (error) {
    console.log(error)
    return Promise.reject({
      error:error,
      msg:"查找失败"
    })
  }
})

router.post('/friend/apply',async(ctx)=>{
  try {

    const res=await findAnyApply(+ctx.request.body)
    /* let data:Array<Friend&{User:User}>=[]
    for(let item of res){
      const User=await findUser(item.otherId!)
      data.push({...item,User:User!}) 
    } */
    
    ctx.status=200
    ctx.body={
      data:res,
      meta:{
        status:200,
        msg:'成功查找好友请求'
      }
    }
  } catch (error) {
    console.log(error)
    return Promise.reject({
      error:error,
      msg:"查找失败"
    })
  }
})

router.post('/friend/update',async(ctx)=>{
  try{
    const data=ctx.request.body
    const res=await updateFriendApply(data)
    ctx.status=201
    ctx.body={
      data:res,
      meta:{
        status:201,
        msg:'成功更新好友请求'
      }
    }
  }catch(error){
    console.log(error)
    return Promise.reject({
      error:error,
      msg:"更新失败"
    })
  }
})

router.get('/friend/list/:id',async(ctx)=>{
  try{
    const id=ctx.params.id
    const res=await findFriendList(+id)
    ctx.status=200
    ctx.body={
      data:res,
      meta:{
        status:200,
        msg:'查找成功'
      }
    }
  }catch(error){
    console.log(error)
    return Promise.reject({
      error:error,
      msg:"查找失败"
    })
  }
})
