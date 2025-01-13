const COLUMNS = 13;
const ROWS = 4;
const PADDING = 8;
const CELL_SIZE = 6;
const WP = 24;

const widget = new ListWidget();
widget.setPadding(WP, WP, WP, WP);
widget.backgroundColor = new Color("#000000");

const now = new Date();
const start = new Date(now.getFullYear(), 0, 1);
const week = Math.ceil((((now - start) / 86400000) + start.getDay() + 1) / 7);

for (let row = 0; row < ROWS; row++) {
    const rowStack = widget.addStack();
    rowStack.layoutHorizontally();

    for (let col = 0; col < COLUMNS; col++) {
        const thisWeek = row * COLUMNS + col + 1;
        var thisCell = week >= thisWeek ? 1 : 0.4;

        if (thisWeek > 52) thisCell = 0;

        const boxStack = rowStack.addStack();
        boxStack.backgroundColor = new Color("#ffffff", thisCell);
        boxStack.cornerRadius = CELL_SIZE / 2;
        boxStack.size = new Size(CELL_SIZE, CELL_SIZE);

        if (col < COLUMNS - 1) {
            rowStack.addSpacer();
        }
    }

    if (row < ROWS - 1) {
        widget.addSpacer(PADDING);
    }
}

widget.addSpacer(20);
const font = new Font("Menlo", 14);
const textRow = widget.addStack();
textRow.spacing = 10;
textRow.layoutHorizontally();

const dateText = textRow.addText(now.toLocaleDateString());
dateText.font = font;
dateText.textColor = new Color("#ffffff");
textRow.addSpacer();

const weekGroup = textRow.addStack();
weekGroup.layoutHorizontally();

const weekNum = weekGroup.addText(Week ${week});
weekNum.font = font;
weekNum.textColor = new Color("#ffffff");

const totalWeeks = weekGroup.addText("/52");
totalWeeks.font = font;
totalWeeks.textColor = new Color("#ffffff", 0.4);

if (config.runsInWidget) {
    Script.setWidget(widget);
} else {
    widget.presentMedium();
}
Script.complete();