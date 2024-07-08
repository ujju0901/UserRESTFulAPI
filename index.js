const { faker } = require("@faker-js/faker");
const mysql = require("mysql2");
const path = require("path");
const methodOverride = require("method-override");

const express = require("express");
const { log } = require("console");
const app = express();
let port = 8080;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "/public")));

app.use(methodOverride("_method"));

app.use(express.urlencoded({ extended: true }));

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: process.env.PASSWORD,
  database: "delta_app",
});

app.listen(port, () => {
  console.log("Server is running on port 8080");
});

app.get("/login", (req, res) => {
  res.render("login.ejs");
});

app.get("/users", (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 50;
  const offset = (page - 1) * limit;

  let q = `SELECT * FROM atsuser LIMIT ${limit} OFFSET ${offset}`;
  try {
    connection.query(q, (err, result) => {
      if (err) throwerr;
      let users = result;
      res.render("users.ejs", { users, page, limit });
    });
  } catch (err) {
    console.log(err);
  }
});
app.get("/user/:id", (req, res) => {
  let { id } = req.params;
  let q = `SELECT * FROM atsuser WHERE id = '${id}'`;
  try {
    connection.query(q, (err, result) => {
      if (err) throw err;
      let user = result[0];
      console.log(user);
      res.render("userDetail.ejs", { user });
    });
  } catch (err) {
    console.log(err);
  }
});

app.get("/user/:id/edit", (req, res) => {
  let { id } = req.params;
  let q = `SELECT * FROM atsuser WHERE id = '${id}'`;
  try {
    connection.query(q, (err, result) => {
      if (err) throw err;
      let user = result[0];
      console.log(user);
      res.render("editUser.ejs", { user });
    });
  } catch (err) {
    console.log(err);
  }
});

app.post("/user/:id/update", (req, res) => {
  let { id } = req.params;
  let { first_name, last_name, role, password } = req.body;
  let q2 = `Select * from atsuser where id='${id}'`;
  connection.query(q2, (err, result) => {
    if (err) throw err;
    let user = result[0];
    if (password === user.password) {
      password = user.password;
      let q = `UPDATE atsuser SET first_name = '${first_name}', last_name = '${last_name}', role='${role}' WHERE id = '${id}'`;
      connection.query(q, (err, result) => {
        if (err) throw err;
        res.redirect(`/user/${id}`);
      });
    } else {
      res.redirect("/users");
    }
  });
});

app.post("/login", (req, res) => {
  let { username, password } = req.body;
  let q = `SELECT * FROM atsuser WHERE username ='${username}' and password ='${password}'`;
  connection.query(q, (err, result) => {
    if (err) throw err;
    let user = result[0];
    console.log(user);
    if (user.username === username && user.password === password) {
      res.render("home.ejs", { user });
    } else {
      res.redirect("/login");
    }
  });
});

app.get("/user/:id/delete", (req, res) => {
  let { id } = req.params;
  let q = `SELECT * FROM atsuser WHERE id = '${id}'`;
  try {
    connection.query(q, (err, result) => {
      if (err) throw err;
      let user = result[0];
      console.log(user);
      res.render("deleteUser.ejs", { user });
    });
  } catch (err) {
    console.log(err);
  }
});

app.delete("/user/:id/delete", (req, res) => {
  let { id } = req.params;
  let { password } = req.body;
  console.log(password);
  let q2 = `Select * from atsuser where id='${id}'`;
  connection.query(q2, (err, result) => {
    if (err) throw err;
    let user = result[0];
    if (password === user.password) {
      let q = `DELETE FROM atsuser WHERE id = '${id}'`;
      connection.query(q, (err, result) => {
        if (err) throw err;
        res.redirect("/login");
      });
    } else {
      res.redirect("/users");
    }
  });
});

app.get("/count", (req, res) => {
  let q = `SELECT COUNT(*) as count FROM atsuser`;
  try {
    connection.query(q, (err, result) => {
      if (err) throw err;
      let count = result[0].count;
      res.render("count.ejs", { count });
    });
  } catch (err) {
    console.log(err);
  }
});

// let q = "Insert into firms (id,firm_name,firm_address,users) values ? ";
// let getRandomUser = () => {
//   return [
//     faker.datatype.uuid(),
//     faker.internet.userName(),
//     faker.address.streetAddress(),
//     faker.datatype.number({ min: 1, max: 100 }),
//   ];
// };

// let data = [];
// for (let i = 1; i <= 100; i++) {
//   data.push(getRandomUser());
// }

// try {
//   connection.query(q, [data], (err, result) => {
//     if (err) throw err;
//     let users = result;
//     console.log(users);
//   });
// } catch (err) {
//   console.log(err);
// }
