export function loadAssets() {
    return new Promise((resolve) => {

        const loader = PIXI.Loader.shared;

        loader
            .add("bg", "./res/sprites/bg/bg_gates_of_olympus.png")
            .add("downBar", "./res/sprites/down_bar.png")
            .add("logo", "./res/sprites/small_logo.png")
            .add("field", "./res/sprites/game_field.png")
            .add("spinBtn", "./res/sprites/spin_button.png")
            .add("smallBtn", "./res/sprites/small_button.png");

        for (let i = 0; i <= 8; i++) {
            loader.add(`symbol${i}`, `./res/sprites/symbols/${i}.png`);
        }

        loader.load(() => {
            console.log("All assets loaded");
            resolve();
        });
    });
}