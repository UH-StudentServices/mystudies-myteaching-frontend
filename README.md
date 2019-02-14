# MyStudies/MyTeaching Frontend Application

## Prerequisites
 - Node.js v8.9.4 or greater installed
 - npm@5.6.0 or greater installed

In addition, the following localhost alias configuration is also needed (in /etc/hosts on Linux/macOS):

```
127.0.0.1       local.student.helsinki.fi
127.0.0.1       local.teacher.helsinki.fi
```

## Running locally

### Prerequisites
 - Backend server running, see [mystudies-myteaching-backend](https://github.com/UH-StudentServices/mystudies-myteaching-backend)
 
### Obar integration

If backend server has obar.baseUrl ([local config](https://github.com/UH-StudentServices/mystudies-myteaching-backend/blob/develop/src/main/resources/config/application-local-dev.yml)) 
configured obar must also be running locally; see [obar](https://version.helsinki.fi/OPADev/obar) documentation. Default configuration requires using 
[simulated server environment](https://version.helsinki.fi/OPADev/obar/blob/master/ansible/README.md).

### Install dependencies

`npm install`

### Start frontend application

`npm run dev`

This will open the app in a new browser window at http://local.student.helsinki.fi:3000.

### HTTPS

#### Generate required keys

`npm run genkeys`


#### Start dev server
`npm run dev:https`

