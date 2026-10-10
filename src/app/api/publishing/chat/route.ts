import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { auth } from '@/lib/auth'
import { connectDB } from '@/lib/mongodb'
import PublishingJob from '@/models/PublishingJob'

// Structured chatbot actions. Free-form messages never authorize publication.
const requestSchema=z.discriminatedUnion('action',[
 z.object({action:z.literal('help')}),
 z.object({action:z.literal('list_drafts')}),
 z.object({action:z.literal('create_draft'),confirm:z.literal(true),manuscript:z.object({
   title:z.string().min(10).max(300),author:z.string().min(2).max(200),
   abstract:z.string().min(100).max(10000),body:z.string().min(200).max(500000),
   license:z.enum(['CC BY','CC BY-SA','CC BY-NC','CC BY-ND','CC0','All Rights Reserved']).default('All Rights Reserved')
 })})
])
export async function POST(req:NextRequest){
 const session=await auth()
 if(!session?.user?.id)return NextResponse.json({error:'Please sign in first.'},{status:401})
 const parsed=requestSchema.safeParse(await req.json().catch(()=>null))
 if(!parsed.success)return NextResponse.json({error:'Invalid assistant action',details:parsed.error.flatten()},{status:400})
 const request=parsed.data
 if(request.action==='help')return NextResponse.json({reply:'I can create a manuscript draft and list your drafts. Only the verified platform owner can approve and publish from the editorial workspace. I cannot independently verify references or peer-review papers.',automated:false})
 await connectDB()
 if(request.action==='list_drafts'){
  const docs=await PublishingJob.find({ownerId:session.user.id}).select('title status createdAt').sort({createdAt:-1}).limit(20).lean()
  return NextResponse.json({reply:`Found ${docs.length} recent submissions.`,submissions:docs,automated:true})
 }
 const manuscript=request.manuscript
 const job=await PublishingJob.create({...manuscript,ownerId:session.user.id,status:'draft',audit:[{action:'assistant_draft_created',actor:session.user.id,at:new Date()}]})
 return NextResponse.json({reply:'Manuscript saved as a private draft. An authorized editor must approve it before publication.',id:String(job._id),status:'draft',automated:true},{status:201})
}
