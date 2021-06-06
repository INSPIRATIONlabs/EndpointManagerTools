import { LitElement, css, html } from 'lit';
import { property, customElement } from 'lit/decorators';

@customElement('app-header')
export class AppHeader extends LitElement {
  @property({ type: String }) title = 'EndpointManager Tools';

  static get styles() {
    return css`
      header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-left: 16px;
        padding-right: 16px;
        background: var(--app-color-primary);
        color: white;
        height: 4em;
      }

      header h1 {
        margin-top: 0;
        margin-bottom: 0;
        font-size: 20px;
        font-weight: 100;
      }

      nav {
        width: 9em;
        display: flex;
        justify-content: space-between;
      }

      nav fast-anchor {
        margin-left: 10px;
      }
    `;
  }

  constructor() {
    super();
  }

  render() {
    return html`
      <header>
      <div>
        <svg width="30" height="auto" viewBox="0 0 259 104" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0.272001 104H56.288V101.264H3.008V52.592H47.648V49.856H3.008V4.49599H56.288V1.75999H0.272001V104ZM79.022 104H81.758V8.67199L126.11 64.544L170.462 8.67199V104H173.198V0.607992L126.11 60.08L79.022 0.607992V104ZM223.581 104H226.317V4.49599H258.285V1.75999H191.613V4.49599H223.581V104Z" fill="white"/>
        </svg>
      </div>

        <h1>${this.title}</h1>

        <nav>
          <fast-anchor href="./" appearance="button">Home</fast-anchor>
          <fast-anchor href="./shares" appearance="button">Shares</fast-anchor>
        </nav>
      </header>
    `;
  }
}
