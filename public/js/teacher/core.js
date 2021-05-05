
$(document).ready(()=>{
    const tableCore = document.querySelector('#table-core-body')
    if(tableCore){
        loadData()
        addEventInputCore()
    }

    const tableIndex = document.querySelector("#table-index-body")
    if(tableIndex){
        loadDataIndex()
    }
    
})

function addEventInputCore(){
    document.querySelectorAll('.core').forEach((val)=>{
        val.addEventListener('change', (e)=>{
            if(e.target.value < 0 || e.target.value > 10) return console.log(" >= 0 và <=10")
            if(e.target.value == '') return console.log("Require")
            
        })
    })
}


// document.querySelector("#search").addEventListener('keypress', (e)=>{
//     if(e.key=="Enter"){
//         const queries = { search: e.target.value}
//         loadData(queries)
//     }
// })


function getInput(){
    const inputCore = document.querySelectorAll('.core')
    let allCore = []
    inputCore.forEach((val)=>{        
            if(val.value < 0 || val.value > 10) return false
            if(val.value == '') return false
            const index = allCore.findIndex(x=> x.id === val.id.split('-')[1])        
            if(index==-1){
                allCore.push({id: val.id.split('-')[1], core: val.value})    
            }else{
                allCore[index].core = val.value
            }            
    })
    
    return allCore
}

function saveManyCore(){
    const data = getInput();
    console.log(data)
    if(!data){
        alterError("Dữ liệu không hợp lệ")
    }
    if(data){
        $.ajax({
            type: "post",
            url: "/teacher/save-many-core",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(data)
        }).done((res)=>{
            if(res.success){
                const table = document.querySelector('#table-core-body')
                loadData(table)
                alterSuccess("Lưu thành công")
            }
        })
    }
    
}



function loadData(queries){

    let params = {}
    let hk = document.querySelector("#hk").value
    let semester = document.querySelector("#semester").value
    params.hk = hk
    params.semester = semester
    if(queries){
        Object.keys(queries).forEach((key)=>{
            params[key] = queries[key]
        })
    }

    let row = ""
    const table = document.querySelector('#table-core-body')    
    table.innerHTML="<tbody></tbody>"
    
    $.ajax({
        type: 'get',
        url: `/teacher/get-many-interninfo`,
        data:params
    }).done((res)=>{
        if(res.success){
            
            const endCore = res.data.endCore
            if(document.getElementById)
                document.getElementById('endCore').innerHTML = formatDate(endCore)

            data = res.data.internInfos
            data.forEach((val, index)=>{

                let core = ""
                if(parseInt(val.core) == -1){
                    core = `<td><input value="" type="number" max="10" min="0" name="core-${val._id}" id="core-${val._id}" class="core"/></td>`+
                    `<td><span class="sd-icon mr-4" onclick="saveCore('${val._id}')"> <i class="fas fa-save"></i> </span></td>`
                }
                else{
                    core = `<td>${val.core}</td>
                            ${new Date(endCore) >= Date.now() ? `<td><span class="sd-icon" id="editCore" onclick="editCore('${val._id}')"><i class="fas fa-edit"></i></span></td>`:""}`
                }

                row += `<tr id="${val._id}">`+
                    `<td class="text-left align-middle">${index + 1}</td>`+
                    `<td class="text-left align-middle">${val.student.ms}</td>`+
                    `<td class="text-left align-middle">${val.student.name}</td>`+
                    `<td class="text-left align-middle">${val.internUnit.name}</td>`+
                    `<td class="text-left align-middle">${val.internUnit.cityName}</td>`+
                    core +
                    //`<td><input value="${parseInt(val.core) == -1 ? "": parseInt(val.core)}" type="number" max="10" min="0" name="core-${val._id}" id="core-${val._id}" class="core"/></td>`+
                `</tr>`                
            })
            table.innerHTML = `<tbody>${row}</tbody>`
            addEventInputCore()
            addPagination(res.data.pagination)
        }
    })
}

