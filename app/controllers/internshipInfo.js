import InternshipInfo from "../models/internshipInfo";
import InternshipUnit from "../models/internshipUnit";
import Teacher from "../models/teacher";
import tinh from "../lib/tinh";

export async function getInternshipInfo(req, res) {
  console.log(req.session.user.userId);
  const idSv = req.session.user.userId;
  let data = {
    title: "Internship Management System",
    roleName: "Sinh viên",
    urlInfo: "Thông tin thực tập",
  };

  const internInfo = await InternshipInfo.findOne({ idSv }).sort({
    timestamp: -1,
  });
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
  const city = tinh.find((city) => city.id == internUnit.city).name;
  internUnit.city = city;
  if (internInfo.status == 0) {
    internInfo.statusStr = "Chờ xét duyệt";
  }
  if (internInfo.status == 1) {
    internInfo.statusStr = "Đã duyệt";
  }

  data.internInfo = internInfo;
  data.internUnit = internUnit;

  if (internInfo.idGv !== "none") {
    const teacher = await Teacher.findById(internInfo.idGv);
    data.teacher = teacher;
  }

  data.error = { err: false };
  res.render("student/home", data);
}
