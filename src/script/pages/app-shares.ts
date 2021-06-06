import { LitElement, css, html } from 'lit';
import { customElement, property } from 'lit/decorators';
import { DriveMap } from '../interfaces/DriveMap';

@customElement('app-shares')
export class AppShares extends LitElement {
  static get styles() {
    return css`
    h1, h2, h3, h4 {
      font-weight: 100;
    }

    @media(prefers-color-scheme: light) {
      fast-card {
        --background-color: white;
      }
    }
    `;
  }
  @property()
  content: any;

  private renderedJson: DriveMap[] = [];

  async openFile() {
    let [fileHandle] = await window["showOpenFilePicker"]();
    const file = await fileHandle.getFile();
    const contents = await file.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(contents, "application/xml");
    const jsonData: any = this.xmlToJson(doc);
    this.content = jsonData["GPO"].User.ExtensionData.Extension["q1:DriveMapSettings"]["q1:Drive"];
    this.renderedJson = this.renderJson(this.content);
  }

  /**
   * This function converts the XML to JSON
   * @param xml
   * @returns
   */
  xmlToJson(xml: any) {
    var obj: any = {};
    if (xml.nodeType == 1) {
      if (xml.attributes.length > 0) {
        obj["@attributes"]= {};
        for (var j = 0; j < xml.attributes.length; j++) {
            var attribute = xml.attributes.item(j);
            obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
        }
      }
    } else if (xml.nodeType == 3) { // text
      obj = xml.nodeValue;
    }

    // do children
    if (xml.hasChildNodes()) {
      for(var i = 0; i < xml.childNodes.length; i++) {
        var item = xml.childNodes.item(i);
            var nodeName = item.nodeName;
            if (typeof(obj[nodeName]) == "undefined") {
                obj[nodeName] = this.xmlToJson(item);
            } else {
                if (typeof(obj[nodeName].push) == "undefined") {
                    var old = obj[nodeName];
                    obj[nodeName] = [];
                    obj[nodeName].push(old);
                }
                obj[nodeName].push(this.xmlToJson(item));
            }
        }
    }
    return obj;
  }

  /**
   * This function converts the JSON data into a better structured format
   * @param content The original converted XML content
   * @returns
   */
  renderJson(content: any) {
    const driveMapArray: DriveMap[] = [];
    if(this.content?.map) {
      let i = 1;
      content.map((item: any) => {
        let path: String = "";
        let driveLetter: String = "";
        let label: String = "" ;
        if(item["q1:Properties"]
        && item["q1:Properties"]["@attributes"]) {
          if(item["q1:Properties"]["@attributes"]["path"]) {
            path = item["q1:Properties"]["@attributes"]["path"];
          }
          if(item["q1:Properties"]["@attributes"]["letter"]) {
            driveLetter = item["q1:Properties"]["@attributes"]["letter"];
          }
          if(item["q1:Properties"]["@attributes"]["label"]) {
            label = item["q1:Properties"]["@attributes"]["label"];
          }
        } else {
          throw new Error("Invalid Data");
        }
        const driveMap: DriveMap = {
          Id: i,
          Path: path,
          DriveLetter: driveLetter,
          Label: label
        }

        if(item["q1:Filters"]
        && item["q1:Filters"]["q1:FilterGroup"]
        && item["q1:Filters"]["q1:FilterGroup"].map ) {
          item["q1:Filters"]["q1:FilterGroup"].map((group: any) => {
            if(group["@attributes"]?.name) {
              const splittedGroupName = group["@attributes"]?.name.split("\\");
              const groupName = splittedGroupName[splittedGroupName.length - 1];
              const cpDriveMap: DriveMap = {
                ...driveMap,
                GroupFilter: groupName
              }
              driveMapArray.push(cpDriveMap)
              i++;
            }
          })
        } else if(item["q1:Filters"]
        && item["q1:Filters"]["q1:FilterGroup"]
        && item["q1:Filters"]["q1:FilterGroup"]["@attributes"]) {
          if(item["q1:Filters"]["q1:FilterGroup"]["@attributes"].name) {
            const splittedGroupName = item["q1:Filters"]["q1:FilterGroup"]["@attributes"].name.split("\\");
            const groupName = splittedGroupName[splittedGroupName.length - 1];
            const cpDriveMap: DriveMap = {
              ...driveMap,
              GroupFilter: groupName
            }
            driveMapArray.push(cpDriveMap)
            i++
          }
        } else {
          driveMapArray.push(driveMap);
          i++;
        }
      })
    }
    return driveMapArray;
  }

  async getTemplate() {
    const template = await (await fetch("/assets/bin/DriveMappingTemplate.ps1")).text();
    return template;
  }

  async saveFile() {
    const psTemplate = await this.getTemplate();
    // replace the placeHolder
    let psResult = psTemplate.replace('!INTUNEDRIVEMAPPINGJSON!',JSON.stringify(this.renderedJson));
    // replace a user placeHolder ( if it exists )
    psResult = psResult.replace('%USERNAME%', '\' + $env:USERNAME + \'');
    const fileHandle = await window.showSaveFilePicker({
      suggestedName: 'DriveMapping.ps1',
      types: [{
        description: 'Powershell Script Output',
        accept: {
          'application/text': ['.ps1'],
        },
      }],
     });

    // Create a FileSystemWritableFileStream to write to.
    const writable = await fileHandle.createWritable();
    // Write the contents of the file to the stream.
    await writable.write(psResult);
    // Close the file and write the contents to disk.
    await writable.close();
  }


  constructor() {
    super();
  }

  render() {
    return html`
      <div>
        <h2>Convert Network shares</h2>
        <p>
          On this page you can upload an XML file exported from your Active Directory which includes your drive mappings.
          The converter will generate a Powershell script which can be Uploaded in Microsoft EndpointManager to automatically map your existing network shares.
        </p>
        <fast-card id="LoadFiles">
            ${'showOpenFilePicker' in window
              ? html`<fast-button appearance="primary" @click="${this.openFile}"
                  >Open XML file</fast-button
                >`
              : null}
          </fast-card>
          ${this.content?.map((item: any) => {
            return html`
            <fast-card>
              <ul>
                <li>Path: ${item["q1:Properties"]["@attributes"]["path"]}</li>
                <li>Drive letter: ${item["q1:Properties"]["@attributes"]["letter"]}</li>
                <li>Label: ${item["q1:Properties"]["@attributes"]["label"]}</li>
                <li>
                  Groups filter:
                  <ul>
                    ${item["q1:Filters"] && item["q1:Filters"]["q1:FilterGroup"] &&  item["q1:Filters"]["q1:FilterGroup"].map ?
                      item["q1:Filters"]["q1:FilterGroup"].map((group: any) => {
                        return html`<li>${group["@attributes"]?.name}</li>`
                    }): null}

                    ${item["q1:Filters"] && item["q1:Filters"]["q1:FilterGroup"] &&  item["q1:Filters"]["q1:FilterGroup"]["@attributes"] ?
                      html`<li>${item["q1:Filters"]["q1:FilterGroup"]["@attributes"]?.name}</li>`
                    : null}
                  </ul>
                </li>
              </ul>

            </fast-card>
            <fast-divider></fast-divider>
            `;
          })}
          ${this.content?.length > 0 ? html`
            ${'showSaveFilePicker' in window
              ? html`<fast-button appearance="primary" @click="${this.saveFile}"
                  >Save file</fast-button
                >`
              : null}`: null}
      </div>
    `;
  }
}
