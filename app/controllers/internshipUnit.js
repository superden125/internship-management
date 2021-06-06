import mongoose from 'mongoose'
import InternshipUnit from "../models/internshipUnit";
import Milestone from "../models/milestone"
import {getNameTinh} from '../lib/tinh'
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
    let {schoolYear, semester} = query
    console.log("query", query)
    delete query.schoolYear
    delete query.semester
    if(!query.introBy) query.introBy = null
    if(schoolYear && semester){
        const milestone = await Milestone.findOne({schoolYear, semester})
        if(!milestone) return res.json({success: false, msg: "Not found milestone"})
        query.idMilestone = milestone._id
        
    }
    const internshipUnits = await InternshipUnit.find(query)
    internshipUnits.forEach(internUnit=>{
      
      internUnit.city = getNameTinh(internUnit.city)
      
    })
    console.log("data", internshipUnits)
    res.json({success: true, data: internshipUnits})
  }
  
};
