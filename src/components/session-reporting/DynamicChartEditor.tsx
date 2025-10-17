"use client"

import { useState, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  BarChart3,
  LineChart,
  PieChart,
  TrendingUp,
  Settings,
  Download,
  Save,
  Edit3,
  Trash2
} from "lucide-react"

interface ChartData {
  id: string
  type: 'bar' | 'line' | 'pie' | 'scatter'
  title: string
  data: {
    labels: string[]
    datasets: {
      label: string
      data: number[]
      backgroundColor?: string
      borderColor?: string
    }[]
  }
  options?: {
    responsive: boolean
    maintainAspectRatio: boolean
    scales?: any
  }
}

interface DynamicChartEditorProps {
  goal: string
  initialData?: ChartData
  onSave: (chartData: ChartData) => void
  onClose: () => void
}

export default function DynamicChartEditor({ 
  goal, 
  initialData, 
  onSave, 
  onClose 
}: DynamicChartEditorProps) {
  const [chartData, setChartData] = useState<ChartData>(
    initialData || {
      id: `chart-${Date.now()}`,
      type: 'bar',
      title: `${goal} Performance`,
      data: {
        labels: ['Trial 1', 'Trial 2', 'Trial 3', 'Trial 4', 'Trial 5'],
        datasets: [{
          label: 'Accuracy %',
          data: [80, 85, 90, 75, 88],
          backgroundColor: 'rgba(236, 72, 153, 0.2)',
          borderColor: 'rgba(236, 72, 153, 1)'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false
      }
    }
  )

  const [activeTab, setActiveTab] = useState("data")

  // Update chart type
  const updateChartType = useCallback((type: ChartData['type']) => {
    setChartData(prev => ({ ...prev, type }))
  }, [])

  // Update chart title
  const updateTitle = useCallback((title: string) => {
    setChartData(prev => ({ ...prev, title }))
  }, [])

  // Add data point
  const addDataPoint = useCallback(() => {
    setChartData(prev => ({
      ...prev,
      data: {
        ...prev.data,
        labels: [...prev.data.labels, `Trial ${prev.data.labels.length + 1}`],
        datasets: prev.data.datasets.map(dataset => ({
          ...dataset,
          data: [...dataset.data, Math.floor(Math.random() * 40) + 60] // Random value between 60-100
        }))
      }
    }))
  }, [])

  // Remove data point
  const removeDataPoint = useCallback((index: number) => {
    setChartData(prev => ({
      ...prev,
      data: {
        ...prev.data,
        labels: prev.data.labels.filter((_, i) => i !== index),
        datasets: prev.data.datasets.map(dataset => ({
          ...dataset,
          data: dataset.data.filter((_, i) => i !== index)
        }))
      }
    }))
  }, [])

  // Update data value
  const updateDataValue = useCallback((datasetIndex: number, dataIndex: number, value: number) => {
    setChartData(prev => ({
      ...prev,
      data: {
        ...prev.data,
        datasets: prev.data.datasets.map((dataset, dIndex) => 
          dIndex === datasetIndex 
            ? {
                ...dataset,
                data: dataset.data.map((val, vIndex) => 
                  vIndex === dataIndex ? value : val
                )
              }
            : dataset
        )
      }
    }))
  }, [])

  // Render chart preview
  const renderChartPreview = () => {
    const { type, data } = chartData
    
    return (
      <div className="h-64 border rounded-lg p-4 bg-gray-50">
        <div className="h-full flex items-center justify-center">
          <div className="text-center">
            <div className="text-lg font-semibold mb-2">{chartData.title}</div>
            <div className="text-sm text-gray-600 mb-4">
              {type === 'bar' && 'Bar Chart Preview'}
              {type === 'line' && 'Line Chart Preview'}
              {type === 'pie' && 'Pie Chart Preview'}
              {type === 'scatter' && 'Scatter Plot Preview'}
            </div>
            
            {/* Simple chart visualization */}
            <div className="flex items-end justify-center gap-2 h-32">
              {data.datasets[0].data.map((value, index) => (
                <div key={index} className="flex flex-col items-center">
                  <div 
                    className="bg-pink-500 w-8 rounded-t"
                    style={{ height: `${(value / 100) * 120}px` }}
                  />
                  <div className="text-xs mt-1">{value}%</div>
                  <div className="text-xs text-gray-500">{data.labels[index]}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Chart Editor - {goal}
            </CardTitle>
            <CardDescription>
              Create and customize charts for your session report
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={() => onSave(chartData)}>
              <Save className="h-4 w-4 mr-2" />
              Save Chart
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="data">Data</TabsTrigger>
            <TabsTrigger value="style">Style</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>

          <TabsContent value="data" className="mt-4">
            <div className="space-y-6">
              {/* Chart Type */}
              <div>
                <Label htmlFor="chart-type">Chart Type</Label>
                <Select value={chartData.type} onValueChange={updateChartType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bar">
                      <div className="flex items-center gap-2">
                        <BarChart3 className="h-4 w-4" />
                        Bar Chart
                      </div>
                    </SelectItem>
                    <SelectItem value="line">
                      <div className="flex items-center gap-2">
                        <LineChart className="h-4 w-4" />
                        Line Chart
                      </div>
                    </SelectItem>
                    <SelectItem value="pie">
                      <div className="flex items-center gap-2">
                        <PieChart className="h-4 w-4" />
                        Pie Chart
                      </div>
                    </SelectItem>
                    <SelectItem value="scatter">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4" />
                        Scatter Plot
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Chart Title */}
              <div>
                <Label htmlFor="chart-title">Chart Title</Label>
                <Input
                  id="chart-title"
                  value={chartData.title}
                  onChange={(e) => updateTitle(e.target.value)}
                  placeholder="Enter chart title"
                />
              </div>

              {/* Data Points */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <Label>Data Points</Label>
                  <Button size="sm" onClick={addDataPoint}>
                    <Edit3 className="h-4 w-4 mr-1" />
                    Add Point
                  </Button>
                </div>
                
                <div className="space-y-2">
                  {chartData.data.labels.map((label, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Input
                        value={label}
                        onChange={(e) => {
                          setChartData(prev => ({
                            ...prev,
                            data: {
                              ...prev.data,
                              labels: prev.data.labels.map((l, i) => 
                                i === index ? e.target.value : l
                              )
                            }
                          }))
                        }}
                        className="flex-1"
                      />
                      <Input
                        type="number"
                        value={chartData.data.datasets[0].data[index]}
                        onChange={(e) => updateDataValue(0, index, parseInt(e.target.value) || 0)}
                        className="w-20"
                        min="0"
                        max="100"
                      />
                      <span className="text-sm text-gray-500">%</span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => removeDataPoint(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="style" className="mt-4">
            <div className="space-y-6">
              <div>
                <Label>Chart Colors</Label>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <div>
                    <Label htmlFor="bg-color">Background Color</Label>
                    <Input
                      id="bg-color"
                      type="color"
                      value={chartData.data.datasets[0].backgroundColor || '#ec4899'}
                      onChange={(e) => {
                        setChartData(prev => ({
                          ...prev,
                          data: {
                            ...prev.data,
                            datasets: prev.data.datasets.map((dataset, index) => 
                              index === 0 ? { ...dataset, backgroundColor: e.target.value } : dataset
                            )
                          }
                        }))
                      }}
                    />
                  </div>
                  <div>
                    <Label htmlFor="border-color">Border Color</Label>
                    <Input
                      id="border-color"
                      type="color"
                      value={chartData.data.datasets[0].borderColor || '#ec4899'}
                      onChange={(e) => {
                        setChartData(prev => ({
                          ...prev,
                          data: {
                            ...prev.data,
                            datasets: prev.data.datasets.map((dataset, index) => 
                              index === 0 ? { ...dataset, borderColor: e.target.value } : dataset
                            )
                          }
                        }))
                      }}
                    />
                  </div>
                </div>
              </div>

              <div>
                <Label>Chart Options</Label>
                <div className="space-y-2 mt-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={chartData.options?.responsive || false}
                      onChange={(e) => {
                        setChartData(prev => ({
                          ...prev,
                          options: { ...prev.options, responsive: e.target.checked }
                        }))
                      }}
                    />
                    <Label>Responsive</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={chartData.options?.maintainAspectRatio || false}
                      onChange={(e) => {
                        setChartData(prev => ({
                          ...prev,
                          options: { ...prev.options, maintainAspectRatio: e.target.checked }
                        }))
                      }}
                    />
                    <Label>Maintain Aspect Ratio</Label>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="preview" className="mt-4">
            {renderChartPreview()}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
