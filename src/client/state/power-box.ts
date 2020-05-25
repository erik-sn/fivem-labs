import * as Cfx from 'fivem-js';
import { Machine, interpret } from 'xstate';

import { drawText, drawTextStatic, sleep } from '../utils';
import { spawnGuardsLevel3 } from '../functions';
import { doorService, DoorEvent } from './door';
import { Interactable } from '../interactable';

// constants
const MACHINE_ID = 'power_box';
const PROMPT = 'Press "E" to disable power';
export const POWER_BOX_POSITION = {
    x: 3523.28,
    y: 3704.34,
    z: 22.09,
};

export const powerboxInteractable = new Interactable(
    'power box',
    POWER_BOX_POSITION.x,
    POWER_BOX_POSITION.y,
    POWER_BOX_POSITION.z,
    PROMPT
);

export function cutPower(context, event) {
    powerboxInteractable.stop();
    // TODO: show visible animation that the power box is broken
    drawText(POWER_BOX_POSITION.x, POWER_BOX_POSITION.y, POWER_BOX_POSITION.z, "Power Cut", 50000);
    doorService.send(DoorEvent.UNLOCK);
    // TODO send alert to server
    // TODO unlock elevator
    spawnGuardsLevel3();
}

// type helpers
export enum PowerBoxEvent {
    CUT_POWER = 'CUT_POWER'  // intentionally cannot revert back to nominal
}

export enum PowerBoxState {
    NOMINAL = 'NOMINAL',
    POWER_CUT = 'POWER_CUT'
}

const powerBoxMachine = Machine(
    {
        id: MACHINE_ID,
        initial: PowerBoxState.NOMINAL,
        states: {
            [PowerBoxState.NOMINAL]: {
                on: {
                    [PowerBoxEvent.CUT_POWER]: PowerBoxState.POWER_CUT,
                },
            },
            [PowerBoxState.POWER_CUT]: {
                on: {},
                entry: 'cutPower'
                
            }
        },
    },
    {
        actions: { cutPower }
    }
);

export const powerBoxService = interpret(powerBoxMachine).onTransition((state, event) => {
    console.log(`Changing Power box state to: ${state.value}`);
}).start();


export function handlePowerBoxInteraction(): boolean {
    if (powerboxInteractable.isWithinRangeOfTarget() && !powerBoxService.state.matches(PowerBoxState.POWER_CUT)) {
        powerBoxService.send(PowerBoxEvent.CUT_POWER);
        return true;
    }
    return false;
}