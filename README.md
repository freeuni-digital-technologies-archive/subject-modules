# subject-modules 
ამ გვერდზე არის მთავარი მიმოხილვა საგნის ყველა ნაწილის

## საჭირო ანგარიშები
ასისტენტი/ლექტორი დასამატებელია პროექტზე/კურსზე ამ პლათფორმებზე
- github
- google classroom
- codehs (courses > click `...` > settings > scroll down)
- google console (project > permissions > add member)



All in one project for all digital technologies modules. 

## Requirements

1. node + npm installed
2. yarn installed 

## Setting up workspace

Clone main repo
```
git clone https://github.com/freeuni-digital-technologies/subject-modules
```

You'll need to set up github with ssh keys(since github disabled password login).
Links that might help: https://docs.github.com/en/github/authenticating-to-github/connecting-to-github-with-ssh

Clone all module repos with `fetch.sh` script
```
cd subject-modules
./fetch.sh
```

Link all the modules together with yarn workspace
```
yarn
```

After this run build command in relevant modules:
```
cd classroom-api
yarn build

cd ../
cd SOME_OTHER_MODULE
yarn build
```

მოკლე აღწერა მოდულების(ასევე ამ მიმდევრობით შეგიძლიათ დაბილდვა):

* classroom-api - გუგლის კლასრუმის ჯავასკრიპის ბიბლიოთეკაზე დაშენებული ლეიერი შედარებით მარტივად გამოსაყენებელი ფუნქციებით. 
	* ასევე შეიცავს მეილის დაგზავნის ფუნქციებსაც. 
* jskarel - კარელის პროგრამების სიმულაციის/გაშვების ბიბლიოთეკა
* codehskarel-tester - აქვს ერთადერთი public ფუნქცია testSubmission რომელიც იღებს კარელის პროგამას და ტესტ ფაილს. უშვებს ამ ტესტს და აბრუნებს შედეგს. გამოყენების მაგალითები `test/`-ში არის. დავალების ტესტები რეალურად module-karel-ის `resources/`-ში ცხვორობს. 
* module-karel - ეს მოდული კრავს რეალურად ყველაფერს. იწერს ყველა სტუდენტის ამოხსნებს, უშვებს ყველას codehskarel-tester-ით resources/-ში არსებული ტესტებით და საბოლოოდ შედეგებს ინახავს `src/runs.ts`-ით.(data ფოლდერში შეინახავს რომლის დაკონფიგურირება ბოლოსკენ წერია.)
* website-tester - იდეურად იგივე რაც codehskarel-tester ოღონდ ჯს-ის დავალებებისთვის
* module-js - იდეურად იგივე რაც module-karel ოღონდ ჯს-ის დავალებებისთვის. (კოდის დიდი ნაწილი მეორდება :) ჯერ კიდევ... )
* peer-review - ეშვება ფინალური პროექტის დედლაინის შემდეგ. იწერს ყველა დავალებას; ყველა სტუდენტს უძებნის ზუსტად n პროექტს შესაფასებლად. notify-ს ნაწილი ტვირთავს ყველა პროექტს დრაივზე და უგზავნის შემფასებლებს ლინკებს მეილად.
* peer-review-grader - module-js-ის მსგავსი კლასი უბრალოდ სტუდენტების შეფასებების მიხედვით წერს ქულებს. 
* dt-utils - მემგონი აღარ არის საჭირო?! :)

## Adding new module
Create repo at `freeuni-digital-technologies/my-new-module`

Add "my-new-module" in package.json's "workspaces" property. 

run:
```
./fetch.sh
yarn
```



# Testing Submissions Locally

## Google API Credentials:
### Generate credentials.json


Generate by following this(with email that is associated with course google classroom):
ცოტა საჩალიჩოა და მომწერე რორამე. 

https://developers.google.com/workspace/guides/create-credentials#desktop

Put credentials.json in classrom-api/

Might be helpful if you want to upload file to server. 
```bash
scp ./credentials.json someuser@123.123.123.123:/home/someuser/
```

### Get student list (FOR NOW REQURIED. `getlist` ALSO NEEDS TO BE RERUN IF STUDENTS ARE BEING ADDED TO CLASSROOM)

```bash
cd classroom-api
yarn build
yarn getlist -p ./ -c "შესავალი ციფრულ ტექნოლოგიებში 2021 გაზაფხული"
```
If run first time this will ask you to follow a link to generate token.json. Ask me if you have problems. 

### Create `data` folder

* Create data folder anwhere and create `submissions` folder inside.
* Copy data folder path to `module-karel/src/runs.ts`. 
```js
...
const data_path = `/home/khokho/work/dt/guide/subject-modules/data`
...
```

### Test Karel hw1
Build module and all its dependencies. 
```bash
cd jskarel
yarn build
cd ../codehskarel-tester
yarn build
cd ../module-karel
yarn build
```
#### Run HW1 Tests
```bash
cd module-karel
yarn start --hw hw1
```
Logs and Homeworks will all be inside `data` folder.
To check what emails would be sent you can run:
```bash
yarn notify --hw hw1 --trial true
```

## Sending emails

TODO
```
