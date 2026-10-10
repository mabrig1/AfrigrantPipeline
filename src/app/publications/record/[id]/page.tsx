import { notFound } from 'next/navigation'
import mongoose from 'mongoose'
import { connectDB } from '@/lib/mongodb'
import PublishingJob from '@/models/PublishingJob'
export const dynamic='force-dynamic'
export async function generateMetadata({params}:{params:Promise<{id:string}>}){
 const {id}=await params
 if(!mongoose.isValidObjectId(id))return {title:'Publication not found'}
 await connectDB()
 const doc=await PublishingJob.findOne({_id:id,status:'published'}).select('title abstract author').lean() as {title:string,abstract:string,author:string}|null
 return doc?{title:doc.title,description:doc.abstract,authors:[{name:doc.author}],robots:{index:true,follow:true}}:{title:'Publication not found',robots:{index:false}}
}
export default async function Page({params}:{params:Promise<{id:string}>}){
 const {id}=await params
 if(!mongoose.isValidObjectId(id))notFound()
 await connectDB()
 const doc=await PublishingJob.findOne({_id:id,status:'published'}).lean() as {title:string,abstract:string,author:string,body:string,license:string,publishedAt?:Date}|null
 if(!doc)notFound()
 return <main className="min-h-screen bg-background text-foreground"><article className="mx-auto max-w-3xl px-5 py-14"><p className="text-sm font-semibold text-primary">AfriPublish · Public manuscript</p><h1 className="mt-5 text-3xl font-bold leading-tight">{doc.title}</h1><p className="mt-4 text-muted-foreground">{doc.author} · {doc.publishedAt?new Date(doc.publishedAt).toLocaleDateString('en-GB'):'Undated'}</p><p className="mt-2 text-xs text-muted-foreground">Repository publication; peer-review status not verified. No DOI assigned.</p><section className="mt-10 rounded-xl border border-border bg-card p-6"><h2 className="text-xl font-semibold">Abstract</h2><p className="mt-3 whitespace-pre-wrap leading-7">{doc.abstract}</p></section><section className="mt-10"><h2 className="text-xl font-semibold">Full text</h2><div className="mt-5 whitespace-pre-wrap break-words leading-8">{doc.body}</div></section><p className="mt-10 border-t border-border pt-4 text-sm text-muted-foreground">License: {doc.license}</p></article></main>
}
