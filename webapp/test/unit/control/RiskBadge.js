sap.ui.define([
  "com/igor/creditops/control/RiskBadge"
], function (RiskBadge) {
  "use strict";

  QUnit.module("control/RiskBadge", {
    afterEach: function () {
      if (this.oBadge) {
        this.oBadge.destroy();
        this.oBadge = null;
      }
    }
  });

  QUnit.test("setSeverity maps low risk to Success state and low badge class", function (assert) {
    this.oBadge = new RiskBadge();

    this.oBadge.setSeverity("Low");

    assert.strictEqual(this.oBadge.getState(), "Success");
    assert.ok(this.oBadge.hasStyleClass("creditOpsRiskBadgeLow"));
  });

  QUnit.test("setSeverity maps medium risk to Warning state and medium badge class", function (assert) {
    this.oBadge = new RiskBadge();

    this.oBadge.setSeverity("Medium");

    assert.strictEqual(this.oBadge.getState(), "Warning");
    assert.ok(this.oBadge.hasStyleClass("creditOpsRiskBadgeMedium"));
  });

  QUnit.test("setSeverity maps high risk to Error state and high badge class", function (assert) {
    this.oBadge = new RiskBadge();

    this.oBadge.setSeverity("High");

    assert.strictEqual(this.oBadge.getState(), "Error");
    assert.ok(this.oBadge.hasStyleClass("creditOpsRiskBadgeHigh"));
  });

  QUnit.test("setSeverity clears previous severity classes", function (assert) {
    this.oBadge = new RiskBadge();

    this.oBadge.setSeverity("High");
    this.oBadge.setSeverity("Low");

    assert.ok(this.oBadge.hasStyleClass("creditOpsRiskBadgeLow"));
    assert.notOk(this.oBadge.hasStyleClass("creditOpsRiskBadgeHigh"));
  });

  QUnit.test("unknown severity falls back to neutral state and class", function (assert) {
    this.oBadge = new RiskBadge();

    this.oBadge.setSeverity("Unknown");

    assert.strictEqual(this.oBadge.getState(), "None");
    assert.ok(this.oBadge.hasStyleClass("creditOpsRiskBadgeNone"));
  });
});
