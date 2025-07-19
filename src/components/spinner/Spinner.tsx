interface Props {
  readonly color?: 'white' | 'orange';
}
export default function Spinner({ color = 'orange' }: Props) {
  return (
    <div className="w-full h-full flex justify-center items-center">
      <div
        className={`w-6 h-6 border-t-2 border-b-2 ${
          color === 'orange' ? 'border-logo-orange' : 'border-white'
        } rounded-full animate-spin`}
      ></div>
    </div>
  );
}
