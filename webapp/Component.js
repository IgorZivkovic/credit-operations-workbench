sap.ui.define([
  "sap/ui/core/UIComponent",
  "sap/ui/model/json/JSONModel",
  "sap/ui/model/resource/ResourceModel"
], function (UIComponent, JSONModel, ResourceModel) {
  "use strict";

  return UIComponent.extend("com.igor.creditops.Component", {
    metadata: {
      manifest: "json"
    },

    init: function () {
      UIComponent.prototype.init.apply(this, arguments);

      this.setModel(new ResourceModel({
        bundleName: "com.igor.creditops.i18n.i18n"
      }), "i18n");

      // This JSON model simulates risk signals coming from a separate REST microservice.
      this.setModel(new JSONModel(sap.ui.require.toUrl("com/igor/creditops/localService/rest/riskSignals.json")), "riskSignals");

      this.getRouter().initialize();
    }
  });
});
