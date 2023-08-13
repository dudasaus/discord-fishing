function Page(props: { body: preact.JSX.Element }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="stylesheet" type="text/css" href="./static/index.css" />
        <link
          rel="icon"
          href="https://fonts.gstatic.com/s/e/notoemoji/latest/1f419/512.webp"
        />
        <title>Discord Fishing</title>
      </head>
      <body>{props.body}</body>
    </html>
  );
}

function renderPage(el: preact.JSX.Element) {
  return Page({ body: el });
}

export { Page, renderPage };
