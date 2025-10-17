"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ReactNode } from "react"

interface DataCollectionTabsProps {
  capture: ReactNode
  graph: ReactNode
  stats: ReactNode
  documents: ReactNode
}

export function DataCollectionTabs({ capture, graph, stats, documents }: DataCollectionTabsProps) {
  return (
    <Tabs defaultValue="capture" className="w-full h-full">
      <div className="mb-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="capture">Capture</TabsTrigger>
          <TabsTrigger value="graph">Graph</TabsTrigger>
          <TabsTrigger value="stats">Stats</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
        </TabsList>
      </div>
      <TabsContent value="capture" className="h-full">{capture}</TabsContent>
      <TabsContent value="graph" className="h-full">{graph}</TabsContent>
      <TabsContent value="stats" className="h-full">{stats}</TabsContent>
      <TabsContent value="documents" className="h-full">{documents}</TabsContent>
    </Tabs>
  )
}

