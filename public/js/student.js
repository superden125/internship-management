console.log("student");

$("#formTT").on("submit", (e) => {
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
      key !== "isSelf"
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
  }

  var check = 0;
  Object.entries(error).forEach(([key, val]) => {
    if (val !== "") {
      $(`#err-${key}`).text(val);
      check++;
    }
  });

  console.log(check);

  return check > 0 ? false : true;
}
