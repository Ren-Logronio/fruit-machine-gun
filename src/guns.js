import k from "./kaplay.js";

export const GUN = Object.freeze({
    "RIFLE_SNIPER": "sniper",
    "RIFLE_M15": "m15",
    "RIFLE_AK": "ak47",
    "SHOTGUN": "shotgun",
    "SMG_MP5": "mp5",
});

export const GUN_SOUND = Object.freeze({
    "RIFLE_AK": "gun",
});

export const GUN_FIRING_RATE = Object.freeze({
    /* smaller is faster, ms between shots */
    "RIFLE_AK": 135,
    "SMG_MP5": 85,
    "RIFLE_M15": 110,
    "SHOTGUN": 1000,
    "RIFLE_SNIPER": 750,
});

export const GUN_ACCURACY = Object.freeze({
    "RIFLE_AK": 0.50,
    "SMG_MP5": 0.33,
    "RIFLE_M15": 0.70,
    "SHOTGUN": 0.25,
    "RIFLE_SNIPER": 1,
});

export const GUN_SHAKE = Object.freeze({
    "RIFLE_AK": 0.7,
    "SMG_MP5": 0.4,
    "RIFLE_M15": 0.47,
    "SHOTGUN": 1,
    "RIFLE_SNIPER": 1,
});

k.loadSprite(GUN.RIFLE_AK, "sprites/guns/AK47.png");
k.loadSprite(GUN.SMG_MP5, "sprites/guns/MP5.png");
k.loadSprite(GUN.RIFLE_M15, "sprites/guns/M15.png");
k.loadSprite(GUN.SHOTGUN, "sprites/guns/SawedOffShotgun.png");
k.loadSprite(GUN.RIFLE_SNIPER, "sprites/guns/M24.png");

k.loadSound(GUN_SOUND.RIFLE_AK, "sounds/gunfire-md.mp3");