function loadDataIndex(queries){
    
    let params = {}
    let hk = document.querySelector("#hk").value
    let semester = document.querySelector("#semester").value
    params.hk = hk
    params.semester = semester
    if(queries){
        Object.keys(queries).forEach((key)=>{
            params[key] = queries[key]
        })
    }
    
    
    const table = document.querySelector("#table-index-body")
    table.innerHTML="<tbody></tbody>"
    $.ajax({
        type: 'get',
        url: `/teacher/get-many-interninfo`,
        data: params
    }).done((res)=>{
        if(res.success){
            console.log(res.data)
            document.querySelector("#semester").value = res.data.semester
            document.querySelector("#hk").value = res.data.hk

            const table = document.querySelector("#table-index-body")
            table.innerHTML="<tbody></tbody>"
            data = res.data.internInfos
            let row = ""
            data.forEach((val, index)=>{
                row +=  `<tr id="${val._id}"  onclick="return window.location.href ='/teacher/${val.shortId}'">`+
                `<td class="text-left align-middle">${index + 1}</td>`+
                `<td class="text-left align-middle">${val.student.ms}</td>`+
                `<td class="text-left align-middle">${val.student.name}</td>`+
                `<td class="text-left align-middle">${val.internUnit.name}</td>`+
                `<td class="text-left align-middle">${val.internUnit.cityName}</td>`+
                // `<td><input value=${val.core == -1 ? "": item.core}" type="number" max="10" min="0" name="core-<%= item._id %>" id="core-<%= item._id %>" class="core"/></td>`+
              `</tr>`
            })
            table.innerHTML=`<tbody>${row}</tbody>`
            addPagination(res.data.pagination)
        }
    })
}

function addPagination(pagination){
    console.log(pagination)
    let indexPage = ""//`<li class="page-item ${pagination.page === 1 && 'active'}"><button class="page-link" onclick="changePage(1)">1</button></li>`

    if(pagination.totalRow <=3)
        for(let i = 0; i< pagination.totalRow; i++){
            indexPage += `<li class="page-item ${pagination.page === i + 1 && 'active'}"><button class="page-link" onclick="changePage(${i+1})">${i+1}</button></li>`
    }else{
        if(pagination.page == 1){
            indexPage = `<li class="page-item ${pagination.page === 1 && 'active'}"><button class="page-link" onclick="changePage(1)">1</button></li>`+
                `<li class="page-item "><button class="page-link" onclick="changePage(2)">2</button></li>`+
                `<li class="page-item disabled'}"><button class="page-link">...</button></li>`+
                `<li class="page-item"><button class="page-link" onclick="changePage(${pagination.totalRow})">${pagination.totalRow}</button></li>`
        }else{
            if(pagination.page == pagination.totalRow){
                indexPage = `<li class="page-item"><button class="page-link" onclick="changePage(1)">1</button></li>`+
                    `<li class="page-item disabled"><button class="page-link">...</button></li>`+
                    `<li class="page-item"><button class="page-link" onclick="changePage(${pagination.totalRow - 1})">${pagination.totalRow - 1}</button></li>`+
                    `<li class="page-item active"><button class="page-link" onclick="changePage(${pagination.totalRow})">${pagination.totalRow}</button></li>`
            }else{
                indexPage = `<li class="page-item"><button class="page-link" onclick="changePage(1)">1</button></li>`
                if(pagination.page - 1 == 1){
                    indexPage += `<li class="page-item active"><button class="page-link onclick="changePage(${pagination.page})">${pagination.page}</button></li>`+
                    `<li class="page-item"><button class="page-link" onclick="changePage(${pagination.page + 1})">${pagination.page + 1}</button></li>`+
                    `<li class="page-item"><button class="page-link")">...</button></li>`
                }
                if(pagination.page + 1 == pagination.totalRow){
                    indexPage += `<li class="page-item"><button class="page-link disabled">...</button></li>`+
                        `<li class="page-item"><button class="page-link" onclick="changePage(${pagination.page-1})">${pagination.page-1}</button></li>`+
                        `<li class="page-item active"><button class="page-link" onclick="changePage(${pagination.page})">${pagination.page}</button></li>`
                    
                }
                if(pagination.page - 1 > 1 && pagination.page + 1 < pagination.totalRow){
                    indexPage += pagination.page -2 > 1 ? `<li class="page-item"><button class="page-link disabled">...</button></li>`: ""
                    indexPage += `<li class="page-item"><button class="page-link" onclick="changePage(${pagination.page-1})">${pagination.page-1}</button></li>`+
                        `<li class="page-item active"><button class="page-link onclick="changePage(${pagination.page})">${pagination.page}</button></li>`+
                        `<li class="page-item"><button class="page-link" onclick="changePage(${pagination.page + 1})">${pagination.page + 1}</button></li>`
                    indexPage += pagination.page + 2 < pagination.totalRow ? `<li class="page-item"><button class="page-link disabled">...</button></li>`: ""
                }
                indexPage += `<li class="page-item"><button class="page-link" onclick="changePage(${pagination.totalRow})">${pagination.totalRow}</button></li>`
            }
        }
    }
 
    document.querySelector("#pagination").innerHTML = 
    `<nav aria-label="Page navigation example" class="ml-auto mt-4 mb-4">`+
        `<ul class="pagination pagination-static-b">`+
        `<li class="page-item" >`+
            `<button class="page-link" onclick="changePage(${-1},${pagination.page})" aria-label="Previous" ${pagination.page <= 1 && 'disabled'}>`+
            `<span aria-hidden="true">&laquo;</span>`+
            `</button>`+
        `</li>`+
            indexPage +
        `<li class="page-item">`+
            `<button class="page-link" onclick="changePage(${1},${pagination.page})" aria-label="Next" ${pagination.page >= pagination.totalRow && 'disabled'}>`+
            `<span aria-hidden="true">&raquo;</span>`+
            `</button>`+
        `</li>`+
        `</ul>`+
    `</nav>`    
}

