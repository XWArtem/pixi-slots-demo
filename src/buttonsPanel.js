import { GameConfig } from "./gameconfig.js";
import { CreateButton } from "./utils/createButton.js";

export function createButtons(app, gameState, gamefield) {
    const rightMargin = 20;

    const uiContainer = new PIXI.Container();
    app.stage.addChild(uiContainer);

    const containerWidth = 220 * GameConfig.adaptiveScale;
    uiContainer.x = app.screen.width - containerWidth - rightMargin;
    uiContainer.y = 0;

    // spin
    let btnTexture = PIXI.Texture.from("./res/sprites/spin_button.png");
    let btnSpinRightMargin = 20;
    let anchoreX = 0.5;
    let anchoreY = 0.5;
    let x = containerWidth / 2;
    let y = 400 * GameConfig.adaptiveScale;
    let width = 204 * GameConfig.adaptiveScale;
    let height = 86 * GameConfig.adaptiveScale;
    const spinBtn = CreateButton(app, btnTexture, "SPIN", anchoreX, anchoreY, x, y, width, height, () => {
        if (!gameState.canSpin()) return;
        gamefield.spin(1500);
        console.log("Spin pressed!");
        gameState.applySpinLoss();
    }, 2_200);
    uiContainer.addChild(spinBtn);

    // increase bet
    btnTexture = PIXI.Texture.from("./res/sprites/small_button.png");
    anchoreX = 0.5;
    anchoreY = 0.5;
    width = 188 * GameConfig.adaptiveScale;
    height = 62 * GameConfig.adaptiveScale;
    x = containerWidth / 2;
    y = 100 * GameConfig.adaptiveScale + height;
    const plusBtn = CreateButton(app, btnTexture, "+", anchoreX, anchoreY, x, y, width, height, () => {
        gameState.increaseBet();
        console.log("Current Bet:", gameState.currentBet);
        updateBetText();
    });
    uiContainer.addChild(plusBtn);

    // bet text:
    const betLabelStyle = new PIXI.TextStyle({
        fontFamily: "Arial",
        fontSize: 14 * GameConfig.adaptiveScale,
        fill: "#c4c5c5",
        fontWeight: "bold"
    });

    const betLabelText = new PIXI.Text("total bet:", betLabelStyle);
    betLabelText.anchor.set(0.5);
    betLabelText.x = containerWidth / 2;
    betLabelText.y = 100 * GameConfig.adaptiveScale + height + 34 * GameConfig.adaptiveScale;

    uiContainer.addChild(betLabelText);
    //app.stage.addChild(betLabelText);

    const style = new PIXI.TextStyle({
        fontFamily: "Arial",
        fontSize: 30 * GameConfig.adaptiveScale,
        fill: "#d8fcf1",
        fontWeight: "bold",
        dropShadow: true,
        dropShadowColor: "#000000",
        dropShadowDistance: 1
    });

    const currentBetText = new PIXI.Text(gameState.currentBet, style);
    currentBetText.anchor.set(0.5);
    currentBetText.x = containerWidth / 2;
    currentBetText.y = 100 * GameConfig.adaptiveScale + height + 60 * GameConfig.adaptiveScale;

    //app.stage.addChild(text);
    uiContainer.addChild(currentBetText);

    // descrease bet
    btnTexture = PIXI.Texture.from("./res/sprites/small_button.png");
    anchoreX = 0.5;
    anchoreY = 0.5;
    width = 188 * GameConfig.adaptiveScale;
    height = 62 * GameConfig.adaptiveScale;
    x = containerWidth / 2;
    y = 156 * GameConfig.adaptiveScale + height + 50 * GameConfig.adaptiveScale;
    const minusBtn = CreateButton(app, btnTexture, "-", anchoreX, anchoreY, x, y, width, height, () => {
        gameState.decreaseBet();
        console.log("Current Bet:", gameState.currentBet);
        updateBetText();
    });

    uiContainer.addChild(minusBtn);

    function resize() {
        btnSpinRightMargin = 20 * GameConfig.adaptiveScale;
        uiContainer.x = app.screen.width - containerWidth - rightMargin;
        uiContainer.y = 0;
    }

    resize();
    app.renderer.on("resize", resize);

    function updateBetText() {
        currentBetText.text = gameState.currentBet;
    }
}