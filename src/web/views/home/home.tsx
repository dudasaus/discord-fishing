import { renderPage } from "../../shared/page";

function Home(props: { username: string }) {
  return renderPage(
    <div className={"home-view"}>
      <h2 className={"title"}>Discord Fishing</h2>
      <div className={"fishing-emoji"}>🎣</div>
      <div className={"actions"}>
        <a
          className={"install-button"}
          href="https://discord.com/api/oauth2/authorize?client_id=892529887271854130&permissions=2048&scope=bot%20applications.commands"
        >
          Install
        </a>
      </div>
    </div>
  );
}

export { Home };
