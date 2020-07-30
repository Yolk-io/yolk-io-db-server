use super::data_types::*;

fn generate_user(id: u32) -> User {
    User {
        id,
        username: String::from("Steve"),
        is_super_host: (id % 2) != 0,
        profile_image: String::from("nyancat.com")
    }
}

