var expect = chai.expect;
var assert = chai.assert;

function getUser() {
  return localStorage.getItem("currentUser") || "unknown user";
}

function setUser(username) {
  localStorage.setItem("currentUser", username);
  document.getElementById("username").value = username;
}


function toggleTests() {
  document.getElementById("testconfig").hidden = !document.getElementById(
    "testconfig"
  ).hidden;
}

config.intro &&
  describe(`შესავალი და თავდაპირველი ფუნქციონალის შემოწმება. 
    `, () => {
    it.skip(
      `თუ codesandbox-ზე მუშაობას აპირებთ, ჯგუფის ერთმა წევრმა გააკეთეთ ამის fork და ყველამ იმ ბმულზე იმუშავეთ. რადგან ბევრი ტესტებია, გირჩევთ საიტის ზემოთ სულ მარჯვნივ open in new window ღილაკს დააჭიროთ`
    );
    it.skip(`პროექტის ტესტები დაყოფილია ჯგუფებად. თითოეულ ჯგუფს და ტესტს უწერია, რამდენი ქულაა. თუ ტესტის ტექსტი არის ლურჯი, 
            ე.ი ეს ტესტი არის ინფორმატიული და არაფერს ამოწმებს.`);

    it.skip(`ტესტები, რომლებსაც ქულა არ აწერია არის წინაპირობების შემოწმება. პროექტის საწყის ფაილებში არის იმპლემენტირებული ფუნქციონალი, და ზოგი 
            მათგანი აუცილებელია, რომ უცვლელად მუშაობდეს ახალი ფუნქციონალის დამატებისას (პროექტის დასაწყისში ყველა ეს ტესტი pass მდგომარეობაშია).
            ახალი ფუნქციონალის დატესტვის წინ შემოწმდება, რომ ეს წინაპირობები კვლავ დაკმაყოფილებულია. თუ წინაპირობა ვერ სრულდება, ჯგუფში შემდგომი ტესტები ვერ იმუშავებს. ამ ჯგუფშიც არის წინაპირობის ტესტები.
            ეს არის ფუნქციონალი, რომელიც ყველა ჯგუფს ჭირდება.`);

    it.skip(`თადაპირველი კონფიგურაციით ყოველ გადატვირთვაზე თავიდან 
            ეშვება ტესტები (1 წამის შემდეგ). კონფიგურაციის შეცვლა კუთხეში ღილაკზე დაჭერით, 
            ან ალტერნატიულად tests.html გვერდის გახსნით`);

    it.skip(`ახალი ტიპის ტესტები ისეა განაწილობული, რომ ყველა თითო პირობას ამოწმებდეს. ამის გამო
            ტესტის ჩაჭრის დროს უმეტეს შემთხვევაში არ არის რელევანტური ყუთში დაწერილი error message და შეგიძლიათ
            ყურადღება არ მიაქციოთ.`);

    it.skip(`ფუნქციონალის ნაწილი მოითხოვს ნასწავლი მასალის გამოყენებას ახალი გზით. ზოგი 
            მოითხოვს საჭირო მასალის დამოუკიდებლად მოძიებას და სწავლას, ან მეტ ფიქრს ამოხსნისთვის. 
            ასეთი დავალებები აღნიშნულია *-ით`);

    it.skip(`news feed ტესტები ყველა პოსტს შლის. თუ გინდათ პოსტები ტესტების ბოლოს არ წაიშალოს, 
            გამორთეთ news feed კონფიგურაციიდან`);

    // it.skip(``)
    const tester = new Tester();

    describe(`პოსტები`, () => {
      const tester = new Tester();
      it(`ელემენტები: დოკუმენტს უნდა ქონდეს პოსტების ელემენტი, რომლის id 
                არის ${testConfig.postsContainerId}.

                ${testConfig.postsContainerId} ელემენტში არსებობს textarea, რომლის id არის 
                ${testConfig.postInputId}.

                ${testConfig.postsContainerId} ელემენტში არსებობს ღილაკი, რომლის
                id არის ${testConfig.newPostButton}

                ${testConfig.postsContainerId} ელემენტში დაპოსტილი პოსტებისთვის არსებობს div ელემენტი,
                რომლის id არის ${testConfig.postsFeed}

                `, (done) => {
        tester.getApp();
        assert.isNotNull(tester.getPostsInput());
        assert.isNotNull(tester.getPostButton());
        assert.isNotNull(tester.getPostsFeed());
        done();
      });

      it(`ამ ღილაკზე დაჭერის შემდეგ პოსტის ველში შეყვანილი ტექსტი უნდა 
                დაემატოს პოსტების ფიდში (დაპოსტილი პოსტები). 
                თითოეული პოსტისთვის შექმენით ახალი ელემენტი, რომელსაც ექნება კლასი 
                ${testConfig.post}. აქ შეგიძლიათ სხვადასხვა ელემენტები იყოს. მთავარია, 
                უშუალოდ პოსტის ტექსტის div-ს ქონდეს კლასი ${testConfig.postText}`, (done) => {
        tester.postPost().then((res) => {
          assert.equal(res.typed, res.result);
          done();
        });
      });
    });
  });

