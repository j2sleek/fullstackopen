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

// let persons = [
//     { 
//       "id": "1",
//       "name": "Arto Hellas", 
//       "number": "040-123456"
//     },
//     { 
//       "id": "2",
//       "name": "Ada Lovelace", 
//       "number": "39-44-5323523"
//     },
//     { 
//       "id": "3",
//       "name": "Dan Abramov", 
//       "number": "12-43-234345"
//     },
//     { 
//       "id": "4",
//       "name": "Mary Poppendieck", 
//       "number": "39-23-6423122"
//     }
// ];

app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
        response.json(persons);

    })
});

app.get('/info', (request, response) => {
    const reqDate = new Date();
    response.send(`<p>Phonebook has info for ${persons.length} people.</p><p>${reqDate}</p>`);
})

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id;
    Person.findById(id).then(person => {
        response.json(person);
    });
})

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id;
    persons = persons.filter(person => person.id !== id);

    response.status(204).end();
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

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
})