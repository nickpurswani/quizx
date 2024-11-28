function evaluateQuiz(responses) {
    const totalQuestions = responses.length;
    const correctAnswers = responses.filter((r) => r.isCorrect).length;
  
    const score = (correctAnswers / totalQuestions) * 100;
    const topicsMissed = {};
    // const easy=1,mid=2,hard=4; future marking now every question marked same weight
    responses.forEach((response) => {
      if (!response.isCorrect) {
        const topic = response.topic;
        topicsMissed[topic] = (topicsMissed[topic] || 0) + 1;
      }
    });
  
    // Improvement suggestions
    const suggestions = Object.keys(topicsMissed).map((topic) => ({
      topic,
      missed: topicsMissed[topic],
    }));
  
    return {
      score,
      totalQuestions,
      correctAnswers,
      suggestions,
    };
  }
  
  module.exports = evaluateQuiz;
  