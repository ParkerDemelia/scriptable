// Biorhythm Widget for Scriptable
// A beautiful widget that displays your daily energy levels based on circadian rhythms
// Created by: [Your Name]
// GitHub: [Your GitHub]
// Version: 1.0.0

// Configuration
const config = {
    // Customize your daily schedule
    schedule: {
        wakeTime: 7,     // When you typically wake up
        sleepTime: 23,   // When you typically go to bed
        peakHours: [9, 10, 11, 15, 16], // High energy periods
        dipHours: [13, 14]    // Low energy periods
    },
    
    // Visual settings
    visual: {
        backgroundColor: new Color("#000000"),
        waveColor: new Color("#FFFFFF"),
        timeMarkerColor: new Color("#333333", 0.3),
        timeTextColor: new Color("#666666", 0.5),
        indicatorGlowColor: new Color("#FFFFFF", 0.2),
        waveFillColor: new Color("#FFFFFF", 0.1)
    },
    
    // Widget dimensions
    layout: {
        padding: 16,
        amplitude: 40,
        verticalOffset: 80,
        width: 400,
        height: 140
    }
}

// Initialize widget
const widget = new ListWidget()
widget.backgroundColor = config.visual.backgroundColor
widget.setPadding(config.layout.padding, config.layout.padding, 
                 config.layout.padding, config.layout.padding)

// Time calculations
const now = new Date()
const currentHour = now.getHours() + (now.getMinutes() / 60)
const hours = 24
const horizontalScale = config.layout.width / hours
const currentX = currentHour * horizontalScale

// Setup drawing context
const drawContext = new DrawContext()
drawContext.size = new Size(config.layout.width, config.layout.height)
drawContext.opaque = false
drawContext.respectScreenScale = true

// Draw time markers
function drawTimeMarkers() {
    const timeMarkers = [0, 6, 12, 18, 24]
    for (const hour of timeMarkers) {
        const x = hour * horizontalScale
        
        // Vertical line
        drawContext.setStrokeColor(config.visual.timeMarkerColor)
        drawContext.setLineWidth(1)
        const markerPath = new Path()
        markerPath.move(new Point(x, 20))
        markerPath.addLine(new Point(x, config.layout.height - 20))
        drawContext.addPath(markerPath)
        drawContext.strokePath()
        
        // Hour text
        drawContext.setTextColor(config.visual.timeTextColor)
        drawContext.setFont(Font.systemFont(9))
        const timeText = hour === 24 ? "00" : hour.toString().padStart(2, "0")
        const textOffset = timeText.length * 2.5
        drawContext.drawText(timeText, 
            new Point(x - textOffset, config.layout.height - 12))
    }
}

// Generate wave points
function generateWavePoints() {
    const points = []
    
    // Calculate a consistent Y position for both start and end
    const baseEnergy = Math.sin((20 - 4) * (Math.PI / 12))
    const consistentY = config.layout.verticalOffset - (baseEnergy * config.layout.amplitude * 0.3)
    
    for (let h = 0; h <= hours; h += 0.2) {
        if (h === 0) {
            points.push({ x: 0, y: consistentY })
            continue
        }
        
        if (h === hours) {
            points.push({ x: config.layout.width, y: consistentY })  // Use consistentY here
            continue
        }
        
        // Calculate energy level
        let energy = Math.sin((h - 4) * (Math.PI / 12))
        
        // Apply schedule effects
        if (h < config.schedule.wakeTime) energy *= 0.3
        if (h > config.schedule.sleepTime) energy *= 0.3
        if (config.schedule.dipHours.includes(Math.floor(h))) energy *= 0.7
        if (config.schedule.peakHours.includes(Math.floor(h))) energy *= 1.1
        
        points.push({
            x: h * horizontalScale,
            y: config.layout.verticalOffset - (energy * config.layout.amplitude)
        })
    }
    
    return points
}

