import { GameConfig } from "./gameconfig.js";

export function createBackground(app) {
    // main bg:
    const bg = new PIXI.Graphics();
    bg.clear();

    app.stage.addChild(bg);

    // semi-transparent bg:
    const overlayTexture = PIXI.Texture.from("./res/sprites/bg/bg_gates_of_olympus.png");
    const overlaySprite = new PIXI.Sprite(overlayTexture);
    overlaySprite.anchor.set(0.5);
    overlaySprite.alpha = 0.5;
    app.stage.addChild(overlaySprite);

    function resize() {
        bg.beginFill(0x1e1e1e);
        bg.drawRect(0, 0, app.screen.width, app.screen.height);
        bg.endFill();

        const screenW = app.screen.width;
        const screenH = app.screen.height;

        overlaySprite.x = screenW / 2;
        overlaySprite.y = screenH / 2;

        const scaleX = screenW / overlayTexture.width * 0.6;
        const scaleY = screenH / overlayTexture.height * 0.6;

        const scale = Math.max(scaleX, scaleY);

        overlaySprite.scale.set(scale);

        topBarSprite.width = app.screen.width;
        topBarSprite.height = 100 * GameConfig.adaptiveScale;

        logoSprite.width = 150 * GameConfig.adaptiveScale;
        logoSprite.height = 51 * GameConfig.adaptiveScale;
        logoSprite.x = app.screen.width - logoSprite.width - logoRightMargin;
        logoSprite.y = (topBarSprite.height - logoSprite.height) / 2;
    }

    // top bar:
    const barTexture = PIXI.Texture.from("./res/sprites/down_bar.png");
    const topBarSprite = new PIXI.Sprite(barTexture);
    topBarSprite.width = app.screen.width;
    topBarSprite.height = 100 * GameConfig.adaptiveScale;
    topBarSprite.y = 0;
    app.stage.addChild(topBarSprite);

    // logo:
    const logoTexture = PIXI.Texture.from("./res/sprites/small_logo.png");
    const logoSprite = new PIXI.Sprite(logoTexture);
    const logoRightMargin = 40;
    logoSprite.width = 150 * GameConfig.adaptiveScale;
    logoSprite.height = 51 * GameConfig.adaptiveScale;
    logoSprite.x = app.screen.width - logoSprite.width - logoRightMargin;
    logoSprite.y = (topBarSprite.height - logoSprite.height) / 2;
    app.stage.addChild(logoSprite);

    resize();

    app.renderer.on("resize", resize);
}