import useSWR from "swr";

const useImage = (name) => {
  const { data, isLoading } = useSWR("/items/collection_image?filter[name][_eq]=" + name + "&fields=*,images.*");
  const listImage = data?.data[0]?.images || [];
  const getRandImage = () => {
    return listImage[Math.floor(Math.random() * listImage.length)]?.directus_files_id;
  };
  return { data: listImage, isLoading, getRandImage };
};
export default useImage;
