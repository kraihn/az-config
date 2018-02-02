import { AzureConfigEnvironment } from "./azure-config-environment";

export class AzureConfig {
  activeEnvironment: string;
  webConfig: string;
  environments: { [index: string]: AzureConfigEnvironment };

  constructor(obj: any) {
    this.activeEnvironment = obj["activeEnvironment"];
    this.webConfig = obj["webConfig"];
    this.environments = obj["environments"];
  }

  getActiveEnvironment() {
    return Object.assign({}, this.environments[this.activeEnvironment]);
  }
}
