import mongoose from "mongoose"
import moment from "moment"
import InternshipInfo from "../models/internshipInfo"
import InternshipUnit from "../models/internshipUnit"
import Milestone from '../models/milestone'

import {getNameTinh} from "../lib/tinh"
import {status} from "../lib/convert"

const ObjectId = mongoose.Types.ObjectId

// [GET] /teacher/
export async function index (req, res) {

  const isCore = req.url.split("?")[0] == "/core"
  
  const data = {
    title: 'Internship Management System',
    roleName: 'Giáo viên',
    urlInfo: isCore ? 'Nhập kết quả thực tập' :'Đơn vị thực tập'
  }

  

  const idGv = req.session.user.userId 
  const status = req.query.status ? req.body.status : 2
  const limit = req.query.limit ? req.query.limit : 10
  const skip = req.query.skip ? req.query.skip : 0
  const search = req.query.search ? req.query.search : ""

  const lookupStudent ={
    $lookup:{
      from: 'users',
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
      idGv: ObjectId(idGv)
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

  const milestone = await Milestone.find().limit(12).sort({endRegister:-1})
  if(!milestone) return res.render(
    "teacher/index",
    Object.assign(data, {
      error: { err: true, msg: "Not found semester" },
      listSemester: []
    })
  );
  let semesters = []
  milestone.forEach((val)=>{
    semesters.push(val.semester)
  })
   
  data.listSemester = semesters.filter((val,i,a)=> a.indexOf(val)===i)

  InternshipInfo
    .aggregate([filter, lookupStudent, lookupInternUnit, {$unwind: "$student"}, {$unwind: "$internUnit"}, select])
    .exec((err, internInfos)=>{
      //console.log("aaa",internInfos)
      internInfos.forEach(intern => {
        intern.internUnit.cityName = getNameTinh(intern.internUnit.city)
      })
      data.internInfos = internInfos
      //console.log("data",data.internInfos)

      isCore ? res.render('teacher/core', data) : res.render('teacher/index', data)
    })
}

export async function getInternshipInfo(req,res){
  const data = {
    title: 'Internship Management System',
    roleName: 'Giáo viên',
    urlInfo: 'Thông tin thực tập',
    
  }

  const idGv = req.session.user.userId

  const lookupStudent ={
    $lookup:{
      from: 'users',
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
      idGv: ObjectId(idGv),
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
      console.log("data", data)
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

export async function saveCore(req,res){
  
  const data = req.body  
  if(data.core < 0 && data.core > 10) return res.json({success: false, err:"Input not valid"})
  const result = await InternshipInfo.findById(data.id).updateOne({core:data.core})
  if(!result) res.json({success: false, err:"Input not valid"})
  res.json({success:true})
}

export async function getManyInternInfo(req,res){
  const data = {}
  const idGv = req.session.user.userId 
  let idMilestone = ""
  let status = req.query.status ? req.body.status : 2
  let limit = req.query.limit ? parseInt(req.query.limit) : 10
  let page = req.query.page ? parseInt(req.query.page) : 1
  let s = req.query.search ? req.query.search : ""
  let hk = req.query.hk ? req.query.hk : ""
  let semester = req.query.semester ? req.query.semester : ""  
  
  if(!hk && !semester){
    const lasterMilestone = await Milestone.findOne().sort({endRegister: -1})  
    hk = lasterMilestone.hk
    semester = lasterMilestone.semester
    idMilestone = lasterMilestone._id
  } else{
    const lasterMilestone = await Milestone.findOne({hk, semester})
    if(!lasterMilestone) return res.json({success:false, msg:"Invalid params"})
      idMilestone = lasterMilestone._id            
  }

  const countDocuments = await InternshipInfo.find({idGv, idMilestone}).countDocuments()

  data.hk=hk
  data.semester=semester
  data.pagination = {
    totalRow: Math.ceil(countDocuments / limit),
    limit: limit,
    page: page
  }
  let startIndex = (page - 1)*limit

  const milestone = await Milestone.findById(idMilestone)
  if(milestone) data.endCore = milestone.endCore //moment(milestone.endCore).format("DD-MM-YYYY")


  const lookupStudent ={
    $lookup:{
      from: 'users',
      localField: "idSv",
      foreignField: "_id",
      as: "student",      
    },
  }

  const lookupStudent2 = {
    $lookup:{
      from: 'users',
      //let: {idSv: "$idSv"},
      pipeline: [
        {
          $match:{
            mssv: "B1704835",
            // $text:{
            //   $search: "B1704835"
            // }
          }
        }
      ],
      as: "student"
    }
  }

  //console.log(lookupStudent2)

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
      idGv: ObjectId(idGv),
      idMilestone: ObjectId(idMilestone)
    }  
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
      idMilestone: 1,
      shortId: 1,
      student: 1,
      internUnit: 1,
      core: 1,      
    }
  }

  const query = [
    filter,
   // { $group: { _id: null, count: { $sum: 1 } } },
   //{$count: "totalCount"},
    lookupStudent, 
    lookupInternUnit,     
    {$unwind: "$student"}, 
    {$unwind: "$internUnit"},    
    {$skip: startIndex},
    {$limit: data.pagination.limit},
    select
  ]
  console.log("query", query)
  InternshipInfo
    .aggregate(query)
    .exec((err, internInfos)=>{
      if(err) console.log(err)
      if(err) return res.json({success: false, msg: err})      
      internInfos.forEach(intern => {
        intern.internUnit.cityName = getNameTinh(intern.internUnit.city)
      })
      data.internInfos = internInfos
      console.log("data", data)
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