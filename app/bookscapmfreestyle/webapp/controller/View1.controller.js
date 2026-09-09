sap.ui.define([
    "sap/ui/core/mvc/Controller"
], (Controller) => {
    "use strict";

    return Controller.extend("bookscapmfreestyle.controller.View1", {
        onInit() {
            var oDatamodel = this.getOwnerComponent().getModel();///fir odata v4
            this.getView().setModel(oDatamodel, 'bk')

            //Filters
            var oTable = this.getView().byId('idBooksTable');
            var oBinding = oTable.getBinding('items');
            // var aFilters=[
            //     new sap.ui.model.Filter('price','LT',500)
            // ];

            // oBinding.filter(aFilters);


            // //sorters
            // var oSorter=new sap.ui.model.Sorter("price",true)
            // oBinding.sort(oSorter);




        },
        _showChapters: async function (oEvent) {
            var oModel = this.getView().getModel("bk"); // OData V4 model (NOT JSON)    
            var oBookCtx = oEvent.getParameter('listItem').getBindingContext('bk');
            if (!oBookCtx) return;
            


            var sId = oBookCtx.getProperty("ID");
            // var sPath = "/BooksSet(ID=' " + sId + " ')";
            var sPath = `/BooksSet(ID=${sId})`;

            //bind context with expand
            var oCtxBinding = oModel.bindContext(sPath, null, {
                $expand: "chapters"
            });

            var oObj = await oCtxBinding.requestObject();

            // safe guard
            var aChapters = (oObj && oObj.chapters) ? oObj.chapters : [];

            this.getView().setModel(new sap.ui.model.json.JSONModel(aChapters), "ch");

        

    },

    onItemPress(oEvent){
        const oCtx=oEvent.getSource().getBindingContext('bk');
        const oObj=oCtx.getObject();
        this.getOwnerComponent().getRouter().navTo('RouteView2',{
            ID: oObj.ID
        })
    }
    });
});