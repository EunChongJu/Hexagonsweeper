'use strict';

var Hexagonsweeper = function () {
	//// 여기는 private 변수 모음들
	
	// 맵을 저장하는 변수
	var map = null;
	// 맵의 기본 속성을 저장하는 변수
	var mapWidth = 0;
	var mapMinHeight = 0;
	var mapMaxHeight = 0;
	var mapMineNumber = 0;
	
	
	
	//// 여기는 public 변수 모음들
	
	// 플래그 갯수를 저장하는 변수
	this.fNum = 0;
	
	// 큐 갯수를 저장하는 변수
	this.qNum = 0;
	
	// 클릭 카운트를 저장하는 변수
	this.count = 0;
	
	
	
	//// 여기는 public 함수 모음들 (공개된 함수로 누구나 쉽게 접근할 수 있다)
	
	/// 이 함수들은 맵과 관련 있음
	
	// 맵 생성 이전에 사이즈에 따라 최대 크기를 설정할 수 있도록 한다.
	this.getMaxNumber = function (w, h) {
		return getMaxNumber(w,h);
	};
	
	// 맵 생성을 시작한다.
	this.start = function (width, height, number) {	// 여기서 인자의 모든 height는 maxHeight라 한다.
		this.setMapSize(width,height,number);
		createMap();
	};
	
	// 맵을 초기화한다.
	this.reset = function (width, height, number) {
		// 셋 중 하나라도 비어있으면 옵션 현상유지라 판단하고 처리한다.
		if (width==undefined || height==undefined || number==undefined) {
			return clearMap();
		}
		
		// 셋 모두 비어있지 않다면 옵션을 바꾸고, 새로 만든다.
		if (!(width==undefined && height==undefined && number==undefined)) {
			this.setMapSize(width,height,number);
			return createMap();
		}
		return false;
	};
	
	
	
	/// 처음으로 셀을 눌렀을 때, 지뢰 배치에 필요한 모든 함수가 실행되게 하는 프로세스
	
	// 이 함수를 호출함으로써  프로세스가 발동한다.
	this.firstClick = function (x, y) {
		return (isIndexOutOfMap(x,y) ? landStart(x,y) : false);
	};
	
	// 처음이 아닌 클릭을 할 때, 해당 셀에 대해 처리하는 함수
	this.click = function (x, y) {
		return getItem(x,y);
	};
	
	
	
	/// 맵과 관련 없음 (public 변수와 관련됨)
	
	// flags를 지정
	this.fUp = function () {
		this.fNum++;
	};
	this.fDown = function () {
		this.fNum--;
	};
	this.fGet = function () {
		return this.fNum;
	};
	
	// Q를 지정
	this.qUp = function () {
		this.qNum++;
	};
	this.qDown = function () {
		this.qNum--;
	};
	this.qGet = function () {
		return this.qNum;
	};
	
	// 카운트를 지정
	this.countUp = function () {
		this.count++;
	};
	this.countGet = function () {
		return this.count;
	};
	
	
	
	/// ???
	
	
	
	//// 여기는 비공개인 set과 get 함수를 접근할 수 있게 하는 함수 모음들
	
	/// 이 함수는 공개되었으며, 비공개 함수를 접근할 수 있음
	
	// Width
	this.setWidth = function (width) {
		setWidth(width);
	};
	this.getWidth = function () {
		return getWidth();
	};
	
	// Height
	this.setHeight = function (height) {
		setHeight(height);
	};
	this.getHeight = function () {
		return getHeight();
	};
	
	// Max Height
	this.setMaxHeight = function (height) {
		setMaxHeight(height);
	};
	this.getMaxHeight = function () {
		return getMaxHeight();
	};
	
	// Min Height
	this.setMinHeight = function (height) {
		setMinHeight(height);
	};
	this.getMinHeight = function () {
		return getMinHeight();
	};
	
	// Number
	this.setNumber = function (number) {
		setNumber(number);
	};
	this.getNumber = function () {
		return getNumber();
	};
	
	// Map Size Options
	this.setMapSize = function (width, height, number) {
		setMapSize(width, height, number);
	};
	this.getMapSize = function () {
		return getMapSize();
	};
	
	// Map (원래 외부에서 맵을 구할 수 없으나 개발버전에서만 허용)
//	this.setMap = function (data) {
//		setMap(data);
//	};
//	this.getMap = function () {
//		return getMap();
//	};
	
	
	/// 이 함수는 비공개이며 내부를 위한 것이나, 외부에서 접근을 위해서는 위에 지정한 함수를 통해 접근해야 함
	
	// Width
	function setWidth(width) {
		mapWidth = width;
	}
	function getWidth() {
		return mapWidth;
	}
	
	// Height
	function setHeight(height) {
		if (height > 1) {	// height 유효시
			setMaxHeight(height);
			setMinHeight(height-1);
		}
		return;	// height 무효 또는 저장 완료시 반환
	}
	function getHeight() {
		return {
			maxHeight: getMaxHeight(),
			minHeight: getMinHeight()
		};
	}
	
	// Max Height
	function setMaxHeight(height) {
		mapMaxHeight = height;
	}
	function getMaxHeight() {
		return mapMaxHeight;
	}
	
	// Min Height
	function setMinHeight(height) {
		mapMinHeight = height;
	}
	function getMinHeight() {
		return mapMinHeight;
	}
	
	// Number
	function setNumber(number) {
		mapMineNumber = number;
	}
	function getNumber() {
		return mapMineNumber;
	}
	
	// Map
	function setMap(data) {
		map = data;
	}
	function getMap() {
		return map;
	}
	
	// Map Size Options
	function setMapSize(width, height, number) {
		setWidth(width);
		setHeight(height);
		setNumber(number);
	}
	function getMapSize() {
		var width = getWidth();
		var height = getHeight();
		var number = getNumber();
		
		return {
			width: width,
			height: height,
			numbet: number
		};
	}
	
	// 해당 셀을 얻거나 반환
	function setItem(x, y, val) {
		map[x][y] = val;
	}
	function getItem(x, y) {
		return (isIndexOutOfMap(x,y) ? map[x][y] : undefined);
	}
	
	
	//// 여기는 private 함수 모음들 (여기는 비공개된 함수로 외부에서 쉽게 접근이 불가능, 오로지 내부 함수를 위함)
	
	/// 처음 셀을 눌렀을 때 실행되는 프로세스의 모든 함수들
	
	// 'NPZ' is "No Placement Zone" - 지뢰 배치 금지구역
	// 'NTZ' is "No Touch Zone" - 지뢰 배치 금지구역
	
	// 둘다 같은 말인거 같은데 합병이 필요함이 판단됨
	
	// 처음으로 셀을 눌렀을 때 호출되는 함수
	function landStart(x, y) {
		setNPZ(x,y);
		setLandMine();
		unsetNPZ(x,y);
		return true;
	}
	
	// 처음 클릭한 셀을 원점으로 주변 2칸까지를 지뢰 배치 금지구역으로 설정
	function setNPZ(x, y) {
		var a = (x%2==0) ? -1 : -2;
		
		for (var i = -2; i <= 2; i++) {
			var b = Math.abs(i);
			
			if (b == 1) {
				for (var j = 0; j < 4; j++) {
					setNTZ(x+1, y+a+j);
				}
			}
			else if (b == 2) {
				for (var k = -1; k <= 1; k++) {
					setNTZ(x+i, y+k);
				}
			}
			setNTZ(x, y+i);
		}
	}
	
	// 지뢰 배치 실행
	function setLandMine() {
		var num = getNumber();
		var count = 0;
		
		// 정해진 지뢰를 전부 배치 완료할 때까지 반복하고, 배치 후 주변 값을 증산한다.
		while (count < num) {
			// 배치할 좌표를 랜덤으로 생성한다.
			var randIndex = randomSetMine();
			
			// 생성한 좌표에 이미 지뢰가 있거나 배치 금지구역인지 확인한다.
			if (validIndexForLandMines(randIndex.x, randIndex.y)) {
				// 지뢰거나 노터치존 구역이 아니므로 배치
				setItem(randIndex.x, randIndex.y, -1);
				
				// 지뢰를 배치한 셀의 주변 값을 증산한다.
				setUpAround(randIndex.x, randIndex.y);
				// 카운트를 증산한다.
				count++;
			}
		}
	}
	
	// 지뢰 배치 금지구역 해제
	function unsetNPZ(x, y) {
		var a = (x%2==0) ? -1 : -2;
		
		for (var i = -2; i <= 2; i++) {
			var b = Math.abs(i);
			
			if (b == 1) {
				for (var j = 0; j < 4; j++) {
					unsetNTZ(x+i, y+a+j);
				}
			}
			else if (b == 2) {
				for (var k = -1; k <= 1; k++) {
					unsetNTZ(x+i, y+k);
				}
			}
			if (i!=0) unsetNTZ(x, y+i);
		}
	}
	
	// setNPZ()
	// 지뢰 배치금지구역 설정하는 함수
	function setNTZ(x,y) {
		if (validIndexForLandMines(x,y)) {
			setItem(x, y, -2);
		}
	}
	
	// setLandMine
	// 지뢰 배치에서 인덱스를 랜덤으로 추천하는 함수
	function randomSetMine() {
		var width = getWidth();
		var height = getHeight();
		
		var randX = Math.floor(Math.random() * width);
		var randY = Math.floor(Math.random() * ((randX%2==0) ? (height-1) : height));
		
		return {
			x: randX,
			y: randY
		};
	}
	
	// 지뢰가 배치된 셀의 주변 값을 증산. NPZ에 배치를 허용하며, NPZ가 해제될 때, 1 이상이면 0으로 전환할 필요 없음.
	function setUpAround(x, y) {
		var a = ((x%2==0) ? 0 : -1);
		
		setUpAround(x, y-1);
		setUpAround(x, y+1);
		
		for (var i = -1; i <= 1; i+=2) {
			for (var j = a; j <= (a+1); j++) {
				setUpItem(x+i, y+i);
			}
		}
	}
	
	// 지뢰가 있는 셀의 주변을 증산하되, 지뢰가 없을때에만 적용한다.
	function setUpItem(x, y) {
		if (validSetUpNumber(x,y)) {
			var item = getItem(x,y);
			
			if (item == -2) {
				setItem(x,y,1);
			}
			else {
				setItem(x,y,item+1);
			}
		}
	}
	
	// unsetNPZ()
	// 지뢰 배치 금지구역 해제
	function unsetNTZ(x, y) {
		var item = getItem(x,y);
		
		if ((item == -2 || !(item >= 1)) && item!=undefined) {
			setItem(x,y,0);
		}
	}
	
	
	/// valid 함수 모음
	
	// 지뢰 배치때 인덱스가 유효한지 확인 (밖으로 나가거나 지뢰가 있을때, 또는 NPZ 안에 있을 때 false를 반환)
	// 받은 인자의 인덱스에 해당하는 아이템이 -2 또는 -1, undefined라면 false를 반환한다.
	function validIndexForLandMines(x, y) {
		var item = getItem(x,y);
		return !(item == -1 || item == -2 || item == undefined);
	}
	
	// 인덱스의 값이 유효한지 확인 (밖으로 벗어나면 false를 반환)
	function isIndexOutOfMap(x, y) {
		var maxWidth = getWidth();
		var maxHeight = ((x%2==0) ? getMinHeight() : getMaxHeight());
		
		return (((x < 0) || (x >= maxWidth)) || ((y < 0) || (y >= maxHeight))) ? false : true;
	}
	
	// 지뢰 주변 증산을 하기 위해 검증하는 함수
	function validSetUpNumber(x, y) {
		var item = getItem(x,y);
		return !(item == -1 || item == undefined);
	}
	
	
	
	
	/// 맵과 관련된 함수들
	
	// 맵을 처음 새로 만드는 함수 (옵션이 이미 지정된 상태에서 호출하는 함수이며, 모든 셀의 값을 0으로 지정한다)
	function createMap() {
		var tmpMap = new Array(getWidth());
		
		for (var i = 0; i < tmpMap.length; i++) {
			tmpMap[i] = new Array(((i%2 == 0) ? mapMinHeight : mapMaxHeight));
			
			for (var j = 0; j < tmpMap[i].length; j++) {
				tmpMap[i][j] = 0;
			}
		}
		
		setMap(tmpMap);
		return true;
	}
	
	// 맵의 데이터를 비우거나 맵을 새로 만드는 함수 (맵 옵션을 유지한 상태에서 만든 맵의 데이터를 비워 새로 만듬)
	function clearMap() {
		var tmpMap = getMap();
		
		removeMap();
		
		for (var i = 0; i < tmpMap.length; i++) {
			for (var j = 0; j < tmpMap[i].length; j++) {
				tmpMap[i][j] = 0;
			}
		}
		
		setMap(tmpMap);
		return true;
	}
	
	// 맵을 삭제하는 함수 (옵션은 그대로이나 맵만 null이 됨)
	function removeMap() {
		map = null;
	}
	
	// 옵션을 삭제하는 함수 (맵은 현상유지)
	function removeOption() {
		removeWidth();
		removeHeight();
		removeNumber();
		remove();
	}
	
	// Width를 삭제
	function removeWidth() {
		mapWidth = 0;
	}
	
	// Height를 삭제
	function removeHeight() {
		mapMaxHeight = 0;
		mapMinHeight = 0;
	}
	
	// Number를 삭제
	function removeNumber() {
		mapMineNumber = 0;
	}
	
	// 맵과 옵션을 삭제하는 함수 (옵션과 맵은 모두 초기 상태가 됨)
	function remove() {
		removeOption();
		removeMap();
	}
	
	// 맵에서 지뢰를 최대(지뢰배치금지구역 제외)한 넣을 수 있는 수를 구한다. (19개는 지뢰 배치 금지구역의 칸 수)
	
	// 설정한 사이즈에서 들어갈 수 있는 지뢰의 최대 갯수를 구하여 반환
	function getMaxNumber(w, h) {
		return ((w * (h-1)) + (((w % 2 == 0) ? w : w - 1) / 2) - 19);
	}
	
};

var hexa = new Hexagonsweeper();

hexa.getMaxNumber(7,7);

hexa.start(7,7,9);

hexa.firstClick(3,3);

hexa.click(2,2);
hexa.click(5,5);
