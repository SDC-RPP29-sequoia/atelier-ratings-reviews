const characteristicSchema = mongoose.Schema({
  id: {type: Number, required: true},
  name: {type: String, required: false},
  value: {type: String, required: false}
});
module.exports.characteristicSchema = characteristicSchema;

const Characteristic = mongoose.model('Characteristic', characteristicSchema);
module.exports.Characteristic = Characteristic;