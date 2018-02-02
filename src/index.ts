import { existsSync, readFileSync, writeFileSync } from "fs";
import { XmlDocument } from "xmldoc";
import { resolve } from "path";
import { execSync } from "child_process";
import { AzureConfig } from "./models/azure-config";

const AZURE_CONFIG_FILE = ".azureConfig.json";

export function init(): void {
  writeFileSync(AZURE_CONFIG_FILE, JSON.stringify(Object.assign({
    "activeEnvironment": "",
    "webConfig": "",
    "environments": {}
  }, existsSync(AZURE_CONFIG_FILE) ? JSON.parse(readFileSync(AZURE_CONFIG_FILE).toString()) : {})));
}

export function config(): void {
  const azureConfig: AzureConfig = new AzureConfig(require(resolve(AZURE_CONFIG_FILE)));
  const azureConnectionStrings: any = JSON.parse(execSync("az webapp config connection-string list --resource-group " + azureConfig.getActiveEnvironment().resourceGroup + " --name " + azureConfig.getActiveEnvironment().name).toString());

  const webConfigPath: string = resolve(azureConfig["webConfig"]);
  const webConfig: XmlDocument = new XmlDocument(
    readFileSync(
      webConfigPath
    ).toString());

  webConfig.childrenNamed("connectionStrings")[0].children
    .filter(item => item !== undefined && item.attr !== undefined)
    .forEach((connStr) => {
      const val = azureConnectionStrings.filter((item: any) => item.name === connStr.attr["name"])[0];
      if (val && val.value && val.value.value) {
        connStr.attr["connectionString"] = val.value.value;
      }
    });

  writeFileSync(webConfigPath, `<?xml version="1.0" encoding="utf-8"?>
<!--
  For more information on how to configure your ASP.NET application, please visit
  http://go.microsoft.com/fwlink/?LinkId=152368
  -->
` + webConfig.toString(
    {
      compressed: true,
      trimmed: false,
      preserveWhitespace: true
    }
  ));
}
