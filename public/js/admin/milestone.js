let current = {}

function addMilestone() {
    const row = document.querySelector("#addMilestone")
    let year = new Date().getFullYear();
    const semester1 = `${year}-${year+1}`
    const semester2 = `${year-1}-${year}`
    // console.log(semester1, semester2)
    row.innerHTML = `<td> <select name="semester" id="semester" class="custom-select"> <option value="${semester1}">${semester1}</option> <option value="${semester2}">${semester2}</option> </select> </td> <td> <select name="hk" id="hk" class="custom-select"> <option value="1">1</option> <option value="2">2</option> <option value="3">3</option> </select> </td> <td> <input type="date" name="endRegister" id="endRegister"> </td> <td> <input type="date" name="startIntern" id="startIntern"> </td> <td> <input type="date" name="endIntern" id="endIntern"> </td><td> <input type="date" name="endCore" id="endCore"> </td> <td> <span class="sd-icon mr-4" onclick="saveMilestone()"> <i class="fas fa-save"></i> </span><span class="sd-icon" onclick="deleteMilestone()"> <i class="fas fa-trash-alt"></i> </span> </td>`
}

function deleteMilestone(id) {

    if (!id)
        document.querySelector("#addMilestone").innerHTML = "";
    else {
        // console.log(current)
        const row = document.getElementById(id)
        const child = row.querySelectorAll("td")

        child[0].innerHTML = current.semester
        child[1].innerHTML = current.hk
        child[2].innerHTML = current.endRegister
        child[3].innerHTML = current.startIntern
        child[4].innerHTML = current.endIntern
        child[5].innerHTML = current.endCore
        child[6].innerHTML = `<span class="sd-icon" id="editMilestone" onclick="editMilestone('${id}')"><i class="fas fa-edit"></i></span>`
    }
    //current = {}  
}

function saveMilestone(id){

    let semester = document.querySelector("#semester").value    
    let hk = document.querySelector("#hk").value
    let endRegister = new Date(document.querySelector("#endRegister").value)
    let startIntern = new Date(document.querySelector("#startIntern").value)
    let endIntern = new Date(document.querySelector("#endIntern").value)
    let endCore = new Date(document.querySelector("#endCore").value)
    console.log(semester)
    if(endRegister == "Invalid Date" || startIntern == "Invalid Date" || endIntern == "Invalid Date"){
        const alter = document.querySelector('#alter')
        alterError("Thời gian trống hoặc sai định dạng")            
        return false
    }

    if(endRegister >= startIntern){
        alterError("Hạn đăng ký phải trước thời gian bắt đầu thực tập")            
        return false
    }
    
    if(startIntern >= endIntern){
        alterError("Thời gian bắt đầu phải trước thời gian kết thúc thực tập")            
        return false
    }

    if(endIntern >= endCore){
        alterError("Thời gian kết thúc phải trước hạn nhập kết quả")            
        return false
    }

    if(!id){
        // let semester = document.querySelector("#semester").value
        // let hk = document.querySelector("#hk").value
        // let endRegister = new Date(document.querySelector("#endRegister").value)
        // let startIntern = new Date(document.querySelector("#startIntern").value)
        // let endIntern = new Date(document.querySelector("#endIntern").value)
        
        
        const data = {
            semester,
            hk,
            endRegister,
            startIntern,
            endIntern,
            endCore
        }

        $.ajax({
            method: "post",
            url: "/admin/manage/milestone",
            data: data
        }).done((res) => {
            if (res.success) {
                deleteMilestone()
                const data = `<tr id="${res.data._id}">` +
                    `<td>${semester}</td>` +
                    `<td>${hk}</td>` +
                    `<td>${format0(endRegister.getDate())}-${format0(endRegister.getMonth()+1)}-${endRegister.getFullYear()}</td>` +
                    `<td>${format0(startIntern.getDate())}-${format0(startIntern.getMonth()+1)}-${startIntern.getFullYear()}</td>` +
                    `<td>${format0(endIntern.getDate())}-${format0(endIntern.getMonth()+1)}-${endIntern.getFullYear()}</td>` +
                    `<td>${format0(endCore.getDate())}-${format0(endCore.getMonth()+1)}-${endCore.getFullYear()}</td>` +
                    `<td><span class="sd-icon" id="editMilestone" onclick="editMilestone('${res.data._id}')"><i class="fas fa-edit"></i></span></td>` +
                    `</tr>`
                $('#table-milestone > tbody > tr:first').before(data)
                alterSuccess("Lưu thành công")
            }
            else alterError(res.msg)
        })
    } else {
        const row = document.getElementById(id)
        const child = row.querySelectorAll("td")

        //console.log(child[0].firstChild.value)
        const data = {
            _id: id,
            semester: child[0].firstChild.value,
            hk: child[1].firstChild.value,
            endRegister: new Date(child[2].firstChild.value),
            startIntern: new Date(child[3].firstChild.value),
            endIntern: new Date(child[4].firstChild.value),
            endCore: new Date(child[5].firstChild.value)
        }
        // console.log(data)

        $.ajax({
            method: "put",
            url: "/admin/manage/milestone",
            data: data
        }).done((res) => {
            if (res.success) {
                // console.log(res.data.semester)
                const endRegister = new Date(res.data.endRegister)
                const startIntern = new Date(res.data.startIntern)
                const endIntern = new Date(res.data.endIntern)
                const endCore = new Date(res.data.endCore)

                current.semester = res.data.semester
                current.hk = res.data.hk
                current.endRegister = `${format0(endRegister.getDate())}-${format0(endRegister.getMonth()+1)}-${endRegister.getFullYear()}`
                current.startIntern = `${format0(startIntern.getDate())}-${format0(startIntern.getMonth()+1)}-${startIntern.getFullYear()}`
                current.endIntern = `${format0(endIntern.getDate())}-${format0(endIntern.getMonth()+1)}-${endIntern.getFullYear()}`
                current.endCore = `${format0(endCore.getDate())}-${format0(endCore.getMonth()+1)}-${endCore.getFullYear()}`
                deleteMilestone(res.data._id)                
                alterSuccess("Lưu thành công")
            }
            else alterError(res.msg)
        })
    }

}

