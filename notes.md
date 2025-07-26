## Reminder

- Use hourly cron jobs to start
- Upgrade to using an optimized inngest scheduled events that allows more specific reminder times (minutes, seconds?)
  - Scheduled events will be stored in the db and a new event will only be scheduled if there is not already one scheduled for that time.
  - The scheduled event will handle every reminder to be sent within that time.
