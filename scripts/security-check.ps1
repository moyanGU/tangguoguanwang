$ErrorActionPreference = "Stop"

$repoRoot = Split-Path -Parent $PSScriptRoot
Push-Location $repoRoot

try {
    $trackedFiles = @(git ls-files)
    if ($LASTEXITCODE -ne 0) {
        throw "Unable to list tracked files."
    }

    $forbiddenFiles = @($trackedFiles | Where-Object {
        $_ -match '(^|/)(\.env($|\.)|[^/]+\.(pem|key|p12|pfx|jks|keystore)$)'
    })
    if ($forbiddenFiles.Count -gt 0) {
        throw "Sensitive file types are tracked: $($forbiddenFiles -join ', ')"
    }

    $sourceFiles = @($trackedFiles | Where-Object {
        $_ -match '\.(html|js|css|json)$' -and (Test-Path -LiteralPath $_)
    })
    $secretPatterns = @(
        '-----BEGIN (RSA|OPENSSH|EC) PRIVATE KEY-----',
        '(?i)(api[_-]?key|client[_-]?secret|access[_-]?token|password)\s*[:=]\s*["''][^"'']{8,}["'']'
    )
    foreach ($sourceFile in $sourceFiles) {
        $content = Get-Content -Raw -LiteralPath $sourceFile
        foreach ($pattern in $secretPatterns) {
            if ($content -match $pattern) {
                throw "Possible credential found in $sourceFile."
            }
        }
    }

    $htmlFiles = @(Get-ChildItem -File -Filter '*.html')
    foreach ($htmlFile in $htmlFiles) {
        $html = Get-Content -Raw -LiteralPath $htmlFile.FullName
        if ($html -notmatch 'http-equiv="Content-Security-Policy"') {
            throw "Missing Content Security Policy in $($htmlFile.Name)."
        }

        foreach ($anchor in [regex]::Matches($html, '<a\b[^>]*target="_blank"[^>]*>', 'IgnoreCase')) {
            if ($anchor.Value -notmatch 'rel="[^"]*(noopener|noreferrer)[^"]*"') {
                throw "External new-tab link lacks rel protection in $($htmlFile.Name)."
            }
        }

        foreach ($reference in [regex]::Matches($html, '(?:src|href)="([^"]+)"', 'IgnoreCase')) {
            $value = $reference.Groups[1].Value
            if ($value -match '^(https?:|mailto:|tel:|data:|#)') {
                continue
            }

            $relativePath = ($value -split '#')[0]
            $resolvedPath = Join-Path $htmlFile.DirectoryName $relativePath
            if (-not (Test-Path -LiteralPath $resolvedPath)) {
                throw "Broken local reference '$value' in $($htmlFile.Name)."
            }
        }
    }

    Write-Host "Security gate passed for $($htmlFiles.Count) HTML pages and $($sourceFiles.Count) source files."
}
finally {
    Pop-Location
}
