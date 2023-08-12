import { renderPage } from "./shared/page";

function Home(props: { username: string }) {
  return renderPage(
    <div>
      <h1>Home</h1>
      <p>Welcome, {props.username}</p>
    </div>
  );
}

export { Home };
