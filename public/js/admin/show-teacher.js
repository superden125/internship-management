


if(window.location.pathname == "/admin/manage/teachers"){
    $ondelete = $(".table tbody td a.delete");
    $ondelete.click(function(){
        var id = $(this).attr("data-id")

        var request = {
            "url" : `http://localhost:3000/admin/manage/teachers/${id}`,
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

$('#add_teacher') && $("#add_teacher").on("submit", (e) => {
    var list = e.target.querySelectorAll("input");
    var data = {};
  
    list.forEach((val) => {
      data[val.name] = val.value;
    });
    console.log("check", validFormTTT(data));
    if (validFormTTT(data)) return;
    e.preventDefault();
  });
  
  $('#update_teacher') && $("#update_teacher").on("submit", (e) => {
    var list = e.target.querySelectorAll("input");
    var data = {};
  
    list.forEach((val) => {
      data[val.name] = val.value;
    });
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
        key !== "ms" &&
        key !== "name" &&
        key !== "phone" &&
        key !== "email" &&
        key !== "major" 
        
      ) {
        error[key] = "Required";
      }
    });
  
    //  if (data.teachers == "0") {
    //     error.internshipUnit = "Required";
    //  }
  
  //   if (data.isSelf) {
      //error.internshipUnit = "";
      error.ms = data.ms == "" ? "Required" : "";
      error.name = data.name == "" ? "Required" : "";
      error.phone = data.phone == "" ? "Required" : "";
      error.email = data.email == "" ? "Required" : "";
      
      
      
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
  
  function resetFormTeacher(){
    var list = document.querySelectorAll("input") 
    list.forEach((val)=>{
      console.log(val.id, val.type)
      if(val.type == "text" || val.type=='number'){
        $(`#err-${val.id}`).text("")
      }
    })
    
    
  }