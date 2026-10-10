import mongoose, { Schema } from "mongoose";
const submission = new Schema({
  title: {type:String,required:true}, abstract:{type:String,required:true},
  authors:[{name:String,orcid:String}], references:[{citation:String,doi:String,verified:Boolean}],
  keywords:[String], manuscriptUrl:String, ownerId:{type:String,required:true,index:true},
  state:{type:String,enum:["submitted","screened","under_review","revision_requested","accepted","rejected","published"],default:"submitted"},
  screening:Schema.Types.Mixed, audit:[{at:Date,actor:String,action:String}]
},{timestamps:true});
export const PublishingSubmission = mongoose.models.PublishingSubmission || mongoose.model("PublishingSubmission",submission);
