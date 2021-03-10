# myBiblio API

[Live App](https://mybiblio.vercel.app/)

[Live Server](https://my-biblio-api.herokuapp.com/api)

[Client-side repo](https://github.com/danieljrenfro/my-biblio-client)

---
### Catalog your library and keep track of books you've borrowed out to friends!

myBiblio is an app created for the purpose of cataloging your personal library and keeping track of books that you have lent to friends! User may add books to their library, edit books, delete books, see all of their library in one spot as well as see all borrowed books in one spot. 

---
### Tech stack
This server-side app was created with:    
<img align="left" alt="Visual Studio Code" width="26px" src="https://raw.githubusercontent.com/github/explore/80688e429a7d4ef2fca1e82350fe8e3517d3494d/topics/visual-studio-code/visual-studio-code.png" />
<img align="left" alt="JavaScript" src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" />
<img align="left" alt="NodeJS" src="https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white" />
<img align="left" alt="ExpressJS" src="https://img.shields.io/badge/Express.js-404D59?style=for-the-badge" />
<img align="left" alt="Heroku" src="https://img.shields.io/badge/Heroku-430098?style=for-the-badge&logo=heroku&logoColor=white" />
<img align="left" alt="Git" width="26px" src="https://raw.githubusercontent.com/github/explore/80688e429a7d4ef2fca1e82350fe8e3517d3494d/topics/git/git.png" />
<img align="left" alt="GitHub" width="26px" src="https://raw.githubusercontent.com/github/explore/78df643247d429f6cc873026c0622819ad797942/topics/github/github.png" />  

<br/>

---

### Endpoints
➖**Routes**    
➖**BASE URL: /api**   

➖➖➖*/user*
(POST) - create a user on the server and in the database.
➖➖➖*/auth/token*    
(POST) - send login credentials to server for auth token.
(PATCH) - refresh auth token
➖➖➖*/books*
(GET) - get all books belonging to a user
(POST) - create a new book
➖➖➖*/books/:book_id*
(GET) - get a book by id
(PATCH) - update a book by id
(DELETE) - delete a book by id
➖➖➖*/books/:book_id/borrows*
(GET) - get all active borrows that belong to an individual book
➖➖➖*/borrows*
(GET) - get all active borrows for the user
(POST) - create a borrow for the user and a given book
➖➖➖*/borrows/:borrow_id*
(GET) - get a borrow by an id
(PATCH) - update a borrow by an id
