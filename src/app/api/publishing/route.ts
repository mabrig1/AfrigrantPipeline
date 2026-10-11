import { checkPublishingOrigin, readPublishingBody } from '@/lib/publishing-request'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { auth } from '@/lib/auth'
import { connectDB } from '@/lib/mongodb'
import PublishingJob from '@/models/PublishingJob'
const input = z.object({title:z.string().trim().min(10).max(300),abstract:z.string().trim().min(100).max(10000),author:z.string().trim().min(2).max(200),body:z.string().trim().min(200).max(500000),license:z.enum(['CC BY','CC BY-SA','CC BY-NC','CC BY-ND','CC0','All Rights Reserved']).default('All Rights Reserved')})
export async function GET(request:NextRequest){
 const session=await auth()
 if(!session?.user?.id)return NextResponse.json({error:'Unauthorized'},{status:401})
 const editorial=request.nextUrl.searchParams.get('scope')==='editorial'
 if(editorial&&!session.user.verifiedOwner)return NextResponse.json({error:'Verified owner editorial authorization required'},{status:403})
 await connectDB()
 const jobs=await PublishingJob.find(editorial?{}:{ownerId:session.user.id}).select('title author status createdAt publishedAt ownerId abstract').sort({createdAt:-1}).limit(50).lean()
 return NextResponse.json({jobs,canEdit:session.user.verifiedOwner},{headers:{'Cache-Control':'private, no-store'}})
}
export async function POST(request:NextRequest){
 const denied=checkPublishingOrigin(request)
 if(denied)return denied
 const session=await auth()
 if(!session?.user?.id)return NextResponse.json({error:'Unauthorized'},{status:401})
 const parsed=input.safeParse(await readPublishingBody(request))
 if(!parsed.success)return NextResponse.json({error:'Invalid submission',details:parsed.error.flatten()},{status:400})
 await connectDB()
 const job=await PublishingJob.create({...parsed.data,ownerId:session.user.id,status:'draft',audit:[{action:'draft_created',actor:session.user.id,at:new Date()}]})
 return NextResponse.json({id:String(job._id),status:job.status},{status:201})
}
