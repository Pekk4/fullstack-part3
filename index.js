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

app.get('/info', (_, response, next) => {
  Record.find({})
    .then(records => {
      response.send(
        `<p>Phonebook has info for ${records.length} people</p>`+
        `<p>${new Date()}</p>`
      )
    })
    .catch(error => next(error))
})

app.get('/api/persons', (_, response, next) => {
  Record.find({})
    .then(records => {
      response.json(records)
    })
    .catch(error => next(error))
})

app.get('/api/persons/:id', (request, response, next) => {
  Record.findById(request.params.id)
    .then(result => {
      response.json(result)
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  Record.findByIdAndDelete(request.params.id)
    .then(result => {
      console.log(result)
      response.status(204).end()
    })
    .catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
  const body = request.body

  if (!body.name) {
    return response.status(400).json({
      error: 'name missing'
    })
  } else if (!body.number) {
    return response.status(400).json({
      error: 'number missing'
    })
  }

  const person = new Record({
    name: body.name,
    number: body.number,
  })

  person.save()
    .then(savedRecord => {
      response.json(savedRecord)
    })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body

  const person = {
    name: body.name,
    number: body.number,
  }

  Record.findByIdAndUpdate(request.params.id, person, { new: true })
    .then(updatedRecord => {
      response.json(updatedRecord)
    })
    .catch(error => next(error))
})

const unknownEndpoint = (_, response) => {
  response.status(404).send({ error: 'Unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, _, response, next) => {
  console.log(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'Malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
