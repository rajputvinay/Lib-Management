//BOOK Class :Represents a Book
class Book {
  constructor(title, author, isbn) {
    this.title = title;
    this.author = author;
    this.isbn = isbn;
  }
}
class Store {
  static getBooks() {
    let books;
    if (localStorage.getItem("books") === null) {
      books = [];
    } else {
      books = JSON.parse(localStorage.getItem("books"));
      // console.log(books);
    }
    return books;
  }
  static addBooks(book) {
    const books = Store.getBooks();
    books.push(book);

    localStorage.setItem("books", JSON.stringify(books));
  }
  static removeBooks(isbn) {
    const books = Store.getBooks();
    books.forEach((book, index) => {
      if (book.isbn === isbn) {
        books.splice(index, 1);
      }
    });
    localStorage.setItem("books", JSON.stringify(books));
  }
}

//UI class : Handle UI task
//static=a method or property that belongs to classs and not any one object
class UI {
  static displayBooks() {
    const books = Store.getBooks();
    for (const book of books) {
      UI.addBookToList(book);
    }
  }
  static addBookToList(book) {
    const list = document.getElementById("book-list");
    const row = document.createElement("tr");
    row.innerHTML = `
  <td>${book.title}</td>
  <td>${book.author}</td>
  <td>${book.isbn}</td>
  <td> <a href="#" class="btn btn-danger btn-sm delete">X</a></td>
  
  `;
    list.appendChild(row);
  }
  static deleteBook(el) {
    if (el.classList.contains("delete")) {
      el.parentElement.parentElement.remove();
    }
  }
  static alert(message, className) {
    const div = document.createElement("div");
    div.innerHTML = `
    <div class="alert alert-${className}">${message} </div>
    `;
    const container = document.querySelector(".container");
    const form = document.getElementById("book-form");
    container.insertBefore(div, form);
    //make vanish in 3 sec
    setTimeout(() => document.querySelector(".alert").remove(), 2000);
  }
  static clearField() {
    document.querySelector("#title").value = "";
    document.querySelector("#author").value = "";
    document.querySelector("#isbn").value = "";
  }
}

document.addEventListener("DOMContentLoaded", UI.displayBooks);
//DOMcontentloaded   ?????
document.getElementById("book-form").addEventListener("submit", (e) => {
  e.preventDefault();

  const title = document.querySelector("#title").value;
  const author = document.querySelector("#author").value;
  const isbn = document.querySelector("#isbn").value;

  //validate
  if (title === "" || author === "" || isbn === "") {
    return UI.alert("empty fields are not allowed", "danger");
  }
  //to instaniate book
  const book = new Book(title, author, isbn);
  //add book to list
  UI.addBookToList(book);

  UI.alert("book is added", "success");

  //add book to store
  Store.addBooks(book);

  UI.clearField();
});
document.getElementById("book-list").addEventListener("click", (e) => {
  // remove book from UI
  UI.deleteBook(e.target);

  // remove book from store
  Store.removeBooks(e.target.parentElement.previousElementSibling.textContent);
  //removed msg
  UI.alert("deleted", "danger");
});
