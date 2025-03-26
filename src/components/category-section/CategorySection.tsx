const exampleImageArr = [
  "bg-[url('/IMG_8677.jpg')]",
  "bg-[url('/IMG_7197.jpg')]",
  "bg-[url('/IMG_7278.jpg')]",
];

export const CategorySection = () => {
  return (
    <div className="relative max-w-8xl mx-auto grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="w-full flex gap-8 row-start-2 justify-stretch justify-items-stretch items-stretch">
        <div className="bg-white border-4 border-white rounded-2xl w-1/2 min-w-96 overflow-hidden">
          <div
            className={`w-full h-full bg-top bg-cover bg-no-repeat ${exampleImageArr[0]}`}
          >
            <div className="w-full h-full bg-from-white-to-transparent-180deg flex justify-end flex-col p-7">
              <h3>Title</h3>
              <p>Description:</p>
              <p>Price</p>
              <div>
                <button>View detail</button>
              </div>
            </div>
          </div>
        </div>
        <div className="flex gap-8 flex-col grow w-full">
          <div className="bg-white border-4 border-white rounded-2xl min-w-96 w-full max-h-96 min-h-64 h-full overflow-hidden">
            <div
              className={`w-full h-full max-h-96 bg-right bg-cover bg-no-repeat ${exampleImageArr[1]}`}
            >
              <div className="w-full h-full bg-from-white-to-transparent-270deg flex justify-end flex-col p-7">
                <h3>Title</h3>
                <p>Description:</p>
                <p>Price</p>
                <div>
                  <button>View detail</button>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white border-4 border-white rounded-2xl min-w-96 w-full max-h-96 min-h-64 h-full overflow-hidden">
            <div
              className={`w-full h-full max-h-96 bg-right bg-cover bg-no-repeat ${exampleImageArr[2]} `}
            >
              <div className="w-full h-full bg-from-white-to-transparent-270deg flex justify-end flex-col p-7">
                <h3>Title</h3>
                <p>Description:</p>
                <p>Price</p>
                <div>
                  <button>View detail</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
