# Instructions to get your Supabase Project Reference ID

## Steps to find your Project Reference ID:

1. Go to https://supabase.com/dashboard
2. Select your "wabi-care" project
3. Go to Settings > General
4. Look for "Reference ID" - it will be a string like: `abcdefghijklmnop`
5. Copy this Reference ID

## Once you have the Reference ID:

Replace `YOUR_PROJECT_REF_HERE` in the MCP configuration with your actual project reference ID.

The current configuration is:
```json
{
  "mcpServers": {
    "supabase": {
      "command": "npx",
      "args": [
        "-y",
        "@supabase/mcp-server-supabase",
        "--read-only",
        "--project-ref=YOUR_PROJECT_REF_HERE"
      ],
      "env": {
        "SUPABASE_ACCESS_TOKEN": "sbp_916186f23b0a128f1f68f7ea3344b65c28bce591"
      }
    }
  }
}
```

## Alternative: Try without project scoping first

If you want to test the connection first, you can temporarily remove the `--project-ref` parameter:

```json
{
  "mcpServers": {
    "supabase": {
      "command": "npx",
      "args": [
        "-y",
        "@supabase/mcp-server-supabase",
        "--read-only"
      ],
      "env": {
        "SUPABASE_ACCESS_TOKEN": "sbp_916186f23b0a128f1f68f7ea3344b65c28bce591"
      }
    }
  }
}
```

This will allow the MCP server to list all your projects, and then you can scope it to a specific project later.


