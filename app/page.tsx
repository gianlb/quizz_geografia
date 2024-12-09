"use client"

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { questions } from '../lib/questions'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Globe, MapPin, Award } from 'lucide-react'
import confetti from 'canvas-confetti'

export default function SenserQuizz() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [score, setScore] = useState(0)
  const [showScore, setShowScore] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState("")
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)

  const handleAnswerClick = (answer: string) => {
    setSelectedAnswer(answer)
    setIsCorrect(answer === questions[currentQuestion].correctAnswer)

    if (answer === questions[currentQuestion].correctAnswer) {
      setScore(score + 1)
     
    }

    setTimeout(() => {
      const nextQuestion = currentQuestion + 1
      if (nextQuestion < questions.length) {
        setCurrentQuestion(nextQuestion)
        setSelectedAnswer("")
        setIsCorrect(null)
      } else {
        setShowScore(true)
        showConfettiIfHighScore()
      }
    }, 1500)
  }

  const resetQuiz = () => {
    setCurrentQuestion(0)
    setScore(0)
    setShowScore(false)
    setSelectedAnswer("")
    setIsCorrect(null)
  }

  const showConfettiIfHighScore = () => {
    if (score >= 3) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl bg-white/90 backdrop-blur-sm shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-4xl font-bold text-primary mb-2 flex items-center justify-center">
            <Globe className="mr-2" /> Senser Quizz: Geografia
          </CardTitle>
          <CardDescription className="text-lg text-muted-foreground">
            Teste seus conhecimentos geográficos!
          </CardDescription>
        </CardHeader>
        <CardContent>
          {showScore ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <h2 className="text-3xl font-bold mb-4 text-primary">
                <Award className="inline-block mr-2" />
                Você acertou {score} de {questions.length} perguntas!
                {score >= 3 && " 🎉"}
              </h2>
              <p className="text-xl mb-6 text-muted-foreground">
                {score >= 3 
                  ? "Parabéns! Você é um mestre em geografia!" 
                  : "Continue praticando para melhorar seus conhecimentos!"}
              </p>
              <Button onClick={resetQuiz} size="lg" className="animate-pulse">
                Jogar Novamente
              </Button>
            </motion.div>
          ) : (
            <>
              <div className="mb-6">
                <p className="text-sm font-medium text-muted-foreground mb-2">
                  Pergunta {currentQuestion + 1} de {questions.length}
                </p>
                <Progress value={(currentQuestion / questions.length) * 100} className="h-2" />
              </div>
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentQuestion}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.3 }}
                >
                  <h2 className="text-2xl font-semibold mb-6 text-gray-800">
                    <MapPin className="inline-block mr-2" />
                    {questions[currentQuestion].question}
                  </h2>
                  <div className="grid grid-cols-1 gap-4">
                    {questions[currentQuestion].options.map((option, index) => (
                      <motion.div key={index} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Button
                          className={`w-full justify-start text-left p-4 h-auto ${
                            selectedAnswer === option
                              ? option === questions[currentQuestion].correctAnswer
                                ? "bg-green-500 hover:bg-green-600 text-white font-semibold"
                                : "bg-red-500 hover:bg-red-600 text-white font-semibold"
                              : "bg-white hover:bg-gray-100 text-gray-800 border border-gray-300"
                          }`}
                          onClick={() => handleAnswerClick(option)}
                          disabled={!!selectedAnswer}
                        >
                          {option}
                        </Button>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>
              {isCorrect !== null && (
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`mt-6 text-center font-bold text-lg ${
                    isCorrect ? "text-green-700" : "text-red-700"
                  }`}
                >
                  {isCorrect ? "Correto! Ótimo trabalho!" : "Ops! Não foi dessa vez."}
                </motion.p>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

