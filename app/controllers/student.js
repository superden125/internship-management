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
    if (data.internshipUnit == "0") {
      console.log("tst", data);
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
      });
      const result = await internshipUnit.save();
      data.idUnit = result._id;
    }

    const idIntern = data.internshipUnit !== "0" ? data.internshipUnit : data.idUnit;
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
    if (result) {
      return res.redirect("/student");
    }
  } catch (error) {
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
  let data = {
    error: {
      err: false
    },
    title: "Internship Management System",
    roleName: "Sinh viên",
    urlInfo: "Đăng ký thực tập",
  };
  const year = new Date().getFullYear();
  const milestone = await Milestone.find({
    schoolYear: {
      $regex: year
    },
    endRegister: {
      $gte: Date.now()
    },
  });
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

  var i = 0;
  while (i < milestone1.length) {
    const internInfo = await InternshipInfo.findOne({
      idSv: req.session.user.userId,
      idMilestone: milestone1[i]._id
    })
    if (internInfo) {
      data.error = {
        err: true,
        msg: `Bạn đã đăng ký thực tập năm học ${milestone1[i].schoolYear}, học kỳ  ${milestone1[i].semester}`
      }
      return res.render("student/register-internship", data)
    }
    i++
  }


  const internshipUnit = await InternshipUnit.find({
    introBy: null,
  });
  data.internshipUnit = internshipUnit;
  data.tinh = tinh.sort((a, b) => a.name - b.name);
  data.milestone = milestone1;
  res.render("student/register-internship", data);
}

export async function getListInternshipUnit(req, res) {
  let data = {
    title: "Internship Management System",
    roleName: "Sinh viên",
    urlInfo: "Danh sách đơn vị thực tập",
  };
  const internUnits = await InternshipUnit.find({
    introBy: null,
  });
  internUnits.forEach((internUnit) => {
    internUnit.city = tinh.find((tinh) => tinh.id == internUnit.city).name;
  });
  data.internUnits = internUnits;
  res.render("student/internship-unit", data);
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