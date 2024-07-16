<script lang="ts">
  import { onMount } from "svelte";

  import type { PageData } from "./$types";
  export let data: PageData;

  import Github from "$lib/assets/social-media/github.svg";
  import Youtube from "$lib/assets/social-media/youtube.svg";
  import Twitch from "$lib/assets/social-media/twitch.svg";
  import { invalidate } from "$app/navigation";

  const weatherIcons: any = import.meta.glob(
    ["$lib/assets/weather/**.jpg", "$lib/assets/weather/**.png", "$lib/assets/weather/**.svg"],
    { eager: true, query: "?url", import: "default" }
  );

  let icon = "not-available";

  onMount(async () => {
    await getWeatherIcon();

    // ! Must be called in the onMount lifecycle.
    setInterval(
      async () => await Promise.all([invalidate("app:weather"), getWeatherIcon()]),
      60 * 1000 // 1 minute
    );
  });

  async function getWeatherIcon() {
    const current = data.body["current"];
    const isDay: number = current["is_day"];
    const weatherCode: number = current["condition"]["code"];

    const dayPostfix = isDay ? "day" : "night";

    const cloudPercentage: number = current["cloud"];
    const isCloudy = cloudPercentage > 80;

    switch (true) {
      case weatherCode === 1000:
        icon = `clear-${dayPostfix}`;
        break;

      case weatherCode === 1003:
        icon = `partly-cloudy-${dayPostfix}`;
        break;

      case weatherCode === 1006:
        icon = "cloudy";
        break;

      case weatherCode === 1009:
        icon = isCloudy ? "overcast" : `overcast-${dayPostfix}`;
        break;

      case weatherCode === 1030:
        icon = "mist";
        break;

      case weatherCode === 1063:
        icon = `partly-cloudy-${dayPostfix}-rain`;
        break;

      case weatherCode === 1066:
        icon = `partly-cloudy-${dayPostfix}-snow`;
        break;

      case [1069, 1072].includes(weatherCode):
        icon = `partly-cloudy-${dayPostfix}-sleet`;
        break;

      case weatherCode === 1087:
        icon = `thunderstorms-${dayPostfix}`;
        break;

      case weatherCode === 1114:
        icon = isCloudy ? "snow" : `partly-cloudy-${dayPostfix}-snow`;
        break;

      case weatherCode === 1117:
        icon = "snow";
        break;

      case [1135, 1147].includes(weatherCode):
        icon = isCloudy ? "fog" : `fog-${dayPostfix}`;
        break;

      case [1150, 1153].includes(weatherCode):
        icon = `partly-cloudy-${dayPostfix}-drizzle`;
        break;

      case [1168, 1171].includes(weatherCode):
        icon = "sleet";
        break;

      case weatherCode === 1180:
        icon = `partly-cloudy-${dayPostfix}-drizzle`;
        break;

      case weatherCode === 1183:
        icon = isCloudy ? "rain" : `partly-cloudy-${dayPostfix}-drizzle`;
        break;

      case [1186, 1192].includes(weatherCode):
        icon = isCloudy ? "rain" : `partly-cloudy-${dayPostfix}-rain`;
        break;

      case [1189, 1195].includes(weatherCode):
        icon = "rain";
        break;

      case [1198, 1201, 1204, 1207].includes(weatherCode):
        icon = isCloudy ? "sleet" : `partly-cloudy-${dayPostfix}-sleet`;
        break;

      case [1210, 1213, 1216, 1222, 1237].includes(weatherCode):
        icon = isCloudy ? "snow" : `partly-cloudy-${dayPostfix}-snow`;
        break;

      case [1219, 1225].includes(weatherCode):
        icon = "snow";
        break;

      case [1240, 1243, 1246].includes(weatherCode):
        icon = "rain";
        break;

      case [1249, 1252].includes(weatherCode):
        icon = "sleet";
        break;

      case [1255, 1256, 1261, 1264].includes(weatherCode):
        icon = "snow";
        break;

      case weatherCode === 1273:
        icon = `thunderstorms-${dayPostfix}-rain`;
        break;

      case weatherCode === 1276:
        icon = "thunderstorms-rain";
        break;

      case weatherCode === 1279:
        icon = `thunderstorms-${dayPostfix}-rain`;
        break;

      case weatherCode === 1282:
        icon = "thunderstorms-snow";
        break;

      default:
        icon = "not-available";
        break;
    }
  }

  let datetime = "";
  function getDateTime() {
    const currentDate = new Date();
    const hours = currentDate.getHours();
    const minutes = currentDate.getMinutes().toString().padStart(2, "0");
    datetime = `${hours}:${minutes}`;
  }
  onMount(getDateTime);
  setInterval(getDateTime, 1000);
</script>

<body class="h-screen select-none bg-base font-mono text-text">
  <div class="items-top flex h-2/3 items-center justify-center">
    <img
      src={weatherIcons[`/src/lib/assets/weather/${icon}.svg`]}
      draggable="false"
      alt="Weather Condition"
      class="size-52"
    />
    <p class="text-5xl">{datetime}</p>
  </div>

  <div class="flex w-full justify-around">
    <div class="rounded-xl bg-surface0 text-center text-text hover:bg-inherit">
      <a href="https://github.com/" draggable="false">
        <img src={Github} alt="Github Logo" draggable="false" class="size-40" />
      </a>
    </div>
    <div class="rounded-xl bg-surface0 text-center text-text hover:bg-inherit">
      <a href="https://www.youtube.com/" draggable="false">
        <img src={Youtube} alt="Youtube Logo" draggable="false" class="size-40" />
      </a>
    </div>
    <div class="rounded-xl bg-surface0 text-center text-text hover:bg-inherit">
      <a href="https://www.twitch.tv/" draggable="false">
        <img src={Twitch} alt="Twitch Logo" draggable="false" class="size-40" />
      </a>
    </div>
  </div>
</body>
