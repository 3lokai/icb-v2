// Enhanced BrewingTimer.tsx with Glassmorphism
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Icon } from "@/components/common/Icon";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import type { CalculatorResults } from "@/lib/tools/brewing-guide";

type BrewingTimerProps = {
  results: CalculatorResults | null;
  className?: string;
};

type TimerStep = {
  time: number; // in seconds
  instruction: string;
  isCompleted: boolean;
};

export function BrewingTimer({ results, className }: BrewingTimerProps) {
  // Timer state
  const [currentTime, setCurrentTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  // Notification settings
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [vibrationSupported, setVibrationSupported] = useState(false);
  const [vibrationEnabled, setVibrationEnabled] = useState(true);

  // Refs
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Check for vibration support on mount
  useEffect(() => {
    if ("vibrate" in navigator) {
      setVibrationSupported(true);
    }
  }, []);

  // Notification functions
  const triggerNotification = useCallback(
    (message: string) => {
      // Sound notification
      if (soundEnabled) {
        try {
          // Create audio context for beep sound
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const AudioContext =
            window.AudioContext || (window as any).webkitAudioContext;
          const audioContext = new AudioContext();
          const oscillator = audioContext.createOscillator();
          const gainNode = audioContext.createGain();

          oscillator.connect(gainNode);
          gainNode.connect(audioContext.destination);

          oscillator.frequency.value = 800; // 800Hz beep
          gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(
            0.01,
            audioContext.currentTime + 0.5
          );

          oscillator.start();
          oscillator.stop(audioContext.currentTime + 0.5);
        } catch (error) {
          console.log("Audio notification failed:", error);
        }
      }

      // Vibration notification (mobile only)
      if (vibrationEnabled && vibrationSupported) {
        try {
          navigator.vibrate([200, 100, 200]); // Vibrate pattern
        } catch (error) {
          console.log("Vibration failed:", error);
        }
      }

      // Browser notification (if permission granted)
      if ("Notification" in window && Notification.permission === "granted") {
        new Notification("Coffee Timer", {
          body: message,
          icon: "/favicon/favicon-32x32.png",
          tag: "coffee-timer",
        });
      }
    },
    [soundEnabled, vibrationEnabled, vibrationSupported]
  );

  // Default timer steps (can be customized based on brewing method)
  const getTimerSteps = useCallback((): TimerStep[] => {
    if (!results) {
      return [];
    }

    const method = results.method.id;
    const totalWater = results.waterAmount;

    // Method-specific brewing steps
    switch (method) {
      case "pourover":
        return [
          {
            time: 0,
            instruction: `Bloom with ${Math.round(totalWater * 0.2)}ml water, wait 30 seconds`,
            isCompleted: false,
          },
          {
            time: 30,
            instruction: `Pour slowly to ${Math.round(totalWater * 0.5)}ml total`,
            isCompleted: false,
          },
          {
            time: 90,
            instruction: `Continue pouring to ${Math.round(totalWater * 0.8)}ml`,
            isCompleted: false,
          },
          {
            time: 150,
            instruction: `Final pour to ${totalWater}ml`,
            isCompleted: false,
          },
          {
            time: 240,
            instruction: "Brewing complete - enjoy!",
            isCompleted: false,
          },
        ];

      case "frenchpress":
        return [
          {
            time: 0,
            instruction: "Add all water and stir gently",
            isCompleted: false,
          },
          {
            time: 30,
            instruction: "Place lid, do not press yet",
            isCompleted: false,
          },
          {
            time: 240,
            instruction: "Press plunger slowly and serve",
            isCompleted: false,
          },
        ];

      case "aeropress":
        return [
          {
            time: 0,
            instruction: "Add water and stir for 10 seconds",
            isCompleted: false,
          },
          {
            time: 10,
            instruction: "Attach cap and flip (if inverted)",
            isCompleted: false,
          },
          {
            time: 60,
            instruction: "Press slowly for 30 seconds",
            isCompleted: false,
          },
          { time: 90, instruction: "Brewing complete!", isCompleted: false },
        ];

      case "chemex":
        return [
          {
            time: 0,
            instruction: `Bloom with ${Math.round(totalWater * 0.15)}ml, wait 45 seconds`,
            isCompleted: false,
          },
          {
            time: 45,
            instruction: `Pour to ${Math.round(totalWater * 0.6)}ml total`,
            isCompleted: false,
          },
          {
            time: 120,
            instruction: `Final pour to ${totalWater}ml`,
            isCompleted: false,
          },
          {
            time: 300,
            instruction: "Brewing complete - enjoy!",
            isCompleted: false,
          },
        ];

      default:
        return [
          { time: 0, instruction: "Start brewing process", isCompleted: false },
          {
            time: 60,
            instruction: "Check extraction progress",
            isCompleted: false,
          },
          { time: 180, instruction: "Almost done", isCompleted: false },
          { time: 240, instruction: "Brewing complete!", isCompleted: false },
        ];
    }
  }, [results]);

  const [steps, setSteps] = useState<TimerStep[]>([]);

  // Update steps when results change
  useEffect(() => {
    setSteps(getTimerSteps());
    setCurrentTime(0);
    setIsRunning(false);
    setIsPaused(false);
  }, [getTimerSteps]);

  // Timer logic
  useEffect(() => {
    if (isRunning && !isPaused) {
      intervalRef.current = setInterval(() => {
        setCurrentTime((prev) => {
          const newTime = prev + 1;

          // Check for step completions and trigger notifications
          setSteps((prevSteps) =>
            prevSteps.map((step) => {
              if (step.time === newTime && !step.isCompleted) {
                // Trigger notifications
                triggerNotification(step.instruction);
                return { ...step, isCompleted: true };
              }
              return step;
            })
          );

          return newTime;
        });
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, isPaused, triggerNotification]);

  // Request notification permission
  const requestNotificationPermission = async () => {
    if ("Notification" in window && Notification.permission === "default") {
      await Notification.requestPermission();
    }
  };

  // Timer controls
  const startTimer = () => {
    setIsRunning(true);
    setIsPaused(false);
    requestNotificationPermission();
  };

  const pauseTimer = () => {
    setIsPaused(!isPaused);
  };

  const resetTimer = () => {
    setCurrentTime(0);
    setIsRunning(false);
    setIsPaused(false);
    setSteps(getTimerSteps());
  };

  // Format time display
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Get current step
  const currentStep =
    steps.find((step) => step.time > currentTime) || steps.at(-1);
  const completedSteps = steps.filter((step) => step.isCompleted).length;
  const totalSteps = steps.length;
  const progressPercentage =
    totalSteps > 0 ? (completedSteps / totalSteps) * 100 : 0;

  if (!results) {
    return (
      <div
        className={`glass-card card-padding relative overflow-hidden ${className}`}
      >
        <div className="absolute top-0 right-0 h-20 w-20 rounded-full bg-primary/5 blur-2xl" />
        <div className="relative z-10">
          <div className="mb-6 flex items-center gap-2">
            <Icon className="h-5 w-5 text-primary" name="Timer" />
            <h3 className="font-semibold text-lg">Brewing Timer</h3>
          </div>
          <div className="py-8 text-center text-muted-foreground">
            <Icon className="mx-auto mb-3 h-12 w-12 opacity-50" name="Timer" />
            <p className="text-sm">Select a brewing method to start timing</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`glass-card card-padding relative overflow-hidden ${className}`}
    >
      {/* Enhanced decorative elements */}
      <div className="absolute top-0 right-0 h-24 w-24 animate-float rounded-full bg-primary/10 blur-2xl" />
      <div className="absolute bottom-0 left-0 h-16 w-16 animate-float rounded-full bg-accent/10 blur-xl delay-700" />
      {isRunning && (
        <div className="absolute top-1/2 left-1/2 h-32 w-32 animate-pulse rounded-full bg-chart-2/5 blur-3xl" />
      )}

      <div className="relative z-10 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Icon className="h-5 w-5 text-primary" name="Timer" />
            <h3 className="font-semibold text-lg">Brewing Timer</h3>
          </div>

          {/* Notification Controls - Enhanced glass treatment */}
          <div className="glass-panel rounded-lg p-1">
            <div className="flex gap-1">
              <Button
                className={`h-8 w-8 p-0 transition-all duration-300 hover:scale-110 ${
                  soundEnabled
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-background/50"
                }`}
                onClick={() => setSoundEnabled(!soundEnabled)}
                size="sm"
                variant="ghost"
              >
                {soundEnabled ? (
                  <Icon className="h-4 w-4" name="SpeakerHigh" />
                ) : (
                  <Icon className="h-4 w-4" name="SpeakerSlash" />
                )}
              </Button>

              {vibrationSupported && (
                <Button
                  className={`h-8 w-8 p-0 transition-all duration-300 hover:scale-110 ${
                    vibrationEnabled
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-background/50"
                  }`}
                  onClick={() => setVibrationEnabled(!vibrationEnabled)}
                  size="sm"
                  variant="ghost"
                >
                  <Icon className="h-4 w-4" name="Vibrate" />
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Timer Display - Enhanced glass panel */}
        <div className="glass-panel relative overflow-hidden rounded-2xl p-6 text-center">
          <div className="absolute top-0 right-0 h-16 w-16 rounded-full bg-chart-2/10 blur-xl" />
          <div className="relative z-10">
            <div
              className={`mb-4 font-bold font-mono text-4xl transition-all duration-300 ${
                isRunning ? "scale-110 text-primary" : "text-foreground"
              }`}
            >
              {formatTime(currentTime)}
            </div>
            <Progress className="mb-2 h-2 w-full" value={progressPercentage} />
            <div className="text-muted-foreground text-sm">
              Total brew time: {formatTime(steps.at(-1)?.time || 0)}
            </div>
          </div>
        </div>

        {/* Timer Controls - Enhanced glass buttons */}
        <div className="flex justify-center gap-3">
          {isRunning ? (
            <Button
              className="glass-button hover-lift group px-6"
              onClick={pauseTimer}
              variant="outline"
            >
              <Icon
                className="mr-2 h-4 w-4 transition-transform group-hover:scale-110"
                name="Pause"
              />
              {isPaused ? "Resume" : "Pause"}
            </Button>
          ) : (
            <Button
              className="glass-button hover-lift group px-6"
              onClick={startTimer}
            >
              <Icon
                className="mr-2 h-4 w-4 transition-transform group-hover:scale-110"
                name="Play"
              />
              Start Timer
            </Button>
          )}

          <Button
            className="glass-button hover-lift group px-6"
            onClick={resetTimer}
            variant="outline"
          >
            <Icon
              className="mr-2 h-4 w-4 transition-transform group-hover:scale-110"
              name="ArrowCounterClockwise"
            />
            Reset
          </Button>
        </div>

        {/* Current Step - Enhanced glass modal for emphasis */}
        {currentStep && (
          <div className="glass-modal relative overflow-hidden rounded-2xl p-4">
            <div className="absolute top-0 right-0 h-12 w-12 rounded-full bg-accent/20 blur-xl" />
            <div className="relative z-10">
              <div className="mb-3 flex items-center justify-between">
                <Badge className="badge border-border/50 bg-background/90 text-foreground text-xs">
                  Step {completedSteps + 1} of {totalSteps}
                </Badge>
                <span className="font-medium text-muted-foreground text-xs">
                  {currentStep.time > currentTime
                    ? `In ${currentStep.time - currentTime}s`
                    : "Now"}
                </span>
              </div>
              <p className="font-medium text-sm leading-relaxed">
                {currentStep.instruction}
              </p>
            </div>
          </div>
        )}

        {/* All Steps - Enhanced glass cards */}
        <div className="space-y-4">
          <div>
            <h4 className="mb-2 font-medium text-primary text-sm">
              Brewing Steps
            </h4>
            <div className="h-1 w-16 rounded-full bg-accent" />
          </div>
          <div className="space-y-2">
            {steps.map((step, index) => {
              // Calculate step state classes
              const getStepCardClassName = () => {
                if (step.isCompleted) {
                  return "border-green-500/30 bg-green-500/10";
                }
                if (currentTime >= step.time) {
                  return "border-accent/30 bg-accent/10";
                }
                return "";
              };

              const getStepBadgeClassName = () => {
                if (step.isCompleted) {
                  return "bg-green-500 text-white shadow-sm";
                }
                if (currentTime >= step.time) {
                  return "bg-accent text-accent-foreground";
                }
                return "bg-muted text-muted-foreground";
              };

              const getStepTextClassName = () => {
                if (step.isCompleted) {
                  return "font-medium text-green-700 dark:text-green-300";
                }
                if (currentTime >= step.time) {
                  return "font-medium text-foreground";
                }
                return "text-muted-foreground";
              };

              return (
                <div
                  className={`glass-card card-padding group relative overflow-hidden transition-all duration-300 hover:scale-[1.02] ${getStepCardClassName()}`}
                  key={`step-${step.time}-${step.instruction.slice(0, 10)}-${index}`}
                >
                  <div className="absolute top-0 right-0 h-8 w-8 rounded-full bg-primary/5 blur-lg" />
                  <div className="relative z-10 flex items-center gap-3">
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-full font-medium text-xs transition-all duration-300 group-hover:scale-110 ${getStepBadgeClassName()}`}
                    >
                      {step.isCompleted ? (
                        <Icon className="h-3 w-3" name="Check" />
                      ) : (
                        <span>{formatTime(step.time)}</span>
                      )}
                    </div>
                    <span
                      className={`flex-1 text-sm transition-colors ${getStepTextClassName()}`}
                    >
                      {step.instruction}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
