function alterSuccess(str) {
  const alter = document.querySelector('#alter')
  alter.innerHTML = `<div class="alert alert-success alert-dismissible fade show" role="alert">
                        ${str}
                        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                </div>`
}

function alterError(str) {
  const alter = document.querySelector('#alter')
  alter.innerHTML = `<div class="alert alert-danger alert-dismissible fade show" role="alert">
                        ${str}
                        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                </div>`
}

function clearAlters(){
    document.getElementById("alter").innerHTML = ""
}

function formatDate(date){
    const dateObj = new Date(date)
    return `${dateObj.getDate()}-${dateObj.getMonth()+1}-${dateObj.getFullYear()}`
}

function randomPassword(length, id){
    const input = document.getElementById(id)
    if(input){
        let charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
        let str = "";
        for(let i = 0; i<length; i++){
            str +=charset.charAt(Math.floor(Math.random()*charset.length)) 
        }
        input.value = str;
    } 
    
}

function togglePassword(){
    $("#toggle-password").toggleClass("fa-eye fa-eye-slash")
    const input = document.getElementById("password")
    input.getAttribute("type")=="password" ? input.setAttribute("type","text") : input.setAttribute("type","password")
}
