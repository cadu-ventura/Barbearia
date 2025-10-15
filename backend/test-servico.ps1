# Teste de criação de serviço
Write-Host "Testando API de serviços..."

# Login
$loginBody = @{
    email = "admin@hoshirara.com"
    password = "admin123"
} | ConvertTo-Json

try {
    $loginResponse = Invoke-RestMethod -Uri "http://localhost:3001/api/auth/login" -Method POST -ContentType "application/json" -Body $loginBody
    $token = $loginResponse.data.token
    Write-Host "Login OK - Token: $($token.Substring(0,20))..."
    
    # Criar serviço
    $headers = @{
        "Authorization" = "Bearer $token"
        "Content-Type" = "application/json"
    }
    
    $serviceBody = @{
        nome = "Corte Debug"
        descricao = "Corte de teste"
        preco = 25.50
        duracao = 30
        ativo = $true
    } | ConvertTo-Json
    
    $serviceResponse = Invoke-RestMethod -Uri "http://localhost:3001/api/servicos" -Method POST -Headers $headers -Body $serviceBody
    Write-Host "SUCESSO - Serviço criado:"
    Write-Host ($serviceResponse | ConvertTo-Json -Depth 3)
    
} catch {
    Write-Host "ERRO:"
    Write-Host $_.Exception.Message
    if ($_.ErrorDetails) {
        Write-Host $_.ErrorDetails.Message
    }
}