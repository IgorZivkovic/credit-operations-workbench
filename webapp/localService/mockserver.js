sap.ui.define([
  "sap/ui/core/util/MockServer"
], function (MockServer) {
  "use strict";

  var SERVICE_URL = "/odata/v2/credit-operations/";

  return {
    init: function () {
      var sLocalServicePath = sap.ui.require.toUrl("com/igor/creditops/localService");
      var oMockServer = new MockServer({
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
