import * as motion from 'motion/react-client';

const exampleImageArr = [
  "bg-[url('/IMG_8677.jpg')]",
  "bg-[url('/IMG_7197.jpg')]",
  "bg-[url('/IMG_7278.jpg')]",
];

export const CategorySection = () => {
  return (
    <div className="relative max-w-screen md:max-w-8xl mx-auto grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-full md:min-h-screen p-4 md:p-8 pb-20 gap-16 ">
      <main className="w-[90vw] md:w-full flex flex-col md:flex-row gap-8 row-start-2 justify-stretch justify-items-stretch items-stretch">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="bg-white border-4 border-white rounded-2xl w-2/2 md:w-1/3 min-w-2 sm:min-w-64 overflow-hidden"
        >
          <div
            className={`w-full h-full bg-left md:bg-top bg-cover bg-no-repeat ${exampleImageArr[0]}`}
          >
            <div className="w-full h-96 md:h-full bg-from-white-to-transparent-270deg flex justify-end flex-col p-7">
              <h3>Title</h3>
              <p>Description:</p>
              <p>Price</p>
              <div>
                <button>View detail</button>
              </div>
            </div>
          </div>
        </motion.div>
        <div className="flex gap-8 flex-col grow w-full">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="bg-white border-4 border-white rounded-2xl min-w-2 md:min-w-96 w-full max-h-96 min-h-64 h-full overflow-hidden"
          >
            <div
              className={`h-full max-h-96 bg-left md:bg-right bg-cover bg-no-repeat ${exampleImageArr[1]}`}
            >
              <div className="w-full h-96 md:h-full bg-from-white-to-transparent-270deg flex justify-end flex-col p-7">
                <h3>Title</h3>
                <p>Description:</p>
                <p>Price</p>
                <div>
                  <button>View detail</button>
                </div>
              </div>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="bg-white border-4 border-white rounded-2xl min-w-2 md:min-w-96 w-full max-h-96 min-h-64 h-full overflow-hidden"
          >
            <div
              className={`w-full h-full max-h-96 bg-left md:bg-right bg-cover bg-no-repeat ${exampleImageArr[2]} `}
            >
              <div className="w-full h-96 md:h-full bg-from-white-to-transparent-270deg flex justify-end flex-col p-7">
                <h3>Title</h3>
                <p>Description:</p>
                <p>Price</p>
                <div>
                  <button>View detail</button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};
