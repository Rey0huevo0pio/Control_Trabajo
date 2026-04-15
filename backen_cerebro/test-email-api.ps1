# ==========================================
# SCRIPT DE PRUEBA - API DE CORREOS (PowerShell)
# ==========================================

$BASE_URL = "http://192.168.68.115:3000/api"
$USERNAME = "USR001"
$PASSWORD = "12345678"  # Ajusta si es diferente para USR001

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "  PRUEBA API DE CORREOS" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan

# ==========================================
# PASO 1: LOGIN
# ==========================================
Write-Host "`n🔐 PASO 1: AUTENTICACIÓN" -ForegroundColor Yellow

try {
    $loginBody = @{
        Control_Usuario = $USERNAME
        password = $PASSWORD
    } | ConvertTo-Json

    $loginResponse = Invoke-RestMethod -Uri "$BASE_URL/auth/login" -Method POST -ContentType "application/json" -Body $loginBody
    
    if ($loginResponse.access_token) {
        $TOKEN = $loginResponse.access_token
        Write-Host "✅ Token obtenido: $($TOKEN.Substring(0, 30))..." -ForegroundColor Green
    } elseif ($loginResponse.token) {
        $TOKEN = $loginResponse.token
        Write-Host "✅ Token obtenido: $($TOKEN.Substring(0, 30))..." -ForegroundColor Green
    } elseif ($loginResponse.data -and $loginResponse.data.token) {
        $TOKEN = $loginResponse.data.token
        Write-Host "✅ Token obtenido: $($TOKEN.Substring(0, 30))..." -ForegroundColor Green
    } else {
        Write-Host "❌ No se encontró token en la respuesta" -ForegroundColor Red
        Write-Host "Respuesta: $($loginResponse | ConvertTo-Json -Depth 5)" -ForegroundColor Gray
        exit 1
    }
} catch {
    Write-Host "❌ Error en login: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# ==========================================
# PASO 2: OBTENER LISTA DE CORREOS
# ==========================================
Write-Host "`n📬 PASO 2: OBTENER LISTA DE CORREOS" -ForegroundColor Yellow

try {
    $headers = @{
        "Authorization" = "Bearer $TOKEN"
    }

    $emailsResponse = Invoke-RestMethod -Uri "$BASE_URL/email/messages?folder=INBOX&page=1&limit=3" -Method GET -Headers $headers

    Write-Host "✅ Respuesta recibida" -ForegroundColor Green
    Write-Host "Success: $($emailsResponse.success)" -ForegroundColor Gray
    Write-Host "Total emails: $($emailsResponse.data.total)" -ForegroundColor Gray
    
    if ($emailsResponse.data.emails -and $emailsResponse.data.emails.Count -gt 0) {
        Write-Host "`n📧 Primeros 3 emails:" -ForegroundColor Cyan
        foreach ($email in $emailsResponse.data.emails) {
            Write-Host "  - UID: $($email.uid) | From: $($email.from) | Subject: $($email.subject)" -ForegroundColor Gray
            Write-Host "    Date: $($email.date) | HTML: $($email.html.Length) chars" -ForegroundColor Gray
        }

        # Guardar primer UID para prueba
        $FIRST_UID = $emailsResponse.data.emails[0].uid
        Write-Host "`n📌 Primer UID: $FIRST_UID" -ForegroundColor Magenta
        
        # ==========================================
        # PASO 3: OBTENER EMAIL COMPLETO
        # ==========================================
        Write-Host "`n📄 PASO 3: OBTENER EMAIL COMPLETO (UID: $FIRST_UID)" -ForegroundColor Yellow

        try {
            $bodyJson = @{
                folder = "INBOX"
                uids = @($FIRST_UID)
            } | ConvertTo-Json

            $fullEmailResponse = Invoke-RestMethod -Uri "$BASE_URL/email/messages/by-uids" -Method POST -Headers $headers -ContentType "application/json" -Body $bodyJson

            Write-Host "✅ Email completo recibido" -ForegroundColor Green
            
            if ($fullEmailResponse.data.emails -and $fullEmailResponse.data.emails.Count -gt 0) {
                $fullEmail = $fullEmailResponse.data.emails[0]
                
                Write-Host "`n📊 DETALLES DEL EMAIL:" -ForegroundColor Cyan
                Write-Host "  UID: $($fullEmail.uid)" -ForegroundColor $(if ($fullEmail.uid -gt 0) { "Green" } else { "Red" })
                Write-Host "  From: $($fullEmail.from)" -ForegroundColor Gray
                Write-Host "  Subject: $($fullEmail.subject)" -ForegroundColor Gray
                Write-Host "  Date: $($fullEmail.date)" -ForegroundColor Gray
                Write-Host "  HTML Length: $($fullEmail.html.Length) chars" -ForegroundColor $(if ($fullEmail.html.Length -gt 0) { "Green" } else { "Red" })
                Write-Host "  Text Length: $($fullEmail.text.Length) chars" -ForegroundColor Gray
                Write-Host "  Attachments: $($fullEmail.attachments.Count)" -ForegroundColor Gray
                
                if ($fullEmail.html.Length -gt 0) {
                    Write-Host "`n📝 HTML Preview (primeros 200 chars):" -ForegroundColor Cyan
                    Write-Host $fullEmail.html.Substring(0, [Math]::Min(200, $fullEmail.html.Length)) -ForegroundColor Gray
                } else {
                    Write-Host "`n❌ HTML VACÍO" -ForegroundColor Red
                }
            } else {
                Write-Host "❌ No se encontraron emails en la respuesta" -ForegroundColor Red
                Write-Host "Respuesta completa: $($fullEmailResponse | ConvertTo-Json -Depth 5)" -ForegroundColor Gray
            }
        } catch {
            Write-Host "❌ Error obteniendo email completo: $($_.Exception.Message)" -ForegroundColor Red
        }
    } else {
        Write-Host "⚠️ No hay emails en la respuesta" -ForegroundColor Yellow
        Write-Host "Respuesta: $($emailsResponse | ConvertTo-Json -Depth 5)" -ForegroundColor Gray
    }
} catch {
    Write-Host "❌ Error obteniendo emails: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n==========================================" -ForegroundColor Cyan
Write-Host "  PRUEBA COMPLETADA" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
