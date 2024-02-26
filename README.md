[![Open in Codespaces](https://classroom.github.com/assets/launch-codespace-7f7980b617ed060a017424585567c406b6ee15c891e84e1186181d67ecf80aa0.svg)](https://classroom.github.com/open-in-codespaces?assignment_repo_id=13367613)
# Lessoncraft

Lessoncraft is a brand new platform that allows users to build and share learning material with the power of AI. Just drag and drop large pdfs of content that you want to learn(or teach) and we will build an easy-to-understand lesson plan for you! You can even group lessons together into larger modules and courses for more detailed learning.

## Environment Setup
__In order to use the app, you will need two '.env' files:__ One for frontend Firebase configuration, and another for backend MySQL configuration.

1. Make a '.env' file in the client folder
2. Paste the following into it:

REACT_APP_FB_APIKEY=AIzaSyCJyzT46EZf9EyZHB-GjORWSZnYL1YL9JM  
REACT_APP_FB_AUTHDOMAIN=localhost  
REACT_APP_FB_PROJECTID=lessoncraft-9a4e1  
REACT_APP_FB_STORAGEBUCKET=lessoncraft-9a4e1.appspot.com  
REACT_APP_FB_MESSAGINGSENDERID=335959693872  
REACT_APP_FB_APPID=1:335959693872:web:8b2c491be6fdaf34f16bf5  
REACT_APP_FB_MEASUREMENTID=G-EQVNRY4EEJ  

3. Make another '.env' file in the root directory
4. Paste the following into it:

DB_USER=m32steve  
DB_HOST=ec2-3-137-65-169.us-east-2.compute.amazonaws.com  
DB_PASSWORD=MSCI342  
DB_SCHEMA=m32steve  

## Sample User For Login

email: test@test.test
password: Testing123
