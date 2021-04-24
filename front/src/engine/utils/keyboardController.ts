export default class KeyboardController {
    private pressedButton: string | null = null;
    private releasedButton: string | null = null;
    private heldButton: string | null = null;

    private isPressed = false;
    private isHeld = false;
    private isReleased = false;

    constructor() {
        /*
            The keyboard listeners get added to the entire document, and not
            the canvas, because with canvas it doesn't bloody work,
            it's as simple as that
        */
        document.addEventListener("keydown", (e: KeyboardEvent) => {
            // console.log(e.code);
            this.heldButton = e.code;
            this.pressedButton = e.code;
            this.isPressed = true;
            this.isHeld = true;

            this.releasedButton = null;
        });

        document.addEventListener("keyup", (e: KeyboardEvent) => {
            this.releasedButton = e.code;
            this.heldButton = null;
            this.isHeld = false;
            this.isReleased = true;
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

    public resetKeyController() {
        this.pressedButton = null;
        this.releasedButton = null;
    }
}