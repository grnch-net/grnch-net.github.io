let type = "WebGL"
if (!PIXI.utils.isWebGLSupported()) {
	type = "canvas"
}
PIXI.utils.sayHello(type)

let symbolsSRC = [
	"assets/magic_forest_bonfire.png",
	"assets/magic_forest_bow.png",
	"assets/magic_forest_leaf.png",
	"assets/magic_forest_rope.png",
	"assets/magic_forest_tent.png",
];
let fieldsPosition = [[214, 1366], [552, 1366], [889, 1366], [214, 1703], [552, 1703], [889, 1703]];

let char;
let rendererMask;
let app = new PIXI.Application({ width: 1097, height: 1920 });
document.body.appendChild(app.view);

PIXI.loader
.add('char', 'assets/char/red.json')
.add(symbolsSRC)
.add([
  	"assets/magic_forest_bg.jpg",
	"assets/magic_forest_winner_frame.png",
	"assets/magic_forest_frame_for_text.png",
	"assets/magic_forest_frame.png",
	"assets/magic_forest_win_up_to_100.png",
	"assets/magic_forest_scratch_frame.png",
	"assets/magic_forest_scratch_frame_big.png",
	"assets/magic_forest_frame2.png",
	"assets/magic_forest_button.png",
	"assets/magic_forest_question_icon.png",
	"assets/magic_forest_coin_icon_big.png",
	"assets/magic_forest_frame1.png",
])
.load(setup);

function setup(loader, res) {
	drawGame(loader, res);
	createChar(loader, res);
	drawStartScreen(loader, res);
}

function loadRes(link) {
	return PIXI.loader.resources[link].texture;
}

function drawGame(loader, res) {
	let bg = new PIXI.Sprite( loadRes("assets/magic_forest_bg.jpg") );
	bg.name = 'background';
	bg.x += -152;
	app.stage.addChild(bg);

	let titleTextSprite = new PIXI.Sprite( loadRes("assets/magic_forest_win_up_to_100.png") );
	titleTextSprite.name = 'titleTextSprite';
	titleTextSprite.position.set(159, 40);
	app.stage.addChild(titleTextSprite);

	let bonusBG = new PIXI.Sprite( loadRes("assets/magic_forest_winner_frame.png") );
	bonusBG.name = 'bonusBG';
	bonusBG.position.set(526, 140);
	app.stage.addChild(bonusBG);

	let descriptionBG = new PIXI.Sprite( loadRes("assets/magic_forest_frame_for_text.png") );
	descriptionBG.name = 'descriptionBG';
	descriptionBG.position.set(56, 1043);
	descriptionBG.scale.set(0.98, 1);
	app.stage.addChild(descriptionBG);

	let hideLayer = new PIXI.Sprite( loadRes('assets/magic_forest_scratch_frame_big.png') );
	hideLayer.name = 'bonusHideLayer';
	hideLayer.position.set(799, 553);
	hideLayer.anchor.set(0.5);
	app.stage.addChild(hideLayer);

	let hideLayerTexture = loadRes("assets/magic_forest_scratch_frame.png");
	fieldsPosition.forEach((pos, i) => {
		let hideLayer = new PIXI.Sprite( hideLayerTexture );
		hideLayer.name = 'hideLayer'+i;
		hideLayer.position.set(pos[0], pos[1]);
		hideLayer.anchor.set(0.5);
		app.stage.addChild(hideLayer);
	});

	gameGroup = new PIXI.Container();
	gameGroup.name = 'gameGroup';
	app.stage.addChild(gameGroup);
}

function createChar(loader, res) {
	char = new PIXI.spine.Spine(res.char.spineData);
	char.skeleton.setToSetupPose();
	char.update(0);
	char.autoUpdate = false;
	let charCage = new PIXI.Container();
	charCage.addChild(char);
	let localRect = char.getLocalBounds();
	char.position.set(-localRect.x, -localRect.y);
	app.stage.addChild(charCage);

	charCage.position.set(80, 280);
	char.state.setAnimation(0, 'red_idle_loop', true)

	requestAnimationFrame(skeletonAnimation);
}

