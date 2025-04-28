const http = require('http')
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()

app.use(express.json())
app.use(morgan(':method :url :status :response-time ms :body'))
app.use(cors())
const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`)
})

morgan.token('body', (req, res) => {
    return JSON.stringify(req.body)
})

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
]

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/:id', (request, response) => {
    const id = request.params.id 
    const person = persons.find(p => p.id === id)
    person ? response.json(person) : response.status(404).end()
})

app.get('/info', (request, response) => {
    const timestamp = new Date().toString()
    response.send(`
        <div>
            <p>Phonebook has info for ${persons.length} people</p>
            <p>${timestamp}</p>
        </div>
    `)
})

app.post('/api/persons', (request, response) => {
    const body = request.body
    if (!body.name || !body.number) {
        return response.status(400).json({
            error: 'missing information. please make sure both name and number are included.'
        })
    }
    if (persons.find(p => p.name === body.name)) {
        return response.status(400).json({
            error: 'name must be unique'
        })
    }
    const person = {
        name: body.name,
        number: body.number,
        id: generateId()
    }
    persons = persons.concat(person)
    response.json(person)
})

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    persons = persons.filter(p => p.id !== id)
    response.status(204).end()
})

const generateId = () => {
    const maxId = persons.length > 0 ? Math.floor(Math.random() * 100000) : 0
    return String(maxId)
}