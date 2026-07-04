sap.ui.define([
  "com/igor/creditops/model/decisionValidation"
], function (decisionValidation) {
  "use strict";

  QUnit.module("model/decisionValidation");

  QUnit.test("isDecisionCommentValid rejects empty comments", function (assert) {
    assert.strictEqual(decisionValidation.isDecisionCommentValid(""), false);
    assert.strictEqual(decisionValidation.isDecisionCommentValid("   "), false);
    assert.strictEqual(decisionValidation.isDecisionCommentValid(null), false);
    assert.strictEqual(decisionValidation.isDecisionCommentValid(undefined), false);
  });

  QUnit.test("isDecisionCommentValid accepts meaningful comments", function (assert) {
    assert.strictEqual(decisionValidation.isDecisionCommentValid("Approved after review"), true);
    assert.strictEqual(decisionValidation.isDecisionCommentValid("  Reject: KYC missing  "), true);
  });
});
