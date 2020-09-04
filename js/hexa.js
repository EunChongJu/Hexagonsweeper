
function setMapDisplay(w, h) {
	var code = getCodeMapDisplay(w,h);
	document.getElementById('hexcell-map').innerHTML = code;
}

// 파라미터의 h는 maxHeight임.
function getCodeMapDisplay(w, h) {
	var code = '';
	var width = w;
	var index = 1;
	
	for (var i = 0; i < width; i++) {
		var height = (i%2==0) ? (h-1) : h;
		
		code += '<div class="hexcell-line">';
		
		for (var j = 0; j < height; j++) {
			code += '<button class="hexcell">' + (index++) + '</button>';
		}
		
		code += '</div>';
	}
	
	return code;
}

//setMapDisplay(10,10);




