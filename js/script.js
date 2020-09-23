
// 헬프 프로그램을 실행한다.
function activeHelp() {
	
}

//// 맵의 설정(시작화면)의 모든 함수

// 레벨 선택에 따른 옵션 값 설정
function setLevel(level) {
	switch(level) {
		case 1:
			setSize(5,5,3);
			break;
		case 2:
			setSize(7,9,7);
			break;
		case 3:
			setSize(15,15,10);
			break;
	}
}
// 맵의 옵션(맵의 크기 속성)을 설정한다.
function setSize(width, height, number) {
	setWidth(width);
	setMaxHeight(height);
	setMinHeight(height);
	setNumber(number);
}
// maxHeight에 따라 minHeight가 변경되는 함수
function changeHeight() {
	setMinHeight(getHeight());
}

// 게임 시작 전에 보이는 input의 값을 얻거나 수정하는 함수의 집합
function getWidth() { return getValueOfId('width'); }
function getHeight() { return getValueOfId('maxHeight'); }
function getNumber() { return getValueOfId('number'); }
function setWidth(width) { setValueOfId('width', width); }
function setMaxHeight(height) { setValueOfId('maxHeight', height); }
function setMinHeight(height) { changeValueOfId('minHeight', height-1); }
function setNumber(number) { setValueOfId('number', number); }
function resetLevel() { setSize(10,10,1); }


//// 기본 설정
var hexa = null;	// 생성자를 저장하는 변수
var flag = false;	// 지뢰 배치 여부를 저장하는 변수
var options = null;	// 옵션을 저장하는 변수
var flagHexa = null;	// 깃발 또는 물음표 표시, 누른 순서 위치를 저장하는 맵 (누른 순서는 서버를 위한 것임)


// 처음 로드되고나서 화면을 표시하기 위해 호출하는 것
function start() {
	hexa = new Hexagonsweeper();
	flagHexa = new Hexagonsweeper();
}

// 게임을 시작하면 헥사맵 생성자를 호출하고, 디스플레이에 표시되는 함수
function gameStart() {
	// 옵션 값을 가져온다.
	options = getMapOptions();
	
	// 게임을 시작함으로써 설정된 값을 생성자에 넘기고 맵을 세팅한다.
	hexa.start(options.width, options.height, options.number);
	flagHexa.start(options.width, options.height, options.number);
	
	// 게임 실행중임을 디스플레이에 보여준다.
	showMap(options.width, options.height);
	sceneChange('start', 'game');
	
	// 모든 클릭을 감지하여 실행하도록 한다.
	eventActive();
}

// 시작화면에 있는 모든 옵션 값을 가져온다.
function getMapOptions() {
	var width = getWidth();
	var height = getHeight();
	var number = getNumber();
	
	return {
		width: width,
		height: height,
		number: number
	};
}

// 맵의 모든 셀의 클릭 이벤트를 감지하는 함수
function eventActive() {
	var cellMapAll = document.querySelector("#hexcell-map");
	cellMapAll.addEventListener("mousedown", cellClickEvent, false);
}

// 맵을 디스플레이에 표시하기 위한 함수 : 코드부터 생성하고 이를 디스플레이에 표시한다.
function showMap(w, h) {
	var id = 'hexcell-map';
	var code = setUpMapCode(w,h);
//	document.getElementById('hexcell-map').innerHTML = code;
	changeValueOfId(id, code);
}

