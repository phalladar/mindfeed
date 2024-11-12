# NextJS Project Concatenator
# Creates a single file containing all relevant project files while respecting .gitignore

param(
    [Parameter(Mandatory=$false)]
    [string]$OutputFile = "project_context.txt",
    [Parameter(Mandatory=$false)]
    [bool]$StripComments = $true,
    [Parameter(Mandatory=$false)]
    [Alias('v')]
    [switch]$ShowProgress
)

function Write-Status {
    param(
        [string]$Message,
        [string]$Type = "INFO"
    )
    if ($ShowProgress) {
        $timestamp = Get-Date -Format 'HH:mm:ss'
        Write-Host "[$timestamp] $Type : $Message" -ForegroundColor $(
            switch ($Type) {
                "INFO"  { "Cyan" }
                "ERROR" { "Red" }
                "SUCCESS" { "Green" }
                default { "White" }
            }
        )
    }
}

function Get-GitIgnorePatterns {
    Write-Status "Reading .gitignore patterns..."
    $patterns = @()
    
    # Add default patterns first
    $defaultPatterns = @(
        "\.git/.*",
        "\.next/.*",
        "node_modules/.*",
        [regex]::Escape($OutputFile)
    )
    
    # Special handling for .env file - we'll add it separately later
    $script:envContent = $null
    if (Test-Path ".env") {
        $script:envContent = Get-Content ".env" -Raw
        Write-Status "Found .env file - will include in output"
    }
    
    foreach ($pattern in $defaultPatterns) {
        $patterns += @{
            Pattern = "^$pattern$"
            IsNegation = $false
        }
    }
    
    if (Test-Path ".gitignore") {
        $gitignore = Get-Content ".gitignore"
        foreach ($line in $gitignore) {
            if ($line -and -not $line.StartsWith("#")) {
                $pattern = $line.Trim()
                if ($pattern) {
                    $patterns += @{
                        Pattern = "^" + [regex]::Escape($pattern).Replace("\*", ".*") + "$"
                        IsNegation = $false
                    }
                }
            }
        }
        Write-Status "Found $($patterns.Count) valid patterns in total (including defaults)"
    } else {
        Write-Status "No .gitignore file found, using default patterns only"
    }
    
    return $patterns
}

