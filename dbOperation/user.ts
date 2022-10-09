import {PrismaClient,User} from '@prisma/client'
export const prisma=new PrismaClient()

export const createUser=async (data:User)=>{
  try {
    const user=await prisma.user.create({
      data
    })
    return user
  } catch (error:any) {
    return Promise.reject(error)
  }
}

export const getUser=async (email:User['email'])=>{
  try {
    const user=await prisma.user.findUnique({
      where:{
        email
      },
      /* include:{
        friends:{
          include:{
            messages:true
          }
        }
      } */
    })
    return user
  } catch (error) {
    return Promise.reject(error)
  }
}

export const modifyUserAvatar=async (id:User['id'],data:Pick<User,'avatar'>)=>{
  
  try {
    const user=await prisma.user.update({
      where:{
        id
      },
      data
    })
    return user
  } catch (error) {
    return Promise.reject(error)
  }
}
export const modifyUserDescription=async (id:User['id'],data:Pick<User,'description'>)=>{
  
  try {
    const user=await prisma.user.update({
      where:{
        id
      },
      data
    })
    return user
  } catch (error) {
    return Promise.reject(error)
  }
}
export const findUser=async (id:User['id'])=>{
  try {
    const user=await prisma.user.findUnique({
      where:{
        id
      }
    })
    return user
  } catch (error) {
    return Promise.reject(error)
  }
}

export const findUserCount=async ()=>{
  try {
    const userCount=await prisma.user.count()
    return userCount
  } catch (error) {
    return Promise.reject(error)
  }
}

export const findUserAny=async(username:User['username'])=>{
  try {
    const userAny=await prisma.user.findMany({
      where:{
        username
      }
    })
    
    return userAny
  } catch (error) {
    return Promise.reject(error)
  }
}