console.log("student");

$('#formTT') && $("#formTT").on("submit", (e) => {
  var list = e.target.querySelectorAll("input");
  var data = {};

  list.forEach((val) => {
    data[val.name] = val.value;
  });
  data.internAddress = e.target.querySelector("#internAddress").value;
  data.internshipUnit = e.target.querySelector("#internshipUnit").value;
  data.isSelf = $("#isSelf").prop("checked");
  data.havePc = $("#inlineCheckbox2").prop("checked");
  data.haveRoom = $("#inlineCheckbox1").prop("checked");

  console.log("check", validFormTTT(data));
  if (validFormTTT(data)) return;
  e.preventDefault();
});

$("#isSelf").click((e) => {
  console.log(e.target.checked);
  const check = e.target.checked;
  if (check) {
    $(".intern-new").css({ display: "block" });
  } else {
    $(".intern-new").css({ display: "none" });
  }
});

function validFormTTT(data) {
  var error = {};
  console.log(data);
  Object.entries(data).forEach(([key, val]) => {
    $(`#err-${key}`).text("");
    if (
      val == "" &&
      key !== "haveRoom" &&
      key !== "havePc" &&
      key !== "internAddress" &&
      key !== "internName" &&
      key !== "internPhone" &&
      key !== "internEmail" &&
      key !== "internWebsite" &&
      key !== "isSelf" &&
      key !== "mentorName" &&
      key !== "mentorPhone" &&
      key !== "mentorEmail" &&
      key !== "internRequire" &&
      key !== "internBenefit" &&
      key !== "internReqTime"
    ) {
      error[key] = "Required";
    }
  });

  if (data.internshipUnit == "0") {
    error.internshipUnit = "Required";
  }

  if (data.isSelf) {
    error.internshipUnit = "";
    error.internAddress = data.internAddress == "" ? "Required" : "";
    error.internName = data.internName == "" ? "Required" : "";
    error.internPhone = data.internPhone == "" ? "Required" : "";
    error.internEmail = data.internEmail == "" ? "Required" : "";
    error.internWebsite = data.internWebsite == "" ? "Required" : "";
    error.mentorName = data.mentorName == "" ? "Required" : "";
    error.mentorPhone = data.mentorPhone == "" ? "Required" : "";
    error.mentorEmail = data.mentorEmail == "" ? "Required" : "";
    error.internRequire = data.internRequire == "" ? "Required" : "";
    error.internBenefit = data.internBenefit == "" ? "Required" : "";
    error.internReqTime = data.internReqTime == "" ? "Required" : "";
  }

  var check = 0;
  Object.entries(error).forEach(([key, val]) => {
    if (val !== "") {
      $(`#err-${key}`).text(val);
      check++;
    }
  });

  if(check > 0) alterError("Thông tin không hợp lệ")

  return check > 0 ? false : true;
}

function resetForm(){
  var list = document.querySelectorAll("input") 
  list.forEach((val)=>{
    console.log(val.id, val.type)
    if(val.type == "text" || val.type=='number'){
      $(`#err-${val.id}`).text("")
    }
  })
  document.querySelector("#err-internshipUnit").innerHTML = ""
  document.querySelector("#err-internAddress").innerHTML = ""
  
}

function loadData(){
  const semester = document.querySelector("#semester").value
  const schoolYear = document.querySelector("#schoolYear").value
  const params = {semester, schoolYear}  
  $.ajax({
    type: "get",
    url: "/student/get-interninfo",
    data: params
  }).done((res)=>{
    console.log(res)
    if(!res.success){
      // document.querySelector("#err").classList.remove("display-none")
      // document.querySelector("#err").innerHTML = res.msg
      alterError("Không tìm thấy thông tin thực tập")
      document.querySelector("#card-intern-info").classList.add("display-none")
    }else
    {
      const data = res.data
      document.querySelector("#alter").innerHTML = ""
      document.querySelector("#err").classList.add("display-none")
      document.querySelector("#card-intern-info").classList.remove("display-none")
      document.querySelector("#internUnit-name").innerHTML=data.internUnit.name
      document.querySelector("#internUnit-address").innerHTML=data.internUnit.address
      document.querySelector("#internUnit-city").innerHTML=data.internUnit.city
      document.querySelector("#internUnit-phone").innerHTML=data.internUnit.phone 
      document.querySelector("#internUnit-website").innerHTML=data.internUnit.website
      document.querySelector("#internUnit-website").href = data.internUnit.website
      document.querySelector("#internUnit-email").innerHTML=data.internUnit.email 

      document.querySelector("#mentor-name").innerHTML=data.internUnit.mentor.name 
      document.querySelector("#mentor-phone").innerHTML=data.internUnit.mentor.phone
      document.querySelector("#mentor-email").innerHTML=data.internUnit.mentor.email 

      if(data.teacher){
        document.querySelector("#teacher-name").innerHTML=data.teacher.name 
        document.querySelector("#teacher-phone").innerHTML=data.teacher.phone
        document.querySelector("#teacher-email").innerHTML=data.teacher.email 
      }
      

      document.querySelector("#internInfo-status").innerHTML=data.statusStr
      document.querySelector("#internInfo-core").innerHTML= data.internInfo.core >= 0 ? data.internInfo.core : "Chưa có"
      
    }
  })
  
}

function loadDataInternUnit(){
  const params = {
    semester: document.getElementById('semester').value,
    schoolYear: document.getElementById('schoolYear').value
  }

  $.ajax({
    type: "get",
    url: "/student/intern-unit",
    data: params    
  }).done((res)=>{
    const table = document.getElementById('table-intern-unit')
    if(!res.success){
      table.innerHTML = ""

    }else {
      const data = res.data.internUnits      
      
      let row = ""
      data.forEach((val, index)=>{
        row += `<tr onclick="location.href='/student/internship-unit/${val._id}'">
                  <td>${val.name}</td>
                  <td>${val.city}</td>
                  <td>${val.maxSv}</td>
                  <td>${val.currentSv}</td>
                  <td>${val.reqTime}</td>
                </tr>`
      })
      table.innerHTML = row
    }
  })
}

function getInternUnit(){
  const params = {
    introBy: null,
    idMilestone: document.getElementById("milestone").value
  }
  

  $.ajax({
    type: "get",
    url: "/intern-unit",
    data: params    
  }).done((res)=>{
    const internUnitDom = document.getElementById("internshipUnit")

    let options = `<option value="0">Chọn đơn vị thực tập từ khoa ...</option>`
    if(res.length > 0){
      res.forEach((val)=>{
        options += `<option value="${val._id}">${val.name}</option>`
      })
    }
    internUnitDom.innerHTML = options    
  })
  

}