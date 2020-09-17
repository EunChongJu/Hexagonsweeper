
var Hexagonsweeper = function() {
	//// 모델 영역에서의 코드
	// 맵 데이터
	var map = null;
	// 맵 기본 설정
	var mapWidth = 0;	// 위아래로 돌출된 육각형이 모여 이루는 맵이므로 width는 그대로,
	var mapMaxHeight = 0;	// height는 최대 높이라 하며, 최소 높이는 height-1과 같다.
	var mapMinHeight = 0;
	var mapMineNumber = 0;
	
	// 생성자 호출 후 먼저 실행되는 시작 함수
	this.start = function(width, height, number) {
		// start()의 설정에 오류가 있으면 생성을 거부한다.
		if (!this.check(width, height, number)) return 'ERROR';
		
		// 맵의 속성 기본 값부터 설정한다.
		mapWidth = parseInt(width);
		mapMaxHeight = parseInt(height);
		mapMinHeight = parseInt(height) - 1;
		mapMineNumber = parseInt(number);
		
		// 맵을 생성한다.
		setMap();
	};
	
	// 생성자의 모든 데이터를 삭제하는 종료 함수
	this.end = function() {
		map = null;
		mapMaxHeight = 0;
		mapMinHeight = 0;
		mapMineNumber = 0;
		mapWidth = 0;
	};
	
	// 생성자의 맵을 초기화하는 함수 (옵션은 그대로, 맵만 새롭게 구성됨)
	this.reset = function() {
		map = null;
		setMap();
	};
	
	// 맵 자체를 업데이트하는 함수
	this.update = function(data) {
		if ((mapWidth == data.length) && (mapMinHeight == data[0].length)) {
			map = data;
		}
		else {
			return;
		}
	};
	
	// 셀 아이템 자체만을 업데이트하는 함수
	this.updateCell = function(x, y, data) {
		map[x][y] = data;
	};
	
	//// 아마 저 아래의 함수들은 프라이빗으로 처리해야 하니 this를 function으로 바꿀 것이다.
	// 해당 아이템 값을 좌표로 조회
	function getItem(x, y) { return (isIndexOutOfMap(x,y) ? map[x][y] : undefined); }
	this.getItem = function(x, y) { return getItem(x,y); }
	
	// 좌표로 아이템 값 배치
	function setItem(x, y, val) { map[x][y] = val; }
	this.setItem = function(x, y, val) { setItem(x,y,val); }
	
	// 맵 조회
	function getMap() { return map; }
	this.getMap = function() { return getMap(); };
	
	// 맵을 세팅
	function setMap() {
		var tmpMap = new Array(mapWidth);
		
		for (var i = 0; i < tmpMap.length; i++) {
			tmpMap[i] = new Array(((i%2 == 0) ? mapMinHeight : mapMaxHeight));
			for (var j = 0; j < tmpMap[i].length; j++) tmpMap[i][j] = 0;
		}
		
		map = tmpMap;
	} 
	
	// 사이즈 조회
	this.getSize = function() {
		return {
			width: mapWidth,
			height: mapMaxHeight
		};
	};
	
	// 옵션 조회
	this.getOption = function() {
		var size = this.getSize();
		return {
			width: size.width,
			maxHeight: size.height,
			minHeight: size.height-1,
			number: mapMineNumber
		};
	};
	
	// 처음으로 셀을 눌렀을 때 호출하는 함수
	this.landStart = function(x, y) {
		this.setNoPlacementZone(x,y);	// 지뢰 배치금지구역을 지정한다.
		this.setLandMine();				// 지뢰를 무작위로 배치한다.
		this.unsetNoPlacementZone(x,y);	// 지뢰 배치 후, 배치금지구역을 해제한다.
		return true;	// 잘됬다는 의미 (필요없음)
	};
	
	// 처음 클릭한 곳의 주변을 지뢰 배치 금지 구역으로 설정 : 원점부터 주변 2칸까지
	this.setNoPlacementZone = function(x, y) {	// 내가 만든건데 뭘 의미하는건진 모르겠음
		var a = (x%2==0) ? -1 : -2;
		
		for (var i = -2; i <= 2; i++) {		// i : -2, -1, 0, +1, +2
			var b = Math.abs(i);
			
			if (b == 1) {
				for (var j = 0; j < 4; j++) setNoTouchZone(x+i, y+a+j);
			}
			else if (b == 2) {
				for (var k = -1; k <= 1; k++) setNoTouchZone(x+i, y+k);
			}
			setNoTouchZone(x, y+i);	// 터치하는 부분을 포함
		}
	}
	
	// 지뢰 배치 금지구역을 설정
	function setNoTouchZone(x, y) {
		if (validIndexForLandMines(x,y)) setItem(x, y, -2);	// 지뢰는 -1, 지뢰배치 금지는 -2
	}
	
	// 지뢰를 배치 (지뢰를 전부 배치할 때까지 반복 : 지뢰 배치 후 주변 값 증산)
	this.setLandMine = function() {
		var num = mapMineNumber;
		var count = 0;
		
		// 지뢰를 전부 배치할 때까지 반복
		while (count < num) {
			// 배치할 좌표를 랜덤으로 생성한다.
			var rand = randomSetMine();
			
			// 생성한 좌표에 이미 지뢰가 있거나 배치 금지구역인지 확인한다.
			if (validIndexForLandMines(rand.x, rand.y)) {
				// 지뢰나 노터치존이 아니므로 배치한다.
				setItem(rand.x, rand.y, -1);
				
				// 배치한 자리의 주변을 증산한다.
				setUpAround(rand.x, rand.y);
				
				// 카운트를 증산한다.
				count++;
			}
		}
	}
	
	// 지뢰가 있는 곳의 주변 값을 하나씩 올린다.
	// 여기서 배치금지구역에 숫자를 추가하는 것을 허용하도록 한다.
	// 그리고 배치금지가 해제될 때, 1 이상이면 0으로 바꿀 필요가 없도록 한다.
	function setUpAround(x, y) {
		var a = ((x%2==0) ? 0 : -1);
		
		setUpItem(x, y-1);
		setUpItem(x, y+1);
		
		for (var i = -1; i <= 1; i+=2) {
			for (var j = a; j <= (a+1); j++) {
				setUpItem(x+i, y+j);
			}
		}
	}
	
	// 지뢰가 있는 곳 주변을 하나씩 증산시키는데, 지뢰가 없을 때만 적용된다.
	function setUpItem(x, y) {
		if (validSetUpNumber(x,y)) {
			var item = getItem(x,y);
			if (item == -2) setItem(x,y,1);
			else setItem(x, y, item+1);
		}
	}
	
	// 지뢰 주변 증산을 위한 검증 함수
	function validSetUpNumber(x, y) {
		var item = getItem(x, y);
		return !(item == -1 || item == undefined);
	}
	
	// 지뢰 배치 금지 구역 해제
	this.unsetNoPlacementZone = function(x, y) {
		var a = (x%2==0) ? -1 : -2;
		
		for (var i = -2; i <= 2; i++) {		// i : -2, -1, 0, +1, +2
			var b = Math.abs(i);
			
			if (b == 1) {
				for (var j = 0; j < 4; j++) unsetNoTouchZone(x+i, y+a+j);
			}
			else if (b == 2) {
				for (var k = -1; k <= 1; k++) unsetNoTouchZone(x+i, y+k);
			}
			if (i!=0) unsetNoTouchZone(x, y+i);
		}
	}
	
	// 지뢰배치금지구역 해제 단계에서 지뢰가 있거나 금지구역이 아닌 경우, 주변 값이 설정된 경우 false를 반환
	function unsetNoTouchZone(x, y) {
		var item = getItem(x,y);
//		if (item == -2 || (!(item >= 1 || item == undefined))) setItem(x,y,0);
		
		if ((item == -2 || !(item >= 1)) && item!=undefined) setItem(x,y,0);
		
//		var isNoTouchZone = (item != -2);
//		var isNum = (item > 0);
//		var isNotUndefined = (item != undefined);
//		if (isNoTouchZone && isNum && isNotUndefined) {
//			setItem(x,y,0);
//		}
	}
	
	// 지뢰 배치에 있어서 인덱스를 랜덤으로 추천하는 함수
	/*this.randomSetMine = */
	function randomSetMine() {
		var width = mapWidth;
		var height = mapMaxHeight;
		
		// randX에 따라 randY의 가능 난수의 경우의 수가 달라지므로
		// randX부터 생성한 다음, 이 수에 따라 randY를 생성한다.
		var randX = Math.floor(Math.random() * width);
		var randY = Math.floor(Math.random() * ((randX%2==0) ? (height-1) : height));
		// x가 0, 2 같은 짝수일 때 -> 최소 높이값으로 설정
		
		return {
			x: randX,
			y: randY
		};
	}
	
	// 지뢰 배치에 있어서 유효한 인덱스인지 확인 (밖으로 벗어나거나 지뢰가 있거나 배치금지구역에 있으면 false를 반환)
	// -2 또는 -1, undefined라면 false를 반환.
	function validIndexForLandMines(x, y) {
		var item = getItem(x, y);
		return !(item == -1 || item == -2 || item == undefined);
	}
	
	
	// 인덱스 값 유효 확인 (밖으로 벗어나면 false 반환)
	function isIndexOutOfMap(x, y) {
		var maxWidth = mapWidth;
		var maxHeight = ((x%2==0) ? mapMinHeight : mapMaxHeight);
		
		return (((x < 0) || (x >= maxWidth)) || ((y < 0) || (y >= maxHeight))) ? false : true;
	}
	
	// 처음 클릭할 때 호출하는 함수
	this.firstClick = function(x,y) {
		return (isIndexOutOfMap(x,y) ? this.landStart(x,y) : false);
	};
	
	// 두번째 이상부터 클릭할 때, 해당 셀의 데이터를 반환하는 함수
	this.click = function(x,y) {
		var data = getItem(x, y);
		return data;
	};
	
	// 맵에 벗어나면 undefined, 벗어나지 않더라도 지뢰가 있으면 false, 없으면 true를 반환한다.
	this.isMine = function(x, y) {
		return ((isIndexOutOfMap(x,y)) ? ((getItem(x,y)==-1) ? false : true) : undefined);
	}
	
	
	
	
	/*
	this.gameStart = function() {
		
	}
	this.gameOver = function() {
		
	}
	*/
	
	// 지뢰 배치 갯수가 유효한지 확인하는 함수
	this.check = function(width, height, number) {	// height는 maxHeight임
		return getMaxNumber(width, height) >= number;	// 최대 갯수가 number보다 크지 않거나 같으면 true 반환
	};
	
	// 맵에서 지뢰를 최대(지뢰배치금지구역 제외)한 넣을 수 있는 수를 구한다. (19개는 지뢰배치금지구역의 칸 수)
	function getMaxNumber(w, h) {
		var maxSize = w*(h-1);
		maxSize += ((w%2==0)?w:w-1)/2;
		return maxSize-19;
	}
	
	// 주변을 탐색 또는 배치를 관여하는 함수. 일단은 샘플 형태로 짜놓음. 함수형 프로그래밍을 참조하여 개조할 예정
	// 해당 좌표의 주변을 함수로 받아서 탐색한다.
	this.around = function(x, y, func) {
		var a = ((x%2==0) ? 0 : -1);
		
		func(x, y-1);
		func(x, y+1);
		
		for (var i = -1; i <= 1; i+=2) {
			for (var j = a; j <= (a+1); j++) {
				func(x+i, y+j);
			}
		}
	}
};

