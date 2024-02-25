require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const app = express()
const Record = require('./models/record')

morgan.token('content', request => (JSON.stringify(request.body)))
const format =
  ':method :url :status :res[content-length] - ' +
  ':response-time ms :content'

app.use(express.static('./puhelinluettelo/build'))
app.use(express.json())
app.use(morgan(format))

app.get('/info', (_, response) => {
  response.send(
    `<p>Phonebook has info for ${persons.length} people</p>`+
    `<p>${new Date()}</p>`
  )
})

app.get('/api/persons', (_, response) => {
  Record.find({}).then(records => {
    response.json(records)
  })
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(person => person.id === id)

  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)

  persons = persons.filter(person => person.id !== id)

  response.status(204).end()
})

app.post('/api/persons', (request, response) => {
  const body = request.body
  const match = persons.find(person => person.name === body.name)

  if (!body.name) {
    return response.status(400).json({
      error: 'name missing'
    })
  } else if (!body.number) {
    return response.status(400).json({
      error: 'number missing'
    })
  }
  if (match !== undefined) {
    return response.status(409).json({
      error: 'name must be unique'
    })
  }

  const person = {
    name: body.name,
    number: body.number,
    id: Math.floor(Math.random() * 100000),
  }

  persons = persons.concat(person)

  response.json(person)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})