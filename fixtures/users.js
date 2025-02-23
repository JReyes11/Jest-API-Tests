class userFixtures {
  userIdAndEmail() {
    return [
      {
        id: "x76enmkj236",
        email: "batman21@batcave.net",
      },
      {
        id: "Sydn150",
        email: "Sydney150@interface.com",
      },
      {
        id: "n9s7nben6",
        email: "nolan512@classic.com",
      },
    ];
  }
  userKeys() {
    return {
      id: "",
      email: "",
      firstName: "",
      lastName: "",
      full_name: "",
      address1: "",
      address2: "",
      city: "",
      state: "",
      zipCode: "",
      phoneNumber: "",
      alternative_phone: "",
      company: "",
      country: "",
    };
  }
}

export default new userFixtures();
