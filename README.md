# PlanMess — Plan-Vermessung als PWA

Eine Progressive Web App zur präzisen Vermessung von PDF-Plänen, optimiert für Android-Tablets.

## Features

- **PDF-Anzeige** mit pinch-to-zoom (bis 4000 %), pan, mehrseitige PDFs
- **Maßstab manuell** setzen (1:50/100/200/500 als Schnellwahl, oder freier Wert) **oder per Strecke kalibrieren** (bekannte Länge im Plan abmessen, reale Länge eintragen)
- **Linien** mit Längenanzeige in m / cm / mm
- **Polygon-Flächen** mit Fläche, Umfang und Kantenlängen
- **Winkel** (3-Punkt-Messung) mit Bogen-Visualisierung
- **Endpunkte verschieben** (Edit-Modus): jeden Punkt einer existierenden Messung greifen und neu setzen
- **Snapping** auf Endpunkte/Knoten existierender Messungen (umschaltbar)
- **Lupe** beim Zeichnen — eine 180px-Kreislupe mit 3× Vergrößerung erscheint automatisch über dem Finger und zeigt einen grünen Ring, wenn Snap fängt
- **Layer/Ebenen** mit Farben, Sichtbarkeit, Umbenennen
- **Liste aller Messungen** mit Summen, Einzellöschen, Export als TSV
- **Offline** nach erstem Laden (Service Worker cached App + PDF.js)
- **Auto-Save** von Maßstab, Layern, Messungen via LocalStorage

## Installation auf dem Android-Tablet

### Variante 1: Lokal hosten (empfohlen)

PWAs brauchen HTTPS oder `localhost`. Die einfachste Variante ist, die Dateien auf einem kleinen Webspace abzulegen (alle gängigen Hoster mit HTTPS reichen — Netlify Drop, Cloudflare Pages, GitHub Pages, ein eigener Server, ein Synology / NAS mit HTTPS, etc.).

1. Den Ordner mit allen Dateien (`index.html`, `manifest.webmanifest`, `sw.js`, `icon-*.png`) auf den Webspace hochladen.
2. Auf dem Tablet die URL in **Chrome** öffnen.
3. Menü → **„Zum Startbildschirm hinzufügen"** (manchmal heißt es „App installieren").
4. Die App startet danach im Vollbild ohne Browser-Leiste, läuft offline.

### Variante 2: Direkt vom Tablet öffnen (ohne Server)

Geht zur Not, aber **ohne PWA-Installation und ohne Service Worker** (Browser blockt SW bei `file://`):

1. Alle Dateien per USB / Cloud auf das Tablet kopieren.
2. `index.html` mit Chrome öffnen.
3. Funktioniert grundsätzlich, aber: keine Installation als App, keine Offline-Garantie wenn die PDF.js-CDN nicht erreichbar ist.

### Variante 3: Lokaler Mini-Server auf dem Tablet

Die App-Stores haben kleine Webserver-Apps („Simple HTTP Server", „Termux + python -m http.server"). Damit die Dateien auf `localhost:8080` ausliefern, im Browser öffnen, „Zum Startbildschirm hinzufügen" — funktioniert dann mit voller PWA-Funktionalität.

## Bedienung

**Werkzeuge in der unteren Leiste**:
- **Hand** — Pan & Zoom (Doppeltipp = Plan einpassen)
- **Linie** — Tippe Anfang und Ende, *oder* drücken-ziehen-loslassen
- **Fläche** — Punkte tippen, ersten Punkt erneut tippen zum Schließen
- **Winkel** — drei Punkte: Schenkel A, Scheitel, Schenkel B
- **Edit** — gezogene Endpunkte greifen und verschieben

**Snap**-Knopf umschaltbar (rechts unten). Bei aktivem Snap rastet auf Endpunkte/Knoten existierender Messungen mit ~16 px-Toleranz.

**Maßstab-Knopf** öffnet die Kalibrierung. Empfehlung für die Beispieldatei: dort ist `Maßstab 1:50` im Schriftfeld vermerkt → einfach auf den Schnellwahl-Knopf "1:50" tippen, fertig. Wenn unsicher: „Strecke im Plan abmessen", eine Bemaßung wie z. B. "5,92" abgreifen, 5,92 m eintragen — Maßstab wird berechnet.

**Lupe** erscheint automatisch beim Zeichnen/Editieren. Grüner Ring = gerade gesnappt.

## Technische Hinweise

- PDF-DPI: PDFs aus CAD-Programmen sind meist mit **72 DPI** intern, das ist der Default. Wenn ein Plan exportiert wurde mit anderer DPI, im Maßstab-Dialog korrigieren — oder einfach per Strecken-Kalibrierung machen, dann ist der DPI-Wert egal.
- Die App speichert Maßstab + Messungen + Layer pro Browser-Profil. Beim Laden eines neuen PDFs werden Messungen geleert (der Maßstab bleibt).
- Export ist TSV (Tab-getrennt), öffnet sich in Excel und Google Sheets.

## Was die App **nicht** kann

- Kein Snapping auf Linien innerhalb des PDFs selbst (nur auf eigene Endpunkte). Für präzise Punktsetzung gibt es stattdessen die Lupe + hohen Zoom (bis 4000 %).
- Kein Speichern von Anmerkungen *zurück* ins PDF — Messungen leben in der App, Export geht als TSV.
