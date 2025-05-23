const PORT = process.env.PORT || 3001
const Person = require('./models/person')
const http = require('http')
const express = require('express')
const morgan = require('morgan')
const app = express()

app.use(express.json())
app.use(morgan(':method :url :status :response-time ms :body'))
app.use(express.static('dist'))

app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`)
})

morgan.token('body', (req, res) => {
    return JSON.stringify(req.body)
})

app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
        response.json(persons)
    })
})

app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id)
    .then(person => {
        if (person) {
            response.json(person)
        } else {
            response.status(404).end()
        }
    })
    .catch(error => next(error))
})

app.get('/info', (request, response) => {
    const timestamp = new Date().toString()
    Person.countDocuments().where('name').exists().then(count => {
        response.send(`
        <div>
            <p>Phonebook has info for ${count} people</p>
            <p>${timestamp}</p>
        </div>
        `)
    })
})

app.post('/api/persons', (request, response, next) => {
    const { name, number } = request.body
    if (!name || !number) {
        return response.status(400).json({
            error: 'missing information. please make sure both name and number are included.'
        })
    }

    const person = new Person({
        name: name,
        number: number,
    })

    return person.save()
        .then(returnedPerson => {
            response.json(returnedPerson)
        })
        .catch(error => next(error))

})

app.put('/api/persons/:id', (request, response) => {
    const { name, number } = request.body
    Person.findById(request.params.id)
        .then(person => {
            if (!person) {
                return response.status(404).end()
            }

            person.name = name
            person.number = number
    
            return person.save().then(updatedPerson => {
                response.json(updatedPerson)
            })
        })
})

app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndDelete(request.params.id)
    .then(result => {
        response.status(204).end()
    })
    .catch(error => next(error))
})

const errorHandler = (error, request, response, next) => {
    console.log(error.message)
    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted ID' })
    } else if (error.name === 'ValidationError') {
        return response.status(400).send({ error: error.message })
    }

    next(error)
}

app.use(errorHandler)