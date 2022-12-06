const express = require('express')
const BlockchainController = require('./controllers/BlockchainController')

const app = express()
const PORT = 3000 + Math.round(Math.random() *1000)

app.use(express.json())

const blockchainController = new BlockchainController()

app.use('/blockchain', blockchainController.router)

app.listen(PORT, '0.0.0.0', () => {
    console.log(`blockchain server up and running on PORT: ${PORT}!`)
})