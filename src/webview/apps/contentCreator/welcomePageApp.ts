import { VscodeButton } from "@bendera/vscode-webview-elements";
import {
  allComponents,
  provideVSCodeDesignSystem,
} from "@vscode/webview-ui-toolkit";

provideVSCodeDesignSystem().register(allComponents);

const vscode = acquireVsCodeApi();
window.addEventListener("load", main);

let systemCheckDiv: HTMLElement | null;
let installStatusDiv: HTMLElement | null;

let ansibleVersionStatusText: HTMLElement;
let ansibleLocationStatusText: HTMLElement;
let pythonVersionStatusText: HTMLElement;
let pythonLocationStatusText: HTMLElement;
let ansibleCreatorVersionStatusText: HTMLElement;
let refreshButton: VscodeButton;

function main() {
  systemCheckDiv = document.getElementById("system-check");
  if (systemCheckDiv) systemCheckDiv.style.visibility = "hidden";

  installStatusDiv = document.getElementById("install-status");

  ansibleVersionStatusText = document.createElement("section");
  ansibleLocationStatusText = document.createElement("section");
  pythonVersionStatusText = document.createElement("section");
  pythonLocationStatusText = document.createElement("section");
  ansibleCreatorVersionStatusText = document.createElement("section");

  refreshButton = document.getElementById("refresh") as VscodeButton;
  refreshButton?.addEventListener("click", handleRefreshClick);

  updateAnsibleCreatorAvailabilityStatus();
}

function handleRefreshClick() {
  vscode.postMessage({
    message: "refresh-page",
  });
}

function updateAnsibleCreatorAvailabilityStatus() {
  vscode.postMessage({
    message: "set-system-status-view",
  });

  window.addEventListener("message", (event) => {
    const message = event.data; // The JSON data our extension sent

    switch (message.command) {
      case "systemDetails":
        const systemDetails = message.arguments;
        const ansibleVersion = systemDetails["ansible version"];
        const ansibleLocation = systemDetails["ansible location"];
        const pythonVersion = systemDetails["python version"];
        const pythonLocation = systemDetails["python location"];
        const ansibleCreatorVersion = systemDetails["ansible-creator version"];

        if (ansibleVersion) {
          ansibleVersionStatusText.innerHTML = `<p class='found'>ansible version: ${ansibleVersion}</p>`;
        } else {
          ansibleVersionStatusText.innerHTML = `<p class='not-found'>ansible version: Not found</p>`;
        }
        installStatusDiv?.appendChild(ansibleVersionStatusText);

        // ansible location text
        if (ansibleLocation) {
          ansibleLocationStatusText.innerHTML = `<p class='found'>ansible location: ${ansibleLocation}</p>`;
        } else {
          ansibleLocationStatusText.innerHTML = `<p class='not-found'>ansible location: Not found</p>`;
        }
        installStatusDiv?.appendChild(ansibleLocationStatusText);

        // python version text
        if (pythonVersion) {
          pythonVersionStatusText.innerHTML = `<p class='found'>python version: ${pythonVersion}</p>`;
        } else {
          pythonVersionStatusText.innerHTML = `<p class='not-found'>python version: Not found</p>`;
        }
        installStatusDiv?.appendChild(pythonVersionStatusText);

        // python location text
        if (pythonLocation) {
          pythonLocationStatusText.innerHTML = `<p class='found'>python location: ${pythonLocation}</p>`;
        } else {
          pythonLocationStatusText.innerHTML = `<p class='not-found'>python location: Not found</p>`;
        }
        installStatusDiv?.appendChild(pythonLocationStatusText);

        // ansible-creator version text
        if (ansibleCreatorVersion) {
          ansibleCreatorVersionStatusText.innerHTML = `<p class='found'>ansible-creator version: ${ansibleCreatorVersion}</p>`;
        } else {
          ansibleCreatorVersionStatusText.innerHTML = `
          <p class='not-found'>ansible-creator version: Not found</p>
          <p>Please <vscode-link href="command:ansible.content-creator.install">install ansible-creator</vscode-link> (via pip) before getting started.<br>
          Or change <vscode-link href="command:ansible.python-settings.open">ansible-python settings</vscode-link>.</p>
          `;
        }
        installStatusDiv?.appendChild(ansibleCreatorVersionStatusText);

      // <p>&#x2717; python version: ${pythonVersion}</p>
      // <p>&#x2717; python location: ${pythonLocation}</p>
      // <p>&#x2717; ansible-creator version: ${ansibleCreatorVersion}</p>

      // `;
    }
    if (systemCheckDiv) systemCheckDiv.style.visibility = "visible";
  });
}
