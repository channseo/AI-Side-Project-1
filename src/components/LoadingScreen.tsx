interface LoadingScreenProps {
  label?: string
}

export function LoadingScreen({ label = '확인 중...' }: LoadingScreenProps) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background">
      <p className="text-sm font-medium text-ink-secondary">{label}</p>
    </main>
  )
}
