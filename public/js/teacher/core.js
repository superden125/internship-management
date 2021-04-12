
$(document).ready(()=>{
    loadData()
    addEventInputCore()
})

function addEventInputCore(){
    document.querySelectorAll('.core').forEach((val)=>{
        val.addEventListener('change', (e)=>{
            if(e.target.value < 0 || e.target.value > 10) return console.log(" >= 0 và <=10")
            if(e.target.value == '') return console.log("Require")
            // const index = allCore.findIndex(x=> x.id === e.target.id.split('-')[1])        
            // if(index==-1){
            //     allCore.push({id: e.target.id.split('-')[1], core: e.target.value})    
            // }else{
            //     allCore[index].core = e.target.value
            // }
            
            // console.log(JSON.stringify({allCore}))
        })
    })
}


document.querySelector("#search").addEventListener('keypress', (e)=>{
    if(e.key=="Enter"){
        const queries = { search: e.target.value}
        loadData(queries)
    }
})


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
    if(data){
        $.ajax({
            type: "post",
            url: "/teacher/save-many-core",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(data)
        }).done((res)=>{
            if(res.success){
                loadData()
                // window.location.href = "/teacher/core"
            }
        })
    }
    
}



function loadData(queries){
    //let q = ""
    //q = Object.keys(queries).findIndex('search') >= 0 ? queries.search : ""
    $.ajax({
        type: 'get',
        url: `/teacher/get-many-interninfo`
    }).done((res)=>{
        if(res.success){
            console.log(res.data)
            const table = document.querySelector('#table-core-body')
            table.innerHTML="<tbody></tbody>"
            data = res.data.internInfos
            data.forEach((val, index)=>{
                const row = table.insertRow()

                row.insertCell().appendChild(document.createTextNode(index + 1))
                row.insertCell().appendChild(document.createTextNode(val.student.mssv))
                row.insertCell().appendChild(document.createTextNode(val.student.name))
                row.insertCell().appendChild(document.createTextNode(val.internUnit.name))
                row.insertCell().appendChild(document.createTextNode(val.internUnit.cityName))
                const core = row.insertCell()//.appendChild(document.createTextNode(val.core))

                const input = document.createElement('input')
                input.className='core'
                input.name=`core-${val._id}`
                input.id=`core-${val._id}`
                input.setAttribute("value", val.core == -1 ? "": val.core)// = val.core
                input.type = 'number'
                input.max = 10
                input.min = 0
                core.appendChild(input)
                
                
            })
            addEventInputCore()
        }
    })
}

// <% internInfos.forEach((item, index)=>{%> 
//     <tr id="<%= item._id %>">
//       <td class="text-left align-middle"><%= index + 1 %></td>
//       <td class="text-left align-middle"><%= item.student.mssv %></td>
//       <td class="text-left align-middle"><%= item.student.name %></td>
//       <td class="text-left align-middle"><%= item.internUnit.name %></td>
//       <td class="text-left align-middle"><%= item.internUnit.cityName %></td>
//       <td><input value="<%= item.core == -1 ? "": item.core %>" type="number" max="10" min="0" name="core-<%= item._id %>" id="core-<%= item._id %>" class="core"/></td>
//     </tr>
//   <% }); %>