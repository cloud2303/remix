import {
  Form,
  useLoaderData,
  Link,
  Meta,
  Links,
  Scripts,
  LiveReload,
  useCatch,
} from "remix";
import type { ActionFunction, LinksFunction, LoaderFunction } from "remix";
import { Outlet } from "react-router-dom";
import type { User } from "@prisma/client";
import stylesUrl from "./styles/global.css";
import { getUser, logout } from "./utils/session.server";

export let links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: stylesUrl }];
};

type LoaderData = { user: User | null };

export let loader: LoaderFunction = async ({ request }) => {
  const user = await getUser(request);
  return { user };
};

export let action: ActionFunction = async ({ request }) => {
  return logout(request);
};

function Document({
  children,
  title,
}: {
  children: React.ReactNode;
  title?: string;
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        {title ? <title>{title}</title> : null}
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <Scripts />
        {process.env.NODE_ENV === "development" && <LiveReload />}
      </body>
    </html>
  );
}

function Footer() {
  return (
    <footer>
      <Link reloadDocument to="/jokes-rss">
        RSS
      </Link>
    </footer>
  );
}

export default function App() {
  let data = useLoaderData<LoaderData>();
  return (
    <Document>
      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/jokes">Jokes</Link>
          </li>
          <li>
            <Link to="/about">About</Link>
          </li>
          {!data.user ? (
            <li>
              <Link to="/login">Login</Link>
            </li>
          ) : null}
        </ul>
      </nav>
      {data.user ? (
        <>
          {`Hi ${data.user.username}`}
          <Form method="post">
            <button type="submit">Logout</button>
          </Form>
        </>
      ) : null}
      <h1>Remix Jokes</h1>
      <Outlet />
      <Footer />
    </Document>
  );
}

export function CatchBoundary() {
  let caught = useCatch();

  switch (caught.status) {
    case 401:
    case 404:
      return (
        <Document title={`${caught.status} ${caught.statusText}`}>
          <h1>
            {caught.status} {caught.statusText}
          </h1>
          <Footer />
        </Document>
      );

    default:
      throw new Error(
        `Unexpected caught response with status: ${caught.status}`
      );
  }
}

export function ErrorBoundary({ error }: { error: Error }) {
  console.error(error);

  return (
    <Document title="Uh-oh!">
      <h1>App Error</h1>
      <pre>{error.message}</pre>
      <p>
        Replace this UI with what you want users to see when your app throws
        uncaught errors.
      </p>
      <Footer />
    </Document>
  );
}