function changePage(nextPage, currentPage){
    let page = 1;
    if(!currentPage){
        page = nextPage
    }else{
        page = currentPage + nextPage
    }

    if(document.querySelector('#table-index-body'))
            loadDataIndex({page})
    if(document.querySelector('#table-core-body'))    
            loadData({page})    
}


function saveCore(id){
    const core = document.querySelector(`#core-${id}`).value
    console.log(core)
    if(core < 0 || core > 10 || core =='') {
        alterError("Dữ liệu không hợp lệ")
        return console.log("err")
    }

    const data = {
        id,
        core: document.querySelector(`#core-${id}`).value
    }
    $.ajax({
        type: "post",
        url: "/teacher/save-core",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(data)
    }).done((res)=>{
        if(res.success){
            const table = document.querySelector('#table-core-body')
            loadData(table)
            alterSuccess("Lưu thành công")
            // window.location.href = "/teacher/core"
        }
    })

}

function editCore(id){
    console.log("call")
    const row = document.getElementById(`${id}`).childNodes
    const tdCore = row[5]
    const tdButton = row[7]
    const currentCore = tdCore.innerHTML
    console.log(row)
    tdCore.innerHTML = `<td><input value="${currentCore}" type="number" max="10" min="0" name="core-${id}" id="core-${id}" class="core"/></td>`
    tdButton.innerHTML = `<span class="sd-icon mr-4" onclick="saveCore('${id}')"> <i class="fas fa-save"></i> </span><span class="sd-icon" onclick="deleteCore('${id}', '${currentCore}')"> <i class="fas fa-backspace"></i> </span>`
}

function deleteCore(id, currentCore){
    const row = document.getElementById(`${id}`).childNodes
    const tdCore = row[5]
    const tdButton = row[7]
    tdCore.innerHTML = `<td>${currentCore}</td>`
    tdButton.innerHTML = `<span class="sd-icon" id="editCore" onclick="editCore('${id}')"><i class="fas fa-edit"></i></span>`
}

// <% internInfos.forEach((item, index)=>{%> 
    // <tr id="<%= item._id %>">
    //   <td class="text-left align-middle"><%= index + 1 %></td>
    //   <td class="text-left align-middle"><%= item.student.mssv %></td>
    //   <td class="text-left align-middle"><%= item.student.name %></td>
    //   <td class="text-left align-middle"><%= item.internUnit.name %></td>
    //   <td class="text-left align-middle"><%= item.internUnit.cityName %></td>
    //   <td><input value="<%= item.core == -1 ? "": item.core %>" type="number" max="10" min="0" name="core-<%= item._id %>" id="core-<%= item._id %>" class="core"/></td>
    // </tr>
//   <% }); %>

// <% internInfos.forEach((item, index)=>{%> 
//     <tr id="<%= item._id %>" onclick="return window.location.href = '/teacher/<%= item.shortId%>'">
//       <td class="text-left align-middle"><%= index + 1 %></td>
//       <td class="text-left align-middle"><%= item.student.mssv %></td>
//       <td class="text-left align-middle"><%= item.student.name %></td>
//       <td class="text-left align-middle"><%= item.internUnit.name %></td>
//       <td class="text-left align-middle"><%= item.internUnit.cityName %></td>
//       <td></td>
//     </tr>
//   <% }); %> 