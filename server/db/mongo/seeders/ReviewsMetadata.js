module.exports = [
  {
    product_id: 1,
    ratings: {
      4: 1,
      5: 1
    },
    recommended: {
      true: 1,
      false: 1
    },
    characteristics: [
      {
        characteristic_id: 1,
        name: "Fit"
      },
      {
        characteristic_id: 2,
        name: "Length",
        ratings: {
          1: 1,
          4: 1,
        }
      },
      {
        characteristic_id: 3,
        name: "Comfort",
        ratings: {
          5: 1
        }
      },
      {
        characteristic_id: 4,
        name: "Quality"
      }
    ]
  },
  {
    product_id: 2,
    ratings: {
      2: 1,
      3: 1,
      4: 2
    },
    recommended: {
      true: 3,
      false: 2
    },
    characteristics: [
      {
        characteristic_id: 5,
        name: "Quality",
        ratings: {
          2: 2,
          3: 3,
        }
      }
    ]
  },
  {
    product_id: 3,
    characteristics: [
      {
        characteristic_id: 6,
        name: "Fit"
      },
      {
        characteristic_id: 7,
        name: "Length"
      },
      {
        characteristic_id: 8,
        name: "Comfort"
      },
      {
        characteristic_id: 9,
        name: "Quality"
      }
    ]
  },
  {
    product_id: 4,
    ratings: {
      2: 1,
      4: 1,
      5: 1
    },
    recommended: {
      true: 2,
      false: 1
    },
    characteristics: [
      {
        characteristic_id: 10,
        name: "Fit",
        ratings: {
          5: 2
        }
      },
      {
        characteristic_id: 11,
        name: "Length",
        ratings: {
          1: 1,
          2: 1,
          3: 1,
        }
      },
      {
        characteristic_id: 12,
        name: "Comfort",
        ratings: {
          2: 1,
          3: 1,
        }
      },
      {
        characteristic_id: 13,
        name: "Quality",
        ratings: {
          1: 2,
          2: 1,
        }
      }
    ]
  }
];