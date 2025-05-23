const mongoose = require('mongoose')
if (process.argv.length < 3) {
    console.log('give password as argument')
    process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://fullstack:${password}@helsinki-react.puxbf5q.mongodb.net/personApp?retryWrites=true&w=majority&appName=Helsinki-React`

mongoose.set('strictQuery', false)

mongoose.connect(url)

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length < 4) {
    console.log('Phonebook: ')
    Person.find({}).then(result => {
        result.forEach(person => {
            console.log(`name: ${person.name}, number: ${person.number}`)
        })
        mongoose.connection.close()
    })    
} else {
    const person = new Person({
        name: process.argv[3],
        number: process.argv[4],
    })

    person.save() .then(result => {
        console.log(`added ${process.argv[3]} with number ${process.argv[4]} to the phonebook`)
        mongoose.connection.close()
    })
}