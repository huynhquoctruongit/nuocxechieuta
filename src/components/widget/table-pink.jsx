export const ItemTable = ({ children, className }) => {
  return (
    <div className={className + " text-left border-r border-pastel-pink last:border-none"}>
      <div className="py-1.5 px-2 md:py-3 md:px-5 h-full flex">{children}</div>
    </div>
  );
};

const TablePink = ({ headers = [], list = [], render = (key, value) => {} }) => {
  return (
    <div className="relative md:w-full w-[calc(100vw-40px)] overflow-x-auto md:overflow-visible">
      <div className="absolute top-1/2 left-1/2 hidden md:block -translate-y-1/2 -translate-x-1/2 w-[calc(100%+16px)] h-[calc(100%+16px)] bg-pastel-pink/10 rounded-xl"></div>
      <div className="md:w-full border border-pastel-pink rounded-md bg-white relative z-10 w-[1000px] ">
        <div className="flex items-center w-full ">
          {headers.map((option, index) => {
            return (
              <ItemTable className={option.className + " font-bold text-gray-600 py-1.5"} key={index + "-option"}>
                {option.title}
              </ItemTable>
            );
          })}
        </div>
        <div className="w-full">
          {list?.map((elm, index) => {
            return (
              <div key={index + "-elm"} className="flex items-stretch border-pastel-pink border-t text-gray-500 text-md w-full">
                {headers.map((option, index) => {
                  return (
                    <ItemTable key={elm.id + "list-pink" + index} className={option.className}>
                      {render(option.value, elm)}
                    </ItemTable>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TablePink;
