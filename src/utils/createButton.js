import { GameConfig } from "../gameconfig.js";

export function CreateButton(app, texture, label, anchoreX, anchoreY, x, y, width, height, onClick, cooldownTime = 50) {
    const container = new PIXI.Container();

    const btn = new PIXI.Sprite(texture);

    btn.anchor.set(anchoreX, anchoreY);
    btn.x = x;
    btn.y = y;
    btn.width = width * GameConfig.adaptiveScale;
    btn.height = height * GameConfig.adaptiveScale;

    btn.interactive = true;
    btn.buttonMode = true;

    const style = new PIXI.TextStyle({
        fontFamily: "Arial",
        fontSize: 36 * GameConfig.adaptiveScale,
        fill: "white",
        fontWeight: "bold",
        dropShadow: true,
        dropShadowColor: "#000000",
        dropShadowDistance: 4
    });

    const text = new PIXI.Text(label, style);
    text.anchor.set(0.5);
    if (anchoreX === 1) {
        text.x = btn.x - btn.width / 2;

    } else {
        text.x = btn.x;
    }
    text.y = btn.y;

    container.addChild(btn);
    container.addChild(text);

    let isCooldown = false;
    btn.on("pointerdown", () => {
        if (isCooldown) return;
        isCooldown = true;

        const originalTint = btn.tint;
        btn.tint = 0x999999;
        setTimeout(() => {
            btn.tint = originalTint;
            isCooldown = false;
        }, cooldownTime);

        onClick();
    });

    return container;
}