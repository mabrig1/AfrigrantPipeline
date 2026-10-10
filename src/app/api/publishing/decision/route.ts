import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import mongoose from 'mongoose'
import { auth } from '@/lib/auth'
import { connectDB } from '@/lib/mongodb'
import PublishingJob from '@/models/PublishingJob'

const input=z.object({id:z.string(),action:z.enum(['approve','publish'])})
export async function POST(req:NextRequest){
 const session=await auth()
 if(!session?.user?.id)return NextResponse.json({error:'Sign in required'},{status:401})
 if(!session.user.verifiedOwner)return NextResponse.json({error:'Verified owner editorial authorization required'},{status:403})
 const parsed=input.safeParse(await req.json().catch(()=>null))
 if(!parsed.success || !mongoose.isValidObjectId(parsed.data.id))return NextResponse.json({error:'Invalid request'},{status:400})
 const {id,action}=parsed.data
 const previous=action==='approve'?'draft':'awaiting_approval'
 const next=action==='approve'?'awaiting_approval':'published'
 await connectDB()
 const now=new Date()
 const update:Record<string,unknown>={$set:{status:next},$push:{audit:{action:action==='approve'?'editor_approved':'published',actor:session.user.id,at:now}}}
 if(action==='publish') (update.$set as Record<string,unknown>).publishedAt=now
 const job=await PublishingJob.findOneAndUpdate({_id:id,status:previous},update,{new:true})
 if(!job)return NextResponse.json({error:'Record not found or not in required state'},{status:409})
 return NextResponse.json({id:String(job._id),status:job.status,url:job.status==='published'?'/publications/record/'+job._id:undefined})
}
