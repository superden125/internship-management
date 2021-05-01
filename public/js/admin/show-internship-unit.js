


if(window.location.pathname == "/admin/manage/internship-unit"){
    $ondelete = $(".delete-intern-unit a");
    console.log($(".delete-intern-unit a"));
    $ondelete.click(function(){
        var id = $(this).attr("data-id")

        var request = {
            "url" : `http://localhost:3000/admin/manage/internship-unit/${id}`,
            "method" : "DELETE"
        }

        if(confirm("Do you really want to delete this record?")){
            $.ajax(request).done(function(response){
                alert("Data Deleted Successfully!");
                location.reload();
            })
        }

    })
}


$('#add_internship-unit') && $("#add_internship-unit").on("submit", (e) => {
  var list = e.target.querySelectorAll("input");
  var data = {};

  list.forEach((val) => {
    data[val.name] = val.value;
  });
  data.address = e.target.querySelector("#address").value;
  

  console.log("check", validFormTTT(data));
  if (validFormTTT(data)) return;
  e.preventDefault();
});

$('#update_internship-unit') && $("#update_internship-unit").on("submit", (e) => {
  var list = e.target.querySelectorAll("input");
  var data = {};

  list.forEach((val) => {
    data[val.name] = val.value;
  });
  data.address = e.target.querySelector("#address").value;

  console.log("check", validFormTTT(data));
  if (validFormTTT(data)) return;
  e.preventDefault();
});

function validFormTTT(data) {
  var error = {};
  console.log(data);
  Object.entries(data).forEach(([key, val]) => {
    $(`#err-${key}`).text("");
    if (
      val == "" &&
      key !== "address" &&
      key !== "name" &&
      key !== "phone" &&
      key !== "email" &&
      key !== "city" &&
      key !== "website" &&
      key !== "mentorName" &&
      key !== "mentorPhone" &&
      key !== "mentorEmail" &&
      key !== "workEnv" &&
      key !== "workContent" &&
      key !== "reqTime" &&
      key !== "Info" &&
      key !== "maxSv" &&
      key !== "benefit"
    ) {
      error[key] = "Required";
    }
  });

  if (data.internshipUnit == "0") {
    error.internshipUnit = "Required";
  }

//   if (data.isSelf) {
    //error.internshipUnit = "";
    error.address = data.address == "" ? "Required" : "";
    error.name = data.name == "" ? "Required" : "";
    error.phone = data.phone == "" ? "Required" : "";
    error.email = data.email == "" ? "Required" : "";
    error.website = data.website == "" ? "Required" : "";
    error.mentorName = data.mentorName == "" ? "Required" : "";
    error.mentorPhone = data.mentorPhone == "" ? "Required" : "";
    error.mentorEmail = data.mentorEmail == "" ? "Required" : "";
    error.reqInfo = data.reqInfo == "" ? "Required" : "";
    error.benefit = data.benefit == "" ? "Required" : "";
    error.reqTime = data.reqTime == "" ? "Required" : "";
    error.city = data.city == "" ? "Required" : "";
    error.workEnv = data.workEnv == "" ? "Required" : "";
    error.workContent = data.workContent == "" ? "Required" : "";
    error.maxSv = data.maxSv == "" ? "Required" : "";
    
    
    //var emailPatt = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;

    //console.log(isValidRegex(data.email, emailPatt));

    //error.email = !isValidRegex(data.email, emailPatt) ? "Email khong hop le" : "";
//   }

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

function isValidRegex(str, patt) {
  return patt.test(str);
}

function resetFormIU(){
  var list = document.querySelectorAll("input") 
  list.forEach((val)=>{
    console.log(val.id, val.type)
    if(val.type == "text" || val.type=='number'){
      $(`#err-${val.id}`).text("")
    }
  })
  
  document.querySelector("#err-address").innerHTML = ""
  
}

// function loadData(){
//   //const semester = document.querySelector("#semester").value
//   //const hk = document.querySelector("#hk").value
//   //const params = {semester, hk}
//   //console.log(params)
//   $.ajax({
//     type: "get",
//     url: "/internship-unit/",
//     data: params
//   }).done((res)=>{
//     console.log(res)
//     if(res.success){
//       const data = res.data
//       document.querySelector("#err").classList.add("display-none")
//       document.querySelector("#card-intern-info").classList.remove("display-none")
//       document.querySelector("#internUnit-name").innerHTML=data.internUnit.name
//       document.querySelector("#internUnit-address").innerHTML=data.internUnit.address
//       document.querySelector("#internUnit-city").innerHTML=data.internUnit.city
//       document.querySelector("#internUnit-phone").innerHTML=data.internUnit.phone 
//       document.querySelector("#internUnit-website").innerHTML=data.internUnit.website
//       document.querySelector("#internUnit-website").href = data.internUnit.website
//       document.querySelector("#internUnit-email").innerHTML=data.internUnit.email 

//       document.querySelector("#mentor-name").innerHTML=data.internUnit.mentor.name 
//       document.querySelector("#mentor-phone").innerHTML=data.internUnit.mentor.phone
//       document.querySelector("#mentor-email").innerHTML=data.internUnit.mentor.email 

//       document.querySelector("#teacher-name").innerHTML=data.teacher.name 
//       document.querySelector("#teacher-phone").innerHTML=data.teacher.phone
//       document.querySelector("#teacher-email").innerHTML=data.teacher.email 

//       document.querySelector("#internInfo-status").innerHTML=data.statusStr
//       document.querySelector("#internInfo-core").innerHTML= data.internInfo.core >= 0 ? data.internInfo.core : "Chưa có"
      
//     }
//   })

  
//}