// {"id":"9","product_id":"3","name":"Quality"}
// For each item

//    Add to Products table (if not exists)
//      product_id = product_id
//    get id

//    Add associated ReviewMetadata table entry
//      product_id = Products.id
//    get id

//    Add to Characteristics table:
//      characteristic_id = id
//      name = name
//      review_metadata_id = ReviewMetadata.review_metadata_id