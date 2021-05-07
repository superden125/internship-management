import mongoose from 'mongoose'
import InternshipUnit from "../models/internshipUnit";

const ObjectId = mongoose.Types.ObjectId
module.exports = {
  getAllInternshipUnit: async (query) => {
    return await InternshipUnit.find(query);
  },
  getOneInternshipUnit: async (query) => {
    return await InternshipUnit.findOne(query);
  },
  getManyInternUnit: async (req,res)=>{
    let query = req.query
    if(!query.introBy) query.introBy = null
    const result = await InternshipUnit.find(query);
    
    res.json(result)
  }
  
};
