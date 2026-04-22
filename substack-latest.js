// Substack Latest Post Widget
// Fetches the newest post from Demelia.substack.com and displays its title

const FEED_URL = "https://demelia.substack.com/feed";

const widget = new ListWidget();
widget.backgroundColor = new Color("#000000");
widget.setPadding(16, 16, 16, 16);

// Create gradient background
const gradient = new LinearGradient();
gradient.colors = [new Color("#1a1a1a"), new Color("#000000")];
gradient.locations = [0.0, 1.0];
widget.backgroundGradient = gradient;

// Add header
const headerStack = widget.addStack();
headerStack.layoutHorizontally();
headerStack.centerAlignContent();

const headerText = headerStack.addText("📰 Latest Post");
headerText.font = new Font("Menlo-Bold", 12);
headerText.textColor = new Color("#FFFFFF");

widget.addSpacer(8);

// Add separator line
const lineStack = widget.addStack();
lineStack.backgroundColor = new Color("#333333");
lineStack.size = new Size(320, 1);

widget.addSpacer(12);

try {
    const req = new Request(FEED_URL);
    const rssText = await req.loadString();

    const title = parseFirstItemTitle(rssText);
    const link = parseFirstItemLink(rssText);
    const pubDate = parseFirstItemPubDate(rssText);

    if (title) {
        const titleText = widget.addText(title);
        titleText.font = new Font("Menlo-Bold", 13);
        titleText.textColor = new Color("#FFFFFF");
        titleText.lineLimit = 3;

        if (pubDate) {
            widget.addSpacer(8);
            const dateText = widget.addText(pubDate);
            dateText.font = new Font("Menlo", 10);
            dateText.textColor = new Color("#888888");
        }

        if (link) {
            widget.url = link;
        }
    } else {
        const errText = widget.addText("No posts found.");
        errText.font = new Font("Menlo", 12);
        errText.textColor = new Color("#FF3B30");
    }
} catch (e) {
    const errText = widget.addText("Failed to load feed.");
    errText.font = new Font("Menlo", 12);
    errText.textColor = new Color("#FF3B30");
}

widget.addSpacer();

// Update time footer
const footerStack = widget.addStack();
footerStack.layoutHorizontally();
footerStack.addSpacer();

const now = new Date();
const hours = now.getHours().toString().padStart(2, "0");
const minutes = now.getMinutes().toString().padStart(2, "0");
const updateText = footerStack.addText(`Updated: ${hours}:${minutes}`);
updateText.font = new Font("Menlo", 10);
updateText.textColor = new Color("#666666");

// Helper: extract the title of the first <item>
function parseFirstItemTitle(xml) {
    const itemMatch = xml.match(/<item[\s>][\s\S]*?<\/item>/);
    if (!itemMatch) return null;
    const item = itemMatch[0];
    const titleMatch = item.match(/<title>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/title>/);
    return titleMatch ? titleMatch[1].trim() : null;
}

// Helper: extract the link of the first <item>
function parseFirstItemLink(xml) {
    const itemMatch = xml.match(/<item[\s>][\s\S]*?<\/item>/);
    if (!itemMatch) return null;
    const item = itemMatch[0];
    // Try <link> tag first, then <guid>
    const linkMatch = item.match(/<link>([\s\S]*?)<\/link>/);
    if (linkMatch) return linkMatch[1].trim();
    const guidMatch = item.match(/<guid[^>]*>([\s\S]*?)<\/guid>/);
    return guidMatch ? guidMatch[1].trim() : null;
}

// Helper: extract and format the pubDate of the first <item>
function parseFirstItemPubDate(xml) {
    const itemMatch = xml.match(/<item[\s>][\s\S]*?<\/item>/);
    if (!itemMatch) return null;
    const item = itemMatch[0];
    const dateMatch = item.match(/<pubDate>([\s\S]*?)<\/pubDate>/);
    if (!dateMatch) return null;
    const d = new Date(dateMatch[1].trim());
    if (isNaN(d.getTime())) return null;
    return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

// Present the widget
if (config.runsInWidget) {
    Script.setWidget(widget);
} else {
    widget.presentMedium();
}
Script.complete();
