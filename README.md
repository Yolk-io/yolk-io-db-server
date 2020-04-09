# yolk-io-db-server
Server for Yolk.io's Bed and Breakfast services

# **Users**
User Object:

```json
{
  "id": 1234,
  "username": "Betty Buenaventura",
  "is_super_host": true,
  "profile_image_url": "https://i.imgur.com/Wpmmhzq.png"
}
```

Intention | Request Type | Request URL | Sample Request Body | Sample Resonse Body | Responese codes
------------ | ------------ | ------------ | ------------ | ------------ | --- 
Create a new User | POST | /api/users | `{User Object}` (no id) | NA | 201/400
Get information on a user | GET | /api/users/:user_id | NA | `{User Object}`| 200/400
Get all rooms hosted by a user | GET | api/users/:user_id/rooms | NA | `[{Room Object}, {Room Object}...]` | 200/400
Get all reviews by a user | GET | api/users/:user_id/reviews | NA | `[{Review Object}, {Review Object}...]`| 200/400
Update username | PATCH | api/users/:user_id | `{op: "replace", path: "username", value: "Maria Smith"}` | `{User Object}` | 200/400
Update profile image url | PATCH | api/users/:user_id | `{op: "replace", path: "profile_image_url", value: "http://imgur.com/ccccc.jpg"}` | `{User Object}` | 200/400
Delete a user | DELETE | api/users/:user_id | NA | NA | 200/403

# **Rooms**
Room Object:
```json
{
  "id": 3,
  "host_id": 44, 
  "home_name": "Buenacasa", 
  "description": "Take a trip to the lovely seaside. This abode offers...etc",
  "type_of_place": "Entire Place", 
  "city": "Los Angeles"
}
```
Related API Routes

Intention | Request Type | Request URL | Sample Request Body | Sample Resonse Body | Responese codes
------------ | ------------ | ------------ | ------------ | ------------ | --- 
Get information on a room | GET | /api/rooms/:room_id | NA | `{Room Object}` | 200
Create a listing for a new room | POST | api/rooms/| `{Room Object}` (no id) | NA | 201/400
Update a listing's description | PATCH | api/rooms/:room_id | `{"op": "replace", "path": "/description", "value": "Recently Renovated!"}` | NA | 202/400
Delete a listing | DELETE | api/rooms/:room_id | NA | NA | 200/403





# **Images**
Image Object:

```json
{
  "id": 1,  
  "room_id": 1,  
  "url": "http://i.imgur.co/aaaaaaa.jpg",
  "comment": "Lovely morning views out the East facing bay window",
  "yolk_verified": true
}
```

Related API Routes

Intention | Request Type | Request URL | Sample Request Body | Sample Resonse Body | Response Codes
------------ | ------------ | ------------ | ------------ | ------------ | -----
Get all image information for a specific room | GET | /api/rooms/:room_id/images/ | NA | `{images: [ {image1...}, {image2...}, ... ]}` | 200/404
Get image information for a specific image | GET | /api/images/:image_id/ | NA | ```{"id": 1, ...}``` | 200/404
Add a new image to a room | POST | /api/rooms/:room_id/images | `{url: "http://i.imgur.co/bbbbbb.jpg", comment: "Enjoy brunch on the patio" }` | NA | 201/400/403
Update image information | PATCH | /api/images/:image_id | `[{"op": "replace", "path": "/comment", "value": "Enjoy an early brunch on the patio"}]` | NA | 202/400/403
Delete an image | DELETE | /api/images/:image_id | NA | NA | 200/403




# **Room Reviews**
Review Object:

```json 
{
  "id": 3000,
  "room_id": 90210,
  "guest_id": 49,
  "rating" : 4,
  "comment": "There was sand in the kitchen when I arrived, but otherwise it was charming!",
  "host_reply": null
}
```

Related API Routes

