import * as Cfx from 'fivem-js';
import './lab';

const DEFAULT_CHARACTER_MODEL = 'a_m_m_skater_01';
const DEFAULT_WEAPON = 'weapon_assaultrifle_mk2';
const DEFAULT_POSITION = {x: 3540.94, y: 3674.99, z: 21.06};
const INITIAL_SPAWN_CONFIG = {
    ...DEFAULT_POSITION,
    model: DEFAULT_CHARACTER_MODEL
};
const DEFAULT_CAR_NAME = 'adder';

async function spawnVehicle(source, args) {
    const carName = args[0] || DEFAULT_CAR_NAME;

    const playerCoords = Cfx.Game.PlayerPed.Position;
    const vehicle = await Cfx.World.createVehicle(new Cfx.Model(carName), playerCoords, 4);

    Cfx.Game.PlayerPed.setIntoVehicle(vehicle, Cfx.VehicleSeat.Driver);
}

async function spawnWeapon(source, args) {
    const weaponName = args[1] || DEFAULT_WEAPON;
    
    GiveWeaponToPed(PlayerPedId(), GetHashKey(weaponName), 999, false, true);
}

async function teleport(source, args) {
    const x = Number.parseFloat(args[0]);
    const y = Number.parseFloat(args[1]);
    const z = Number.parseFloat(args[2]);
    console.log(x, y, z);

    exports.spawnmanager.spawnPlayer({ x, y, z, model: DEFAULT_CHARACTER_MODEL});
}

async function handleStart() {
    exports.spawnmanager.setAutoSpawnCallback(() => {
        exports.spawnmanager.spawnPlayer(INITIAL_SPAWN_CONFIG, () => {
          emit('chat:addMessage', {
            args: [
              'Hi, there!'
            ]
          })
        });
    });

    exports.spawnmanager.setAutoSpawn(true)
    exports.spawnmanager.forceRespawn()
}


RegisterCommand('teleport', teleport, false);
RegisterCommand('car', spawnVehicle, false);
RegisterCommand('weapon', spawnWeapon, false);
RegisterCommand('clearnui', () => SetNuiFocus(false, false), false);
on('onClientGameTypeStart', handleStart);

