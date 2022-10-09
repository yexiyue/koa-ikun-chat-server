import { AllMessage, PrismaClient } from '@prisma/client';
import { prisma } from './user';

export const createAllMessageString=async(data:Pick<AllMessage,'content'|'userId'>)=>{
  try {
    const res=await prisma.allMessage.create({
      data
    })
    return res
  } catch (error) {
    return Promise.reject(error)
  }
}

export const createAllMessageImage=async(data:Pick<AllMessage,'image'|'userId'>)=>{
  try {
    const res=await prisma.allMessage.create({
      data
    })
    return res
  } catch (error) {
    return Promise.reject(error)
  }
}

export const findAllMessage=async ()=>{
  try {
    const res=await prisma.allMessage.findMany()
    return res
  } catch (error) {
    return Promise.reject(error)
  }
}