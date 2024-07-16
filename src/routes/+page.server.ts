import { SECRET_API_KEY, CITY } from "$env/static/private";

export async function load({ fetch, depends }) {
  depends("app:weather");
  const response = await fetch(
    `https://api.weatherapi.com/v1/current.json?key=${SECRET_API_KEY}&q=${CITY}&aqi=no`
  );

  return { body: await response.json() };
}