let charLastFrame = 0;
function skeletonAnimation(newframe) {
	let frameTime = (newframe - charLastFrame)/1000;
	charLastFrame = newframe;
	char.update(frameTime);
	requestAnimationFrame(skeletonAnimation);
}

let isWin;
let winSymbol;
let winCoin;
let symbolList;
let gameGroup;
let openCount;
let currentAnimation = 'idle';
function startGame(loader, res) {
	symbolList = [];
	openCount = 0;
	winSymbol = -1;
	winCoin = 25;
	let random = Math.round(Math.random()*100);
	if (random < 2){
		winSymbol = 4;
		winCoin += 100;
	}else
	if (random < 6){
		winSymbol = 3;
		winCoin += 50;
	}else
	if (random < 12){
		winSymbol = 2;
		winCoin += 35;
	}else
	if (random < 20){
		winSymbol = 1;
		winCoin += 30;
	}else
	if (random < 30){
		winCoin += 25;
		winSymbol = 0;
	}

	let symbolCount = [];
	if (winSymbol > -1) {
		isWin = true;
		symbolList[0] = symbolList[1] = symbolList[2] = winSymbol;
		for(let i=3; i<6; i++) {
			let nextSymbol;
			do {
				nextSymbol = randomInt(0, 4);
			} while(nextSymbol == winSymbol)
			symbolList.push(nextSymbol);
		}

		symbolList.forEach((symbol, ind) => {
			let changeInd;
			do {
				changeInd = randomInt(0, 4);
			} while(changeInd == ind)
			symbolList[ind] = symbolList[changeInd];
			symbolList[changeInd] = symbol;
		});

	} else {
		isWin = false;
		winSymbol = randomInt(0, 4);
		let winCount = 0;
		for(let i=0; i<6; i++) {
			let symbol;
			do {
				symbol = randomInt(0, 4);
			} while(symbol == winSymbol && winCount == 2)
			if (symbol == winSymbol) ++winCount;
			symbolList.push(symbol);
		}
	}

	createRendererMask();
	drawDescription();
	drawSymbols();
	drawBonusSymbol();

	gameGroup.addChild(rendererMask);
}

function drawDescription() {
	let desxriptionGroup = new PIXI.Container();
	desxriptionGroup.name = 'desxriptionGroup';
	desxriptionGroup.position.set(88, 1071);
	gameGroup.addChild(desxriptionGroup);

	let msgDescriptionStyle = new PIXI.TextStyle({
		fontFamily: "DRAguSansBlack",
		fontSize: 52,
		fill: "#f45b4e",
		// stroke: '#ffffff',
		// strokeThickness: 10
	});
	let msgDescription1 = new PIXI.Text("MATCH THE WINNER", msgDescriptionStyle);
	msgDescription1.name = 'msgDescription1';
	msgDescription1.position.set(1, 0);
	desxriptionGroup.addChild(msgDescription1);
	let msgDescription2 = new PIXI.Text("AND WIN A PRIZE!", msgDescriptionStyle);
	msgDescription2.name = 'msgDescription2';
	msgDescription2.position.set(543, 0);
	desxriptionGroup.addChild(msgDescription2);

	let msgDescriptionImg = new PIXI.Sprite( loadRes(symbolsSRC[winSymbol]) );
	msgDescriptionImg.name = 'msgDescriptionImg';
	msgDescriptionImg.position.set(453, -10);
	msgDescriptionImg.scale.set(0.3);
	desxriptionGroup.addChild(msgDescriptionImg);
}

function randomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function drawSymbols() {
	let filedBGTexture = loadRes("assets/magic_forest_frame.png");
	symbolList.forEach((symbolID, i) => {
		let filedBG = new PIXI.Sprite( filedBGTexture );
		filedBG.name = 'filedBG'+i;
		filedBG.position.set(fieldsPosition[i][0], fieldsPosition[i][1]);
		filedBG.anchor.set(0.5);

		let symbol = new PIXI.Sprite( loadRes(symbolsSRC[symbolID]) );
		symbol.name = 'symbol'+i;
		symbol.position.set(fieldsPosition[i][0], fieldsPosition[i][1]);
		symbol.anchor.set(0.5);

		rendererMask.addChild(filedBG, symbol)

		let graphics = new PIXI.Graphics();
		graphics.alpha = 0;
		graphics.beginFill(0x000000);
		graphics.drawRect(fieldsPosition[i][0] - 140, fieldsPosition[i][1] - 140, 280, 280);
		gameGroup.addChild(graphics);

		let startPointX = fieldsPosition[i][0] - 140;
		let startPointY = fieldsPosition[i][1] - 140;

		let minPos, maxPos;
		graphics.interactive = true;

		let isWinSymbol = symbolID == winSymbol;

		let touchmove = (event) => {

			let pos = event.data.global;
			if (pos.x < startPointX || pos.x > startPointX+280
				|| pos.y < startPointY || pos.y > startPointY+280
			) {
				return;
			}

			if (!minPos) {
				minPos = { x: event.data.global.x, y: event.data.global.y };
				maxPos = { x: event.data.global.x, y: event.data.global.y };
			}
			if (pos.x < minPos.x) minPos.x = pos.x;
			if (pos.x > maxPos.x) maxPos.x = pos.x;
			if (pos.y < minPos.y) minPos.y = pos.y;
			if (pos.y > maxPos.y) maxPos.y = pos.y;
			let length = ((minPos.x - maxPos.x) ** 2 + (minPos.y - maxPos.y) ** 2)**0.5;
			if (length >= 280) {
				drag = false;

				gameGroup.addChild(filedBG, symbol)
				graphics.destroy();

				if (isWinSymbol)
					changeAnimation('red_happy_card');
				else
					changeAnimation('red_disappointed');

				if(++openCount == 7) finishGame();
			}

		}
	    graphics.on('touchmove', touchmove);
	    graphics.on('pointermove', touchmove);

		graphics.on('pointerover', ()=>{
			char.state.setAnimation(0, 'red_worry_st', false)
			char.state.addAnimation(0, 'red_worry_loop', true, 0);
		});
	    graphics.on('pointerout',  ()=>{
			char.state.setAnimation(0, 'red_worry_end', false)
			char.state.addAnimation(0, 'red_idle_loop', true, 0);
		});
	});
}

function drawBonusSymbol() {
	let bonusBG = new PIXI.Sprite( loadRes("assets/magic_forest_winner_frame.png") );
	bonusBG.name = 'bonusBG';
	bonusBG.position.set(526, 140);

	let symbol = new PIXI.Sprite( loadRes(symbolsSRC[winSymbol]) );
	symbol.name = 'bonusSymbol';
	symbol.position.set(800, 590);
	symbol.anchor.set(0.5);

	rendererMask.addChild(bonusBG, symbol)

	let graphics = new PIXI.Graphics();
	graphics.alpha = 0;
	graphics.beginFill(0x000000);
	graphics.drawRect(614, 367, 368, 368);
	gameGroup.addChild(graphics);

	let minPos, maxPos;
	graphics.interactive = true;

	let touchmove = (event) => {
		let pos = event.data.global;
		if (pos.x < 614 || pos.x > 614+368
			|| pos.y < 367 || pos.y > 367+368
		) {
			return;
		}

		if (!minPos) {
			minPos = { x: event.data.global.x, y: event.data.global.y };
			maxPos = { x: event.data.global.x, y: event.data.global.y };
		}
		if (pos.x < minPos.x) minPos.x = pos.x;
		if (pos.x > maxPos.x) maxPos.x = pos.x;
		if (pos.y < minPos.y) minPos.y = pos.y;
		if (pos.y > maxPos.y) maxPos.y = pos.y;
		let length = ((minPos.x - maxPos.x) ** 2 + (minPos.y - maxPos.y) ** 2)**0.5;
		if (length >= 440) {
			drag = false;
			gameGroup.addChild(bonusBG, symbol)
			graphics.destroy();
			changeAnimation('red_happy_bonus');

			if(++openCount == 7) finishGame();
		}
	};
	graphics.on('touchmove', touchmove);
	graphics.on('pointermove', touchmove);

	graphics.on('pointerover', ()=>{
		char.state.setAnimation(0, 'red_worry_st', false)
		char.state.addAnimation(0, 'red_worry_loop', true, 0);
	});
	graphics.on('pointerout',  ()=>{
		char.state.setAnimation(0, 'red_worry_end', false)
		char.state.addAnimation(0, 'red_idle_loop', true, 0);
	});
}

