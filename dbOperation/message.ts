import { prisma } from './user';
import { PrismaClient,Message, Friend} from "@prisma/client";


export const createMessage=async(data:{friendId:number,content:string,userId:number})=>{
  try {
    return await prisma.message.create({
      data:{
        content:data.content,
        userId:data.userId,
        Friend:{
          connect:{
            id:data.friendId
          }
        }
      },
    })
  } catch (error) {
    console.log(error)
    return Promise.reject(error)
  }
}