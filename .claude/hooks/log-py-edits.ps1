# PostToolUse hook: log ONLY Python (.py) file edits.
# Reads the hook event JSON from stdin, applies a conditional rule,
# and appends to .claude/hook.log. Demonstrates rule-logic inside a hook.
$raw = [Console]::In.ReadToEnd()
try { $j = $raw | ConvertFrom-Json } catch { exit 0 }   # malformed input -> do nothing
$f = $j.tool_input.file_path
if ($f -and $f -like '*.py') {
    $line = "{0} {1} {2}" -f (Get-Date -Format o), $j.tool_name, $f
    Add-Content -Path "$PSScriptRoot\..\hook.log" -Value $line -Encoding utf8
}
exit 0
