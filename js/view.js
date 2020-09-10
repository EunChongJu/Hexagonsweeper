

// 이 파일은 보여주기 위한 것이다.

var View = function() {
	this.new = function(w, h) {
		var code = start(w,h);
		document.getElementById('hexcell-map').innerHTML = code;
	};
	
	function start(w,h) {
		var code = '';
		for (var i = 0; i < w; i++) {
			var maxH = (i%2==0) ? (h-1) : h;
			code += '<div class="hexcell-line">';
			for (var j = 0; j < maxH; j++) {
				code += '<button class="hexcell" id="c-'+i+'-'+j+'"></button>';
			}
			code += '</div>';
		}
		return code;
	}
	
	this.update = function(data) {
		
	};
	
	this.end = function() {
		
	};
};

//// View.js의 사용 예:

// view를 생성한다.
var view = new View();