// 디스플레이에 표시하기 위한 코드를 생성한다.
function setUpMapCode(w,h) {
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


// 게임 시작 버튼을 누른 후 맵에 표시되는 일을 함



// 우측클릭 방지
window.oncontextmenu = function() {
	return false;
};

// 유효 검증
function validClickId(id) {
	var arr = splitClickCellId(id);
	return ((arr.length == 3) && (arr[0] == 'c'));
}

// 클릭된 아이디를 쪼개서 각각의 속성 값으로 반환
function getClickCellOption(id) {
	var arr = splitClickCellId(id);
	var x = parseInt(arr[1]);
	var y = parseInt(arr[2]);
	
	return {
		x: x,
		y: y
	};
}

// 아이디를 하이픈을 기준으로 분할하여 배열로 반환
function splitClickCellId(id) {
	return id.split('-');
}

// 시작 후 셀을 누르는 이벤트를 감지하고 처리
function cellClickEvent(e) {
	if (e.targe !== e.currentTarget && validClickId(e.target.id)) {
		var option = getClickCellOption(e.target.id);	// {x,y}
		
		if (e.button == 0) {
			// left click
			clickLeftButtonToCell(option.x, option.y);
		}
		else if (e.button == 2) {
			// right click
			clickRightButtonToCell(option.x, option.y);
		}
		else return;
	}
	e.stopPropagation();
}

// 마우스의 왼쪽 버튼 클릭 시, 처리하는 함수
function clickLeftButtonToCell(x, y) {
//	console.log('left click and x: '+x+', y: '+y);
	if (!flag) {
		firstClickCell(x,y);
		return;
	}
	if (hexa.click(x,y) && (flagHexa.click(x,y) != 1)) {
		clickCell(x,y);
//		cellColoring(x,y,'#EF8');
	}
}

// 마우스 오른쪽 버튼 클릭 시, 처리하는 함수
function clickRightButtonToCell(x, y) {
//	console.log('right click and x: '+x+', y: '+y);
//	cellColoring(x,y,'#FE8');
	
	var data = getFlagHexa(x,y);
	
	switch(data) {
		case 0:
			data++;
			setUpFlag(x,y);
			break;
		case 1:
			data++;
			setUpQ(x,y);
			break;
		case 2:
			data = 0;
			setDown(x,y);
			break;
	}
	
	flagHexa.setItem(x,y,data);
	
}

function getFlagHexa(x, y) {
	return flagHexa.getItem(x,y);
}

// 처음 누르는 것이라면, 지뢰 배치를 실행하도록 한다.
function firstClickCell(x, y) {
	if (hexa.firstClick(x, y)) {
		flag = !flag;
		cellColoring(x,y,'#FFF');
	}
}

// 해당 좌표를 아이디로 얻어냄
function getCellId(x, y) {
	return 'c-' + x + '-'+ y;
}

// 이건 뭐 컬러링용인데
function cellColoring(x, y, hex) {
	var id = getCellId(x,y);
	getElementId(id).style.background = hex;
}

// 해당 셀이 아무도 없는(0) 값이라면, 주변을 찾아 1 이상이 나올 때까지 처리한다.
function groundZero(x, y) {
	
}

// 해당 셀에 1 이상의 값이 나오면, 해당 숫자와 함께 컬러링을 해준다.
function clickCell(x, y) {
	var data = hexa.click(x,y);
	var id = getCellId(x,y);
//	var cell = document.getElementById(id);
	var cell = getElementId(id);

	
	if (!isMine(x,y)) {	// 지뢰가 터짐
		gameOver();
		return;
	}
	cell.disabled = true;
	cell.innerHTML = ''+data;
	cell.classList.add('v'+data);
}

// 셀 누르는 것에 따라 게임 오버가 되는지, 계속 진행되는지에 따라 달라진다.


// 지뢰인지 아닌지 판단
function isMine(x, y) {
	return hexa.isMine(x,y);
}

// 주변을 탐색하는 것을 테스트함 (함수형 프로그래밍을 참조하여 스크립트 내에도 주변을 탐색하는데 접근할 수 있음)
function o(x, y) {
	console.log('x: '+x+', y: '+y+', value: ');
}
function around(x, y) {
	hexa.around(x, y, o);
}


// 게임 오버가 아닌 계속 진행형일 경우를 처리

// 왼쪽 클릭

// 해당 셀의 숫자를 소환

// 해당 숫자와 숫자에 맞게 색깔을 표시

// 셀에 아무도 없다면 다른 곳을 들춰내도록 하는 함수


// 오른쪽 클릭

// 깃발을 배치
function setUpFlag(x, y) {
	setUpData(x,y,'🚩');
}

// 물음표를 배치
function setUpQ(x, y) {
	setUpData(x,y,'?');
}

// 배치한 어떤것이든 다시 비움
function setDown(x, y) {
	setUpData(x,y,'');
}

// 해당 셀의 값에 따라 깃발 또는 물음표, 없음으로 전환하도록 한다.


// 셀에 표시된 데이터의 값을 갱신하거나 바꾸는 함수
function setUpData(x, y, data) {
	var id = getCellId(x,y);
//	document.getElementById(id).innerHTML = data;
	changeValueOfId(id, data);
}


// 게임 오버로 나올 경우, 게임오버로 처리하기 위해 처리
function gameOver() {
	// 먼저 게임오버가 되었다는 것을 보여주기 위해 지뢰를 보여준다.
	
	// 그리고 지뢰가 터지고나서, 게임오버 창으로 전환한다.
	
//	sceneChange('game', 'over');
}


// 어떤 아이디로부터 값을 얻어내는 작업을 함수화하여 간략하게 줄임
function getValueOfId(id) {
	return getElementId(id).value;
}
function setValueOfId(id, value) {
	getElementId(id).value = value;
}
function changeValueOfId(id, value) {
	getElementId(id).innerHTML = value;
}
function getElementId(id) {
	return document.getElementById(id);
}

// 디스플레이 설정
function setDisplay(id, set) {
	var element = getElementId(id);
	element.style.display = set;
}
function sceneChange(from, to) {
	setDisplay(from, 'none');
	setDisplay(to, 'block');
}
