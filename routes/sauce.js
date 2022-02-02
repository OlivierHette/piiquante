const express = require('express')
const router = express.Router()

const auth = require('../middleware/auth')
const multer = require('../middleware/multer-config')

const sauceCtrl = require('../controllers/sauce')

router.post('/', auth, multer, sauceCtrl.createSauce)
// router.post('/:id/like', auth, sauceCtrl.likeSauce)
// router.put('/:id', auth, sauceCtrl.modifySauce)
// router.delete('/:id', auth, sauceCtrl.deleteSauce)

// router.get('/', auth, sauceCtrl.getAllSauces)
// router.get('/:id', auth, sauceCtrl.getSauce)
/* TODO : Créer les controllers pour chaque routes*/

module.exports = router
