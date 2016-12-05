const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;


const GalleryImageSchema = new mongoose.Schema({
  imgURI : { type: String, required: true, default: '/img/blank-user.jpg' },
  title : { type: String, required: true },
  author : { type: String, required: true },
  dateCreated : { type: Date, default: Date.now },
  createdInRoom : { type: String }
});


//register model
mongoose.model('GalleryImage', GalleryImageSchema);
