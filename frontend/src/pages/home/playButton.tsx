type Color = "white" | "black"

type PlayButtonProps = {
  yourColor: Color
  onClick: (color: Color) => void
}


function PlayButton({ onClick, yourColor }: PlayButtonProps) {
  return (
    <button
      className="font-semibold text-lg p-[.6rem] border rounded-lg border-green-700 text-white bg-green-600 cursor-pointer"
      onClick={() => onClick(yourColor)}
    >
      play as <strong>{yourColor}</strong>
    </button>
  )
}

export default PlayButton
