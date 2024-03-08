export const parsePracticeQuestionsString = (questionsString) => {
    const result = [];
    const questions = questionsString.split('question:').slice(1);
    
    for(const question of questions){
      var questionObj = {};
      
      // question substring
      const questionEndIndex = question.indexOf('a:');
      const questionSubstring = question.substring(0, questionEndIndex);
      questionObj['question'] = questionSubstring;
      
      // option a
      const optionASubstring = question.substring(question.indexOf('a:'), question.indexOf('b:'));
      questionObj['option_a'] = optionASubstring.substring(optionASubstring.indexOf('a:') + 2,);
      
      // option b
      const optionBSubstring = question.substring(question.indexOf('b:'), question.indexOf('c:'));
      questionObj['option_b'] = optionBSubstring.substring(optionBSubstring.indexOf('b:') + 2,);
      
      // option c
      const optionCSubstring = question.substring(question.indexOf('c:'), question.indexOf('d:'));
      questionObj['option_c'] = optionCSubstring.substring(optionCSubstring.indexOf('c:') + 2,);
      
      // option d
      const optionDSubstring = question.substring(question.indexOf('d:'), question.indexOf('answer:'));
      questionObj['option_d'] = optionDSubstring.substring(optionDSubstring.indexOf('d:') + 2,);
      
      // answer
      const answerSubstring = question.substring(question.indexOf('answer:') + 7);
      questionObj['answer'] = answerSubstring.trim().substring(0, 1);
      
      result.push(questionObj);
    }
    return result;
};