# Slat-Edu
A full stack mern application with AI monitoring system for ineuron challenge

## Steps to run the code in your local system.
#### 1) Create .env file in exam-proctor-be and add the below mentioned
    
    DATABASE=*Your mongo db connection string*/*db name*

    DATABASE_FILE=*Your mongo db connection string*

    DATABASE_FILE_DB=*db name*

    SECRET=secret

    PORT=8000

    API=http://face:5000/

    KEY_ID = *your razerpay key*

    KEY_SECRET = *your razerpay key*

#### 2) Create .env file in exam-proctor-be-lb1 and add the below mentioned

    DATABASE=*Your mongo db connection string*/*db name*

    DATABASE_FILE=*Your mongo db connection string*

    DATABASE_FILE_DB=*db name*

    SECRET=secret

    PORT=8001

    API=http://face:5000/

    KEY_ID = *your razerpay key*

    KEY_SECRET = *your razerpay key*

#### 3) Create .env file in exam-proctor-fe and add the below mentioned

    REACT_APP_BACKEND=http://localhost/api

    KEY_ID = *your razerpay key*

#### 4) Change "Caddyfile.production" to "Caddyfile.local" in docker-compose.yml


## set up:

(Please install docker and docker-compose before runing the next steps)
### From the main directory run the below comman

    docker-compose build

    docker-compose up 

#### Once the application is up or running in port 80 hit the below API to load the categories

      http://localhost/api/seeding/categories
      
## For more details refer below links:

    Documents - https://github.com/yashwantram97/Slat-documents
    
 

