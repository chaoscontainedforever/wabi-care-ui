"use client"

import { memo, useState, useCallback, useRef, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Mic, MicOff, Square, Play, Pause, RefreshCw, Clock } from "@/components/icons"

interface SessionRecorderProps {
  selectedStudent: string | null
  sessionDate: string
  onSessionDateChange: (date: string) => void
}

export const SessionRecorder = memo(function SessionRecorder({
  selectedStudent,
  sessionDate,
  onSessionDateChange
}: SessionRecorderProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [transcription, setTranscription] = useState("")
  const [isTranscribing, setIsTranscribing] = useState(false)
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null)
  const [recordingChunks, setRecordingChunks] = useState<Blob[]>([])
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const formatTime = useCallback((seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }, [])

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const recorder = new MediaRecorder(stream)
      const chunks: Blob[] = []

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data)
        }
      }

      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/wav' })
        setAudioBlob(blob)
        setAudioUrl(URL.createObjectURL(blob))
        setRecordingChunks(chunks)
      }

      recorder.start()
      setMediaRecorder(recorder)
      setIsRecording(true)
      setRecordingTime(0)

      // Start timer
      intervalRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1)
      }, 1000)
    } catch (error) {
      console.error('Error starting recording:', error)
    }
  }, [])

  const stopRecording = useCallback(() => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop()
      setIsRecording(false)
      setIsPaused(false)
      
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [mediaRecorder, isRecording])

  const pauseRecording = useCallback(() => {
    if (mediaRecorder && isRecording) {
      if (isPaused) {
        mediaRecorder.resume()
        setIsPaused(false)
        intervalRef.current = setInterval(() => {
          setRecordingTime(prev => prev + 1)
        }, 1000)
      } else {
        mediaRecorder.pause()
        setIsPaused(true)
        if (intervalRef.current) {
          clearInterval(intervalRef.current)
          intervalRef.current = null
        }
      }
    }
  }, [mediaRecorder, isRecording, isPaused])

  const resetRecording = useCallback(() => {
    setRecordingTime(0)
    setAudioBlob(null)
    setAudioUrl(null)
    setTranscription("")
    setRecordingChunks([])
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  const transcribeAudio = useCallback(async () => {
    if (!audioBlob) return
    
    setIsTranscribing(true)
    try {
      // Mock transcription - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      setTranscription("This is a mock transcription of the recorded audio. In a real implementation, this would be processed by a speech-to-text service.")
    } catch (error) {
      console.error('Error transcribing audio:', error)
    } finally {
      setIsTranscribing(false)
    }
  }, [audioBlob])

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl)
      }
    }
  }, [audioUrl])

  if (!selectedStudent) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Session Recorder</CardTitle>
          <CardDescription>Select a student to start recording</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Mic className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Please select a student first</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Session Recorder</CardTitle>
        <CardDescription>Record voice notes and observations</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Session Date */}
        <div className="space-y-2">
          <Label htmlFor="session-date">Session Date</Label>
          <Input
            id="session-date"
            type="date"
            value={sessionDate}
            onChange={(e) => onSessionDateChange(e.target.value)}
          />
        </div>

        {/* Recording Controls */}
        <div className="space-y-4">
          <div className="flex items-center justify-center space-x-4">
            {!isRecording ? (
              <Button
                onClick={startRecording}
                className="bg-red-500 hover:bg-red-600 text-white"
                size="lg"
              >
                <Mic className="h-5 w-5 mr-2" />
                Start Recording
              </Button>
            ) : (
              <>
                <Button
                  onClick={pauseRecording}
                  variant="outline"
                  size="lg"
                >
                  {isPaused ? (
                    <>
                      <Play className="h-5 w-5 mr-2" />
                      Resume
                    </>
                  ) : (
                    <>
                      <Pause className="h-5 w-5 mr-2" />
                      Pause
                    </>
                  )}
                </Button>
                <Button
                  onClick={stopRecording}
                  className="bg-red-500 hover:bg-red-600 text-white"
                  size="lg"
                >
                  <Square className="h-5 w-5 mr-2" />
                  Stop
                </Button>
              </>
            )}
            
            {(audioBlob || recordingTime > 0) && (
              <Button
                onClick={resetRecording}
                variant="outline"
                size="lg"
              >
                <RefreshCw className="h-5 w-5 mr-2" />
                Reset
              </Button>
            )}
          </div>

          {/* Recording Timer */}
          {isRecording && (
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 text-lg font-mono">
                <Clock className="h-5 w-5 text-red-500" />
                <span className="text-red-500">{formatTime(recordingTime)}</span>
                {isPaused && (
                  <Badge variant="outline" className="ml-2">
                    Paused
                  </Badge>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Audio Playback */}
        {audioUrl && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Recorded Audio</h4>
              <Badge variant="outline">
                {formatTime(recordingTime)}
              </Badge>
            </div>
            <audio controls className="w-full">
              <source src={audioUrl} type="audio/wav" />
              Your browser does not support the audio element.
            </audio>
            
            <div className="flex items-center gap-2">
              <Button
                onClick={transcribeAudio}
                disabled={isTranscribing}
                size="sm"
              >
                {isTranscribing ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Transcribing...
                  </>
                ) : (
                  <>
                    <Mic className="h-4 w-4 mr-2" />
                    Transcribe
                  </>
                )}
              </Button>
            </div>
          </div>
        )}

        {/* Transcription */}
        {transcription && (
          <div className="space-y-2">
            <Label htmlFor="transcription">Transcription</Label>
            <Textarea
              id="transcription"
              value={transcription}
              onChange={(e) => setTranscription(e.target.value)}
              rows={4}
              placeholder="Transcribed text will appear here..."
            />
          </div>
        )}

        {/* Save Session */}
        {(audioBlob || transcription) && (
          <div className="pt-4 border-t">
            <Button className="w-full">
              Save Session
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
})

SessionRecorder.displayName = "SessionRecorder"
