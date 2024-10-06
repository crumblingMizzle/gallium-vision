export interface StopInfoPartial {
    location: number;
    name: string;
};

export interface StopInfo {
    transit_id: string;
    name: string;
    location: number;
    children: StopInfoPartial[];
};
