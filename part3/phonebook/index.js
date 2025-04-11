require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const app = express();
const Contact = require("./models/contact");

app.use(express.static("dist"));
app.use(express.json());
morgan.token("body", (req) => {
  return JSON.stringify(req.body);
});
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);

app.get("/api/persons", (request, response) => {
  Contact.find({}).then((result) => response.json(result));
});

app.get("/api/persons/:id", (request, response, next) => {
  const id = request.params.id;
  Contact.findById(id)
    .then((contact) => {
      if (contact) {
        return response.json(contact);
      } else {
        return response.status(404).end();
      }
    })
    .catch((error) => next(error));
});

app.get("/info", (request, response) => {
  const requestTime = new Date();
  Contact.find({})
    .then((contacts) => {
      return response.send(`<p>Phonebook has info for ${contacts.length} people</p>
      <p>${requestTime}</p>`);
    })
    .catch((error) => next(error));
});

app.delete("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  Contact.findByIdAndDelete(id)
    .then((_) => response.status(204).end())
    .catch((error) => next(error));
});

app.put("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  let body = request.body;
  let number = body.number;
  let name = body.name;

  if (!number || !name) {
    return response
      .status(400)
      .send({ error: "bad request missing information" });
  }

  Contact.findById(id)
    .then((contact) => {
      if (!contact) {
        return response.status(404).end();
      }
      contact.name = name;
      contact.number = number;
      return contact
        .save()
        .then((updatedContact) => response.json(updatedContact));
    })
    .catch((error) => next(error));
});

app.post("/api/persons/", (request, response) => {
  let body = request.body;
  let number = body.number;
  let name = body.name;

  if (!number || !name) {
    return response
      .status(400)
      .send({ error: "bad request missing information" });
  }

  const contact = new Contact({
    name: name,
    number: number,
  });

  contact
    .save()
    .then((contact) => {
      response.json(contact);
    })
    .catch((error) => next(error));
});

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } 

  next(error)
}

app.use(errorHandler)
