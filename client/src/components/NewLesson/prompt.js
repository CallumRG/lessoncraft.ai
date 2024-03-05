export const makePrompt = (title, topics, filename) => {
    const sectionsList = topics.map((topic, index) => `"${topic}"`).join(', ');

    return `-I want a lesson plan generated from the textbook PDF I've attached, ${filename}. 

    -The title of the lesson is "${title}".
    
    -Ensure that the lesson provides a key concepts summary. make sure that each key concept is a bullet point with 1 to 5 words. 
    
    -The sections you generate the lesson plan for should be: ${sectionsList}.
    
    -Use the textbook to gather context for each section.
    -Please explain each section to me in great detail, in a LOGICAL ORDER. I don't understand any of it yet.
    -Include every important definition, equation, or formula that is required to understand each topic.
    
    -Make sure that each section has a title. 
    -Make sure that each section has an intro that is 1-2 sentences.
    -It is MANDATORY that the body of each section is 250 WORDS. There should NEVER be a section body with less than 250 words.
    
    -Make sure that you provide a lesson description. make sure that the lesson description is between 50 and 100 words. 
    
    -Ensure that all practice questions are multiple choice with a question, 3-4 options, and a correct answer.
    -Each section MUST have 2 practice questions.
    -DO NOT use complex formulas/symbols (only simple addition, subtraction, multiplication, division).
    
    -Provide me with an EXAMPLE QUESTION and DETAILED steps to the solution IN THE BODY as well.
    
    -you MUST output the lesson plan as a string with '\\n' as a separator between parts of the lesson
    -Please don’t write anything in your reply other than this String.
    -DO NOT output any additional text outside of the String.
    -You should ONLY RESPOND ONCE to this message.`
}