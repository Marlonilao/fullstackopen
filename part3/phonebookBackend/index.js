require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const Person = require("./models/phonebook");

const app = express();

app.use(express.static("dist"));
app.use(express.json());
morgan.token("body", function (req, res) {
  return req.body;
});

app.use(
  morgan(function (tokens, req, res) {
    return [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, "content-length"),
      "-",
      tokens["response-time"](req, res),
      "ms",
      JSON.stringify(tokens.body(req, res)),
    ].join(" ");
  }),
);

app.get("/", (request, response) => {
  response.send("<h1>Hello World!</h1>");
});

app.get("/api/persons", (request, response) => {
  Person.find({}).then((result) => {
    response.json(result);
  });
});

app.get("/info", (request, response) => {
  Person.countDocuments({}).then((count) => {
    response.send(
      `<p>Phonebook has info for ${count} people</p>\n<p>${new Date().toString()}</p>`,
    );
  });
});

app.get("/api/persons/:id", (request, response) => {
  Person.findById(request.params.id).then((person) => {
    response.json(person);
  });
  //   const id = request.params.id;
  //   const person = persons.find((person) => person.id === id);

  //   if (person) {
  //     response.json(person);
  //   } else {
  //     response.status(404).end();
  //   }
});

app.delete("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  persons.filter((person) => person.id !== id);

  response.status(204).end();
});

app.post("/api/persons", (request, response) => {
  const body = request.body;

  if (!body.name) {
    return response.status(400).json({ error: "name is missing" });
  } else if (!body.number) {
    return response.status(400).json({ error: "number is missing" });
  }
  // } else if (persons.some((person) => person.name === body.name)) {
  //   return response.status(400).json({ error: "name must be unique" });
  // }

  const person = new Person({
    name: body.name,
    number: body.number,
  });

  // const person = {
  //   id: Math.floor(Math.random() * 1000000).toString(),
  //   name: body.name,
  //   number: body.number,
  // };

  // persons = persons.concat(person);
  // response.json(person);

  person.save().then((savedPerson) => {
    response.json(savedPerson);
    console.log(savedPerson);
  });
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});
