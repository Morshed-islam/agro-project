"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { useState } from "react"

export function CattleFilters() {
  const [priceRange, setPriceRange] = useState([0, 500000])

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">জাত</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-2">
            <Checkbox id="brahma" />
            <Label htmlFor="brahma" className="text-sm font-normal cursor-pointer">
              ব্রাহমা
            </Label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox id="deshi" />
            <Label htmlFor="deshi" className="text-sm font-normal cursor-pointer">
              দেশি
            </Label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox id="sindhi" />
            <Label htmlFor="sindhi" className="text-sm font-normal cursor-pointer">
              সিন্ধি
            </Label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox id="sahiwal" />
            <Label htmlFor="sahiwal" className="text-sm font-normal cursor-pointer">
              সাহিওয়াল
            </Label>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">ওজন</CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup defaultValue="all">
            <div className="flex items-center gap-2">
              <RadioGroupItem value="all" id="weight-all" />
              <Label htmlFor="weight-all" className="text-sm font-normal cursor-pointer">
                সব
              </Label>
            </div>
            <div className="flex items-center gap-2">
              <RadioGroupItem value="300-400" id="weight-300" />
              <Label htmlFor="weight-300" className="text-sm font-normal cursor-pointer">
                ৩০০-৪০০ কেজি
              </Label>
            </div>
            <div className="flex items-center gap-2">
              <RadioGroupItem value="400-500" id="weight-400" />
              <Label htmlFor="weight-400" className="text-sm font-normal cursor-pointer">
                ৪০০-৫০০ কেজি
              </Label>
            </div>
            <div className="flex items-center gap-2">
              <RadioGroupItem value="500+" id="weight-500" />
              <Label htmlFor="weight-500" className="text-sm font-normal cursor-pointer">
                ৫০০+ কেজি
              </Label>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">মূল্য সীমা</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Slider value={priceRange} onValueChange={setPriceRange} max={500000} step={10000} className="w-full" />
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">৳{priceRange[0].toLocaleString()}</span>
            <span className="text-muted-foreground">৳{priceRange[1].toLocaleString()}</span>
          </div>
        </CardContent>
      </Card>

      <Button variant="outline" className="w-full bg-transparent">
        ফিল্টার রিসেট করুন
      </Button>
    </div>
  )
}
