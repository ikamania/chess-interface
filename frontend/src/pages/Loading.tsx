type Props = {
  message?: string
}

function Loading({ message = "Loading..."}: Props) {
  return (
    <main className="flex min-h-screen items-center justify-center text-center">
      <h1 className="text-[2rem] font-semibold">
        {message}
      </h1>
    </main>
  )
}

export default Loading
