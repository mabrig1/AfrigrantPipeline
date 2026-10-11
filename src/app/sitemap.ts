import type { MetadataRoute } from 'next'
import { connectDB } from '@/lib/mongodb'
import PublishingJob from '@/models/PublishingJob'
export const dynamic='force-dynamic'
export default async function sitemap():Promise<MetadataRoute.Sitemap>{
 const base='https://www.afrigrantpipeline.com'
 const pages:MetadataRoute.Sitemap=[{url:base},{url:base+'/publications/building-africas-open-research-infrastructure'}]
 try{
  await connectDB()
  const records=await PublishingJob.find({status:'published'}).select('_id updatedAt').sort({_id:1}).limit(45000).lean() as {_id:unknown,updatedAt?:Date}[]
  return [...pages,...records.map(record=>({url:base+'/publications/record/'+String(record._id),lastModified:record.updatedAt}))]
 }catch{
  console.error('Publication sitemap: database unavailable')
  return pages
 }
}
