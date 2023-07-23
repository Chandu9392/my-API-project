const express = require("express");

var bodyParser= require("body-parser");  // bodyparser is node module ,it is udes to execute POST request.
// inoder to accees the bodyparser , body paerser is process that allows read the body and convert(parse) into jsoon object

// database
const database= require("./database");

// initialize express

const booky= express();
//-------------------^^^^^^^^^^^^^^^^^^^^POST REQUEST----------------------->
booky.use(bodyParser.urlencoded({extended:true})); 
booky.use(bodyParser.json());


/* route           /
description       get all the books
access            PUBLIC
parameters        NONE
METHODS           GET
 */

booky.get("/",(req,res)=>{
    return res.json({books:database.books});
});

/*route           /is
description        GET SPECIFIC BOOK ISBN
access            PUBLIC
parameters        ISBN
METHODS           GET
 */

booky.get("/is/:isbn",(req,res)=>{
    const specficBook=database.books.filter(
        (book)=>book.ISBN===req.params.isbn);

        if(specficBook.length===0){
            return res.json({error:`no books found for the isbn of ${req.params.isbn}`});
        }
        return res.json({book:specficBook});
});

/*route           /c
description        GET SPECIFIC BOOK BAESD ON CATEGORY
access            PUBLIC
parameters         CATEGORY
METHODS           GET
 */
booky.get("/c/:category",(req,res)=>{
    const specficBook=database.books.filter(
     (book)=>book.category.includes(req.params.category));

     if(specficBook.length===0){
        return res.json({error:`no book found for the ${req.params.category}`});
     }
     return res.json({book:specficBook});


});
/*route           /l
description        GET SPECIFIC BOOK BAESD ON language
access            PUBLIC
parameters         language
METHODS           GET
 */
 //--------------------------------- based on language is not opening------------------------------------------------

booky.get("/la/:language",(req,res)=>{
    const specificBook=database.books.filter(
        (book)=>book.language===req.params.language);

        if(specificBook.length===0){
            return res.json({error:`no book found for the book of ${req.params.language}`});
        }

        return res.json({book:specificBook});
});

//^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
/*route           /author
description        GET ALL THE AUTHORS
access            PUBLIC
parameters          NONE
METHODS           GET
 */
booky.get("/author",(req,res)=>{
    return res.json({authors:database.author});
});

/*route           /author
description        GET SPECIFIC AUTHORS
access            PUBLIC
parameters          isbn
METHODS           GET
 */
booky.get("/author/books/:isbn",(req,res)=>{
    const specificAuthor=database.author.filter(
     (author)=>author.books.includes(req.params.isbn));

    if(specificAuthor.length===0){
        return res.json({error:`no book found for the book of ${req.params.isbn}`});
        }
    return res.json({authors:specificAuthor});
});
//--------------TWO TASKS IS TEHRE

/*route           /publications
description        GET all the the publiactions
access            PUBLIC
parameters          NONE
METHODS           GET
 */
booky.get("/publications",(req,res)=>{
    return res.json({publications:database.publications});
 });

 // POST API

 /*route           /book/new
description        add new book
access            PUBLIC
parameters          NONE
METHODS           post
 */

booky.post("/book/new",(req,res)=>{
    const newBook=req.body; // posting some request, its fetch the body request , trying t o new book.
    database.books.push(newBook);
    return res.json({updatedBook:database.books});

});
/*route           /author/new
description        add new authors
access            PUBLIC
parameters          NONE
METHODS           post
 */ 

booky.post("/author/new",(req,res)=>{
    const newAuthor=req.body;
    database.author.push(newAuthor);
    return res.json(database.author);
});

/*route           /publication/new
description        aadd new publication
access            PUBLIC
parameters          NONE
METHODS           post
 */

booky.post("/publication/new",(req,res)=>{
    const newPublication=req.body;
    database.publications.push(newPublication);
    return res.json(database.publications);
});

//PUT REQUEST
/*route           /publication/new
description        aadd new publication
access            PUBLIC
parameters          NONE
METHODS           post
 */
booky.put("/publications/update/book/:isbn",(req,res)=>{
     //update the publication database
     database.publications.forEach((pub)=>{
        if(pub.id===req.body.pubId){
           return pub.books.push(req.params.isbn);
        }
     });

     //update the book database
     database.books.forEach((book)=>{
        if(book.ISBN===req.params.isbn){
            book.publications=req.body.pubId;
            return;
        }
     });

     return res.json({
        books:database.books,
        publications:database.publications,
        message:"sucessfully updated publications"
      });

});

//DELETE REQUEST
/*route           /book/delete/author
description         delete an author from a book vice versa
access            PUBLIC
parameters         isbn, authorId
METHODS           DELETE
 */
 
booky.delete("/book/delete/author/:isbn/:authorId",(req,res)=>{
     // update book adatabase
     database.books.forEach((book)=>{
        if(book.ISBN===req.params.isbn){
            const newAuthorList=book.author.filter(
                (eachAuthor)=> eachAuthor!=parseInt(req.params.authorId)
            );
            book.author=newAuthorList;
            return;
        }
     }) 

     // upadte the athor database
     database.author.forEach((eachAuthor)=>{
        if(eachAuthor.id=== parseInt(req.params.authorId)){
            const newbookList=eachAuthor.books.filter((book)=>book != req.params.isbn);
            eachAuthor.books=newbookList;
            return;
        }
    });

    return res.json({
        book:database.books,
        author:database.author,
        messge:"author was deleted"
    });
});


 booky.listen(3000,()=>
 {
    console.log("server is running");
 });