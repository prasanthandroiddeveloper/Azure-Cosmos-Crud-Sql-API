const config = {
  endpoint: "https://azurecosmoskapturas.documents.azure.com:443/",
  key: "",
  databaseId: "Tasks",
  partitionKey: { kind: "Hash" },
};

module.exports = config;
