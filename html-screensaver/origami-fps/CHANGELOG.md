# Origami FPS screensaver — changelog

A self-contained HTML/canvas screensaver: a first-person walk through an
origami toy battlefield, with a full day/night cycle every 60 seconds.
Open any version directly in a browser. Click for fullscreen, **H** toggles the HUD.
URL params for previewing: `?t=<seconds into the day>` and `?w=<clear|cloudy|rain|storm|snow|fog>`.

## v5: high-contrast day and night
- The light now comes from slightly behind you, so the faces you see are lit rather than silhouetted. The sun and moon are still drawn in front of you.
- Bright full moon with a blue halo and strong blue-white moonlight. Its light comes up just after sunset. The night sky is a richer blue, the stars are brighter and the clouds look moonlit.
- Brightness adjusts automatically to the available light, plus a contrast curve, so moonlit nights, storms and fog stay readable.
- Lighter weather: clouds, rain, storms and fog dim the scene much less.
- The muzzle, explosion and lightning flash is added after the brightness adjustment, so it stays dramatic, and slightly stronger at night.

## v4: origami menagerie
- New enemy types:
  - **Fox:** charges at you in a zig-zag and nips as it passes.
  - **Jumping frog:** hops towards you in big arcs.
  - **Crane bomber:** takes off, flies over you and drops paper water-bombs.
- New peaceful NPCs: **rabbits**, **butterflies**, **penguins** and **elephants**. They wander, step out of your path and flee from explosions.
- Every creature folds from a single connected paper net, using the v3 hinge system.
- Animated parts: wings flap, legs swing, frogs kick, penguins waddle and elephants flap their ears.
- Destroyed creatures burst into bright fluttering **confetti** that settles on the ground.
- The view tilts to aim at flying targets. Allies now shoot at every enemy type.

## v3: real folding
- New soldiers fold up from one connected paper net. Faces are hinged along shared creases and rotate into place, from the base strips through the torso, head and hat to the arms and rifle.
- Death still uses the v2 piece-by-piece unfold.

## v2: paper spawn and death
- Enemies arrive as sheets of paper that flutter down, land flat and fold into soldiers.
- On death they unfold back into a flat sheet, which then blows away in the wind.

## v1: Paper Front
- Low-poly origami battlefield seen first-person over a toy blaster with an orange tip.
- 60-second day: sunrise, sunset, and a night with stars and the moon. The sun direction drives the lighting.
- Weather changes about every 20 seconds and blends between clear, overcast, rain, thunderstorm, paper snow and fog. Snow and wet ground build up and fade.
- Automated combat:
  - You aim and fire in bursts and reload when empty.
  - Enemies shoot back and allies join in.
  - Tank shells and artillery hit the field.
  - A kill feed lists who folded whom.
- Paper-card HUD with clock, weather, compass, health, ammo and kill count.
