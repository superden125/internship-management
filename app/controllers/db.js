import bcrypt from "bcryptjs";
import mongoose from 'mongoose';

import Major from '../models/major';
import User from '../models/user';
import Teacher from '../models/teacher';
import Student from '../models/student';
import Milestone from '../models/milestone';
import InternshipUnit from '../models/internshipUnit';

// [GET] /db/major
module.exports.mockMajorDB = (req, res) => {
  const listMajor = [
    { name: "CNTT" },
    { name: "CNTT-CLC" },
    { name: "HTTT" },
    { name: "KHMT" },
    { name: "KTPM" },
    { name: "THUD" },
    { name: "MMT&TTDL" },
  ];

  listMajor.forEach(async (item) => {
    const major = new Major(item);
    await major.save();
  });

  res.send("Mocking Major DB successfully !!!");
};

// [GET] /db/teacher
module.exports.mockTeacherDB = async (req, res) => {
  const major = await Major.findOne({ name: "KTPM" });
  const pwd = "ims123";
  console.log(major);
  const listTeacher = [
    {
      mscb: "007",
      name: "Huynh Tran",
      idMajor: major._id,
      email: "ht@cit.ctu.edu.vn",
    },
    {
      mscb: "0065001",
      name: "Vo Huynh Tram",
      idMajor: major._id,
      email: "vhtram@cit.ctu.edu.vn",
    },
    {
      mscb: "0065002",
      name: "Truong Minh Thai",
      idMajor: major._id,
      email: "tmthai@cit.ctu.edu.vn",
    },
    {
      mscb: "0065003",
      name: "Huynh Xuan Hiep",
      idMajor: major._id,
      email: "hxhiep@cit.ctu.edu.vn",
    },
    {
      mscb: "0065004",
      name: "Truong Thi Thanh Tuyen",
      idMajor: major._id,
      email: "ttttuyen@cit.ctu.edu.vn",
    },
    {
      mscb: "0065005",
      name: "Lam Hoai Bao",
      idMajor: major._id,
      email: "lhbao@cit.ctu.edu.vn",
    },
    {
      mscb: "0065006",
      name: "Phan Huy Cuong",
      idMajor: major._id,
      email: "phcuong@cit.ctu.edu.vn",
    },
    {
      mscb: "0065007",
      name: "Huynh Quang Nghi",
      idMajor: major._id,
      email: "hqnghi@cit.ctu.edu.vn",
    },
    {
      mscb: "0065008",
      name: "Nguyen Cong Danh",
      idMajor: major._id,
      email: "ncdanh@cit.ctu.edu.vn",
    },
  ];
  let count = 0;
  listTeacher.forEach(async (item) => {
    const teacher = new Teacher(item);

    const salt = await bcrypt.genSalt(10);
    const hashPass = await bcrypt.hash(pwd, salt);
    
    const result = await teacher.save();

    const user = new User({
      username: item.mscb,
      password: hashPass,
      role: 1,
      ids: result._id
    });

    await user.save();
  });
  return res.send("Mocking teacher DB successfully");
};

