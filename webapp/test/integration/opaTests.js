sap.ui.define([
  "sap/ui/test/Opa5",
  "sap/ui/test/opaQunit",
  "com/igor/creditops/test/integration/arrangements/Startup",
  "com/igor/creditops/test/integration/pages/Home",
  "com/igor/creditops/test/integration/pages/ApplicationDetail"
], function (Opa5, opaTest, Startup) {
  "use strict";

  Opa5.extendConfig({
    arrangements: new Startup(),
    viewNamespace: "com.igor.creditops.view.",
    autoWait: true,
    timeout: 20
  });

  QUnit.module("Credit operations approval journey");

  opaTest("Should load the worklist", function (Given, When, Then) {
    Given.iStartTheApp();

    Then.onTheHomePage.iShouldSeeTheWorklist();
  });

  opaTest("Should search for one application and open its detail page", function (Given, When, Then) {
    When.onTheHomePage.iSearchForApplication("LA-1001");

    Then.onTheHomePage.iShouldSeeOnlyApplication("LA-1001");

    When.onTheHomePage.iOpenApplication("LA-1001");

    Then.onTheApplicationDetailPage.iShouldSeeApplication("LA-1001");
  });

  opaTest("Should validate and submit an approval decision", function (Given, When, Then) {
    When.onTheApplicationDetailPage.iPressApprove();
    When.onTheApplicationDetailPage.iConfirmDecision();

    Then.onTheApplicationDetailPage.iShouldSeeDecisionCommentError();

    When.onTheApplicationDetailPage.iEnterDecisionComment("Approved after credit operations review");
    When.onTheApplicationDetailPage.iConfirmDecision();

    Then.onTheApplicationDetailPage.iShouldSeeApprovedStatus();
    Given.iTeardownTheApp();
  });

  QUnit.start();
});
