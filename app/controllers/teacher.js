import InternshipInfo from "../models/internshipInfo"
import InternshipUnit from "../models/internshipUnit"
import Teacher from "../models/teacher"
import Student from "../models/student"
import Milestone from '../models/milestone'

import {getNameTinh} from "../lib/tinh"
import {status} from "../lib/convert"


// [GET] /teacher/
export async function index (req, res) {

  const isCore = req.url.split("?")[0] == "/core"
  
  const data = {
    title: 'Internship Management System',
    roleName: 'Giáo viên',
    urlInfo: isCore ? 'Nhập kết quả thực tập' :'Đơn vị thực tập'
  }

  

  const idGv = req.session.user ? req.session.user.userId : "6071a6d733c2571d0778bdd5";
  const status = req.query.status ? req.body.status : 2
  const limit = req.query.limit ? req.query.limit : 10
  const skip = req.query.skip ? req.query.skip : 0
  const search = req.query.search ? req.query.search : ""

  const lookupStudent ={
    $lookup:{
      from: 'students',
      localField: "idSv",
      foreignField: "_id",
      as: "student"
    },
  }

  const lookupInternUnit = {
    $lookup: {
      from: "internshipunits",
      localField: "idIntern",
      foreignField: "_id",
      as: "internUnit"
    }    
  }

  const filter = {
    $match: {
      idGv: idGv
    }
  }

  const select = {
    $project: {
      _id: 1,
      idSv: 1,
      idGv: 1,
      idIntern: 1,
      shortId: 1,
      student: 1,
      internUnit: 1,
      core: 1
    }
  }

  const lasterMilestone = await Milestone.findOne().sort({endRegister:-1})
  const lasterYear = parseInt(lasterMilestone.semester.split('-')[0])
  const listSemester = [
    lasterMilestone.semester,
    `${lasterYear-1}-${lasterYear}`,
    `${lasterYear-2}-${lasterYear-1}`,
    `${lasterYear-3}-${lasterYear-2}`,
    `${lasterYear-4}-${lasterYear-3}`,
  ]
  console.log(listSemester)
  
  data.listSemester = listSemester

  InternshipInfo
    .aggregate([filter, lookupStudent, lookupInternUnit, {$unwind: "$student"}, {$unwind: "$internUnit"}, select])
    .exec((err, internInfos)=>{
      //console.log(internInfos)
      internInfos.forEach(intern => {
        intern.internUnit.cityName = getNameTinh(intern.internUnit.city)
      })
      data.internInfos = internInfos
      console.log(data.internInfos)

      isCore ? res.render('teacher/core', data) : res.render('teacher/index', data)
    })
}

export async function getInternshipInfo(req,res){
  const data = {
    title: 'Internship Management System',
    roleName: 'Giáo viên',
    urlInfo: 'Thông tin thực tập',
    
  }

  const idGv = req.session.user ? req.session.user.userId : "6071a6d733c2571d0778bdd5";

  const lookupStudent ={
    $lookup:{
      from: 'students',
      localField: "idSv",
      foreignField: "_id",
      as: "student"
    },    
  }

  const lookupInternUnit = {
    $lookup: {
      from: "internshipunits",
      localField: "idIntern",
      foreignField: "_id",
      as: "internUnit"
    }    
  }

  const filter = {
    $match: {
      idGv: idGv,
      shortId: req.params.id
    }
  }  
  InternshipInfo
    .aggregate([filter, lookupStudent, lookupInternUnit, {$unwind: "$student"}, {$unwind: "$internUnit"}])
    .exec((err, internInfos)=>{
      internInfos.forEach(intern => {
        intern.internUnit.cityName = getNameTinh(intern.internUnit.city)
        intern.statusStr = status[intern.status]
      })      
      data.internInfo = internInfos[0]
      
      res.render('teacher/internInfo', data)
    })

}

export async function saveManyCore(req,res){
  
  const data = req.body
  data.forEach((val)=>{
    if(val.core >=0 && val.core<=10)
    InternshipInfo.findById(val.id).updateOne({core:val.core}).then((val)=>{console.log(val)})
  })
  res.json({success:true})
}
export async function getManyInternInfo(req,res){
  const data = {students:[]}
  const idGv = req.session.user ? req.session.user.userId : "6071a6d733c2571d0778bdd5";
  const status = req.query.status ? req.body.status : 2
  const limit = req.query.limit ? req.query.limit : 10
  const skip = req.query.skip ? req.query.skip : 0
  const s = req.query.search ? req.query.search : ""

  const lookupStudent ={
    $lookup:{
      from: 'students',
      localField: "idSv",
      foreignField: "_id",
      as: "student"
    },
  }

  const lookupInternUnit = {
    $lookup: {
      from: "internshipunits",
      localField: "idIntern",
      foreignField: "_id",
      as: "internUnit"
    }    
  }

  const filter = {
    $match: {
      idGv: idGv
    },    
  }

  const search = {
    $match: {
      $text:{
        $search: "Minh"
      }
    }
    
  }

  const select = {
    $project: {
      _id: 1,
      idSv: 1,
      idGv: 1,
      idIntern: 1,
      shortId: 1,
      student: 1,
      internUnit: 1,
      core: 1
    }
  }

  InternshipInfo
    .aggregate([filter, lookupStudent, lookupInternUnit, {$unwind: "$student"}, {$unwind: "$internUnit"}, select])
    .exec((err, internInfos)=>{
      console.log(internInfos)
      internInfos.forEach(intern => {
        intern.internUnit.cityName = getNameTinh(intern.internUnit.city)
      })
      data.internInfos = internInfos
      console.log(data.internInfos)

      res.json({success: true, data})
    })

  // Student.aggregate([
  //   {$match: {$text: {$search: "B1704835"}}}
  // ]).exec((err,student)=>{
  //   console.log(student)
  //   res.json(student)
  // })

  // InternshipInfo.find({status: {$gte: 2}, idGv}).exec((err, internInfos)=>{
  //   data.internInfos = internInfos
  //   //console.log(internInfos)
  //   internInfos.forEach((val)=>{
  //     Student.find({_id: val.idSv}).exec((err,student)=>{
  //       console.log(student)
  //       data.students.push(student)
  //     })
      
  //   })
  //   console.log(data)
  //   res.json(data);
  // })
  
  
  
}