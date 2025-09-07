export interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  category: string;
  difficulty: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface QuestionInput {
  question: string;
  options: string[];
  correctAnswer: number;
  category: string;
  difficulty: string;
}

class QuizDatabase {
  private storageKey = 'cyberpunk-quiz-questions';
  private nextIdKey = 'cyberpunk-quiz-next-id';

  constructor() {
    this.initializeDatabase();
  }

  private initializeDatabase() {
    // Check if database exists
    const existingQuestions = localStorage.getItem(this.storageKey);
    if (!existingQuestions) {
      this.seedDatabase();
    }
  }

  private seedDatabase() {
    const seedQuestions: Question[] = [
      {
        id: 1,
        question: "What does TCP stand for in network protocols?",
        options: [
          "Transfer Control Protocol",
          "Transmission Control Protocol", 
          "Transport Communication Protocol",
          "Terminal Connection Protocol"
        ],
        correctAnswer: 1,
        category: "Computer Networks",
        difficulty: "Basic",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 2,
        question: "Which encryption algorithm is considered unbreakable when implemented correctly?",
        options: [
          "AES-256",
          "RSA-2048", 
          "One-Time Pad",
          "DES"
        ],
        correctAnswer: 2,
        category: "Cryptography",
        difficulty: "Intermediate",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 3,
        question: "What is the primary purpose of a firewall in network security?",
        options: [
          "Encrypt data transmission",
          "Filter and control network traffic",
          "Provide user authentication", 
          "Compress network packets"
        ],
        correctAnswer: 1,
        category: "Cybersecurity",
        difficulty: "Basic",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 4,
        question: "In cryptography, what does 'salting' refer to?",
        options: [
          "Adding random data to passwords before hashing",
          "Encrypting data multiple times",
          "Converting plain text to cipher text",
          "Generating encryption keys"
        ],
        correctAnswer: 0,
        category: "Cryptography", 
        difficulty: "Intermediate",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 5,
        question: "Which OSI layer is responsible for routing packets between networks?",
        options: [
          "Transport Layer (Layer 4)",
          "Data Link Layer (Layer 2)",
          "Network Layer (Layer 3)",
          "Session Layer (Layer 5)"
        ],
        correctAnswer: 2,
        category: "Computer Networks",
        difficulty: "Intermediate",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];

    localStorage.setItem(this.storageKey, JSON.stringify(seedQuestions));
    localStorage.setItem(this.nextIdKey, '6');
  }

  private getNextId(): number {
    const nextId = localStorage.getItem(this.nextIdKey) || '1';
    const id = parseInt(nextId, 10);
    localStorage.setItem(this.nextIdKey, (id + 1).toString());
    return id;
  }

  private saveQuestions(questions: Question[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(questions));
  }

  private loadQuestions(): Question[] {
    const questionsJson = localStorage.getItem(this.storageKey);
    if (!questionsJson) return [];
    return JSON.parse(questionsJson);
  }

  // CREATE - Add new question
  createQuestion(questionData: QuestionInput): Question {
    const questions = this.loadQuestions();
    const newQuestion: Question = {
      id: this.getNextId(),
      ...questionData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    questions.push(newQuestion);
    this.saveQuestions(questions);
    return newQuestion;
  }

  // READ - Get all questions
  getAllQuestions(): Question[] {
    return this.loadQuestions();
  }

  // READ - Get question by ID
  getQuestionById(id: number): Question | null {
    const questions = this.loadQuestions();
    return questions.find(q => q.id === id) || null;
  }

  // READ - Get questions by category
  getQuestionsByCategory(category: string): Question[] {
    const questions = this.loadQuestions();
    return questions.filter(q => q.category === category);
  }

  // READ - Get questions by difficulty
  getQuestionsByDifficulty(difficulty: string): Question[] {
    const questions = this.loadQuestions();
    return questions.filter(q => q.difficulty === difficulty);
  }

  // UPDATE - Update existing question
  updateQuestion(id: number, questionData: Partial<QuestionInput>): Question | null {
    const questions = this.loadQuestions();
    const questionIndex = questions.findIndex(q => q.id === id);
    
    if (questionIndex === -1) return null;

    const updatedQuestion: Question = {
      ...questions[questionIndex],
      ...questionData,
      updatedAt: new Date().toISOString()
    };

    questions[questionIndex] = updatedQuestion;
    this.saveQuestions(questions);
    return updatedQuestion;
  }

  // DELETE - Remove question
  deleteQuestion(id: number): boolean {
    const questions = this.loadQuestions();
    const filteredQuestions = questions.filter(q => q.id !== id);
    
    if (filteredQuestions.length === questions.length) {
      return false; // Question not found
    }

    this.saveQuestions(filteredQuestions);
    return true;
  }

  // Get categories
  getCategories(): string[] {
    const questions = this.loadQuestions();
    const categories = [...new Set(questions.map(q => q.category))];
    return categories.sort();
  }

  // Get difficulties
  getDifficulties(): string[] {
    const questions = this.loadQuestions();
    const difficulties = [...new Set(questions.map(q => q.difficulty))];
    return difficulties.sort();
  }

  // Get question count
  getQuestionCount(): number {
    return this.loadQuestions().length;
  }

  // Clear all data (for testing/reset)
  clearDatabase(): void {
    localStorage.removeItem(this.storageKey);
    localStorage.removeItem(this.nextIdKey);
  }
}

// Create singleton instance
export const quizDatabase = new QuizDatabase();
export default quizDatabase;