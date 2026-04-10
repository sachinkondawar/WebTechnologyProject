export const mockTest = {
  id: "cognitive-001",
  title: "Comprehensive Cognitive Assessment",
  questions: [
    {
      id: "q1",
      type: "VISUAL_NAMING",
      instruction: "Please type the name of the animal shown below.",
      assetUrl: "/assets/visual-naming/lion.png",
      color: "bg-yellow-300"
    },
    {
      id: "q2",
      type: "AUDIO_DICTATION",
      instruction: "Listen carefully and type the exact sentence you hear.",
      assetUrl: "/assets/audio-dictation/fox.ogg",
      color: "bg-blue-300"
    },
    {
      id: "q3",
      type: "DRAWING",
      instruction: "Draw the intersecting pentagons exactly as shown.",
      assetUrl: "/assets/drawing-refs/pentagons.png",
      color: "bg-pink-300"
    }
  ]
};