config.posts &&
  describe(`2 ქულა (+1) პოსტები`, () => {
    const tester = new Tester();
    describe(`ui/ux დამატებები`, () => {
      it(`1 ქულა. ახალი პოსტი არ დაიდოს, თუ ${testConfig.postText} ველში ტექსტი არ არის შეყვანილი`, () => {
        tester.getApp();
        return tester.postPost("abc").then((res1) => {
          return tester.postPost("").then((res) => {
            expect(res.result).equal(res1.typed);
          });
        });
      });
      it(`1 ქულა. ახალი პოსტის გამოქვეყნების შემდეგ ${testConfig.postText} ველი გასუფთავდეს`, () => {
        return tester.postPost("abc").then(() => {
          const elem = document.getElementById(testConfig.postText);
          expect(elem.value).eql("");
        });
      });
      it(`1 ქულა. * თუ პოსტს არ აქვს არცერთი ლაიქი, ${testConfig.postLikesText} 
            და ${testConfig.postLikesCount} ელემენტებში არაფერი ეწეროს. ერთი დალაიქების შემდეგ
            ${testConfig.postLikesText} ელემენტში უნდა ეწეროს likes, 
            ${testConfig.postLikesCount} ელემენტში 1`, () => {
        return tester
          .postPost("likes count")
          .then(() => {
            const { likesCount, likesText } = tester.getPostLikes();
            expect(likesCount.innerText).eql("");
            expect(likesText.innerText).eql("");
            return tester.likePost();
          })
          .then(() => {
            const { likesCount, likesText } = tester.getPostLikes();
            expect(likesCount.innerText).eql("1");
            expect(likesText.innerText).eql("likes");
          });
      });
    });

/*
    describe(`პოსტის მოწონება`, () => {
      it.skip(`ამ ტესტის მუშაობისთვის აუცილებელია უცვლელი იყოს
         getUser() და setUser() ფუნქცია`);
      it(`2 ქულა. თუ ერთი მომხმარებელი მეორედ დააჭერს მოწონების ღილაკს, 
            მისი მოწონება წაიშლება (ანუ მოწონებების რაოდენობა 
            შემცირდება)`, () => {
        setUser("user1");
        return tester
          .postPost()
          .then(() => tester.likePost())
          .then(() => {
            const { likesCount } = tester.getPostLikes();
            expect(likesCount.innerText).eql("1");
            setUser("user2");
            return tester.likePost();
          })
          .then(() => {
            const { likesCount } = tester.getPostLikes();
            expect(likesCount.innerText).eql("2");
            return tester.likePost();
          })
          .then(() => {
            const { likesCount } = tester.getPostLikes();
            expect(likesCount.innerText).eql("1");
            return tester.likePost();
          });
      });
    });

*/
/*
    describe(`თარიღის შენახვა *`, () => {
      it(`1 ქულა. პოსტის ობიექტს აქვს ატრიბუტი date, რომლის
            მნიშვნელობაც არის post ღილაკზე დაჭერის დრო`, () => {
        const postedDate = new Date();
        return tester.postPost("date").then((res) => {
          const posts = new Database("posts");
          const post = posts.get("text", res.typed);
          const postDate = new Date(post.date);
          expect(postDate - postedDate < 5).equal(true);
        });
      });
      it(`1 ქულა.  ფიდში ${testConfig.post} ელემენტს 
            დაუმატეთ ახალი div, რომლის კლასი არის ${testConfig.postDate}. 
            მისი მნიშვნელობა უნდა იყოს დაპოსტვის დღე (მხოლოდ თარიღი)`, () => {
        return tester.postPost("date number").then(() => {
          const date = new Date();
          const lastPost = tester.getLastPostElem();
          const dateElem = lastPost.querySelector(`div.${testConfig.postDate}`);
          expect(dateElem.innerText).eql(date.getDate().toString());
        });
      });
    });

      */
  });


