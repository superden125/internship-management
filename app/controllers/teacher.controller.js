// [GET] /teacher/
module.exports.index = (req, res) => {
  res.render("teacher/home", {
    title: "Internship Management System",
    roleName: "Giáo viên",
    urlInfo: "Thông tin thực tập",
  });
};
