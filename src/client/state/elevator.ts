import { Machine, interpret } from 'xstate';

import { Interactable } from '../interactable';


// constants
export const ELEVATOR_POSITION_3 = {
    x: 3541.91,
    y: 3673.86,
    z: 21.11
};

export const ELEVATOR_POSITION_1 = {
    x: 3541.91,
    y: 3673.86,
    z: 28.24
};
const FLOOR_MAP = {
    '-1': {x: 3540.95, y: 3676.75, z: 28.37},
    // '-2': {x: 3540.95, y: 22, z: 22},
    '-3': {x: 3540.95, y: 3676.75, z: 21.06},
}
const ELEVATOR_PROMPT = 'Press "E" to change floor';
const UI_MACHINE_ID = 'elevator:ui';
const FLOOR_MACHINE_ID = 'elevator:floor';


// actions
export function showUi(context, event) {
    SetNuiFocus(true, true);
    SendNuiMessage(JSON.stringify({
        type: 'elevator',
        value: true,
    }));
}

export function hideUi(context, event) {
    SetNuiFocus(false, false);
    SendNuiMessage(JSON.stringify({
        type: 'elevator',
        value: false,
    }));
}

export function changeFloor(context, event) {
    const coordinates = FLOOR_MAP[event.value];
    exports.spawnmanager.spawnPlayer(coordinates);
}

// type helpers
export enum ElevatorEvent {
    SHOW_UI = 'SHOW_UI',
    HIDE_UI = 'HIDE_UI',
    SET_FLOOR_3 = 'SET_FLOOR_3',
    SET_FLOOR_1 = 'SET_FLOOR_1',
}

export enum ElevatorState {
    UI_HIDDEN = 'UI_HIDDEN',
    UI_VISIBLE = 'UI_VISIBLE',
    FLOOR_3 = 'FLOOR_3',
    FLOOR_1 = 'FLOOR_1'
}

const elevatorUiMachine = Machine(
    {
        id: UI_MACHINE_ID,
        initial: ElevatorState.UI_HIDDEN,
        states: {
            [ElevatorState.UI_HIDDEN]: {
                on: {
                    [ElevatorEvent.SHOW_UI]: ElevatorState.UI_VISIBLE,
                },
            },
            [ElevatorState.UI_VISIBLE]: {
                on: {
                    [ElevatorEvent.HIDE_UI]: ElevatorState.UI_HIDDEN,
                },
                entry: 'showUi',
                exit: 'hideUi'
            }
        },
    },
    {
        actions: { showUi, hideUi }
    }
);

const elevatorFloorMachine = Machine(
    {
        id: FLOOR_MACHINE_ID,
        initial: ElevatorState.FLOOR_3,
        states: {
            [ElevatorState.FLOOR_3]: {
                on: {
                    [ElevatorEvent.SET_FLOOR_1]: ElevatorState.FLOOR_1,
                },
                entry: 'changeFloor'
            },
            [ElevatorState.FLOOR_1]: {
                on: {
                    [ElevatorEvent.SET_FLOOR_3]: ElevatorState.FLOOR_3,
                },
                entry: 'changeFloor'
            }
        },
    },
    {
        actions: { changeFloor }
    }
);

export const elevatorUiService = interpret(elevatorUiMachine).onTransition(state => {
    console.log(`Elevator UI: ${state.value}`);
}).start();

export const elevatorFloorService = interpret(elevatorFloorMachine).onTransition(state => {
    console.log(`Elevator Floor: ${state.value}`);
}).start();

export const elevator1Interactable = new Interactable(
    'elevator1',
    ELEVATOR_POSITION_1.x,
    ELEVATOR_POSITION_1.y,
    ELEVATOR_POSITION_1.z,
    ELEVATOR_PROMPT
);
export const elevator3Interactable = new Interactable(
    'elevator3',
    ELEVATOR_POSITION_3.x,
    ELEVATOR_POSITION_3.y,
    ELEVATOR_POSITION_3.z,
    ELEVATOR_PROMPT
);


export function handleElevatorInteraction(): boolean {
    if (elevator1Interactable.isWithinRangeOfTarget() || elevator3Interactable.isWithinRangeOfTarget()) {
        elevatorUiService.send(ElevatorEvent.SHOW_UI);
        return true;
    }
    return false;
}

RegisterNuiCallbackType("closeElevatorUi");
on('__cfx_nui:closeElevatorUi', (data, cb) => {
    elevatorUiService.send(ElevatorEvent.HIDE_UI);
    cb({status: 'ok'}); // have to do this to prevent request from hanging
});

RegisterNuiCallbackType("setElevatorFloor");
on('__cfx_nui:setElevatorFloor', (data, cb) => {
    elevatorUiService.send(ElevatorEvent.HIDE_UI);
    if (data.value === '-1') elevatorFloorService.send({ type: ElevatorEvent.SET_FLOOR_1, value: data.value});
    else if (data.value === '-3') elevatorFloorService.send({ type: ElevatorEvent.SET_FLOOR_3, value: data.value});

    cb({status: 'ok'}); // have to do this to prevent request from hanging
});