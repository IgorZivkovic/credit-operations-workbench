sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/ui/core/Fragment",
  "sap/ui/core/message/Message",
  "sap/ui/core/Messaging",
  "sap/ui/core/library",
  "sap/ui/model/Filter",
  "sap/ui/model/FilterOperator",
  "sap/m/MessageBox",
  "sap/m/MessageItem",
  "sap/m/MessagePopover",
  "sap/m/MessageToast",
  "../model/decisionValidation",
  "../model/formatter"
], function (
  Controller,
  Fragment,
  Message,
  Messaging,
  coreLibrary,
  Filter,
  FilterOperator,
  MessageBox,
  MessageItem,
  MessagePopover,
  MessageToast,
  decisionValidation,
  formatter
) {
  "use strict";

  var MessageType = coreLibrary.MessageType;

  return Controller.extend("com.igor.creditops.controller.ApplicationDetail", {
    formatter: formatter,

    onInit: function () {
      this._oMessageManager = Messaging;
      this._oMessageManager.registerObject(this.getView(), true);
      this.getView().setModel(this._oMessageManager.getMessageModel(), "message");

      this.getOwnerComponent()
        .getRouter()
        .getRoute("applicationDetail")
        .attachPatternMatched(this._onRouteMatched, this);
    },

    onNavBack: function () {
      this.getOwnerComponent().getRouter().navTo("home");
    },

    onApprove: function () {
      this._openDecisionDialog("Approved");
    },

    onReject: function () {
      this._openDecisionDialog("Rejected");
    },

    onDecisionCommentLiveChange: function () {
      this._validateDecisionComment();
    },

    onConfirmDecision: function () {
      if (!this._validateDecisionComment()) {
        return;
      }

      var sDecision = this._sPendingDecision;
      var sComment = this.byId("decisionComment").getValue().trim();
      var oContext = this.getView().getBindingContext();
      var oModel = this.getView().getModel();

      oModel.setProperty(oContext.getPath() + "/status", sDecision);
      this._addLocalActivityEntry(sDecision, sComment);
      this._oDecisionDialog.close();

      MessageToast.show(this.getResourceBundle().getText("decisionSuccess", [sDecision]));
    },

    onCancelDecision: function () {
      this._clearDecisionValidationMessage();
      this._oDecisionDialog.close();
    },

    onOpenDecisionMessages: function (oEvent) {
      this._getDecisionMessagePopover().openBy(oEvent.getSource());
    },

    _onRouteMatched: function (oEvent) {
      var sApplicationId = decodeURIComponent(oEvent.getParameter("arguments").applicationId);
      var oModel = this.getView().getModel();

      this._filterRelatedLists(sApplicationId);
      this._filterRiskSignals(sApplicationId);

      oModel.metadataLoaded().then(function () {
        this._bindApplication(sApplicationId);
      }.bind(this));
    },

    _bindApplication: function (sApplicationId) {
      var oModel = this.getView().getModel();
      var sPath = "/" + oModel.createKey("LoanApplications", {
        id: sApplicationId
      });

      this.getView().bindElement({
        path: sPath,
        events: {
          dataReceived: this._onApplicationDataReceived.bind(this)
        }
      });
    },

    _onApplicationDataReceived: function () {
      var oContext = this.getView().getBindingContext();
      var oModel = this.getView().getModel();

      if (!oContext) {
        MessageBox.error(this.getResourceBundle().getText("detailNotFound"));
        this.onNavBack();
        return;
      }

      this.byId("customerPanel").bindElement("/" + oModel.createKey("Customers", {
        id: oContext.getProperty("customerId")
      }));
    },

    _filterRelatedLists: function (sApplicationId) {
      var aFilters = [
        new Filter("applicationId", FilterOperator.EQ, sApplicationId)
      ];

      ["tasksTable", "documentsTable", "activityTable"].forEach(function (sTableId) {
        var oBinding = this.byId(sTableId).getBinding("items");

        if (oBinding) {
          oBinding.filter(aFilters);
        }
      }, this);
    },

    _filterRiskSignals: function (sApplicationId) {
      var oBinding = this.byId("riskSignalsList").getBinding("items");

      if (oBinding) {
        oBinding.filter([
          new Filter("applicationId", FilterOperator.EQ, sApplicationId)
        ]);
      }
    },

    _openDecisionDialog: function (sDecision) {
      this._sPendingDecision = sDecision;

      this._loadDecisionDialog().then(function (oDialog) {
        this.byId("decisionType").setText(this.getResourceBundle().getText(
          sDecision === "Approved" ? "approveDialogTitle" : "rejectDialogTitle"
        ));
        this.byId("decisionComment").setValue("");
        this.byId("decisionComment").setValueState("None");
        this.byId("decisionComment").setValueStateText("");
        this._clearDecisionValidationMessage();
        oDialog.open();
      }.bind(this));
    },

    _loadDecisionDialog: function () {
      if (!this._pDecisionDialog) {
        this._pDecisionDialog = Fragment.load({
          id: this.getView().getId(),
          name: "com.igor.creditops.view.fragment.DecisionDialog",
          controller: this
        }).then(function (oDialog) {
          this.getView().addDependent(oDialog);
          this._oDecisionDialog = oDialog;
          return oDialog;
        }.bind(this));
      }

      return this._pDecisionDialog;
    },

    _validateDecisionComment: function () {
      var oTextArea = this.byId("decisionComment");
      var bValid = decisionValidation.isDecisionCommentValid(oTextArea.getValue());

      oTextArea.setValueState(bValid ? "None" : "Error");
      oTextArea.setValueStateText(bValid ? "" : this.getResourceBundle().getText("decisionCommentRequired"));
      this._clearDecisionValidationMessage();

      if (!bValid) {
        this._oDecisionCommentMessage = new Message({
          message: this.getResourceBundle().getText("decisionCommentRequired"),
          type: MessageType.Error,
          target: "/decision/comment",
          processor: this.getView().getModel()
        });
        this._oMessageManager.addMessages(this._oDecisionCommentMessage);
      }

      return bValid;
    },

    _clearDecisionValidationMessage: function () {
      if (this._oDecisionCommentMessage) {
        this._oMessageManager.removeMessages(this._oDecisionCommentMessage);
        this._oDecisionCommentMessage = null;
      }
    },

    _getDecisionMessagePopover: function () {
      if (!this._oDecisionMessagePopover) {
        this._oDecisionMessagePopover = new MessagePopover({
          items: {
            path: "message>/",
            template: new MessageItem({
              type: "{message>type}",
              title: "{message>message}",
              description: "{message>description}"
            })
          }
        });
        this.getView().addDependent(this._oDecisionMessagePopover);
      }

      return this._oDecisionMessagePopover;
    },

    _addLocalActivityEntry: function (sDecision, sComment) {
      var oModel = this.getView().getModel();
      var sApplicationId = this.getView().getBindingContext().getProperty("id");
      var sId = "A-" + Date.now();

      oModel.create("/ActivityLog", {
        id: sId,
        applicationId: sApplicationId,
        action: sDecision === "Approved" ? "Application approved" : "Application rejected",
        actor: "Current User",
        timestamp: new Date().toISOString(),
        note: sComment
      }, {
        success: function () {
          this._filterRelatedLists(sApplicationId);
        }.bind(this)
      });
    },

    getResourceBundle: function () {
      return this.getOwnerComponent().getModel("i18n").getResourceBundle();
    }
  });
});
