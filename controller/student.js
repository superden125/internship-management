import InternshipUnit from "../app/models/internshipUnit";
import InternshipInfo from "../app/models/internshipInfo";

module.exports = {
  registerInternship: async (data) => {
    try {
      //const idSv = req.session.user.
      let idUnit;
      const idSv = "606495a479cf53504760d7aa";
      // if (data.internshipUnit != "0") {
      //   const internshipInfo = new InternshipInfo({
      //     idSv: idSv,
      //     idGv: "none",
      //     idIntern: data.internshipUnit,
      //     phone: data.svPhone,
      //     status: 0,
      //     core: -1,
      //     shiftPerWeek: parseInt(data.shiftPerWeek),
      //     haveRoom: data.haveRoom ? true : false,
      //     havePC: data.havePc ? true : false,
      //     work: [
      //       data.work1,
      //       data.work2,
      //       data.work3,
      //       data.work4,
      //       data.work5,
      //       data.work6,
      //       data.work7,
      //       data.work8,
      //     ],
      //   });
      //   const result = await internshipInfo.save();
      //   if (result) {
      //     return result;
      //   }
      // }

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
          introBy: idSv,
        });
        const result = await internshipUnit.save();
        idUnit = result._id;
      }

      const idIntern =
        data.internshipUnit !== "0" ? data.internshipUnit : idUnit;
      const internshipInfo = new InternshipInfo({
        idSv: idSv,
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
