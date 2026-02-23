import { GameConfig } from "./gameconfig.js";
import { GameState } from "./GameState.js";
import { createBackground } from "./background.js";
import { createGamefield } from "./gamefield.js";
import { createButtons } from "./buttonsPanel.js";
import { loadAssets } from "./assetLoader.js";

const Application = PIXI.Application;

const app = new Application({
    resizeTo: window,
    transparent: false,
    antialias: true,
});
app.renderer.backgroundColor = 0x23395D;
app.renderer.view.style.position = 'absolute';
document.body.appendChild(app.view);

const gameState = new GameState(1000);

function updateScale() {
    const scaleX = app.screen.width / GameConfig.baseWidth;
    const scaleY = app.screen.height / GameConfig.baseHeight;
    GameConfig.adaptiveScale = Math.min(scaleX, scaleY);
}

updateScale();
app.renderer.on("resize", updateScale);

async function init() {

    await loadAssets();

    createBackground(app);
    const field = createGamefield(app);
    createButtons(app, gameState, field);
}

init();