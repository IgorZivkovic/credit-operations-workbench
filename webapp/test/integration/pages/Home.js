sap.ui.define([
  "sap/ui/test/Opa5",
  "sap/ui/test/actions/Press"
], function (Opa5, Press) {
  "use strict";

  var sViewName = "Home";

  function getApplicationId(oItem) {
    return oItem.getCells()[0].getTitle();
  }

  Opa5.createPageObjects({
    onTheHomePage: {
      actions: {
        iSearchForApplication: function (sApplicationId) {
          return this.waitFor({
            id: "searchField",
            viewName: sViewName,
            success: function (oSearchField) {
              oSearchField.setValue(sApplicationId);
              oSearchField.fireLiveChange({
                newValue: sApplicationId
              });
              Opa5.assert.ok(true, "Searched for application " + sApplicationId + ".");
            },
            errorMessage: "The search field was not found."
          });
        },

        iOpenApplication: function (sApplicationId) {
          return this.waitFor({
            controlType: "sap.m.ColumnListItem",
            viewName: sViewName,
            matchers: function (oItem) {
              return getApplicationId(oItem) === sApplicationId;
            },
            actions: new Press(),
            errorMessage: "The application row " + sApplicationId + " was not found."
          });
        }
      },

      assertions: {
        iShouldSeeTheWorklist: function () {
          return this.waitFor({
            id: "loanApplicationsTable",
            viewName: sViewName,
            check: function (oTable) {
              return oTable.getItems().length > 0;
            },
            success: function (oTable) {
              Opa5.assert.ok(oTable.getItems().length > 0, "The worklist contains loan applications.");
            },
            errorMessage: "The loan applications worklist did not load."
          });
        },

        iShouldSeeOnlyApplication: function (sApplicationId) {
          return this.waitFor({
            id: "loanApplicationsTable",
            viewName: sViewName,
            check: function (oTable) {
              var aItems = oTable.getItems();

              return aItems.length === 1 && getApplicationId(aItems[0]) === sApplicationId;
            },
            success: function () {
              Opa5.assert.ok(true, "The worklist was filtered to " + sApplicationId + ".");
            },
            errorMessage: "The worklist was not filtered to " + sApplicationId + "."
          });
        }
      }
    }
  });
});
