const express = require("express");
const morgan = require("morgan")
const app = express();

app.use(express.json());
morgan.token('body', req => {
    return JSON.stringify(req.body)
  })
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

let persons = [
  {
    id: "1",
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: "2",
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: "3",
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: "4",
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.get("/api/persons", (request, response) => {
  response.json(persons);
});

app.get("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  const person = persons.find((p) => p.id === id);
  if (!person) {
    return response.status(404).send({ error: "Person not found" });
  }
  return response.json(person);
});

app.get("/info", (request, response) => {
  const requestTime = new Date();
  response.send(`<p>Phonebook has info for ${persons.length} people</p>
        <p>${requestTime}</p>`);
});

app.delete("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  persons = persons.filter((p) => p.id !== id);
  response.status(204).end();
});

app.post("/api/persons/", (request, response) => {
  let body = request.body;
  let phone = body.phone;
  let name = body.name;

  if (!phone || !name) {
    return response
      .status(400)
      .send({ error: "bad request missing information" });
  }
  if (persons.find((p) => p.name === name)) {
    return response.status(400).send({ error: "name must be unique" });
  }

  const id = Math.floor(Math.random() * 10000);
  const newEntry = {
    phone: phone,
    name: name,
    id: id,
  };
  persons = [...persons, newEntry];
  response.json(newEntry);
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
