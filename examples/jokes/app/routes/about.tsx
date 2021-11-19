import type { HeadersFunction, LinksFunction, MetaFunction } from "remix";
import stylesUrl from "../styles/about.css";

export let meta: MetaFunction = () => {
  return {
    title: "Remix Jokes | About",
    description:
      "This page will tell you what this Remix Jokes app is all about.",
  };
};

export let headers: HeadersFunction = () => {
  return {
    "Cache-Control": `public, max-age=${60 * 10}, s-maxage=${
      60 * 60 * 24 * 30
    }`,
  };
};

export let links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: stylesUrl }];
};

export default function AboutRoute() {
  return (
    <div>
      <h2>About Us</h2>
      <p>
        This page will tell you all about the jokes app and the people who built
        it. Feel free to insert your name!
      </p>
      <p>Created by: Kody the Koala 🐨</p>
    </div>
  );
}