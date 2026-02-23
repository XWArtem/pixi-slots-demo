import { GameConfig } from "./gameconfig.js";

export function createGamefield(app) {
    const ROWS = 3;
    const COLS = 5;
    const SYMBOL_COUNT = 9;
    const SYMBOL_BASE_WIDTH = 200;
    const SYMBOL_BASE_HEIGHT = 168;

    const fieldContainer = new PIXI.Container();
    app.stage.addChild(fieldContainer);

    const fieldLinesTexture = PIXI.Texture.from("./res/sprites/game_field.png");
    const fieldLinesSprite = new PIXI.Sprite(fieldLinesTexture);
    fieldLinesSprite.anchor.set(0.5, 0.44);

    fieldContainer.addChild(fieldLinesSprite);

    const symbolsContainer = new PIXI.Container();
    fieldContainer.addChild(symbolsContainer);
    const blur = new PIXI.filters.BlurFilter();
    blur.blur = 0;

    symbolsContainer.filters = [blur];

    const matrix = [];

    const symbolTextures = [];
    for (let i = 0; i < SYMBOL_COUNT; i++) {
        symbolTextures.push(
            PIXI.Texture.from(`./res/sprites/symbols/${i}.png`)
        );
    }

    function createRandomMatrix() {
        for (let row = 0; row < ROWS; row++) {
            matrix[row] = [];

            for (let col = 0; col < COLS; col++) {

                const randomId = Math.floor(Math.random() * SYMBOL_COUNT);

                const sprite = new PIXI.Sprite(symbolTextures[randomId]);
                sprite.anchor.set(0.5);

                symbolsContainer.addChild(sprite);

                matrix[row][col] = {
                    id: randomId,
                    sprite: sprite
                };
            }
        }
    }

    const mask = new PIXI.Graphics();

    function layoutMatrix() {
        const fieldWidth = 1200 * GameConfig.adaptiveScale;
        const fieldHeight = 760 * GameConfig.adaptiveScale;

        const cellWidth = fieldWidth / COLS;
        const cellHeight = fieldHeight / ROWS;

        for (let row = 0; row < ROWS; row++) {
            for (let col = 0; col < COLS; col++) {

                const cell = matrix[row][col];
                const targetWidth = cellWidth * 0.7;
                const scale = targetWidth / SYMBOL_BASE_WIDTH;
                cell.sprite.scale.set(scale);

                let targetAspectRatio = SYMBOL_BASE_WIDTH / SYMBOL_BASE_HEIGHT;
                let aspectRatio = cell.sprite.texture.width / cell.sprite.texture.height;
                if (aspectRatio > targetAspectRatio) {
                    cell.sprite.width = cell.sprite.width * (targetAspectRatio / aspectRatio);
                }
                else if (aspectRatio < targetAspectRatio) {
                    cell.sprite.height = cell.sprite.height * (aspectRatio / targetAspectRatio);
                }

                cell.sprite.x = -fieldWidth / 2 + col * cellWidth + cellWidth / 2;
                cell.sprite.y = -fieldHeight / 2 + row * cellHeight + cellHeight / 1.5;

                cell.sprite.baseScale = cell.sprite.scale.x;
            }
        }

        mask.beginFill(0xffffff);
        mask.drawRect(
            -fieldWidth / 2,
            -fieldHeight / 2,
            fieldWidth,
            fieldHeight
        );
        mask.endFill();

        symbolsContainer.mask = mask;
        fieldContainer.addChild(mask);
    }

    function resize() {

        fieldLinesSprite.width = 1200 * GameConfig.adaptiveScale;
        fieldLinesSprite.height = 760 * GameConfig.adaptiveScale;

        fieldContainer.x = app.screen.width / 2;
        fieldContainer.y = app.screen.height / 2;

        layoutMatrix();
    }

    createRandomMatrix();
    resize();

    app.renderer.on("resize", resize);

    function spin(duration = 1000) {
        stopWinAnimation();
        const speed = 40 * GameConfig.adaptiveScale;
        const symbolHeight = 168 * GameConfig.adaptiveScale;

        blur.blur = 8;

        let elapsed = 0;

        function update(delta) {
            elapsed += app.ticker.deltaMS;

            symbolsContainer.y += speed;

            for (let row = 0; row < ROWS; row++) {
                for (let col = 0; col < COLS; col++) {

                    const cell = matrix[row][col];

                    if (cell.sprite.y + symbolsContainer.y > symbolHeight * ROWS) {
                        cell.sprite.y -= symbolHeight * ROWS;

                        const newId = Math.floor(Math.random() * 9);
                        cell.id = newId;
                        cell.sprite.texture = symbolTextures[newId];
                    }
                }
            }

            if (elapsed >= duration) {
                stop();
            }
        }

        function stop() {
            app.ticker.remove(update);

            blur.blur = 0;

            symbolsContainer.y = 0;
            layoutMatrix();
            const winners = checkLines();
            animateWin(winners);
        }

        app.ticker.add(update);
    }

    function checkLines() {
        console.log("Check lines");
        const winningSprites = [];
        for (let row = 0; row < ROWS; row++) {
            let matches = 1;
            const currentId = matrix[row][0].id;
            for (let col = 1; col < COLS; col++) {
                if (matrix[row][col].id !== currentId) break;
                else matches++;
            }

            if (matches >= 3) {

                console.log(`Row ${row} win x${matches}`);

                for (let col = 0; col < matches; col++) {
                    winningSprites.push(matrix[row][col].sprite);
                }
            }
        }
        return winningSprites;
    }

    let winTicker = null;
    function animateWin(sprites) {

        let time = 0;

        winTicker = (delta) => {

            time += delta * 0.1;

            const scale = 1 + Math.sin(time) * 0.08;

            sprites.forEach(sprite => {
                sprite.scale.set(sprite.baseScale * scale);
            });
        };

        app.ticker.add(winTicker);
    }

    function stopWinAnimation() {

        if (!winTicker) return;

        app.ticker.remove(winTicker);
        winTicker = null;

        for (let row = 0; row < ROWS; row++) {
            for (let col = 0; col < COLS; col++) {
                const sprite = matrix[row][col].sprite;
                if (sprite.baseScale) {
                    sprite.scale.set(sprite.baseScale);
                }
            }
        }
    }

    return {
        matrix,
        spin,
        reroll() {
            for (let row = 0; row < ROWS; row++) {
                for (let col = 0; col < COLS; col++) {

                    const randomId = Math.floor(Math.random() * SYMBOL_COUNT);

                    matrix[row][col].id = randomId;
                    matrix[row][col].sprite.texture =
                        symbolTextures[randomId];
                }
            }
        }
    };
}