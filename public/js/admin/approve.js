function getAllInternInfos() {
  var table = $('#approve-internship');
  var trThead = '',
    trTbody = '';

  var url = '/admin/internship/approve';

  if (window.location.href.includes('_sort')) {
    url += `/get?_sort&column=${column}&type=${type}`
  }

  var pagination = $('#pagination');

  $.ajax({
      method: 'GET',
      url: url
    })
    .done(res => {
      if (res.status == 'success') {
        if (res.data.internInfos.length !== 0) {
          trThead = `<thead><tr><th class="text-left align-middle" scope="col">#</th><th class="text-left align-middle" scope="col" onclick="sort()">Mã số sinh viên<a class="ml-1" href="?_sort&column=student.ms&type=-1"><i class="fas fa-sort text-body"></i></a></th><th class="text-left align-middle" scope="col">Họ và tên<a class="ml-1" href="javascript:sort(student.name, ${res.data.type})"><i class="fas fa-sort text-body"></i></a></th><th class="text-left align-middle" scope="col">Tên công ty<a class="ml-1" href="/get?_sort&column=internshipUnit.name&type=${res.data.type}"><i class="fas fa-sort text-body"></i></a></th><th class="text-left align-middle" scope="col">Tỉnh/ Thành phố<a class="ml-1" href="/get?_sort&column=internshipUnit.city&type=${res.data.type}"><i class="fas fa-sort text-body"></i></a></th><th class="text-left align-middle" scope="col">Trạng thái<a class="ml-1" href="/get?_sort&column=status&type=${res.data.type}"><i class="fas fa-sort text-body"></i></a></th></tr></thead>`;

          res.data.internInfos.forEach((obj, index) => {
            index += res.data.indexCount;
            trTbody += `<tr id="${ obj.shortId }" onclick="redirectDetailApprove(this.id)"><td class="text-left align-middle ${ obj.styleClass }">${ index + 1 }</td><td class="text-left align-middle ${ obj.styleClass }">${obj.student.ms}</td><td class="text-left align-middle ${ obj.styleClass }">${obj.student.name}</td><td class="text-left align-middle ${ obj.styleClass }">${obj.internshipUnit.name}</td><td class="text-left align-middle ${ obj.styleClass }">${obj.city}</td><td class="text-left align-middle ${ obj.styleClass }">${obj.statusString}</td></tr>`;
          });

          table.html(trThead + trTbody);
        } else {
          table.innerHTML = 'Chưa có yêu cầu nào';
        }

        var content = '<ul class="pagination pagination-static-b">';
        if (res.data.totalPages > 1) {
          if (res.data.current == 1) {
            content += `<li class="page-item disabled"><a href="#" class="page-link">&laquo;</a></li>`;
          } else {
            content += `<li class="page-item"><a href="/admin/internship/approve/get?page=${res.data.current - 1}" class="page-link">&laquo;</a></li>`;
          }

          if (res.data.current == 1) {
            content += `<li class="page-item active"><a href="#" class="page-link">1</a></li>`;
          } else {
            content += `<li class="page-item"><a href="?page=1" class="page-link">1</a></li>`;
          }

          var i = res.data.current > 3 ? res.data.current - 1 : 2;
          if (i !== 2) {
            content += `<li class="page-item disabled"><a href="#" class="page-link">...</a></li>`;
          }

          while ((i <= (res.data.totalPages - 1)) && (i < (res.data.current + 2))) {
            if (i == res.data.current) {
              content += `<li class="page-item active"><a href="?page=${i}" class="page-link">${i}</a></li>`;
            } else {
              content += `<li class="page-item"><a href="?page=${i}" class="page-link">${i}</a></li>`;
            }

            if ((i == (res.data.current + 1)) && (i < (res.data.totalPages - 1))) {
              content += `<li class="page-item disabled"><a href="/admin/internship/approve" class="page-link">...</a></li>`;
            }

            i++;
          }

          if (res.data.current == res.data.totalPages) {
            content += `<li class="page-item active"><a href="#" class="page-link">${res.data.totalPages}></a></li><li class="page-item disabled"><a href="#" class="page-link">&raquo;</a></li></ul>`;
          } else {
            content += `<li class="page-item"><a href="?page=${res.data.totalPages}" class="page-link">${res.data.totalPages}</a></li><li class="page-item"><a href="?page=${res.data.current + 1}" class="page-link">&raquo;</a></li></ul>`;
          }
        }

        pagination.html(content);

        $('#loading').remove();
      }
    })
}

function redirectDetailApprove(id) {
  console.log(id);
  window.location.href = `/admin/internship/approve/${id}`;
}

function sort(column, type) {
  return `${window.location.href}/get_sort&column=${column}&type=${type}`;
}

$('#approve-internship tbody tr').click(function () {
  var id = $(this).attr('id');
  window.location.href = `/admin/internship/approve/${id}`;
  // console.log(id);
});

$('.pagination a').click(function () {
  // debugger;
  var currentUrl = window.location.href;
  if (currentUrl.includes('?_sort')) {
    if (currentUrl.includes('page')) {
      var index = currentUrl.indexOf('page');
      currentUrl = currentUrl.slice(0, index - 1);
    }

    var url = currentUrl + '&' + $(this).attr('href').slice(1);
    $(this).attr('href', url);
  }
});

$('#filter-schoolyear-semester').click(function() {
  const queries = {
    schoolYear: $('#school-year-filter').val(),
    semester: $('#semester-filter').val()
  }

  var query = '/admin/internship/approve?'
  
  if (queries.schoolYear !== '') {
    query += `schoolYear=${queries.schoolYear}`
  }

  if (queries.semester !== '') {
    if (query.includes('schoolYear')) {
      query += `&semester=${queries.semester}`
    } else {
      query += `semester=${queries.semester}`
    }
  }

  window.location = query;
})