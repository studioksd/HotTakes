const Sauce = require('../models/sauce');
var fs = require('fs');

exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;
  delete sauceObject._userId;
  const sauce = new Sauce({
    ...sauceObject,
    userId: req.auth.userId,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  });

  sauce.save()
    .then(() => res.status(201).json({ message: 'Objet enregistré !' }))
    .catch(error => res.status(400).json({ error }));
};

exports.modifySauce = (req, res, next) => {
  const sauceObject = req.file ? {
    ...JSON.parse(req.body.sauce),
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  } : { ...req.body };

  delete sauceObject._userId;
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
      if (sauce.userId != req.auth.userId) {
        res.status(401).json({ message: 'Non autorisé' })
      } else {
        const filename = sauce.imageUrl.split('/images/')[1];
        fs.unlink('images/' + filename, () => {
        Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
          .then(() => res.status(200).json({ message: 'Objet modifié !' }))
          .catch(error => res.status(400).json({ error }));})
      }
    })
    .catch(error => res.status(400).json({ error }));
};

exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
  .then(sauce => {
    const filename = sauce.imageUrl.split('/images/')[1];
    fs.unlink('images/' + filename, () => {
      Sauce.deleteOne({ _id: req.params.id })
      .then(() => res.status(200).json({ message: 'Objet supprimé !' }))
      .catch(error => res.status(400).json({ error }));
    })
  })
  .catch(error => res.status(400).json({ error }));
};

exports.getAllSauces = (req, res, next) => {
  Sauce.find()
    .then(sauces => res.status(200).json(sauces))
    .catch(error => res.status(400).json({ error }));
};

exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(404).json({ error }));
};

exports.likeSauce = (req, res, next) => {
  const userId = req.body.userId;
  console.log(req.body);
  Sauce.findOne({ _id: req.params.id })
    .then(objet => {
      console.log(objet);
      if (!objet.usersLiked.includes(userId) && req.body.like === 1) {
        console.log('condition met for like');
        Sauce.updateOne(
          { _id: req.params.id },
          {
            $inc: { likes: 1 },
            $push: { usersLiked: userId }
          }
        )
          .then(() => res.status(201).json({ message: "Sauce likée" }))
          .catch((error) => res.status(400).json({ error }));
      } 
      else if (!objet.usersDisliked.includes(userId) && req.body.like === -1) {
        console.log('condition met for dislike');
        Sauce.updateOne(
          { _id: req.params.id },
          {
            $inc: { dislikes: 1 },
            $push: { usersDisliked: userId }
          }
        )
          .then(() => res.status(201).json({ message: "Sauce likée" }))
          .catch((error) => res.status(400).json({ error }));
      } 
      else if (objet.usersLiked.includes(userId) && req.body.like === 0) {
        console.log('condition met for unlike');
        Sauce.updateOne(
          { _id: req.params.id },
          {
            $inc: { likes: -1 },
            $pull: { usersLiked: userId }
          }
        )
          .then(() => res.status(201).json({ message: "Annulation de like/dislike" }))
          .catch((error) => res.status(400).json({ error }));
      } 
      else if (objet.usersDisliked.includes(userId) && req.body.like === 0) {
        console.log('condition met for undislike');
        Sauce.updateOne(
          { _id: req.params.id },
          {
            $inc: { dislikes: -1 },
            $pull: { usersDisliked: userId }
          }
        )
          .then(() => res.status(201).json({ message: "Annulation de dislike" }))
          .catch((error) => res.status(400).json({ error }));
      }
    })
    .catch((error) => res.status(400).json({ error }));
};
