"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, XCircle, ChevronRight, RotateCcw } from "lucide-react";
import { type QuizQuestion } from "@/lib/mock";
import { motion, AnimatePresence } from "framer-motion";

interface QuizWidgetProps {
  questions: QuizQuestion[];
  onComplete: (score: number, answers: number[]) => void;
}

export function QuizWidget({ questions, onComplete }: QuizWidgetProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [userAnswers, setUserAnswers] = useState<number[]>([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [quizComplete, setQuizComplete] = useState(false);

  if (questions.length === 0) {
    return null; // No quiz for this task
  }

  const question = questions[currentQuestion];
  const isCorrect = selectedAnswer === question.correctAnswer;
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  const handleAnswerSelect = (index: number) => {
    if (showFeedback) return; // Don't allow changing answer after submission
    setSelectedAnswer(index);
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null) return;
    setShowFeedback(true);
    setUserAnswers([...userAnswers, selectedAnswer]);
  };

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowFeedback(false);
    } else {
      // Quiz complete
      const finalAnswers = [...userAnswers, selectedAnswer!];
      const score = Math.round(
        (finalAnswers.filter((ans, idx) => ans === questions[idx].correctAnswer)
          .length /
          questions.length) *
          100
      );
      setQuizComplete(true);
      onComplete(score, finalAnswers);
    }
  };

  const handleRetake = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setUserAnswers([]);
    setShowFeedback(false);
    setQuizComplete(false);
  };

  // Calculate final score for results screen
  const finalScore =
    userAnswers.length === questions.length
      ? Math.round(
          (userAnswers.filter((ans, idx) => ans === questions[idx].correctAnswer)
            .length /
            questions.length) *
            100
        )
      : 0;

  if (quizComplete) {
    const passed = finalScore >= 80;

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="space-y-6"
      >
        <Card className="rounded-2xl border-2">
          <CardContent className="p-8 text-center">
            {/* Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="mb-6 flex justify-center"
            >
              {passed ? (
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
                  <CheckCircle2 className="h-10 w-10 text-green-600" />
                </div>
              ) : (
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-amber-100">
                  <XCircle className="h-10 w-10 text-amber-600" />
                </div>
              )}
            </motion.div>

            {/* Score */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h3 className="mb-2 text-3xl font-bold text-neutral-900">
                {finalScore}%
              </h3>
              <p className="mb-4 text-lg text-neutral-600">
                {passed
                  ? "Great job! You passed!"
                  : "Keep practicing - you'll get it!"}
              </p>

              {/* Breakdown */}
              <div className="mb-6 text-sm text-neutral-600">
                {userAnswers.filter((ans, idx) => ans === questions[idx].correctAnswer).length} out of {questions.length} correct
              </div>

              {/* Pass requirement */}
              {!passed && (
                <p className="mb-6 text-sm text-neutral-500">
                  You need 80% or higher to complete this task
                </p>
              )}

              {/* Actions */}
              <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
                <Button
                  onClick={handleRetake}
                  variant="outline"
                  className="gap-2 rounded-xl"
                >
                  <RotateCcw className="h-4 w-4" />
                  Retake Quiz
                </Button>
                {passed && (
                  <Button className="gap-2 rounded-xl bg-green-600 hover:bg-green-700">
                    <CheckCircle2 className="h-4 w-4" />
                    Continue
                  </Button>
                )}
              </div>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Progress */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium text-neutral-700">
            Question {currentQuestion + 1} of {questions.length}
          </span>
          <span className="text-neutral-500">{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Question Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="rounded-2xl border-2">
            <CardContent className="p-6">
              {/* Question */}
              <h3 className="mb-6 text-lg font-semibold text-neutral-900">
                {question.question}
              </h3>

              {/* Options */}
              <div className="space-y-3">
                {question.options.map((option, index) => {
                  const isSelected = selectedAnswer === index;
                  const isCorrectAnswer = index === question.correctAnswer;
                  const showCorrect = showFeedback && isCorrectAnswer;
                  const showIncorrect = showFeedback && isSelected && !isCorrect;

                  return (
                    <button
                      key={index}
                      onClick={() => handleAnswerSelect(index)}
                      disabled={showFeedback}
                      className={`w-full rounded-xl border-2 p-4 text-left transition-all ${
                        showCorrect
                          ? "border-green-500 bg-green-50"
                          : showIncorrect
                            ? "border-red-500 bg-red-50"
                            : isSelected
                              ? "border-primary bg-primary/5"
                              : "border-neutral-200 hover:border-neutral-300"
                      } ${showFeedback ? "cursor-not-allowed" : "cursor-pointer"}`}
                    >
                      <div className="flex items-center justify-between">
                        <span
                          className={`font-medium ${
                            showCorrect
                              ? "text-green-900"
                              : showIncorrect
                                ? "text-red-900"
                                : isSelected
                                  ? "text-primary"
                                  : "text-neutral-700"
                          }`}
                        >
                          {option}
                        </span>
                        {showCorrect && (
                          <CheckCircle2 className="h-5 w-5 text-green-600" />
                        )}
                        {showIncorrect && (
                          <XCircle className="h-5 w-5 text-red-600" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Feedback */}
              {showFeedback && question.explanation && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`mt-6 rounded-xl p-4 ${
                    isCorrect ? "bg-green-50" : "bg-amber-50"
                  }`}
                >
                  <div className="flex gap-3">
                    {isCorrect ? (
                      <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-green-600" />
                    ) : (
                      <XCircle className="h-5 w-5 flex-shrink-0 text-amber-600" />
                    )}
                    <div>
                      <p
                        className={`text-sm font-medium ${
                          isCorrect ? "text-green-900" : "text-amber-900"
                        }`}
                      >
                        {isCorrect ? "Correct!" : "Not quite!"}
                      </p>
                      <p
                        className={`text-sm ${
                          isCorrect ? "text-green-700" : "text-amber-700"
                        }`}
                      >
                        {question.explanation}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Action Button */}
              <div className="mt-6">
                {!showFeedback ? (
                  <Button
                    onClick={handleSubmitAnswer}
                    disabled={selectedAnswer === null}
                    className="w-full gap-2 rounded-xl"
                  >
                    Submit Answer
                  </Button>
                ) : (
                  <Button
                    onClick={handleNextQuestion}
                    className="w-full gap-2 rounded-xl"
                  >
                    {currentQuestion < questions.length - 1
                      ? "Next Question"
                      : "See Results"}
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
