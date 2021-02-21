import Engine from "./engine";

const canvas = document.querySelector("#canvas") as HTMLCanvasElement;
const engine = new Engine(canvas);

engine.init();

// ¯\_(ツ)_/¯ Because why wouldn't I do this like this
let renderer = () => {
    try {
        engine.render();
        requestAnimationFrame(renderer);
    } catch(e) {
        console.error(e);
        return;
    }
}

requestAnimationFrame(renderer);