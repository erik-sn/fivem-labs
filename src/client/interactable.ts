import { sleep, drawTextStatic, isWithinRange } from './utils';

const DEFAULT_INTERVAL = 500;

/**
 * An interactable is defined as a point in space that a player
 * can interact with. Note that this only handles detecting a player's
 * location vs. the point in space and showing/hiding the prompt to
 * the player - not actually handling what happens when the player
 * interacts (although that can be added by inheriting from this class)
 */
export class Interactable {
    name: string;
    x: number;
    y: number;
    z: number;
    prompt: string;
    interval: number;
    intervalTick?: number;
    promptTick?: number;
    active: boolean;

    constructor(name: string, x: number, y: number, z: number, prompt: string, interval = DEFAULT_INTERVAL) {
        this.name = name;
        this.x = x;
        this.y = y;
        this.z = z;
        this.prompt = prompt;
        this.interval = interval;
        this.intervalTick = null;
        this.promptTick = null;
        this.active = false;

        this.start = this.start.bind(this);
        this.stop = this.stop.bind(this);
        this.checkForPromptState = this.checkForPromptState.bind(this);
        this.displayText = this.displayText.bind(this);
        this.showPrompt = this.showPrompt.bind(this);
        this.hidePrompt = this.hidePrompt.bind(this);
    }

    start() {
        this.intervalTick = setTick(this.checkForPromptState);
    }

    stop() {
        clearTick(this.promptTick);
        clearTick(this.intervalTick);
    }

    async displayText() {
        await sleep(0.1); // TODO this seems buggy/inconsistent. Not sure how to do this normally
        drawTextStatic(this.x, this.y, this.z, this.prompt);
    }

    showPrompt() {
        if (!this.active) {
            this.promptTick = setTick(this.displayText);
            this.active = true;
        }
    }

    hidePrompt() {
        this.active = false;
        clearTick(this.promptTick);
        this.promptTick = null;
    }

    isWithinRangeOfTarget() {
        return isWithinRange({ x: this.x, y: this.y, z: this.z });
    }

    async checkForPromptState() {
        const inRange = this.isWithinRangeOfTarget();
        await sleep(this.interval);

        if (inRange && !this.active) { // we just walked in range of the target
            this.showPrompt();
        } else if (!inRange && this.active) {  // we just walked out of range of the target
            this.hidePrompt();
        }
    }
}