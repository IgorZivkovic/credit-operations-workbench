sap.ui.define([], function () {
  "use strict";

  return {
    isDecisionCommentValid: function (sComment) {
      return Boolean(String(sComment || "").trim());
    }
  };
});
