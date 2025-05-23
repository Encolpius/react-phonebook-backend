const mongoose = require('mongoose')
if (process.argv.length < 3) {
    console.log('Please give a password as an argument.')
    process.exit(1)
}

const password = process.argv[2]
const url = process.env.MONGODB_URI.replace(/\${password}/g, password)

mongoose.set('strictQuery', false)
console.log('Connecting to', url)
mongoose.connect(url)
    .then(result => {
        console.log('Now connected to MongoDB')
    })
    .catch(error => {
        console.log('Error connecting to MongoDB:', error.message)
    })

const personSchema = new mongoose.Schema({
    name: {
        type: String,
        minLength: [3, 'Name must be at least 3 characters long.'],
        required: true
    },
    number: {
        type: String,
        minLength: 8,
        required: true,
        validate: {
            validator: function(v) {
                return /^(\d{2}|\d{3})-\d{4}/.test(v);
            },
            message: props => `${props.value} is not a valid phone number!`
        }
    },
})

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Person', personSchema)
const Person = mongoose.model('person', personSchema)