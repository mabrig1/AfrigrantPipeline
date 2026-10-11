import { NextRequest, NextResponse } from 'next/server'
import mongoose from 'mongoose'
import { auth } from '@/lib/auth'
import { connectDB } from '@/lib/mongodb'
import PublishingJob from '@/models/PublishingJob'
export async function GET(_request:NextRequest,{params}:{params:Promise<{id:string}>}){
 const session=await auth()
 if(!session?.user?.id)return NextResponse.json({error:'Sign in required'},{status:401})
 const {id}=await params
 if(!mongoose.isValidObjectId(id))return NextResponse.json({error:'Not found'},{status:404})
 await connectDB()
 const job=await PublishingJob.findOne({_id:id,...(!session.user.verifiedOwner?{ownerId:session.user.id}:{})}).lean()
 if(!job)return NextResponse.json({error:'Not found'},{status:404})
 return NextResponse.json({job},{headers:{'Cache-Control':'private, no-store'}})
}
