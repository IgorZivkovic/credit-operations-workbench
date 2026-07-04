sap.ui.define([
  "sap/ui/test/Opa5"
], function (Opa5) {
  "use strict";

  return Opa5.extend("com.igor.creditops.test.integration.arrangements.Startup", {
    iStartTheApp: function () {
      return this.iStartMyAppInAFrame("../../index.html");
    },

    iTeardownTheApp: function () {
      return this.iTeardownMyAppFrame();
    }
  });
});
