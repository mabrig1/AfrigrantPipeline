import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { auth } from '@/lib/auth'
import { connectDB } from '@/lib/mongodb'
import PublishingJob from '@/models/PublishingJob'
const input = z.object({title:z.string().min(10).max(300),abstract:z.string().min(100).max(10000),author:z.string().min(2).max(200),body:z.string().min(200).max(500000),license:z.enum(['CC BY','CC BY-SA','CC BY-NC','CC BY-ND','CC0','All Rights Reserved']).default('All Rights Reserved')})
export async function GET(){
 const session=await auth()
 if(!session?.user?.id)return NextResponse.json({error:'Unauthorized'},{status:401})
 await connectDB()
 const jobs=await PublishingJob.find({ownerId:session.user.id}).sort({createdAt:-1}).limit(50).lean()
 return NextResponse.json({jobs})
}
export async function POST(request:NextRequest){
 const session=await auth()
 if(!session?.user?.id)return NextResponse.json({error:'Unauthorized'},{status:401})
 const parsed=input.safeParse(await request.json().catch(()=>null))
 if(!parsed.success)return NextResponse.json({error:'Invalid submission',details:parsed.error.flatten()},{status:400})
 await connectDB()
 const job=await PublishingJob.create({...parsed.data,ownerId:session.user.id,status:'draft',audit:[{action:'draft_created',actor:session.user.id,at:new Date()}]})
 return NextResponse.json({id:String(job._id),status:job.status},{status:201})
}