module.exports.mockStudentDB = async (req, res) => {
  const major = await Major.findOne({ name: "KTPM" });
  
  console.log(major);
  const listStudent = [
    {
      mssv: "B1704835",
      name: "Trieu Duc Minh",
      idClass: "DI1796A2",
      idMajor: major._id,
      email: "minhb1704835@student.ctu.edu.vn",
    },
    {
      mssv: "B1704814",
      name: "Tran Thanh Huy",
      idClass: "DI1796A2",
      idMajor: major._id,
      email: "huyb1704814@student.ctu.edu.vn",
    },
    {
      mssv: "B1234242",
      name: "Nguyen Thanh Nam",
      idClass: "DI1796A2",
      idMajor: major._id,
      email: "namb123454@student.ctu.edu.vn",
    },
    {
      mssv: "B1794932",
      name: "Le Van Lay",
      idClass: "DI1796A2",
      idMajor: major._id,
      email: "dayb1794932@student.ctu.edu.vn",
    },
    {
      mssv: "B1703947",
      name: "Nguyen Thi Dien",
      idClass: "DI1796A1",
      idMajor: major._id,
      email: "dienb1703947@student.ctu.edu.vn",
    },
    {
      mssv: "B1709485",
      name: "Do Cong Hua",
      idClass: "DI1796A1",
      idMajor: major._id,
      email: "huab1709485@student.ctu.edu.vn",
    },
  ];
  let count = 0;
  const pwd = "ims123"
  listStudent.forEach(async (item) => {
    const student = new Student(item);
    const result = await student.save();
    const salt = await bcrypt.genSalt(10);
    const hashPass = await bcrypt.hash(pwd, salt);

    const user = new User({
      username: item.mssv,
      password: hashPass,
      ids: result._id,
      role: 0,
    });

    await user.save();
  });
  res.send("done");
};

module.exports.mockInternshipUnitDB = async (req, res) => {
  const data = [
    {
      name: "TechBase",
      address:
        "10th level Saigon Centre Tower 2, 67 Đ. Lê Lợi, Bến Nghé, Quận 1",
      email: "teachbase@techbase.com",
      city: "79",
      phone: "039394928492",
      website: "techbase.com",
      mentor: {
        name: "Lê Bằng Thanh",
        phone: "09203927482",
        email: "thanh.le@techbase.com",
      },
      workEnv: "Có phòng làm việc",
      workContent: "Thiết kế và lập trình webisite",
      reqTime: 36,
      reqInfo: "Điểm trung bình trên 2.5",
      maxSv: 10,
      currentSv: 0,
      benefit: "Hỗ trợ 5 triệu/tháng",
      introBy: null,
    },
    {
      name: "Fujinet",
      address:
        "10th level Saigon Centre Tower 2, 67 Đ. Lê Lợi, Bến Nghé, Quận 1",
      email: "Fujinet@Fujinet.com",
      city: "79",
      phone: "039394928492",
      website: "Fujinet.com",
      mentor: {
        name: "Lê Van Cong",
        phone: "09203927482",
        email: "thanh.le@techbase.com",
      },
      workEnv: "Có phòng làm việc",
      workContent: "Thiết kế và lập trình Software",
      reqTime: 36,
      reqInfo: "Điểm trung bình trên 2.5",
      maxSv: 10,
      currentSv: 0,
      benefit: "Hỗ trợ 3 triệu/tháng",
      introBy: null,
    },
    {
      name: "VPNT",
      address:
        "10th level Saigon Centre Tower 2, 67 Đ. Lê Lợi, Bến Nghé, Quận 1",
      email: "vnpt@vnpt.vn",
      city: "65",
      phone: "039394928492",
      website: "vnpt.com",
      mentor: {
        name: "Lê Bằng Thanh",
        phone: "09203927482",
        email: "thanh.le@vpnt.vn",
      },
      workEnv: "Có phòng làm việc",
      workContent: "Thiết kế và lập trình webisite",
      reqTime: 36,
      reqInfo: "Điểm trung bình trên 2.5",
      maxSv: 10,
      currentSv: 0,
      benefit: "Hỗ trợ 1triệu/day",
      introBy: null,
    },
  ];

  data.forEach(async (unit) => {
    const internUnit = new InternshipUnit(unit);
    await internUnit.save();
  });
  res.send("done");
};

module.exports.mockMilestone = async (req, res) => {
  const data = {
    semester: "2020-2021",
    hk: 3,
    startIntern: new Date(2021, 6, 1),
    endIntern: new Date(2021, 8, 1),
    endRegister: new Date(2021, 5, 15),
  };
  const milestone = new Milestone(data);
  const result = await milestone.save();
  res.send(result);
};
