import { LoremIpsum } from "lorem-ipsum";
const lorem = new LoremIpsum({
  wordsPerSentence: {
    min: 3,
    max: 8,
  },
});

if (process.argv.length < 3) {
  console.error("Number of posts to generate was not given");
} else {
  const n = parseInt(process.argv[2]);

  if (isNaN(n)) {
    console.error("The given argument is not a number");
  } else {
    const responses = [];

    for (let i = 0; i < n; i++) {
      responses.push(uploadRandPost());
    }

    Promise.all(responses).then((arr) => {
      const successes = arr.reduce((acc, curr) => (curr ? acc + 1 : acc), 0);
      console.log(`${successes} requests were successfull`);
    });
  }
}

async function uploadRandPost() {
  const data = new FormData();
  data.append(
    "author",
    lorem.generateWords(2).split(" ").join("").slice(0, 20)
  );
  data.append("title", lorem.generateSentences(1));
  data.append("content", lorem.generateParagraphs(3));

  const res = await fetch("http://localhost:3000/api/post", {
    method: "post",
    body: data,
  });

  if (!res.ok) {
    console.error((await res.json()).msg);
  }

  return res.ok;
}