let dragging = false;
function createRendererMask() {
	let renderTexture = PIXI.RenderTexture.create(app.screen.width, app.screen.height);
	let renderTextureSprite = new PIXI.Sprite(renderTexture);
    gameGroup.addChild(renderTextureSprite);

	rendererMask = new PIXI.Sprite();
    rendererMask.mask = renderTextureSprite;

	gameGroup.interactive = true;
    gameGroup.on('touchstart', pointerDown);
    gameGroup.on('touchend', pointerUp);
    gameGroup.on('touchmove', (event)=>{
		pointerMove(event);
		if (currentAnimation == 'idle') {
			currentAnimation = 'worry';
			char.state.setAnimation(0, 'red_worry_st', false)
			char.state.addAnimation(0, 'red_worry_loop', true, 0);
		}
	});

    gameGroup.on('pointerover', pointerDown);
    gameGroup.on('pointerout', pointerUp);
    gameGroup.on('pointermove', pointerMove);


	let brush = new PIXI.Graphics();
	brush.beginFill(0xffffff);
	brush.drawCircle(0, 0, 50);
	brush.endFill();

    function pointerMove(event) {
        if (dragging) {
            brush.position.copy(event.data.global);
            app.renderer.render(brush, renderTexture, false, null, false);
        }
    }

    function pointerDown(event) {
        dragging = true;
        pointerMove(event);
    }

    function pointerUp(event) {
        dragging = false;
		if (currentAnimation == 'worry') {
			currentAnimation = 'idle';
			char.state.setAnimation(0, 'red_worry_end', false)
			char.state.addAnimation(0, 'red_idle_loop', true, 0);
		}
    }
}

function changeAnimation(key) {
	currentAnimation = key;
	char.state.setAnimation(0, key+'_st', false)
	char.state.addAnimation(0, key+'_loop', false, 0);
	char.state.addAnimation(0, key+'_end', false, 0);
	char.state.addAnimation(0, 'red_idle_loop', true, 0);
	setTimeout(()=>{
		currentAnimation = 'idle';
	}, 2000);
}

let startAnimation;
let darkness;
let startBarGroup, finishBarGroup;
let coinWinText;

