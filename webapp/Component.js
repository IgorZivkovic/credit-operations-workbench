sap.ui.define([
  "sap/ui/core/UIComponent",
  "sap/ui/model/resource/ResourceModel",
  "./localService/mockserver"
], function (UIComponent, ResourceModel, mockserver) {
  "use strict";

  return UIComponent.extend("com.igor.creditops.Component", {
    metadata: {
      manifest: "json"
    },

    init: function () {
      // Start the local OData mock backend before manifest models request metadata.
      mockserver.init();

      UIComponent.prototype.init.apply(this, arguments);

      this.setModel(new ResourceModel({
        bundleName: "com.igor.creditops.i18n.i18n"
      }), "i18n");

      this.getRouter().initialize();
    }
  });
});
