# The Human Test

A cross-platform mobile game for iOS and Android built with React Native (Expo). Players are shown two historical events side by side and must decide which came first. The app pulls live data from Wikidata and Wikipedia, giving it a pool of over 70,000 events without requiring a backend server.

---

## Table of Contents

- [How It Works](#how-it-works)
- [Tech Stack](#tech-stack)
- [Data Pipeline](#data-pipeline)
- [External API Integration](#external-api-integration)
  - [Wikidata SPARQL API](#wikidata-sparql-api)
  - [Wikipedia REST API](#wikipedia-rest-api)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)

---

## How It Works

Each round presents the player with two historical events — a title and an accompanying image for each. The player taps the event they believe happened first. A correct answer advances to the next round; an incorrect answer costs one life. The game ends when all three lives are lost.

- **Lives:** 3
- **Scoring:** One point per correct answer; tracked locally on device
- **Event pool:** 70,000+ events sourced dynamically from Wikidata

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React Native (Expo) |
| Language | TypeScript |
| Data source | Wikidata SPARQL API |
| Images | Wikipedia REST API |
| Local storage | AsyncStorage (on-device score tracking) |
| Platform | iOS and Android |

---

## Data Pipeline

The app has no backend server. All event data is fetched at runtime directly from public APIs. The pipeline runs in three stages:

**1. Query**
The app sends a SPARQL query to the Wikidata Query Service to retrieve a randomized set of historical events with their dates and Wikipedia article identifiers.

**2. Enrich**
For each event returned by Wikidata, the app calls the Wikipedia REST API using the article identifier to fetch a representative image. Images are loaded on demand rather than bundled with the app, keeping the install size small.

**3. Render**
The app pairs two events, strips their dates from the display, and presents them to the player. Dates are retained in state only for answer validation.

---

## External API Integration

### Wikidata SPARQL API

**Endpoint**
```
GET https://query.wikidata.org/sparql
```

**Query parameters**

| Parameter | Value |
|-----------|-------|
| `query` | SPARQL query string (URL-encoded) |
| `format` | `json` |

**Example query**

The following SPARQL query retrieves up to 1,000 historical events per run. Five separate queries — each targeting a different date range — were used to build the app's JSON databases, producing a combined pool of 70,000+ events.

```sparql
SELECT ?event ?date ?label ?image {
  ?event wdt:P31/wdt:P279* wd:Q1190554 .  # match events that are a subtype of "occurrence"
  ?event wdt:P585 ?date .                  # must have a single point-in-time date
  filter(year(?date) > -3000)              # date range: lower bound
  filter(year(?date) < 3)                  # date range: upper bound
  ?event rdfs:label ?label .               # fetch the event label
  filter(lang(?label) = 'en')             # English labels only
  ?event wdt:P18 ?image .                  # must have an associated image

  filter(!regex(?label, "\\d", "i"))       # exclude titles containing numbers (e.g. years)
  filter(!regex(?label, "solar eclipse", "i"))  # exclude solar eclipse events
  filter(!regex(?label, "wiki", "i"))      # exclude internal Wikimedia entries
}
LIMIT 1000
```

**Why the filters matter**

| Filter | Purpose |
|--------|---------|
| `wdt:P31/wdt:P279*` | Traverses the Wikidata type hierarchy to match any subtype of "occurrence," casting a wide net across event categories |
| `wdt:P585` | Restricts to events with a single point-in-time date, which is required for the game's "which came first" comparison |
| `wdt:P18` | Requires an image, ensuring every event can be displayed in the side-by-side card UI |
| `!regex(\\d)` | Prevents titles like "1969 Moon Landing" from leaking the answer to the player |
| `!regex(solar eclipse)` | Removes a disproportionately common event type that would skew the distribution |
| `!regex(wiki)` | Excludes internal Wikimedia administrative entries that are not meaningful game events |
| `LIMIT 1000` | Caps results per query to avoid Wikidata endpoint timeouts; multiple queries across date ranges compensate for the cap |

**Response structure**

```json
{
  "results": {
    "bindings": [
      {
        "event": { "type": "uri", "value": "http://www.wikidata.org/entity/Q12345" },
        "eventLabel": { "type": "literal", "value": "Moon landing" },
        "date": { "type": "literal", "value": "1969-07-20T00:00:00Z" },
        "article": { "type": "uri", "value": "https://en.wikipedia.org/wiki/Apollo_11" }
      }
    ]
  }
}
```

**Key fields**

| Field | Description |
|-------|-------------|
| `eventLabel.value` | Display title shown to the player |
| `date.value` | ISO 8601 timestamp used for answer validation (never shown to player) |
| `article.value` | Wikipedia article URL; the page title is extracted from this to call the Wikipedia API |

---

### Wikipedia REST API

The Wikipedia article title extracted from the Wikidata response is used to fetch a representative image for each event.

**Endpoint**
```
GET https://en.wikipedia.org/api/rest_v1/page/summary/{title}
```

**Path parameter**

| Parameter | Description |
|-----------|-------------|
| `title` | Wikipedia article title, URL-encoded (e.g. `Apollo_11`) |

**Example request**
```
GET https://en.wikipedia.org/api/rest_v1/page/summary/Apollo_11
```

**Response structure**

```json
{
  "title": "Apollo 11",
  "extract": "Apollo 11 was the American spaceflight that first landed humans on the Moon.",
  "thumbnail": {
    "source": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/Aldrin_Apollo_11.jpg/320px-Aldrin_Apollo_11.jpg",
    "width": 320,
    "height": 240
  },
  "originalimage": {
    "source": "https://upload.wikimedia.org/wikipedia/commons/9/98/Aldrin_Apollo_11.jpg",
    "width": 2048,
    "height": 1536
  }
}
```

**Key fields**

| Field | Description |
|-------|-------------|
| `thumbnail.source` | Scaled image URL used for in-game display |
| `originalimage.source` | Full-resolution image (used as fallback) |

If `thumbnail` is absent from the response, the event is discarded and replaced with another from the Wikidata result set.

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v14 or higher
- [Expo Go](https://expo.dev/go) installed on your iOS or Android device, or a configured emulator

### Installation

```bash
git clone https://github.com/Ab-Salem/The-Human-Test-IOS-Android.git
cd The-Human-Test-IOS-Android
npm install
```

### Running the App

```bash
npx expo start
```

Scan the QR code with Expo Go on your device, or press `a` for the Android emulator or `i` for the iOS simulator.

---

## Project Structure

```
The-Human-Test-IOS-Android/
├── app/                  # Screen components and file-based routing
├── components/           # Reusable UI components
├── assets/               # Static images and fonts
├── constants/            # App-wide constants (colors, config)
├── hooks/                # Custom React hooks
├── scripts/              # Data generation and utility scripts
├── app.json              # Expo configuration
└── package.json
```

---

## License

MIT License. See `LICENSE` for details.
