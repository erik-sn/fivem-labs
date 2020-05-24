import * as Cfx from 'fivem-js';
import { Machine, interpret } from 'xstate';

import { drawText } from '../utils';


// constants
export const POOL_ROOM_DOOR_POSITION = {
    x: 3525.24,
    y: 3702.35,
    z: 21.5
};
const RADIUS = 1;
const POOL_ROOM_DOOR_NAME = 'v_ilev_bl_doorpool';
const MACHINE_ID = 'pool_door';

// actions
function getDoor() {
    return GetClosestObjectOfType(
        POOL_ROOM_DOOR_POSITION.x,
        POOL_ROOM_DOOR_POSITION.y,
        POOL_ROOM_DOOR_POSITION.z,
        RADIUS,
        POOL_ROOM_DOOR_NAME,
        false,
        false,
        false
    );
}

export function lockDoor(context, event) {
    const door = getDoor();
    if (DoesEntityExist(door)) {
        FreezeEntityPosition(door, true);
        drawText(POOL_ROOM_DOOR_POSITION.x, POOL_ROOM_DOOR_POSITION.y, POOL_ROOM_DOOR_POSITION.z, "Locked");
    }
}

export function unlockDoor(context, event) {
    const door = getDoor();
    if (DoesEntityExist(door)) {
        FreezeEntityPosition(door, false);
        drawText(POOL_ROOM_DOOR_POSITION.x, POOL_ROOM_DOOR_POSITION.y, POOL_ROOM_DOOR_POSITION.z, "Unlocked");
    }
}

// type helpers
export enum DoorEvent {
    LOCK = 'LOCK',
    UNLOCK ='UNLOCK'
}

export enum DoorState {
    LOCKED = 'LOCKED',
    UNLOCKED = 'UNLOCKED'
}

const doorMachine = Machine(
    {
        id: MACHINE_ID,
        initial: DoorState.UNLOCKED,
        states: {
            [DoorState.UNLOCKED]: {
                on: {
                    [DoorEvent.LOCK]: DoorState.LOCKED,
                },
                entry: ['unlockDoor']
            },
            [DoorState.LOCKED]: {
                on: {
                    [DoorEvent.UNLOCK]: DoorState.UNLOCKED,
                },
                entry: 'lockDoor'
            }
        },
    },
    {
        actions: { unlockDoor, lockDoor }
    }
);

export const doorService = interpret(doorMachine).onTransition(state => {
    console.log(`Changing door state to: ${state.value}`);
}).start();