Intention | Request Type | Request URL | Sample Request Body | Sample Resonse Body | Responese codes
------------ | ------------ | ------------ | ------------ | ------------ | --- 
Get all reviews for a room | GET | /api/rooms/:room_id/reviews | NA | `[{Review Object}, {Review object}, ...]` | 200/400
Post a new review for a room | POST | /api/rooms/:room_id/reviews | `{Review Object}` (no id) | NA | 201/400
Update a review comment | PUT | /api/reviews/:review_id | `{Review Object}` | NA | 200/400
Respond to a guest review | PATCH | /api/reviews/:review_id | `[{"op": "replace", "path": "/reply", "value": "I will notify our cleaning crew immediately!"}]` | NA | 200/400
Delete a review for a room | DELETE | /api/reviews/:review_id | NA | NA |204/403


# **Reservations**
Reservation Object:

```json
{
  "id": 2969413,
  "room_id": 3,
  "guest_id": 49,
  "start_date": "2020-07-04",
  "duration": 3,
  "adults": 4,
  "children": 2,
  "infants": 1
}
```

Related API Routes

Intention | Request Type | Request URL | Sample Request Body | Sample Resonse Body | Responese codes
------------ | ------------ | ------------ | ------------ | ------------ | --- 
Get all upcoming reservation information | GET | /api/rooms/:room_id/reservations/ | NA | `{"Reservations: [{Reservation Object}, {Reservation Object}, ...]}` | 200/403
Get information about a specific reservation | GET |/api/reservations/:reservation_id | NA | `{Reservation Object}` | 200/403
Create a reservation | POST | /api/rooms/:room_id/reservations/ | `{Reservation Object}` (no id) | NA | 201/400
Cancel a reservation | DELETE | /api/reservations/:reservtion_id | NA | NA | 204/403

*Only yolk.io admin and users authenticated as a host or guest tied to the reservation will be able to see or modify reservation information*


# **Reservation Rules**
Reservation Rules Object:

```json
{
  "room_id": 2969413,
  "guest_limit": 6,
  "base_price": 110
}
```

Intention | Request Type | Request URL | Sample Request Body | Sample Resonse Body | Responese codes
------------ | ------------ | ------------ | ------------ | ------------ | --- 
Get reservations rules for a room | GET | /api/rooms/:room_id/rules | NA | `{Rules Object}` | 200/400
Update reservation rules for a room | PATCH | /api/rooms/:room_id/rules | `[{"op": "replace", "path": "/base_price", "value": 125}]` | NA | 200/403


# **Rental Dates**

Rental dates represent days that a room is available to host guests. Adding available dates gives you more opportunities to host. Rental dates can be customized to set special pricing, and to prevent guests from booking reservations which start or end on specific days.

Rental Date Object:

```json
{
  "room_id": 2969413,
  "date": "2021-07-04",
  "is_rented": true,
  "check_in": true,
  "check_out": true,
  "price": 145
}
```

Intention | Request Type | Request URL | Sample Request Body | Sample Resonse Body | Responese codes
------------ | ------------ | ------------ | ------------ | ------------ | --- 
Get rental date information for the next 93 days | GET | /api/rooms/:room_id/dates/ | NA | `{"Dates": [{Rental Date Object}, {Rental Date Object}, ...]}` | 200/400
Add an available rental date | POST | /api/rooms/:room_id/dates | `{date: '2021-07-04', price: 125}` | NA | 201/403
Add a range of available rental dates | POST | /api/rooms/:room_id/dates | `{startDate: '2021-07-05', endDate: '2021-07-11', price: 130}` | NA | 201/403
Edit a date or range of dates for rental | PATCH | /api/rooms/:room_id/dates/ | `[{"op": "replace", "path": "/2021-07-09/price", "value": 120}, {"op": "replace", "path": "/2021-07-09/check_in", "value": false}, {"op": "replace", "path": "/2021-07-10/price", "value": 120}]` | NA | 200/403
Remove a rental date | DELETE | /api/rooms/:room_id/dates/:date | NA | NA | 204/403


*check_in and check_out will default to true, and price will default to the base price for the room, unless otherwise specified*

*Deleting a rental date will cancel any reservation currently booking that date*
