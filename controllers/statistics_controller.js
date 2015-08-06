var models = require('../models/models.js');

var statistics = {quizes: 0, comments: 0, average:0, uncommentedQuizes:0, commentedQuizes:0};

// GET /quizes/statistics
exports.show = function(req, res, next) {

	models.Quiz.count().then(function(quizes) {
		statistics.quizes = quizes;
		return models.Comment.count({ where: { publicado: true } });		
	})
	.then(function(comments) {
		statistics.comments = comments;
		statistics.average = (statistics.comments / statistics.quizes).toFixed(2);
		return models.Quiz.count({ distinct: 'id', 
								  include: [{ model: models.Comment, required: true, where: { publicado: true }}]
									});								 
	})
	.then(function(withComment) {
		statistics.commentedQuizes = withComment;
		statistics.uncommentedQuizes = statistics.quizes - statistics.commentedQuizes;
	}).finally(function(){
		res.render('quizes/statistics', {statistics: statistics, errors: []});
	});

};
