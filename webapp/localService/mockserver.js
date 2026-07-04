sap.ui.define([
  "sap/ui/core/util/MockServer"
], function (MockServer) {
  "use strict";

  var SERVICE_URL = "/odata/v2/credit-operations/";
  var oMockServer;

  return {
    init: function () {
      if (oMockServer) {
        return;
      }

      var sLocalServicePath = sap.ui.require.toUrl("com/igor/creditops/localService");
      oMockServer = new MockServer({
        rootUri: SERVICE_URL
      });

      oMockServer.simulate(sLocalServicePath + "/metadata.xml", {
        sMockdataBaseUrl: sLocalServicePath + "/mockdata",
        bGenerateMissingMockData: false
      });

      oMockServer.start();
    }
  };
});
