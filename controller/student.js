import InternshipUnit from "../app/models/internshipUnit";
import InternshipInfo from "../app/models/internshipInfo";
import Teacher from "../app/models/teacher";

import tinh from "../lib/tinh";

module.exports = {
  registerInternship: async (data) => {
    try {
      let idUnit;

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
          introBy: data.isSv,
        });
        const result = await internshipUnit.save();
        idUnit = result._id;
      }

      const idIntern =
        data.internshipUnit !== "0" ? data.internshipUnit : idUnit;
      const internshipInfo = new InternshipInfo({
        idSv: data.idSv,
        idGv: "none",
        idIntern: idIntern,
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
        return result;
      }
    } catch (error) {
      return { err: error };
    }
  },
};
