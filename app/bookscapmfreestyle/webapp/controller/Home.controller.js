sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast"
], function (Controller, MessageToast) {
    "use strict";

    return Controller.extend(
        "bookscapmfreestyle.controller.Home",
        {
            onBooksLibrary:function(){
                this.getOwnerComponent().getRouter().navTo('RouteView1');
            },
            onContact: function () {
                MessageToast.show("Contact Us clicked");
            },

            onLogin: function () {
                MessageToast.show("Login clicked");
            },

            onSignup: function () {
                MessageToast.show("Signup clicked");
            },

            

        }
    );
});