import { html, render } from "lit-html";
import { browserRouter, ProuterNavigationEvent } from "prouter";
import { authService } from "./app/core/authentication-service";
import { unAuthenticatedErrorMsg } from "./app/utils/unauthenticated-error";
import { createErrorURI } from "./app/utils/show-error";
import { setTitleAndMeta } from "./app/utils/set-document-meta";

const router = browserRouter();
const app = document.getElementById('app')!;

router
  .use("/", (_req, resp) => {
    setTitleAndMeta('Codamit', 'I share stuff about code, architecture and best practices');
    render(
      html`
        <ez-home></ez-home>
      `,
      app,
    );
    resp.end();
  })
  .use("/login", (_req, resp) => {
    setTitleAndMeta('Codamit - Connexion');
    render(
      html`
        <ez-login></ez-login>
      `,
      app,
    );
    resp.end();
  })
  .use("/article/:id", (req, resp) => {
    const id = req.params.id;
    const title = req.query.title = req.query.title;
    setTitleAndMeta(title);

    render(
      html`
        <ez-article-detail id="${id}"></ez-article-detail>
      `,
      app,
    );
    resp.end();
  })
  .use("/tag/:tag", (req, resp) => {
    const tag = req.params.tag;
    setTitleAndMeta(tag, "Tous les articles au sujet de " + tag);

    render(
      html`
        <ez-page>
          <style>
            .last {
              padding-top: 0 !important;
              padding-bottom: 0 !important;
            }
          </style>
          <ez-article-feed .tags=${[tag]}></ez-article-feed>
          <section class="section last">
            <a
              href="/"
              class="button is-block"
              @click="${
                (e: Event) => {
                  e.preventDefault();
                  router.push("/");
                }
              }"
            >
              Back to home
            </a>
          </section>
        </ez-page>
      `,
      app,
    );
    resp.end();
  })
  .use("/admin", (_req, resp) => {
    if (!authService.authenticated) {
      router.push(createErrorURI(unAuthenticatedErrorMsg));
    } else {
      setTitleAndMeta('Codamit - Admin');
      render(
        html`
          <ez-admin></ez-admin>
        `,
        app,
      );
    }
    resp.end();
  })
  .use("/admin/draft", (req, resp) => {
    if (!authService.authenticated) {
      router.push(createErrorURI(unAuthenticatedErrorMsg));
    } else {
      render(
        html`
          <ez-draft id="${req.query.id}"></ez-draft>
        `,
        app,
      );
    }
    resp.end();
  })
  .use("/error", (req, resp) => {
    const message = req.query.message;
    setTitleAndMeta('Codamit - Erreur');

    render(
      html`
        <ez-error message="${message}"></ez-error>
      `,
      app,
    );
    resp.end();
  })
  .use("*", (_req, resp) => {
    router.push(createErrorURI("Page not Found"));
    resp.end();
  });

router.listen();

router.on("navigation", (_e: ProuterNavigationEvent) => {
  window.scrollTo({ top: 0 });
});

export default router;
