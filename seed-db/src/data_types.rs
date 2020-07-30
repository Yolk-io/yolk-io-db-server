pub struct User {
    pub id: u32,
    pub username: String,
    pub is_super_host: bool,
    pub profile_image: String
}

pub enum City {
    Baltimore, 
    Seattle, 
    NewYork,
    Boston,
    Portland,
    LosAngeles,
    SanFrancisco,
    Houston,
    Philadelphia,
    Charleston
}

pub enum PlaceType {
    EntirePlace,
    HotelRoom,
    PrivateRoom,
    SharedRoom
}

pub struct Room {
    id: u32,
    host_id: u32,
    room_name: String,
    description: Option<String>,
    type_of_place: PlaceType,
    city: City
}