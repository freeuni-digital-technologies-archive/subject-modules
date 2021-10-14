# Classroom api

wrapper for classroom in google library. modified from [this example](https://developers.google.com/classroom/quickstart/nodejs) 

## instructions
Get `credentials.json` from google console or file from the example url (**select web app**). Save it in the project root directory.

For the first run, you'll need to follow the link and authorize the app.



### student list
In order to save amount of requests for each individual student (email, etc.), the library expects `students.json` file in the root directory. You can generate it using `yarn getlist`:

example:
```bash 
yarn getlist -c "შესავალი ციფრულ ტექნოლოგიებში 2020 შემოდგომა"
```

full list of aguments:
```
  -p, --path     directory to store students.json       [string] [default: "./"]
  -c, --class    class name                                  [string] [required]
```

### Download student work for a homework
You can use `yarn download` command to download all the student work for a specific homework:

examples:
```bash 
yarn download --class "შესავალი ციფრულ ტექნოლოგიებში 2020 შემოდგომა" --path "./myHWdir" --hw 'დავალება 1' # ./myHWdir/code.c
yarn download -d -c "შესავალი ციფრულ ტექნოლოგიებში 2020 შემოდგომა" -p "./myHWdir" -h 'დავალება 1' # ./myHWdir/mailprefix/code.c
yarn download -c "შესავალი ციფრულ ტექნოლოგიებში 2020 შემოდგომა" -p ./testdir -h "დავალება 6 webapp1" -d --autoextract --skipExisting --students=abcd19,efgh18,ijkl18 # ./testdir/mailprefix/code.c
```


full list of aguments:
```
  -c, --class              class name                        [string] [required]
  -h, --hw                 name of homework on the classroom [string] [required]
  -p, --path               directory to store homework       [string] [required]
  -d, --subdirs            Create separate subdirectories for each student
                                                                       [boolean]
  -l, --lates              download late submissions as well           [boolean]
      --autoextract, --ae  automatically extract all files in a zip in the same
                           folder                                      [boolean]
  -s, --skipExisting       skip downloading files that already exist
                                                                       [boolean]
      --students           specific list of mail prefixes to download
                           if not specified script will download all homeworks
                                                                        [string]
```


## API
You can also run the functions from `src/classroom-api.ts` individually. Easiest way is to edit the `test/classroom-api.test.ts` file and run it with `yarn test`
```javascript
const ClassroomApi = require('./lib/classroom-api') // 
// or if using typescript
import { ClassroomApi } from './src/classroom-api'

ClassroomApi
            .findClass('შესავალი ციფრულ ტექნოლოგიებში')
            .then(classroom => classroom.listCourseWork())
            .then(submissions => console.log(submissions))
```


### Notes 
When downloading multiple files, it's necessary to throttle the requests on your side, otherwise request limit error will be thrown.


### Mailer 
You are also free to use mailer.ts exported functions `sendEmails` and `sendEmail`
