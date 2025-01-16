const COLUMNS = 4;
const ROWS = 3;
const PADDING = 12;
const WP = 24;

const widget = new ListWidget();
widget.setPadding(WP, WP, WP, WP);
widget.backgroundColor = new Color("#000000");

const now = new Date();
const currentMonth = now.getMonth();

// Create gradient background
const gradient = new LinearGradient();
gradient.colors = [new Color("#1a1a1a"), new Color("#000000")];
gradient.locations = [0.0, 1.0];
widget.backgroundGradient = gradient;

// Month abbreviations
const monthNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

// Create month grid
for (let row = 0; row < ROWS; row++) {
    const rowStack = widget.addStack();
    rowStack.layoutHorizontally();
    rowStack.centerAlignContent();
    
    for (let col = 0; col < COLUMNS; col++) {
        const monthIndex = row * COLUMNS + col;
        const monthStack = rowStack.addStack();
        monthStack.layoutHorizontally();
        monthStack.centerAlignContent();
        
        // Left bracket
        const leftBracket = monthStack.addText("[");
        leftBracket.font = new Font("Menlo-Bold", 12);
        leftBracket.textColor = new Color("#666666");
        
        // Month text
        const monthText = monthStack.addText(monthNames[monthIndex]);
        monthText.font = new Font("Menlo-Bold", 12);
        
        // Highlight current month
        if (monthIndex === currentMonth) {
            monthText.textColor = new Color("#4ECDC4"); // Cyan for current month
        } else {
            monthText.textColor = new Color("#FFFFFF", 0.6); // Dimmed for other months
        }
        
        // Right bracket
        const rightBracket = monthStack.addText("]");
        rightBracket.font = new Font("Menlo-Bold", 12);
        rightBracket.textColor = new Color("#666666");
        
        if (col < COLUMNS - 1) {
            rowStack.addSpacer();
        }
    }
    
    if (row < ROWS - 1) {
        widget.addSpacer(PADDING);
    }
}

if (config.runsInWidget) {
    Script.setWidget(widget);
} else {
    widget.presentMedium();
}
Script.complete();