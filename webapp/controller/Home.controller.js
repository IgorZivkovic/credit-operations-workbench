sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/ui/model/Filter",
  "sap/ui/model/FilterOperator",
  "sap/ui/model/json/JSONModel",
  "sap/ui/model/Sorter",
  "../model/formatter"
], function (Controller, Filter, FilterOperator, JSONModel, Sorter, formatter) {
  "use strict";

  var DEMO_REFERENCE_DATE = "2026-07-06T00:00:00Z";

  return Controller.extend("com.igor.creditops.controller.Home", {
    formatter: formatter,

    onInit: function () {
      this.getView().setModel(new JSONModel({
        pendingApprovals: 0,
        highRisk: 0,
        slaBreaches: 0,
        totalExposure: "0.00",
        currency: "EUR"
      }), "kpi");

      this.getOwnerComponent()
        .getRouter()
        .getRoute("home")
        .attachPatternMatched(this._onRouteMatched, this);
    },

    _onRouteMatched: function () {
      this.getOwnerComponent().getModel().metadataLoaded().then(this._loadKpis.bind(this));
    },

    onSearch: function () {
      this._applyTableState();
    },

    onFilterChange: function () {
      this._applyTableState();
    },

    onSortChange: function () {
      this._applyTableState();
    },

    onResetFilters: function () {
      this.byId("searchField").setValue("");
      this.byId("statusFilter").setSelectedKey("");
      this.byId("riskFilter").setSelectedKey("");
      this.byId("sortSelect").setSelectedKey("slaAsc");
      this._applyTableState();
    },

    onApplicationPress: function (oEvent) {
      var oItem = oEvent.getParameter("listItem");
      var sApplicationId = oItem.getBindingContext().getProperty("id");

      this.getOwnerComponent().getRouter().navTo("applicationDetail", {
        applicationId: encodeURIComponent(sApplicationId)
      });
    },

    _loadKpis: function () {
      this.getOwnerComponent().getModel().read("/LoanApplications", {
        success: function (oData) {
          this._updateKpis(oData.results || []);
        }.bind(this)
      });
    },

    _updateKpis: function (aApplications) {
      var iPendingApprovals = 0;
      var iHighRisk = 0;
      var iSlaBreaches = 0;
      var fTotalExposure = 0;

      aApplications.forEach(function (oApplication) {
        if (oApplication.status === "Pending Approval") {
          iPendingApprovals += 1;
        }

        if (oApplication.riskLevel === "High") {
          iHighRisk += 1;
        }

        // Keep the mock KPI stable for screenshots and demos built around the seeded July 2026 data.
        if (oApplication.status !== "Approved" && oApplication.slaDueAt < DEMO_REFERENCE_DATE) {
          iSlaBreaches += 1;
        }

        fTotalExposure += Number(oApplication.requestedAmountValue);
      });

      this.getView().getModel("kpi").setData({
        pendingApprovals: iPendingApprovals,
        highRisk: iHighRisk,
        slaBreaches: iSlaBreaches,
        totalExposure: formatter.formatAmount(fTotalExposure),
        currency: "EUR"
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
