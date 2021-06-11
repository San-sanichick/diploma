/**
 * This is a map of colors. 
 * 
 * Fun fact: AutoCAD and the likes store colors of layers as indecies.
 * For example: red is index 1; white is index 7.
 * 
 * And in DXF, it is indeed stored as an index.
 * Now, when you create a layer in AutoCAD, and try to assign it a color,
 * it will show you a window with probably like ~255 indexed colors
 * 
 * BUT, you can also, somehow, you can actually have your own custom color, picked
 * on the color picker thingamajig. How in the living HELL do you store THAT in DXF,
 * I have NO CLUE.
 * 
 * TL;DR: 9 colors, that's it, have a nice day
 */

const colors = new Map<number, any>();

colors.set(1, "rgba(255, 0, 0, 1)");
colors.set(2, "rgba(255, 255, 0, 1)");
colors.set(3, "rgba(0, 255, 0, 1)");
colors.set(4, "rgba(0, 255, 255, 1)");
colors.set(5, "rgba(0, 0, 255, 1)");
colors.set(6, "rgba(255, 0, 255, 1)");
colors.set(7, "rgba(255, 255, 255, 1)");
colors.set(8, "rgba(128, 128, 128, 1)");
colors.set(9, "rgba(192, 192, 192, 1)");

export enum EngineColors {
    DARKPRIMARY = "#005A61",
    MIDDLEPRIMARY = "#43949A",
    PRMARYTRANSPARENT = "rgba(97, 192, 200, 0.5)",
    PRIMARY = "#61C0C8",
    LIGHTPRIMARY = "#75c6ce",
    DARKSECONDARY = "#003236",
    LIGHTSECONDARY = "#173f42"
}

export default colors;

