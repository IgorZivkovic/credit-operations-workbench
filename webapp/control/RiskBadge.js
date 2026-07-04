sap.ui.define([
  "sap/m/ObjectStatus"
], function (ObjectStatus) {
  "use strict";

  return ObjectStatus.extend("com.igor.creditops.control.RiskBadge", {
    metadata: {
      properties: {
        severity: {
          type: "string",
          defaultValue: "None"
        }
      }
    },

    renderer: ObjectStatus.getMetadata().getRenderer(),

    init: function () {
      if (ObjectStatus.prototype.init) {
        ObjectStatus.prototype.init.apply(this, arguments);
      }

      this.addStyleClass("creditOpsRiskBadge");
    },

    setSeverity: function (sSeverity) {
      this.setProperty("severity", sSeverity, true);
      this.setState(this._mapSeverityToState(sSeverity));
      this._applySeverityClass(sSeverity);
      return this;
    },

    _applySeverityClass: function (sSeverity) {
      var aClasses = [
        "creditOpsRiskBadgeLow",
        "creditOpsRiskBadgeMedium",
        "creditOpsRiskBadgeHigh",
        "creditOpsRiskBadgeNone"
      ];

      aClasses.forEach(function (sClassName) {
        this.removeStyleClass(sClassName);
      }, this);

      switch (sSeverity) {
        case "Low":
          this.addStyleClass("creditOpsRiskBadgeLow");
          break;
        case "Medium":
          this.addStyleClass("creditOpsRiskBadgeMedium");
          break;
        case "High":
          this.addStyleClass("creditOpsRiskBadgeHigh");
          break;
        default:
          this.addStyleClass("creditOpsRiskBadgeNone");
          break;
      }
    },

    _mapSeverityToState: function (sSeverity) {
      switch (sSeverity) {
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
  });
});
