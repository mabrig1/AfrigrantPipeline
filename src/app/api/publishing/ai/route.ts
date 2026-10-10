import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import { z } from 'zod'
import { auth } from '@/lib/auth'

export const runtime='nodejs'
const schema=z.object({
 messages:z.array(z.object({role:z.enum(['user','assistant']),content:z.string().min(1).max(5000)})).min(1).max(12)
})
const system=`You are the AfriPublish scholarly publishing assistant. Guide authors through metadata, citation verification, ethics declarations, rights and licenses, and the platform's editorial workflow. Be transparent that repository posting is not peer-reviewed journal publication. Never claim a DOI, indexed publication, peer review, acceptance, or citation verification without independent evidence. Never fabricate citations, datasets, or findings. Never request API keys or private credentials. You cannot create, approve, or publish a manuscript via this chat. Direct the user to the explicit confirmation form to create a draft and the owner-only editorial workflow for publication. Keep replies concise.`
export async function POST(req:NextRequest){
 const session=await auth()
 if(!session?.user?.id)return NextResponse.json({error:'Sign in required'},{status:401})
 if(!process.env.OPENAI_API_KEY)return NextResponse.json({error:'AI assistant not configured'},{status:503})
 const parsed=schema.safeParse(await req.json().catch(()=>null))
 if(!parsed.success)return NextResponse.json({error:'Invalid conversation'},{status:400})
 try{
  const client=new OpenAI({apiKey:process.env.OPENAI_API_KEY,timeout:20000,maxRetries:1})
  const result=await client.chat.completions.create({
   model:process.env.PUBLISHING_AI_MODEL||'gpt-4o-mini',
   temperature:0.2,max_tokens:500,
   messages:[{role:'system',content:system},...parsed.data.messages]
  })
  return NextResponse.json({reply:result.choices[0]?.message?.content||'No response available.',automated:false})
 }catch{
  return NextResponse.json({error:'AI service unavailable. Please retry.'},{status:502})
 }
}
