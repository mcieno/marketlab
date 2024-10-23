import { SentryPublicKey, SentryRelease, SentryEnvironment } from "./env.d.js";

// See https://observablehq.com/framework/config for documentation.
export default {
  title: "MarketLab",

  output: "dist",
  root: "src",

  pager: false,
  search: true,
  theme: ["parchment", "sun-faded"],
  toc: true,

  head: ({ title }) => `
    <link rel="icon" type="image/svg+xml" href="/assets/marketlab.svg" />
    <link rel="icon" type="image/png" href="/assets/marketlab.png">
    <link rel="apple-touch-icon" href="/assets/marketlab.png">

    <meta name="description" content="Boring tools for the data-savvy retail investor">
    <meta property="og:type" content="website">
    <meta name="twitter:card" content="summary_large_image">
    <meta property="og:image" content="https://repository-images.githubusercontent.com/872285137/5303ed90-c515-462a-9690-ecd7e1ab5509">
    <meta name="twitter:image" content="https://repository-images.githubusercontent.com/872285137/5303ed90-c515-462a-9690-ecd7e1ab5509">

    <script
      src="https://js-de.sentry-cdn.com/${SentryPublicKey}.min.js"
      crossorigin="anonymous"
    ></script>
    <script>
      Sentry.onLoad(function() {
        Sentry.init({
          release: ${JSON.stringify(SentryRelease)},
          environment: ${JSON.stringify(SentryEnvironment)},
          tracesSampleRate: 1.0,
          profilesSampleRate: 1.0,
        });
        Sentry.lazyLoadIntegration("browserProfilingIntegration").then(
          (integration) => {
            Sentry.addIntegration(integration());
          },
        );
        Sentry.lazyLoadIntegration("contextLinesIntegration").then(
          (integration) => {
            Sentry.addIntegration(integration());
          },
        );
        Sentry.lazyLoadIntegration("extraErrorDataIntegration").then(
          (integration) => {
            Sentry.addIntegration(integration());
          },
        );
        Sentry.lazyLoadIntegration("httpClientIntegration").then(
          (integration) => {
            Sentry.addIntegration(integration());
          },
        );
        Sentry.lazyLoadIntegration("feedbackIntegration").then(
          (integration) => {
            Sentry.addIntegration(integration({
              autoInject: ${JSON.stringify(!!title)},
              showName: false,
            }));
          },
        );
      });
    </script>
    <script type="text/javascript">
      var _iub = _iub || [];
      _iub.csConfiguration = {"siteId":2655786,"cookiePolicyId":91033107,"lang":"en","storage":{"useSiteId":true}, floatingPreferencesButtonDisplay: "anchored-top-right"};
    </script>
    <script type="text/javascript" rel="external noopener noreferrer" src="//cs.iubenda.com/autoblocking/2655786.js"></script>
    <script type="text/javascript" rel="external noopener noreferrer" src="//cdn.iubenda.com/cs/gpp/stub.js"></script>
    <script type="text/javascript" rel="external noopener noreferrer" src="//cdn.iubenda.com/cs/iubenda_cs.js" charset="UTF-8" async></script>
  `,

  footer: `
    <em>
      <strong>Disclaimer:</strong>
      All content on this application is information of a general nature and
      does not address the circumstances of any particular individual or entity.
      Any reliance you place on such information is strictly at your own risk.
      You should, before you make any decision regarding any information,
      strategies or products mentioned on this application, consult your own
      financial advisor to consider whether that is appropriate having regard to
      your own objectives, financial situation and needs.
    </em>

    <br>
    <br>

    <strong>
      <a
        href="https://github.com/mcieno/marketlab"
        rel="external noopener noreferrer"
        style="color: var(--theme-foreground);"
        target="_blank"
      >
        <svg
          class="social-icon"
          preserveAspectRatio="xMidYMid meet"
          role="img"
          style="
            fill: var(--theme-foreground);
            vertical-align: -0.15em;
            width: 1.2em;
          "
          viewBox="0 0 496 512"
          xmlns="http://www.w3.org/2000/svg"
        >
          <desc>GitHub.com logo</desc>
          <path
            d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3.3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5.3-6.2 2.3zm44.2-1.7c-2.9.7-4.9 2.6-4.6 4.9.3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3.7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3.3 2.9 2.3 3.9 1.6 1 3.6.7 4.3-.7.7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3.7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3.7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z"
          >
          </path>
        </svg>
        MarketLab
      </a>
    </strong>
    &mdash;
    <a href="https://www.iubenda.com/privacy-policy/91033107" rel="external noopener noreferrer" target="_blank">Privacy Policy</a>,
    <a href="#privacy-settings" onclick='event.preventDefault(); document.querySelector("button.iubenda-tp-btn.iubenda-cs-preferences-link").click();'>Privacy settings</a>
    <style>
      .katex-display {
        overflow-x: scroll;
      }
      button.iubenda-tp-btn.iubenda-cs-preferences-link {
        display: none !important;
      }
    </style>
  `,
};
