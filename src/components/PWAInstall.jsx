import { useEffect, useState } from 'react'

// Shows an "Install App" chip when the browser fires beforeinstallprompt.
export default function PWAInstall() {
  const [prompt, setPrompt] = useState(null)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    const onBeforeInstall = (e) => {
      e.preventDefault()
      setPrompt(e)
    }
    window.addEventListener('beforeinstallprompt', onBeforeInstall)
    return () => window.removeEventListener('beforeinstallprompt', onBeforeInstall)
  }, [])

  if (!prompt || dismissed) return null

  const install = async () => {
    prompt.prompt()
    await prompt.userChoice
    setPrompt(null)
  }

  return (
    <div className="pwa-install">
      <span>{'\u{1F4F2}'} Install this site as an app</span>
      <div className="pwa-actions">
        <button className="btn btn-primary btn-sm" onClick={install}>Install</button>
        <button className="pwa-close" onClick={() => setDismissed(true)} aria-label="Dismiss">{'\u2715'}</button>
      </div>
    </div>
  )
}
