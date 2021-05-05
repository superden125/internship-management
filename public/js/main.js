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
