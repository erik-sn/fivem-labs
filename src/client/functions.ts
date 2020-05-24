import { handlePowerBoxInteraction, POWER_BOX_POSITION } from './state/power-box';
import { handleElevatorInteraction } from './state/elevator';
import { isWithinRange, sleep } from './utils';

export async function spawnGuardsLevel3() {
    const guardModel = 's_m_y_swat_01';
    const guardWeapon = 'WEAPON_CARBINERIFLE';
    const guardGroup = 'COP';
    const guardCoords = [
      // group 1
      { x: 3539.47, y: 3671.25, z: 21.0},
      { x: 3538.47, y: 3671.25, z: 21.0},
      
      // group 2
      { x: 3528.25, y: 3673.15, z: 21.0},
      { x: 3525.48, y: 3673.46, z: 21.0},
  
      // group 3
      { x: 3521.88, y: 3682.54, z: 21.0},
      { x: 3523.72, y: 3682.42, z: 21.0},
    ];
  
    AddRelationshipGroup(guardGroup, GetHashKey(guardGroup));
  
    const guardHash = GetHashKey(guardModel);
    RequestModel(guardHash);
    while (!HasModelLoaded(guardHash)) await sleep(1);
  
    guardCoords.forEach(({ x, y, z}) => {
      const newPed = CreatePed(27, guardHash, x, y, z, 90, false, true);
      FreezeEntityPosition(newPed, false)
      SetPedCombatAttributes(newPed, 0, true); // take cover
      SetPedCombatAttributes(newPed, 5, true); // fight when not armed
      SetPedCombatAttributes(newPed, 46, true); // always attack
      SetPedCombatAttributes(newPed, 292, false); // able to move
      SetPedFleeAttributes(newPed, 0, false); // don't flee
      SetPedAccuracy(newPed, 80);
      SetPedDropsWeaponsWhenDead(newPed, false) 
  
      SetRelationshipBetweenGroups(5, GetHashKey(guardGroup), GetHashKey('PLAYER'));
  
      GiveWeaponToPed(newPed, GetHashKey(guardWeapon), 999, false, true); // add the weapon to the guard
      SetCurrentPedWeapon(newPed, GetHashKey(guardWeapon), true); // their weapon should be out
      SetPedArmour(newPed, 100); // max armor
      SetPedMaxHealth(newPed, 100); //max health
      SetPedCombatMovement(newPed, 3); // move offensively
      SetPedCombatRange(newPed, 2); // far combat range
      TaskCombatPed(newPed, GetPlayerPed(-1), 0, 16); // attack the player
      // I don't know what these trailing params do
      TaskGoToCoordAnyMeans(newPed, POWER_BOX_POSITION.x, POWER_BOX_POSITION.y, POWER_BOX_POSITION.z, 1.0, 0, false, 786603, 0xbf800000)
    });
  
    SetEntityAsNoLongerNeeded(guardHash)
}


/**
 * run through all of the interactions. Order matters - if an interaction
 * triggers it will return true and short circuit the rest of the interactions.
 */
export function handleInteractions() {
    if (handlePowerBoxInteraction()) return;
    if (handleElevatorInteraction()) return ;
}