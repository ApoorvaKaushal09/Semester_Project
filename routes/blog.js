const express = require('express')
const router = express.Router()
const path = require('path')
// const { collection } = require('../modules/user')

router.get('/', (req,res) => {
    res.render("home", {route : '/'})
})
// router.get('/flats', (req,res) => {
//     res.render("flats", {route : 'flats'})
    
// })
router.get('/sell', (req,res) => {
    res.render("sell", {route : 'sell'})
   
})

// router

// router.po st

module.exports = router;