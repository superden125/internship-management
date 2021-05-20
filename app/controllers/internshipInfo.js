import InternshipInfo from "../models/internshipInfo";
import InternshipUnit from "../models/internshipUnit";
import Milestone from "../models/milestone"
import User from "../models/user";
import {getNameTinh} from "../lib/tinh";
import {status} from "../lib/convert"

export async function getInternshipInfo(req, res) {
  const idSv = req.session.user.userId;
  let data = {
    title: "Internship Management System",
    roleName: "Sinh viên",
    urlInfo: "Thông tin thực tập",
    internInfo: {},
    internUnit: {},
    teacher: {}
  };

  const milestones = await Milestone.find({}).limit(12).sort({endRegister: -1})
  data.milestones = milestones
  
  if(milestones.length === 0) return res.render(
      "student/home",
      Object.assign(data, {
        error: { err: true, msg: "Not found semester" },
      })
  );
  let schoolYears = []
  milestones.forEach((val)=>{
    schoolYears.push(val.schoolYear)
  })
  data.schoolYears = schoolYears.filter((val,i,a)=>a.indexOf(val)===i)  

  const internInfo = await InternshipInfo.findOne({ idSv, idMilestone: milestones[0]._id })
  
  if (!internInfo)
    return res.render(
      "student/home",
      Object.assign(data, {
        error: { err: true, msg: "Not found Intern Info" },
      })
    );

  const internUnit = await InternshipUnit.findById(internInfo.idIntern);

  if (!internUnit)
    return res.render(
      "student/home",
      Object.assign(data, {
        error: { err: true, msg: "Not found Intern Info" },
      })
    );
  const city =  getNameTinh(internUnit.city)
  internUnit.city = city;
  internInfo.statusStr = status[parseInt(internInfo.status)]

  data.internInfo = internInfo
  data.internUnit = internUnit
  
  if (internInfo.idGv) {
    const teacher = await User.findById(internInfo.idGv);
    data.teacher = teacher;
  }
  
  data.error = { err: false };
  res.render("student/home", data);
}

export async function getInternInfo(req,res){
  
  const {semester, schoolYear} = req.query
  const idSv = req.session.user.userId
  let data = {}

  const milestone = await Milestone.findOne({semester, schoolYear})
  if(!milestone) return res.json({success: false, msg: "milestone not found"})  

  const internInfo = await InternshipInfo.findOne({idSv, idMilestone: milestone._id})
  if(!internInfo) return res.json({success: false, msg: "internship info not found"})
  

  const internUnit = await InternshipUnit.findById(internInfo.idIntern)
  if(!internUnit) return res.json({success: false, msg: "internship unit not found"})

  const city =  getNameTinh(internUnit.city)
  internUnit.city = city;
  data.statusStr = status[parseInt(internInfo.status)]

  data.internInfo = internInfo
  data.internUnit = internUnit  
  
  if(internInfo.idGv){
    const teacher = await User.findById(internInfo.idGv)
    data.teacher = teacher
  }

  res.json({success:true, data})
}