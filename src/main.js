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

k.loadSprite("explosion", "sprites/sparkle.png");
k.add([k.pos(120, 80), k.sprite(FRUIT.BEAN)]);


k.onMouseDown(() => {
    if (firing) return;
    kaboom();
    firing = true;
});

k.onMouseRelease(() => {
    console.log("mouse release");
    firing = false;
});

// const fireBullet = (x, y, scale = 100) => {
//     k.shake(shake);
//     const bulletExplosion = k.add([k.pos(x, y), k.scale(scale), k.sprite("explosion"), k.animate()]);
//     k.play(GUN_SOUND.RIFLE_AK);
//     // bulletExplosion.animate("scale", [k.scale(0), k.scale(scale), k.scale(0)], { duration: 1 });
//     // console.log("🚀 ~ fireBullet ~ bulletExplosion.animation.paused:", bulletExplosion.animation.paused)
//     // bulletExplosion.onAnimEnd(() => {
//     //     bulletExplosion.destroy();
//     // });
//     // bulletExplosion.destroy();
// }

const kaboom = throttle(() => {
    if (!firing) return;
    const maxDeviation = 200 * (1 - Math.min(accuracy, 1));
    const randomX = k.rand(-maxDeviation, maxDeviation);
    const randomY = k.rand(-maxDeviation, maxDeviation);
    k.addKaboom(k.vec2(k.mousePos().x + randomX, k.mousePos().y + randomY), { comp: [] });
    k.shake(shake);
    k.play(GUN_SOUND.RIFLE_AK);
    // fireBullet(k.mousePos().x + randomX, k.mousePos().y + randomY, 1);
}, firingRate);

k.onUpdate(() => {
    kaboom();
});