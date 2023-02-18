<template>
  <v-row>
    <v-col class="text-center">
      <img
        src="/devops1.jpg"
        alt="devops"
        class="mb-5"
        style="max-height: 30vh"
      />
      <blockquote class="blockquote" v-if="selectedQuote">
        &#8220;{{ selectedQuote.quote }}&#8221;
        <footer>
          <small>
            <em>&mdash;{{ selectedQuote.owner }}</em>
          </small>
        </footer>
      </blockquote>
    </v-col>
    <v-col cols="12" class="text-center" @click="rollTheDice">
      <v-btn color="info" tile x-large> Get another quote </v-btn>
    </v-col>
  </v-row>
</template>

<script>
export default {
  data() {
    return {
      quotes: [
        {
          quote: 'First, solve the problem. Then, write the code.',
          owner: 'John Johnson',
        },
        {
          quote: 'Coding like poetry should be short and concise.',
          owner: 'Santosh Kalwar',
        },
        {
          quote: 'It’s not a bug; it’s an undocumented feature.',
          owner: 'Anonymous',
        },
        {
          quote: 'Code is like humor. When you have to explain it, it’s bad.',
          owner: 'Cory House',
        },
        {
          quote:
            'Programming today is a race between software engineers striving to build bigger and better idiot-proof programs and the Universe trying to produce bigger and better idiots. So far, the Universe is winning.',
          owner: 'Rick Cook',
        },
        {
          quote:
            'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
          owner: 'Martin Fowler',
        },
        {
          quote: 'Experience is the name everyone gives to their mistakes.',
          owner: 'Oscar Wilde',
        },
        {
          quote:
            'Programming is the art of telling another human being what one wants the computer to do.',
          owner: 'Donald Ervin Knuth',
        },
        {
          quote:
            'No matter which field of work you want to go in, it is of great importance to learn at least one programming language.',
          owner: 'Ram Ray',
        },
        {
          quote:
            'Quality is a product of a conflict between programmers and testers.',
          owner: 'Yegor Bugayenk',
        },
        {
          quote:
            'Everybody should learn to program a computer because it teaches you how to think.',
          owner: 'Steve Jobs',
        },
        {
          quote:
            'I taught myself how to program computers when I was a kid, bought my first computer when I was 10, and sold my first commercial program when I was 12.',
          owner: 'Elon Musk',
        },
        {
          quote:
            'Most good programmers do programming not because they expect to get paid or get adulation by the public, but because it is fun to program.',
          owner: 'Linus Torvalds',
        },
        {
          quote:
            'When I wrote this code, only God and I understood what I did. Now only God knows.',
          owner: 'Anonymous',
        },
        {
          quote: 'Programming is learned by writing programs.',
          owner: 'Brian Kernighan',
        },
        {
          quote:
            'If debugging is the process of removing bugs, then programming must be the process of putting them in.',
          owner: 'Sam Redwine',
        },
        {
          quote: 'Talk is cheap. Show me the code.',
          owner: 'Linus Torvalds',
        },
        {
          quote: 'If, at first, you do not succeed, call it version 1.0',
          owner: 'Khayri R.R. Woulfe',
        },
        {
          quote: 'Computers are fast; developers keep them slow.',
          owner: 'Anonymous',
        },
      ],
      selectedQuote: undefined,
    }
  },
  methods: {
    rollTheDice() {
      const qouteIndex = Math.floor(Math.random() * this.quotes.length)
      this.selectedQuote = this.quotes[qouteIndex]
    },
  },
  mounted() {
    this.rollTheDice()
  },
}
</script>
