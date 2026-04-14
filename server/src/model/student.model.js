import mongoose from "mongoose"
const studentSchema=new mongoose.Schema({
  name:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User"
  },
  class:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User"
  },
  actualCGPA:{
    
  }
},
{
timestamps:true
})
export const Student=mongoose.model("Student",studentSchema)