// Draw wave and current time indicator
function drawWave(points) {
    // Draw filled wave
    const path = new Path()
    path.move(new Point(0, config.layout.height))
    path.addLine(new Point(points[0].x, points[0].y))
    
    for (let i = 1; i < points.length; i++) {
        path.addLine(new Point(points[i].x, points[i].y))
    }
    
    path.addLine(new Point(config.layout.width, config.layout.height))
    path.closeSubpath()
    
    drawContext.setFillColor(config.visual.waveFillColor)
    drawContext.addPath(path)
    drawContext.fillPath()
    
    // Draw wave line
    const linePath = new Path()
    linePath.move(new Point(points[0].x, points[0].y))
    for (let i = 1; i < points.length; i++) {
        linePath.addLine(new Point(points[i].x, points[i].y))
    }
    
    drawContext.setStrokeColor(config.visual.waveColor)
    drawContext.setLineWidth(1.5)
    drawContext.addPath(linePath)
    drawContext.strokePath()
}

// Draw current time indicator
function drawTimeIndicator(currentY) {
    // Glow effect
    const glowRadius = 12
    const glowPath = new Path()
    glowPath.addEllipse(new Rect(
        currentX - glowRadius/2,
        currentY - glowRadius/2,
        glowRadius,
        glowRadius
    ))
    drawContext.setFillColor(config.visual.indicatorGlowColor)
    drawContext.addPath(glowPath)
    drawContext.fillPath()
    
    // Indicator dot
    drawContext.setFillColor(config.visual.waveColor)
    drawContext.fillEllipse(new Rect(currentX - 3, currentY - 3, 6, 6))
}

// Add current time display
function addTimeDisplay() {
    const topStack = widget.addStack()
    topStack.layoutHorizontally()
    topStack.addSpacer()
    const timeText = topStack.addText(formatTime(now))
    timeText.font = Font.mediumSystemFont(12)
    timeText.textColor = new Color("#FFFFFF", 0.8)
}

// Add status and suggestion text
function addStatusText(currentHour) {
    widget.addSpacer(75)
    
    const statusText = widget.addText(getCurrentPhase(currentHour))
    statusText.font = Font.systemFont(12)
    statusText.textColor = new Color("#FFFFFF", 0.9)
    statusText.lineLimit = 1
    
    widget.addSpacer(4)
    
    const suggestionText = widget.addText(getActivitySuggestion(currentHour))
    suggestionText.font = Font.systemFont(10)
    suggestionText.textColor = new Color("#FFFFFF", 0.6)
    suggestionText.lineLimit = 1
}

// Helper functions
function formatTime(date) {
    const hours = date.getHours() % 12 || 12
    const minutes = date.getMinutes().toString().padStart(2, '0')
    const ampm = date.getHours() >= 12 ? 'PM' : 'AM'
    return `${hours}:${minutes} ${ampm}`
}

function getCurrentPhase(hour) {
    if (hour < config.schedule.wakeTime) return "🌙 Rest & Recovery"
    if (config.schedule.peakHours.includes(Math.floor(hour))) return "⚡️ Peak Performance"
    if (config.schedule.dipHours.includes(Math.floor(hour))) return "💭 Recharge"
    if (hour > config.schedule.sleepTime) return "🌙 Wind Down"
    return "▪️ Flow"
}

function getActivitySuggestion(hour) {
    if (hour < config.schedule.wakeTime) return "Quality sleep is crucial for peak performance"
    if (config.schedule.peakHours.includes(Math.floor(hour))) return "Perfect time for challenging tasks"
    if (config.schedule.dipHours.includes(Math.floor(hour))) return "Take a short walk or power nap"
    if (hour > config.schedule.sleepTime) return "Prepare for rest, avoid blue light"
    return "Maintain steady flow"
}

// Main execution
function createWidget() {
    addTimeDisplay()
    
    drawTimeMarkers()
    const points = generateWavePoints()
    const currentY = points[Math.floor((currentHour / 24) * points.length)].y
    
    drawWave(points)
    drawTimeIndicator(currentY)
    
    widget.backgroundImage = drawContext.getImage()
    addStatusText(currentHour)
    
    return widget
}

// Run widget
if (config.runsInWidget) {
    Script.setWidget(createWidget())
} else {
    createWidget().presentMedium()
}
Script.complete() 