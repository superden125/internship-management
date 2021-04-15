function editTeacher(id) {
  const row = document.getElementById(id);
  const child = row.getElementsByTagName('td');

  var selectElement = `<select name="teacher" id="teacher" class="custom-select teacher-select"><option value="null">-- Chọn giảng viên --</option>`;

  var saveButton = `<a class="d-block" href="#" data-toggle="tooltip" data-placement="left" title="Phân công" onclick="assignTeacher('${id}');"><i class="fas fa-share-square text-body"></i></a>`;

  $.ajax({
      method: 'GET',
      url: '/admin/manage/teachers'
    })
    .done(res => {
      res.data.forEach(teacher => {
        selectElement += `<option value="${teacher._id}">${teacher.name}</option>`;
      });

      child[4].innerHTML = selectElement;
      child[5].innerHTML = saveButton;
    });
}

function assignTeacher(id) {
  const row = document.getElementById(id);
  const child = row.getElementsByTagName('td');

  const data = {
    type: 'each',
    internUnitId: id,
    teacherId: child[4].firstChild.value,
  }

  $.ajax({
      method: 'PUT',
      url: '/admin/internship/assign-method',
      data: data
    })
    .done(res => {
      if (res.success) {
        $('#success-alert').removeClass('d-none').fadeTo(2000, 500).slideUp(500, function () {
          $('#success-alert').slideUp(500);
        });

        loadAssignTeacher();
      }
    })
}

function assignMultipleTeacher() {
  const rows = $('tbody tr:has(select)');
  Array.prototype.forEach.call(rows, row => {
    assignTeacher(row.id);
  });
}

function loadAssignTeacher() {
  const tbody = $('#assign-info tbody')[0];
  var tr = '';

  $.ajax({
      method: 'GET',
      url: '/admin/internship/assign-method'
    })
    .done(res => {
      if (res.data) {
        res.data.forEach((item, index) => {
          tr += '<tr id="' + item._id + '">';
          tr += '<td class="align-middle">' + (index + 1) + '</td>';
          tr += '<td class="align-middle">' + item.name + '</td>';
          tr += '<td class="align-middle">' + item.currentSv + '</td>';
          tr += '<td class="align-middle">' + item.cityName + '</td>';

          if (!item.teacherName) {
            tr += '<td class="align-middle font-italic">(Chưa được phân công)</td>';
          } else {
            tr += '<td class="align-middle">' + item.teacherName + '</td>';
          }

          tr += '<td class="align-middle">';
          tr += `<a class="d-block" href="#" data-toggle="tooltip" data-placement="left" title="Chỉnh sửa" onclick="editTeacher('${item._id}')"><i class="fas fa-edit text-body"></i></a>`;
        });

        tbody.innerHTML = tr;

        $('#loading').remove();

      }
    })
}