import { SECRET_API_KEY } from "$env/static/private";

export async function load({ fetch, depends }) {
  depends("app:weather");
  const response = await fetch(
    `https://api.weatherapi.com/v1/current.json?key=${SECRET_API_KEY}&q=auto:ip&aqi=no`
  );

  return { body: await response.json() };
}
