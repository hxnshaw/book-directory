const express = require('express')
require('./db/mongoose')
const app = express()
const userRouter = require('./routers/user')
const bookRouter = require('./routers/book')


const port = process.env.PORT || 5000

app.use(express.json())
app.use(userRouter)
app.use(bookRouter)

app.listen(port, () => {
    console.log(`Server is up on ${port}`)
})