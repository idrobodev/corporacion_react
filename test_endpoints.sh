#!/bin/bash

# Test script for todoporunalma.org infrastructure endpoints
# All endpoints use HTTPS with Let's Encrypt certificates

echo "Testing Frontend service (root path /)..."
curl -k -s -o /dev/null -w "Status: %{http_code}\n" https://todoporunalma.org/
echo ""

echo "Testing Auth API (/api/auth/health)..."
curl -k -s -o /dev/null -w "Status: %{http_code}\n" https://todoporunalma.org/api/auth/health
echo ""

echo "Testing Auth API root (/api/auth/)..."
curl -k -s -o /dev/null -w "Status: %{http_code}\n" https://todoporunalma.org/api/auth/
echo ""

echo "Testing Formatos API (/api/formatos/)..."
curl -k -s -o /dev/null -w "Status: %{http_code}\n" https://todoporunalma.org/api/formatos/
echo ""

echo "Testing Dashboard API (/api/dashboard/)..."
curl -k -s -o /dev/null -w "Status: %{http_code}\n" https://todoporunalma.org/api/dashboard/health
echo ""

echo "Testing Dashboard API root (/api/dashboard/)..."
curl -k -s -o /dev/null -w "Status: %{http_code}\n" https://todoporunalma.org/api/dashboard/
echo ""

echo "Testing Dashboard API stats (/api/dashboard/dashboard/stats)..."
curl -k -s -X GET \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhZG1pbkBleGFtcGxlLmNvbSIsInJvbGUiOiJBRE1JTklTVFJBRE9SIiwiZXhwIjoxNzYxMTQ0MDM1fQ.6uItIcSSqUh73USBKmlgre3qHrrQzr3eHaySRrAazLk" \
  https://todoporunalma.org/api/dashboard/dashboard/stats | jq '.' 2>/dev/null || echo "Response: $(curl -k -s -X GET -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhZG1pbkBleGFtcGxlLmNvbSIsInJvbGUiOiJBRE1JTklTVFJBRE9SIiwiZXhwIjoxNzYxMTQ0MDM1fQ.6uItIcSSqUh73USBKmlgre3qHrrQzr3eHaySRrAazLk" https://todoporunalma.org/api/dashboard/dashboard/stats)"
echo ""

echo "Testing Dashboard API participantes (/api/dashboard/participantes)..."
curl -k -s -X GET \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhZG1pbkBleGFtcGxlLmNvbSIsInJvbGUiOiJBRE1JTklTVFJBRE9SIiwiZXhwIjoxNzYxMTQ0MDM1fQ.6uItIcSSqUh73USBKmlgre3qHrrQzr3eHaySRrAazLk" \
  https://todoporunalma.org/api/dashboard/participantes | jq '.' 2>/dev/null || echo "Response: $(curl -k -s -X GET -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhZG1pbkBleGFtcGxlLmNvbSIsInJvbGUiOiJBRE1JTklTVFJBRE9SIiwiZXhwIjoxNzYxMTQ0MDM1fQ.6uItIcSSqUh73USBKmlgre3qHrrQzr3eHaySRrAazLk" https://todoporunalma.org/api/dashboard/participantes)"
echo ""

echo "Testing Login with admin@example.com..."
curl -k -s -X POST \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"admin123"}' \
  https://todoporunalma.org/api/auth/login | jq '.' 2>/dev/null || echo "Response: $(curl -k -s -X POST -H "Content-Type: application/json" -d '{"email":"admin@example.com","password":"admin123"}' https://todoporunalma.org/api/auth/login)"
echo ""

echo "All endpoint tests completed."