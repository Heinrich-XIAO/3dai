import { useShooAuth } from '@shoojs/react'
import { createFileRoute } from '@tanstack/react-router'
import { Textarea } from '@/components/ui/textarea'

export const Route = createFileRoute('/')({ component: App })

function App() {
  const { identity, loading, signIn, clearIdentity } = useShooAuth()

  const sendMessage = (textarea: HTMLTextAreaElement) => {
    const message = textarea.value.trim()
    if (!message) return
    console.log('sending message', message)
  }
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <nav className="sticky top-0 z-10 border-b border-slate-800/70 bg-slate-950/80 backdrop-blur">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-5">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-700 bg-slate-900 text-sm font-semibold">
              3D
            </div>
            <div>
              <p className="text-sm font-semibold tracking-wide text-white">
                3dai
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {loading ? null : identity.userId ? (
              <button
                onClick={() => clearIdentity()}
                className="rounded-full border border-slate-700 px-4 py-2 text-sm font-medium text-white transition hover:border-slate-500 hover:bg-slate-900"
              >
                Sign out
              </button>
            ) : (
              <button
                onClick={() => signIn()}
                type="button"
                className="rounded-full border border-slate-700 px-4 py-2 text-sm font-medium text-white transition hover:border-slate-500 hover:bg-slate-900"
              >
                Sign in
              </button>
            )}
          </div>
        </div>
      </nav>
      <main className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-6xl items-center justify-center px-5 py-16">
        <Textarea
          className="w-1/2 min-w-100 min-h-25 text-lg bg-gray-900 shadow-lg shadow-cyan-500"
          id="message-input"
          placeholder="Make a duck"
          onKeyDown={(e: React.KeyboardEvent<HTMLTextAreaElement>) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              sendMessage(e.target as HTMLTextAreaElement)
            }
          }}
        />
      </main>
    </div>
  )
}
