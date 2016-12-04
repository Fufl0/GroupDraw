const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;


const GalleryImageSchema = new mongoose.Schema({
  img : { type: Buffer, contentType: String, required: true },
  title : { type: String, required: true },
  dateCreated : { type: Date, default: Date.now },
  createdByUser : { type: String },
  createdInRoom : { type: String }
});


//register model
mongoose.model('GalleryImage', GalleryImageSchema);
