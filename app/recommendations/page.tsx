"use client"

import { useState, useRef, useEffect } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ThemeToggle } from "@/components/theme-toggle"
import {
  cloudRecommendations,
  type CloudProvider,
  type VantagePoints,
  type QuorumType,
} from "../data/cloudReccomendations"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, MapPin } from "lucide-react"
import { WorldMap } from "@/components/WorldMap"

export default function Recommendations() {
  const [step, setStep] = useState(1)
  const [provider, setProvider] = useState<CloudProvider | "">("")
  const [vantagePoints, setVantagePoints] = useState<VantagePoints | "">("")
  const [quorum, setQuorum] = useState<QuorumType | "">("")
  const [results, setResults] = useState<string[][]>([])
  const [error, setError] = useState<string | null>(null)
  const [expandedMap, setExpandedMap] = useState<number | null>(null)

  const stepRefs = [useRef<HTMLDivElement>(null), useRef<HTMLDivElement>(null), useRef<HTMLDivElement>(null)]

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1)
    } else if (provider && vantagePoints && quorum) {
      try {
        const providerData = cloudRecommendations[provider]
        if (!providerData) throw new Error(`No data found for provider: ${provider}`)

        const vantagePointsData = providerData[vantagePoints]
        if (!vantagePointsData) throw new Error(`No data found for vantage points: ${vantagePoints}`)

        //@ts-ignore
        const quorumData = vantagePointsData[quorum]
        if (!quorumData) throw new Error(`No data found for quorum type: ${quorum}`)

        setResults(quorumData)
        setError(null)
      } catch (err) {
        console.error(err)
        setError(err instanceof Error ? err.message : "An unexpected error occurred")
        setResults([])
      }
    }
  }

  useEffect(() => {
    if (step > 1 && stepRefs[step - 1].current) {
      stepRefs[step - 1].current?.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }, [step, stepRefs]) // Added stepRefs to dependencies

  const renderStep = (currentStep: number) => (
    <Card className="mb-8" ref={stepRefs[currentStep - 1]}>
      <CardHeader>
        <CardTitle>Step {currentStep} of 3</CardTitle>
        <CardDescription>
          {currentStep === 1 && "Select your cloud provider"}
          {currentStep === 2 && "Choose the number of vantage points"}
          {currentStep === 3 && "Select the quorum count"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {currentStep === 1 && (
          <Select
            onValueChange={(value: CloudProvider) => {
              setProvider(value)
              handleNext()
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select cloud provider" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="google">Google Cloud Platform</SelectItem>
              <SelectItem value="aws">Amazon Web Services</SelectItem>
            </SelectContent>
          </Select>
        )}
        {currentStep === 2 && (
          <Select
            onValueChange={(value: VantagePoints) => {
              setVantagePoints(value)
              handleNext()
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select vantage points" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="vps7">7 Vantage Points</SelectItem>
              <SelectItem value="vps6">6 Vantage Points</SelectItem>
              <SelectItem value="vps5">5 Vantage Points</SelectItem>
              <SelectItem value="vps4">4 Vantage Points</SelectItem>
            </SelectContent>
          </Select>
        )}
        {currentStep === 3 && (
          <Select
            onValueChange={(value: QuorumType) => {
              setQuorum(value)
              handleNext()
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select quorum" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="quorumFull">Full Quorum (N)</SelectItem>
              <SelectItem value="quorumN-1">N-1 Quorum</SelectItem>
              <SelectItem value="quorumN-2">N-2 Quorum</SelectItem>
            </SelectContent>
          </Select>
        )}
      </CardContent>
    </Card>
  )

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <header className="p-4 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-800 dark:to-purple-800 flex justify-between items-center sticky top-0 z-10">
        <h1 className="text-3xl font-bold text-white">MarcoPolo</h1>
        <ThemeToggle />
      </header>
      <div className="container mx-auto p-4 mt-8">
        <h1 className="text-3xl font-bold mb-8 dark:text-white">Cloud Resilience Recommendations</h1>
        {[1, 2, 3].map((s) => step >= s && renderStep(s))}
        {error && (
          <Alert variant="destructive" className="mb-8">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {results.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Recommended Configurations</CardTitle>
              <CardDescription>Top resilient combinations for your selected criteria</CardDescription>
            </CardHeader>
            <CardContent>
              {results.map((result, index) => (
                <div key={index} className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-semibold text-lg">Configuration {index + 1}</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setExpandedMap(expandedMap === index ? null : index)}
                    >
                      <MapPin className="h-4 w-4 mr-2" />
                      {expandedMap === index ? "Hide Map" : "Show Map"}
                    </Button>
                  </div>
                  <p className="bg-gray-200 dark:bg-gray-700 p-3 rounded mb-2">{result.join(", ")}</p>
                  {expandedMap === index && provider && (
                    <div className="mt-4">
                      <WorldMap vantagePoints={result} provider={provider} />
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        )}
        <Button variant="outline" className="w-full">
          <a href="/results.pdf" download>
            Download Full Results (PDF)
          </a>
        </Button>
      </div>
    </div>
  )
}

