import { getLang } from "./settings";
import { OFF_API_URL, OFF_IMAGE_URL, OFF_SEARCH } from "./const";
import axios from "axios";
import combineURLs from "axios/lib/helpers/combineURLs";

export default {
  getCookie(name) {
    const cookies = document.cookie
      .split(";")
      .filter((item) => item.trim().startsWith(`${name}=`));
    if (cookies.length) {
      const cookie = cookies[0];
      return cookie.split("=", 2)[1];
    }
    return "";
  },

  getUsername() {
    const sessionCookie = this.getCookie("session");

    if (!sessionCookie.length) {
      return "";
    }

    let isNext = false;
    let username = "";
    sessionCookie.split("&").forEach((el) => {
      if (el === "user_id") {
        isNext = true;
      } else if (isNext) {
        username = el;
        isNext = false;
      }
    });
    return username;
  },

  getProduct(barcode) {
    return axios.get(
      `${OFF_API_URL}/product/${barcode}.json?fields=product_name,brands,ingredients_text,countries_tags,images`
    );
  },

  getProductUrl(barcode) {
    const lang = getLang();
    return `https://world${
      lang === "en" ? "" : "-" + lang
    }.openfoodfacts.org/product/${barcode}`;
  },

  getProductEditUrl(barcode) {
    const lang = getLang();
    return `https://world${
      lang === "en" ? "" : "-" + lang
    }.openfoodfacts.org/cgi/product.pl?type=edit&code=${barcode}`;
  },

  getImageUrl(imagePath) {
    return combineURLs(OFF_IMAGE_URL, imagePath);
  },

  getTableExtractionAI({ img, x0, y0, x1, y1 }) {
    return `https://off-nutri-test.azurewebsites.net/api/get-nutri-table?name=${img}%7C(${x0},${y0},${x1},${y1})`;
  },

  // getNutritionToFillUrl(pageNumber, country) {
  //   return `${OFF_URL}/state/photos-validated/state/nutrition-facts-to-be-completed/${pageNumber}.json?fields=code,lang,image_nutrition_url,product_name,nutriments,images`;
  // },
  getNutritionToFillUrl(pageNumber, country, creator) {
    //
    return `${OFF_SEARCH}?json=true&fields=code,states,lang,image_nutrition_url,product_name,nutriments,images,creator,countries&action=process&sort_by=last_modified_t&tagtype_0=states&tag_contains_0=contains&tag_0=photos-validated&tagtype_1=states&tag_contains_1=contains&tag_1=nutrition-facts-to-be-completed${
      country
        ? `&tagtype_2=countries&tag_contains_2=contains&tag_2=${country}`
        : ""
    }${
      creator
        ? `&tagtype_${country ? 3 : 2}=creator&tag_contains_${
            country ? 3 : 2
          }=contains&tag_${country ? 3 : 2}=${creator}`
        : ""
    }`;
  },
};
