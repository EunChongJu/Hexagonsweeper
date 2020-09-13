

// 맵의 설정(시작화면)의 모든 함수
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
function setSize(width, height, number) {
	setWidth(width);
	setMaxHeight(height);
	setMinHeight(height);
	setNumber(number);
}
function changeHeight() {
	setMinHeight(getHeight());
}
function getWidth() { return getValueOfId('width'); }
function getHeight() { return getValueOfId('maxHeight'); }
function getNumber() { return getValueOfId('number'); }
function setWidth(width) { setValueOfId('width', width); }
function setMaxHeight(height) { setValueOfId('maxHeight', height); }
function setMinHeight(height) { changeValueOfId('minHeight', height-1); }
function setNumber(number) { setValueOfId('number', number); }
function resetLevel() { setSize(10,10,1); }

// 기본 설정
var hexa = null;

// 처음 화면이 표시될 때 호출되는 것
function start() {
	hexa = new Hexagonsweeper();
}

// 게임 시작을 누르면 맵을 생성하기 위해 생성자를 호출하는 함수
function gameStart() {
	hexa.start();
}
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


// 게임 시작 버튼을 누른 후 맵에 표시되는 일을 함



// 시작 후 셀을 누르는 이벤트를 감지하고 처리



// 셀 누르는 것에 따라 게임 오버가 되는지, 계속 진행되는지에 따라 달라진다.


// 게임 오버가 아닌 계속 진행형일 경우를 처리


// 게임 오버로 나올 경우, 게임오버로 처리하기 위해 처리



// 어떤 아이디로부터 값을 얻어내는 작업을 함수화하여 간략하게 줄임
function getValueOfId(id) {
	return document.getElementById(id).value;
}
function setValueOfId(id, value) {
	document.getElementById(id).value = value;
}
function changeValueOfId(id, value) {
	document.getElementById(id).innerHTML = value;
}

// 디스플레이 설정
function setDisplay(id, set) {
	document.getElementById(id).style.display = set;
}
function sceneChange(from, to) {
	setDisplay(from, 'none');
	setDisplay(to, 'block');
}
