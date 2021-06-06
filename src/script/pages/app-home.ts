import { LitElement, css, html } from 'lit';
import { customElement } from 'lit/decorators';

// For more info on the @pwabuilder/pwainstall component click here https://github.com/pwa-builder/pwa-install
import '@pwabuilder/pwainstall';

@customElement('app-home')
export class AppHome extends LitElement {
  // For more information on using properties and state in lit
  // check out this link https://lit.dev/docs/components/properties/

  static get styles() {
    return css`
      .cardContainer {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
      }

      fast-card {
        margin-bottom: 12px;
        padding: 18px;
        padding-top: 0px;
      }

      h1, h2, h3, h4 {
        font-weight: 100;
      }

      #welcomeBlock {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        text-align: center;
      }

      pwa-install {
        position: absolute;
        bottom: 16px;
        right: 16px;
      }

      button {
        cursor: pointer;
      }

      @media (min-width: 1200px) {
        fast-card {
          width: 40%;
        }
      }

      @media (screen-spanning: single-fold-vertical) {
        .cardContainer {
          flex-direction: row;
          align-items: flex-start;
          justify-content: space-between;
        }

        fast-card {
          margin-right: 64px;
        }
      }

      @media(prefers-color-scheme: light) {
        fast-card {
          --background-color: white;
        }
      }
    `;
  }

  constructor() {
    super();
  }

  async firstUpdated() {
    // this method is a lifecycle even in lit
    // for more info check out the lit docs https://lit.dev/docs/components/lifecycle/
  }

  render() {
    return html`
      <div>
        <div class="cardContainer">
          <fast-card>
            <img src="/assets/images/laptop-start.jpg" style="max-width: 100%;"/>
            <p>This App is a little Helper for Tasks rollout and administration of Microsofts EndpointManager.</p>
          </fast-card>
        </div>
        <div class="cardContainer">
          <h3>Available features</h3>

          <fast-card>
            <fast-anchor href="./shares" appearance="hypertext"><h4>GPO Network drive to Intune Converter</h4></fast-anchor>
            <img src="/assets/images/network.jpg" style="max-width: 100%;"/>
            <p>This tool converts an exported Group Policy XML from a OnPremises Active Directory into a Powershell script.
              The script detects network changes and tries to connect the network Shares based on the AzureAD / Active Directory Group of the User.
            </p>
            <p>
              Instructions on how you can export the XML from your Active Directory can be found on the website of the original version
              <fast-anchor href="https://tech.nicolonsky.ch/next-level-network-drive-mapping-with-intune/" appearance="hypertext">Nicola Suter</fast-anchor>
            </p>
            <p>
              <strong>The App processes all data on your device and no Data will be uploaded which is one of the most significant changes to the original version!</strong>
            </p>
            <p>The original version was provided as .NET application by Nicola Suter and the Powershellscript is completely his Code.
              You can find the original project <fast-anchor href="https://github.com/nicolonsky/IntuneDriveMapping" appearance="hypertext">Github</fast-anchor>.
            </p>
          </fast-card>
        </div>

        <pwa-install>Install EndpointManager tools</pwa-install>
      </div>
    `;
  }
}
