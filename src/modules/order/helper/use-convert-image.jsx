import { useState } from "react";
import Tesseract from "tesseract.js";
import { v4 as uuidv4 } from "uuid";
import useImage from "./use-image";
import useMenuToday from "@/hooks/use-menu";

const useConvertImage = () => {
  const { provider } = useMenuToday();
  const [loading, setLoading] = useState();
  const { getRandImage } = useImage("avatar");
  const [data, setData] = useState();
  const handleFileChange = async (event) => {
    setLoading(true);
    const file = event.target.files[0];
    if (file) {
      const newFormData = new FormData();
      newFormData.append("file", file);

      const reader = new FileReader();
      reader.onloadend = () => {
        recognizeText(reader.result);
      };
      setLoading(true);
      reader.readAsDataURL(file);
    }
  };

  const recognizeText = (imageBase64) => {
    Tesseract.recognize(
      imageBase64,
      "vie+eng", // Chỉ định mã ngôn ngữ là 'vie+eng' cho tiếng Việt và tiếng Anh
    )
      .then(({ data: { text } }) => {
    

        const list = text.split("\n").filter((item) => item.trim() !== "" && item.indexOf("trưa nay có") === -1);

        const data = list.map((item) => {
          const name = item.trim();
          const obj = { name: name, uuid: uuidv4(), image: getRandImage() };
          obj.dish_price = provider.dish_price;
          obj.side_dish_price = provider.side_dish_price;
          return obj;
        });

        setData(data);
        setLoading(false);
      })
      .catch((error) => {
        console.log("Error: ", error);
        console.error(error);
      });
  };

  const processText = async (text) => {
    const startIndex = text.toLowerCase().indexOf("có");
    if (startIndex !== -1) {
      text = text.substring(startIndex + 2);
    }
    const arr = generateText(text);
    const data = arr.map((item) => {
      const name = item.split(" ").splice(1).join(" ");
      const obj = { name: name, uuid: uuidv4(), image: getRandImage() };
      obj.dish_price = provider.dish_price;
      obj.side_dish_price = provider.side_dish_price;
      return obj;
    });
    setLoading(false);
    setData(data);
  };
  const generateText = (text) => {
    text = text.replaceAll("#", "");
    text = text.replaceAll("14", "4");
    text = text.replaceAll(",", ".");
    text = text.replaceAll("CƠM CHAY", "(CƠM CHAY) - ");
    text = text.replaceAll("Cơm chay", "(CƠM CHAY) - ");
    text = text.replaceAll("cơm chay", "(CƠM CHAY) - ");

    let lines = text.split("\n");
    let arr = [];
    let currentMeal = "";
    let filteredArr = lines.filter((item) => item !== "" && item !== "." && !/^\d+$/.test(item));
    for (let line of filteredArr) {
      if (/^\d+[.,]?\s*(.*)$/.test(line.trim())) {
        if (currentMeal !== "") {
          arr.push(currentMeal.trim());
        }
        currentMeal = line.trim();
      } else {
        currentMeal += " " + line.trim();
      }
    }

    if (currentMeal !== "") {
      arr.push(currentMeal.trim());
    }
    return arr;
  };
  return { isLoading: loading, handleFileChange, listFood: data };
};

export default useConvertImage;
