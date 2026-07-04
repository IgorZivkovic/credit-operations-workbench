sap.ui.define([
  "sap/ui/core/format/NumberFormat"
], function (NumberFormat) {
  "use strict";

  var oAmountFormat = NumberFormat.getFloatInstance({
    groupingEnabled: true,
    minFractionDigits: 2,
    maxFractionDigits: 2
  });

  return {
    formatAmount: function (sAmount) {
      if (sAmount === null || sAmount === undefined || sAmount === "") {
        return "";
      }

      return oAmountFormat.format(Number(sAmount));
    },

    statusState: function (sStatus) {
      switch (sStatus) {
        case "Approved":
          return "Success";
        case "Pending Approval":
          return "Warning";
        case "Needs Documents":
        case "Rejected":
          return "Error";
        case "In Review":
          return "Information";
        default:
          return "None";
      }
    },

    riskState: function (sRiskLevel) {
      switch (sRiskLevel) {
        case "Low":
          return "Success";
        case "Medium":
          return "Warning";
        case "High":
          return "Error";
        default:
          return "None";
      }
    }
  };
});
