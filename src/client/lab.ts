import { doorService, DoorState, DoorEvent,  } from './state/door';
import { elevator1Interactable, elevator3Interactable  } from './state/elevator';
import { powerboxInteractable  } from './state/power-box';
import { sleep } from './utils';
import {  handleInteractions } from './functions';

export function handleLabStart() {
    console.log('Starting lab scenario');
    doorService.send(DoorEvent.LOCK);

    powerboxInteractable.start();
    // allow user to interact with the elvators on all floors
    elevator1Interactable.start();
    elevator3Interactable.start();
}


export async function toggleLock(source, args) {
    const isLocked = doorService.state.matches(DoorState.LOCKED);
    const eventName = isLocked ?  DoorEvent.UNLOCK : DoorEvent.LOCK;
    doorService.send(eventName);
}

// used for interactions, i.e. press "E" to do some action
const eKey = 46;
async function handleKeypress() {
    await sleep(5);
    if (IsControlJustReleased(0, eKey)) {
        handleInteractions()
    }
}


handleLabStart();

// lab
RegisterCommand('lock', toggleLock, false);
setTick(handleKeypress)