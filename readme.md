## Admin

- GET /admin/shop - get all shops
- GET /admin/shop/:id - get shop by id
- POST /admin/shop - create shop (body: {name: string, userName: string, password: string, location?: {lat: number, lng: number}})
- PUT /admin/shop/:id - update shop (body: {name?: string, location?: {lat: number, lng: number}})
- DELETE /admin/shop/:id - delete shop

## Shop_Admin

- Header: shop_id
- PUT /shop_admin/update_info - update shop info ()
  - body: {name?: string, location?: {lat: number, lng: number}, baseHourlyRate?: number, availableServices?: string[], availableGames?: {name: string, image: string}[]}
- POST /shop_admin/add_room - add room
  - body: {name: string, availableActivities?: string[], hourlyRate?: number}
- POST /shop_admin/moderator - add moderator
  - body: {userName: string, password: string}
- DELETE /shop_admin/moderator/:shop_moderator_id - delete moderator

## Shop_Moderator

- Header: shop_id
- GET /shop_moderator/shop_info - get shop
- PUT /shop_moderator/toggle_status - toggle shop status (body: {})
- PUT /shop_moderator/update_room/:room_id - update room (body: {name?: string, availableActivities?: string[], hourlyRate?: number})
- PUT /shop_moderator/check_in - check in (body: {roomId: string})
- PUT /shop_moderator/check_out - check out (body: {roomId: string})

## Customer

- GET /customer/shop?optionalQuery=value - get all shops
- GET /customer/shop/:id - get shop by id
- POST /customer/shop/:shop_id/book_room - book room (body: {room_id: string, startTime: string, endTime: string})
- GET /customer/shop/reservation - get all reservations