function Test-ShouldIgnore {
    param(
        [string]$Path,
        [array]$IgnorePatterns
    )
    
    # Convert to relative path with forward slashes
    $relativePath = $Path.Replace($PWD.Path, "").TrimStart("\").Replace("\", "/")
    
    $ignored = $false
    foreach ($pattern in $IgnorePatterns) {
        try {
            if ($relativePath -match $pattern.Pattern) {
                $ignored = -not $pattern.IsNegation
            }
        } catch {
            Write-Status "Warning: Invalid pattern: $($pattern.Pattern)" "ERROR"
        }
    }
    
    return $ignored
}

function Remove-Comments {
    param([string]$Content, [string]$Extension)
    
    switch -Regex ($Extension) {
        '\.jsx?$|\.tsx?$' {
            $Content = $Content -replace '//.*$', '' -replace '/\*[\s\S]*?\*/', ''
        }
        '\.css$|\.scss$' {
            $Content = $Content -replace '/\*[\s\S]*?\*/', ''
        }
        '\.html$' {
            $Content = $Content -replace '<!--[\s\S]*?-->', ''
        }
    }
    $Content = ($Content -split "`n" | Where-Object { $_.Trim() }) -join "`n"
    return $Content
}

function Get-FileContent {
    param(
        [string]$FilePath,
        [bool]$StripComments
    )
    
    try {
        $content = [System.IO.File]::ReadAllText($FilePath)
        if ($StripComments) {
            $extension = [System.IO.Path]::GetExtension($FilePath)
            $content = Remove-Comments -Content $content -Extension $extension
        }
        return $content
    } catch {
        Write-Status "Warning: Could not read file $FilePath" "ERROR"
        return ""
    }
}

function Get-FormattedFileTree {
    param([System.IO.FileInfo[]]$Files)
    
    $tree = New-Object System.Text.StringBuilder
    [void]$tree.AppendLine("")
    
    $sorted = $Files | Sort-Object FullName
    $prevDir = ""
    
    foreach ($file in $sorted) {
        $relativePath = $file.FullName.Replace($PWD.Path, '').TrimStart('\')
        $dir = Split-Path $relativePath
        $fileName = Split-Path $relativePath -Leaf
        $depth = ($relativePath.Split('\').Count - 1)
        
        if ($dir -and $dir -ne $prevDir) {
            $dirDepth = ($dir.Split('\').Count - 1)
            $dirIndent = " " * (4 * $dirDepth)
            [void]$tree.AppendLine("$dirIndent|-- $dir/")
            $prevDir = $dir
        }
        
        $indent = " " * (4 * $depth)
        [void]$tree.AppendLine("$indent|--- $fileName")
    }
    
    return $tree.ToString()
}

# Main script
try {
    Write-Status "Starting file concatenation process..."
    Write-Status "Output file will be: $OutputFile"
    
    $ignorePatterns = Get-GitIgnorePatterns
    Write-Status "Scanning for files..."
    
    $files = Get-ChildItem -Recurse -File | Where-Object {
        -not (Test-ShouldIgnore -Path $_.FullName -IgnorePatterns $ignorePatterns)
    }
    
    Write-Status "Found $($files.Count) files to process"
    $processedCount = 0
    $output = New-Object System.Text.StringBuilder
    $totalSize = 0

    # Add project overview and environment variables
    [void]$output.AppendLine("="*80)
    [void]$output.AppendLine("PROJECT OVERVIEW: Reddit RSS Reader with ML-Enhanced Content Filtering")
    [void]$output.AppendLine("="*80)
    [void]$output.AppendLine(@"

This is a Next.js application that serves as an intelligent RSS reader specialized for Reddit content. 
Key features and components:
- Machine learning-based article recommendation system
- Google Authentication integration
- RSS feed processing and management
- Personalized content filtering
- Next.js frontend with server-side rendering

Important Implementation Notes for LLMs:
- The project uses Next.js with TypeScript for type safety
- Authentication is handled via Google OAuth
- ML components analyze user preferences and article content
- The app processes RSS feeds to extract and filter relevant content
- User preferences and article data are stored for personalized recommendations

"@)

    # Add environment variables if found
    if ($script:envContent) {
        [void]$output.AppendLine("Environment Variables (.env):")
        [void]$output.AppendLine("-" * 40)
        [void]$output.AppendLine($script:envContent)
        [void]$output.AppendLine("-" * 40 + "`n")
    }

    [void]$output.AppendLine("File Structure Overview:")
    [void]$output.AppendLine((Get-FormattedFileTree -Files $files))
    [void]$output.AppendLine("`n" + "="*80 + "`n")

    # Process each file
    foreach ($file in $files) {
        $relativePath = $file.FullName.Replace($PWD.Path, '').TrimStart('\')
        Write-Status "Processing ($($processedCount + 1)/$($files.Count)): $relativePath"
        
        [void]$output.AppendLine("`n`n" + "="*80)
        [void]$output.AppendLine("FILE: $relativePath")
        [void]$output.AppendLine("="*80 + "`n")
        
        $content = Get-FileContent -FilePath $file.FullName -StripComments $StripComments
        [void]$output.AppendLine($content)
        
        $totalSize += $content.Length
        $processedCount++
        
        if ($processedCount % 10 -eq 0) {
            $sizeKB = [math]::Round($totalSize/1KB, 2)
            Write-Status "Processed $processedCount files... ($sizeKB KB)"
        }
    }

    Write-Status "Writing output file..." "INFO"
    $output.ToString() | Out-File -FilePath $OutputFile -Encoding UTF8
    
    Write-Status "`nConcatenation complete!" "SUCCESS"
    Write-Status "Total files processed: $($files.Count)" "SUCCESS"
    $finalSizeKB = [math]::Round($totalSize/1KB, 2)
    Write-Status "Total size: $finalSizeKB KB" "SUCCESS"
    Write-Status "Output written to: $OutputFile" "SUCCESS"
}
catch {
    Write-Status "An error occurred: $_" "ERROR"
    Write-Status "Stack trace: $($_.ScriptStackTrace)" "ERROR"
    exit 1
}