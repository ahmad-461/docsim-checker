export interface Sentence {
  text: string;
  match_score: number;
}

export interface ComparisonResult {
  overall_similarity: number;
  method: 'blended' | 'tfidf_only';
  sentences_a: Sentence[];
  sentences_b: Sentence[];
  remaining?: number;
}

export const sampleDocA = `The Solar System is the gravitationally bound system of the Sun and the objects that orbit it. It formed 4.6 billion years ago from the gravitational collapse of a giant interstellar molecular cloud. The vast majority of the system's mass is in the Sun, with the majority of the remaining mass contained in Jupiter. The four smaller inner planets, Mercury, Venus, Earth, and Mars, are terrestrial planets, being primarily composed of rock and metal. The four outer planets are giant planets, being substantially more massive than the terrestrials. The two largest, Jupiter and Saturn, are gas giants, being composed mainly of hydrogen and helium.`;

export const sampleDocB = `The Solar System consists of the Sun and the objects that move around it due to gravity. It was created about 4.6 billion years ago when a massive cloud in space collapsed. Most of the mass in our system is found within the Sun itself, while Jupiter holds most of what is left. The four smaller inner planets, Mercury, Venus, Earth, and Mars, are terrestrial planets, being primarily composed of rock and metal. The four outer planets are known as giant planets and are much larger than the inner ones. Jupiter and Saturn are the biggest and are called gas giants because they are made mostly of hydrogen and helium.`;

export const sampleResult: ComparisonResult = {
  overall_similarity: 88.5,
  method: 'blended',
  sentences_a: [
    { text: "The Solar System is the gravitationally bound system of the Sun and the objects that orbit it.", match_score: 0.88 },
    { text: "It formed 4.6 billion years ago from the gravitational collapse of a giant interstellar molecular cloud.", match_score: 0.78 },
    { text: "The vast majority of the system's mass is in the Sun, with the majority of the remaining mass contained in Jupiter.", match_score: 0.82 },
    { text: "The four smaller inner planets, Mercury, Venus, Earth, and Mars, are terrestrial planets, being primarily composed of rock and metal.", match_score: 1.0 },
    { text: "The four outer planets are giant planets, being substantially more massive than the terrestrials.", match_score: 0.84 },
    { text: "The two largest, Jupiter and Saturn, are gas giants, being composed mainly of hydrogen and helium.", match_score: 0.9 }
  ],
  sentences_b: [
    { text: "The Solar System consists of the Sun and the objects that move around it due to gravity.", match_score: 0.88 },
    { text: "It was created about 4.6 billion years ago when a massive cloud in space collapsed.", match_score: 0.78 },
    { text: "Most of the mass in our system is found within the Sun itself, while Jupiter holds most of what is left.", match_score: 0.82 },
    { text: "The four smaller inner planets, Mercury, Venus, Earth, and Mars, are terrestrial planets, being primarily composed of rock and metal.", match_score: 1.0 },
    { text: "The four outer planets are known as giant planets and are much larger than the inner ones.", match_score: 0.84 },
    { text: "Jupiter and Saturn are the biggest and are called gas giants because they are made mostly of hydrogen and helium.", match_score: 0.9 }
  ]
};
