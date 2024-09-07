import { createImage } from "@/lib/helper";

const UserProfile = ({ profile, index = 0, width = 400 }) => {
  const fullname = profile.first_name + " " + profile.last_name + '';
  const viewFullname = fullname.length > 20 ? fullname.slice(0, 20) + "..." : fullname;
  return (
    <div className="border flex items-center gap-1 border-dashed w-fit border-gray-300 pl-1 pr-2 py-1 rounded-full hover:border-pastel-pink cursor-pointer">
      <div className="w-6 h-6 rounded-full bg-pastel-pink/5">
        <img className="w-6 h-6 rounded-full" src={createImage(profile.avatar, width)} />
      </div>
      <span className="text-sm text-gray-700"> {viewFullname}</span>
    </div>
  );
};

export default UserProfile;
