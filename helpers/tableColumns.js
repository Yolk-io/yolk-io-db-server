// configure columns for csv-stringify

module.exports.userColumns = {
  columns: [
    {key: 'id'},
    {key: 'username'},
    {key: 'is_super_host'},
    {key: 'profile_image_url'}
  ]    
};

module.exports.roomColumns = {
  columns: [
    {key: 'id'},
    {key: 'host_id'},
    {key: 'room_name'},
    {key: 'description'},
    {key: 'type_of_place'},
    {key: 'city'},
  ]    
};

module.exports.imageColumns = {
  columns: [
    {key: 'id'},
    {key: 'room_id'},
    {key: 'url'},
    {key: 'comment'},
    {key: 'yolk_verified'}
  ]    
};

module.exports.reservationRulesColumns = {
  columns: [
    {key: 'room_id'},
    {key: 'guest_limit'},
    {key: 'base_price'}
  ]    
};

module.exports.dateColumns = {
  columns: [
    {key: 'room_id'},
    {key: 'date'},
    {key: 'is_rented'},
    {key: 'check_in'},
    {key: 'check_out'},
    {key: 'price'}
  ]    
};

module.exports.reviewColumns = {
  columns: [
    {key: 'id'},
    {key: 'room_id'},
    {key: 'guest_id'},
    {key: 'rating'},
    {key: 'comment'},
    {key: 'host_reply'}
  ]    
};