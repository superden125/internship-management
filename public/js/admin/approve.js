function getAllInternInfos() {
  var table = $('#approve-internship')[0];
  var trThead = '',
    trTbody = '';

  $.ajax({
      method: 'GET',
      url: '/admin/internship/approve-getMethod'
    })
    .done(res => {
      if (res.status == 'success') {
        console.log(res.data.internInfos);
        if (res.data.internInfos.length !== 0) {
          trThead = `<thead><tr><th class="text-left align-middle" scope="col">#</th><th class="text-left align-middle" scope="col">Mã số sinh viên<a class="ml-1" href="?_sort&column=student.mssv&type=${res.data.type}"><i class="fas fa-sort text-body"></i></a></th><th class="text-left align-middle" scope="col">Họ và tên<a class="ml-1" href="?_sort&column=student.name&type=${res.data.type}"><i class="fas fa-sort text-body"></i></a></th><th class="text-left align-middle" scope="col">Tên công ty<a class="ml-1" href="?_sort&column=internshipUnit.name&type=${res.data.type}"><i class="fas fa-sort text-body"></i></a></th><th class="text-left align-middle" scope="col">Tỉnh/ Thành phố<a class="ml-1" href="?_sort&column=internshipUnit.city&type=${res.data.type}"><i class="fas fa-sort text-body"></i></a></th><th class="text-left align-middle" scope="col">Trạng thái<a class="ml-1" href="?_sort&column=status&type=${res.data.type}"><i class="fas fa-sort text-body"></i></a></th></tr></thead>`;
          table.innerHTML = trThead;

          res.data.internInfos.forEach((obj, index) => {
            index += res.data.indexCount;
            trTbody += `<tr id="${ obj.shortId }" onclick="redirectDetailApprove(this.id)"><td class="text-left align-middle ${ obj.styleClass }">${ index + 1 }</td><td class="text-left align-middle ${ obj.styleClass }">${obj.student.mssv}</td><td class="text-left align-middle ${ obj.styleClass }">${obj.student.name}</td><td class="text-left align-middle ${ obj.styleClass }">${obj.internshipUnit.name}</td><td class="text-left align-middle ${ obj.styleClass }">${obj.city}</td><td class="text-left align-middle ${ obj.styleClass }">${obj.statusString}</td></tr>`;
          });

          table.innerHTML += trTbody;
        } else {
          table.innerHTML = 'Chưa có yêu cầu nào';
        }


        $('#loading').remove();
      }
    })
}

function redirectDetailApprove(id) {
  console.log(id);
  window.location.href = `/admin/internship/approve/${id}`;
}