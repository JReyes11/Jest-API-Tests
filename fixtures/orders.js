export const products = async function () {
  return {
    items: [
      {
        productName: "Tires",
        productId: "t120",
        price: 120,
      },
      {
        productName: "Wiper Blades",
        productId: "wb25",
        price: 25,
      },
      {
        productName: "Airbags",
        productId: "ab325",
        price: 325,
      },
      {
        productName: "Air Freshner",
        productId: "af2",
        price: 2,
      },
      {
        productName: "Seat Cover",
        productId: "sc44",
        price: 44,
      },
      {
        productName: "Front Left light",
        productId: "fll235",
        price: 235,
      },
      {
        productName: "Front Right light",
        productId: "frl235",
        price: 235,
      },
      {
        productName: "Tail Pipe",
        productId: "tp90",
        price: 90,
      },
      {
        productName: "Steering Wheel",
        productId: "sw415",
        price: 415,
      },
      {
        productName: "Window Motor",
        productId: "wm300",
        price: 300,
      },
      {
        productName: "Seat Belt",
        productId: "sb100",
        price: 100,
      }
    ],
  };
};

export const orderObject = async function () {
  return {
    id: "",
    firstName: "",
    lastName: "",
    full_name: "",
    address1: "",
    address2: null,
    city: "Austin",
    state: "Texas",
    zipCode: "78701",
    phoneNumber: "",
    email: "",
    productName: "",
    productId: "",
    quantity: 0,
  };
};
