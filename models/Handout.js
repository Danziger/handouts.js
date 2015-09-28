module.exports = function(mongoose) {
	return mongoose.model('Handout',
		new mongoose.Schema({
			subject: String,
			title: String,
			d0: Date,
			df: Date,
			description: String
		}, {
			collection: 'handouts'
		})
	);
}