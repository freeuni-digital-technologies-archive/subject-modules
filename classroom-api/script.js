const className = 'შესავალი ციფრულ ტექნოლოგიებში 2020 შემოდგომა' // fill this
const { sendEmail } = require('./lib/mailer')
const fs = require('fs')
// downloadStudentList(className).then(profiles => fs.writeFileSync('students.json', JSON.stringify(profiles, null, '\t')))
//const sendEmail = (to :string, subject :string, text :string, callback :any, attachments :any) => {

sendEmail('ttopu18@freeuni.edu.ge', 'test script', 'test text')

//THIS CODE IS JUST A SAMPLE OF sendEmail