function editMilestone(id) {
    const row = document.getElementById(id)
    const child = row.getElementsByTagName("td")

    // console.log(child[0].innerHTML)
    current.semester = child[0].innerHTML
    current.hk = child[1].innerHTML
    current.endRegister = child[2].innerHTML
    current.startIntern = child[3].innerHTML
    current.endIntern = child[4].innerHTML
    current.endCore = child[5].innerHTML

    let year = new Date().getFullYear();
    const semester1 = `${year}-${year+1}`
    const semester2 = `${year-1}-${year}`

    const endRegister = child[2].innerText.split('-')
    const startIntern = child[3].innerText.split('-')
    const endIntern = child[4].innerText.split('-')
    const endCore = child[5].innerText.split('-')

    const dateEndRegister = `${endRegister[2]}-${endRegister[1]}-${endRegister[0]}`
    const dateStartIntern = `${startIntern[2]}-${startIntern[1]}-${startIntern[0]}`
    const dateEndIntern = `${endIntern[2]}-${endIntern[1]}-${endIntern[0]}`
    const dateEndCore = `${endCore[2]}-${endCore[1]}-${endCore[0]}`

    
    child[0].innerHTML = `<select name="semester" id="semester" class="custom-select"> <option value="${semester1}">${semester1}</option> <option value="${semester2}">${semester2}</option> </select>`
    child[1].innerHTML = `<select name="hk" id="hk" class="custom-select"> <option value="1" ${current.hk === "1" ? "selected":""}>1</option> <option value="2" ${current.hk === "2" ? "selected":""}>2</option> <option value="3" ${current.hk === "3" ? "selected":""}>3</option> </select>`
    child[2].innerHTML = `<input class="form-control" type="date" name="endRegister" id="endRegister" value="${dateEndRegister}" >`
    child[3].innerHTML = `<input class="form-control" type="date" name="startIntern" id="startIntern" value="${dateStartIntern}">`
    child[4].innerHTML = `<input class="form-control" type="date" name="endIntern" id="endIntern" value="${dateEndIntern}">`
    child[5].innerHTML = `<input class="form-control" type="date" name="endCore" id="endCore" value="${dateEndCore}">`
    child[6].innerHTML = `<span class="sd-icon mr-4" onclick="saveMilestone('${id}')"> <i class="fas fa-save"></i> </span><span class="sd-icon" onclick="deleteMilestone('${id}')"> <i class="fas fa-backspace"></i> </span>`

}


function format0(val) {
    val = "0" + val
    return val.slice(-2)
}

function loadData(){
    const params = {
        semester: document.getElementById('semester-filter').value,
        hk: document.getElementById('hk-filter').value
      }
    
    $.ajax({
    type: "get",
    url: "/admin/manage/milestones",
    data: params    
    }).done((res)=>{
        console.log(res)
    const table = document.getElementById('table-body-milestone')
    if(!res.success){
        table.innerHTML = ""
        alterError("Không tìm thấy đợt thực tập") 
    }else {
        document.getElementById("alter").innerHTML = ""
        const data = res.data.milestones        
        let row = ""
        data.forEach((val, index)=>{
        row += `<tr id="addMilestone"><tr>
                <tr id="${val._id}">
                    <td>${val.semester}</td>
                    <td>${val.hk}</td>
                    <td>${val.endRegister}</td>
                    <td>${val.startIntern}</td>
                    <td>${val.endIntern}</td>
                    <td>${val.endCore}</td>
                    ${val.endRegister < Date.now() ? `<td class="align-middle"><span class="sd-icon" id="editMilestone" onclick="editMilestone('${val._id}')"><i class="fas fa-edit"></i></span></td>`: ""}
                </tr>`
        })
        table.innerHTML = row
    }
    })
}
// function alterSuccess(str){
//     const alter = document.querySelector('#alter')
//     alter.innerHTML = `<div class="alert alert-success alert-dismissible fade show" role="alert">
//                         ${str}
//                         <button type="button" class="close" data-dismiss="alert" aria-label="Close">
//                             <span aria-hidden="true">&times;</span>
//                         </button>
//                 </div>`
// }

// function alterError(str){
//     const alter = document.querySelector('#alter')
//     alter.innerHTML = `<div class="alert alert-danger alert-dismissible fade show" role="alert">
//                         ${str}
//                         <button type="button" class="close" data-dismiss="alert" aria-label="Close">
//                             <span aria-hidden="true">&times;</span>
//                         </button>
//                 </div>`
// }