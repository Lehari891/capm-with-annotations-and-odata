sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/routing/History"
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
        },
        _onMatched(oEvent){
            debugger;
        },
        _backtoView1(oEvent){
            // window.history.go(-1); // this is not much recommended so use hashchanger

            const oHistory=History.getinstance();
            const sPreviousHash=oHistory.getPreviousHash();
            if (sPreviousHash!==undefined){
                window.history.go(-1);
            }else{
                //falllback
                this.getOwnerComponent().getRouter().navTo('Home',{},true);
            }
        }

    });
});