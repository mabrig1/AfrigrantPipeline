import mongoose, { Schema } from 'mongoose'
const schema = new Schema({
 ownerId:{type:String,required:true,index:true},
 title:{type:String,required:true},abstract:{type:String,required:true},author:{type:String,required:true},
 body:{type:String,required:true},license:{type:String,default:'All Rights Reserved'},
 status:{type:String,enum:['draft','awaiting_approval','published'],default:'draft'},
 publishedAt:Date,
 audit:[{action:String,at:Date,actor:String}]
},{timestamps:true})
export default mongoose.models.PublishingJob || mongoose.model('PublishingJob',schema)