function drawStartScreen() {
	darkness = new PIXI.Graphics();
	darkness.alpha = 0.5;
	darkness.beginFill(0x000000);
	darkness.drawRect(0, 0, app.screen.width, app.screen.height);
	darkness.interactive = true;
	app.stage.addChild(darkness);

	startBarGroup = new PIXI.Container();
	startBarGroup.name = 'startBarGroup';
	startBarGroup.position.set(0, 1525);
	app.stage.addChild(startBarGroup);

	let startBarBG = new PIXI.Sprite( loadRes('assets/magic_forest_frame2.png') );
	startBarBG.name = 'startBarBG';
	startBarBG.position.set(0, 0);
	startBarGroup.addChild(startBarBG);

	let startButton = new PIXI.Sprite( loadRes('assets/magic_forest_button.png') );
	startButton.name = 'startButton';
	startButton.position.set(27, 191);
	startButton.interactive = true;
	startBarGroup.addChild(startButton);

	startButton.on('touchend', pointerUp);
	startButton.on('mouseup', pointerUp);
	function pointerUp(event) {
		startButton.interactive = false;
		startAnimation = performance.now();
		requestAnimationFrame(startGameAnimation);
		while (gameGroup.children[0]) {
			gameGroup.children[0].destroy();
		}
		startGame();
    }

	let howToPlayTextStyle = new PIXI.TextStyle({
		fontFamily: "DRAguSansBlack",
		fontSize: 72,
		fill: "#ff8729"
	});
	let howToPlayText = new PIXI.Text("How To Play", howToPlayTextStyle);
	howToPlayText.name = 'howToPlayText';
	howToPlayText.position.set(440, 60);
	startBarGroup.addChild(howToPlayText);

	let startButtonTextStyle = new PIXI.TextStyle({
		fontFamily: "DRAguSansBlack",
		fontSize: 72,
		fill: "#ffffff"
	});
	let startButtonText = new PIXI.Text("Play for 60", startButtonTextStyle);
	startButtonText.name = 'startButtonText';
	startButtonText.position.set(371, 238);
	startBarGroup.addChild(startButtonText);

	let helpIcon = new PIXI.Sprite( loadRes('assets/magic_forest_question_icon.png') );
	helpIcon.name = 'helpIcon';
	helpIcon.position.set(330, 63);
	startBarGroup.addChild(helpIcon);

	let coinIcon = new PIXI.Sprite( loadRes('assets/magic_forest_coin_icon_big.png') );
	coinIcon.name = 'coinIcon';
	coinIcon.scale.set(0.6);
	coinIcon.position.set(726, 253);
	startBarGroup.addChild(coinIcon);


	finishBarGroup = new PIXI.Container();
	finishBarGroup.name = 'finishBarGroup';
	finishBarGroup.visible = false;
	finishBarGroup.position.set(47, 220);
	app.stage.addChild(finishBarGroup);

	let finishBarBG = new PIXI.Sprite( loadRes('assets/magic_forest_frame1.png') );
	finishBarBG.name = 'finishBarBG';
	finishBarBG.position.set(0, 0);
	finishBarGroup.addChild(finishBarBG);

	let youWonTextStyle = new PIXI.TextStyle({
		fontFamily: "DRAguSansBlack",
		fontSize: 116,
		fill: "#f45b4e"
	});
	let youWonText = new PIXI.Text("YOU WIN", youWonTextStyle);
	youWonText.name = 'youWonText';
	youWonText.position.set(300, 30);
	finishBarGroup.addChild(youWonText);

	let coinWinTextStyle = new PIXI.TextStyle({
		fontFamily: "DRAguSansBlack",
		fontSize: 126,
		fill: "#311d1f"
	});
	coinWinText = new PIXI.Text('25', coinWinTextStyle);
	coinWinText.name = 'coinWinText';
	coinWinText.position.set(550, 136);
	coinWinText.anchor.set(1, 0);
	finishBarGroup.addChild(coinWinText);

	let winCoinIcon = new PIXI.Sprite( loadRes('assets/magic_forest_coin_icon_big.png') );
	winCoinIcon.name = 'winCoinIcon';
	winCoinIcon.position.set(570, 160);
	finishBarGroup.addChild(winCoinIcon);
}

function startGameAnimation(newFrame) {
	let progress = (newFrame - startAnimation)/1000 * 2;

	if (progress >= 1) {
		progress = 1;
		darkness.interactive = false;
	} else {
		requestAnimationFrame(startGameAnimation);
	}

	darkness.alpha = (1-progress) * 0.5;
	finishBarGroup.y = 220 - 560*progress;
	startBarGroup.y = 1525 + 400*progress;

}

function finishGame() {
	startBarGroup.getChildByName('startButton').interactive = true;
	darkness.interactive = true;

	finishBarGroup.visible = true;
	coinWinText.text = ''+winCoin;

	startAnimation = performance.now();
	requestAnimationFrame(finishGameAnimation);
}

function finishGameAnimation(newFrame) {
	let progress = (newFrame - startAnimation)/1000 * 2;

	if (progress >= 1) {
		progress = 1;
	} else {
		requestAnimationFrame(finishGameAnimation);
	}

	finishBarGroup.y = 220 - 560*(1-progress);
	darkness.alpha = progress * 0.5;
	startBarGroup.y = 1525 + 400*(1-progress);
}
