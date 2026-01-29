// Server Type (API 응답)
export interface GroupResponse {
  teamId: string;
  updatedAt: string;
  createdAt: string;
  image: string;
  name: string;
  id: number;
}

// UI Type (화면에서 사용)
export interface Group {
  id: number;
  name: string;
  image: string;
}
