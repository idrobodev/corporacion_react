#!/bin/bash

# Test script for todoporunalma.org infrastructure endpoints
# All endpoints use HTTPS with Let's Encrypt certificates

echo "Testing Frontend service (root path /)..."
curl -k -s -o /dev/null -w "Status: %{http_code}\n" https://todoporunalma.org/
echo ""

echo "Testing Auth API (/api/auth/)..."
curl -k -s -o /dev/null -w "Status: %{http_code}\n" https://todoporunalma.org/api/auth/
echo ""

echo "Testing Formatos API (/api/formatos/)..."
curl -k -s -o /dev/null -w "Status: %{http_code}\n" https://todoporunalma.org/api/formatos/
echo ""

echo "Testing Dashboard API (/api/dashboard/)..."
curl -k -s -o /dev/null -w "Status: %{http_code}\n" https://todoporunalma.org/api/dashboard/
echo ""

echo "All endpoint tests completed."