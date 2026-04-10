export const testDatabase = [
  // MODULE 1: The Original Baseline
  {
    id: "mindcheck-full",
    title: "General Cognitive Baseline",
    description: "A comprehensive assessment of visual, auditory, and motor skills.",
    color: "bg-blue-500",
    questions: [
      { id: "q1", type: "VISUAL_NAMING", instruction: "Identify this object.", assetUrl: "https://images.unsplash.com/photo-1614027164847-1b28cfe1df60?auto=format&fit=crop&w=600&q=80", correctAnswer: "lion", points: 2, penalty: -1 },
      { id: "q2", type: "AUDIO_DICTATION", instruction: "Listen and transcribe exactly what you hear.", spokenText: "The quick brown fox jumps over the lazy dog.", correctAnswer: "the quick brown fox jumps over the lazy dog", points: 3, penalty: -1 },
      { id: "q3", type: "MATH_LOGIC", instruction: "Start at 100 and subtract 7. What is the result?", correctAnswer: "93", points: 1, penalty: 0 },
      { id: "q4", type: "VISUAL_NAMING", instruction: "Identify this object.", assetUrl: "https://images.unsplash.com/photo-1584824486509-112e4181ff6b?auto=format&fit=crop&w=600&q=80", correctAnswer: "laptop", points: 1, penalty: -1 },
      { id: "q5", type: "DRAWING", instruction: "Replicate the intersecting pentagons exactly.", assetUrl: "https://placehold.co/400x400/ffffff/000000?text=Draw+Two+Intersecting+Pentagons", needsManualGrading: true }
    ]
  },

  // MODULE 2: The New Executive Function (Stroop & Audio Memory)
  {
    id: "executive-us-standard",
    title: "US Standard Executive Function",
    description: "Modeled after WAIS. Tests inhibitory control and auditory working memory.",
    color: "bg-purple-500",
    questions: [
      { id: "e1", type: "STROOP_TEST", instruction: "Type the COLOR of the ink, NOT the word.", wordText: "YELLOW", hexColor: "#EF4444", correctAnswer: "red", points: 3, penalty: -2 },
      { id: "e2", type: "STROOP_TEST", instruction: "Type the COLOR of the ink, NOT the word.", wordText: "BLUE", hexColor: "#A3E635", correctAnswer: "green", points: 3, penalty: -2 },
      { id: "e3", type: "DIGIT_SPAN", instruction: "Listen to the numbers. Type them BACKWARDS.", spokenText: "2, 4, 7, 9", correctAnswer: "9742", points: 4, penalty: -1 }
    ]
  },

  // MODULE 3: Spatial Dynamics (Brand New)
  {
    id: "spatial-dynamics",
    title: "Spatial & Reaction Dynamics",
    description: "Evaluates short-term visuospatial memory and pattern recall.",
    color: "bg-emerald-500",
    questions: [
      { 
        id: "s1", 
        type: "PATTERN_MEMORY", 
        instruction: "Memorize the glowing tiles. When they hide, click the exact pattern.", 
        targetPattern: [0, 4, 6, 8], 
        points: 5, 
        penalty: -2 
      }
    ]
  },

  // MODULE 4: Dynamic AI Clinical Interview
  {
    id: "ai-semantic",
    title: "Dynamic AI Clinical Interview",
    description: "A real-time, dynamic conversation with an AI neuropsychologist evaluating abstract reasoning.",
    color: "bg-cyan-600",
    questions: [
      { 
        id: "ai1", 
        type: "AI_INTERVIEW",
        points: 5,
        needsManualGrading: false 
      }
    ]
  }
];
