// workouts.js
// Expanded list of common gym exercises, grouped by category.
// Each workout includes description + snippet for preview mode,
// and a videoUrl for embedding short demo clips.

export const workouts = [
// Chest
{
  name: "Bench Press",
  category: "Chest",
  description: "The bench press is a foundational compound movement that primarily targets the chest, shoulders, and triceps. Performed lying flat on a bench, you lower the barbell to mid‑chest under control and then press it upward until arms are extended. Keep your feet planted firmly on the floor, shoulder blades retracted against the bench, and maintain a stable torso without excessive arching. This setup ensures maximum chest activation while protecting your shoulders and lower back.",
  videoUrl: "youtube.com/watch?v=t3f2L7NRRUY",
    videoStart: 10, // seconds
  videoEnd: 50    // seconds
},
  {
    name: "Incline Bench Press",
    category: "Chest",
    description: "The incline bench press emphasizes the upper portion of the chest while also engaging the shoulders and triceps. Performed on a bench set at a 30–45° angle, you lower the barbell or dumbbells slowly to the upper chest, keeping elbows under the wrists and forearms vertical. Maintain a firm foot drive into the floor, retract your shoulder blades against the bench, and avoid flaring the elbows excessively. Press the weight upward in a controlled path until arms are extended, pausing briefly at the top to stabilize before the next rep. This variation builds upper chest thickness and contributes to a balanced, well‑developed torso.",
    videoUrl: "/assets/videos/inclinebenchpress.mp4"
  },
  {
    name: "Decline Bench Press",
    category: "Chest",
    description: "Emphasizes the lower chest using a decline bench angle.",
    snippet: "Control the descent; don’t bounce the bar off your chest.",
    videoUrl: "/assets/videos/decline-bench-press.mp4"
  },
  {
    name: "Dumbbell Bench Press",
    category: "Chest",
    description: "A free‑weight press with dumbbells for a greater range of motion.",
    snippet: "Squeeze dumbbells slightly inward at the top for better contraction.",
    videoUrl: "/assets/videos/dumbbell-bench-press.mp4"
  },
  {
    name: "Dumbbell Fly",
    category: "Chest",
    description: "An isolation move that stretches and contracts the chest using dumbbells.",
    snippet: "Keep a soft bend in elbows and open wide without overstretching.",
    videoUrl: "/assets/videos/dumbbell-fly.mp4"
  },
  {
    name: "Incline Dumbbell Fly",
    category: "Chest",
    description: "Fly movement on an incline to focus on upper chest fibers.",
    snippet: "Control the bottom position; avoid letting elbows drop too low.",
    videoUrl: "/assets/videos/incline-dumbbell-fly.mp4"
  },
  {
    name: "Chest Press Machine",
    category: "Chest",
    description: "A guided machine press providing stability and controlled load.",
    snippet: "Set seat height so handles align with mid‑chest.",
    videoUrl: "/assets/videos/chest-press-machine.mp4"
  },
  {
    name: "Push-Up",
    category: "Chest",
    description: "A bodyweight press targeting chest, shoulders, and triceps.",
    snippet: "Keep your body in a straight line; don’t let hips sag.",
    videoUrl: "/assets/videos/push-up.mp4"
  },
  {
    name: "Cable Crossover",
    category: "Chest",
    description: "Cable fly from high or mid pulleys targeting inner and lower chest.",
    snippet: "Cross hands slightly at the bottom and squeeze the chest.",
    videoUrl: "/assets/videos/cable-crossover.mp4"
  },

  // Back
  {
    name: "Pull-Up",
    category: "Back",
    description: "Vertical pulling bodyweight exercise targeting lats and upper back.",
    snippet: "Pull chest to bar and avoid kipping for strict reps.",
    videoUrl: "/assets/videos/pull-up.mp4"
  },
  {
    name: "Chin-Up",
    category: "Back",
    description: "Underhand grip pull emphasizing biceps and lower lats.",
    snippet: "Keep elbows close; drive them down toward your ribs.",
    videoUrl: "/assets/videos/chin-up.mp4"
  },
  {
    name: "Lat Pulldown (Wide Grip)",
    category: "Back",
    description: "Machine pulldown with wide grip focusing on upper lats.",
    snippet: "Pull to the upper chest; don’t pull behind the neck.",
    videoUrl: "/assets/videos/lat-pulldown-wide.mp4"
  },
  {
    name: "Lat Pulldown (Close Grip)",
    category: "Back",
    description: "Close grip variation emphasizing lower lats and mid‑back.",
    snippet: "Keep torso upright and squeeze shoulder blades together.",
    videoUrl: "/assets/videos/lat-pulldown-close.mp4"
  },
  {
    name: "Seated Row",
    category: "Back",
    description: "Horizontal cable row targeting mid‑back and rhomboids.",
    snippet: "Pull to your sternum and avoid leaning back excessively.",
    videoUrl: "/assets/videos/seated-row.mp4"
  },
  {
    name: "Barbell Row",
    category: "Back",
    description: "Bent‑over row building back thickness and posterior chain strength.",
    snippet: "Keep a flat back; pull toward lower chest or upper belly.",
    videoUrl: "/assets/videos/barbell-row.mp4"
  },
  {
    name: "Dumbbell Row",
    category: "Back",
    description: "Single‑arm row with dumbbells for unilateral lat engagement.",
    snippet: "Square your shoulders; row in a straight path.",
    videoUrl: "/assets/videos/dumbbell-row.mp4"
  },
  {
    name: "T-Bar Row",
    category: "Back",
    description: "Heavy row using a T‑bar setup to load the mid‑back.",
    snippet: "Drive elbows behind you and keep chest up.",
    videoUrl: "/assets/videos/tbar-row.mp4"
  },
  {
    name: "Face Pull",
    category: "Back",
    description: "Cable pull to face level targeting rear delts and upper traps.",
    snippet: "Lead with elbows high; keep wrists neutral.",
    videoUrl: "/assets/videos/face-pull.mp4"
  },
  {
    name: "Straight-Arm Pulldown",
    category: "Back",
    description: "Lat isolation with straight arms, focusing on shoulder extension.",
    snippet: "Hinge at shoulders; keep arms straight without locking elbows.",
    videoUrl: "/assets/videos/straight-arm-pulldown.mp4"
  },
  {
    name: "Rowing Machine",
    category: "Back",
    description: "Cardio modality simulating rowing; builds endurance and posterior chain patterning.",
    snippet: "Leg drive first, then hip swing, then arm pull; reverse on recovery.",
    videoUrl: "/assets/videos/rowing-machine.mp4"
  },

  // Shoulders
  {
    name: "Overhead Press",
    category: "Shoulders",
    description: "Pressing weight overhead to work deltoids and stabilizers.",
    snippet: "Brace your core and avoid excessive lumbar arching.",
    videoUrl: "/assets/videos/overhead-press.mp4"
  },
  {
    name: "Military Press",
    category: "Shoulders",
    description: "Strict overhead press with feet together increasing stability demand.",
    snippet: "Squeeze glutes and keep rib cage down.",
    videoUrl: "/assets/videos/military-press.mp4"
  },
  {
    name: "Arnold Press",
    category: "Shoulders",
    description: "Dumbbell press rotating palms from inward to outward during the movement.",
    snippet: "Rotate smoothly and control the lowering phase.",
    videoUrl: "/assets/videos/arnold-press.mp4"
  },
  {
    name: "Lateral Raise",
    category: "Shoulders",
    description: "Raises arms to the side to target lateral deltoids.",
    snippet: "Lead with elbows; stop at shoulder height.",
    videoUrl: "/assets/videos/lateral-raise.mp4"
  },
  {
    name: "Front Raise",
    category: "Shoulders",
    description: "Raises arms forward to work anterior delts.",
    snippet: "Lift to eye level and control the descent.",
    videoUrl: "/assets/videos/front-raise.mp4"
  },
  {
    name: "Rear Delt Fly",
    category: "Shoulders",
    description: "Bent‑over fly focusing on rear delts and scapular retraction.",
    snippet: "Push elbows out and squeeze between shoulder blades.",
    videoUrl: "/assets/videos/rear-delt-fly.mp4"
  },
  {
    name: "Shrug",
    category: "Shoulders",
    description: "Elevates shoulders to target trapezius muscles.",
    snippet: "Lift straight up; avoid rolling the shoulders.",
    videoUrl: "/assets/videos/shrug.mp4"
  },
  {
    name: "Upright Row",
    category: "Shoulders",
    description: "Vertical pull to chest height engaging delts and traps.",
    snippet: "Keep bar close and elbows high; use moderate range.",
    videoUrl: "/assets/videos/upright-row.mp4"
  },
  {
    name: "Shoulder Press Machine",
    category: "Shoulders",
    description: "Machine‑guided overhead press for delts with fixed path.",
    snippet: "Seat height should align handles with shoulder level.",
    videoUrl: "/assets/videos/shoulder-press-machine.mp4"
  },

  // Arms – Biceps
  {
    name: "Barbell Curl",
    category: "Biceps",
    description: "Classic curl moving a barbell through elbow flexion.",
    snippet: "Keep elbows tucked; avoid swinging the torso.",
    videoUrl: "/assets/videos/barbell-curl.mp4"
  },
  {
    name: "Dumbbell Curl",
    category: "Biceps",
    description: "Unilateral dumbbell curl allowing natural wrist rotation.",
    snippet: "Squeeze at the top; lower under control.",
    videoUrl: "/assets/videos/dumbbell-curl.mp4"
  },
  {
    name: "Hammer Curl",
    category: "Biceps",
    description: "Neutral‑grip curl targeting brachialis and forearms.",
    snippet: "Keep palms facing each other throughout.",
    videoUrl: "/assets/videos/hammer-curl.mp4"
  },
  {
    name: "Preacher Curl",
    category: "Biceps",
    description: "Curl performed on a preacher bench to isolate biceps.",
    snippet: "Don’t lock out at the bottom; keep tension.",
    videoUrl: "/assets/videos/preacher-curl.mp4"
  },
  {
    name: "Concentration Curl",
    category: "Biceps",
    description: "Seated single‑arm curl emphasizing peak contraction.",
    snippet: "Press upper arm into inner thigh for stability.",
    videoUrl: "/assets/videos/concentration-curl.mp4"
  },
  {
    name: "Cable Curl",
    category: "Biceps",
    description: "Cable curl providing constant tension across the range.",
    snippet: "Stand tall; keep shoulders down and back.",
    videoUrl: "/assets/videos/cable-curl.mp4"
  },
  {
    name: "Arm Curl Machine",
    category: "Biceps",
    description: "Machine isolation for biceps with guided path.",
    snippet: "Adjust pad height to fit your arms comfortably.",
    videoUrl: "/assets/videos/arm-curl-machine.mp4"
  },

  // Arms – Triceps
  {
    name: "Tricep Pushdown",
    category: "Triceps",
    description: "Cable press down targeting triceps.",
    snippet: "Pin elbows to your sides and fully extend.",
    videoUrl: "/assets/videos/tricep-pushdown.mp4"
  },
  {
    name: "Tricep Pushdown (Rope)",
    category: "Triceps",
    description: "Rope attachment pushdown allowing a wider finish.",
    snippet: "Spread rope ends apart at lockout.",
    videoUrl: "/assets/videos/tricep-pushdown-rope.mp4"
  },
  {
    name: "Overhead Tricep Extension",
    category: "Triceps",
    description: "Extension performed overhead emphasizing long head of triceps.",
    snippet: "Keep elbows in; avoid flaring.",
    videoUrl: "/assets/videos/overhead-tricep-extension.mp4"
  },
  {
    name: "Skullcrusher",
    category: "Triceps",
    description: "Lying triceps extension with barbell or EZ bar.",
    snippet: "Lower to forehead/chin with elbows fixed.",
    videoUrl: "/assets/videos/skullcrusher.mp4"
  },
  {
    name: "Close-Grip Bench Press",
    category: "Triceps",
    description: "Bench press with narrow grip to emphasize triceps.",
    snippet: "Stack wrists over elbows and keep elbows tucked.",
    videoUrl: "/assets/videos/close-grip-bench-press.mp4"
  },
  {
    name: "Dips",
    category: "Triceps",
    description: "Bodyweight press on parallel bars targeting chest and triceps.",
    snippet: "Slight forward lean for chest; upright for triceps.",
    videoUrl: "/assets/videos/dips.mp4"
  },
  {
    name: "Tricep Extension Machine",
    category: "Triceps",
    description: "Machine‑guided triceps extension for isolation.",
    snippet: "Adjust seat so pivot aligns with your elbow joint.",
    videoUrl: "/assets/videos/tricep-extension-machine.mp4"
  },

  // Legs
  {
    name: "Squat",
    category: "Legs",
    description: "Compound lower‑body lift targeting quads, glutes, and hamstrings.",
    snippet: "Keep chest up and push knees out; drive through heels.",
    videoUrl: "/assets/videos/squat.mp4"
  },
  {
    name: "Front Squat",
    category: "Legs",
    description: "Squat with bar in front rack emphasizing quads and upright torso.",
    snippet: "Elbows high; sit between your heels.",
    videoUrl: "/assets/videos/front-squat.mp4"
  },
  {
    name: "Hack Squat",
    category: "Legs",
    description: "Machine squat focusing on quads with guided sled path.",
    snippet: "Keep back against pad; don’t lock knees at top.",
    videoUrl: "/assets/videos/hack-squat.mp4"
  },
  {
    name: "Leg Press",
    category: "Legs",
    description: "Sled press targeting quads and glutes with adjustable foot positions.",
    snippet: "Don’t lift hips off the pad; control depth.",
    videoUrl: "/assets/videos/leg-press.mp4"
  },
  {
    name: "Lunge",
    category: "Legs",
    description: "Split‑stance step targeting quads and glutes with balance demand.",
    snippet: "Step long enough to keep front knee over ankle.",
    videoUrl: "/assets/videos/lunge.mp4"
  },
  {
    name: "Bulgarian Split Squat",
    category: "Legs",
    description: "Rear‑foot elevated lunge emphasizing quads and glutes.",
    snippet: "Keep torso slightly forward; drive through front foot.",
    videoUrl: "/assets/videos/bulgarian-split-squat.mp4"
  },
  {
    name: "Step-Up",
    category: "Legs",
    description: "Step onto a box/bench to train unilateral leg strength.",
    snippet: "Press through entire foot; avoid pushing off the back leg.",
    videoUrl: "/assets/videos/step-up.mp4"
  },
  {
    name: "Leg Extension",
    category: "Legs",
    description: "Machine isolation for quads through knee extension.",
    snippet: "Align knee joint with machine’s pivot; control the lowering.",
    videoUrl: "/assets/videos/leg-extension.mp4"
  },
  {
    name: "Leg Curl",
    category: "Legs",
    description: "Machine isolation for hamstrings through knee flexion.",
    snippet: "Keep hips down; squeeze at peak contraction.",
    videoUrl: "/assets/videos/leg-curl.mp4"
  },
  {
    name: "Romanian Deadlift",
    category: "Legs",
    description: "Hip hinge focusing on hamstrings and glutes with minimal knee bend.",
    snippet: "Hinge at hips, keep bar close to legs, and maintain a flat back.",
    videoUrl: "/assets/videos/romanian-deadlift.mp4"
  },
  {
    name: "Glute Bridge",
    category: "Legs",
    description: "Bridge movement targeting glutes with bodyweight or load.",
    snippet: "Tuck pelvis and squeeze glutes at the top.",
    videoUrl: "/assets/videos/glute-bridge.mp4"
  },
  {
    name: "Hip Thrust",
    category: "Legs",
    description: "Loaded bridge with upper back on a bench to bias glutes.",
    snippet: "Chin tucked; pause at top for full contraction.",
    videoUrl: "/assets/videos/hip-thrust.mp4"
  },
  {
    name: "Smith Machine Squat",
    category: "Legs",
    description: "Squat on a fixed track, offering stability and controlled path.",
    snippet: "Set foot stance slightly forward to keep torso upright.",
    videoUrl: "/assets/videos/smith-machine-squat.mp4"
  },

  // Calves
  {
    name: "Standing Calf Raise",
    category: "Calves",
    description: "Raises heels while standing to train gastrocnemius.",
    snippet: "Full stretch at bottom; full squeeze at top.",
    videoUrl: "/assets/videos/standing-calf-raise.mp4"
  },
  {
    name: "Seated Calf Raise",
    category: "Calves",
    description: "Seated variation targeting soleus.",
    snippet: "Keep knees at 90° and move through full range.",
    videoUrl: "/assets/videos/seated-calf-raise.mp4"
  },
  {
    name: "Donkey Calf Raise",
    category: "Calves",
    description: "Hinged‑torso calf raise to emphasize stretch and contraction.",
    snippet: "Pause briefly at peak; avoid bouncing.",
    videoUrl: "/assets/videos/donkey-calf-raise.mp4"
  },

  // Core
  {
    name: "Crunch",
    category: "Core",
    description: "Abdominal flexion exercise lifting the upper torso.",
    snippet: "Exhale as you crunch; keep lower back gently pressed into the floor.",
    videoUrl: "/assets/videos/crunch.mp4"
  },
  {
    name: "Sit-Up",
    category: "Core",
    description: "Full trunk flexion bringing chest to thighs.",
    snippet: "Anchor feet lightly; avoid pulling on your neck.",
    videoUrl: "/assets/videos/sit-up.mp4"
  },
  {
    name: "Plank",
    category: "Core",
    description: "Isometric hold maintaining a straight line from head to heels.",
    snippet: "Squeeze glutes and brace abs; don’t let hips sag.",
    videoUrl: "/assets/videos/plank.mp4"
  },
  {
    name: "Hanging Leg Raise",
    category: "Core",
    description: "Leg raises from a hang to target lower abs and hip flexors.",
    snippet: "Avoid swinging; control the lowering phase.",
    videoUrl: "/assets/videos/hanging-leg-raise.mp4"
  },
  {
    name: "Russian Twist",
    category: "Core",
    description: "Rotational core exercise twisting side to side.",
    snippet: "Keep chest up and rotate through your torso, not just arms.",
    videoUrl: "/assets/videos/russian-twist.mp4"
  },
  {
    name: "Cable Woodchop",
    category: "Core",
    description: "Diagonal cable chop training obliques and anti‑rotation.",
    snippet: "Pivot through hips and keep arms mostly straight.",
    videoUrl: "/assets/videos/cable-woodchop.mp4"
  },
  {
    name: "Ab Rollout",
    category: "Core",
    description: "Anterior core challenge rolling forward and back with wheel or bar.",
    snippet: "Keep ribs down; don’t let lower back hyperextend.",
    videoUrl: "/assets/videos/ab-rollout.mp4"
  },
  {
    name: "Captain’s Chair Leg Raise",
    category: "Core",
    description: "Leg raises on a captain’s chair apparatus targeting lower abs.",
    snippet: "Press back into pad and lift with control.",
    videoUrl: "/assets/videos/captains-chair-leg-raise.mp4"
  },

  // Olympic / Power
  {
    name: "Deadlift",
    category: "Powerlifting",
    description: "Heavy hinge lift engaging posterior chain and grip strength.",
    snippet: "Bar over mid‑foot, lats tight, push the floor away.",
    videoUrl: "/assets/videos/deadlift.mp4"
  },
  {
    name: "Sumo Deadlift",
    category: "Powerlifting",
    description: "Wide‑stance deadlift reducing ROM and biasing hips and quads.",
    snippet: "Shins to bar, hips close, spread the floor with your feet.",
    videoUrl: "/assets/videos/sumo-deadlift.mp4"
  },
  {
    name: "Power Clean",
    category: "Olympic",
    description: "Explosive pull catching bar at shoulders in a front rack.",
    snippet: "Keep bar close and extend violently through hips.",
    videoUrl: "/assets/videos/power-clean.mp4"
  },
  {
    name: "Clean and Jerk",
    category: "Olympic",
    description: "Two‑part lift: clean to shoulders, then jerk overhead.",
    snippet: "Reset between phases; drive under the bar with speed.",
    videoUrl: "/assets/videos/clean-and-jerk.mp4"
  },
  {
    name: "Snatch",
    category: "Olympic",
    description: "Wide‑grip pull catching bar overhead in one motion.",
    snippet: "Stay over the bar; pull under fast and stabilize overhead.",
    videoUrl: "/assets/videos/snatch.mp4"
  },

  // Cardio / Conditioning
  {
    name: "Treadmill",
    category: "Cardio",
    description: "Indoor running/walking modality with adjustable speed and incline.",
    snippet: "Use slight forward lean and quick cadence; don’t hold the rails.",
    videoUrl: "/assets/videos/treadmill.mp4"
  },
  {
    name: "Elliptical Trainer",
    category: "Cardio",
    description: "Low‑impact cardio combining leg and arm movement on an elliptical path.",
    snippet: "Maintain upright posture and steady cadence.",
    videoUrl: "/assets/videos/elliptical-trainer.mp4"
  },
  {
    name: "Stationary Bike",
    category: "Cardio",
    description: "Seated cycling for low‑impact cardio and leg endurance.",
    snippet: "Adjust seat height for slight knee bend at bottom.",
    videoUrl: "/assets/videos/stationary-bike.mp4"
  },
  {
    name: "Spin Bike",
    category: "Cardio",
    description: "Indoor cycling with flywheel; ideal for high‑intensity intervals.",
    snippet: "Keep cadence smooth; modulate resistance, not just speed.",
    videoUrl: "/assets/videos/spin-bike.mp4"
  },
  {
    name: "Rowing Machine",
    category: "Cardio",
    description: "Full‑body cardio focusing on leg drive, hip swing, and arm pull.",
    snippet: "Sequence: legs, hips, arms; then arms, hips, legs on return.",
    videoUrl: "/assets/videos/rowing-machine-cardio.mp4"
  },
  {
    name: "Stair Climber",
    category: "Cardio",
    description: "Stepping modality mimicking stair ascent for cardio and glute work.",
    snippet: "Stand tall; light grip on rails; steady pace over big steps.",
    videoUrl: "/assets/videos/stair-climber.mp4"
  },
  {
    name: "Jacob’s Ladder",
    category: "Cardio",
    description: "Self‑paced ladder climbing emphasizing full‑body conditioning.",
    snippet: "Use smooth, rhythmic steps; don’t overstride.",
    videoUrl: "/assets/videos/jacobs-ladder.mp4"
  },
  {
    name: "Battle Ropes",
    category: "Cardio",
    description: "High‑intensity intervals using rope waves and slams.",
    snippet: "Brace the core; generate waves from shoulders, not wrists.",
    videoUrl: "/assets/videos/battle-ropes.mp4"
  },
  {
    name: "Jump Rope",
    category: "Cardio",
    description: "Rhythmic jumping for coordination, footwork, and conditioning.",
    snippet: "Stay light on feet; turn the rope with wrists.",
    videoUrl: "/assets/videos/jump-rope.mp4"
  },
  {
    name: "Burpee",
    category: "Cardio",
    description: "Full‑body conditioning move with squat, plank, and jump.",
    snippet: "Keep transitions smooth; avoid collapsing in the plank.",
    videoUrl: "/assets/videos/burpee.mp4"
  },
  {
    name: "Mountain Climber",
    category: "Cardio",
    description: "Core‑driven plank position alternating knee drives.",
    snippet: "Keep hips level and move quickly without bouncing.",
    videoUrl: "/assets/videos/mountain-climber.mp4"
  },
  {
    name: "Jump Squat",
    category: "Cardio",
    description: "Explosive squat variation adding a jump for power and conditioning.",
    snippet: "Land softly and absorb with hips; maintain knee alignment.",
    videoUrl: "/assets/videos/jump-squat.mp4"
  },
  {
    name: "Box Jump",
    category: "Cardio",
    description: "Explosive jump onto a box to train power and coordination.",
    snippet: "Full hip extension; step down to reduce impact.",
    videoUrl: "/assets/videos/box-jump.mp4"
  },
  {
    name: "Kettlebell Swing",
    category: "Cardio",
    description: "Hinge‑based ballistic swing training posterior chain and power.",
    snippet: "Snap hips; let the bell float; don’t squat the swing.",
    videoUrl: "/assets/videos/kettlebell-swing.mp4"
  }
];
