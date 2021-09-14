// {
  // "id":"1",
  //# "product_id":"1",
  // "rating":"5",
  // "date":"1596080481467",
  // "summary":"This product was great!",
  // "body":"I rething at all.",
  // "recommend":"true",
  // "reported":"false",
  //# "reviewer_name":"funtime",
  //# "reviewer_email":"first.last@gmail.com",
  // "response":"null",
  // "helpfulness":"8"
  // "photos": [] },
  // "characteristics: []"

// For each item

//    Add to Profiles table:
//      username = reviewer_name
//      email = reviewer_email
//      createdAt = new Date()
//      createdAt = new Date()
//    get id

//    Products table
//      get id from product_id = product_id
//      If not present:
//        Add to Products table
//          product_id = product_id
//        get id
//        Add associated ReviewMetadata table entry
//          product_id = Products.id

//    Add to Reviews table in a way to trigger update of ReviewMetadata
//      review_id = id
//      product_id = Products.id
//      profile_id = Profile.id
//      createdAt = new Date(date)
//      updatedAt = new Date()
//      ... all other properties: field = property

//    For each photo in photos:

//    For each characteristic in characteristics: