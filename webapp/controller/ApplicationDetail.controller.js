sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/ui/model/Filter",
  "sap/ui/model/FilterOperator",
  "sap/m/MessageBox",
  "../model/formatter"
], function (Controller, Filter, FilterOperator, MessageBox, formatter) {
  "use strict";

  return Controller.extend("com.igor.creditops.controller.ApplicationDetail", {
    formatter: formatter,

    onInit: function () {
      this.getOwnerComponent()
        .getRouter()
        .getRoute("applicationDetail")
        .attachPatternMatched(this._onRouteMatched, this);
    },

    onNavBack: function () {
      this.getOwnerComponent().getRouter().navTo("home");
    },

    _onRouteMatched: function (oEvent) {
      var sApplicationId = decodeURIComponent(oEvent.getParameter("arguments").applicationId);
      var oModel = this.getView().getModel();

      this._filterRelatedLists(sApplicationId);

      oModel.metadataLoaded().then(function () {
        this._bindApplication(sApplicationId);
      }.bind(this));
    },

    _bindApplication: function (sApplicationId) {
      var oModel = this.getView().getModel();
      var sPath = "/" + oModel.createKey("LoanApplications", {
        id: sApplicationId
      });

      this.getView().bindElement({
        path: sPath,
        events: {
          dataReceived: this._onApplicationDataReceived.bind(this)
        }
      });
    },

    _onApplicationDataReceived: function () {
      var oContext = this.getView().getBindingContext();
      var oModel = this.getView().getModel();

      if (!oContext) {
        MessageBox.error(this.getResourceBundle().getText("detailNotFound"));
        this.onNavBack();
        return;
      }

      this.byId("customerPanel").bindElement("/" + oModel.createKey("Customers", {
        id: oContext.getProperty("customerId")
      }));
    },

    _filterRelatedLists: function (sApplicationId) {
      var aFilters = [
        new Filter("applicationId", FilterOperator.EQ, sApplicationId)
      ];

      ["tasksTable", "documentsTable", "activityTable"].forEach(function (sTableId) {
        var oBinding = this.byId(sTableId).getBinding("items");

        if (oBinding) {
          oBinding.filter(aFilters);
        }
      }, this);
    },

    getResourceBundle: function () {
      return this.getOwnerComponent().getModel("i18n").getResourceBundle();
    }
  });
});
