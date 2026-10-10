import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { auth } from '@/lib/auth'
const schema=z.object({message:z.string().min(1).max(4000)})
export async function POST(req:NextRequest){
 const session=await auth()
 if(!session?.user?.id)return NextResponse.json({error:'Unauthorized'},{status:401})
 const parsed=schema.safeParse(await req.json().catch(()=>null))
 if(!parsed.success)return NextResponse.json({error:'Invalid message'},{status:400})
 const message=parsed.data.message.toLowerCase()
 const reply=message.includes('publish')?'To publish, first save a manuscript draft, then obtain editorial approval. Publication requires an authorized editor.':message.includes('citation')?'References require verification against authoritative metadata. DOI syntax alone is not proof of validity.':'I can guide manuscript preparation, submission, editorial approval and publication. Draft creation is available through the publishing API; AI generation and external ChatGPT actions are not connected yet.'
 return NextResponse.json({reply,automated:false})
}
