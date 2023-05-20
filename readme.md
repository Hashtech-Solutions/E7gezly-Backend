## Admin

- GET /admin/shop - get all shops
- GET /admin/shop/:id - get shop by id
- POST /admin/shop - create shop (body: {name: string, userName: string, password: string, location?: {lat: number, lng: number}})
- PUT /admin/shop/:id - update shop (body: {name?: string, location?: {lat: number, lng: number}})
- DELETE /admin/shop/:id - delete shop

## Shop Moderator

- Header: shop_id
- GET /moderator/shop - get shop
- PUT /moderator/update_info - update shop info ()
  - body: {name?: string, location?: {lat: number, lng: number}, baseHourlyRate?: number, availableServices?: string[], availableGames?: {name: string, image: string}[]}
- PUT /moderator/toggle_status - toggle shop status (body: {})
- POST /moderator/add_room - add room
  - body: {name: string, availableActivities?: string[], hourlyRate?: number}
- PUT /moderator/update_room/:room_id - update room (body: {name?: string, availableActivities?: string[], hourlyRate?: number})
- PUT /moderator/check_in - check in (body: {roomId: string})
- PUT /moderator/check_out - check out (body: {roomId: string})

## Customer

- GET /customer/shop?optionalQuery=value - get all shops
- POST /customer/shop/:shop_id/book_room - book room (body: {room_id: string, startTime: string, endTime: string})
