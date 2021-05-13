import moment from "moment";
import mongoose from 'mongoose';
import InternshipUnit from "../models/internshipUnit";
import InternshipInfo from "../models/internshipInfo";
import Milestone from "../models/milestone"
import {tinh} from "../lib/tinh"

export async function registerInternshipPost(req, res) {
  try {
    let idSv = req.session.user.userId;    
    let data = {
      error: {
        err: false
      },
      title: "Internship Management System",
      roleName: "Sinh viên",
      urlInfo: "Thông tin thực tập",
      idSv
    };
    data = Object.assign(data, req.body);
    console.log("data",data.internshipUnit)
    if(!data.id){
      if (data.internshipUnit == "0" || !data.internshipUnit) {
      
        const internshipUnit = new InternshipUnit({
          name: data.internName,
          address: data.internAddress,
          email: data.internEmail,
          city: data.internshipCity,
          phone: data.internPhone,
          website: data.internWebsite,
          mentor: {
            name: data.mentorName,
            phone: data.mentorPhone,
            email: data.mentorEmail,
          },
          reqTime: parseInt(data.internReqTime),
          reqInfo: data.internRequire,
          benefit: data.internBenefit,
          introBy: data.idSv,
          idMilestone: data.milestone.trim()
        });
        const result = await internshipUnit.save();
        console.log("internUnit", result)
        data.idUnit = result._id;
      }
  
      const idIntern = data.internshipUnit !== undefined ? data.internshipUnit : data.idUnit;
      const internshipInfo = new InternshipInfo({
        idSv: data.idSv,
        idGv: null,
        idIntern: idIntern,
        idMilestone: data.milestone.trim(),
        phone: data.svPhone,
        status: 0,
        core: -1,
        shiftPerWeek: parseInt(data.shiftPerWeek),
        haveRoom: data.haveRoom ? true : false,
        havePC: data.havePc ? true : false,
        work: [
          data.work1,
          data.work2,
          data.work3,
          data.work4,
          data.work5,
          data.work6,
          data.work7,
          data.work8,
        ],
      });
      const result = await internshipInfo.save();
      console.log("internInfo", result)
      if (result) {
        return res.redirect("/student");
      }
    }else{
      console.log("update", data)
      const internInfo = await InternshipInfo.findById(data.id)
      const internUnit = await InternshipUnit.findById(internInfo.idIntern)
      let newIdInternUnit = data.internshipUnit
      let idInternUnit = newIdInternUnit
      console.log(internUnit._id, newIdInternUnit)
      console.log(internUnit._id == newIdInternUnit)
      if(internUnit._id == newIdInternUnit){
        if(internUnit.introBy){
          internUnit.name = data.internName
          internUnit.address = data.internAddress
          internUnit.city = data.internshipCity        
          internUnit.email = data.internWebsite        
          internUnit.phone = data.internPhone
          internUnit.website = data.internWebsite
          internUnit.mentor = {
            name: data.mentorName,
            phone: data.mentorPhone,
            email: data.mentorEmail
          }
          internUnit.reqTime = data.internReqTime
          internUnit.reqInfo = data.internRequire
          internUnit.benefit = data.internBenefit
  
          await internUnit.save()
        }
      }else{
        if(internUnit.introBy){          
          await InternshipUnit.findByIdAndDelete(internUnit._id)          
        }else{
          if(!newIdInternUnit) {
            const internshipUnit = new InternshipUnit({
              name: data.internName,
              address: data.internAddress,
              email: data.internEmail,
              city: data.internshipCity,
              phone: data.internPhone,
              website: data.internWebsite,
              mentor: {
                name: data.mentorName,
                phone: data.mentorPhone,
                email: data.mentorEmail,
              },
              reqTime: parseInt(data.internReqTime),
              reqInfo: data.internRequire,
              benefit: data.internBenefit,
              introBy: data.idSv,
              idMilestone: data.milestone.trim()
            });
            await internshipUnit.save();
            idInternUnit = internshipUnit._id
          }
          
        }
      }
      
      
      //const idIntern = data.internshipUnit ? data.internshipUnit : internInfo.idIntern

      internInfo.idIntern = idInternUnit
      internInfo.phone = data.svPhone
      internInfo.status = 0
      internInfo.shiftPerWeek = data.shiftPerWeek
      internInfo.haveRoom = data.haveRoom ? true : false
      internInfo.havePC = data.havePC ? true : false
      internInfo.work = [
        data.work1,
        data.work2,
        data.work3,
        data.work4,
        data.work5,
        data.work6,
        data.work7,
        data.work8,
      ]

      const result = await internInfo.save()
      if (result) {
        return res.redirect("/student");
      }
    }
    
  } catch (error) {
    console.log(error)
    return res.render("student/home", {
      error: {
        err: true,
        msg: "Not found Intern Info"
      },
      title: "Internship Management System",
      roleName: "Sinh viên",
      urlInfo: "Thông tin thực tập",
    });
  }
}

