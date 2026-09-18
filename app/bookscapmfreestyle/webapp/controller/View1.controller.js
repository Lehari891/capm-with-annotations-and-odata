sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox"
], (Controller, MessageBox) => {
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

        onItemPress(oEvent) {
            const oCtx = oEvent.getSource().getBindingContext('bk');
            const oObj = oCtx.getObject();
            this.getOwnerComponent().getRouter().navTo('RouteView2', {
                ID: oObj.ID
            })
        },

        // craetes a button called create and add an entry
        async _CreateNewRecord() {
            var oModel = this.getView().getModel('bk');
            var sGroupId = 'bookcud';
            var opayLoad = {
                "title": "Rich dada poor dad",
                "author": "robert kiyosaki",
                "price": "6",
                "publushedDate": "2026-01-10",
                "gender": "M",
                "ageGroup": "Adult"

            };
            var oitemsBinding = this.byId('idBooksTable').getBinding('items');
            oitemsBinding.create(opayLoad);
            await oModel.submitBatch(sGroupId);
            // .then(x=>{
            //     oitemsBinding.refresh();

            // })
            // .catch(err=>{
            //     sap.m.MessageBox.error(err.message || 'create failed');

            // })
        },

        // update a selected item
        async _UpdateExistingRecord() {
            var oModel = this.getView().getModel('bk');
            var oTable = this.byId('idBooksTable');
            var oItem = oTable.getSelectedItem();
            var sGroupId = 'bookcud';

            if (!oItem) {
                sap.m.MessageBox.show('select a book first');
                return;

            }
            var oCtx = oItem.getBindingContext('bk'); //ODATA V4 CONTEXT

            // 1) chnage properties
            oCtx.setProperty('price', 39999);
            oCtx.setProperty('title', 'new title');

            //2) send to backend

            await oModel.submitBatch(sGroupId)
                .then(x => sap.m.MessageBox.show('updates'))
                .catch(err => sap.m.MessageBox.error(err.message || 'update failed'));



        },


        // Delete the selected item

        async _DeleteExistingRecord() {
            var oTable = this.byId("idBooksTable");
            var oItem = oTable.getSelectedItem();

            if (!oItem) {
                sap.m.MessageToast.show("Select a book first");
                return;
            }
            var oCtx = oItem.getBindingContext("bk");
            var oModel = this.getView().getModel("bk");
            MessageBox.confirm("Delete this book?", {
                actions: [sap.m.MessageBox.Action.DELETE, sap.m.MessageBox.Action.CANCEL],
                emphasizedAction: sap.m.MessageBox.Action.DELETE,
                onClose: async (sAction) => {
                    if (sAction !== sap.m.MessageBox.Action.DELETE) return;
                    try {
                        // Delete uses group; "$auto" also works if you want immediate
                        await oCtx.delete("bookChanges");
                        await oModel.submitBatch("bookChanges");
                        sap.m.MessageToast.show("Deleted");
                        // optional refresh
                        oTable.getBinding("items").refresh();
                    } catch (err) {
                        sap.m.MessageBox.error(err.message || "Delete failed");
                    }
                }
            });
        },


        /// how batch updae owrks an example

        async _BatchUpdate() {
            var oModel = this.getView().getModel('bk');
            var sGroupId = 'bookcud';
            var opayLoad1 = {
                "title": "Book 1",
                "author": "Author 1",
                "price": "100",
                "publushedDate": "2026-01-10",
                "gender": "M",
                "ageGroup": "Adult"

            };
            var opayLoad2 = {
                "title": "Book 2",
                "author": "Author 2",
                "price": "900",
                "publushedDate": "2026-01-10",
                "gender": "F",
                "ageGroup": "Adult"

            };
            var oitemsBinding = this.byId('idBooksTable').getBinding('items');
            oitemsBinding.create(opayLoad1, { groupId: sGroupId });
            oitemsBinding.create(opayLoad2, { groupId: sGroupId }); //till here the data is upto ui level only any changes it is restricted to ui level
            try {
                await oModel.submitBatch(sGroupId);
                sap.m.MessageToast.show("2 records in one $batch") /// now data gets to backend
            } catch (err) {
                sap.m.MessageBox.error(err.message || "batch creation failed");
            }


        },

        async _CreateFragment() {
            if (!this._oCreateDialog) {
                this._oCreateDialog = await this.loadFragment({
                    name: 'bookscapmfreestyle.fragments.createFragment'
                });
                this.getView().addDependent(this._oCreateDialog);

            }
            const oCreateModel = new sap.ui.model.json.JSONModel({
                newBook: {
                    title: '',
                    author: '',
                    price: 'null',
                    publishedDate: null

                }
            });
            this.getView().setModel(oCreateModel, 'create');

            this._oCreateDialog.open();
        },
        onCancelDialog() {
            this._oCreateDialog.close();
        },
        async onSaveBook() {
            const oDataModel = this.getView().getModel('bk');
            const oCreateModel = this.getView().getModel('create');
            //debugger;
            const oPayLoad = structuredClone(oCreateModel.getProperty('/newBook'));
            // basic validation
            if (!oPayLoad.title || !oPayLoad.author) {
                sap.m.MessageBox.warning('Title and author are required');
                return;
            }
            if (oPayLoad.publishedDate) {

                oPayLoad.publishedDate =

                    new Date(oPayLoad.publishedDate).toISOString();

            }

            console.log(oPayLoad);
            const sGroupId = 'bookcud';
            try {
                const oListBinding = oDataModel.bindList('/BooksSet');
                const oContext = oListBinding.create(oPayLoad, { groupId: sGroupId });

                await oDataModel.submitBatch(sGroupId);

                await oContext.created();

                sap.m.MessageToast.show('book created successfully');
                this._oCreateDialog.close();
                oCreateModel.setProperty("/newBook", { title: '', author: '', price: 'null', publishedDate: 'null' });
                this.byId('idBooksTable').getBinding('items').refresh();

            } catch (error) {
                sap.m.MessageBox.error(error?.message || 'craetio failed');

            }

        },
    });
});