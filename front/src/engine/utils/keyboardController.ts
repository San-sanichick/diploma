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
            the canvas, because with canvas it doesn't bloody work,
            it's as simple as that
        */
        document.addEventListener("keydown", (e: KeyboardEvent) => {
            // e.preventDefault();
            // uhh, this is stupid
            if (e.code === "ControlLeft" || 
                e.code === "AltLeft" ||
                e.code === "ShiftLeft" ||
                e.code === "ControlRight" ||
                e.code === "AltRight" ||
                e.code === "ShiftRight") return;

            this.heldButton = e.code;
            this.pressedButton = e.code;
            this.isPressed = true;
            this.isHeld = true;
            this.shift = e.shiftKey;
            this.ctrl = e.ctrlKey;
            this.alt = e.altKey;

            // if (this.ctrl && this.pressedButton === "KeyG") return;

            this.releasedButton = null;
        });

        document.addEventListener("keyup", (e: KeyboardEvent) => {
            e.preventDefault();
            this.releasedButton = e.code;
            this.heldButton = null;
            this.isHeld = false;
            this.isReleased = true;
            this.shift = false;
            this.ctrl = false;
            this.alt = false;
        })
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

    public resetKeyController() {
        this.pressedButton = null;
        this.releasedButton = null;
    }
}