export async function registerInternshipGet(req, res) {
  
  const id = req.params.id
  let data = {
    error: {
      err: false
    },
    title: "Internship Management System",
    roleName: "Sinh viên",
    urlInfo: "Đăng ký thực tập",
    internInfo: {},
    internUnit: {}
  };
  
  const milestone = await Milestone.find({endRegister: {$gte: Date.now()}}).sort({endRegister: -1}).limit(5);
  if (milestone.length == 0) {
    data.error = {
      err: true,
      msg: "Không tìm thấy đợt thực tập"
    }
    return res.render("student/register-internship", data)
  }
  const milestone1 = [];
  for (let i = 0; i < milestone.length; i++) {
    const obj = {};
    obj._id = milestone[i]._id
    obj.schoolYear = milestone[i].schoolYear
    obj.semester = milestone[i].semester
    obj.startIntern = milestone[i].startIntern
    obj.endIntern = milestone[i].endIntern
    obj.endRegister = moment(milestone[i].endRegister).format("DD-MM-YYYY")
    milestone1.push(obj)
  }

  
  const internInfo = await InternshipInfo.findOne({
    idSv: req.session.user.userId,
    idMilestone: milestone1[0]._id,    
  })
  
  if((internInfo && !id) || (internInfo && id && internInfo.status != 2)) {
    data.error = {
      err: true,
      msg: `Bạn đã đăng ký thực tập năm học ${milestone1[0].schoolYear}, học kỳ  ${milestone1[0].semester}`
    }
    return res.render("student/register-internship", data)
  }
  
  const internshipUnit = await InternshipUnit.find({
    introBy: null,
    idMilestone: milestone1[0]._id
  });
  data.internshipUnit = internshipUnit;
  data.tinh = tinh.sort((a, b) => a.name - b.name);
  data.milestone = milestone1;
  
  if(id){
    const internInfo = await InternshipInfo.findById(id);
    if(!internInfo) return res.render("student/register-internship", data);
    const internUnit = await InternshipUnit.findById(internInfo.idIntern);
    data.internInfo = internInfo
    data.internUnit = internUnit.introBy ? internUnit : {_id: internUnit._id}
  }
  
  res.render("student/register-internship", data);
}

export async function getListInternshipUnit(req, res) {
  let data = {
    title: "Internship Management System",
    roleName: "Sinh viên",
    urlInfo: "Danh sách đơn vị thực tập",    
  };

  const milestones = await Milestone.find({}).limit(12).sort({endRegister: -1})
  
  if(milestones.length === 0) return res.render(
      "student/internship-unit",
      Object.assign(data, {
        error: { err: true, msg: "Not found internship unit is this semester" },
      })
  );
  let schoolYears = []
  milestones.forEach((val)=>{
    schoolYears.push(val.schoolYear)
  })
  schoolYears = schoolYears.filter((val,i,a)=>a.indexOf(val)===i)
  console.log(schoolYears)
  data.schoolYears = schoolYears
  data.currentHk = milestones[0]
  const internUnits = await InternshipUnit.find({
    introBy: null,
    idMilestone: milestones[0]._id
  });
  internUnits.forEach((internUnit) => {
    internUnit.city = tinh.find((tinh) => tinh.id == internUnit.city).name;
  });
  data.internUnits = internUnits;
  console.log(data)
  res.render("student/internship-unit", data);
}

export async function getListInternUnit(req, res){
  let data = {};
  const {semester, schoolYear} = req.query  
  const milestone = await Milestone.findOne({schoolYear ,semester: parseInt(semester)})  
  data.milestone = milestone 
  if(!milestone) return res.json({success: false, msg:"Milestone not found"})  
  
  const internUnits = await InternshipUnit.find({
    introBy: null,
    idMilestone: milestone._id
  });
  internUnits.forEach((internUnit) => {
    internUnit.city = tinh.find((tinh) => tinh.id == internUnit.city).name;
  });
  data.internUnits = internUnits;
  res.json({success: true, data})
}

export async function getInternshipUnitById(req, res) {
  let data = {
    title: "Internship Management System",
    roleName: "Sinh viên",
    urlInfo: "Danh sách đơn vị thực tập",
  };
  const internUnit = await InternshipUnit.findOne({
    _id: req.params.id
  });
  internUnit.city = tinh.find((tinh) => tinh.id == internUnit.city).name;
  data.internUnit = internUnit;

  res.render("student/internship-unit-id", data);
}