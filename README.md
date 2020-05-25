# Labs Scenario

## Background

This is a small client side only scenario to help learn some native functions, UI interactions and general world interactions. It's not a serious application or intended to be used on live servers just for my learnings.

## Install

This requires having node.js and a typescript compiler installed:

```
# clone into your resources directory
git clone git@github.com:erik-sn/fivem-labs.git
cd fivem-labs
npm run build
```

Add fivem-labs to your `server.cfg`.

## Scenario

The player should spawn in the labs pool, then follow the prompts. Rough outline:

1. Spawn
1. Disable the power by interacting the power box
1. Go through the door, engage and kill first set of guards
1. Engage second set of guards by the eleveator
1. Take elevator to the upper level

Possibly more to come?