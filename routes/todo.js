
var fs = require('fs');	// 파일 시스템 모듈

exports.list = function(req, res){	// ToDo 목록 가져오기
	fs.exists('./todo_list.json', function (exists) {	// ToDo 목록 존재 확인
		if(exists) {
			fs.readFile('./todo_list.json', {
				'encoding': 'utf8'
			}, function (err, list) {	// todo_list.json 파일 읽기
				res.json(list);
			});
		} else {
			var list = {	// 기본 ToDo 목록 형식
				'list': []
			};
				
			fs.writeFile('./todo_list.json', JSON.stringify(list), function (err) {	// todo_list.json 파일 쓰기
				res.json(list);
			});
		}
	});
};

exports.add = function(req, res){	// 새로운 ToDo 항목 추가하기
	var todo = {	// 기본 ToDo 항목 형식
		'title' : '',
		'contents': '',
		'date':'',
		'complete': false
	};
	
	todo.contents = req.body.contents;
	todo.title = req.body.title;
	todo.date = req.body.date;
	fs.readFile('./todo_list.json', {
		'encoding': 'utf8'
	}, function (err, data) {
		data = JSON.parse(data);
		
		data.list.push(todo);	// 새로운 ToDo 항목 추가
		
		fs.writeFile('./todo_list.json', JSON.stringify(data), function (err) {
			res.json(true);
		});
	});
};

exports.modify = function(req, res){	// 선택한 ToDo 항목 수정하기

	fs.readFile('./todo_list.json', {
		'encoding': 'utf8'
	}, function (err, data) {
		data = JSON.parse(data);
		
		// console.log(req.body.index);
		// console.log(req.body.title);
		// console.log(req.body.contents);
		data.list[req.body.index].title=req.body.title;
		data.list[req.body.index].contents=req.body.contents;
		fs.writeFile('./todo_list.json', JSON.stringify(data), function (err) {
			res.json(true);
		});
	});
};

exports.complete = function(req, res){	// 선택한 ToDo 항목 완료하기
	fs.readFile('./todo_list.json', {
		'encoding': 'utf8'
	}, function (err, data) {
		data = JSON.parse(data);
		
		//console.log(req.body.index);
		data.list[req.body.index].complete = true;
		
		fs.writeFile('./todo_list.json', JSON.stringify(data), function (err) {
			res.json(true);
		});
	});
};

exports.del = function(req, res){	// 선택한 ToDo 항목 삭제하기
	fs.readFile('./todo_list.json', {
		'encoding': 'utf8'
	}, function (err, data) {
		data = JSON.parse(data);
		
		data.list[req.body.index] = null;	// 선택한 ToDo 항목 삭제
		data.list = data.list.filter(Boolean);	// 유효한 값 추려내기
		
		fs.writeFile('./todo_list.json', JSON.stringify(data), function (err) {
			res.json(true);
		});
	});
};