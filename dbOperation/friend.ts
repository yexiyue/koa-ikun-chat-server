import { Friend, PrismaClient ,User} from "@prisma/client";

import { prisma } from './user';

export const addFriend=async(data:Pick<Friend,'userId'|'otherId'>)=>{
  try {
    return await prisma.friend.create({
      data
    })
  } catch (error) {
    console.log(error)
    return Promise.reject(error)
  }
}

export const findAnyFriend=async (data:Friend['otherId'])=>{
  try {
    return await prisma.friend.findMany({
      where:{
        otherId:data,
        isFriend:false,
        isRefuse:false
      },
      include:{
        follower:true
      }
    })
  } catch (error) {
    console.log(error)
    return Promise.reject(error)
  }
}

export const findAnyApply=async (data:Friend['userId'])=>{
  try {
    return await prisma.friend.findMany({
      where:{
        userId:data,
        isFriend:false,
        isRefuse:false
      },
      include:{
        following:true
      }
    })
  } catch (error) {
    console.log(error)
    return Promise.reject(error)
  }
}

export const updateFriendApply=async (data:Pick<Friend,"isFriend"|"isRefuse"|"id">)=>{
  try {
    return await prisma.friend.update({
      where:{
        id:data.id
      },
      data:{
        isFriend:data.isFriend,
        isRefuse:data.isRefuse
      }
    })
  } catch (error) {
    console.log(error)
    return Promise.reject(error)
  }
}

export const findFriendList=async (data:User['id'])=>{
  try {
    const res1=await prisma.friend.findMany({
      where:{
        userId:data,
        isFriend:true
      },
      include:{
        following:true,
        messages:true
      }
    })
    const res2=await prisma.friend.findMany({
      where:{
        otherId:data,
        isFriend:true
      },
      include:{
        follower:true,
        messages:true
      }
    })
    return [...res1,...res2]
  } catch (error) {
    console.log(error)
    return Promise.reject(error)
  }
}

export const findRefuseApply=async (data:Friend['userId'])=>{
  try {
    return await prisma.friend.findMany({
      where:{
        userId:data,
        isFriend:false,
        isRefuse:true
      },
      include:{
        following:true
      }
    })
  } catch (error) {
    console.log(error)
    return Promise.reject(error)
  }
}


export const findTwo=async(id:number)=>{
  try {
    return await prisma.friend.findUnique({
      where:{
        id
      },
      include:{
        following:true,
        follower:true
      }
    })
  } catch (error) {
    console.log(error)
    return Promise.reject(error)
  }
}