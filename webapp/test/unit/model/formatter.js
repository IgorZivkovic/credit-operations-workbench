sap.ui.define([
  "com/igor/creditops/model/formatter"
], function (formatter) {
  "use strict";

  QUnit.module("model/formatter");

  QUnit.test("formatAmount formats OData decimal strings with two decimals", function (assert) {
    assert.strictEqual(formatter.formatAmount("2500000.5"), "2,500,000.50");
    assert.strictEqual(formatter.formatAmount("32000.75"), "32,000.75");
  });

  QUnit.test("formatAmount returns an empty string for empty input", function (assert) {
    assert.strictEqual(formatter.formatAmount(null), "");
    assert.strictEqual(formatter.formatAmount(undefined), "");
    assert.strictEqual(formatter.formatAmount(""), "");
  });

  QUnit.test("statusState maps workflow statuses to semantic UI5 states", function (assert) {
    assert.strictEqual(formatter.statusState("Approved"), "Success");
    assert.strictEqual(formatter.statusState("Pending Approval"), "Warning");
    assert.strictEqual(formatter.statusState("Needs Documents"), "Error");
    assert.strictEqual(formatter.statusState("Rejected"), "Error");
    assert.strictEqual(formatter.statusState("In Review"), "Information");
    assert.strictEqual(formatter.statusState("Unknown"), "None");
  });
});
