sap.ui.define([
  "sap/ui/core/UIComponent",
  "sap/ui/model/resource/ResourceModel"
], function (UIComponent, ResourceModel) {
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

      this.getRouter().initialize();
    }
  });
});
