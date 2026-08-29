### Server IP Address

When your machine’s IP address changes due to DHCP, set the new IP address in
the following files:

    packages/api/.env
    packages/ui/.env.development
    packages/ui/next.config.ts
    

### Games to Save

Now that you're actually playing real games with the family, you can no longer
delete all games in the database. Instead, each time a real game is played,
add its `id` to this query:

```sql
DELETE FROM phase10.games
WHERE id NOT IN (
  'a2872148-3270-40fb-9151-a47bc78632e9',
  'cf03e6e7-6736-4669-ac06-dde6c35ce5c7'
);
```

Then you can run this query whenever you need to delete test games after bug
fixes and/or new features.
