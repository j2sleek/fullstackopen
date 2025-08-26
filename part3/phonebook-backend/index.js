const express = require('express');
const morgan = require('morgan');

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

let persons = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
];

app.get('/api/persons', (request, response) => {
    response.json(persons);
});

app.get('/info', (request, response) => {
    const reqDate = new Date();
    response.send(`<p>Phonebook has info for ${persons.length} people.</p><p>${reqDate}</p>`);
})

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id;
    const person = persons.find(person => person.id === id);

    if (person) {
        response.send(person);
    } else {
        response.status(404).end();
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id;
    persons = persons.filter(person => person.id !== id);

    response.status(204).end();
})

app.post('/api/persons', (request, response) => {
    const person = request.body;
    const id = Math.floor(Math.random() * 1000000);
    person.id = String(id);

    if (!person || !person.name || !person.number || person.name === '' || person.number === '') {
        return response.status(400).json({
            error: 'Incorrect request object'
        })
    } 

    if (persons.map(person => person.name).includes(person.name)) {
        return response.status(400).json({
            error: 'name must be unique'
        })
    }

    persons = persons.concat(person);

    response.json(person);
})

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
})