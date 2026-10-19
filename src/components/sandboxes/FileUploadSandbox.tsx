import React, { useState } from 'react';
import { UploadCloud, Play, RotateCcw, CheckCircle2, Check, X } from 'lucide-react';

interface FileUploadSandboxProps {
  onComplete: (score: number) => void;
}

export const FileUploadSandbox: React.FC<FileUploadSandboxProps> = ({ onComplete }) => {
  const [selectedFileIndex, setSelectedFileIndex] = useState(1); // default to webshell
  const [checkMagicBytes, setCheckMagicBytes] = useState(false);
  const [randomizeFilename, setRandomizeFilename] = useState(false);
  const [useIsolatedStorage, setUseIsolatedStorage] = useState(false);
  const [whitelistExtensionOnly, setWhitelistExtensionOnly] = useState(false);

  const [pipelineResult, setPipelineResult] = useState<{
    success: boolean;
    storedPath: string;
    isExecutable: boolean;
    logs: { step: string; passed: boolean; message: string }[];
    exploitSucceeded?: boolean;
  } | null>(null);

  const [hasExploitedRce, setHasExploitedRce] = useState(false);
  const [hasHardenedPipeline, setHasHardenedPipeline] = useState(false);

  const sampleFiles = [
    {
      name: 'avatar.png',
      size: '24 KB',
      mime: 'image/png',
      magicBytes: '89 50 4E 47 (PNG signature)',
      content: '[Valid binary PNG image payload]',
      isMalicious: false
    },
    {
      name: 'webshell.php',
      size: '1.2 KB',
      mime: 'application/x-php',
      magicBytes: '3C 3F 70 68 70 (<?php script text)',
      content: '<?php if(isset($_REQUEST["cmd"])){ system($_REQUEST["cmd"]); } ?>',
      isMalicious: true
    },
    {
      name: 'image.php.png',
      size: '2.1 KB',
      mime: 'image/png', // spoofed MIME
      magicBytes: '3C 3F 70 68 70 (<?php                                                               ?>',
      isMalicious: true
    },
    {
      name: '../../var/www/html/shell.php',
      size: '1.5 KB',
      mime: 'application/octet-stream',
      magicBytes: '3C 3F 70 68 70',
      content: '<?php echo exec($_GET["c"]); ?>',
      isMalicious: true
    }
  ];

  const handleTestUpload = () => {
    const file = sampleFiles[selectedFileIndex];
    const logs: { step: string; passed: boolean; message: string }[] = [];

    // Step 1: Extension checking
    let extPassed = true;
    if (whitelistExtensionOnly) {
      const ext = file.name.split('.').pop()?.toLowerCase();
      if (ext !== 'png' && ext !== 'jpg' && ext !== 'jpeg') {
        extPassed = false;
        logs.push({
          step: 'Extension Whitelist Check',
          passed: false,
          message: `REJECTED: Extension .${ext} is not in permitted whitelist [.png, .jpg, .jpeg]`
        });
      } else {
        logs.push({
          step: 'Extension Whitelist Check',
          passed: true,
          message: `Passed: Extension .${ext} is allowed`
        });
      }
    } else {
      // Flawed denylist (only blocks .exe)
      if (file.name.endsWith('.exe')) {
        extPassed = false;
        logs.push({ step: 'Naive Denylist Check', passed: false, message: 'Blocked .exe extension' });
      } else {
        logs.push({
          step: 'Naive Denylist Check',
          passed: true,
          message: `Passed: File does not end in .exe (flawed check ignores .php/.phtml)`
        });
      }
    }

    if (!extPassed) {
      setPipelineResult({
        success: false,
        storedPath: 'Upload rejected by server',
        isExecutable: false,
        logs,
        exploitSucceeded: false
      });
      return;
    }

    // Step 2: Magic byte header check
    let magicPassed = true;
    if (checkMagicBytes) {
      if (file.magicBytes.includes('3C 3F 70 68 70')) {
        magicPassed = false;
        logs.push({
          step: 'Magic Byte Content Inspection',
          passed: false,
          message: 'REJECTED: File signature does not match image header; detected raw PHP executable bytes (3C 3F 70 68 70)'
        });
      } else {
        logs.push({
          step: 'Magic Byte Content Inspection',
          passed: true,
          message: 'Passed: Verified valid PNG/JPEG binary magic headers'
        });
      }
    } else {
      logs.push({
        step: 'Magic Byte Content Inspection',
        passed: true,
        message: 'SKIPPED: Server blindly trusted client-provided Content-Type header'
      });
    }

    if (!magicPassed) {
      setPipelineResult({
        success: false,
        storedPath: 'Upload rejected by server',
        isExecutable: false,
        logs,
        exploitSucceeded: false
      });
      return;
    }

    // Step 3: Filename sanitization / UUID
    let destinationPath = '';
    if (randomizeFilename) {
      destinationPath = `09a1f28b-4c22-4871-9df0-9b07ef94c03a.png`;
      logs.push({
        step: 'Filename Sanitization',
        passed: true,
        message: `Generated secure UUID: ${destinationPath} (discarded user filename)`
      });
    } else {
      destinationPath = file.name;
      logs.push({
        step: 'Filename Sanitization',
        passed: true,
        message: `Vulnerable: Kept original client filename "${file.name}"`
      });
    }

    // Step 4: Storage location & execute permissions
    let isExecutable = false;
    if (useIsolatedStorage) {
      destinationPath = `s3://secure-bucket/private/${destinationPath}`;
      logs.push({
        step: 'Storage Location',
        passed: true,
        message: 'Stored in non-executable cloud bucket with no execution permissions'
      });
      isExecutable = false;
    } else {
      destinationPath = `/var/www/html/public_uploads/${destinationPath}`;
      logs.push({
        step: 'Storage Location',
        passed: true,
        message: 'Stored directly inside public web server document root with EXECUTE permissions'
      });
      isExecutable = destinationPath.includes('.php');
    }

    const exploitWorked = isExecutable && file.isMalicious;

    if (exploitWorked) {
      setHasExploitedRce(true);
    }

    if (hasExploitedRce && checkMagicBytes && randomizeFilename && useIsolatedStorage && whitelistExtensionOnly) {
      setHasHardenedPipeline(true);
      onComplete(115);
    }

    setPipelineResult({
      success: true,
      storedPath: destinationPath,
      isExecutable,
      logs,
      exploitSucceeded: exploitWorked
    });
  };

  const handleReset = () => {
    setSelectedFileIndex(1);
    setCheckMagicBytes(false);
    setRandomizeFilename(false);
    setUseIsolatedStorage(false);
    setWhitelistExtensionOnly(false);
    setPipelineResult(null);
    setHasExploitedRce(false);
  };

  return (
    <div className="space-y-6">
      {/* Exercise Instructions */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5">
        <h3 className="text-base font-semibold text-white flex items-center gap-2 mb-2">
          <UploadCloud className="w-5 h-5 text-cyan-400" />
          <span>Interactive Task: Upload a Web Shell & Configure Defense-in-Depth Pipeline</span>
        </h3>
        <p className="text-sm text-slate-300 mb-2">
          1. <strong>Step 1:</strong> Select <code className="text-rose-300 font-mono text-xs">webshell.php</code> and click <em>Run Upload Pipeline</em>. Notice how unhardened servers store the script in the public web root with execute permissions, resulting in Remote Code Execution (RCE).
        </p>
        <p className="text-sm text-slate-300 mb-3">
          2. <strong>Step 2:</strong> Enable all 4 defense controls (Whitelist, Magic Byte Check, UUID Renaming, Isolated Storage) and re-test to verify full defense.
        </p>

        {/* Progress Tracker */}
        <div className="flex items-center gap-4 text-xs font-mono pt-2 border-t border-slate-800/80">
          <span className={`flex items-center gap-1.5 ${hasExploitedRce ? 'text-emerald-400' : 'text-slate-500'}`}>
            <span className={`w-2 h-2 rounded-full ${hasExploitedRce ? 'bg-emerald-400' : 'bg-slate-600'}`}></span>
            1. Trigger Web Shell Upload (RCE)
          </span>
          <span className={`flex items-center gap-1.5 ${hasHardenedPipeline ? 'text-emerald-400' : 'text-slate-500'}`}>
            <span className={`w-2 h-2 rounded-full ${hasHardenedPipeline ? 'bg-emerald-400' : 'bg-slate-600'}`}></span>
            2. Validate Hardened Upload Pipeline
          </span>
        </div>
      </div>

      {/* Grid: File Picker & Defense Controls vs Upload Pipeline Inspection */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: File Picker & Defense Switches */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="text-xs font-mono text-cyan-400 uppercase font-semibold">Select Test File Payload</span>
            <button
              onClick={handleReset}
              className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          </div>

          {/* Sample Files Selection */}
          <div className="space-y-2">
            {sampleFiles.map((file, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedFileIndex(idx)}
                className={`w-full text-left p-3 rounded-lg border text-xs font-mono transition flex items-center justify-between ${
                  selectedFileIndex === idx
                    ? 'bg-slate-800/90 border-cyan-500 text-white shadow-md'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-900'
                }`}
              >
                <div>
                  <span className={`font-bold block ${file.isMalicious ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {file.name}
                  </span>
                  <span className="text-[10px] text-slate-500">{file.mime} • {file.size}</span>
                </div>
                <div className="text-[10px] text-right text-slate-500">
                  {file.isMalicious ? 'Malicious Script' : 'Clean Asset'}
                </div>
              </button>
            ))}
          </div>

          {/* File Content Preview */}
          <div className="bg-slate-950 p-2.5 rounded border border-slate-800 font-mono text-xs text-slate-300">
            <span className="text-[10px] text-slate-500 uppercase block mb-1">File Payload:</span>
            <code className="text-cyan-300 text-[11px] block truncate">{sampleFiles[selectedFileIndex].content}</code>
          </div>

          {/* Security Controls Checklist */}
          <div className="space-y-2 pt-2 border-t border-slate-800">
            <span className="text-xs font-mono text-slate-400 uppercase block font-semibold">Server Pipeline Hardening:</span>

            <label className="flex items-center gap-2.5 text-xs text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={whitelistExtensionOnly}
                onChange={(e) => setWhitelistExtensionOnly(e.target.checked)}
                className="rounded bg-slate-950 border-slate-700 text-cyan-500 focus:ring-0"
              />
              <span>Strict Extension Whitelist (.png, .jpg only)</span>
            </label>

            <label className="flex items-center gap-2.5 text-xs text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={checkMagicBytes}
                onChange={(e) => setCheckMagicBytes(e.target.checked)}
                className="rounded bg-slate-950 border-slate-700 text-cyan-500 focus:ring-0"
              />
              <span>Inspect Binary Magic Bytes (libmagic/mime)</span>
            </label>

            <label className="flex items-center gap-2.5 text-xs text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={randomizeFilename}
                onChange={(e) => setRandomizeFilename(e.target.checked)}
                className="rounded bg-slate-950 border-slate-700 text-cyan-500 focus:ring-0"
              />
              <span>Randomize Stored Filename with UUID</span>
            </label>

            <label className="flex items-center gap-2.5 text-xs text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={useIsolatedStorage}
                onChange={(e) => setUseIsolatedStorage(e.target.checked)}
                className="rounded bg-slate-950 border-slate-700 text-cyan-500 focus:ring-0"
              />
              <span>Store in Isolated Cloud Bucket (No Execution)</span>
            </label>
          </div>

          <button
            onClick={handleTestUpload}
            className="w-full py-2.5 px-4 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 transition mt-2"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Run Upload Pipeline</span>
          </button>
        </div>

        {/* Right: Pipeline Inspection & Execution Results */}
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
              <span className="text-xs font-mono text-cyan-400 uppercase font-semibold">Server-Side Pipeline Execution Trace</span>
              <span className="text-[10px] font-mono text-slate-500">Storage Service</span>
            </div>

            {pipelineResult ? (
              <div className="space-y-3">
                {/* Status Logs */}
                <div className="space-y-2">
                  {pipelineResult.logs.map((log, idx) => (
                    <div
                      key={idx}
                      className={`p-2.5 rounded-lg border text-xs font-mono flex items-start gap-2 ${
                        log.passed
                          ? 'bg-slate-900 border-slate-800 text-slate-300'
                          : 'bg-rose-950/70 border-rose-500/40 text-rose-200'
                      }`}
                    >
                      {log.passed ? (
                        <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      ) : (
                        <X className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                      )}
                      <div>
                        <strong className="block text-slate-200">{log.step}</strong>
                        <span className="text-[11px] leading-relaxed">{log.message}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Storage Result Box */}
                <div className="bg-slate-900 border border-slate-800 p-3 rounded-lg text-xs font-mono space-y-1">
                  <div><span className="text-slate-500">Stored Destination:</span> <span className="text-cyan-300">{pipelineResult.storedPath}</span></div>
                  <div><span className="text-slate-500">Executable in Web Root:</span> <span className={pipelineResult.isExecutable ? 'text-rose-400 font-bold' : 'text-emerald-400'}>{String(pipelineResult.isExecutable)}</span></div>
                </div>

                {/* Exploit Outcome */}
                {pipelineResult.exploitSucceeded && (
                  <div className="bg-rose-950/80 border border-rose-500/60 p-3 rounded-lg text-xs text-rose-200">
                    <strong className="text-rose-300 block mb-1">🚨 REMOTE CODE EXECUTION (RCE) ACHIEVED:</strong>
                    The attacker can now execute arbitrary operating system commands by requesting:
                    <code className="block bg-black/60 p-1.5 rounded mt-1 font-mono text-[11px] text-rose-300">
                      GET /public_uploads/webshell.php?cmd=whoami -&gt; &quot;www-data (uid=33)&quot;
                    </code>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-xs text-slate-500 italic py-12 text-center">
                Click &quot;Run Upload Pipeline&quot; to test the file against active security filters.
              </div>
            )}
          </div>

          <div className="text-[11px] text-slate-500 border-t border-slate-800/80 pt-3">
            Best Practice: Always generate unique random filenames on the server and host user uploads on a dedicated domain or object storage service.
          </div>
        </div>
      </div>

      {/* Completion Banner */}
      {hasHardenedPipeline && (
        <div className="bg-emerald-950/60 border border-emerald-500/40 rounded-xl p-5 flex items-center gap-4 text-emerald-300">
          <CheckCircle2 className="w-8 h-8 text-emerald-400 shrink-0" />
          <div>
            <h4 className="font-bold text-white text-base">Lab Challenge Solved! (+115 Points)</h4>
            <p className="text-xs text-emerald-200/90 leading-relaxed">
              You identified the dangers of naive extension checks and demonstrated defense-in-depth: strict extension allowlists, binary magic byte checks, randomized UUIDs, and isolated non-executable storage.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
