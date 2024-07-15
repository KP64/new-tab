<script lang="ts">
  import { onMount } from "svelte";

  import wind from "$lib/assets/weather/not-available.svg";
  import Github from "$lib/assets/social-media/github.svg";
  import Youtube from "$lib/assets/social-media/youtube.svg";
  import Twitch from "$lib/assets/social-media/twitch.svg";

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

<body class="bg-base text-text h-screen font-mono">
  <div class="items-top flex h-2/3 items-center justify-center">
    <img src={wind} alt="" class="size-52" />
    <p class="text-5xl">{datetime}</p>
  </div>

  <div class="flex w-full justify-around">
    <div class="text-text bg-surface0 rounded-xl text-center hover:bg-inherit">
      <a href="https://github.com/">
        <img src={Github} alt="Github Logo" class="size-40" />
      </a>
    </div>
    <div class="text-text bg-surface0 rounded-xl text-center hover:bg-inherit">
      <a href="https://www.youtube.com/">
        <img src={Youtube} alt="Youtube Logo" class="size-40" />
      </a>
    </div>
    <div class="text-text bg-surface0 rounded-xl text-center hover:bg-inherit">
      <a href="https://www.twitch.tv/">
        <img src={Twitch} alt="Twitch Logo" class="size-40" />
      </a>
    </div>
  </div>
</body>
