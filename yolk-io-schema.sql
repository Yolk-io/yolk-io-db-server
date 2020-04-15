CREATE TABLE "users" (
  "id" SERIAL PRIMARY KEY,
  "username" varchar UNIQUE,
  "is_super_host" boolean,
  "profile_image_url" varchar(200)
);

CREATE TYPE place_type AS ENUM ('Entire Place', 'Hotel Room', 'Private Room', 'Shared Room');
CREATE TYPE city AS ENUM ('Baltimore', 'Seattle', 'New York', 'Boston', 'Portland', 'Los Angeles', 'San Francisco', 'Houston', 'Philadelphia', 'Charleston');

CREATE TABLE "rooms" (
  "id" SERIAL PRIMARY KEY,
  "host_id" int,
  "room_name" varchar NOT NULL,
  "description" varchar(999),
  "type_of_place" place_type,
  "city" city
);

CREATE TABLE "images" (
  "id" SERIAL PRIMARY KEY,
  "room_id" int,
  "url" varchar(200),
  "comment" varchar(1000),
  "yolk_verified" bool
);

CREATE TYPE rating AS ENUM (1, 2, 3, 4, 5);

CREATE TABLE "room_reviews" (
  "id" SERIAL PRIMARY KEY,
  "room_id" int,
  "guest_id" int,
  "rating" rating NOT NULL,
  "comment" varchar(1000) NOT NULL,
  "host_reply" varchar(1000)
);

CREATE TABLE "reservations" (
  "id" SERIAL PRIMARY KEY,
  "room_id" int,
  "guest_id" int,
  "start_date" date,
  "duration" int NOT NULL,
  "adults" int NOT NULL,
  "children" int,
  "infants" int
);

CREATE TABLE "rental_dates" (
  "room_id" int,
  "date" date,
  "is_rented" bool,
  "check_in" bool,
  "check_out" bool,
  "price" int NOT NULL
);

CREATE TABLE "reservation_rules" (
  "room_id" int PRIMARY KEY,
  "guest_limit" int,
  "base_price" int NOT NULL
);

ALTER TABLE "rooms" ADD FOREIGN KEY ("host_id") REFERENCES "users" ("id");

ALTER TABLE "images" ADD FOREIGN KEY ("room_id") REFERENCES "rooms" ("id");

ALTER TABLE "room_reviews" ADD FOREIGN KEY ("room_id") REFERENCES "rooms" ("id");

ALTER TABLE "room_reviews" ADD FOREIGN KEY ("guest_id") REFERENCES "users" ("id");

ALTER TABLE "reservations" ADD FOREIGN KEY ("room_id") REFERENCES "rooms" ("id");

ALTER TABLE "reservations" ADD FOREIGN KEY ("guest_id") REFERENCES "users" ("id");

ALTER TABLE "rental_dates" ADD FOREIGN KEY ("room_id") REFERENCES "rooms" ("id");

ALTER TABLE "reservation_rules" ADD FOREIGN KEY ("room_id") REFERENCES "rooms" ("id");
