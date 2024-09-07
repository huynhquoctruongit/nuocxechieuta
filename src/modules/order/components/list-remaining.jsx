import { useUserInCompany } from "@/hooks/use-company";
import { enumFood } from "@/lib/utils";

const ListRemaining = ({ userNonOrderd }) => {
  const { users } = useUserInCompany();
  return (
    <div className="w-full flex flex-wrap gap-4 mt-10">
      {users.map((el, index) => {
        return (
          <div
            className="border flex items-center gap-1 border-dashed border-gray-300 pl-1 pr-2 py-1 rounded-full hover:border-pastel-pink cursor-pointer"
            key={el.id + el.fullname + index}
          >
            <div className="w-6 h-6 rounded-full bg-pastel-pink/5">
              <img className="w-6 h-6 rounded-full" src={enumFood[index % enumFood.length]} />
            </div>
            <span className="text-sm text-gray-700"> {el.first_name + " " + el.last_name}</span>
          </div>
        );
      })}
    </div>
  );
};

export default ListRemaining;
