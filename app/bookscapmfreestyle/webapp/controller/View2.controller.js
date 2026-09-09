sap.ui.define([
    "sap/ui/core/mvc/Controller"
], function (Controller) {
    "use strict";

    return Controller.extend("bookscapmfreestyle.controller.View2", {

        onInit: function () {
            this.getOwnerComponent()
                .getRouter()
                .getRoute("RouteView2")
                .attachPatternMatched(this._objectMatched, this);
        },

        _objectMatched: function (oEvent) {

            const bookid = oEvent.getParameter("arguments").ID;

            var sPath = `/BooksSet(ID='${bookid}')`;

            this.getView().bindElement({
                path: sPath,
                parameters: {
                    $expand: "chapters"
                }
            });
        }

    });
});