config.comments && describe(`2 ქულა. კომენტარები`, () => {
    const tester = new Tester()

    describe(`საწყისი კოდი`, () => {
        it(`ელემენტები: პოსტს უნდა ქონდეს კომენტარების ელემენტი, რომლის კლასი 
          არის ${testConfig.commentsContainerId}.

          ${testConfig.commentsContainerId} ელემენტში არსებობს textarea, რომლის კლასი არის 
          ${testConfig.commentInputId}.

          ${testConfig.commentsContainerId} ელემენტში არსებობს ღილაკი, რომლის
          კლასი არის ${testConfig.newCommentButton}

          ${testConfig.commentsContainerId} ელემენტში დაპოსტილი კომენტარებისთვის არსებობს div ელემენტი,
          რომლის კლასი არის ${testConfig.commentsFeed}`, () => {
            tester.getApp()
            return tester.createNewPost()
            .then((post) => {
                expect(post, '\nახალი პოსტი ვერ დაიდო.').to.not.be.a('null')
                assert.isNotNull(tester.getCommentsInput(), `${message} ${testConfig.commentInputId} არ არსებობს${message_after}`)
                assert.isNotNull(tester.getCommentButton(), `${message} ${testConfig.newCommentButton} არ არსებობს${message_after}`)
                assert.isNotNull(tester.getCommentsFeed(), `${message} ${testConfig.commentsFeed} არ არსებობს${message_after}`)
            })
        })

        it(`ამ ღილაკზე დაჭერის შემდეგ კომენტარის ველში შეყვანილი ტექსტი უნდა 
          დაემატოს კომენტარების ფიდში (დაპოსტილი კომენტარები). 
          თითოეული კომენტარისთვის შექმენით ახალი ელემენტი, რომელსაც ექნება კლასი 
          ${testConfig.comment}. აქ შეგიძლიათ სხვადასხვა ელემენტები იყოს. მთავარია, 
          უშუალოდ კომენტარის ტექსტის div-ს ქონდეს კლასი ${testConfig.commentText}`, (done) => {
            tester.postComment()
            .then((res) => {
                assert.equal(res.typed, res.result,)
                done()
            })

        })
    })
    /*
    describe(`მონაცემთა შენახვა`, () => {
        it(`3 ქულა. პოსტის ობიექტს დაუმატეთ ატრიბუტი კომენტარები და იქ შეინახეთ ხოლმე
            პოსტის კომენტარი. კომენტარი უბრალოდ სტრინგად არ შეინახოთ. შექმენით ახალი ობიექტი, 
            რომელსაც ექნება ატრიბუტი text და იქ იქნება კომენტარის ტექსტი. ახალი დაპოსტილი
            კომენტარი უნდა შეინახოს ბაზაში შესაბამის პოსტში`, () => {
                tester.getApp()
                return tester.postPost().then(postRes => {
                    return tester.postComment('savecomment') 
                    .then(res => {
                        const post = posts.get('text', postRes.typed)
                        const comments = post.comments
                        expect(post.comments[0].text).equal(res.typed)
                    })
                })
            })
    })
    */

    describe(`კომენტარის წაშლა`, () => {
        it(`${testConfig.comment} ელემენტში არსებობს ღილაკი, რომლის
            კლასი არის ${testConfig.commentDeleteButton}`, () => {
             return tester.createNewPost().then(postRes => {
                return tester.postComment('deletecomment')
                .then(commentRes => {
                    assert.isNotNull(tester.getCommentDeleteButton())
                })
            })
         })
        it(`2 ქულა. ღილაკზე დაჭერის შემდეგ ${testConfig.comment} ელემენტი უნდა წაიშალოს`, () => {
            return tester.deleteComment().then(() => {
                assert.isNull(tester.getLastCommentElem())
            })  
        })
        /*
        it(`3.5 ქულა. * კომენტარი ასევე წაშლილი უნდა იყოს ბაზიდან`, () => {
            const postsArr = posts.getAll()
            expect(postsArr[postsArr.length - 1].comments).length(0)
        })
        */
    })

})

