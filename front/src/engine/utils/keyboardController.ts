export default class KeyboardController {
    private pressedButton: string | null = null;
    private releasedButton: string | null = null;
    private heldButton: string | null = null;

    private isPressed = false;
    private isHeld = false;
    private isReleased = false;
    private shift = false;
    private ctrl = false;
    private alt = false;

    constructor() {
        /*
            The keyboard listeners get added to the entire document, and not
            the canvas, because with canvas they don't bloody work,
            it's as simple as that

            To do key combinations it is required to call preventDefault(), to prevent
            browser hotkeys from triggering (why the FUCK does ctrl+G trigger A SEARCH BAR)
        */

        document.addEventListener("keydown", this.keyPressHandler);
        document.addEventListener("keyup", this.keyReleaseHandler)
    }

    public removeControler() {
        document.removeEventListener("keydown", this.keyPressHandler);
        document.removeEventListener("keyup", this.keyReleaseHandler);
    }

    private keyPressHandler = (e: KeyboardEvent) => {
        // F12 is here so that I don't go insane
        if (e.code === "F12" || e.code === "F5" || e.code === "F11") return true;
        // e.preventDefault();
        if (e.ctrlKey && (e.code === "KeyG" || e.code === "KeyF" || e.code === "KeyS" || e.code === "KeyO")) {
            e.preventDefault();
        }

        // uhh, this is stupid
        if (e.code === "ControlLeft" || 
            e.code === "AltLeft" ||
            e.code === "ShiftLeft" ||
            e.code === "ControlRight" ||
            e.code === "AltRight" ||
            e.code === "ShiftRight") return false;

        this.heldButton = e.code;
        this.pressedButton = e.code;
        this.isPressed = true;
        this.isHeld = true;
        this.shift = e.shiftKey;
        this.ctrl = e.ctrlKey;
        this.alt = e.altKey;

        this.releasedButton = null;
    }

    private keyReleaseHandler = (e: KeyboardEvent) => {
        // e.preventDefault();
        this.releasedButton = e.code;
        this.heldButton = null;
        this.isHeld = false;
        this.isReleased = true;
        this.shift = false;
        this.ctrl = false;
        this.alt = false;
    }

    public get getPressedButton() {
        return this.pressedButton;
    }

    public get getHeldButton() {
        return this.heldButton;
    }

    public get getReleasedButton() {
        return this.releasedButton;
    }

    public get isKeyPressed() {
        return this.isPressed;
    }

    public get isKeyHeld() {
        return this.isHeld;
    }

    public get isKeyReleased() {
        return this.isReleased;
    }

    public get isShiftHeld() {
        return this.shift;
    }

    public get isCtrlHeld() {
        return this.ctrl;
    }

    public get isAltHeld() {
        return this.alt;
    }

    public resetKeyboardController() {
        this.pressedButton = null;
        this.releasedButton = null;
    }
}