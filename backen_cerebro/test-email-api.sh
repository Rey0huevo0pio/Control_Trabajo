#!/bin/bash
# ==========================================
# SCRIPT DE PRUEBA - API DE CORREOS
# ==========================================
# Este script verifica que el backend envía datos correctos

# Configuración
BASE_URL="http://192.168.68.115:3000/api"  # Cambia el puerto si es necesario
EMAIL="vacios@sotaventolzc.com"
PASSWORD="12345678"

echo "=========================================="
echo "🔐 PASO 1: AUTENTICACIÓN"
echo "=========================================="

# Login para obtener token
LOGIN_RESPONSE=$(curl -s -X POST "${BASE_URL}/auth/login" \
  -H "Content-Type: application/json" \
  -d "{\"Control_Usuario\":\"USR002\",\"password\":\"12345678\"}")

echo "Response: $LOGIN_RESPONSE"

# Extraer token (ajusta según la estructura de tu respuesta)
TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"token":"[^"]*"' | cut -d'"' -f4)

if [ -z "$TOKEN" ]; then
  echo "❌ No se pudo obtener el token. Verifica las credenciales."
  echo "Usa tu token manualmente:"
  read -p "Token: " TOKEN
fi

echo "✅ Token: ${TOKEN:0:20}..."

echo ""
echo "=========================================="
echo "📧 PASO 2: OBTENER UIDs"
echo "=========================================="

UIDS_RESPONSE=$(curl -s -X GET "${BASE_URL}/email/messages/uids?folder=INBOX" \
  -H "Authorization: Bearer $TOKEN")

echo "UIDs Response:"
echo $UIDS_RESPONSE | python3 -m json.tool 2>/dev/null || echo $UIDS_RESPONSE

echo ""
echo "=========================================="
echo "📬 PASO 3: OBTENER EMAILS (CON HTML)"
echo "=========================================="

# Obtener lista de correos con HTML truncado
EMAILS_RESPONSE=$(curl -s -X GET "${BASE_URL}/email/messages?folder=INBOX&page=1&limit=5" \
  -H "Authorization: Bearer $TOKEN")

echo "Emails Response (primeros 5):"
echo $EMAILS_RESPONSE | python3 -m json.tool 2>/dev/null | head -100

echo ""
echo "=========================================="
echo "🔍 PASO 4: VERIFICAR ESTRUCTURA DE EMAIL"
echo "=========================================="

# Extraer UID del primer email
FIRST_UID=$(echo $EMAILS_RESPONSE | grep -o '"uid":[0-9]*' | head -1 | cut -d':' -f2)

if [ -z "$FIRST_UID" ]; then
  echo "❌ No se pudo extraer UID. Intentando con UID manual..."
  FIRST_UID=11458  # UID de ejemplo de los logs
fi

echo "📧 Probando con UID: $FIRST_UID"

echo ""
echo "=========================================="
echo "📄 PASO 5: OBTENER EMAIL COMPLETO"
echo "=========================================="

FULL_EMAIL_RESPONSE=$(curl -s -X POST "${BASE_URL}/email/messages/by-uids" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d "{\"folder\":\"INBOX\",\"uids\":[${FIRST_UID}]}")

echo "Full Email Response:"
echo $FULL_EMAIL_RESPONSE | python3 -m json.tool 2>/dev/null | head -200

echo ""
echo "=========================================="
echo "📊 PASO 6: RESUMEN"
echo "=========================================="

# Verificar si hay HTML
HAS_HTML=$(echo $FULL_EMAIL_RESPONSE | grep -o '"html":"[^"]*"' | head -1)
HTML_LENGTH=$(echo $HAS_HTML | wc -c)

echo "UID: $FIRST_UID"
echo "HTML Length: $HTML_LENGTH characters"
echo "Has HTML: $([ $HTML_LENGTH -gt 20 ] && echo '✅ YES' || echo '❌ NO')"

echo ""
echo "=========================================="
echo "✅ PRUEBA COMPLETADA"
echo "=========================================="