/*
config.news_feed &&
  describe(`2 ქულა. news feed`, () => {
    // it.skip(``)
    it.skip(`ეს ფუნქციონალი საჭიროებს პოსტებში თარიღის შენახვას.`);
    it.skip(`ეს ფუნქციონალი გულისხმობს, რომ გვერდის ჩატვირთვისას წინა პოსტების
        გამოჩენა ხდება displayAllPosts() ფუნქციის გამოძახებით. ტესტი წაშლის 
        შენახულ პოსტებს, დაამატებს სპეციალურად ამ ტესტისთვის განსაზღვრულ პოსტებს ბაზაში 
        წაშლის ${testConfig.postsFeed}-ში მყოფ ყველა ელემენტს და თავიდან გამოიძახებს
        displayAllPosts() ფუნქციას`);
    function getDate(day, month, year, time) {
      return new Date(
        `${month} ${day} ${year} ${time} GMT+0400 (Georgia Standard Time)`
      );
    }
    it(`2 ქულა. * ორმაგი ფილტრი. პოსტები უნდა იყოს დალაგებული 
        თარიღის მიხედვით (ახალი პოსტები გამოჩნდეს პირველი). 
        თუ ორი პოსტი ერთ თარიღს არის დაპოსტილი (თვე, წელი, დღე), 
        მაშინ დალაგდეს კომენტარის რაოდენობის და ლაიქების 
        ჯამის მიხედვით (კლებადი). გაითვალისწინეთ, რომ სორტირებულ
        სიაში ელემენტების მიმდევრობა უნდა იყოს პირიქით (რომ ფიდში 
        სწორად გამოჩნდეს)`, () => {
      const tester = new Tester();
      tester.getApp();
      posts.clear();
      tester.getPostsFeed().innerHTML = "";
      const post1 = posts.create({
        text: "post1 " + randInt(),
        date: getDate(1, 1, 2020, "13:00"),
        likes: ["user1", "user2"],
        comments: [
          { text: "comment " + randInt() },
          { text: "comment " + randInt() }
        ]
      });
      const post2 = posts.create({
        text: "post1 " + randInt(),
        date: getDate(1, 1, 2020, "14:45"),
        likes: ["user1", "user2"],
        comments: [
          { text: "comment " + randInt() },
          { text: "comment " + randInt() },
          { text: "comment " + randInt() }
        ]
      });
      const post3 = posts.create({
        text: "post1 " + randInt(),
        date: getDate(3, 2, 2020, "13:00"),
        likes: [],
        comments: []
      });
      const sorted = displayAllPosts();
      expect(sorted[2].id).equal(post3.id);
      expect(sorted[1].id).equal(post2.id);
      expect(sorted[0].id).equal(post1.id);
    });
  });
*/
config.login_register &&
  describe(`3 ქულა (+1) რეგისტრაცია და 2 ქულა ავტორიზაცია`, () => {
    it.skip(
      `იხილეთ login.html და register.html გვერდები (addres bar-ში ბმულს მიუწერეთ /register.html)`
    );
  });


const testResults = []

function testRequest() {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", 'http://localhost:3939', true);

    //Send the proper header information along with the request
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

    xhr.onreadystatechange = function () { // Call a function when the state changes.
        if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
            // Request finished. Do processing here.
            console.log(xhr.response)
        }
    }
    xhr.send(JSON.stringify(testResults));
// xhr.send(new Int8Array());
// xhr.send(document);
}

function getScore(test) {
    const match = test.title.match(/(.*) ქულა/)
    try {
		 console.log(match[1])
        return Number(match[1])
    } catch(e) { return null }
}

setTimeout(() => {
    mocha.run()
        .on('pass', function (test) {
            testResults.push({
                passed: true,
                score: getScore(test),
                message: test.title
            })
        })
        .on('fail', function (test, err) {
            testResults.push({
                passed: false,
                message: test.title,
                score: getScore(test),
                failed: err.message
            })
        })
        .on('end', testRequest)
})
