import { throttle } from "lodash";
import k from "./kaplay.js";
import { FRUIT } from "./fruits.js";
import { GUN_SOUND, GUN_ACCURACY, GUN_FIRING_RATE, GUN_SHAKE } from "./guns.js";

let firing = false;
let firingRate = GUN_FIRING_RATE.RIFLE_M15;
let accuracy = GUN_ACCURACY.RIFLE_M15;
let shake = GUN_SHAKE.RIFLE_M15;

k.loadRoot("./"); // A good idea for Itch.io publishing later
k.loadSprite("crosshair", "sprites/crosshair.png");
k.setCursor("crosshair");

k.setGravity(1000);

k.loadSprite("explosion", "sprites/sparkle.png");

k.add([k.rect(k.width(), k.height()), k.pos(0, 0), k.color(175, 175, 170)]);
const scoreText = k.add([k.text("Score: 0", { size: 48 }), k.pos(50, 50), { score: 0 }]);

k.onMouseDown(() => {
    if (firing) return;
    checkGunFire();
    firing = true;
});

k.onMouseRelease(() => {
    console.log("mouse release");
    firing = false;
});

const fireBullet = (x, y, scale = 100) => {
    k.shake(shake);
    const bulletExplosion = k.add([
        k.pos(x, y),
        k.scale(scale),
        k.anchor("center"),
        k.sprite("explosion", { height: 100, width: 100 }),
        k.animate(),
        k.area({ collisionIgnore: ["bullet-explosion"] }),
        "bullet-explosion"
    ]);

    bulletExplosion.animate(
        "scale",
        [k.vec2(scale), k.vec2(0)],
        {
            duration: 0.175,
            loops: 1
        },
    );

    bulletExplosion.onAnimateFinished(() => {
        bulletExplosion.destroy();
    });

    k.play(GUN_SOUND.RIFLE_AK);
}

const spawnFruitExplosion = (position, spriteName) => {
    const spriteAsset = k.getSprite(spriteName);
    const spriteData = spriteAsset?.data;

    if (!spriteData) {
        return;
    }

    const emitter = k.add([
        k.pos(position.x, position.y),
        k.anchor("center"),
        k.particles(
            {
                max: 50,
                lifeTime: [5, 5],
                speed: [250, 1000],
                angle: [0, 360],
                opacities: [1],
                scales: [1, 0.65, 0.3],
                texture: spriteData.tex,
                quads: spriteData.frames,
            },
            {
                direction: 0,
                spread: 1000,
                lifetime: 5,
            }
        ),

        k.body()
    ]);

    emitter.emit(40);
    emitter.onEnd(() => emitter.destroy());
};

const RANDOM_FRUIT = [
    FRUIT.BANANA,
    FRUIT.CHERRY,
    FRUIT.GRAPE,
    FRUIT.KIWI,
    FRUIT.LEMON,
    FRUIT.ORANGE,
    FRUIT.PEACH,
    FRUIT.PEAR,
    FRUIT.PINEAPPLE,
    FRUIT.STRAWBERRY,
    FRUIT.WATERMELON,
    FRUIT.BEAN
];

const fruitCleaner = k.add([k.rect(k.width(), 100), k.pos(0, k.height() + 500), k.area(), k.body({ isStatic: true }), "fruit-cleaner"]);

const throwFruit = () => {
    const fruitSprite = k.choose(RANDOM_FRUIT);
    const spawnX = k.rand(k.width() * 0.25, k.width() * 0.75);
    const spawnY = k.height() + 150;

    const fruit = k.add([
        k.sprite(fruitSprite, { height: 75, width: 75 }),
        k.pos(spawnX, spawnY),
        k.anchor("center"),
        k.area({
            collisionIgnore: ["thrown-fruit"]
        }),
        k.body(),
        "thrown-fruit"
    ]);

    fruit.onCollide("fruit-cleaner", () => {
        fruit.destroy();
        scoreText.score = Math.max(0, scoreText.score - 1);
        scoreText.text = `Score: ${scoreText.score}`;
    });

    fruit.onCollide("bullet-explosion", () => {
        const explosionPosition = fruit.pos.clone();

        fruit.destroy();
        scoreText.score++;
        scoreText.text = `Score: ${scoreText.score}`;
        k.shake(10);
        spawnFruitExplosion(explosionPosition, fruitSprite);
    });

    fruit.addForce(k.vec2(k.rand(-5000, 5000), k.rand(-50000, -70000)));
    setTimeout(() => {
        throwFruit();
    }, k.rand(250, 1000));
};

const checkGunFire = throttle(() => {
    if (!firing) return;
    const maxDeviation = 200 * (1 - Math.min(accuracy, 1));
    const randomX = k.rand(-maxDeviation, maxDeviation);
    const randomY = k.rand(-maxDeviation, maxDeviation);
    // k.addKaboom(k.vec2(k.mousePos().x + randomX, k.mousePos().y + randomY), { comp: [] });
    k.shake(shake);
    k.play(GUN_SOUND.RIFLE_AK);
    fireBullet(k.mousePos().x + randomX, k.mousePos().y + randomY, 1);
}, firingRate);

k.onUpdate(() => {
    checkGunFire();
});

throwFruit();