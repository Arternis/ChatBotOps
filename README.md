# Chat Ops

Use chat bot to make job more automative

## Architecture

CHAT APP <=> LUIS service <=> BOT frameowrk <=> NodeJS or Python CI or others services

## Enviroment variable

* Port used for bot service  
export PORT=1234

* bot frameowork auth infomation
export MICROSOFT_APP_ID="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxx"  
export MICROSOFT_APP_SECRET="xxxxxxxxxxxxxxxxxxxxxxx"

* nature language process service, training intents and entities
export LUIS_MODEL_URL="https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/xxxxxxxx-xxxx-4bf8-xxxx-330661b20932?subscription-key=xxxxxa3932c5461e87a4b470xxxxxx8&verbose=false&q="  

* Local jenkins server
export LOCAL_JENKINS_SERVER=http://your_local_address/jenkins/job/  
export LOCAL_JENKINS_ID=your_name  
export LOCAL_JENKINS_TOKEN=xxxxxxxxx  

* Remote Jenkins server
export JENKINS_SERVER=http://buildpass.htc.com.tw:8080/job/  
export JENKINS_ID=your_name  
export JENKINS_TOKEN=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

* git server
export GERRIT_SERVER=http://git.htc.com:8081/  
export GERRIT_ID=your_name  
export GERRIT_TOKEN=xxxxxxxx

* Cloud services  
export GOOGLE_SHORTURL_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

## 4 Task Levels
* NodeJS - run javascript directly, 
    - codepoint, shorturl
* Python Script - run local script, private jobs or need security
    - pythontest, gerrit services
* Local Jenkins - run in local CI services, heavy job need cost some time, can send message back to bot if necessary (need store the session address)
    - jenkinstest, triggerbuild
* Remote Jenkins - run in remote CI services

## Setup
1. regiter a bot on [microsoft bot framework](https://dev.botframework.com/), get id and password
that is MICROSOFT_APP_ID and MICROSOFT_APP_SECRET  
2. (Optional) Traing nature language [Microsoft LUIS](https://www.luis.ai/home/index), define multiple intents and entities, then parse them in your bot.  
3. Setup Local Jenkins service or python files or some services and make sure them will work fine.  
4. Install modules (npm install) and run bot (node app.js) 
5. use ngrok service to share local port (ex: https://2x8302OU.ngrok.io), and setup bot entry point to (https://2x8302OU.ngrok.io/api/messages), testing with skype or webchat and make sure it can work fine.
