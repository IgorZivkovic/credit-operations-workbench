sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/ui/model/Filter",
  "sap/ui/model/FilterOperator",
  "sap/ui/model/Sorter",
  "../model/formatter"
], function (Controller, Filter, FilterOperator, Sorter, formatter) {
  "use strict";

  return Controller.extend("com.igor.creditops.controller.Home", {
    formatter: formatter,

    onSearch: function () {
      this._applyTableState();
    },

    onFilterChange: function () {
      this._applyTableState();
    },

    onSortChange: function () {
      this._applyTableState();
    },

    onApplicationPress: function (oEvent) {
      var oItem = oEvent.getParameter("listItem");
      var sApplicationId = oItem.getBindingContext().getProperty("id");

      this.getOwnerComponent().getRouter().navTo("applicationDetail", {
        applicationId: encodeURIComponent(sApplicationId)
      });
    },

    _applyTableState: function () {
      var oTable = this.byId("loanApplicationsTable");
      var oBinding = oTable.getBinding("items");
      var aFilters = this._getFilters();
      var oSorter = this._getSorter();

      oBinding.filter(aFilters);
      oBinding.sort(oSorter);
    },

    _getFilters: function () {
      var aFilters = [];
      var sQuery = this.byId("searchField").getValue().trim().toLowerCase();
      var sStatus = this.byId("statusFilter").getSelectedKey();
      var sRiskLevel = this.byId("riskFilter").getSelectedKey();

      if (sQuery) {
        aFilters.push(new Filter("searchText", FilterOperator.Contains, sQuery));
      }

      if (sStatus) {
        aFilters.push(new Filter("status", FilterOperator.EQ, sStatus));
      }

      if (sRiskLevel) {
        aFilters.push(new Filter("riskLevel", FilterOperator.EQ, sRiskLevel));
      }

      return aFilters;
    },

    _getSorter: function () {
      var sSortKey = this.byId("sortSelect").getSelectedKey();

      switch (sSortKey) {
        case "amountDesc":
          return new Sorter("requestedAmountValue", true);
        case "riskDesc":
          return new Sorter("riskScore", true);
        case "slaAsc":
        default:
          return new Sorter("slaDueAt", false);
      }
    }
  });
});
