import axios from "axios";

export const testServer = async () => {
  try {
    const response = await fetch("http://localhost:5142/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching data:", error);
    return { error: "Error fetching data" };
  }
};

export const multiplyBySeven = async (
  num: number,
): Promise<{ input?: number; result?: number; error?: string }> => {
  try {
    const response = await fetch(
      `http://localhost:5142/multiply_by_seven?num=${num}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching data:", error);
    return { error: "Error fetching data" };
  }
};

export const predict_num = async (file: File): Promise<string | undefined> => {
  try {
    const formData = new FormData();
    formData.append("image", file);

    const response = await axios.post(
      "http://localhost:5142/pred_numeric",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );

    return response.data.pred;
  } catch (error) {
    console.error("Error uploading image:", error);
    return undefined;
  }
};

export const predict_fash = async (file: File): Promise<string | undefined> => {
  try {
    const formData = new FormData();
    formData.append("image", file);

    const response = await axios.post(
      "http://localhost:5142/pred_fashion",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );

    return response.data.pred;
  } catch (error) {
    console.error("Error uploading image:", error);
    return undefined;
  }
};
