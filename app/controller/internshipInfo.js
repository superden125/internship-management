import InternshipInfo from "../models/internshipInfo";
import InternshipUnit from "../models/internshipUnit";
import Teacher from "../models/teacher";
import tinh from "../lib/tinh";

module.exports = {
  getInternshipInfo: async (idSv) => {
    const internInfo = await InternshipInfo.findOne({ idSv }).sort({
      timestamp: -1,
    });
    if (!internInfo) return { err: true, msg: "Not found Intern Info" };

    const internUnit = await InternshipUnit.findById(internInfo.idIntern);

    if (!internUnit) return { err: true, msg: "Not found Intern Unit" };
    const city = tinh.find((city) => city.id == internUnit.city).name;
    internUnit.city = city;
    if (internInfo.status == 0) {
      internInfo.statusStr = "Chờ xét duyệt";
    }
    if (internInfo.status == 1) {
      internInfo.statusStr = "Đã duyệt";
    }
    const data = {
      internInfo,
      internUnit,
    };

    if (internInfo.idGv !== "none") {
      const teacher = await Teacher.findById(internInfo.idGv);
      data.teacher = teacher;
    }

    return data;
  },
};
