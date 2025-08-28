require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const Person = require('./models/person');

morgan.token('body', function getBody (req) {
    if (req.method === 'POST') {
        return JSON.stringify({
            name: req.body.name,
            number: req.body.number
        });
    }
})

const app = express();
app.use(express.static('dist'));

app.use(express.json());
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));

app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
        response.json(persons);

    })
});

app.get('/info', (request, response) => {
    const reqDate = new Date();
    Person.find({}).then(persons => {
        response.send(`<p>Phonebook has info for ${persons.length} people.</p><p>${reqDate}</p>`);
    })
})

app.get('/api/persons/:id', (request, response, next) => {
    const id = request.params.id;
    Person.findById(id)
      .then(person => {
        if (person) {
            response.json(person);
        } else {
            response.status(404).end();
        }
      })
      .catch(error => next(error));
})

app.delete('/api/persons/:id', (request, response, next) => {
    const id = request.params.id;
    Person.findByIdAndDelete(id)
      .then(result => {
        response.status(204).end();
      })
      .catch(error => next(error));

    
})

app.post('/api/persons', (request, response) => {
    const person = new Person(request.body);

    if (!person || !person.name || !person.number || person.name === '' || person.number === '') {
        return response.status(400).json({
            error: 'Incorrect request object'
        })
    } 

    person.save().then(savedPerson => {
        response.json(savedPerson);
    })
})

app.put('/api/persons/:id', (request, response, next) => {
    const id = request.params.id;
    const { name, number } = request.body;

    Person.findById(id)
      .then(person => {
        if (!person) {
            return response.status(404).end();
        }

        person.name = name;
        person.number = number;

        return person.save().then(updatedPerson => {
            response.json(updatedPerson);
        })
      })
      .catch(error => next(error));
})

const errorHandler = (error, request, response, next) => {
    console.error(error.message);

    if ( error.name === 'CastError' ) {
        return response.status(400).send({ error: 'malformatted id'});
    }

    next(error);
}

app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
})