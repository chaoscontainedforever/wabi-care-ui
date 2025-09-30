// Mock data for Data Collection page
export const mockStudents = [
  {
    id: "1",
    name: "Emma Johnson",
    studentId: "EJ001",
    grade: "3rd Grade",
    disability: "Autism Spectrum Disorder",
    age: 8,
    school: "Lincoln Elementary",
    teacher: "Ms. Sarah Wilson",
    profilePicture: "https://i.pravatar.cc/150?img=1"
  },
  {
    id: "2", 
    name: "Michael Chen",
    studentId: "MC002",
    grade: "2nd Grade",
    disability: "ADHD",
    age: 7,
    school: "Lincoln Elementary",
    teacher: "Ms. Sarah Wilson",
    profilePicture: "https://i.pravatar.cc/150?img=2"
  },
  {
    id: "3",
    name: "Sarah Williams",
    studentId: "SW003",
    grade: "4th Grade",
    disability: "Learning Disability",
    age: 9,
    school: "Lincoln Elementary",
    teacher: "Ms. Sarah Wilson",
    profilePicture: "https://i.pravatar.cc/150?img=3"
  },
  {
    id: "4",
    name: "David Rodriguez",
    studentId: "DR004",
    grade: "1st Grade",
    disability: "Speech and Language Impairment",
    age: 6,
    school: "Lincoln Elementary",
    teacher: "Ms. Sarah Wilson",
    profilePicture: "https://i.pravatar.cc/150?img=4"
  }
]

// AFLS Assessment domains
export const aflsDomains = [
  {
    id: "basic-living",
    name: "Basic Living Skills",
    description: "Self-care, hygiene, and daily living activities",
    skills: [
      "Dressing", "Grooming", "Bathing", "Toileting", "Eating", "Sleeping"
    ]
  },
  {
    id: "home-skills", 
    name: "Home Skills",
    description: "Domestic activities and household management",
    skills: [
      "Cleaning", "Cooking", "Laundry", "Home Maintenance", "Safety", "Organization"
    ]
  },
  {
    id: "community-participation",
    name: "Community Participation",
    description: "Skills for community engagement and independence",
    skills: [
      "Transportation", "Shopping", "Restaurants", "Recreation", "Safety", "Communication"
    ]
  },
  {
    id: "school-skills",
    name: "School Skills", 
    description: "Academic and school-related functional skills",
    skills: [
      "Classroom Behavior", "Following Directions", "Academic Tasks", "Social Skills", "Independence"
    ]
  },
  {
    id: "vocational-skills",
    name: "Vocational Skills",
    description: "Work-related skills and job readiness",
    skills: [
      "Work Behavior", "Task Completion", "Following Instructions", "Safety", "Communication"
    ]
  },
  {
    id: "independent-living",
    name: "Independent Living",
    description: "Skills for independent adult living",
    skills: [
      "Money Management", "Health Care", "Employment", "Housing", "Community Resources"
    ]
  }
]

// Mock data for goals
export const mockGoals = [
  {
    id: "1",
    studentId: "1",
    title: "Reading Comprehension",
    description: "Student will identify main idea in grade-level texts",
    domain: "Academic",
    level: "Elementary",
    type: "Annual",
    objectives: ["Identify main idea", "Answer comprehension questions"],
    measurement: "80% accuracy across 3 consecutive sessions",
    accommodations: "Extended time, visual supports"
  },
  {
    id: "2", 
    studentId: "1",
    title: "Social Communication",
    description: "Student will initiate conversations with peers",
    domain: "Social",
    level: "Elementary", 
    type: "Annual",
    objectives: ["Initiate greetings", "Ask questions", "Respond appropriately"],
    measurement: "3 times per session across 3 consecutive sessions",
    accommodations: "Visual prompts, peer modeling"
  },
  {
    id: "3",
    studentId: "2",
    title: "Attention and Focus",
    description: "Student will maintain attention during academic tasks",
    domain: "Behavioral",
    level: "Elementary",
    type: "Annual", 
    objectives: ["Stay on task", "Follow directions", "Complete assignments"],
    measurement: "80% of the time across 3 consecutive sessions",
    accommodations: "Frequent breaks, fidget tools, preferential seating"
  },
  {
    id: "4",
    studentId: "2",
    title: "Task Completion",
    description: "Student will complete assigned tasks independently",
    domain: "Academic",
    level: "Elementary",
    type: "Annual",
    objectives: ["Start tasks", "Work independently", "Finish assignments"],
    measurement: "90% completion rate across 3 consecutive sessions", 
    accommodations: "Task breakdown, visual schedule, positive reinforcement"
  }
]
