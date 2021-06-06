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
        <svg width="48" height="48" viewBox="0 0 256 256" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3 179.194H57.2763V176.49H5.65103V128.382H48.9047V125.678H5.65103V80.843H57.2763V78.1387H3V179.194ZM79.3043 179.194H81.9553V84.9706L124.93 140.195L167.904 84.9706V179.194H170.556V77L124.93 135.783L79.3043 77V179.194ZM219.374 179.194H222.025V80.843H253V78.1387H188.399V80.843H219.374V179.194Z" fill="white"/>
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
