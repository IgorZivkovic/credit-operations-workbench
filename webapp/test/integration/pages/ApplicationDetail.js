sap.ui.define([
  "sap/ui/test/Opa5",
  "sap/ui/test/actions/EnterText",
  "sap/ui/test/actions/Press",
  "sap/ui/test/matchers/PropertyStrictEquals"
], function (Opa5, EnterText, Press, PropertyStrictEquals) {
  "use strict";

  var sViewName = "ApplicationDetail";

  Opa5.createPageObjects({
    onTheApplicationDetailPage: {
      actions: {
        iPressApprove: function () {
          return this.waitFor({
            controlType: "sap.m.Button",
            viewName: sViewName,
            matchers: new PropertyStrictEquals({
              name: "text",
              value: "Approve"
            }),
            actions: new Press(),
            errorMessage: "The approve button was not found."
          });
        },

        iConfirmDecision: function () {
          return this.waitFor({
            searchOpenDialogs: true,
            controlType: "sap.m.Button",
            matchers: new PropertyStrictEquals({
              name: "text",
              value: "Confirm"
            }),
            actions: new Press(),
            errorMessage: "The confirm decision button was not found."
          });
        },

        iEnterDecisionComment: function (sComment) {
          return this.waitFor({
            id: "decisionComment",
            viewName: sViewName,
            actions: new EnterText({
              text: sComment
            }),
            errorMessage: "The decision comment field was not found."
          });
        }
      },

      assertions: {
        iShouldSeeApplication: function (sApplicationId) {
          return this.waitFor({
            controlType: "sap.m.ObjectHeader",
            viewName: sViewName,
            matchers: new PropertyStrictEquals({
              name: "title",
              value: sApplicationId
            }),
            success: function () {
              Opa5.assert.ok(true, "The application detail page shows " + sApplicationId + ".");
            },
            errorMessage: "The application detail page did not show " + sApplicationId + "."
          });
        },

        iShouldSeeDecisionCommentError: function () {
          return this.waitFor({
            id: "decisionComment",
            viewName: sViewName,
            check: function (oTextArea) {
              return oTextArea.getValueState() === "Error";
            },
            success: function () {
              Opa5.assert.ok(true, "The decision comment is required before submitting.");
            },
            errorMessage: "The decision comment field did not show a validation error."
          });
        },

        iShouldSeeApprovedStatus: function () {
          return this.waitFor({
            controlType: "sap.m.ObjectStatus",
            viewName: sViewName,
            matchers: new PropertyStrictEquals({
              name: "text",
              value: "Approved"
            }),
            success: function () {
              Opa5.assert.ok(true, "The application status was updated to Approved.");
            },
            errorMessage: "The approved status was not visible after confirming the decision."
          });
        }
      }
    }
  });
});
