
// 이것은 프로젝트용이다.
// 웹 프로젝트용은 따로 개발할 것이며, 웹 서버가 필요로 하는 것을 사용해야 한다.
// 웹 프로젝트는 그냥 로그인하고 토너먼트 형태로 다른 사용자와 점수경쟁을 하는 게임으로 할 것이다.

var Model = function() {
	// 맵 데이터
	var map = null;
	// 맵 기본 설정
	var mapWidth = 0;	// 위아래로 돌출된 육각형이 모여 이루는 맵이므로 width는 그대로,
	var mapMaxHeight = 0;	// height는 최대 높이라 하며, 최소 높이는 height-1과 같다.
	var mapMinHeight = 0;
	var mapMineNumber = 0;
	
	// 생성자 호출 후 먼저 실행되는 함수
	this.start = function(width, height, number) {
		// 맵의 속성 기본 값부터 설정한다.
		mapWidth = width;
		mapMaxHeight = height;
		mapMinHeight = height - 1;
		mapMineNumber = number;
		
		// 맵을 생성한다.
		setMap();
	};
	
	// 해당 아이템 값을 좌표로 조회
	function getItem(x, y) {	// 아마 저거를 프라이빗으로 처리해야 하니 this를 function으로 바꿀 것이다.
		return (isIndexOutOfMap(x,y) ? map[x][y] : undefined);
		
	}
	
	// 좌표로 아이템 값 배치
	function setItem(x, y, val) {
		map[x][y] = val;
	}
	
	// 맵 조회
	function getMap() {
		return map;
	}
	
	// 맵을 세팅
	function setMap() {
		var tmpMap = new Array(mapWidth);
		
		for (var i = 0; i < tmpMap.length; i++) {
			tmpMap[i] = new Array(((i%2 == 0) ? mapMinHeight : mapMaxHeight));
			
			for (var j = 0; j < tmpMap[i].length; j++) tmpMap[i][j] = 0;
		}
		
		map = tmpMap;
	}
	
	// 처음으로 셀을 눌렀을 때 호출
	this.landStart = function(x, y) {
		// 아래는 터치를 시작했을 때 사용하는건데, 일단 임시로 여기에 적어둠.
		this.setNoPlacementZone(x,y);
		this.setLandMine();
		this.unsetNoPlacementZone(x,y);
	};
	
	// 처음 클릭한 곳의 주변을 지뢰 배치 금지 구역으로 설정 : 원점부터 주변 2칸까지
	this.setNoPlacementZone = function(x, y) {
		
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
				
				// 카운트를 증산한다.
				count++;
			}
		}
		console.log('Successful Set up Land Mines!');
	}
	
	// 지뢰 배치 금지 구역 해제
	this.unsetNoPlacementZone = function(x, y) {
		
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
	/*this.validIndexForLandMines = */
	function validIndexForLandMines(x, y) {
		var item = getItem(x, y);
		return !(item == -1 || item == -2 || item == undefined);
	}
	
	
	
	// 주변 값을 하나 더하기 위해 지뢰를 찾는 함수 (근방에 지뢰가 1개 있으면 1, 3개 있으면 3이 뜨도록 하는 것)
	
	// 이 함수는 지뢰부터 훝어본다. 지뢰를 찾으면 주변을 증산한다. 
	
	// 아니면 지뢰를 배치할 때마다 주변 값을 증산을 하는 것도 나쁘지 않다.
	// 지뢰 배치에는 지뢰가 있는 곳을 제외하기만 하면 되니깐.
	
	// 지뢰 탐색에서 지뢰 주변 값을 하나 증산하는 함수 (지뢰가 있으면 증산X)
	
	
	
	// 주변을 탐색 또는 배치를 관여하는 함수. 일단은 샘플 형태로 짜놓음. 함수형 프로그래밍을 참조하여 개조할 예정
	this.around = function(x, y) {
		/*
		(3,3) : (2,2), (2,3), (3,2), (3,4), (4,2), (4,3)
		(2,3) : (2,3), (2,4), (3,3), (3,4), (4,), (4,4)
		*/
		var a = ((x%2==0) ? 0 : -1);
		
		validIndexForLandMines(x, y-1);
		validIndexForLandMines(x, y+1);
		
		for (var i = -1; i <= 1; i+=2) {
			for (var j = a; j <= (a+1); j++) {
				validIndexForLandMines(x+i, y+j);
			}
		}
	}
	
	
	
	
	// 인덱스 값 유효 확인 (밖으로 벗어나면 false 반환)
	function isIndexOutOfMap(x, y) {
		var maxWidth = mapWidth;
		var maxHeight = ((x%2==0) ? mapMinHeight : mapMaxHeight);
		
		return (((x < 0) || (x >= maxWidth)) || ((y < 0) || (y >= maxHeight))) ? false : true;
	}
	
	
	
	// 주변 값 하나 더하기 위한 함수와 배치금지구역 설정/해제 함수 등에 사용할 때 중복되는 것이 있어서
	// 어느 지점에서부터 주변을 돌아보는 함수를 만들어 보면 좋을 것 같음.
	
	
	
	
	// 처음 클릭할 때 호출하는 함수
	this.firstClick = function(x,y) {
		
	}
	
	// 두번째 이상부터 클릭할 때 호출하는 함수
	this.click = function(x,y) {
		
	}
};

var sample = new Model();


