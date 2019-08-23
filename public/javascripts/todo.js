$(document).ready(function () {
	var get_list = function () {
		$.ajax('/list', {
			'success': function (list) {
				var line = '';

				list = JSON.parse(list).list;
				var ncom = '<tr>'; 
				var com = '<tr bgcolor="#acffef">'; //완료 확인

				var pass_date = '<tr bgcolor="#febebe">'; //기한 확인
				var line_color;

				for (var i = 0, len = list.length; i < len; i++) {	// 테이블 내용 만들기
					line_color=ncom;

					//기한 계산
					if(list[i].date!=""){
						var today = new Date();
						today =today.toISOString().substring(0, 10);
						var todayArray = today.split("-");
						var todayObj= new Date(todayArray[0],Number(todayArray[1])-1, todayArray[2]);

						var DdayArray = list[i].date.split("-");
						var DdayObj= new Date(DdayArray[0],Number(DdayArray[1])-1, DdayArray[2]);
						var cal =(todayObj.getTime()- DdayObj.getTime())/1000/60/60/24;
						if(cal<0) line_color = ncom;
						else line_color = pass_date;
					}
					if (list[i].complete) line_color = com;

					line += line_color +
						'<td>' + (i + 1) + '</td>' +
						'<td><button type="button" class="btn btn-title" style="background-color:#81BEF7">' + list[i].title + '</button></td>' +
						'<td><button type="button" class="btn btn-contents" style="background-color:#55E3FB">' + list[i].contents + '</button></td>' +
						'<td><button type="button" class="btn btn-contents" style="background-color:#coffff">' + list[i].date + '</button></td>' +
						'<td><button type="button" class="btn btn-modify" style="background-color:#F4FA58" data-toggle="modal" data-target="#myModal">수정</button></td>' +
						'<td><button type="button" class="btn btn-success">완료</button></td>' +
						'<td><button type="button" class="btn btn-danger">삭제</button></td>' +
						'</tr>';
				}

				$('tbody').html(line);
			}
		});
	};

	get_list();

	$('.form-inline button').click(function () {	// 새로운 할 일 추가하기
		$.ajax('/add', {
			'method': 'POST',
			'data': {
				'title': $('#new_todo_title').val(),
				'contents': $('#new_todo_contents').val(),
				'date': $('#datepicker').val()
			},
			'success': get_list
		});
	});


	$('tbody').on('click', '.btn-modify', function () {	// 선택한 할 일 수정하기
		var index = parseInt($(this).parent().siblings(':first').text()) - 1;

		$('#myModal').on('click', '.btn-modal-modify', function () {
			$.ajax('/modify', {
				'method': 'POST',
				'data': {
					'index': index,	// 선택한 행의 인덱스
					'title': $('#modify_title').val(),
					'contents': $('#modify_contents').val()
				},
				'success': get_list
			});
			$('#myModal').modal("hide"); //닫기 
			//window.location.reload();
		});
	});


	$('tbody').on('click', '.btn-success', function () {	// 선택한 할 일 완료하기
		$.ajax('/complete', {
			'method': 'POST',
			'data': {
				'index': parseInt($(this).parent().siblings(':first').text()) - 1	// 선택한 행의 인덱스
			},
			'success': get_list
		});
	});

	$('tbody').on('click', '.btn-danger', function () {	// 선택한 할 일 삭제하기
		$.ajax('/del', {
			'method': 'POST',
			'data': {
				'index': parseInt($(this).parent().siblings(':first').text()) - 1	// 선택한 행의 인덱스
			},
			'success': get_list
		});
	});
});