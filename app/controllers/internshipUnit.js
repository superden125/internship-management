import InternshipUnit from "../models/internshipUnit";

module.exports = {
  getAllInternshipUnit: async (query) => {
    return await InternshipUnit.find(query);
  },
  getOneInternshipUnit: async (query) => {
    return await InternshipUnit.findOne(query);
  },
  
};
