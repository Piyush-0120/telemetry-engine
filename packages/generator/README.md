## What generator does?

1. Every X milliseconds — fire a POST request to /ingest
2. Build a random payload each time
3. Keep track of how many succeeded and failed
4. Print stats every second
5. Stop cleanly when Ctrl+C is pressed