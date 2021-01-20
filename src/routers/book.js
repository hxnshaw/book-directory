const express = require('express')
const router = new express.Router()
const Book = require('../models/book')
const auth = require('../middleware/auth')

router.post('/books', auth, async (req, res) => {
    const book = new Book({
        ...req.body,
        owner: req.user._id
    })
    try {
        await book.save()
        res.status(201).send(book)

    } catch (e) {
        res.status(400).send()
    }
})


//access individual books
router.get('/books/:id', auth, async (req, res) => {
    try {
        const book = await Book.findOne({ id: req.params.id, owner: req.user._id })
        if (!book) {
            res.status(404).send()
        }
        res.send(book)
    } catch (e) {
        res.status(500).send()
    }
})

//sorting,pagination and filtering
//GET/books?limit=10&skip=0
//GET/books?sortBy=createdAt:desc
router.get('/books', auth, async (req, res) => {
    const match = {}
    const sort = {}
    if (req.query.title) {
        match.title = req.query.title === 'true'
    }
    if (req.query.sortBy) {
        const parts = req.query.sortBy.split(':')
    }
    sort[parts[0]] = parts[1] === 'desc' ? -1 : 1

    try {
        await req.user.populate({
            path: 'books',
            limit: parseInt(req.query.limit),
            skip: parseInt(req.query.skip)
        }).exePopulate()
        res.send(req.user.tasks)
    } catch (e) {
        res.status(500).send()
    }
})

//update book title and summary
router.patch('books/:id', auth, async (req, res) => {
    //check if the user is updating the correct items
    //convert the object to  string so you can access the individual properties
    const updates = Object.keys(req.body)
    const allowedUpdates = ['title', 'summary']
    const isValidOperation = updates.every(update => allowedUpdates.includes(update))

    if (!isValidOperation) {
        res.status(400).send({ error: "Invalid update attempted" })
    }
    try {
        const book = await Book.findOne({ _id: req.params.id, owner: req.user._id })
        if (!book) {
            res.status(404).send()
        }
        updates.forEach(update => book[update] = req.body[update]) //Update the books
    } catch (e) {
        res.status(400).send()
    }
})

//delete books
router.delete('/books/:id', auth, async (req, res) => {
    try {
        const book = await Book.findOneAndDelete({ _id: req.params.id, owner: req.user._id })
        if (!book) {
            res.status(404).send()
        }
        res.send(book)
        console.log(req.params.id)
        console.log(req.user._id)

    } catch (e) {
        res.status(400).send()
        console.log(e)
    }
})

module.exports = router