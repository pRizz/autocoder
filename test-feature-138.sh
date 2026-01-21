#!/bin/bash
# Test Feature #138 - New project has sensible defaults

# Create project with minimal info
echo "Creating test project with minimal info..."
curl -s -X POST http://localhost:3001/api/projects \
  -H "Content-Type: application/json" \
  -d '{"name": "test-defaults-138", "path": "/tmp/test-defaults-138"}'

echo ""
echo ""

# Get the project to verify defaults
echo "Getting project to verify defaults..."
curl -s http://localhost:3001/api/projects/test-defaults-138

echo ""
echo ""

# Cleanup - delete test project
echo "Cleaning up test project..."
curl -s -X DELETE http://localhost:3001/api/projects/test-defaults-138
echo "Done"
