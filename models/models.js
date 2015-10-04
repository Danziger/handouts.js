module.exports = function(mongoose) {

	var subjectSchemaDefinition = {
		abbr: String,
		name: String
	};

	var subjectSchema = new mongoose.Schema(subjectSchemaDefinition, {
		collection: 'subjects'
	});

	var handoutSchema = new mongoose.Schema({
		subject: subjectSchemaDefinition,
		title: String,
		d0: Date,
		df: Date,
		description: String
	}, {
		collection: 'handouts'
	});

	return {
		Subject: mongoose.model('Subject', subjectSchema),
		Handout: mongoose.model('Handout', handoutSchema)
	};
}