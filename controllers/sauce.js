const { error } = require('console')
const fs = require('fs')
const Sauce = require('../models/Sauce')

exports.getAllSauces = (req, res, next) => {
    Sauce.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json({ error }))
}

exports.getSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(404).json({ error }))
}

exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce)
    delete sauceObject._id
    const sauce = new Sauce ({
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get('host')}/image/${req.file.filename}`,
        likes: 0,
        dislike: 0,
        usersLiked: '',
        usersDisliked: '',
    })
    sauce.save()
        .then(() => res.status(201).json( { message: 'Sauce created' } ))
        .catch(error => res.status(400).json({ error }))
}

exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ? { 
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/image/${req.file.filename}`,
     } : { ...req.body }
    Sauce.updateOne( { _id: req.params.id }, { ...sauceObject, _id: req.params.id })
        .then(() => res.status(200).json( { message: 'Object modify !'}))
        .catch(error => res.status(400).json({ error }))
}

exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            if(!sauce) {
                return res.status(404).json({ error: new Error('Object not found !') })
            }
            if(sauce.userId !== req.auth.userId) {
                return res.status(401).json({ error: new Error('Request not authorize !') })
            }
            const filename = sauce.imageUrl.split('/image/')[1]
            fs.unlink(`image/${filename}`, () => {
                Sauce.deleteOne({ _id: req.params.id })
                    .then(() => res.status(200).json({ message: 'Object deleted !'}))
                    .catch(error => res.status(400).json({ error }))
            })
        })
        .catch(error => res.status(500).json({ error }))
}