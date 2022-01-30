const fs = require('fs')
const path = require('path')
const existingProjects = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../../../data/projects.json'), 'utf-8'))

module.exports = {
    id: 'groupProject',
    classroomName: 'პროექტი',
    deadline: '2022-01-31',
    // this is data dir where projects will be saved
    testFileName: '../../../data/',
    module: 'groupProject',
    emailTemplates: {
        invalid: submission => {
            const errorsWord = submission.results.length > 1 ? 'შეცდომები' : 'შეცდომა'
            const errorsBody = submission.results.map(r => `
                    <p><strong>${r.details}</strong></p>
                `).join('\n')
            return `
                <p>
                    შენი ატვირთული ფაილები არ არის ვალიდური და პროექტი <strong>არ არის მიღებული</strong>.
                    იმისთვის, რომ პროექტში შეფასება მიიღო, გამოასწორე ეს ${errorsWord}:
                </p>
                
                <div>
                    ${errorsBody}
                </div>
            `
        },
        passed: submission => {
            const group = existingProjects.find(p => p.members.includes(submission.emailId))
            return `
            <p>პროექტის ფაილები მიღებულია, მაგრამ <strong>რომ არ გაგინულდეს</strong> გადაამოწმე ეს ინფორმაცია:</p>
            
            <p>შენი გუნდის სახელია ${group.name}. გუნდის წევრები: ${group.members.join(', ')}. რომელიმე წევრს თუ არ 
            აუტვირთავს, არ არის პრობლემა, ავტომატურად დაემატება ატვირთვისას. თუ რომელიმე წევრმა ატვირთა და აქ არ ჩანს,
            ე.ი. გუნდის სახელი არასწორად უწერია, ჩაასწოროს და თავიდან ატვირთოს. ყველა წევრს ერთი და იგივე სახელი უნდა
            ქონდეს დაწერილი team-name-ში</p>
            
            <p>თუ რომელიმე გუნდელს ვერ ცნობ, წევრებმა შეცვალეთ გუნდის სახელი და თავიდან ატვირთეთ</p>
          
            <p>პროექტში ცვლილებების შეტანის შემთხვევაში გუნდის  ყველა წევრმა თავიდან უნდა ატვირთოს ფაილები. სამწუხაროდ
            არადეტერმინისტულია რომელი წევრის ფაილები მომივა შესწორებისას და ამიტომ არის საჭირო ყველას ბოლო ვერსია
             გქონდეთ ატვირთული, ბოდიშს გიხდი დისკომფორტისთვის</p>
             
             <p>შეფასებას მიიღებ დედლაინიდან 2 კვირის განმავლობაში.</p>
            
        `        }

    }
}
