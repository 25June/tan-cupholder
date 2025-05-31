import Image from 'next/image';

export default function PageLoader() {
  return (
    <div
      className={`fixed w-screen h-screen flex items-center bg-transparent justify-center transition-all duration-300 ease-in-out`}
    >
      <div className="bg-base-100/50 rounded-full p-4 flex items-center justify-center w-48 md:w-96 h-48 md:h-96">
        <Image
          src="/logo.png"
          alt="TAN cupholder logo"
          width={200}
          height={200}
          className={`rounded-full animate-fade-in-out`}
        />
      </div>
    </div>
  );
}
