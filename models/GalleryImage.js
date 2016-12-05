const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;


const GalleryImageSchema = new mongoose.Schema({
  img : { data: Buffer, contentType: String },
  title : { type: String },
  author : { type: String },
  dateCreated : { type: Date, default: Date.now },
  createdInRoom : { type: String }
});


//register model
mongoose.model('GalleryImage', GalleryImageSchema);
