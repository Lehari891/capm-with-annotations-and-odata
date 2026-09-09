using { booksv4.db as v4 } from '../db/odatav4';

service BooksLibSrv @(path : '/odata/v4/bookssrv'){
    @odata.draft.enabled // this annotation is for edit button
    entity BooksSet as projection on v4.Books;
    entity GenderVH as projection on v4.GenderVH;
    entity AgeGroupVH as projection on v4.AgeGroupVH;

    entity ChaptersSet as projection on v4.Chapters;
}


annotate BooksLibSrv.BooksSet with @(
    UI: {
        LineItem: [  //colums for table
            { Value: title, Label: 'Title' },
            { Value: author, Label: 'Author' },
            { Value: price, Label: 'Price' },
            { Value: publishedDate, Label: 'Published Date' },
            { Value: gender, Label: 'Gender' },
            { Value: ageGroup, Label: 'Age Group' },
        ],
        SelectionFields  : [  //filter bar
            title,price,gender
            
        ],
        HeaderInfo  : {   //object page title
            $Type : 'UI.HeaderInfoType',
            TypeName : 'Book',
            TypeNamePlural : 'Books',
            Title:{Value:title},
            Description:{Value:author}
        },
        Facets  : [   //think of it as a section containing fields
            {
                $Type:'UI.ReferenceFacet',
                Label:'Genaral Information',
                Target:'@UI.FieldGroup#General'

            },
            {
                $Type:'UI.ReferenceFacet',
                Label:'Publication Details',
                Target:'@UI.FieldGroup#Publication'

            },
            {
                $Type:'UI.ReferenceFacet',
                Label:'Pricing',
                Target:'@UI.FieldGroup#Pricing'

            },
            
        ],
        FieldGroup #General : {
        Data:[
            {Value:title,Label:'Title'},
            {Value:author,Label:'author'},
            {Value:gender,Label:'Gender'}

        ]            
        },
        FieldGroup#Publication : {
        Data:[
            {Value:publishedDate,Label:'Publication'},
            {Value:ageGroup,Label:'Age Group'}
        ]            
        },
        FieldGroup#Pricing : {
        Data:[
            {Value:price,Label:'Price'}

        ]            
        },
    }
);
annotate BooksLibSrv.BooksSet with { // thisis for valuehelp for particular field in obj section
    gender @(
        Common.ValueList : {
            CollectionPath : 'GenderVH',
            Parameters : [
                {
                    $Type : 'Common.ValueListParameterInOut',
                    LocalDataProperty : gender,
                    ValueListProperty : 'code'
                },
                {
                    $Type : 'Common.ValueListParameterDisplayOnly',
                    ValueListProperty : 'text'
                }
            ]
        }
    );

    ageGroup @(
        Common.ValueList : {
            CollectionPath : 'AgeGroupVH',
            Parameters : [
                {
                    $Type : 'Common.ValueListParameterInOut',
                    LocalDataProperty : ageGroup,
                    ValueListProperty : 'code'
                },
                {
                    $Type : 'Common.ValueListParameterDisplayOnly',
                    ValueListProperty : 'text'
                }
            ]
        }
    );
};