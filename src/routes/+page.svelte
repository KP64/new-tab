<script lang="ts">
  import { onMount } from "svelte";

  import type { PageData } from "./$types";
  export let data: PageData;

  import { invalidate } from "$app/navigation";

  const icons: Record<string, string> = import.meta.glob(["$lib/assets/**/*.svg"], {
    eager: true,
    query: "?url",
    import: "default"
  });

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

    if (weatherCode === 1000) {
      icon = `clear-${dayPostfix}`;
    } else if (weatherCode === 1003) {
      icon = `partly-cloudy-${dayPostfix}`;
    } else if (weatherCode === 1006) {
      icon = "cloudy";
    } else if (weatherCode === 1009) {
      icon = isCloudy ? "overcast" : `overcast-${dayPostfix}`;
    } else if (weatherCode === 1030) {
      icon = "mist";
    } else if (weatherCode === 1063) {
      icon = `partly-cloudy-${dayPostfix}-rain`;
    } else if (weatherCode === 1066) {
      icon = `partly-cloudy-${dayPostfix}-snow`;
    } else if ([1069, 1072].includes(weatherCode)) {
      icon = `partly-cloudy-${dayPostfix}-sleet`;
    } else if (weatherCode === 1087) {
      icon = `thunderstorms-${dayPostfix}`;
    } else if ([1114, 1210, 1213, 1216, 1222, 1237].includes(weatherCode)) {
      icon = isCloudy ? "snow" : `partly-cloudy-${dayPostfix}-snow`;
    } else if ([1117, 1219, 1225, 1255, 1256, 1261, 1264].includes(weatherCode)) {
      icon = "snow";
    } else if ([1135, 1147].includes(weatherCode)) {
      icon = isCloudy ? "fog" : `fog-${dayPostfix}`;
    } else if ([1150, 1153, 1180].includes(weatherCode)) {
      icon = `partly-cloudy-${dayPostfix}-drizzle`;
    } else if ([1168, 1171, 1249, 1252].includes(weatherCode)) {
      icon = "sleet";
    } else if (weatherCode === 1183) {
      icon = isCloudy ? "rain" : `partly-cloudy-${dayPostfix}-drizzle`;
    } else if ([1186, 1192].includes(weatherCode)) {
      icon = isCloudy ? "rain" : `partly-cloudy-${dayPostfix}-rain`;
    } else if ([1189, 1195, 1240, 1243, 1246].includes(weatherCode)) {
      icon = "rain";
    } else if ([1198, 1201, 1204, 1207].includes(weatherCode)) {
      icon = isCloudy ? "sleet" : `partly-cloudy-${dayPostfix}-sleet`;
    } else if ([1273, 1279].includes(weatherCode)) {
      icon = `thunderstorms-${dayPostfix}-rain`;
    } else if (weatherCode === 1276) {
      icon = "thunderstorms-rain";
    } else if (weatherCode === 1282) {
      icon = "thunderstorms-snow";
    } else {
      icon = "not-available";
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

  import { pipe, string, nonEmpty, trim, url, safeParse } from "valibot";
  const UrlSchema = pipe(
    string(),
    nonEmpty("The Search should not be empty."),
    trim(),
    url("The String is not a valid URL.")
  );

  let txt = "";
  $: lwrTxt = txt.toLowerCase();

  import Youtube from "$lib/assets/social-media/youtube.svg";
  import GitHub from "$lib/assets/social-media/github.svg";
  import Twitch from "$lib/assets/social-media/twitch.svg";

  type Site = { name: string; url: string; icon: string };
  const sites: Site[] = [
    { name: "Youtube", url: "https://youtube.com", icon: Youtube },
    { name: "GitHub", url: "https://github.com", icon: GitHub },
    { name: "Twitch", url: "https://twitch.tv", icon: Twitch }
  ];

  $: filteredSites =
    lwrTxt === "" ? [] : sites.filter(({ name }) => name.toLowerCase().includes(lwrTxt));

  function handleKeyDown(e: KeyboardEvent) {
    console.debug(filteredSites);
    if (e.code !== "Enter") {
      return;
    }

    if (filteredSites.length !== 0) {
      window.location.href = filteredSites[0].url;
      return;
    }

    const parsed = safeParse(UrlSchema, txt);
    if (parsed.success) {
      window.location.href = parsed.output;
      return;
    }

    const encoded = encodeURI(
      `https://search.sapti.me/search?q=${txt}&category_general=&language=auto&time_range=&safesearch=2&theme=simple`
    );
    window.location.href = encoded;
  }
</script>

<body class="h-screen select-none bg-base font-mono text-text">
  <div class="items-top flex h-1/3 items-center justify-center">
    <img
      src={icons[`/src/lib/assets/weather/${icon}.svg`]}
      draggable="false"
      alt="Weather Condition"
      class="size-52"
    />
    <p class="text-5xl">{datetime}</p>
  </div>

  <div class="my-20 flex flex-col items-center *:h-10 *:w-1/2 *:border-lavender *:bg-surface0">
    <!-- svelte-ignore a11y-autofocus -->
    <input
      type="search"
      autofocus
      placeholder="'s' to search"
      bind:value={txt}
      on:keyup|trusted={handleKeyDown}
      class={`border outline-none ${filteredSites.length === 0 ? "rounded-md" : "rounded-t-md "}`}
    />

    {#each filteredSites as site, i}
      <button
        on:click={() => (txt = site.name)}
        class={`flex items-center gap-4 border ${
          i === filteredSites.length - 1 ? "rounded-b-md border-t-0" : "border-y-0"
        }`}
      >
        <img src={site.icon} alt="Site Icon" class="ml-4" />
        <span>{site.name}</span>
      </button>
    {/each}
  </div>
</body>
