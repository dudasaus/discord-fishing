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
          target="_blank"
        >
          Install
        </a>
        {props.username ? null : (
          <a
            className={"login-button"}
            href="https://discord.com/api/oauth2/authorize?client_id=1134821767085555782&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fauthorize&response_type=code&scope=identify"
          >
            Login
          </a>
        )}
      </div>
    </div>
  );
}

export { Home };
