


if(window.location.pathname == "/admin/manage/internship-unit"){
    $ondelete = $(".delete-intern-unit a");
    console.log($(".delete-intern-unit a"));    
    $ondelete.click(function(){
        console.log("click")
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

function loadData(){
  const semester = document.querySelector("#semester-filter").value
  const schoolYear = document.querySelector("#schoolYear-filter").value
  const params = {semester, schoolYear}
  //console.log(params)
  $.ajax({
    type: "get",
    url: "/intern-unit/",
    data: params
  }).done((res)=>{
    console.log(res)
    const table = document.getElementById("table-body-internUnit")
    if(res.success){
      const table = document.getElementById("table-body-internUnit")
      table.innerHTML = ""
      clearAlters()
      const data = res.data

      if(data.length == 0) alterError("Không tìm thấy đơn vị thực tập")

      let row = ""
      data.forEach((val,index)=>{
        row +=`<tr><td onclick="window.location.href='/admin/manage/internship-unit/${val._id}';">${index + 1}</td>
              <td onclick="window.location.href='/admin/manage/internship-unit/${val._id}';">${val.name}</td>
              <td onclick="window.location.href='/admin/manage/internship-unit/${val._id}';">${val.email}</td>
              <td onclick="window.location.href='/admin/manage/internship-unit/${val._id}';">${val.address}</td>
              <td onclick="window.location.href='/admin/manage/internship-unit/${val._id}';">${val.city}</td>
              <td onclick="window.location.href='/admin/manage/internship-unit/${val._id}';">${val.phone}</td>
              <td class="delete-intern-unit">
                <a class="btn border-shadow delete" data-id=${val._id} >
                  <span class="text-gradient"><i class="fas fa-trash-alt"></i></span>
              </a>
              </td></tr>`
      })
    
      table.innerHTML = row
    }else{
      table.innerHTML = ""
      alterError("Không tìm thấy đơn vị thực tập")
    }

  })

  
}