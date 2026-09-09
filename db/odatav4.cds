namespace booksv4.db;
entity GenderVH{
    key code: String(1);
    text :String;
}
entity AgeGroupVH  {
    key code: String(10);
    text:String;
}

type allgender :String enum{
    Male='M';
    Female='F';


}

type booksagegroup:String enum{
    Kids='kids';
    Adult='Adult';
}

entity Books{
    key ID:UUID;
    title:String;
    author:String;
    price: Decimal(10,2);
    publishedDate:DateTime;
    gender:allgender;
    ageGroup:booksagegroup;

    chapters:Composition of many Chapters on chapters.books=$self;
}

entity Chapters{
    key ID:UUID;
    title: String;
    pages: Integer;

    books:Association to Books;
}
