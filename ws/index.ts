import { Message } from '@prisma/client';
import { createMessage } from './../dbOperation/message';
import { findAnyApply, findAnyFriend, findRefuseApply, findFriendList, findTwo } from './../dbOperation/friend';
import { findUser } from './../dbOperation/user'
import {
  createAllMessageString,
  findAllMessage,
} from './../dbOperation/allMessage'
import { Server, Socket } from 'socket.io'
import { server } from '../server'
import { Friend, User } from '@prisma/client'
import { DefaultEventsMap } from 'socket.io/dist/typed-events'
import { log } from 'console';


const io = new Server(server, {
  transports: ['websocket'],
})
io.listen(3558)

//用来保存socket与用户id的映射
const socketMapId = new Map()

//用来保存用户id与用户之间的映射
const userIdMapUser = new Map()

//用来保存用户id与socket的映射
const userIdMapSocket = new Map()

//用来保存消息对应的用户ID
const MessageUsersId = new Set<number>()

//用来保存消息对应的用户信息
const messageMapUser = new Map()

//用来保存全部链接
const sockets: Socket<
  DefaultEventsMap,
  DefaultEventsMap,
  DefaultEventsMap,
  any
>[] = []

/* io.on('connection',async(socket)=>{
  
  sockets.push(socket)
  //断开连接就移除映射
  socket.on('disconnect',()=>{
    if(socketMapId.has(socket)){
      const id=socketMapId.get(socket)
      socketMapId.delete(socket)
      userIdMapSocket.delete(id)
      userIdMapUser.delete(id)
    }
    //每退出一个就要发送一遍
    //遍历每个链接发送数据
    const index=sockets.indexOf(socket)
    sockets.splice(index,1)
    sockets.forEach((socket,id)=>{
      socket.emit('id_user',Object.fromEntries(userIdMapUser.entries()))
    })
  })
  
  //接收用户信息并与socketId映射
  socket.on('id_map_user',(user:User)=>{
    socketMapId.set(socket,user.id)
    userIdMapUser.set(user.id,user)
    userIdMapSocket.set(user.id,socket)
    //遍历每个链接发送数据
    sockets.forEach((socket,id)=>{
      socket.emit('id_user',Object.fromEntries(userIdMapUser.entries()))
    })
  })

  //接收群聊文本消息
  socket.on('all_text_message',async(data:{userId:number,content:string})=>{
    await createAllMessageString(data)
    const all=await findAllMessage()
    //发送群聊消息
    sockets.forEach((socket,id)=>{
      socket.emit('message_all',all)
      socket.emit('message_user',Object.fromEntries(messageMapUser.entries()))
    })
  })

  //连接就发送全部消息
  const all=await findAllMessage()
  const usersId=all.map(msg=>msg.userId)
  
  usersId.forEach(id=>{
    if(!MessageUsersId.has(id)){
      MessageUsersId.add(id)
    }
  })
  //遍历消息对应的id
  MessageUsersId.forEach(async(id)=>{
    if(!messageMapUser.has(id)){
      const user=await findUser(id)
      messageMapUser.set(id,user)
    }
  })
  //发送群聊消息
  if(sockets.length>0){
    sockets.forEach(socket=>{
      socket.emit('message_user',Object.fromEntries(messageMapUser.entries()))
      socket.emit('message_all',all)
    })
  }
  
}) */

io.on('connection', async (socket) => {
  sockets.push(socket)
  //断开连接就移除映射
  socket.on('disconnect', () => {
    if (socketMapId.has(socket)) {
      const id = socketMapId.get(socket)
      socketMapId.delete(socket)
      userIdMapSocket.delete(id)
      userIdMapUser.delete(id)
    }
    //每退出一个就要发送一遍
    //遍历每个链接发送数据
    const index = sockets.indexOf(socket)

    io.sockets.emit('id_user', Object.fromEntries(userIdMapUser.entries()))
  })

  //接收用户信息并与socketId映射
  socket.on('id_map_user', (user: User) => {
    socketMapId.set(socket, user.id)
    userIdMapUser.set(user.id, user)
    userIdMapSocket.set(user.id, socket)
    //遍历每个链接发送数据

    io.sockets.emit('id_user', Object.fromEntries(userIdMapUser.entries()))
  })

  //接收群聊文本消息
  socket.on(
    'all_text_message',
    async (data: { userId: number; content: string }) => {
      await createAllMessageString(data)
      const all = await findAllMessage()
      //发送群聊消息
      io.sockets.emit('message_all', all)
      io.sockets.emit(
        'message_user',
        Object.fromEntries(messageMapUser.entries())
      )
    }
  )

  //连接就发送全部消息
  const all = await findAllMessage()
  const usersId = all.map((msg) => msg.userId)

  usersId.forEach((id) => {
    if (!MessageUsersId.has(id)) {
      MessageUsersId.add(id)
    }
  })
  //遍历消息对应的id
  MessageUsersId.forEach(async (id) => {
    if (!messageMapUser.has(id)) {
      const user = await findUser(id)
      messageMapUser.set(id, user)
    }else{
      const user = await findUser(id)
      messageMapUser.set(id, user)
    }
  })
  //发送群聊消息

  io.sockets.emit('message_user', Object.fromEntries(messageMapUser.entries()))
  io.sockets.emit('message_all', all)

  //客户端发起好友请求
  socket.on('send_friend_apply',async(id:number)=>{
    const other=userIdMapSocket.get(id)
    if(other){
      const res=await findAnyFriend(id)
      other.emit('friend_applications',res)
    }
  })

  /* //客户端发起接收发送的好友请求
  socket.on('get_friend_apply',async(id:number)=>{
    const my=userIdMapSocket.get(id)
    if(my){
      const res=await findAnyApply(id)
      let data:Array<Friend&{User:User}>=[]
      for(let item of res){
        const User=await findUser(item.otherId!)
        data.push({...item,User:User!}) 
      }
      my.emit('send_friend_record',data)
    }
  }) */

  socket.on('refuse_friend_apply',async(id:number)=>{
    const my=userIdMapSocket.get(id)
    if(my){
      const res=await findRefuseApply(id)
      my.emit('refuse_friend_record',res)
    }
  })

  //获取好友列表
  socket.on('get_friend_list',async(id:number)=>{
    const res=await findFriendList(id)
    socket.emit('get_friend_list',res)
  })

  //发送私聊消息
  socket.on('send_private_message',async(data:{friendId:Friend['id'],content:string,userId:number})=>{
    await createMessage(data)
    const res2=await findTwo(data.friendId)
    const id1=res2!.following.id
    const id2=res2!.follower.id
    const user=userIdMapSocket.get(id1)
    const res=await findFriendList(id1)
    user.emit('get_friend_list',res)

    const other=userIdMapSocket.get(id2)
    const res3=await findFriendList(id2)
    other.emit('get_friend_list',res3)
  })
})
