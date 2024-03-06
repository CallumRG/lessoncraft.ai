import OpenAI from 'openai';
import { makeLessonDescriptionPrompt, makeSectionBodyPrompt, makePracticeQuestionsPrompt } from './prompt';

const runOpenAIThread = async (openai, thread, assistant) => {
    // Run the thread with lessoncraft assistant
    const run = await openai.beta.threads.runs.create(
        thread.id,
        { assistant_id: assistant.id }
    );

    // Fetch the run status
    let runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);

    // Wait for the run to finish
    while (runStatus.status === "in_progress" || runStatus.status === "queued") {
        await new Promise((resolve) => setTimeout(resolve, 5000));
        runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);
    }

    // Fetch the messages in the thread
    const messageList = await openai.beta.threads.messages.list(thread.id);

    // Choose the latest message from the assistant
    const lastMessage = messageList.data.filter((message) => message.run_id === run.id && message.role === "assistant").pop();

    // return the text response of the latest message
    return lastMessage.content[0]["text"].value;
}

const MakeOpenAIAssistantCall = async (lessonTitle, topics, selectedFile, statusCallback) => {
    // Set up openAI API connection
    const openai = new OpenAI({
        apiKey: process.env.REACT_APP_OPENAI_API_KEY,
        dangerouslyAllowBrowser: true,
    });

    // Upload selected file to openAI
    statusCallback('Uploading Context');
    const file = await openai.files.create({
        file: selectedFile,
        purpose: "assistants",
    });

    // Retrieve lessoncraft assistant
    statusCallback('Retrieving lessoncraft assistant');
    const assistant = await openai.beta.assistants.retrieve('asst_Vc4ANHMRkhJnlQ4U6W1RkSs2');

    // Create new thread
    statusCallback('Starting a thread');
    const thread = await openai.beta.threads.create();

    // Lesson description generation prompt
    statusCallback('Generating lesson description...');
    const lessonDescriptionPrompt = makeLessonDescriptionPrompt(lessonTitle, topics, selectedFile.name);
    await openai.beta.threads.messages.create(
        thread.id,
        { 
            role: "user", 
            content: lessonDescriptionPrompt, 
            file_ids: [file.id] 
        }
    );
    const lessonDescription = await runOpenAIThread(openai, thread, assistant);

    // Section bodies generation prompt
    var sections = [];
    for(const topic of topics){
        if(topic !== ""){
            statusCallback(`Generating content for ${topic}...`);
            const topicBodyPrompt = makeSectionBodyPrompt(topic);
            await openai.beta.threads.messages.create(
                thread.id,
                { 
                    role: "user", 
                    content: topicBodyPrompt, 
                    file_ids: [file.id] 
                }
            );
            const topicBody = await runOpenAIThread(openai, thread, assistant);
            sections.push(topicBody);
        }
    }

    // Lesson practice questions generation prompt
    statusCallback('Generating practice questions...');
    const practiceQuestionsPrompt = makePracticeQuestionsPrompt();
    await openai.beta.threads.messages.create(
        thread.id,
        { 
            role: "user", 
            content: practiceQuestionsPrompt, 
            file_ids: [file.id] 
        }
    );
    const practiceQuestions = await runOpenAIThread(openai, thread, assistant);

    // Delete the selected file from OpenAI Storage
    statusCallback('Cleaning up');
    await openai.files.del(
        file.id
    );

    // return complete lesson
    const lesson = {
        description: lessonDescription,
        sections: sections,
        practice_questions: practiceQuestions
    }
    return lesson;
}

export default MakeOpenAIAssistantCall;