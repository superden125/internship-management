import InternshipUnit from "../app/models/internshipUnit";

module.exports = {
  getAllInternshipUnit: async (query) => {
    return await InternshipUnit.find(query);
  },
};