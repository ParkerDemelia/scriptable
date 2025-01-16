// Days Until Widget
// Shows countdown to important dates

const widget = new ListWidget();
widget.backgroundColor = new Color("#000000");
widget.setPadding(16, 16, 16, 16);

// Configure your events here
const events = [
    {
        name: "GRADUATION",
        date: "2025-05-17",
        emoji: "🎓"
    },
    {
        name: "NEW YEAR",
        date: "2025-01-01",
        emoji: "🎆"
    },
    {
        name: "VACATION",
        date: "2025-07-15",  // Change this to your vacation date
        emoji: "🏖"
    }
];

// Create gradient background
const gradient = new LinearGradient();
gradient.colors = [new Color("#1a1a1a"), new Color("#000000")];
gradient.locations = [0.0, 1.0];
widget.backgroundGradient = gradient;

// Add title
const titleStack = widget.addStack();
titleStack.layoutHorizontally();
const titleText = titleStack.addText("Days Until");
titleText.font = new Font("Menlo-Bold", 12);
titleText.textColor = new Color("#FFFFFF");

widget.addSpacer(8);

// Add separator line
const lineStack = widget.addStack();
lineStack.backgroundColor = new Color("#333333");
lineStack.size = new Size(320, 1);

widget.addSpacer(12);

// Calculate and display days until each event
events.forEach((event, index) => {
    const daysUntil = calculateDaysUntil(event.date);
    
    // Create event row
    const eventStack = widget.addStack();
    eventStack.layoutHorizontally();
    eventStack.centerAlignContent();
    
    // Add emoji
    const emojiText = eventStack.addText(event.emoji);
    emojiText.font = Font.systemFont(14);
    
    eventStack.addSpacer(4);
    
    // Add event name
    const nameStack = eventStack.addStack();
    const nameText = nameStack.addText(event.name);
    nameText.font = new Font("Menlo-Bold", 12);
    nameText.textColor = new Color("#FFFFFF");
    
    eventStack.addSpacer();
    
    // Add days count with brackets
    const daysStack = eventStack.addStack();
    
    const leftBracket = daysStack.addText("[");
    leftBracket.font = new Font("Menlo", 12);
    leftBracket.textColor = new Color("#666666");
    
    const daysText = daysStack.addText(daysUntil.toString().padStart(3));
    daysText.font = new Font("Menlo-Bold", 12);
    daysText.textColor = getDaysColor(daysUntil);
    
    const rightBracket = daysStack.addText("]");
    rightBracket.font = new Font("Menlo", 12);
    rightBracket.textColor = new Color("#666666");
    
    // Add spacing between events
    if (index < events.length - 1) {
        widget.addSpacer(8);
    }
});

// Add update time at bottom
widget.addSpacer(12);
const updateStack = widget.addStack();
updateStack.layoutHorizontally();
updateStack.addSpacer();

const now = new Date();
const updateText = updateStack.addText(`Updated: ${formatTime(now)}`);
updateText.font = new Font("Menlo", 10);
updateText.textColor = new Color("#666666");

// Helper functions
function calculateDaysUntil(dateString) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const targetDate = new Date(dateString);
    targetDate.setHours(0, 0, 0, 0);
    
    const diffTime = targetDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
}

function formatTime(date) {
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
}

function getDaysColor(days) {
    if (days <= 7) return new Color("#FF3B30");  // Red for urgent
    if (days <= 30) return new Color("#FFCC00"); // Yellow for soon
    return new Color("#4ECDC4");                 // Cyan for far
}

// Present the widget
if (config.runsInWidget) {
    Script.setWidget(widget);
} else {
    widget.presentMedium();
}
Script.complete(); 