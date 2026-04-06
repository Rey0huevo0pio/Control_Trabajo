#!/bin/bash
# ==========================================
# PRUEBAS DE CORREO - C Ticket STV
# ==========================================

# Configuración
BASE_URL="http://192.168.100.29:3000/api"
TOKEN=""  # Coloca aquí tu token JWT

echo "=========================================="
echo "📧 PRUEBAS DE CORREO ELECTRÓNICO"
echo "=========================================="

# 1. Obtener token (login)
echo ""
echo "1️⃣  Obteniendo token de autenticación..."
LOGIN_RESPONSE=$(curl -s -X POST "${BASE_URL}/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"Control_Usuario":"2026","password":"12345678"}')

echo "Respuesta login: $LOGIN_RESPONSE"
TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"token":"[^"]*' | cut -d'"' -f4)

if [ -z "$TOKEN" ]; then
  echo "❌ Error: No se pudo obtener el token"
  exit 1
fi

echo "✅ Token obtenido: ${TOKEN:0:30}..."

# 2. Verificar configuración de correo
echo ""
echo "2️⃣  Verificando configuración de correo..."
CONFIG_RESPONSE=$(curl -s -X GET "${BASE_URL}/email/config" \
  -H "Authorization: Bearer $TOKEN")

echo "Configuración: $CONFIG_RESPONSE"

# 3. Obtener correos de la bandeja de entrada
echo ""
echo "3️⃣  Obteniendo correos de la bandeja de entrada..."
EMAILS_RESPONSE=$(curl -s -X GET "${BASE_URL}/email/messages?folder=INBOX&page=1&limit=10" \
  -H "Authorization: Bearer $TOKEN")

echo "Correos: $EMAILS_RESPONSE"

# 4. Enviar un correo de prueba
echo ""
echo "4️⃣  Enviando correo de prueba..."
SEND_RESPONSE=$(curl -s -X POST "${BASE_URL}/email/send" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "to": "tu-email@ejemplo.com",
    "subject": "Prueba de Correo - C Ticket STV",
    "html": "<h1>Correo de Prueba</h1><p>Este es un correo de prueba enviado desde el sistema C Ticket STV.</p>",
    "text": "Correo de prueba desde C Ticket STV"
  }')

echo "Respuesta envío: $SEND_RESPONSE"

echo ""
echo "=========================================="
echo "✅ PRUEBAS COMPLETADAS"
echo "=========================================="
