import { NextResponse } from 'next/server'
export function checkPublishingOrigin(request:Request){
 const origin=request.headers.get('origin')
 if(origin&&origin!==new URL(request.url).origin)return NextResponse.json({error:'Invalid request origin'},{status:403})
 return null
}
// Bound bytes while streaming; Content-Length alone is not trustworthy.
export async function readPublishingBody(request:Request,limit=2100000):Promise<unknown>{
 if(!request.body)return null
 const reader=request.body.getReader()
 const chunks:Uint8Array[]=[]
 let size=0
 try{
  while(true){const {done,value}=await reader.read();if(done)break;size+=value.byteLength;if(size>limit){await reader.cancel();return null}chunks.push(value)}
  const bytes=new Uint8Array(size);let offset=0
  for(const chunk of chunks){bytes.set(chunk,offset);offset+=chunk.byteLength}
  return JSON.parse(new TextDecoder().decode(bytes))
 }catch{return null}finally{reader.releaseLock()}
}
