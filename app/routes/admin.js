import express from "express";
import InternshipUnit from "../models/internshipUnit";

import { isAdmin } from "../middleware/auth";

const router = express.Router();

//router.use(isAdmin);

router.get("/", (req, res) => {
  res.render("admin/index", {
    title: "Internship Management System",
    roleName: "Sinh viên",
    urlInfo: "Thông tin thực tập",
  });
});

router.get("/mockInternUnit", (req, res) => {
  const data = [
    {
      name: "TechBase",
      address:
        "10th level Saigon Centre Tower 2, 67 Đ. Lê Lợi, Bến Nghé, Quận 1",
      email: "teachbase@techbase.com",
      city: "Hồ Chí Minh",
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
      introBy: "admin",
    },
    {
      name: "Fujinet",
      address:
        "10th level Saigon Centre Tower 2, 67 Đ. Lê Lợi, Bến Nghé, Quận 1",
      email: "Fujinet@Fujinet.com",
      city: "Hồ Chí Minh",
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
      introBy: "admin",
    },
    {
      name: "VPNT",
      address:
        "10th level Saigon Centre Tower 2, 67 Đ. Lê Lợi, Bến Nghé, Quận 1",
      email: "vnpt@vnpt.vn",
      city: "Cần Thơ",
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
      introBy: "admin",
    },
  ];

  data.forEach(async (unit) => {
    const internUnit = new InternshipUnit(unit);
    await internUnit.save();
  });
  res.send("done");
});

router.get("/internship-unit", async (req, res) => {
  const data = await InternshipUnit.find({ mentor: { name: "Lê Bằng Thanh" } });
  res.json(data);
});

module.exports = router;
