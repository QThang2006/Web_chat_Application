export interface Message {
  id?: string;
  user: string;
  room?: string;
  text: string;
  time: string;
  ipAddress?: string;
}

export interface RoomInfo {
  id: string;
  name: string;
  desc: string;
}
