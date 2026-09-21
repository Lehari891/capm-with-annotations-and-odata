sap.ui.define([],function(){
    "use strict";
    return{
//all condtion function
        formatStatusIcon: function(val){
            switch(val){
                case "C": return "sap-icon://accept";
                case "I":return "sap-icon://pending";
                default : return "sap-icon://alert";
            }
        },
        formatStatusColor:function(col){
            switch(val){
                case "C": return "Positive";
                case "I":return "Critical";
                default : return "Negative";
            }
        }
    };
})
    
